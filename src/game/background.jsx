import { Container, TilingSprite } from '@pixi/react';
import road from '../assets/road.png';
import houses from '../assets/house-n-all.png';
import mountains from '../assets/bg-mountains.png';
import sky from '../assets/bg-sky.png';
import clouds from '../assets/clouds.png';
import { Component } from 'react';


class Background extends Component {
  count = 0;
  constructor(props) {
    super(props);
    this. state = {
      tileScale0: { x: 1, y: 0.5 },
      tilePosition0: { x: 0, y: 0 },
      tilePosition1: { x: 0, y: 0 },
      tilePosition2: { x: 0, y: 0 },
      tilePosition3: { x: 0, y: 0 },
      tilePosition4: { x: 0, y: 0 }
    };
  }

 

  componentDidMount() {
    if(this.props.app.ticker)
    this.props.app.ticker.add(this.tick);
  }

  componentWillUnmount() {
    if(this.props.app.ticker)
    this.props.app.ticker.remove(this.tick);
  }

  tick = () => {
   if(this.props.state.background){ this.setState(state => ({
      tileScale0: {
        x: this.props.app.screen.width/2000,
        y: this.props.app.screen.height/1080
      },
      tilePosition0: {
        x: this.props.state.background.tilePosition0.x,
      },
      tilePosition1: {
        x: this.props.state.background.tilePosition1.x,
      },
      tilePosition2: {
        x: this.props.state.background.tilePosition2.x,
      },
      tilePosition3: {
        x: this.props.state.background.tilePosition3.x,
      },
      tilePosition4: {
        x: this.props.state.background.tilePosition4.x, 
      },
      
    }));}
  };

  render() {
    return (
    <Container>
       <TilingSprite
        image={sky}
        width={this.props.app.screen.width}
        height={this.props.app.screen.height}
        tilePosition={this.state.tilePosition0}
        tileScale={this.state.tileScale0}
      />
      <TilingSprite
        image={clouds}
        width={this.props.app.screen.width}
        height={this.props.app.screen.height}
        tilePosition={this.state.tilePosition1}
        tileScale={this.state.tileScale0}
      />

      <TilingSprite
        image={mountains}
        width={this.props.app.screen.width}
        height={this.props.app.screen.height}
        tilePosition={this.state.tilePosition2}
        tileScale={this.state.tileScale0}
      />
      <TilingSprite
        image={houses}
        width={this.props.app.screen.width}
        height={this.props.app.screen.height}
        tilePosition={this.state.tilePosition3}
        tileScale={this.state.tileScale0}
      />
      <TilingSprite
        image={road}
        width={this.props.app.screen.width}
        height={this.props.app.screen.height}
        tilePosition={this.state.tilePosition4}
        tileScale={this.state.tileScale0}
      />
    </Container>
    );
  }
}
export default Background;