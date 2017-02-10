import React, { Component } from 'react';
import DatePicker from './DatePicker';
import moment from 'moment';

export default class DownloadInvoiceForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      start: moment().startOf('day'),
      end: moment().startOf('day'),
      client: props.clients.first(),
      address: '',
      notes: '',
      userRates: this.userRatesFromProps(props),
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
    this.setState({userRates: this.userRatesFromProps(newProps)});
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
     userRates: this.state.userRates.setIn([id, 'rate'], nextRate || 0)
   });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { start, end, client, address, notes, userRates, currency }
      = this.state;
    const userIdToRate = userRates.map(user => {
      return user.get('rate');
    });
    const taxes = this.state.showTaxes ? {
      [this.state.taxName1]: parseFloat(this.state.taxPercent1),
      [this.state.taxName2]: parseFloat(this.state.taxPercent2)
    } : null;
    this.props.onSubmit({start, end, client, address,
      notes, userIdToRate, currency, taxes});
  }

  render() {
    const clientOptions = this.props.clients.map((client, index) => {
      return (
        <option key={index} value={client}>
          {client}
        </option>
      );
    });

    const usersRates = this.state.userRates.valueSeq().map((user, index) => {
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
        {usersRates}

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
          Pecentage
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
          Pecentage
          <input type="number" step="0.01"
                 onChange={this.handleNamedStateChange}
                 name="taxPercent2"
                 value={this.state.taxPercent2}/>
        </label>

        <input type="submit" value="Download invoice" disabled={buttonDisabled}/>
      </form>
    );
  }
}
