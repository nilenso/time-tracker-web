import React, {Component} from 'react';
import { connect } from 'react-redux';
import  InvoicesTable from '../components/InvoicesTable';

class InvoicesPage extends Component {
  render() {
    const savedInvoices = this.props.entities
                                   .get('invoices')
    return (
      <div>
        <InvoicesTable invoices={savedInvoices}/>
      </div>
    );
  }  
}

function mapStateToProps(state) {
  return {
    entities: state.get('entities')
  };
}

export default connect(mapStateToProps)(InvoicesPage);

