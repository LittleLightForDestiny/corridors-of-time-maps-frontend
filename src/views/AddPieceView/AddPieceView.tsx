import React from 'react';
import './AddPieceView.scss';
import { MapPieceEntity } from '../../entities/mapPiece.entity';
import { MapPiece } from '../../components/MapPiece/MapPiece';
import { TileSymbols } from '../../components/TileSymbols/TileSymbols';
import { PieceCorner } from '../../entities/pieceCorner.entity';
import axios from 'axios';
import { PropagateLoader } from 'react-spinners';
import { CreateMapPieceDto } from '../../entities/createMapPieceDto';

interface AddPieceViewState {
    jsonString: string;
    data?: MapPieceEntity;
    sending: boolean;
    feedback?: string;
}

export class AddPieceView extends React.Component<{}, AddPieceViewState> {
    constructor(props: any) {
        super(props);
        this.state = {
            jsonString: "",
            sending: false,
        };
    }
    render() {
        if (this.state.sending) {
            return <div className="centralized">
                <div className="loader-container">
                    <PropagateLoader size={10} color="white" ></PropagateLoader>
                </div>
                <div className="loading-info">
                    Saving...
            </div>
            </div>
        }

        if (this.state.feedback) {
            return <div className="centralized">
                <div className="instructions">{this.state.feedback}</div>
                <div className="button" onClick={() => this.setState({ feedback: undefined })}>OK</div>
                
            </div>
        }
        return (
            <div className="add-piece-form">
                <div className="w-50">
                    <div className="instructions">
                        go to <a href="https://tjl.co/corridors-of-time/" target="_blank">https://tjl.co/corridors-of-time/</a>, transcribe your image and add your screenshot along with it.
                        copy the raw JSON and paste it here, then click submit.
                        after doing that, your piece will be processed and added to the full map.
                </div>
                    <textarea className="data-field" name="data" value={this.state.jsonString} onChange={(ev) => this.dataChanged(ev.currentTarget.value)}></textarea>
                    <button className="button" type="submit" onClick={(event) => this.sendData()}>Submit</button>
                </div>
                <div className="w-50">
                    <img className="preview-img" src={this.state.data?.evidenceUrl} />
                    <svg width="200px" height="200px" viewBox="0 0 200 200">
                        <TileSymbols></TileSymbols>
                        <MapPiece mapBoundaries={{ minX: -.66, minY: -1, maxX: 1, maxY: 1 }} data={this.state.data}></MapPiece>
                    </svg>
                </div>
            </div>);
    }

    dataChanged(jsonString: string) {
        var json: any = JSON.parse(jsonString);
        var data: MapPieceEntity = new MapPieceEntity();
        data.center = json.center;
        data.walls = json.walls.map((w: boolean) => w ? 1 : 0).join("");
        data.evidenceUrl = json.image;
        data.corners = json.nodes.map((n: string[], i: number) => {
            var corner: PieceCorner = {
                code: n.join(""),
                order: i,
            }
            return corner;
        });
        this.setState({
            jsonString: jsonString,
            data: data
        })
    }

    async sendData() {
        if (!this.state.data) {
            return;
        }
        this.setState({ sending: true });
        let token = JSON.parse(window.localStorage.getItem('bungie_token') ?? "{}");
        var dto:CreateMapPieceDto = {
            center:this.state.data.center,
            corners:this.state.data.corners?.map((c)=>c.code ?? "") ?? [],
            evidenceUrl:this.state.data.evidenceUrl,
            walls:this.state.data.walls,
        };
        try{
        var response = await axios.post(`${process.env.REACT_APP_API_URL}/map-piece/create`, dto, {
            headers:{
                'authorization':`Bearer ${token.access_token}`
            }
        });
        this.setState({
            sending: false,
            feedback: response.data.message ?? response.data.error
        });
        }catch(e){
            this.setState({
                sending: false,
                feedback: e.message ?? "There was an error sending this piece"
            });
        }
    }
}

