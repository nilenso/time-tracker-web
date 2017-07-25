import React, { Component } from 'react';

export default class InvoiceTable extends Component {
  render() {
    const invoice = this.props.invoice;

    return (
        <p>Here we show details for Invoice {invoice.get('client')} at address {invoice.get('address')}</p>
    )
  }
}