import type { CalendarEvent, EventInput } from "../types";

const baseHeaders: HeadersInit = {
  "Content-Type": "application/json",
};

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    credentials: "include",
    headers: baseHeaders,
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let message = res.statusText;
    try {
      const data = await res.json();
      message = (data && (data.error?.message || data.message)) || message;
    } catch {
      const text = await res.text().catch(() => "");
      if (text) message = text;
    }
    throw new Error(text || res.statusText);
  }
  return res.json() as Promise<T>;
}

export const api = {
  me: () => http<{ authenticated: boolean; userId?: string }>("/auth/me"),
  login: () => {
    window.location.href = "/auth/google";
  },
  logout: () => http<{ ok: boolean }>("/auth/logout", { method: "POST" }),

  getEvents: () => http<{ events: CalendarEvent[] }>("/api/events"),
  createEvent: (input: EventInput) =>
    http<{ event: CalendarEvent }>("/api/events", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  updateEvent: (
    id: string,
    input: Partial<EventInput> & { customColor?: string }
  ) =>
    http<{ event: CalendarEvent }>(`/api/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    }),
  deleteEvent: (id: string) =>
    http<{ ok: boolean }>(`/api/events/${id}`, { method: "DELETE" }),
};
