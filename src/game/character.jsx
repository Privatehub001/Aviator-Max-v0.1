import React, { Component, createRef } from 'react';
import { Stage, Container, Sprite, AnimatedSprite } from '@pixi/react';


class Character extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentNumber: 0,
      tileScale: { x: 1, x: 1 },
      spritePosition: {
        x: this.props.state.character && this.props.state.character.position.x,
        y: this.props.state.character && this.props.state.character.position.y,
      },
      previousspriteheight: this.props.state.character && this.props.state.character.position.y,
      game: props,
    };
    this.spriteRef = createRef();
  }

  componentDidMount() {
    this.props.app.ticker.add(this.update);
  }

  componentWillUnmount() {
    if (this.spriteRef.current) {
      this.spriteRef.current.destroy();
    }
    if (this.ticker) {
      this.ticker.stop();
    }
  }


  update = () => {
    this.setState({
      tileScale: {
        x: this.props.app.screen.width / 2000 / 1.8,
        y: this.props.app.screen.height / 1080 / 1.8
      }
      ,
    })
    if (this.props.state.character) {
      this.setState((prevState) => ({
        spritePosition: { ...prevState.spritePosition, x: (this.props.state.character.position.x / 1000) * this.props.app.screen.width }
      }));

      this.setState((prevState) => {
        return {
          spritePosition: {
            ...prevState.spritePosition,
            y: (this.props.state.character.position.y / 1000) * this.props.app.screen.height
          }
        };
      });
    }
  }

  render() {
    const { spritePosition } = this.state;
    return (
      <Container>
        {
           this.props.state.run && !this.props.state.jump && !this.props.state.land &&
          <AnimatedSprite
            anchor={0.5}
            textures={this.props.runArray}
            isPlaying={true}
            initialFrame={0}
            animationSpeed={0.4}
            loop={true}
            width={this.props.app.screen.width}
            height={this.props.app.screen.height}
            x={spritePosition.x}
            y={spritePosition.y}
            ref={this.spriteRef}
            scale={this.state.tileScale}
          />}
        {this.props.state.jump && <AnimatedSprite
          anchor={0.5}
          textures={this.props.jumpArray}
          isPlaying={true}
          initialFrame={0}
          animationSpeed={0.7}
          loop={false}
          width={this.props.app.screen.width}
          height={this.props.app.screen.height}
          x={spritePosition.x}
          y={spritePosition.y}
          ref={this.spriteRef}
          scale={this.state.tileScale}
        />}
        {this.props.state.land && <AnimatedSprite
          anchor={0.5}
          textures={this.props.landArray}
          isPlaying={true}
          initialFrame={0}
          animationSpeed={0.5}
          loop={false}
          width={this.props.app.screen.width}
          height={this.props.app.screen.height}
          x={spritePosition.x}
          y={spritePosition.y}
          ref={this.spriteRef}
          scale={this.state.tileScale}
        />}

      </Container>
    );
  }
}

export default Character;
