package com.smarttask.backend.dto;

import com.smarttask.backend.entity.Task;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data
public class TaskResponseDTO {
    private UUID id;
    private String title;
    private String description;
    private Task.Status status;
    private Task.Priority priority;
    private LocalDate dueDate;
    private boolean isDaily;
    private Instant createdAt;
}
