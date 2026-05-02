package com.example.demo.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI authServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("SmartCourier - Auth Service API")
                        .description("User registration and JWT authentication")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("SmartCourier Team")
                                .email("support@smartcourier.com")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8081")
                                .description("Direct Service"),
                        new Server()
                                .url("http://localhost:8080")
                                .description("Via API Gateway")
                ));
    }
}