package org.example.spooneyes.litchii.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateMailboxRequest {

    @NotBlank
    @Size(min = 4, max = 6, message = "PIN must be 4 to 6 digits")
    private String pin;
}