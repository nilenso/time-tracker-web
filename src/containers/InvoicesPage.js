import React from 'react';
import { connect } from 'react-redux';
import { downloadInvoice } from '../thunks';

function InvoicesPage({onDownloadClick}) {
  return (
    <button onClick={onDownloadClick}>Download invoice</button>
  );
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    onDownloadClick: () => {
      dispatch(downloadInvoice());
    }
  };
}

export default connect(mapStateToProps,
                       mapDispatchToProps)(InvoicesPage);
