import React from 'react';
import './MapPiece.scss';
import { PieceCorner } from '../../entities/pieceCorner.entity';
import { MapPieceEntity } from '../../entities/mapPiece.entity';



class MapPieceEditorState {
    data?: MapPieceEntity;
}
export class MapPieceEditor extends React.Component<MapPieceEditorState>{
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <svg>
            </svg>
        );
    }
}

