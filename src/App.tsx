import React from 'react';
import './App.css';
import { MapView } from './views/MapView/MapView';
import { MainMenu } from './components/MainMenu/MainMenu';
import { Router, Switch, Route, BrowserRouter, Redirect } from 'react-router-dom';
import { LoginView } from './views/LoginView/LoginView';



class App extends React.Component {
  state = {
    mapId: 1
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
              <LoginView></LoginView>
            </Route>
            <Route path="/map">
              <MapView mapId={this.state.mapId}></MapView>
            </Route>
            <Route path="/">
              <Redirect to="/map"></Redirect>
            </Route>
          </Switch>
          <Switch>
            <Route path="/login">
            </Route>
            <Route path="/*">
              <MainMenu></MainMenu>
            </Route>

          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
