package com.example.demo.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;

// 🔐 IMPORTS
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI trackingServiceOpenAPI() {
        return new OpenAPI()

                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))

                .components(new io.swagger.v3.oas.models.Components()
                        .addSecuritySchemes("bearerAuth",
                                new SecurityScheme()
                                        .name("Authorization")
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")))

                .info(new Info()
                        .title("SmartCourier - Tracking Service API")
                        .description("REST API for tracking parcels, uploading documents and delivery proof")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("SmartCourier Team")
                                .email("support@smartcourier.com")))

                .servers(List.of(
                        new Server()
                                .url("http://localhost:8083")
                                .description("Direct Service"),
                        new Server()
                                .url("http://localhost:8080")
                                .description("Via API Gateway")
                ));
    }
}