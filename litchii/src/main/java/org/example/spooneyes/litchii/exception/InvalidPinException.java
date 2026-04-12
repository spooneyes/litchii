package org.example.spooneyes.litchii.exception;

public class InvalidPinException extends RuntimeException {
    public InvalidPinException() {
        super("Invalid PIN");
    }
}