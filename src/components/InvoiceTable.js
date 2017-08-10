import React, { Component } from 'react';
import { Events } from '../util';

export default class InvoiceTable extends Component {
  constructor(props) {
    super(props);
  }

  handlePaid(event) {
    event.preventDefault();
    this.props.onSubmit(this.props.invoice.get('id'), Events.PAID_EVENT);
  }

  handleUnusable(event) {
    event.preventDefault();
    this.props.onSubmit(this.props.invoice.get('id'), Events.UNUSABLE_EVENT);
  }

  render() {
    const invoice = this.props.invoice;

    const isUnPaid = !this.props.invoice.get('paid');
    const isUsable = this.props.invoice.get('usable') && isUnPaid;

    const tableStyle = {
      "marginLeft": "100px"
    };
    const headerStyle = {
      "backgroundColor": "grey",
      "color": "white"
    }
    const cellStyle = {
      "border": "1px solid black",
      "height": "30px",
      "width": "200px",
      "padding": "2px",
      "textAlign": "center"
    }

    const buttonStyle = {
      "marginLeft": "100px",
      "fontSize": "20px",
      "border": "1px solid black",
      "height": "30px",
      "width": "150px",
      "padding": "2px",
      "textAlign": "center"
    }

    return (
      <form>
        <table style={tableStyle}>
          <thead style={headerStyle}>
            <tr>
              <th style={cellStyle}>Details of Invoice</th>
              <th style={cellStyle}>#{invoice.get('id')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={cellStyle}>Client</td>
              <td style={cellStyle}>{invoice.get('client')}</td>
            </tr>
            <tr>
              <td style={cellStyle}>Address</td>
              <td style={cellStyle}>{invoice.get('address')}</td>
            </tr>
            <tr>
              <td style={cellStyle}>Amount Due</td>
              <td style={cellStyle}>{invoice.get('amount_due')}</td>
            </tr>
            <tr>
              <td style={cellStyle}>Currency</td>
              <td style={cellStyle}>{(invoice.get('currency')).toUpperCase()}</td>
            </tr>
            <tr>
              <td style={cellStyle}>Notes</td>
              <td style={cellStyle}>{invoice.get('notes')}</td>
            </tr>
            <tr>
              <td style={cellStyle}>Status</td>
              <td style={cellStyle}>{invoice.get('paid') ? 'Paid' : 'Unpaid'}</td>
            </tr>
            <tr>
              <td style={cellStyle}>Usable</td>
              <td style={cellStyle}>{invoice.get('usable') ? 'Yes' : 'No'}</td>
            </tr>
            <tr/>
          </tbody>
        </table>
        <h1/>
        {isUnPaid &&
          <button style={buttonStyle} onClick={this.handlePaid.bind(this)}>Mark as Paid</button>
        }
        {isUsable &&
          <button style={buttonStyle} onClick={this.handleUnusable.bind(this)}>Mark as Unusable</button>
        } 
      </form>
    )
  }
}