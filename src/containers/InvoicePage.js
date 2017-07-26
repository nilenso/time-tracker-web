import React, { Component } from 'react';
import { connect } from 'react-redux';
import InvoiceTable from '../components/InvoiceTable';
import { markInvoicePaid } from '../thunks'

class InvoicePage extends Component {
  constructor(props) {
    super(props);

    this.onInvoiceTableSubmit = this.onInvoiceTableSubmit.bind(this);
  }

  onInvoiceTableSubmit(invoiceId) {
    this.props.dispatch(markInvoicePaid(invoiceId));
    return;
  }

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
        <InvoiceTable invoice={savedInvoice} onSubmit={this.onInvoiceTableSubmit}/>
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