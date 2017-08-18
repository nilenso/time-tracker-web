import React, { Component } from 'react';
import { connect } from 'react-redux';
import InvoiceTable from '../components/InvoiceTable';
import { markInvoicePaid, markInvoiceUnusable, downloadInvoice } from '../thunks';
import { Events } from '../util';

class InvoicePage extends Component {
  constructor(props) {
    super(props);

    this.onInvoiceTableSubmit = this.onInvoiceTableSubmit.bind(this);
  }

  onInvoiceTableSubmit(invoiceId, event_name) {
    if (event_name == Events.PAID_EVENT) {
      this.props.dispatch(markInvoicePaid(invoiceId));
    }
    else if (event_name == Events.UNUSABLE_EVENT) {
      this.props.dispatch(markInvoiceUnusable(invoiceId));
    }
    else if (event_name == Events.DOWNLOAD_EVENT) {
      this.props.dispatch(downloadInvoice(invoiceId));
    }

    return;
  }

  render() {
    const savedInvoice = this.props.entities
      .get('invoices')
      .get(parseInt(this.props.params.invoiceId, 10)); //Base 10

    return (
      <InvoiceTable invoice={savedInvoice} onSubmit={this.onInvoiceTableSubmit}/>
    )
  }
}

function mapStateToProps(state) {
  return {
    entities: state.get('entities')
  };
}

export default connect(mapStateToProps)(InvoicePage);
