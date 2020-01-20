import React from 'react';
import { MapPiece } from '../../components/MapPiece/MapPiece';
import axios from 'axios';
import './MapView.scss';
import { CorridorMap } from '../../entities/corridorMap.entity';
import { TileSymbols } from '../../components/TileSymbols/TileSymbols';
import { PropagateLoader } from 'react-spinners';

class MapViewState {
    mapData?: CorridorMap;
    screenCenterX: number = 0;
    screenCenterY: number = 0;
    viewportX: number = 0;
    viewportY: number = 0;
    zoom: number = 1;
    isMouseDown: boolean = false;
    minX: number = 0;
    minY: number = 0;
    maxX: number = 0;
    maxY: number = 0;
    mapId: number = 0;
}


export class MapView extends React.Component<{}, MapViewState>{
    state = new MapViewState();
    constructor(props: any) {
        super(props);
        this.state = {
            screenCenterX: window.innerWidth / 2,
            screenCenterY: window.innerHeight / 2,
            viewportX: 0,
            viewportY: 0,
            zoom: 1,
            isMouseDown: false,
            minX: 0,
            minY: 0,
            maxX: 0,
            maxY: 0,
            mapId: 0
        };
        this.loadMap(this.state.mapId);
    }

    loadMap(id: number) {
        this.setState({ mapData: undefined, mapId: id });
        axios.get(`${process.env.REACT_APP_API_URL}/map/get-map?id=${id}`)
            .then(res => {
                var mapData = res.data as CorridorMap;
                var minX = 0;
                var maxX = 0;
                var minY = 0;
                var maxY = 0;
                mapData.pieces?.forEach((p) => {
                    minX = Math.min(minX, p.x ?? 0);
                    maxX = Math.max(maxX, p.x ?? 0);
                    minY = Math.min(minY, p.y ?? 0);
                    maxY = Math.max(maxY, p.y ?? 0);
                });
                this.setState({
                    mapData: res.data as CorridorMap,
                    minX: minX - 5,
                    maxX: maxX,
                    minY: minY - 5,
                    maxY: maxY,
                    viewportX: minX * 152,
                    viewportY: minY * 88
                });
            })
    }

    mouseDown() {
        this.setState({ isMouseDown: true });
    }

    mouseUp() {
        this.setState({ isMouseDown: false });

    }

    mouseMove(event: React.MouseEvent) {
        if (this.state.isMouseDown) {
            this.setState({
                viewportX: (this.state.viewportX ?? 0) + event.movementX * this.zoom,
                viewportY: (this.state.viewportY ?? 0) + event.movementY * this.zoom
            });
        }
    }

    mouseWheel(event: React.WheelEvent<SVGSVGElement>): void {
        var zoom = (this.state.zoom ?? 1) + event.deltaY * .005;
        zoom = Math.min(Math.max(zoom, .5), 10);
        this.setState({ zoom: zoom });
    }

    get screenCenterX(): number { return this.state.screenCenterX ?? 0 };
    get screenCenterY(): number { return this.state.screenCenterY ?? 0 };
    get viewportX(): number { return Math.min(this.state.viewportX ?? 0, 0) };
    get viewportY(): number { return Math.min(this.state.viewportY ?? 0, 0) };
    get zoom(): number { return this.state.zoom ?? 1 };
    get viewBoxLeft(): number { return 0 - this.viewportX };
    get viewBoxRight(): number { return this.screenCenterX * 2 * this.zoom };
    get viewBoxTop(): number { return 0 - this.viewportY };
    get viewBoxBottom(): number { return (this.screenCenterY * 2 - 60) * this.zoom };

    render() {
        if (!this.state?.mapData) {
            return <div className="centralized">
                <div className="loader-container">
                    <PropagateLoader size={10} color="white" ></PropagateLoader>
                </div>
                <div className="loading-info">
                    Loading
            </div>
            </div>;
        }
        return <div>
            <svg
                className={`map-view ${this.zoom > 1 ? 'low-zoom' : ''} ${this.zoom > 5 ? 'very-low-zoom' : ''}`}
                viewBox={`${this.viewBoxLeft} ${this.viewBoxTop} ${this.viewBoxRight} ${this.viewBoxBottom}`}
                width="100%" height="100%"
                onMouseDown={() => this.mouseDown()} onMouseUp={() => this.mouseUp()} onMouseMove={(ev) => this.mouseMove(ev)} onWheel={event => this.mouseWheel(event)}>
                <TileSymbols></TileSymbols>
                {
                    this.state.mapData.pieces?.filter((p, i) => {
                        var hexWidth = 152;
                        var hexHeight = 88;
                        var x = (-this.state.minX + (p.x ?? 0)) * hexWidth;
                        var y = (-this.state.minY + (p.y ?? 0)) * hexHeight;
                        if (x + hexWidth < this.viewBoxLeft) return false;
                        if (x - hexWidth > this.viewBoxLeft + this.viewBoxRight) return false;
                        if (y + hexHeight < this.viewBoxTop) return false;
                        if (y - hexHeight > this.viewBoxTop + this.viewBoxBottom) return false;
                        return true;
                    }).map((piece) => {
                        return <MapPiece mapBoundaries={{ minX: this.state.minX, minY: this.state.minY, maxX: this.state.minX, maxY: this.state.maxY }} key={piece.identifier} data={piece}></MapPiece>
                    })
                }
            </svg>
            <div className="map-menu">
                {
                    (this.state.mapId > 0 ? <div className="previous button" onClick={() => this.loadMap(this.state.mapId - 1)}>Previous</div> : <div></div>)
                }
                <div className="piece-count">{this.state.mapData.totalPieces} pieces</div>
                <div className="previous button" onClick={() => this.loadMap(this.state.mapId + 1)}>Next</div>
            </div>
        </div>;
    }
}

