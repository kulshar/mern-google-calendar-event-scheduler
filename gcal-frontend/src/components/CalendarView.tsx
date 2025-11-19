import { Calendar } from "@fullcalendar/core";
// import "@fullcalendar/core/index.css";
import dayGridPlugin from "@fullcalendar/daygrid";
// import "@fullcalendar/daygrid/index.css";
import timeGridPlugin from "@fullcalendar/timegrid";
// import "@fullcalendar/timegrid/index.css";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useMemo, useRef } from "react";
import type { CalendarEvent, FiltersState } from "../types";
import { eventDisplayColor } from "../utils/colors";

interface Props {
  events: CalendarEvent[];
  filters: FiltersState;
  onSelectRange: (start: Date, end: Date) => void;
  onSelectEvent: (id: string) => void;
}

export function CalendarView({
  events,
  filters,
  onSelectEvent,
  onSelectRange,
}: Props) {
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const calendarObj = useRef<Calendar | null>(null);

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      if (filters.status && ev.status !== filters.status) return false;
      if (filters.colors?.length) {
        const color = ev.customColor;
        if (!color || !filters.colors.includes(color)) return false;
      }
      if (filters.text) {
        const t = filters.text.toLowerCase();
        if (
          !(
            ev.title?.toLowerCase().includes(t) ||
            ev.description?.toLowerCase().includes(t)
          )
        )
          return false;
      }
      if (filters.dateStart) {
        if (new Date(ev.end) < new Date(filters.dateStart)) return false;
      }
      if (filters.dateEnd) {
        if (new Date(ev.start) > new Date(filters.dateEnd + "T23:59:59"))
          return false;
      }
      return true;
    });
  }, [events, filters]);

  useEffect(() => {
    if (!calendarRef.current) return;
    if (calendarObj.current) return;

    const cal = new Calendar(calendarRef.current, {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: "dayGridMonth",
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      },
      height: "auto",
      editable: false,
      selectable: true,
      select: (info) => {
        onSelectRange(info.start, info.end);
      },
      eventClick: (info) => {
        const id = info.event.extendedProps["_id"] as string | undefined;
        if (id) onSelectEvent(id);
      },
      events: [],
    });
    cal.render();
    calendarObj.current = cal;
    return () => {
      try {
        cal.destroy();
      } catch {}
      calendarObj.current = null;
    };
  }, []);

  useEffect(() => {
    const cal = calendarObj.current;
    if (!cal) return;
    cal.removeAllEvents();
    filteredEvents.forEach((ev) => {
      cal.addEvent({
        id: ev.googleEventId,
        title: ev.title,
        start: ev.start,
        end: ev.end,
        color: eventDisplayColor(ev),
        extendedProps: {
          _id: ev._id,
          status: ev.status,
          customColor: ev.customColor,
        },
      });
    });
    if (filters.dateStart && filters.dateEnd) {
      try {
        cal.changeView("dayGridMonth", filters.dateStart);
      } catch {}
    }
  }, [filteredEvents, filters.dateStart, filters.dateEnd]);

  return (
    <div className="w-full">
      <div ref={calendarRef} className="px-2 sm:px-4" />
    </div>
  );
}
