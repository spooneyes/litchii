package org.example.spooneyes.litchii.repository;

import org.example.spooneyes.litchii.entity.Mailbox;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface MailboxRepository extends JpaRepository<Mailbox, Long> {

    Optional<Mailbox> findByToken(String token);

    List<Mailbox> findByExpiresAtBefore(Instant now);

    Optional<Mailbox> findByShortCode(String shortCode);
}