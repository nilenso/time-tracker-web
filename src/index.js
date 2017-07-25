import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import About from './components/About';
import AdminPage from './containers/AdminPage';
import TimersPage from './containers/TimersPage';
import NewInvoicePage from './containers/NewInvoicePage';
import InvoicesPage from './containers/InvoicesPage';
import InvoicePage from './containers/InvoicePage';
import { Router, Route, IndexRoute, browserHistory, Redirect } from 'react-router';
import { Provider } from 'react-redux';
import store from './store';
import { getInvoice } from './thunks';

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={TimersPage} />
        <Route path="about" component={About} />
        <Route path="timers" component={TimersPage} />
        <Route path="admin" component={AdminPage} />
        <Route path="invoice" component={NewInvoicePage} />
        <Route path="invoices" component={InvoicesPage} />
        <Route path="invoices/:invoiceId" component={InvoicePage} onEnter={(nextState) => { store.dispatch(getInvoice(nextState.params.invoiceId))}}/>
      </Route>
      <Redirect from="*" to="/"/>
    </Router>
  </Provider>,
  document.getElementById('root')
);