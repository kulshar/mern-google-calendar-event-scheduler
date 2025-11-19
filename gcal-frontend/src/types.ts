export type EventStatus = 'confirmed' | 'tentative' | 'cancelled'

export interface CalendarEvent {
	_id: string
	googleEventId: string
	userId: string
	source: string
	status: EventStatus
	customColor?: string
	title: string
	start: string
	end: string
	description?: string
}

export interface EventInput {
	title: string
	description?: string
	start: string
	end: string
	status?: EventStatus
	customColor?: string
}

export interface FiltersState {
	status?: EventStatus
	colors: string[]
	text?: string
	dateStart?: string
	dateEnd?: string
}


