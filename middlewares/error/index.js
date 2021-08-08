const app = require('../../app');

const defaultError = { msg: 'InternalServerError', code: 500 };
const getErrorCodeByError = err => err.code || defaultError.code;
const getErrorMsgByError = err => err.message || defaultError.msg;

exports.logging = (err, req, res, next) => {
	console.log('ERROR', err);
	next(err);
};

exports.ajaxHandler = (err, req, res, next) => {
	if (!req.xhr) {
		next(err);
	} else {
		const code = getErrorCodeByError(err);
		const msg = getErrorMsgByError(err);
		res.status(code).end(msg);
	}
};

exports.handler = (err, req, res, next) => {
	const handler = typeof err.handler === 'function' ? err.handler : err.constructor.handler;

	if (typeof handler === 'function') {
		handler(req, res);
	} else {
		res.status(getErrorCodeByError(err)).end(getErrorMsgByError(err));
	}
};