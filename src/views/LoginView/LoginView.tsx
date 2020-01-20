import React from 'react';
import axios from 'axios';
import './LoginView.scss';
import { PropagateLoader } from 'react-spinners';
import { Redirect } from 'react-router-dom';


export class LoginView extends React.Component {
    state = {
        logged: false,
    };
    constructor(props: any) {
        super(props);
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        var token: any;
        axios.post(`${process.env.REACT_APP_BUNGIE_BASE_URL}/Platform/App/OAuth/token/`,
            `client_id=${process.env.REACT_APP_BUNGIE_CLIENT_ID}&client_secret=${process.env.REACT_APP_BUNGIE_API_SECRET}&code=${code}&grant_type=authorization_code`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
            .then(res => {
                if (res.data.access_token) {
                    window.localStorage.setItem('bungie_token', JSON.stringify(res.data));
                    token = res.data;
                }
                return axios.get(`${process.env.REACT_APP_BUNGIE_BASE_URL}/Platform/User/GetMembershipsForCurrentUser/`,
                    {
                        headers: {
                            'X-API-Key': process.env.REACT_APP_BUNGIE_API_KEY,
                            'Authorization': `Bearer ${token?.access_token ?? ""}`
                        }
                    }
                )
            })
            .then((res) => {
                if (res.data.Response) {
                    window.localStorage.setItem('membership_info', JSON.stringify(res.data.Response));
                    this.setState({logged:true});
                }
            });
    }
    render() {
        if (this.state.logged) {
            return <Redirect to="/"></Redirect>
        }
        return <div className="centralized">
            <div className="loader-container">
                <PropagateLoader size={10} color="white" ></PropagateLoader>
            </div>
            <div className="loading-info">
                Authenticating
            </div>
        </div>
    }
}

