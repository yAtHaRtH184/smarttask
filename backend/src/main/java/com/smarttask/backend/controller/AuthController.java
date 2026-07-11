package com.smarttask.backend.controller;

import com.smarttask.backend.dto.AuthResponseDTO;
import com.smarttask.backend.dto.LoginRequestDTO;
import com.smarttask.backend.dto.UserRequestDTO;
import com.smarttask.backend.dto.UserResponseDTO;
import com.smarttask.backend.service.AuthService;
import com.smarttask.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;
    private final UserService userService;

    public AuthController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    /** POST /auth/register — create a new user account */
    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> register(@Valid @RequestBody UserRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(dto));
    }

    /** POST /auth/login — authenticate and receive a JWT */
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
