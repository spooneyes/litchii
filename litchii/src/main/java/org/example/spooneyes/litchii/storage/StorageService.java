package org.example.spooneyes.litchii.storage;

import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

public interface StorageService {

    String store(MultipartFile file);

    InputStream load(String filename);

    void delete(String filename);
}