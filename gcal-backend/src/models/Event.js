'use strict';

const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
	googleEventId: { type: String, index: true, required: true }, // key to external
	userId: { type: String, index: true, required: true }, // Google user id (sub)
	source: { type: String, default: 'Google' },
	status: { type: String, enum: ['confirmed', 'tentative', 'cancelled'], default: 'confirmed' },
	customColor: { type: String, required: false }, // optional local override

	// Standard fields
	title: { type: String, required: true },
	start: { type: Date, required: true },
	end: { type: Date, required: true },
	description: { type: String }
}, {
	timestamps: true
});

module.exports = mongoose.model('Event', EventSchema);


