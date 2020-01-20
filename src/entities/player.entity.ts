import { PieceOwnership } from "./pieceOwnership.entity";

export class Player {
    public membershipId?: string;
    public name?: string;
    public pieces?: PieceOwnership[];
    public blocked?: boolean;
    public moderator?: boolean;
    public sysAdmin?: boolean;
}