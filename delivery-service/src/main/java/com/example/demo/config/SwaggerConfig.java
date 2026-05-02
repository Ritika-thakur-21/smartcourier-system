package com.example.demo.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;

// 🔥 IMPORT THESE
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI deliveryServiceOpenAPI() {
        return new OpenAPI()
                
                // 🔐 GLOBAL SECURITY (important)
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
                
                .components(new io.swagger.v3.oas.models.Components()
                        .addSecuritySchemes("bearerAuth",
                                new SecurityScheme()
                                        .name("Authorization")
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")))
                
                .info(new Info()
                        .title("SmartCourier - Delivery Service API")
                        .description("REST API for managing parcel deliveries")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("SmartCourier Team")
                                .email("support@smartcourier.com")))
                
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8082")
                                .description("Direct Service"),
                        new Server()
                                .url("http://localhost:8080")
                                .description("Via API Gateway")
                ));
    }
}