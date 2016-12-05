import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { SignIn } from './containers/SignIn';
import { About } from './components/About';
import { TimersDisplay } from './components/TimersDisplay';
import { rootReducer } from './reducers';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
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
        <IndexRoute component={TimersDisplay} />
        <Route path="about" component={About} />
        <Route path="timers" component={TimersDisplay} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
