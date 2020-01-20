import React from 'react';
import './MainMenu.scss';
import axios from 'axios';
import { UserMembershipData } from 'bungie-api-ts/user/interfaces';
import { Link, NavLink } from 'react-router-dom';

class MainMenuState {
    membership?: UserMembershipData;
}

export class MainMenu extends React.Component {
    state = new MainMenuState();
    constructor(props: any) {
        super(props);
        var membership: UserMembershipData = JSON.parse(window.localStorage.getItem('membership_info') ?? "{}");
        this.state = {
            membership: membership
        };

        this.refreshToken();
    }

    async refreshToken(){
        var token = JSON.parse(window.localStorage.getItem('bungie_token') ?? "{}");
        var refreshToken = token.refresh_token;
        if(!refreshToken) return;
        var res = await axios.post(`${process.env.REACT_APP_BUNGIE_BASE_URL}/Platform/App/OAuth/token/`,
            `client_id=${process.env.REACT_APP_BUNGIE_CLIENT_ID}&client_secret=${process.env.REACT_APP_BUNGIE_API_SECRET}&refresh_token=${refreshToken}&grant_type=refresh_token`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })    
        if (res.data.access_token) {
            window.localStorage.setItem('bungie_token', JSON.stringify(res.data));
        }
    }

    isLogged() {
        return (this.state.membership?.destinyMemberships?.length ?? 0) > 0;
    }
    render() {
        return (
            <div className="main-menu">
                <div className="left">
                    {this.getLeftSideItems()}
                </div>
                <div className="right">
                    {this.getRightSideItems()}
                </div>
            </div>
        );
    }

    getLeftSideItems() {
        if (!this.isLogged) {
            return <div></div>;
        }
        return (
            <div>
                <NavLink className="main-menu-link" to="/map">Map</NavLink>
                <NavLink className="main-menu-link" to="/add-piece">Add Piece</NavLink>
            </div>
        );
    }

    getRightSideItems() {
        var destinyMembership = this.state.membership?.destinyMemberships?.sort((a, b) => {
            return (a.applicableMembershipTypes?.length ?? 0) - (b.applicableMembershipTypes?.length ?? 0);
        })[0];
        if (this.isLogged()) {
            return <div>Logged as {destinyMembership?.LastSeenDisplayName}</div>;
        } else {
            return <a href={this.getAuthURL()} className="button">Login with Bungie to contribute</a>;
        }
    }

    getAuthURL(): string {
        return `${process.env.REACT_APP_BUNGIE_BASE_URL}/en/OAuth/Authorize?client_id=${process.env.REACT_APP_BUNGIE_CLIENT_ID}&response_type=code`
    }
}

