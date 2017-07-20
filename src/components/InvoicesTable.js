import React, { Component } from 'react';
import moment from 'moment';

export default class InvoicesTable extends Component {
  render() {
    const invoiceRows = this.props.invoices
                            .valueSeq()
                            .sortBy(invoice => invoice.get('id'))
                            .reverse();
    const titles = ['Id', 'Client', 'Address', 'Notes', 'Amount', 'Currency', 'From', 'To', 'Status']
    const tableStyle = {
       "marginLeft": "5px"
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

    return (  
      <table style={tableStyle}>
        <thead style={headerStyle}>
          <tr>
            {titles.map(title =>
              <th style={cellStyle} key={title}>{title}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {invoiceRows.map((row, i) =>
            <tr key={i}>
              <td style={cellStyle}>{row.get('id')}</td>
              <td style={cellStyle}>{row.get('client')}</td>
              <td style={cellStyle}>{row.get('address')}</td>
              <td style={cellStyle}>{row.get('notes')}</td>
              <td style={cellStyle}>{row.get('amount_due')}</td>
              <td style={cellStyle}>{row.get('currency').toUpperCase()}</td>
              <td style={cellStyle}>{moment.unix(row.get('from_date') + row.get('utc_offset')).format('DD-MM-YYYY')}</td>
              <td style={cellStyle}>{moment.unix(row.get('to_date') + row.get('utc_offset')).format('DD-MM-YYYY')}</td>
              <td style={cellStyle}>{row.get('paid')? 'Paid': 'Due'}</td>
            </tr>
          )}
        </tbody>
      </table>
    )
  }
}