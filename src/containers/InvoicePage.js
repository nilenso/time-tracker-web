import React, { Component } from 'react';
import { connect } from 'react-redux';
import InvoiceTable from '../components/InvoiceTable';

class InvoicePage extends Component {
  render() {
    const savedInvoice = this.props.entities
      .get('invoices')
      .get(parseInt(this.props.params.invoiceId, 10));

    if (this.props.isFetching || !savedInvoice) {
      return (
        <p>{"Invoice is being fetched, please wait."}</p>
      )
    }
    else {
      return (
        <InvoiceTable invoice={savedInvoice} />
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    entities: state.get('entities'),
    isFetching: state.get('invoicePage').get('isFetching')
  };
}

export default connect(mapStateToProps)(InvoicePage);