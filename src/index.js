import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import About from './components/About';
import AdminPage from './containers/AdminPage';
import TimersPage from './containers/TimersPage';
import InvoicesPage from './containers/InvoicesPage';
import { Router, Route, IndexRoute, browserHistory, Redirect } from 'react-router';
import { Provider } from 'react-redux';
import store from './store';

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={TimersPage} />
        <Route path="about" component={About} />
        <Route path="timers" component={TimersPage} />
        <Route path="admin" component={AdminPage} />
        <Route path="invoices" component={InvoicesPage} />
      </Route>
      <Redirect from="*" to="/"/>
    </Router>
  </Provider>,
  document.getElementById('root')
);
