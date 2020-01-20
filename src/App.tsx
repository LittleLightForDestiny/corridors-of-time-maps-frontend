import React from 'react';
import './App.css';
import { MapView } from './views/MapView/MapView';
import { MainMenu } from './components/MainMenu/MainMenu';
import { Router, Switch, Route, BrowserRouter, Redirect } from 'react-router-dom';
import { LoginView } from './views/LoginView/LoginView';
import { AddPieceView } from './views/AddPieceView/AddPieceView';



class App extends React.Component {
  state = {
    mapId: 0,
    loggedIn:false,
  };
  constructor(props: any) {
    super(props);
    
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Switch>
            <Route path="/login">
            </Route>
            <Route path="/*">
              <MainMenu></MainMenu>
            </Route>
          </Switch>
          <Switch>
            <Route path="/login">
              <LoginView></LoginView>
            </Route>
            <Route path="/map">
              <MapView></MapView>
            </Route>
            <Route path="/add-piece">
              <AddPieceView></AddPieceView>
            </Route>
            <Route path="/">
              <Redirect to="/map"></Redirect>
            </Route>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
