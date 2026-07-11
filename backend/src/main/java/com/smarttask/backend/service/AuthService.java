package com.smarttask.backend.service;

import com.smarttask.backend.dto.AuthResponseDTO;
import com.smarttask.backend.dto.LoginRequestDTO;
import com.smarttask.backend.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private  final JwtService jwtService;
    public AuthService(AuthenticationManager authenticationManager, JwtService jwtService){
        this.authenticationManager=authenticationManager;
        this.jwtService=jwtService;

    }
    public AuthResponseDTO login(LoginRequestDTO request){
        Authentication authentication=
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        String token =jwtService.generateToken(authentication);
        return new AuthResponseDTO(token);
    }

}
