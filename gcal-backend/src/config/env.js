'use strict';

function requireEnv(name, fallback) {
	const value = process.env[name] || fallback;
	if (typeof value === 'undefined') {
		throw new Error(`Missing required env var: ${name}`);
	}
	return value;
}

function getEnv() {
	return {
		PORT: parseInt(process.env.PORT || '4000', 10),
		MONGODB_URI: requireEnv('MONGODB_URI'),
		SESSION_SECRET: requireEnv('SESSION_SECRET'),
		GOOGLE_CLIENT_ID: requireEnv('GOOGLE_CLIENT_ID'),
		GOOGLE_CLIENT_SECRET: requireEnv('GOOGLE_CLIENT_SECRET'),
		GOOGLE_REDIRECT_URI: requireEnv('GOOGLE_REDIRECT_URI'),
		GOOGLE_CALENDAR_ID: process.env.GOOGLE_CALENDAR_ID || 'primary',
		CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173'
	};
}

module.exports = { getEnv };


