package org.example.spooneyes.litchii.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MailboxCreatedResponse {
    private String token;
    private String link;
    private String shortCode;
}