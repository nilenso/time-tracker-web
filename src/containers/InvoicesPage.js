import React from 'react';
import { connect } from 'react-redux';
import { downloadInvoice } from '../thunks';
import DownloadInvoiceForm from '../components/DownloadInvoiceForm';

function InvoicesPage({onDownloadClick}) {
  return (
    <DownloadInvoiceForm onSubmit={onDownloadClick} />
  );
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    onDownloadClick: (start, end) => {
      dispatch(downloadInvoice(start, end));
    }
  };
}

export default connect(mapStateToProps,
                       mapDispatchToProps)(InvoicesPage);
