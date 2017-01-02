import React, { Component } from 'react';

export default class MinimalistSpinner extends Component {
  constructor(props) {
    super(props);

    this.characters = ["|", "/", "-", "\\"]
    this.state = {
      characterIndex: 0
    };

    this.tick = this.tick.bind(this);
  }

  tick() {
    this.setState({
      characterIndex: (this.state.characterIndex + 1) % this.characters.length
    });
  }

  componentDidMount() {
    this.intervalId = window.setInterval(this.tick, this.props.tickInterval);
  }

  componentWillUnmount() {
    window.clearInterval(this.intervalId);
  }

  render() {
    return (
      <span>{this.characters[this.state.characterIndex]}</span>
    );
  }
}
