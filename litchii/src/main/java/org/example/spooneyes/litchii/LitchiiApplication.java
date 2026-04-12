package org.example.spooneyes.litchii;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class LitchiiApplication {

    public static void main(String[] args) {
        SpringApplication.run(LitchiiApplication.class, args);
    }

}
