package com.smarttask.backend.dto;

import com.smarttask.backend.entity.Task;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class TaskRequestDTO {
    // Not @NotBlank here — required check is done in service for create, optional for update
    private String title;

    private String description;

    private LocalDate dueDate;

    private Task.Status status;

    private Task.Priority priority;

    private Boolean isDaily;
}
