const path = require('path');

const render = require('../../../dist/server/AccountApp.js').default;
const serialize = require('serialize-javascript');

const fileManifest = require('../../../dist/client/manifest.json');

module.exports = async function(req, res, next) {
	const initialData = {};
	const { html } = render(req.url, {}, initialData);

	res.render(path.resolve(__dirname, '../../../templates/default.html.ejs'), {
		markup: html,
		cssFile: fileManifest['AccountApp.css'],
		jsFile: fileManifest['AccountApp.js'],
		data: serialize(initialData)
	});
};