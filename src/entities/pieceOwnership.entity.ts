import { MapPieceEntity } from "./mapPiece.entity";
import { Player } from "./player.entity";

export class PieceOwnership{
    id?: number;
    public evidenceImage?: string;
    public owner?: Player;
    public piece?: MapPieceEntity;
}