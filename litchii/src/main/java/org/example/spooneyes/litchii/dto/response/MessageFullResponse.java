package org.example.spooneyes.litchii.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class MessageFullResponse {
    private Long id;
    private String senderName;
    private String content;
    private String imageUrl;
    private Instant createdAt;
    private String imageBase64;
}