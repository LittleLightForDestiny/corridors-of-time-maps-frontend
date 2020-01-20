import React from 'react';
import './MapPiece.scss';
import { PieceCorner } from '../../entities/pieceCorner.entity';
import { MapPieceEntity } from '../../entities/mapPiece.entity';

interface MapBoundaries{
    minX:number;
    minY:number;
    maxX:number;
    maxY:number;
}

class MapPieceProps {
    data?: MapPieceEntity;
    zoom?: number;
    mapBoundaries:MapBoundaries = {
        minX:0,
        minY:0,
        maxX:0,
        maxY:0
    };
}
export class MapPiece extends React.Component<MapPieceProps>{
    defaultSize: number = 100;

    constructor(props: MapPieceProps) {
        super(props);
    }

    render() {
        return (
            <g className={this.zoom < .8 ? 'low-zoom' : ''}>
                <polygon className="map-piece" points={this.hexPoints()} />
                {this.props.data?.corners?.map((corner) => {
                    return this.renderText(corner);
                })}
                {this.renderCenterIcon()}
                {this.renderWalls()}
            </g>
        );
    }

    renderText(corner: PieceCorner) {
        if (this.zoom < .8) {
            return <div key={corner.order}></div>
        }
        var x = this.centerX;
        var y = this.centerY;
        var transform = '';
        switch (corner.order) {
            case 0:
                x = this.centerX + this.defaultSize * .6;
                y = this.centerY - this.defaultSize * .35;
                transform = `rotate(60, ${x}, ${y})`;
                break;
            case 1:
                x = this.centerX + this.defaultSize * .62 + 8;
                y = this.centerY + this.defaultSize * .33 + 8;
                transform = `rotate(300, ${x}, ${y})`;
                break;
            case 2:
                y = this.centerY + this.defaultSize * .8;
                break;

            case 3:
                x = this.centerX - this.defaultSize * .62 - 8;
                y = this.centerY + this.defaultSize * .33 + 8;
                transform = `rotate(60, ${x}, ${y})`;
                break;

            case 4:
                x = this.centerX - this.defaultSize * .6;
                y = this.centerY - this.defaultSize * .35;
                transform = `rotate(300, ${x}, ${y})`;
                break;

            case 5:
                y = this.centerY - this.defaultSize * .7;
                break;

        }

        return <text transform={transform} className="corner-code" key={corner.order} x={x} y={y}>{corner.code}</text>;
    }

    renderCenterIcon() {
        var icon;
        switch (this.props.data?.center?.toUpperCase()) {
            case "B":
                return <div></div>;
            case "D":
                icon = "diamond";
                break;
            case "C":
                icon = "clover";
                break;
            case "S":
                icon = "snake";
                break;
            case "P":
                icon = "plus";
                break;
            case "H":
                icon = "hex";
                break;
        }
        return <use className="tile-icon" href={"#" + icon} x={this.centerX - 45*this.zoom} y={this.centerY - 45*this.zoom} width={90 * this.zoom} height={90 * this.zoom}></use>
    }

    renderWalls() {
        var points:number[][] = [];
        var pointsInner:number[][] = [];
        for (var theta = 0; theta < Math.PI * 2; theta += Math.PI / 3) {
            var pointX, pointY, pointInnerX, pointInnerY;
            
            pointX = this.centerX + this.defaultSize * Math.cos(theta - Math.PI/3);
            pointY = this.centerY + this.defaultSize * Math.sin(theta - Math.PI/3);
            
            pointInnerX = this.centerX + this.defaultSize*.7 * Math.cos(theta - Math.PI/3);
            pointInnerY = this.centerY + this.defaultSize*.7 * Math.sin(theta - Math.PI/3);
            points.push([pointX, pointY]);
            pointsInner.push([pointInnerX, pointInnerY]);
        }
        var walls:string[] = (this.props.data?.walls ?? "").split("");
        return walls.map((v, i)=>{
            if(parseInt(v)){
                return <g key={'wall'+i}>
                    <line className="map-piece-wall inner" x1={pointsInner[i][0]} x2={pointsInner[i+1][0]} y1={pointsInner[i][1]} y2={pointsInner[i+1][1]} />
                    <line className="map-piece-wall outer" x1={points[i][0]} x2={points[i+1][0]} y1={points[i][1]} y2={points[i+1][1]} />
                </g>
            }
            return <div key={'wall'+i}></div>;
        });

        

    }

    get x(): number { return this.props.data?.x ?? 0 };
    get y(): number { return this.props.data?.y ?? 0 };
    get centerX(): number { return (-this.props.mapBoundaries.minX + this.x) * this.defaultSize * 1.52 }
    get centerY(): number { return (-this.props.mapBoundaries.minY + this.y) * this.defaultSize * .88 }
    get zoom():number {return this.props.zoom ?? 1}

    hexPoints() {
        var points = [];
        for (var theta = 0; theta < Math.PI * 2; theta += Math.PI / 3) {
            var pointX, pointY;

            pointX = this.centerX + this.defaultSize * Math.cos(theta);
            pointY = this.centerY + this.defaultSize * Math.sin(theta);

            points.push(pointX + ',' + pointY);
        }

        return points.join(' ');
    }
}

