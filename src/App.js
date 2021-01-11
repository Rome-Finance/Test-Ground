import React, { Component } from 'react';
import {BrowserRouter, NavLink, Route, Switch} from 'react-router-dom';

import Landing from './Landing';
import About from './About';
import Pools from './Pools';
import Navigation from './components/Navigation';
import Card from "react-bootstrap/Card";
import Rome_Cover from "./resources/Rome-cover.png";

/*
rome color hexes.
#990000 - red
#D4AF37 - yellow
 */

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div className="App" style={{
                    backgroundImage: `url(${Rome_Cover})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat'
                }}>
                    <header style={{
                        backgroundColor: 'transparent',
                        'min-height': '33vh'
                    }}> {/* vh stands for viewpoint height. Viewport = the browser window size. If the viewport is 50cm wide, 1vw = 0.5cm.*/}
                    </header>
                </div>
                <div>
                    <Card style={{
                        backgroundColor: 'black',
                        'flex-direction': 'row',
                        alignItems: "center",
                        display: "flex"
                    }}> {/* 'flex-direction': 'row' fixes all the problems I've been having! put this on components
                            in order to make them align horizontally before vertically. Its built into CSS and doesnt
                            even need to go as high level as react! works on most components
                             https://css-tricks.com/snippets/css/a-guide-to-flexbox/*/}
                        <Card style={{
                            backgroundColor: '#990000',
                        }}>
                            <NavLink to="/" style={{color: '#D4AF37'}}>Home</NavLink>
                        </Card>
                        <Card style={{
                            backgroundColor: '#990000',
                        }}>
                            <NavLink to="/about" style={{color: '#D4AF37'}}>About</NavLink>
                        </Card>
                        <Card style={{
                            backgroundColor: '#990000',
                        }}>
                            <NavLink to="/pools" style={{color: '#D4AF37'}}>Pools</NavLink>
                        </Card>
                    </Card>
                    <Switch>
                        <Route path="/" component={Landing} exact/>
                        <Route path="/about" component={About}/>
                        <Route path="/pools" component={Pools}/>
                    </Switch>
                    {/*<Route path="/stake" component={Stake}/>}*/}
                </div>
            </BrowserRouter>
        );
    }
}

export default App;