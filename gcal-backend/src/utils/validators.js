'use strict';

const Joi = require('joi');

const eventCreateSchema = Joi.object({
	title: Joi.string().min(1).max(512).required(),
	description: Joi.string().allow('').max(4096),
	start: Joi.date().required(),
	end: Joi.date().required(),
	status: Joi.string().valid('confirmed', 'tentative', 'cancelled').default('confirmed'),
	customColor: Joi.string().optional()
}).custom((value, helpers) => {
	if (new Date(value.end) <= new Date(value.start)) {
		return helpers.error('any.invalid', { message: 'end must be after start' });
	}
	return value;
});

const eventUpdateSchema = Joi.object({
	title: Joi.string().min(1).max(512),
	description: Joi.string().allow('').max(4096),
	start: Joi.date(),
	end: Joi.date(),
	status: Joi.string().valid('confirmed', 'tentative', 'cancelled'),
	customColor: Joi.string()
}).custom((value, helpers) => {
	if (value.start && value.end) {
		if (new Date(value.end) <= new Date(value.start)) {
			return helpers.error('any.invalid', { message: 'end must be after start' });
		}
	}
	return value;
});

module.exports = {
	eventCreateSchema,
	eventUpdateSchema
};


