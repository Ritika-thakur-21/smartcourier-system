package com.example.demo.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setFrom("thakurritika361@gmail.com");
            mail.setTo(to);
            mail.setSubject(subject);
            mail.setText(body);

            System.out.println("📤 ATTEMPTING TO SEND EMAIL TO: " + to);
            mailSender.send(mail);
            System.out.println("✅ EMAIL SENT SUCCESSFULLY TO: " + to);
        } catch (Exception e) {
            System.err.println("❌ FAILED TO SEND EMAIL TO: " + to + " | Error: " + e.getMessage());
        }
    }
}
