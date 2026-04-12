package org.example.spooneyes.litchii.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.spooneyes.litchii.dto.request.CreateMailboxRequest;
import org.example.spooneyes.litchii.dto.request.SendMessageRequest;
import org.example.spooneyes.litchii.dto.response.MailboxCreatedResponse;
import org.example.spooneyes.litchii.dto.response.MessageFullResponse;
import org.example.spooneyes.litchii.dto.response.MessagePreviewResponse;
import org.example.spooneyes.litchii.service.MailboxService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mailboxes")
@RequiredArgsConstructor
public class MailboxController {

    private final MailboxService mailboxService;

    @PostMapping
    public ResponseEntity<MailboxCreatedResponse> createMailbox(@Valid @RequestBody CreateMailboxRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(mailboxService.createMailbox(request));
    }

    @PostMapping("/{token}/verify")
    public ResponseEntity<Void> verifyPin(@PathVariable String token,
                                          @RequestHeader("X-Pin") String pin) {
        mailboxService.verifyPin(token, pin);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{token}/messages")
    public ResponseEntity<List<MessagePreviewResponse>> getMessages(@PathVariable String token,
                                                                    @RequestHeader("X-Pin") String pin) {
        return ResponseEntity.ok(mailboxService.getMessagePreviews(token, pin));
    }

    @GetMapping("/{token}/messages/{messageId}")
    public ResponseEntity<MessageFullResponse> readMessage(@PathVariable String token,
                                                           @PathVariable Long messageId,
                                                           @RequestHeader("X-Pin") String pin) {
        return ResponseEntity.ok(mailboxService.readMessage(token, pin, messageId));
    }

    @PostMapping(value = "/{token}/messages", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> sendMessage(@PathVariable String token,
                                            @RequestHeader("X-Pin") String pin,
                                            @Valid @RequestPart("message") SendMessageRequest request,
                                            @RequestPart(value = "image", required = false) MultipartFile image) {
        mailboxService.sendMessage(token, pin, request, image);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/short/{shortCode}")
    public ResponseEntity<Map<String, String>> resolveShortCode(@PathVariable String shortCode) {
        String token = mailboxService.resolveShortCode(shortCode);
        return ResponseEntity.ok(Map.of("token", token));
    }
}