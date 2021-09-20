const app = require('../../app');

const nodemailer = require('nodemailer');

const defaultError = { msg: 'InternalServerError', code: 500 };
const getErrorCodeByError = err => err.code || defaultError.code;
const getErrorMsgByError = err => err.message || defaultError.msg;

require('dotenv').config();

let transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GOOGLE_ID,
    pass: process.env.GOOGLE_PW,
  },
});

const sendMail = async (text) => {
  const title = 'File Manager API Error';
  await transporter.sendMail({
    from: `"WDMA Team" <kanghg1116>`,
    to: 'kanghg1116@gmail.com',
    subject: title,
    text,
  });
};

exports.logging = (err, req, res, next) => {
	console.log('ERROR', err);
	sendMail('ERROR', err)
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