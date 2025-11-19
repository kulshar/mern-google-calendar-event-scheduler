'use strict';

const mongoose = require('mongoose');

const GoogleAccountSchema = new mongoose.Schema({
	googleUserId: { type: String, index: true, unique: true, required: true }, // sub
	email: { type: String, index: true },
	displayName: { type: String },
	refreshToken: { type: String, required: true },
	tokenScope: { type: String }, // scopes granted at consent
	lastLoginAt: { type: Date, default: Date.now }
}, {
	timestamps: true
});

module.exports = mongoose.model('GoogleAccount', GoogleAccountSchema);


