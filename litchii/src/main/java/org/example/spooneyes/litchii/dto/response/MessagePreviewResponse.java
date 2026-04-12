package org.example.spooneyes.litchii.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class MessagePreviewResponse {
    private Long id;
    private String senderName;
    private String contentPreview;
    private boolean hasImage;
    private Instant createdAt;
}