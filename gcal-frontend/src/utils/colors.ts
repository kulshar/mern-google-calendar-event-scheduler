import type { CalendarEvent, EventStatus } from '../types'

export function statusColor(status: EventStatus): string {
	switch (status) {
		case 'confirmed': return '#16a34a'
		case 'tentative': return '#f59e0b'
		case 'cancelled': return '#ef4444'
		default: return '#64748b'
	}
}

export function eventDisplayColor(ev: Pick<CalendarEvent, 'customColor' | 'status'>): string {
	if (ev.customColor && ev.customColor.trim().length > 0) return ev.customColor
	return statusColor(ev.status)
}


