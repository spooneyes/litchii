package org.example.spooneyes.litchii.service;

import lombok.RequiredArgsConstructor;
import org.example.spooneyes.litchii.dto.request.CreateMailboxRequest;
import org.example.spooneyes.litchii.dto.request.SendMessageRequest;
import org.example.spooneyes.litchii.dto.response.MailboxCreatedResponse;
import org.example.spooneyes.litchii.dto.response.MessageFullResponse;
import org.example.spooneyes.litchii.dto.response.MessagePreviewResponse;
import org.example.spooneyes.litchii.entity.Mailbox;
import org.example.spooneyes.litchii.entity.Message;
import org.example.spooneyes.litchii.exception.InvalidPinException;
import org.example.spooneyes.litchii.exception.MailboxNotFoundException;
import org.example.spooneyes.litchii.repository.MailboxRepository;
import org.example.spooneyes.litchii.repository.MessageRepository;
import org.example.spooneyes.litchii.storage.StorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MailboxService {

    private final MailboxRepository mailboxRepository;
    private final MessageRepository messageRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final StorageService storageService;

    private static final String CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final SecureRandom RANDOM = new SecureRandom();

    @Value("${app.mailbox.ttl-days}")
    private int ttlDays;

    public MailboxCreatedResponse createMailbox(CreateMailboxRequest request) {
        String token = UUID.randomUUID().toString();
        String shortCode = generateShortCode();

        Mailbox mailbox = Mailbox.builder()
                .token(token)
                .shortCode(shortCode)
                .pinHash(passwordEncoder.encode(request.getPin()))
                .expiresAt(Instant.now().plus(ttlDays, ChronoUnit.DAYS))
                .build();

        mailboxRepository.save(mailbox);

        return MailboxCreatedResponse.builder()
                .token(token)
                .shortCode(shortCode)
                .link("/mailbox/" + token)
                .build();
    }

    public void verifyPin(String token, String pin) {
        Mailbox mailbox = findMailbox(token);
        if (!passwordEncoder.matches(pin, mailbox.getPinHash())) {
            throw new InvalidPinException();
        }
    }

    public String resolveShortCode(String shortCode) {
        return mailboxRepository.findByShortCode(shortCode)
                .orElseThrow(MailboxNotFoundException::new)
                .getToken();
    }

    public List<MessagePreviewResponse> getMessagePreviews(String token, String pin) {
        verifyPin(token, pin);
        Mailbox mailbox = findMailbox(token);

        return messageRepository.findByMailboxIdOrderByCreatedAtAsc(mailbox.getId())
                .stream()
                .map(msg -> MessagePreviewResponse.builder()
                        .id(msg.getId())
                        .senderName(msg.getSenderName())
                        .contentPreview(truncate(msg.getContent(), 100))
                        .hasImage(msg.getImageFilename() != null)
                        .createdAt(msg.getCreatedAt())
                        .build())
                .toList();
    }

    @Transactional
    public MessageFullResponse readMessage(String token, String pin, Long messageId) {
        verifyPin(token, pin);
        Mailbox mailbox = findMailbox(token);

        Message message = messageRepository.findById(messageId)
                .filter(msg -> msg.getMailbox().getId().equals(mailbox.getId()))
                .orElseThrow(() -> new RuntimeException("Message not found"));

        String imageBase64 = null;
        if (message.getImageFilename() != null) {
            try {
                byte[] imageBytes = storageService.load(message.getImageFilename()).readAllBytes();
                imageBase64 = Base64.getEncoder().encodeToString(imageBytes);
            } catch (Exception e) {
                // image not found, continue
            }
        }

        MessageFullResponse response = MessageFullResponse.builder()
                .id(message.getId())
                .senderName(message.getSenderName())
                .content(message.getContent())
                .imageBase64(imageBase64)
                .createdAt(message.getCreatedAt())
                .build();

        if (message.getImageFilename() != null) {
            storageService.delete(message.getImageFilename());
        }
        messageRepository.delete(message);

        return response;
    }

    public void sendMessage(String token, String pin, SendMessageRequest request, MultipartFile image) {
        verifyPin(token, pin);
        Mailbox mailbox = findMailbox(token);

        String imageFilename = null;
        if (image != null && !image.isEmpty()) {
            imageFilename = storageService.store(image);
        }

        Message message = Message.builder()
                .mailbox(mailbox)
                .senderName(request.getSenderName())
                .content(request.getContent())
                .imageFilename(imageFilename)
                .build();

        messageRepository.save(message);
    }

    private Mailbox findMailbox(String token) {
        return mailboxRepository.findByToken(token)
                .orElseThrow(MailboxNotFoundException::new);
    }

    private String truncate(String text, int maxLength) {
        if (text.length() <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    }


    private String generateShortCode() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 5; i++) {
            sb.append(CHARS.charAt(RANDOM.nextInt(CHARS.length())));
        }
        return sb.toString();
    }


}
