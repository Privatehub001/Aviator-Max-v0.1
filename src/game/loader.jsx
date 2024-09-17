import React from 'react';
import { Container, Graphics } from '@pixi/react';

const Loader = ({ width, height, state }) => {
    const loaderWidth = width/2;
    const loaderHeight = height/40;

    return (
        state.wait && <Container x={(width / 2 - loaderWidth / 2)} y={(height - loaderHeight * 2-30)}>
            <Graphics
                draw={(g) => {
                    g.clear();
                    g.beginFill(0xcccccc);
                    g.drawRect(0, 0, loaderWidth, loaderHeight);
                    g.endFill();
                }}
            />
            <Graphics
                draw={(g) => {
                    g.clear();
                    g.beginFill(0x66ccff);
                    g.drawRect(0, 0, loaderWidth * state.progress, loaderHeight);
                    g.endFill();
                }}
            />
        </Container>
    );
};

export default Loader;
