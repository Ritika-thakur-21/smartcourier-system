package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import io.github.cdimascio.dotenv.Dotenv;
import jakarta.annotation.PostConstruct;

@Configuration
public class DotenvConfig {

    @PostConstruct
    public void init() {
        Dotenv dotenv = Dotenv.configure()
                .directory("./")
                .ignoreIfMissing()
                .load();

        setIfNotNull(dotenv, "JWT_SECRET");
        setIfNotNull(dotenv, "jwt.secret");
    }

    private void setIfNotNull(Dotenv dotenv, String key) {
        String value = dotenv.get(key);
        if (value == null && key.equals("jwt.secret")) {
            value = dotenv.get("JWT_SECRET");
        }
        if (value != null) {
            System.setProperty(key.contains(".") ? key : key, value);

            if (key.equals("JWT_SECRET")) {
                System.setProperty("jwt.secret", value);
            }
        }
    }
}
