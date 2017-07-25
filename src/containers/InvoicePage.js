import React, { Component } from 'react';
import { connect } from 'react-redux';
import InvoiceTable from '../components/InvoiceTable';

class InvoicePage extends Component {
  render() {
    const savedInvoice = this.props.entities
      .get('invoices')
      .get(parseInt(this.props.params.invoiceId, 10));
    return (
      <InvoiceTable invoice={savedInvoice} />
    );
  }
}

function mapStateToProps(state) {
  return {
    entities: state.get('entities')
  };
}

export default connect(mapStateToProps)(InvoicePage);