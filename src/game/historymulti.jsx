import React, { Component, createRef } from 'react';
import { Container, Text, Graphics } from '@pixi/react';
import * as PIXI from 'pixi.js';

class Multipliers extends Component {
  constructor(props) {
    super(props);
    this.containerRef = createRef();
  }

  componentWillUnmount() {
    if (this.containerRef.current) {
      this.containerRef.current.destroy();
    }
  }

  getColor = (multiplier) => {
    if (multiplier > 5) return '#2E7D32'; 
    if (multiplier > 3) return '#F57C00';
    if (multiplier > 1) return '#D84315'; 
    return '#C62828'; 
  };

  drawBackground = (g) => {
    const width =  this.props.app.screen.width*3;
    const height = 40;
    if(window.innerWidth>=1000){
      g.clear();
    g.beginFill(0x000000, 0.5);
    g.drawRect(0, 0, width, height);
    g.endFill();}
  };

  render() {
    const { history, app } = this.props;

    return (
      <Container ref={this.containerRef} x={0} y={app.screen.height-40}>
        <Graphics draw={this.drawBackground} />
        {history && history.map((entry, index) => (
          <Text
            key={index}
            text={entry.multiplier.toFixed(2) + "x"}
            style={
              new PIXI.TextStyle({
                fontFamily: 'Arial',
                fontSize: window.innerWidth<1000?14:20,
                fontWeight: 650,
                fill: this.getColor(entry.multiplier), 
                stroke: '#4a1850',
                dropShadow: true,
                dropShadowColor: '#000000',
                dropShadowBlur: 4,
                dropShadowAngle: Math.PI / 6,
                dropShadowDistance: 6,
                wordWrap: true,
                wordWrapWidth: 440,
              })
            }
            x={index * (window.innerWidth>=1000?100:80)} 
            y={10} 
          />
        ))}
      </Container>
    );
  }
}

export default Multipliers;
