package org.example.spooneyes.litchii.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SendMessageRequest {
    @NotBlank
    @Size(max=50)
    private String senderName;

    @NotBlank
    @Size(max = 5000)
    private String content;

}
