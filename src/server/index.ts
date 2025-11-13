import { Hono } from "hono";

const app = new Hono();

// Health check endpoint
app.get("/", (c) => {
    console.log("[theia-credential-bridge] GET / - Health check");
    return c.text("Hello World!");
});

// Health endpoint
app.get("/health", (c) => {
    console.log("[theia-credential-bridge] GET /health");
    return c.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        service: "theia-credential-bridge"
    });
});

// 404 handler
app.notFound((c) => {
    console.log(`[theia-credential-bridge] 404 - Not found: ${c.req.path}`);
    return c.json({
        error: "Not found",
        path: c.req.path
    }, 404);
});

// Error handler
app.onError((err, c) => {
    console.error("[theia-credential-bridge] Error:", err);
    return c.json({
        error: "Internal server error",
        message: err.message
    }, 500);
});

export default app;