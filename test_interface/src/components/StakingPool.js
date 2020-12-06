import React, { Component } from "react";
import web3 from "../web3"
import {Card, Form} from "semantic-ui-react";
import Mushroom from "../Mushroom";
import Rome from "../Rome";
//import Card from 'react-bootstrap/Card'
//import Box from '@material-ui/core/Box';
import { Grid, Paper } from '@material-ui/core';


function callBack(err, result) {
    console.warn(result);
}

class StakingPool extends Component{

    /*
    Making this class general instead of specific contracts thoughts

    Approve token, and staking pool are the two contracts we use in this invest function
    Liquidate only uses the staking pool, so it should be easy to just put both stake and unstake javascript functions into the same component file

    To pass contracts in props, we need staking token contract (#1) and staking pool itself contract (#2)
    Two contracts need to be passed in props to render this component

    Component needs easier button layout so stake and unstake are near to each other, and look nice with text box and $ display of expected value or something

    Maybes
        -make component open modal to do trades.
            Pros
            -saves space on page
            Cons
            -Makes user navigate another menu

     */



    constructor(props){
        super(props);
        this.state={
            amount : 0,
            waitingOnContract: false
        };

        //have to bind functions to this. still dont know why after all these projects lmao,
        //but dont forget it or things break!
        this.ButtonText = this.ButtonText.bind(this);
        /*
        Do not call the update function in the constructor. Only the render function is called when the
        parent tells child to rerender, so anything in the constructor will not be called again.
         */

    }



    stake = async event =>{
        event.preventDefault();
        try {
            var accounts;
            this.props.UpdateWaitingOnContract(true);
            await web3.eth.getAccounts().then(function(acc){ accounts = acc })
            //console.log(accounts[0]);
            const weiValue = web3.utils.toWei(this.state.amount, 'ether');
            let StakingTokenContract = this.props.TokenContract;
            let StakingPoolContract = this.props.PoolContract;
            await StakingTokenContract.methods.approve(Mushroom.options.address, weiValue).send({from: accounts[0]});
            await StakingPoolContract.methods.stake(weiValue).send({from: accounts[0]});
            this.props.UpdateWaitingOnContract(false);
            this.props.Update();
        } catch (err) {
            console.log("ERROR IN SENDING TO CHAIN " + err);
            this.props.UpdateWaitingOnContract(false);
        }
    }


    unstake = async event => {
        event.preventDefault();
        try {
            this.props.UpdateWaitingOnContract(true);
            var accounts;
            await web3.eth.getAccounts().then(function (acc) {
                accounts = acc
            })
            //console.log(accounts[0]);
            const weiValue = web3.utils.toWei(this.state.amount, 'ether');
            let StakingPoolContract = this.props.PoolContract;
            await StakingPoolContract.methods.unstake(weiValue).send({from: accounts[0]});
            // batches let you put more than one transaction together to be processed at one
            // need them for approve transfer, then transferfrom when using erc tokens
            this.props.UpdateWaitingOnContract(false);
            this.props.Update();
        } catch (err) {
            console.log("ERROR IN SENDING TO CHAIN " + err);
            this.props.UpdateWaitingOnContract(false);
        }
    }


        /*
        Dynamically render the button to have different text on it when the contract is waiting for transactions to come back

        this function returns a div, which allows it to be passed as a component, and for me to type in words without a string
        could maybe do the same thing without div and passing a literal string, then dealing with string in render,
        but this way seems to look a feel cleaner
         */
    ButtonText(text) {
        if (this.props.waitingOnContract) {
            return <div>Waiting on Transactions.............</div>;
        }
        return text;
    }



    render() {
        /*
        Anything that needs to happen every rerender need to get called here before the return!!!
         */
        return(
            <div>
                <Card style={{
                    backgroundColor: '#fd00ff'
                }}>


                    <h4 style={{ color: 'Black', fluid: false }}>USDC</h4 >
                    {/*
                     Form that updates a value in order for the chain call function to know how much
                     to put into the invest function of the contract when its called later on the button press

                     uses an event because the event will contain what value the text box's contents just changed to
                     I think it makes it faster or something. Could maybe do it with just using the value of
                     the text box input and throwing it into onchange without the event?
                     Maybe the only way to get the value out is with event? Maybe just fancy pants programmer code
                     back from jordan in ecocap that doesnt need to be that complex?

                    */}
                    <Form.Field >
                        <input
                            style={{width:'80%'}}
                            placeholder="How many USDC tokens would you like to invest?"
                            onChange={event =>
                                this.setState({
                                    amount: event.target.value
                                })
                            }
                        />
                    </Form.Field>
                    {/*
                     Buttons that calls functions to send stake or unstake transactions to chain
                    */}
                    <button id={'stake'} className={'btn btn-md btn-success'} disabled={this.props.waitingOnContract} style={{color:'black'}} onClick={this.stake}>
                        <span>{this.ButtonText(<div>Stake</div>)}</span>
                    </button>
                    <button id={'unstake'} className={'btn btn-md btn-success'} disabled={this.props.waitingOnContract} style={{color:'black'}} onClick={this.unstake}>
                        <span>{this.ButtonText(<div>Unstake</div>)}</span>
                    </button>

                </Card>
            </div>
        )
    }
};
export default StakingPool;
