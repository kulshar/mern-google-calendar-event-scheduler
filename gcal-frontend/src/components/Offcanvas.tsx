import { ReactNode } from 'react'
import { clsx } from 'clsx'

interface OffcanvasProps {
	open: boolean
	title: string
	onClose: () => void
	children: ReactNode
}

export function Offcanvas({ open, title, onClose, children }: OffcanvasProps) {
	return (
		<div className={clsx(
			'fixed inset-0 z-40',
			open ? 'pointer-events-auto' : 'pointer-events-none'
		)}>
			<div
				className={clsx(
					'absolute inset-0 bg-black/30 transition-opacity',
					open ? 'opacity-100' : 'opacity-0'
				)}
				onClick={onClose}
			/>
			<aside
				className={clsx(
					'absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-xl transition-transform',
					open ? 'translate-x-0' : 'translate-x-full'
				)}
				aria-hidden={!open}
			>
				<div className="flex items-center justify-between p-4 border-b">
					<h3 className="text-lg font-semibold">{title}</h3>
					<button onClick={onClose} className="px-2 py-1 rounded hover:bg-gray-100">Close</button>
				</div>
				<div className="p-4 overflow-y-auto h-[calc(100%-56px)]">
					{children}
				</div>
			</aside>
		</div>
	)
}


