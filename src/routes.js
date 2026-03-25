import {
  handleAddNote,
  handleCreateRequest,
  handleDashboard,
  handleDeleteRequest,
  handleGetNotes,
  handleGetRequest,
  handleHealth,
  handleListRequests,
  handleUpdateStatus,
  handleVerifyRequest,
} from "./controllers.js";

/**
 * Main API router. Matches method + pathname to the appropriate controller
 * and returns a Response. Every handler logs its method and path on entry.
 */
export async function handleApi(req, pathname) {
  try {
    if (req.method === "GET" && pathname === "/api/health") {
      console.log("GET /api/health");
      const result = handleHealth();
      return json(result.body, result.status);
    }

    if (req.method === "GET" && pathname === "/api/dashboard") {
      console.log("GET /api/dashboard");
      const result = handleDashboard();
      return json(result.body, result.status);
    }

    if (req.method === "GET" && pathname === "/api/requests") {
      console.log("GET /api/requests");
      const result = handleListRequests();
      return json(result.body, result.status);
    }

    if (req.method === "POST" && pathname === "/api/requests") {
      console.log("POST /api/requests");
      const body = await safeJson(req);
      const result = handleCreateRequest(body);
      return json(result.body, result.status);
    }

    if (req.method === "POST" && pathname === "/api/requests/verify") {
      console.log("POST /api/requests/verify");
      const body = await safeJson(req);
      const result = handleVerifyRequest(body);
      return json(result.body, result.status);
    }

    const requestMatch = pathname.match(/^\/api\/requests\/(\d+)$/);

    if (req.method === "GET" && requestMatch) {
      console.log(`GET ${pathname}`);
      const result = handleGetRequest(Number(requestMatch[1]));
      return json(result.body, result.status);
    }

    if (req.method === "DELETE" && requestMatch) {
      console.log(`DELETE ${pathname}`);
      const result = handleDeleteRequest(Number(requestMatch[1]));
      return json(result.body, result.status);
    }

    const statusMatch = pathname.match(/^\/api\/requests\/(\d+)\/status$/);

    if (req.method === "PATCH" && statusMatch) {
      console.log(`PATCH ${pathname}`);
      const body = await safeJson(req);
      const result = handleUpdateStatus(Number(statusMatch[1]), body);
      return json(result.body, result.status);
    }

    const notesMatch = pathname.match(/^\/api\/requests\/(\d+)\/notes$/);

    if (req.method === "GET" && notesMatch) {
      console.log(`GET ${pathname}`);
      const result = handleGetNotes(Number(notesMatch[1]));
      return json(result.body, result.status);
    }

    if (req.method === "POST" && notesMatch) {
      console.log(`POST ${pathname}`);
      const body = await safeJson(req);
      const result = handleAddNote(Number(notesMatch[1]), body);
      return json(result.body, result.status);
    }

    return json({ ok: false, error: "Not found." }, 404);

  } catch (error) {
    console.error("API error:", error);
    return json(
      { ok: false, error: error?.message || "Internal server error." },
      500,
    );
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

async function safeJson(req) {
  try {
    return await req.json();
  } catch {
    return {};
  }
}
