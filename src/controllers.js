import {
  addNote,
  createRequest,
  deleteRequest,
  getDashboardSummary,
  getDbPath,
  getRequestById,
  listNotesForRequest,
  listRequests,
  updateRequestStatus,
  verifyRequestPassword,
} from "./db.js";

/**
 * Attaches a _links hypermedia object to a request row so API consumers
 * can navigate to related resources without constructing URLs manually.
 */
function addLinks(request) {
  const id = request.request_id;
  return {
    ...request,
    _links: {
      self: `/api/requests/${id}`,
      notes: `/api/requests/${id}/notes`,
      status: `/api/requests/${id}/status`,
    },
  };
}

export function handleHealth() {
  return { status: 200, body: { ok: true, db: getDbPath() } };
}

export function handleDashboard() {
  return { status: 200, body: { ok: true, data: getDashboardSummary() } };
}

export function handleListRequests() {
  return { status: 200, body: { ok: true, data: listRequests().map(addLinks) } };
}

export function handleGetRequest(requestId) {
  const request = getRequestById(requestId);
  if (!request) {
    return { status: 404, body: { ok: false, error: "Request not found." } };
  }
  return {
    status: 200,
    body: {
      ok: true,
      data: {
        request: addLinks(request),
        notes: listNotesForRequest(requestId),
      },
    },
  };
}

export function handleCreateRequest(body) {
  const payload = {
    customer_name: String(body.customer_name ?? "").trim(),
    customer_email: String(body.customer_email ?? "").trim() || null,
    item_name: String(body.item_name ?? "").trim(),
    brand: String(body.brand ?? "").trim() || null,
    budget_gbp: body.budget_gbp === "" || body.budget_gbp == null
      ? null
      : Number(body.budget_gbp),
    size: String(body.size ?? "").trim() || null,
    colour: String(body.colour ?? "").trim() || null,
    request_password: String(body.request_password ?? "").trim(),
  };

  if (!payload.customer_name) {
    return { status: 400, body: { ok: false, error: "Customer name is required." } };
  }
  if (!payload.item_name) {
    return { status: 400, body: { ok: false, error: "Item name is required." } };
  }
  if (!payload.request_password) {
    return { status: 400, body: { ok: false, error: "Request password is required." } };
  }
  if (payload.budget_gbp !== null && (Number.isNaN(payload.budget_gbp) || payload.budget_gbp < 0)) {
    return { status: 400, body: { ok: false, error: "Budget must be a valid number." } };
  }

  const created = createRequest(payload);
  return { status: 201, body: { ok: true, data: addLinks(created) } };
}

export function handleVerifyRequest(body) {
  const requestId = Number(body.request_id);
  const password = String(body.request_password ?? "").trim();

  if (!requestId || !password) {
    return { status: 400, body: { ok: false, error: "request_id and request_password are required." } };
  }

  const isValid = verifyRequestPassword(requestId, password);
  if (!isValid) {
    return { status: 401, body: { ok: false, error: "Incorrect password." } };
  }

  return { status: 200, body: { ok: true } };
}

export function handleUpdateStatus(requestId, body) {
  const statusName = String(body.status_name ?? "").trim();
  if (!statusName) {
    return { status: 400, body: { ok: false, error: "status_name is required." } };
  }
  const updated = updateRequestStatus(requestId, statusName);
  return { status: 200, body: { ok: true, data: addLinks(updated) } };
}

export function handleGetNotes(requestId) {
  return { status: 200, body: { ok: true, data: listNotesForRequest(requestId) } };
}

export function handleAddNote(requestId, body) {
  const noteText = String(body.note_text ?? "").trim();
  if (!noteText) {
    return { status: 400, body: { ok: false, error: "note_text is required." } };
  }
  addNote(requestId, noteText);
  return { status: 200, body: { ok: true, data: listNotesForRequest(requestId) } };
}

export function handleDeleteRequest(requestId) {
  const request = getRequestById(requestId);
  if (!request) {
    return { status: 404, body: { ok: false, error: "Request not found." } };
  }
  deleteRequest(requestId);
  return { status: 200, body: { ok: true } };
}
