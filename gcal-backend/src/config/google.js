'use strict';

const { google } = require('googleapis');
const { getEnv } = require('./env');

function getOAuth2Client() {
	const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } = getEnv();
	return new google.auth.OAuth2(
		GOOGLE_CLIENT_ID,
		GOOGLE_CLIENT_SECRET,
		GOOGLE_REDIRECT_URI
	);
}

const OAUTH_SCOPES = [
	'https://www.googleapis.com/auth/calendar',
	'https://www.googleapis.com/auth/userinfo.email',
	'https://www.googleapis.com/auth/userinfo.profile',
	'openid'
];

module.exports = {
	getOAuth2Client,
	OAUTH_SCOPES
};


