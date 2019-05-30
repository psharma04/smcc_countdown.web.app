import React from 'react';
import styled from 'styled-components';

import favicon from '../imgs/favicon.png';


const MenuBarStyled = styled.div`
    background-color: ${props => props.theme.main};
    padding: 10px;

    display: flex;
    flex-direction: column;

    @media (min-width: 900px) {
        flex-direction: row;
    }
`;

const BarStart = styled.div`
    display: flex;

    flex-grow: 1;
`;

const Icon = styled.img.attrs({
    src: favicon
})`
    height: 34px;
    margin-right: 10px;

    @media (max-width: 360px) {
        height: 28px;
    }
    @media (min-width: 390px) {
        height: 40px;
    }
`;

const H1 = styled.h1`
    font-size: 1.8rem;
    color: ${props => props.theme.background};
    margin: 0px;

    @media (max-width: 360px) {
        font-size: 1.5rem;
    }
    @media (min-width: 390px) {
        font-size: 2rem;
    }
`;

const NavHolder = styled.div`
    display: flex;
    background-color: ${props => props.theme.main};
    z-index: 1;

    flex-direction: column;
    opacity: ${props => props.showing?1:0};
    pointer-events: ${props => props.showing?'auto':'none'};
    position: absolute;
    left: 0px;
    width: 100%;
    top: 53px;

    padding-bottom: 10px;
    padding-top: 10px;

    @media (max-width: 360px) {
        top: 47px;
    }
    @media (min-width: 900px) {
        flex-direction: row;
        opacity: 1;
        pointer-events: auto;
        position: static;
        width: auto;

        padding-top: 0px;
        padding-bottom: 0px;
    }
`;

const NavButton = styled.button`
    border: none;
    background-color: transparent;
    color: ${props => props.theme.background};
    font-size: 1.3rem;

    @media (min-width: 900px) {
        margin-left: 20px;
    }
`;

export class MenuBar extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            showing: false
        };
    }

    toggleShowing(){
        this.setState({...this.state, showing: !this.state.showing});
    }

    changeScreen(screen){
        this.setState({...this.state, showing: false});
        this.props.changeScreen(screen);
    }

    render () {
        return (
            <MenuBarStyled>
                <BarStart onClick={()=>{
                    this.toggleShowing();
                }}>
                    <Icon />

                    <H1>Girraween Countdown</H1>
                </BarStart>

                <NavHolder showing={this.state.showing}>
                    <NavButton onClick={()=>{this.changeScreen("home")}}>Home</NavButton>
                    <NavButton onClick={()=>{this.changeScreen("classEdit")}}>Edit Classes</NavButton>
                    <NavButton onClick={()=>{this.changeScreen("about")}}>About</NavButton>
                    <NavButton onClick={()=>{this.changeScreen("settings")}}>Settings</NavButton>
                </NavHolder>
            </MenuBarStyled>
        )
    }
}


// WEBPACK FOOTER //
// ./src/jsx/components.jsx