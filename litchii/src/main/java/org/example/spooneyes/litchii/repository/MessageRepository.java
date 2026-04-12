package org.example.spooneyes.litchii.repository;

import org.example.spooneyes.litchii.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByMailboxIdOrderByCreatedAtAsc(Long mailboxId);
}