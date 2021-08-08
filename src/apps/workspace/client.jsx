import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from './index';

const data = window.__INITIAL_STATE__;

ReactDOM.hydrate(
	<BrowserRouter>
		<App {...data} />
	</BrowserRouter>,
	document.getElementById('app')
);