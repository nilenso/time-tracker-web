import React, { Component } from 'react';
import DatePicker from './DatePicker';
import moment from 'moment';
import Immutable from 'immutable';

export default class CreateInvoiceForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      start: moment().startOf('day'),
      end: moment().startOf('day'),
      client: props.clients.first(),
      address: '',
      notes: '',
      usersWithRates: this.userRatesFromProps(props),
      currency: 'inr',
      showTaxes: false,
      taxName1: '',
      taxPercent1: 0.0,
      taxName2: '',
      taxPercent2: 0.0
    };
  }

  userRatesFromProps = (props) => {
    return props.users.map(user => {
      return user.set('rate', 0);
    });
  }

  componentWillReceiveProps(newProps) {
    this.setState({client: newProps.clients.first()});
    this.setState({usersWithRates: this.userRatesFromProps(newProps)});
  }

  handleStartChange = (newStart) => {
    this.setState((prevState, props) => {
      const newEnd =
        newStart.isAfter(prevState.end, 'day') ? newStart : prevState.end;
      return {
        start: newStart,
        end: newEnd
      };
    });
  }

  handleEndChange = (newEnd) => {
    this.setState((prevState, props) => {
      const newStart =
        newEnd.isBefore(prevState.start, 'day') ? newEnd : prevState.start;
      return {
        start: newStart,
        end: newEnd
      };
    });
  }

  handleNamedStateChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleCheckboxChange = (event) => {
    this.setState({
      showTaxes: event.target.checked
    });
  }

  handleRatesChange = (event, id) => {
    const nextRate = parseInt(event.target.value, 10);
    this.setState({
     usersWithRates: this.state.usersWithRates.setIn([id, 'rate'], nextRate || 0)
   });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { start, end, client, address, notes, usersWithRates, currency }
      = this.state;
    const userRates = usersWithRates.valueSeq()
      .map(user => {
        return Immutable.Map({ 'user-id': user.get('id'), 'rate': user.get('rate') });
      })
      .toList();
    const taxes = this.state.showTaxes ? [
      { 'tax-name': this.state.taxName1, 'tax-percentage': parseFloat(this.state.taxPercent1) },
      { 'tax-name': this.state.taxName2, 'tax-percentage': parseFloat(this.state.taxPercent2) }
     ] : null;
    this.props.onSubmit({start, end, client, address,
      notes, userRates, currency, taxes});
  }

  render() {
    const clientOptions = this.props.clients.map((client, index) => {
      return (
        <option key={index} value={client}>
          {client}
        </option>
      );
    });

    const userRatesForm = this.state.usersWithRates.valueSeq().map((user, index) => {
      return (
        <span key={index}>
          <label>{user.get('name')}</label>
          <input type="text"
                 value={user.get('rate')}
                 onChange={(event) => this.handleRatesChange(event,
                                                             user.get('id'))}
                 name={user.get('name')}
            />
        </span>
      )
    });

    let buttonDisabled = this.state.client ? false : true;

    return (
      <form onSubmit={this.handleSubmit}>
        <label>{"From (inclusive):"}</label>
        <DatePicker name="startDate"
                    onChangeDate={this.handleStartChange}
                    defaultMoment={this.state.start}
          />

        <label>{"To: (inclusive):"}</label>
        <DatePicker name="endDate"
                    onChangeDate={this.handleEndChange}
                    defaultMoment={this.state.end}
          />

        <label>{"Client"}</label>
        <select value={this.state.client}
                onChange={this.handleNamedStateChange}
                name="client">
          {clientOptions}
        </select>

        <label>{"Client address"}</label>
        <textarea value={this.state.address}
                  onChange={this.handleNamedStateChange}
                  name="address"
          />

        <label>{"Notes"}</label>
        <textarea value={this.state.notes}
                  onChange={this.handleNamedStateChange}
                  name="notes"
          />

        <label>{"Currency"}</label>
        <select value={this.state.currency}
                onChange={this.handleNamedStateChange}
                name="currency">
          <option value="usd">USD</option>
          <option value="inr">INR</option>
        </select>

        <label>{"User Rates"}</label>
        {userRatesForm}

        <label>
          <input type="checkbox"
                 checked={this.state.showTaxes}
                 name="showTaxes"
                 onChange={this.handleCheckboxChange}
            />
          Invoice taxes
        </label>

        <label>
          Name
          <input type="text"
                 onChange={this.handleNamedStateChange}
                 name="taxName1"
                 value={this.state.taxName1}/>
        </label>
        <label>
          Percentage
          <input type="number" step="0.01"
                 onChange={this.handleNamedStateChange}
                 name="taxPercent1"
                 value={this.state.taxPercent1}/>
        </label>

        <label>
          Name
          <input type="text"
                 onChange={this.handleNamedStateChange}
                 name="taxName2"
                 value={this.state.taxName2}/>
        </label>
        <label>
          Percentage
          <input type="number" step="0.01"
                 onChange={this.handleNamedStateChange}
                 name="taxPercent2"
                 value={this.state.taxPercent2}/>
        </label>

        <input type="submit" value="Create invoice" disabled={buttonDisabled}/>
      </form>
    );
  }
}
