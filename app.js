const express = require('express');
const path = require('path');
const http = require('http');
const webpack = require('webpack');
const session = require('express-session');
const redisStore = require('connect-redis')(session);
const redis = require('redis');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const middlewares = require('./middlewares');

const initExpress = redisClient => {
	const app = express();
	const PORT = 3000;

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(
		session({
			key: 'app.sid',
			secret: 'session-secret',
			store: new redisStore({
				host: '127.0.0.1',
				port: 6379,
				client: redisClient,
				prefix: 'session:',
				db: 0
			}),
			resave: false,
			saveUninitialized: true,
			cookie: { path: '/', maxAge: 1800000 }
		})
	);
	app.use(express.static(path.resolve('./dist/client')));
	app.use(express.static(path.resolve('./statics')));
	app.use(express.static(path.resolve('./node_modules')));
	app.use('/', require('./routes/view'));
	app.use('/api', require('./routes/api'));
	app.use(middlewares.error.logging);
	app.use(middlewares.error.ajaxHandler);
	app.use(middlewares.error.handler);

	return require('http')
		.createServer(app)
		.listen(PORT, () => {
			console.log('Express server listening on port ' + PORT);
		});
};

const initRedis = () => redis.createClient();
const initMongo = async () => {
	await mongoose.connect('mongodb://localhost:27017/app', { useNewUrlParser: true });
};

const main = () => {
	initMongo().then(() => {
		const redisClient = initRedis();
		const server = initExpress(redisClient);
	});
};

main();