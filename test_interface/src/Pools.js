import logo from './logo.svg';
import './App.css';
import web3 from "./web3";
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Card, Form} from "semantic-ui-react";
import {Component, React, Text} from "react";
import Dashboard from "./components/Dashboard";
import Mushroom from "./Mushroom";
import Rome from "./Rome";
import { flexbox } from '@material-ui/system';
import Box from '@material-ui/core/Box';
import pools from './resources/pools.jpg';


//here and not in style sheet because css doesnt like text-shadow 33cd0c 35FFEC
const radiantWhite = {color: 'white', margin: 0, 'text-shadow': '0px 0px 2px #35FFEC'}


class Pools extends Component{



    constructor(props) {
        super(props);
    }

    render() {
        return (
            //set mushroom forest background, make it fill screen

            <header className="Pool-header">
                <br/><br/><br/><br/>
                <h1 style={radiantWhite}> {/* neat white text with blue fading outline */}
                    Welcome to Rome Finance
                    <br/>
                    Join the Empire
                </h1>
            </header>

        );
    }
}

export default Pools;


/*
style={ {
                    backgroundImage: `url(${pools})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'contain, cover',
                    backgroundRepeat: 'no-repeat'
                }}
 */