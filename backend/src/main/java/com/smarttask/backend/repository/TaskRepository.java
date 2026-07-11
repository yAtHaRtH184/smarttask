package com.smarttask.backend.repository;

import com.smarttask.backend.entity.Task;
import com.smarttask.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID> {
    List<Task> findByUserId(UUID userId);

    Page<Task> findByUser(User user, Pageable pageable);

    Page<Task> findByUserAndStatus(User user, Task.Status status, Pageable pageable);

    @Modifying
    @Query("UPDATE Task t SET t.status = :status WHERE t.isDaily = true")
    void resetDailyTasks(@Param("status") Task.Status status);
}
