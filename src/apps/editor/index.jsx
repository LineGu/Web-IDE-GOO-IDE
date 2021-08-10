import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Editor from 'pages/editor';

const App = props => (
	<Switch>
		<Route path='/editor/:title' render={props => <Editor {...props} />} />
	</Switch>
);
export default App;