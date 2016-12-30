import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { About } from './components/About';
import Admin from './containers/Admin';
import TimersPage from './containers/TimersPage';
import { rootReducer } from './reducers';
import { Router, Route, IndexRoute, browserHistory, Redirect } from 'react-router';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';

const logger = createLogger();

let store = createStore(rootReducer,
                        applyMiddleware(thunkMiddleware, logger));

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={TimersPage} />
        <Route path="about" component={About} />
        <Route path="timers" component={TimersPage} />
        <Route path="admin" component={Admin} />
      </Route>
      <Redirect from="*" to="/"/>
    </Router>
  </Provider>,
  document.getElementById('root')
);
