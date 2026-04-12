package org.example.spooneyes.litchii.storage;

import jakarta.annotation.PostConstruct;
import org.example.spooneyes.litchii.exception.InvalidFileException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.UUID;

@Service
public class LocalStorageService implements StorageService {

    private static final long MAX_FILE_SIZE = 5L * 1024 * 1024; // 5 MB

    private static final Map<String, String> ALLOWED_FORMATS = Map.of(
            "image/jpeg", "jpg",
            "image/png", "png"
    );

    @Value("${app.storage.path}")
    private String storagePath;

    private Path rootLocation;

    @PostConstruct
    public void init() {
        rootLocation = Path.of(storagePath).toAbsolutePath().normalize();
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not create storage directory", e);
        }
    }

    @Override
    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new InvalidFileException("File is empty");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new InvalidFileException("File exceeds 5MB limit");
        }

        byte[] bytes;
        try {
            bytes = file.getBytes();
        } catch (IOException e) {
            throw new InvalidFileException("Unable to read uploaded file");
        }

        String detectedMime = detectMimeFromMagic(bytes);
        if (detectedMime == null) {
            throw new InvalidFileException("Unsupported file type");
        }

        String declaredMime = file.getContentType();
        if (declaredMime != null && !detectedMime.equals(declaredMime)) {
            throw new InvalidFileException("Declared content type does not match file content");
        }

        String formatName = ALLOWED_FORMATS.get(detectedMime);
        BufferedImage image;
        try {
            image = ImageIO.read(new ByteArrayInputStream(bytes));
        } catch (IOException e) {
            throw new InvalidFileException("Invalid image data");
        }
        if (image == null) {
            throw new InvalidFileException("Invalid image data");
        }

        String filename = UUID.randomUUID() + "." + formatName;
        Path target = rootLocation.resolve(filename).normalize();
        if (!target.startsWith(rootLocation)) {
            throw new InvalidFileException("Invalid target path");
        }

        try {
            if (!ImageIO.write(image, formatName, target.toFile())) {
                throw new InvalidFileException("Unable to encode image");
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
        return filename;
    }

    @Override
    public InputStream load(String filename) {
        Path target = rootLocation.resolve(filename).normalize();
        if (!target.startsWith(rootLocation)) {
            throw new InvalidFileException("Invalid file path");
        }
        try {
            return Files.newInputStream(target);
        } catch (IOException e) {
            throw new RuntimeException("File not found: " + filename, e);
        }
    }

    @Override
    public void delete(String filename) {
        Path target = rootLocation.resolve(filename).normalize();
        if (!target.startsWith(rootLocation)) {
            return;
        }
        try {
            Files.deleteIfExists(target);
        } catch (IOException e) {
            // log but don't crash
        }
    }

    private String detectMimeFromMagic(byte[] bytes) {
        if (bytes.length >= 3
                && (bytes[0] & 0xFF) == 0xFF
                && (bytes[1] & 0xFF) == 0xD8
                && (bytes[2] & 0xFF) == 0xFF) {
            return "image/jpeg";
        }
        if (bytes.length >= 8
                && (bytes[0] & 0xFF) == 0x89
                && bytes[1] == 0x50
                && bytes[2] == 0x4E
                && bytes[3] == 0x47
                && bytes[4] == 0x0D
                && bytes[5] == 0x0A
                && bytes[6] == 0x1A
                && bytes[7] == 0x0A) {
            return "image/png";
        }
        return null;
    }
}
