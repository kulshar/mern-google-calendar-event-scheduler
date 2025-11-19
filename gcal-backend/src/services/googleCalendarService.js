'use strict';

const { google } = require('googleapis');
const { getOAuth2Client } = require('../config/google');
const GoogleAccount = require('../models/GoogleAccount');
const { getEnv } = require('../config/env');

async function getAuthorizedOAuthClient(googleUserId) {
	const account = await GoogleAccount.findOne({ googleUserId });
	if (!account) {
		const err = new Error('Google account not connected');
		err.status = 401;
		throw err;
	}
	const oauth2Client = getOAuth2Client();
	oauth2Client.setCredentials({
		refresh_token: account.refreshToken
	});
	return oauth2Client;
}

async function createGoogleEvent(googleUserId, eventInput) {
	const oauth2Client = await getAuthorizedOAuthClient(googleUserId);
	const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
	const { GOOGLE_CALENDAR_ID } = getEnv();

	const gEvent = {
		summary: eventInput.title,
		description: eventInput.description || '',
		start: {
			dateTime: new Date(eventInput.start).toISOString()
		},
		end: {
			dateTime: new Date(eventInput.end).toISOString()
		},
		status: eventInput.status || 'confirmed'
	};

	const { data } = await calendar.events.insert({
		calendarId: GOOGLE_CALENDAR_ID,
		requestBody: gEvent
	});
	return data;
}

async function updateGoogleEvent(googleUserId, googleEventId, eventInput) {
	const oauth2Client = await getAuthorizedOAuthClient(googleUserId);
	const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
	const { GOOGLE_CALENDAR_ID } = getEnv();

	const gEvent = {
		summary: eventInput.title,
		description: eventInput.description || '',
		start: {
			dateTime: new Date(eventInput.start).toISOString()
		},
		end: {
			dateTime: new Date(eventInput.end).toISOString()
		},
		status: eventInput.status || 'confirmed'
	};

	const { data } = await calendar.events.patch({
		calendarId: GOOGLE_CALENDAR_ID,
		eventId: googleEventId,
		requestBody: gEvent
	});
	return data;
}

async function deleteGoogleEvent(googleUserId, googleEventId) {
	const oauth2Client = await getAuthorizedOAuthClient(googleUserId);
	const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
	const { GOOGLE_CALENDAR_ID } = getEnv();

	await calendar.events.delete({
		calendarId: GOOGLE_CALENDAR_ID,
		eventId: googleEventId
	});
}

module.exports = {
	createGoogleEvent,
	updateGoogleEvent,
	deleteGoogleEvent
};


