package org.example.spooneyes.litchii.config;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import static org.junit.jupiter.api.Assertions.*;

class RateLimitInterceptorTest {

    private RateLimitInterceptor interceptor;

    @BeforeEach
    void setUp() {
        interceptor = new RateLimitInterceptor();
    }

    @Test
    void usesXForwardedForFirstEntry() throws Exception {
        MockHttpServletRequest req1 = createRequest("/api/mailboxes/token/verify");
        req1.setRemoteAddr("10.0.0.1"); // proxy IP
        req1.addHeader("X-Forwarded-For", "203.0.113.10, 10.0.0.1");

        MockHttpServletRequest req2 = createRequest("/api/mailboxes/token/verify");
        req2.setRemoteAddr("10.0.0.1"); // same proxy IP
        req2.addHeader("X-Forwarded-For", "198.51.100.20, 10.0.0.1");

        for (int i = 0; i < 5; i++) {
            assertTrue(interceptor.preHandle(req1, new MockHttpServletResponse(), null));
        }
        MockHttpServletResponse blocked = new MockHttpServletResponse();
        assertFalse(interceptor.preHandle(req1, blocked, null));
        assertEquals(429, blocked.getStatus());

        assertTrue(interceptor.preHandle(req2, new MockHttpServletResponse(), null));
    }

    @Test
    void usesXRealIpAsFallback() throws Exception {
        MockHttpServletRequest req = createRequest("/api/mailboxes/token/verify");
        req.setRemoteAddr("10.0.0.1");
        req.addHeader("X-Real-IP", "203.0.113.10");

        // Exhaust 5 requests
        for (int i = 0; i < 5; i++) {
            assertTrue(interceptor.preHandle(req, new MockHttpServletResponse(), null));
        }

        MockHttpServletResponse blocked = new MockHttpServletResponse();
        assertFalse(interceptor.preHandle(req, blocked, null));
        assertEquals(429, blocked.getStatus());

        MockHttpServletRequest directReq = createRequest("/api/mailboxes/token/verify");
        directReq.setRemoteAddr("10.0.0.1");
        assertTrue(interceptor.preHandle(directReq, new MockHttpServletResponse(), null));
    }

    @Test
    void fallsBackToRemoteAddr() throws Exception {
        MockHttpServletRequest req = createRequest("/api/mailboxes/token/verify");
        req.setRemoteAddr("203.0.113.10");

        for (int i = 0; i < 5; i++) {
            assertTrue(interceptor.preHandle(req, new MockHttpServletResponse(), null));
        }

        MockHttpServletResponse blocked = new MockHttpServletResponse();
        assertFalse(interceptor.preHandle(req, blocked, null));
        assertEquals(429, blocked.getStatus());
    }

    @Test
    void shortCodeSharesSingleBucketAcrossDifferentCodes() throws Exception {
        for (int i = 0; i < 5; i++) {
            MockHttpServletRequest req = createRequest("/api/mailboxes/short/CODE" + i);
            req.setRemoteAddr("203.0.113.10");
            assertTrue(interceptor.preHandle(req, new MockHttpServletResponse(), null),
                    "Request " + i + " should be allowed");
        }

        MockHttpServletRequest blocked = createRequest("/api/mailboxes/short/CODE5");
        blocked.setRemoteAddr("203.0.113.10");
        MockHttpServletResponse resp = new MockHttpServletResponse();
        assertFalse(interceptor.preHandle(blocked, resp, null));
        assertEquals(429, resp.getStatus());

        MockHttpServletRequest otherIp = createRequest("/api/mailboxes/short/CODE0");
        otherIp.setRemoteAddr("198.51.100.20");
        assertTrue(interceptor.preHandle(otherIp, new MockHttpServletResponse(), null));
    }

    private MockHttpServletRequest createRequest(String uri) {
        MockHttpServletRequest req = new MockHttpServletRequest();
        req.setRequestURI(uri);
        return req;
    }
}
