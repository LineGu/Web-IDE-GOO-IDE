import React from 'react';
import { Switch, Route } from 'react-router-dom';

import SignIn from 'pages/signin';
import SignUp from 'pages/signup';

const App = props => (
	<Switch>
		<Route exact path={'/signin'} render={() => <SignIn {...props} />} />
		<Route exact path="/signup" render={() => <SignUp {...props} />} />
	</Switch>
);
export default App;