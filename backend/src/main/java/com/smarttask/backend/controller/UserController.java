package com.smarttask.backend.controller;

import com.smarttask.backend.dto.UserRequestDTO;
import com.smarttask.backend.dto.UserResponseDTO;
import com.smarttask.backend.entity.User;
import com.smarttask.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<UserResponseDTO> createUser(@RequestBody UserRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(dto));
    }

    // Fixed: now returns UserResponseDTO instead of the raw User entity (was exposing password hash)
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable UUID id) {
        User user = userService.findUserByid(id);
        UserResponseDTO dto = UserResponseDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .createdAt(user.getCreatedAt())
                .build();
        return ResponseEntity.ok(dto);
    }
}
