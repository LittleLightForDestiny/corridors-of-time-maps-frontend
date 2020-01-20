import { PieceCorner } from './pieceCorner.entity';
import { PieceOwnership } from './pieceOwnership.entity';
import { CorridorMap } from './corridorMap.entity';

export class MapPieceEntity {
    public identifier?: string;
    public center?: string;
    public walls?: string;
    public corners?: PieceCorner[];
    public owners?: PieceOwnership[];
    public map?:CorridorMap;
    public x?:number;
    public y?:number;
    public approved?: boolean;
    public evidenceUrl?:string;
}