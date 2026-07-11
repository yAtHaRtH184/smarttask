package com.smarttask.backend.service;

import com.smarttask.backend.entity.Task;
import com.smarttask.backend.repository.TaskRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TaskSchedulerService {

    private final TaskRepository taskRepository;

    public TaskSchedulerService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    /**
     * Resets status of all Daily Tasks back to TODO at midnight UTC.
     */
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void resetDailyTasksJob() {
        System.out.println("[Scheduler] Starting Daily Task Reset job...");
        try {
            taskRepository.resetDailyTasks(Task.Status.TODO);
            System.out.println("[Scheduler] Daily Task Reset job finished successfully.");
        } catch (Exception e) {
            System.err.println("[Scheduler] Failed to reset daily tasks: " + e.getMessage());
        }
    }
}
