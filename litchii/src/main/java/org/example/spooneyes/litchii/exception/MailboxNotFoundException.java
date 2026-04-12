package org.example.spooneyes.litchii.exception;

public class MailboxNotFoundException extends RuntimeException {
    public MailboxNotFoundException() {
        super("Mailbox not found");
    }
}