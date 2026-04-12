package org.example.spooneyes.litchii.scheduler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.spooneyes.litchii.entity.Mailbox;
import org.example.spooneyes.litchii.entity.Message;
import org.example.spooneyes.litchii.repository.MailboxRepository;
import org.example.spooneyes.litchii.storage.StorageService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class PurgeScheduler {

    private final MailboxRepository mailboxRepository;
    private final StorageService storageService;

    @Scheduled(fixedRate = 3600000) // toutes les heures
    @Transactional
    public void purgeExpiredMailboxes() {
        List<Mailbox> expired = mailboxRepository.findByExpiresAtBefore(Instant.now());

        for (Mailbox mailbox : expired) {
            for (Message message : mailbox.getMessages()) {
                if (message.getImageFilename() != null) {
                    storageService.delete(message.getImageFilename());
                }
            }
            mailboxRepository.delete(mailbox);
            log.info("Purged expired mailbox: {}", mailbox.getToken());
        }

        if (!expired.isEmpty()) {
            log.info("Purged {} expired mailbox(es)", expired.size());
        }
    }
}