import React from 'react';
import {ReactComponent as Cauldron} from './Cauldron.svg';
import {ReactComponent as Clover} from './Clover.svg';
import {ReactComponent as Diamond} from './Diamond.svg';
import {ReactComponent as Hex} from './Hex.svg';
import {ReactComponent as Plus} from './Plus.svg';
import {ReactComponent as Snake} from './Diamond.svg';
export class TileSymbols extends React.Component {
    render() {
        return (
            <g>
                <Cauldron></Cauldron>
                <Clover></Clover>
                <Diamond></Diamond>
                <Hex></Hex>
                <Plus></Plus>
                <Snake></Snake>
            </g>);
    }
}

