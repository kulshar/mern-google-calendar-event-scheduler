'use strict';

const express = require('express');
const Event = require('../models/Event');
const { requireAuth } = require('../middleware/auth');
const { eventCreateSchema, eventUpdateSchema } = require('../utils/validators');
const { createGoogleEvent, updateGoogleEvent, deleteGoogleEvent } = require('../services/googleCalendarService');
const mongoose = require('mongoose');

const router = express.Router();

router.use(requireAuth);

// GET /api/events
router.get('/', async (req, res, next) => {
	try {
		const userId = req.session.userId;
		const events = await Event.find({ userId }).sort({ start: 1 }).lean();
		return res.json({ events });
	} catch (err) {
		return next(err);
	}
});

// POST /api/events
router.post('/', async (req, res, next) => {
	try {
		const userId = req.session.userId;
		const { value, error } = eventCreateSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
		if (error) {
			return res.status(400).json({ error: { message: 'Validation failed', details: error.details } });
		}

		// 1) Create on Google first
		const gEvent = await createGoogleEvent(userId, value);
		const googleEventId = gEvent.id;

		// 2) Persist locally
		try {
			const saved = await Event.create({
				googleEventId,
				userId,
				source: 'Google',
				status: value.status || 'confirmed',
				customColor: value.customColor,
				title: value.title,
				start: value.start,
				end: value.end,
				description: value.description
			});

			return res.status(201).json({ event: saved });
		} catch (dbErr) {
			// Compensation: delete the just-created Google event
			try { await deleteGoogleEvent(userId, googleEventId); } catch (_e) {}
			throw dbErr;
		}
	} catch (err) {
		return next(err);
	}
});

// PUT /api/events/:id
router.put('/:id', async (req, res, next) => {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const userId = req.session.userId;
		const eventId = req.params.id;
		const { value, error } = eventUpdateSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
		if (error) {
			await session.abortTransaction();
			return res.status(400).json({ error: { message: 'Validation failed', details: error.details } });
		}

		const existing = await Event.findOne({ _id: eventId, userId }).session(session);
		if (!existing) {
			await session.abortTransaction();
			return res.status(404).json({ error: { message: 'Event not found' } });
		}

		const original = existing.toObject();

		// Update on Google first
		const merged = {
			title: value.title ?? existing.title,
			description: value.description ?? existing.description,
			start: value.start ?? existing.start,
			end: value.end ?? existing.end,
			status: value.status ?? existing.status
		};

		await updateGoogleEvent(userId, existing.googleEventId, merged);

		// Update local
		existing.title = merged.title;
		existing.description = merged.description;
		existing.start = merged.start;
		existing.end = merged.end;
		existing.status = merged.status;
		if (typeof value.customColor !== 'undefined') {
			existing.customColor = value.customColor;
		}
		await existing.save({ session });

		await session.commitTransaction();
		return res.json({ event: existing });
	} catch (err) {
		// Try to compensate if local write failed after Google success
		try {
			if (err && err.name === 'MongoServerError') {
				// Revert Google to original
				const userId = req.session.userId;
				const eventId = req.params.id;
				const original = await Event.findOne({ _id: eventId, userId });
				if (original) {
					await updateGoogleEvent(userId, original.googleEventId, {
						title: original.title,
						description: original.description,
						start: original.start,
						end: original.end,
						status: original.status
					});
				}
			}
		} catch (_e) {}
		try { await session.abortTransaction(); } catch (_e) {}
		return next(err);
	} finally {
		session.endSession();
	}
});

// DELETE /api/events/:id
router.delete('/:id', async (req, res, next) => {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const userId = req.session.userId;
		const eventId = req.params.id;
		const existing = await Event.findOne({ _id: eventId, userId }).session(session);
		if (!existing) {
			await session.abortTransaction();
			return res.status(404).json({ error: { message: 'Event not found' } });
		}

		const original = existing.toObject();

		// Delete locally first (within tx)
		await Event.deleteOne({ _id: eventId, userId }).session(session);

		// Delete on Google
		await deleteGoogleEvent(userId, original.googleEventId);

		await session.commitTransaction();
		return res.json({ ok: true });
	} catch (err) {
		// Compensation: restore local if Google delete failed
		try {
			const userId = req.session.userId;
			const eventId = req.params.id;
			const exists = await Event.findOne({ _id: eventId, userId });
			if (!exists && err && err.code) {
				// Restore
				await Event.create({
					...original
				});
			}
		} catch (_e) {}
		try { await session.abortTransaction(); } catch (_e) {}
		return next(err);
	} finally {
		session.endSession();
	}
});

module.exports = router;


