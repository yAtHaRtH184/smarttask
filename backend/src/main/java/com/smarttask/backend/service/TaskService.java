package com.smarttask.backend.service;

import com.smarttask.backend.repository.TaskRepository;
import com.smarttask.backend.dto.TaskRequestDTO;
import com.smarttask.backend.dto.TaskResponseDTO;
import com.smarttask.backend.entity.Task;
import com.smarttask.backend.entity.User;
import com.smarttask.backend.exception.TaskNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class TaskService {
    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public TaskResponseDTO createTask(User user, TaskRequestDTO dto) {
        if (dto.getTitle() == null || dto.getTitle().isBlank()) {
            throw new IllegalArgumentException("Title is required");
        }
        Task task = new Task();
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setDueDate(dto.getDueDate());
        task.setUser(user);
        task.setStatus(dto.getStatus() != null ? dto.getStatus() : Task.Status.TODO);
        task.setPriority(dto.getPriority() != null ? dto.getPriority() : Task.Priority.MEDIUM);
        task.setDaily(dto.getIsDaily() != null ? dto.getIsDaily() : false);
        return mapToDTO(taskRepository.save(task));
    }

    public TaskResponseDTO getTaskById(UUID id, User user) {
        Task task = findOwnedTask(id, user);
        return mapToDTO(task);
    }

    public Page<TaskResponseDTO> getMyTasks(User user, Task.Status status, Pageable pageable) {
        if (status != null) {
            return taskRepository.findByUserAndStatus(user, status, pageable).map(this::mapToDTO);
        }
        return taskRepository.findByUser(user, pageable).map(this::mapToDTO);
    }

    public TaskResponseDTO updateTask(UUID id, TaskRequestDTO dto, User user) {
        Task task = findOwnedTask(id, user);
        // Partial update — only change fields that were provided
        if (dto.getTitle() != null && !dto.getTitle().isBlank()) task.setTitle(dto.getTitle());
        if (dto.getDescription() != null) task.setDescription(dto.getDescription());
        if (dto.getStatus() != null) task.setStatus(dto.getStatus());
        if (dto.getPriority() != null) task.setPriority(dto.getPriority());
        if (dto.getDueDate() != null) task.setDueDate(dto.getDueDate());
        if (dto.getIsDaily() != null) task.setDaily(dto.getIsDaily());
        return mapToDTO(taskRepository.save(task));
    }

    public void deleteTask(UUID id, User user) {
        Task task = findOwnedTask(id, user);
        taskRepository.delete(task);
    }

    // ── helpers ─────────────────────────────────────────────────────────────

    /**
     * Fetches a task and verifies it belongs to the requesting user.
     * Returns a 404 (not 403) intentionally to avoid leaking task existence.
     */
    private Task findOwnedTask(UUID id, User user) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException("Task not found: " + id));
        if (!task.getUser().getId().equals(user.getId())) {
            throw new TaskNotFoundException("Task not found: " + id);
        }
        return task;
    }

    private TaskResponseDTO mapToDTO(Task task) {
        return new TaskResponseDTO(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getPriority(),
                task.getDueDate(),
                task.isDaily(),
                task.getCreatedAt()
        );
    }
}
