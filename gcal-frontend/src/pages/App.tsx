import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import { useEventsStore } from "../store/useEventsStore";
import { CalendarView } from "../components/CalendarView";
import { FilterSidebar } from "../components/FilterSidebar";
import { Offcanvas } from "../components/Offcanvas";
import { EventForm } from "../components/EventForm";
import type { CalendarEvent, EventInput } from "../types";

export function App() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [offOpen, setOffOpen] = useState(false);
  const [editing, setEditing] = useState<CalendarEvent | undefined>();
  const [notice, setNotice] = useState<string | undefined>();

  const { events, filters, setFilters, load, create, update, remove, loading } =
    useEventsStore();

  useEffect(() => {
    (async () => {
      setChecking(true);
      try {
        const me = await api.me();
        setAuthed(me.authenticated);
        if (me.authenticated) {
          await load();
        }
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  const availableColors = useMemo(() => {
    const set = new Set<string>();
    events.forEach((e) => {
      if (e.customColor) set.add(e.customColor);
    });
    return Array.from(set);
  }, [events]);

  const onSelectRange = (start: Date, end: Date) => {
    setEditing(undefined);
    setOffOpen(true);
  };

  const onSelectEvent = (id: string) => {
    const ev = events.find((e) => e._id === id);
    if (ev) {
      setEditing(ev);
      setOffOpen(true);
    }
  };

  const handleCreate = async (input: EventInput & { customColor?: string }) => {
    await create(input);
    setOffOpen(false);
    setNotice("Even created successfully");
    setTimeout(() => setNotice(undefined), 3000);
  };
  const handleUpdate = async (input: EventInput & { customColor?: string }) => {
    if (!editing) return;
    await update(editing._id, input);
    setOffOpen(false);
  };
  const handleDelete = async () => {
    if (!editing) return;
    await remove(editing._id);
    setOffOpen(false);
  };

  if (checking) {
    return <div className="p-6 text-gray-600">Checking session...</div>;
  }
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded shadow p-6">
          <h1 className="text-xl font-semibold mb-4">
            Connect your Google Calendar
          </h1>
          <p className="text-gray-600 mb-6">
            Authenticate to sync and manage your events.
          </p>
          <button
            onClick={() => api.login()}
            className="w-full py-3 bg-blue-600 text-white rounded"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {notice && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-3 py-2 rounded shadow">
          {notice}
        </div>
      )}
      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-base sm:text-lg font-semibold">
            Calendar Dashboard
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOffOpen(true)}
              className="px-3 py-2 bg-gray-900 text-white rounded"
            >
              New Event
            </button>
            <button
              onClick={() => api.logout().then(() => location.reload())}
              className="px-3 py-2 border rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row">
        <FilterSidebar
          value={filters}
          onChange={setFilters}
          availableColors={availableColors}
        />
        <div className="flex-1">
          {loading ? (
            <div className="p-4 text-gray-600">Loading events...</div>
          ) : (
            <CalendarView
              events={events}
              filters={filters}
              onSelectRange={onSelectRange}
              onSelectEvent={onSelectEvent}
            />
          )}
        </div>
      </main>

      <Offcanvas
        open={offOpen}
        title={editing ? "Edit Event" : "New Event"}
        onClose={() => setOffOpen(false)}
      >
        <EventForm
          initial={editing}
          onSubmit={editing ? handleUpdate : handleCreate}
          onDelete={editing ? handleDelete : undefined}
          submitLabel={editing ? "Update" : "Create"}
        />
      </Offcanvas>
    </div>
  );
}
