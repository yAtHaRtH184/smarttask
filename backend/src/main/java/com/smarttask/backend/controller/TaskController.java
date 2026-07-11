package com.smarttask.backend.controller;

import com.smarttask.backend.dto.TaskRequestDTO;
import com.smarttask.backend.dto.TaskResponseDTO;
import com.smarttask.backend.entity.Task;
import com.smarttask.backend.security.CustomUserDetails;
import com.smarttask.backend.service.TaskService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

import com.smarttask.backend.service.TaskSchedulerService;

@RestController
@RequestMapping("/tasks")
public class TaskController {
    private final TaskService taskService;
    private final TaskSchedulerService taskSchedulerService;

    public TaskController(TaskService taskService, TaskSchedulerService taskSchedulerService) {
        this.taskService = taskService;
        this.taskSchedulerService = taskSchedulerService;
    }

    /** POST /tasks — create a new task for the authenticated user */
    @PostMapping
    public ResponseEntity<TaskResponseDTO> createTask(
            @RequestBody TaskRequestDTO dto,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(taskService.createTask(principal.getUser(), dto));
    }

    /** GET /tasks?status=TODO&page=0&size=10 — list tasks, optionally filtered by status */
    @GetMapping
    public Page<TaskResponseDTO> getTasks(
            Pageable pageable,
            @RequestParam(required = false) Task.Status status,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return taskService.getMyTasks(principal.getUser(), status, pageable);
    }

    /** GET /tasks/{id} — get a single task (owner only) */
    @GetMapping("/{id}")
    public ResponseEntity<TaskResponseDTO> getTask(
            @PathVariable UUID id,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(taskService.getTaskById(id, principal.getUser()));
    }

    /** PUT /tasks/{id} — partial update (owner only) */
    @PutMapping("/{id}")
    public ResponseEntity<TaskResponseDTO> updateTask(
            @PathVariable UUID id,
            @RequestBody TaskRequestDTO dto,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(taskService.updateTask(id, dto, principal.getUser()));
    }

    /** DELETE /tasks/{id} — delete a task (owner only) */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable UUID id,
            @AuthenticationPrincipal CustomUserDetails principal) {
        taskService.deleteTask(id, principal.getUser());
        return ResponseEntity.noContent().build();
    }

    /** POST /tasks/trigger-daily-reset — manually trigger daily reset */
    @PostMapping("/trigger-daily-reset")
    public ResponseEntity<String> triggerDailyReset() {
        taskSchedulerService.resetDailyTasksJob();
        return ResponseEntity.ok("Daily tasks reset job triggered successfully");
    }
}
