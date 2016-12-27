import React, { Component } from 'react';
import moment from 'moment';

export default class DatePicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayValue: props.defaultMoment.format('DD-MM-YYYY')
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({displayValue: event.target.value});
  }

  handleSubmit(event) {
    const newMoment = moment(this.state.displayValue, 'DD-MM-YYYY', true);
    if (newMoment.isValid()) {
      this.props.onChangeDate(newMoment);
    }
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text" value={this.state.displayValue}
               onChange={this.handleChange} />
        <input type="submit" value="Change date" />
      </form>
    );
  }
}
