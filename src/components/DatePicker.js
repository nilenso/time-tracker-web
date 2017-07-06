import React, { Component } from 'react';
import moment from 'moment';

export default class DatePicker extends Component {
  constructor(props) {
    super(props);

    this.state = this.stateFromProps(props);

    this.handleOnSetDate = this.handleOnSetDate.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleReduceDate = this.handleReduceDate.bind(this);
    this.handleIncreaseDate = this.handleIncreaseDate.bind(this);
  }

  stateFromProps(props) {
    return {
      displayValue: props.defaultMoment.format('DD-MM-YYYY')
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState(this.stateFromProps(newProps));
  }

  handleChange(event) {
    this.setState({displayValue: event.target.value});
    const newMoment = moment(event.target.value, 'DD-MM-YYYY', true);
    if (newMoment.isValid()) {
      this.props.onChangeDate(newMoment);
    }
    event.preventDefault();
  }

  handleOnSetDate(event) {
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
      <div>
        <input type="text"
               value={this.state.displayValue}
               onChange={this.handleChange} />
        <button type="button" onClick={this.handleReduceDate}>
          {"<Back"}
        </button>
        <button type="button" onClick={this.handleIncreaseDate}>
          {"Forward>"}
        </button>
      </div>
    );
  }
}
