package org.example.spooneyes.litchii.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitInterceptor implements HandlerInterceptor {

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String key = resolveKey(request);
        Bucket bucket = buckets.computeIfAbsent(key, k -> createBucket(request));

        if (bucket.tryConsume(1)) {
            return true;
        }

        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.getWriter().write("{\"error\": \"Too many requests\"}");
        response.setContentType("application/json");
        return false;
    }

    private String resolveKey(HttpServletRequest request) {
        String ip = request.getRemoteAddr();
        String path = request.getRequestURI();
        return ip + ":" + path;
    }

    private Bucket createBucket(HttpServletRequest request) {
        String path = request.getRequestURI();

        // Plus strict sur verify (anti brute-force PIN)
        if (path.contains("/verify")) {
            return Bucket.builder()
                    .addLimit(Bandwidth.simple(5, Duration.ofMinutes(1)))
                    .build();
        }

        // Standard pour les autres endpoints
        return Bucket.builder()
                .addLimit(Bandwidth.simple(30, Duration.ofMinutes(1)))
                .build();
    }
}