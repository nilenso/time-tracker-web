import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { createInvoice } from '../thunks';
import  CreateInvoiceForm from '../components/CreateInvoiceForm';

function InvoicesPage({clients, users, onCreateClick}) {
  return (
    <CreateInvoiceForm onSubmit={onCreateClick}
                         clients={clients}
                         users={users}/>
  );
}

function clientFromProject(project) {
  const name = project.get('name');
  return name.split('|', 2)[0];
}

function mapStateToProps(state) {
  const projects = state.getIn(['entities', 'projects']);
  const users = state.getIn(['entities', 'users']);
  if (!projects) {
    return {
      clients: Immutable.List([])
    };
  }
  const clients = projects.valueSeq()
                          .map(clientFromProject)
                          .toSet()
                          .toList()
                          .sort();
  return {
    clients: clients,
    users: users
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onCreateClick: (createInvoiceParams) => {
      dispatch(createInvoice(Object.assign(createInvoiceParams, {
        start: createInvoiceParams.start.clone().startOf('day'),
        end: createInvoiceParams.end.clone().startOf('day').add(1, 'days')
      })));
    }
  };
}

export default connect(mapStateToProps,
                       mapDispatchToProps)(InvoicesPage);
