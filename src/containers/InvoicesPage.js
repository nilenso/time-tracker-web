import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { downloadInvoice } from '../thunks';
import DownloadInvoiceForm from '../components/DownloadInvoiceForm';

function InvoicesPage({clients, users, onDownloadClick}) {
  return (
    <DownloadInvoiceForm onSubmit={onDownloadClick}
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
    onDownloadClick: (downloadInvoiceParams) => {
      dispatch(downloadInvoice(Object.assign(downloadInvoiceParams, {
        start: downloadInvoiceParams.start.clone().startOf('day'),
        end: downloadInvoiceParams.end.clone().startOf('day').add(1, 'days')
      })));
    }
  };
}

export default connect(mapStateToProps,
                       mapDispatchToProps)(InvoicesPage);
