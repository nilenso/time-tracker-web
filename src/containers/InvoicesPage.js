import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { downloadInvoice } from '../thunks';
import DownloadInvoiceForm from '../components/DownloadInvoiceForm';

function InvoicesPage({clients, onDownloadClick}) {
  return (
    <DownloadInvoiceForm onSubmit={onDownloadClick}
                         clients={clients}/>
  );
}

function clientFromProject(project) {
  const name = project.get('name');
  return name.split('|', 2)[0];
}

function mapStateToProps(state) {
  const projects = state.getIn(['entities', 'projects']);
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
    clients: clients
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onDownloadClick: (start, end, client) => {
      dispatch(downloadInvoice(start.clone().startOf('day'),
                               end.clone().startOf('day').add(1, 'days'),
                               client));
    }
  };
}

export default connect(mapStateToProps,
                       mapDispatchToProps)(InvoicesPage);
