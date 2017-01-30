import React, { Component } from 'react';
import DatePicker from './DatePicker';
import moment from 'moment';

export default class DownloadInvoiceForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      start: moment().startOf('day'),
      end: moment().startOf('day'),
      client: props.clients.first()
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleStartChange = this.handleStartChange.bind(this);
    this.handleEndChange = this.handleEndChange.bind(this);
    this.handleClientChange = this.handleClientChange.bind(this);
  }

  handleStartChange(newStart) {
    this.setState((prevState, props) => {
      const newEnd =
        newStart.isAfter(prevState.end, 'day') ? newStart : prevState.end;
      return {
        start: newStart,
        end: newEnd
      };
    });
  }

  handleEndChange(newEnd) {
    this.setState((prevState, props) => {
      const newStart =
        newEnd.isBefore(prevState.start, 'day') ? newEnd : prevState.start;
      return {
        start: newStart,
        end: newEnd
      };
    });
  }

  handleClientChange(event) {
    this.setState({
      client: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { start, end, client } = this.state;
    this.props.onSubmit(start, end, client);
  }

  render() {
    const clientOptions = this.props.clients.map((client, index) => {
      return (
        <option key={index} value={client}>
          {client}
        </option>
      );
    });
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
        <select value={this.state.client}
                onChange={this.handleClientChange}
                name="client">
          {clientOptions}
        </select>
        <input type="submit" value="Download invoice" />
      </form>
    );
  }
}
