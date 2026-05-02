package com.example.demo.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.*;
import com.example.demo.entity.User;
import com.example.demo.enums.Role;
import com.example.demo.exception.*;
import com.example.demo.repository.UserRepository;
import com.example.demo.util.JwtUtil;

@Service
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final SignupProducer signupProducer;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil,
                       SignupProducer signupProducer) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.signupProducer = signupProducer;
    }

    public UserResponse signup(SignupRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException(
                    "Email already registered: " + request.getEmail());
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());

        user.setRole(Role.CUSTOMER);

        User saved = userRepository.save(user);
        
        // 📧 Send Welcome Email
        signupProducer.sendWelcomeEmail(saved.getEmail(), saved.getName());

        return mapToResponse(saved);
    }

    public JwtResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new UserNotFoundException("User not found: " + request.getEmail()));

        if (!passwordEncoder.matches(
                request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name()
        );

        return new JwtResponse(
                token,
                user.getEmail(),
                user.getRole().name(),
                user.getName()
        );
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(Long id) {
        return userRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found with id: " + id));
    }

    public boolean validateToken(String token) {
        return jwtUtil.validateToken(token);
    }

    public boolean makeAdmin(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isEmpty()) return false;

        User user = optionalUser.get();
        user.setRole(Role.ADMIN); 
        userRepository.save(user);

        return true;
    }

    private UserResponse mapToResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setRole(user.getRole().name());
        response.setCreatedAt(user.getCreatedAt());
        return response;
    }
}