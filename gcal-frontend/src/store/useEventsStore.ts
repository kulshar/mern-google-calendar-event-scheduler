import { create } from 'zustand'
import { api } from '../services/api'
import type { CalendarEvent, EventInput, FiltersState } from '../types'

interface EventsState {
	events: CalendarEvent[]
	loading: boolean
	error?: string
	filters: FiltersState
	setFilters: (f: Partial<FiltersState>) => void
	load: () => Promise<void>
	create: (input: EventInput) => Promise<void>
	update: (id: string, input: Partial<EventInput> & { customColor?: string }) => Promise<void>
	remove: (id: string) => Promise<void>
}

export const useEventsStore = create<EventsState>((set, get) => ({
	events: [],
	loading: false,
	filters: { colors: [] },
	setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f } })),
	load: async () => {
		set({ loading: true, error: undefined })
		try {
			const res = await api.getEvents()
			set({ events: res.events })
		} catch (e: any) {
			set({ error: e.message || 'Failed to load events' })
		} finally {
			set({ loading: false })
		}
	},
	create: async (input) => {
		const res = await api.createEvent(input)
		set({ events: [res.event, ...get().events] })
	},
	update: async (id, input) => {
		const res = await api.updateEvent(id, input)
		set({ events: get().events.map(e => e._id === id ? res.event : e) })
	},
	remove: async (id) => {
		await api.deleteEvent(id)
		set({ events: get().events.filter(e => e._id !== id) })
	}
}))


