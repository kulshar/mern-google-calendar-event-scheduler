import { useEffect, useMemo, useState } from 'react'
import type { CalendarEvent, EventInput, EventStatus } from '../types'

interface EventFormProps {
	initial?: Partial<CalendarEvent>
	onSubmit: (input: EventInput & { customColor?: string }) => Promise<void> | void
	onDelete?: () => Promise<void> | void
	submitLabel?: string
}

export function EventForm({ initial, onSubmit, onDelete, submitLabel = 'Save' }: EventFormProps) {
	const [title, setTitle] = useState(initial?.title ?? '')
	const [description, setDescription] = useState(initial?.description ?? '')
	const [start, setStart] = useState(() => initial?.start ? initial.start.slice(0,16) : '')
	const [end, setEnd] = useState(() => initial?.end ? initial.end.slice(0,16) : '')
	const [status, setStatus] = useState<EventStatus>(initial?.status ?? 'confirmed')
	const [customColor, setCustomColor] = useState(initial?.customColor ?? '')
	const [error, setError] = useState<string>()
	const valid = useMemo(() => !!title && !!start && !!end && new Date(end) > new Date(start), [title, start, end])

	useEffect(() => {
		setTitle(initial?.title ?? '')
		setDescription(initial?.description ?? '')
		setStart(initial?.start ? initial.start.slice(0,16) : '')
		setEnd(initial?.end ? initial.end.slice(0,16) : '')
		setStatus(initial?.status ?? 'confirmed')
		setCustomColor(initial?.customColor ?? '')
	}, [initial?._id])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(undefined)
		if (!valid) {
			setError('Please provide a title and a valid time range.')
			return
		}
		await onSubmit({
			title,
			description,
			start: new Date(start).toISOString(),
			end: new Date(end).toISOString(),
			status,
			customColor: customColor || undefined
		})
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			{error && <div className="text-red-600 text-sm">{error}</div>}
			<div>
				<label className="block text-sm font-medium">Title</label>
				<input value={title} onChange={e => setTitle(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" placeholder="Event title" />
			</div>
			<div>
				<label className="block text-sm font-medium">Description</label>
				<textarea value={description} onChange={e => setDescription(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" rows={3} placeholder="Optional description" />
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				<div>
					<label className="block text-sm font-medium">Start</label>
					<input type="datetime-local" value={start} onChange={e => setStart(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
				</div>
				<div>
					<label className="block text-sm font-medium">End</label>
					<input type="datetime-local" value={end} onChange={e => setEnd(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
				</div>
			</div>
			<div>
				<label className="block text-sm font-medium mb-1">Status</label>
				<div className="flex items-center gap-2">
					{['confirmed','tentative','cancelled'].map(s => (
						<button key={s} type="button" onClick={() => setStatus(s as EventStatus)}
							className={`px-3 py-1 rounded border ${status === s ? 'bg-gray-900 text-white' : 'bg-white'}`}>{s}</button>
					))}
				</div>
			</div>
			<div>
				<label className="block text-sm font-medium">Custom Color</label>
				<input type="color" value={customColor || '#000000'} onChange={e => setCustomColor(e.target.value)} className="mt-1 h-10 w-16 border rounded" />
				<button type="button" onClick={() => setCustomColor('')} className="ml-3 text-sm text-gray-600 underline">Clear</button>
			</div>
			<div className="flex items-center gap-3">
				<button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded">{submitLabel}</button>
				{onDelete && (
					<button type="button" onClick={() => onDelete()} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
				)}
			</div>
		</form>
	)
}


