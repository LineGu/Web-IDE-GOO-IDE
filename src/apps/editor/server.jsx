import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';

import App from './index';

const render = (location, context, data) => {
	const html = ReactDOMServer.renderToString(
		<StaticRouter location={location} context={context}>
			<App {...data} />
		</StaticRouter>
	);

	return { html };
};

export default render;