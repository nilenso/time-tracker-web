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
    this.handleReduceDate = this.handleReduceDate.bind(this);
    this.handleIncreaseDate = this.handleIncreaseDate.bind(this);
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

  handleReduceDate(event) {
    const currentMoment = moment(this.state.displayValue, 'DD-MM-YYYY', true);
    if (currentMoment.isValid()) {
      const newMoment = currentMoment.subtract(1, 'days');
      this.setState({displayValue: newMoment.format('DD-MM-YYYY')});
      this.props.onChangeDate(newMoment);
    }
  }

  handleIncreaseDate(event) {
    const currentMoment = moment(this.state.displayValue, 'DD-MM-YYYY', true);
    if (currentMoment.isValid()) {
      const newMoment = currentMoment.add(1, 'days');
      this.setState({displayValue: newMoment.format('DD-MM-YYYY')});
      this.props.onChangeDate(newMoment);
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text"
               value={this.state.displayValue}
               onChange={this.handleChange} />
        <button type="button" onClick={this.handleReduceDate}>
          {"<Back"}
        </button>
        <button type="button" onClick={this.handleIncreaseDate}>
          {"Forward>"}
        </button>
        <input type="submit" value="Change date" />
      </form>
    );
  }
}
