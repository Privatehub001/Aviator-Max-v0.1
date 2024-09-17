import React, { Component, createRef } from 'react';
import { Stage, Container, Text } from '@pixi/react';
import * as PIXI from 'pixi.js';

class Count extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentNumber: 0
    };
    this.containerRef = createRef();
  }

  componentDidMount() {
    this.props.app.ticker.add(this.update);
  }

  componentWillUnmount() {
    if (this.containerRef.current) {
      this.containerRef.current.destroy();
    }
  }

  componentDidUpdate(prevProps, prevState) {
   
    if (prevState.currentNumber !== this.state.currentNumber && this.props.state.count) {
      this.currentNumber = this.props.state.count.toFixed(2) + "X";
    }
  }

  update = () => {
    this.setState({ currentNumber: parseFloat(this.props.state.count).toFixed(2) });
  }

  render() {
    return (
        <Container ref={this.containerRef} x={this.props.app.screen.width/2.2} y={this.props.app.screen.height/6}>
          <Text
            text={this.state.currentNumber + "X"}
            style={
              new PIXI.TextStyle({
                fontFamily: 'Arial',
                fontSize: 30,
                fontWeight:650 ,
                fontStyle: 'italic',
                stroke: '#4a1850',
                dropShadowColor: '#000000',
                dropShadowBlur: 4,
                dropShadowAngle: Math.PI / 6,
                dropShadowDistance: 6,
                wordWrap: true,
                wordWrapWidth: 440,
              })
            }
          />
        </Container>
    );
  }
}

export default Count;
