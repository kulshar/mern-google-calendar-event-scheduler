'use strict';

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');

const { getEnv } = require('./config/env');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');

const app = express();

// Security & utils
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// CORS
const { CLIENT_ORIGIN } = getEnv();
app.use(cors({
	origin: CLIENT_ORIGIN,
	credentials: true
}));

// DB connection
const { MONGODB_URI } = getEnv();
mongoose.set('strictQuery', true);
mongoose.connect(MONGODB_URI)
	.then(() => {
		console.log('MongoDB connected');
	})
	.catch((err) => {
		console.error('MongoDB connection error', err);
		process.exit(1);
	});

// Sessions
const { SESSION_SECRET } = getEnv();
app.use(session({
	secret: SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	cookie: {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
		maxAge: 1000 * 60 * 60 * 24 * 30 // 30 days
	},
	store: MongoStore.create({
		mongoUrl: MONGODB_URI,
		ttl: 60 * 60 * 24 * 30
	})
}));

// Routes
app.use('/auth', authRoutes);
app.use('/api/events', eventRoutes);

app.get('/health', (_req, res) => {
	return res.json({ ok: true, uptime: process.uptime() });
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
	console.error('Unhandled error:', err);
	const status = err.status || 500;
	return res.status(status).json({
		error: {
			message: err.message || 'Internal Server Error'
		}
	});
});

const { PORT } = getEnv();
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});


