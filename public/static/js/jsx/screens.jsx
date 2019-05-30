import React from 'react';
import styled from 'styled-components';

import is, {isNot} from 'styled-is';

import {ChromePicker} from 'react-color';

import * as calc from './calculations';
import { parseIcal } from './fileParse';
import { dataToTable, getWeek, getToday, timeToMinsString } from './utils';

import * as themes from './themes';

import bellTimesPdf from '../misc/belltimes.pdf';

const MainContent = styled.div`
    padding: 30px;
`;

const H1 = styled.h1`
    font-size: 2rem;
    margin: 0px;
    margin-left: 20px;

    color: ${props => props.theme.text};
`;
const H2 = H1.withComponent("h2").extend`
    margin-left: 0px;
    margin-top: 20px;
    font-size: 1.4rem;
`;

const P = styled.p`
    font-size: 1.2rem;

    color: ${props => props.theme.text};
`;

const CenteredH1 = H1.extend`
    margin-left: 0px;
    font-size: 2rem;
    text-align: center;

    margin-bottom: 20px;

    @media (min-width: 900px){
        font-size: 2.6rem;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);

        margin-bottom: 0px;

        ${props => props.isoffset?`
            left: 35%;
            width: 60%;
        `:``}
    }
`;

const Button = styled.button`
    border: 3px solid ${props => props.theme.text};
    background-color: ${props => props.theme.main};
    color: ${props => props.theme.background};

    border-radius: 5px;
    font-size: 1.5rem;
    padding: 10px;
    padding-left: 20px;
    padding-right: 20px;
    margin-left: 10px;
`;

const Select = styled.select`
    padding: 10px;
    font-size: 1.1rem;
    border-radius: 5px;

    background-color: ${props => props.theme.background};
    border: 2px solid ${props => props.theme.text};
    color: ${props => props.theme.text};

    margin-top: 20px;

    @media (min-width: 900px){
        margin: 0px;
    }
`;

const Option = styled.option`
    background-color: ${props => props.theme.text};
    color: ${props => props.theme.background};
`;

const Checkbox = styled.input.attrs({
    type: "checkbox"
})`
`;

const Bottom = styled.div`
    @media (min-width: 900px){
        position: absolute;
        bottom: 0px;
    }
`;

const LightButton = styled(Button)`
    background-color: transparent;
    color: ${props => props.theme.text};
    border: 2px solid ${props => props.theme.text};
    font-size: 0.9rem;
    padding: 0.5rem;
    margin-left: 3rem;
`;


export class HomeScreen extends React.Component {
    constructor(props){
        super(props);

        this.selectRef = React.createRef();
        this.formalRef = React.createRef();
    }
    
    handleWeekChange(){
        const isOdd = getWeek()%2 === 1;

        if(this.selectRef.current.value === "Week A"){
            this.props.setAIsOdd(isOdd);

            this.setState({
                ...this.state,
                aIsOdd:isOdd
            })
        }else {
            this.props.setAIsOdd(!isOdd);
            
            this.setState({
                ...this.state,
                aIsOdd:!isOdd
            })
        }
    }

    updateFormal(){
        // This updates if this day is formal assembly day.
        this.props.setIsFormal(this.formalRef.current.checked);
    }

    render(){
        const {aIsOdd, pData} = this.props;

        const currWeek = getWeek()%2===0?
            (aIsOdd?"Week B":"Week A"):/* Even and aIsOdd */
            (aIsOdd?"Week A":"Week B");// Odd and aIsOdd


        let todaysTimetable = null;
        if(pData){
            todaysTimetable = getToday(pData, currWeek, calc.getCurrPeriodId(this.props.isFormal));
        }

        let displayedMsg = 'error';
        const {timeLeftData} = this.props;
        if(timeLeftData.isWeekend){
            displayedMsg = 'No school on the weekend!';
        }else if(timeLeftData.isSchoolEnded){
            displayedMsg = 'School has ended for today!';
        }else {
            const minsWords = timeToMinsString(timeLeftData.minsDiff,false);
            if(timeLeftData.minsDiff === 1){
                displayedMsg = `There is 1 minute until ${timeLeftData.nextMsg}.`;
            }else {
                displayedMsg = `There are ${minsWords} until ${timeLeftData.nextMsg}.`;
            }
        }

        return (
            <MainContent>
                <CenteredH1 isoffset={Boolean(todaysTimetable)}>{displayedMsg}</CenteredH1>

                {todaysTimetable}

                <Select innerRef={this.selectRef} defaultValue={currWeek} onChange={()=>{this.handleWeekChange();}}>
                    <Option>Week A</Option>
                    <Option>Week B</Option>
                </Select>

                <LightButton onClick={()=>window.open(bellTimesPdf,'_blank')}>Bell times</LightButton>
                
                <Bottom>
                    <P>
                        <Checkbox innerRef={this.formalRef} onChange={()=>{this.updateFormal()}} /> Monday Formal Assembly Bell Times
                    </P>
                </Bottom>
            </MainContent>
        )
    }
}

const InvisFileInput = styled.input`
    position: absolute;
    z-index: -999;
    opacity: 0;
    width: 0.1px;
    height: 0.1px;
    left: -1px;
    top: -1px;
`;

const FileLabel = styled.label.attrs({
    htmlFor: 'fileInput'
})`
    background-color: ${props => props.theme.main};
    border: 3px solid ${props => props.theme.text};
    color: ${props => props.theme.background};
    
    border-radius: 5px;
    font-size: 1.5rem;
    padding: 10px;
    padding-left: 20px;
    padding-right: 20px;
    margin-left: 10px;
`;

const Li = styled.li`
    color: ${props => props.theme.text};
`

const TableArea = styled.div`
    overflow-x: scroll;
    @media (min-width: 900px){
        overflow-x: scroll;
    }
`

const GreyedOut = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 10;
`;
const EditBox = styled.div`
    position: absolute;

    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);

    background-color: ${props => props.theme.main};

    border-radius: 2rem;
    padding: 1rem;
    padding-left: 2rem;
    padding-right: 2rem;
    
    z-index: 11;

    display: flex;
    flex-direction: column;
`;
const ContrastP = P.extend`
    color: ${props => props.theme.background};

    ${is('small')`
        font-size: 1rem;
        margin: 0px;
    `}
`;
const MiniButton = LightButton.extend`
    background-color: ${props => props.theme.background};
    margin-left: 0px;
`;
const InputStyle = styled.input.attrs({
    type: 'text'
})`
    font-size: 1rem;
    background-color: ${props => props.theme.background};
    padding: 3px;
    border: 2px solid ${props => props.theme.text};
    color: ${props => props.theme.text};

    ${is('small')`
        width: 55px;
    `}

    ${isNot('small')`
        width: 140px;
    `}
`;
const MiniSelect = Select.extend`
    padding: 5px;
    font-size: 0.9rem;
    border-radius: 3px;

    background-color: ${props => props.theme.background};
    border: 2px solid ${props => props.theme.text};
    color: ${props => props.theme.text};

    margin: 0px;
`;

class EditingWindow extends React.Component {
    constructor(props){
        super(props);

        this.baseClassRef = React.createRef();
        this.classRef = React.createRef();
        this.roomRef = React.createRef();

        this.state = {
            baseClass: props.className
        }
    }

    handleBaseClassChange(){
        this.classRef.current.value = this.baseClassRef.current.value;

        this.setState({
            ...this.state,
            baseClass: this.baseClassRef.current.value
        })
    }

    render() {
        const {classes,room,cancel,change} = this.props;

        return (
            <GreyedOut>
                <EditBox>
                    <ContrastP>Edit Period:</ContrastP>

                    <ContrastP small>Class for this period:</ContrastP>
                    <MiniSelect innerRef={this.baseClassRef} defaultValue={this.state.baseClass} onChange={()=>this.handleBaseClassChange()}>
                        {
                            classes.map((currClass,i) => <Option key={i}>{currClass}</Option>)
                        }
                    </MiniSelect>

                    <ContrastP small>Class Name:</ContrastP>
                    <InputStyle defaultValue={this.state.baseClass} innerRef={this.classRef}/>

                    <ContrastP small>Room:</ContrastP>
                    <InputStyle small defaultValue={room} innerRef={this.roomRef}/>

                    <br/>

                    <MiniButton onClick={()=>{
                        change(this.state.baseClass, this.classRef.current.value, this.roomRef.current.value);
                    }}>Apply</MiniButton>
                    <MiniButton onClick={cancel}>Cancel</MiniButton>
                </EditBox>
            </GreyedOut>
        );
    }
}

export class ClassScreen extends React.Component {
    constructor(props){
        super(props);

        this.inputRef = React.createRef();

        this.editingTarget = {
            week: -1,
            dayId: -1,
            pId: -1
        }

        this.state = {
            editingData: false
        }
    }

    componentDidMount(){
        this.inputRef.current.addEventListener('change', ()=>{
            this.handleFileUpload(this.inputRef.current.files[0]);
        }, false);
    }

    handleFileUpload(file){
        parseIcal(file, (outData)=>{
            this.props.setPData(outData);
        });
    }

    showChangeDataScreen(week, dayId, pId){
        this.editingTarget.week = week;
        this.editingTarget.dayId = dayId;
        this.editingTarget.pId = pId;

        this.setState({...this.state, editingData: true});
    }

    render(){
        const {pData} = this.props;

        let timetable = null;
        if(pData){
            const tableA = dataToTable(pData, (week, dayId, pId)=>{
                this.showChangeDataScreen(week, dayId, pId);
            }, 0);

            const tableB = dataToTable(pData, (week, dayId, pId)=>{
                this.showChangeDataScreen(week, dayId, pId);
            }, 1);

            timetable = (
                <div>
                    <P>To edit timetable periods, click on the desired period below.</P>

                    <TableArea>
                        <P>Week A</P>
                        {tableA}

                        <P>Week B</P>
                        {tableB}

                        <br/><br/><br/>
                    </TableArea>
                </div>
            );
        }

        let editingWindow = null;
        if(this.state.editingData){
            const {week, dayId, pId} = this.editingTarget;

            const classIndex = pData.bodyData[week][dayId][pId].class;
            const className = pData.classes[classIndex];
            const room = pData.bodyData[week][dayId][pId].room;

            const cancel = ()=>{
                this.setState({...this.state, editingData: false});
            };

            const change = (baseClass, newClassName, newRoom)=>{
                const newPData = {...pData};

                const indexOfClass = newPData.classes.indexOf(baseClass);
                newPData.classes[indexOfClass] = newClassName;
                newPData.bodyData[week][dayId][pId].class = indexOfClass;
                newPData.bodyData[week][dayId][pId].room = newRoom;

                cancel();
                this.props.setPData(newPData);
            }

            editingWindow = <EditingWindow classes={pData.classes} className={className} room={room} cancel={cancel} change={change}/>;
        }

        return (
            <MainContent>
                <H1>Classes Edit</H1>

                {timetable}

                <P>
                    How to upload your timetable from Sentral:
                </P>
                    
                <ol>
                    <Li>Login to <a href="https://web3.girraween-h.schools.nsw.edu.au/portal/login">Sentral</a></Li>
                    <Li>Go to the Timetable tab</Li>
                    <Li>Click "Export as ICal"</Li>
                    <Li>Upload the downloaded iCal below</Li>
                </ol>

                <P>
                    PLEASE CHECK THAT YOUR TIMETABLE IS CORRECT AFTER UPLOADING.
                    SENTRAL'S ICAL GENERATOR IS INCONSISTENT, SO THERE MAY BE ERRORS
                    AFTER UPLOADING TO GIRRAWEEN COUNTDOWN.
                </P>

                <br/>

                <InvisFileInput innerRef={this.inputRef} type="file" id="fileInput" />
                <FileLabel>Upload ICal</FileLabel>

                { editingWindow }
            </MainContent>
        )
    }
}

const A = styled.a`
    color: ${props => props.theme.main};
`;

export class AboutScreen extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            creditsShown: false
        }
    }

    toggleCredits(){
        this.setState({
            ...this.state,
            creditsShown: !this.state.creditsShown
        });
    }

    render() {
        const emailTag = <A href="mailto: girraweencountdown@gmail.com">girraweencountdown@gmail.com</A>;

        return (
            <MainContent>
                <H1>About</H1>

                <H2>What is Girraween Countdown?</H2>
                <P>
                    Girraween Countdown is a simple countdown and timetable app for Girraween
                    High School. It is able to tells you how long until the end of the period,
                    and which periods you have on your timetable each day.
                    <br/>
                    It was made to be a tool for efficient learning, as easy access to the knowledge of how
                    long is left in the current period can lead to informed decisions when doing classroom
                    activities.
                </P>

                <H2>Feedback</H2>
                <P>
                    As Girraween Countdown is not for profit, all help is appreciated. If you find a bug,
                    or have suggestions and feedback, we would love to hear from you. Email us
                    at {emailTag}.
                </P>

                <H2>App</H2>
                <P>
                    We have a Girraween Countdown
                    app <A href="https://play.google.com/store/apps/details?id=com.moodragon46.girraween_countdown">on
                    the Google Play store for Android</A>. We do not currently have it on IOS
                    because of the cost (at the time of writing it is $99 for an Apple developer
                    account).
                </P>

                <H2>Removal of account syncing</H2>
                <P>
                    Recently, account syncing was removed from Girraween Countdown. The reason for this is that
                    it impeded progress in adding new features, added lots of small bugs that were hard to fix,
                    and generally didn't seem necessary. We also felt that the data stored online (which was
                    your timetable and your colour scheme) is easily to recreate if you lose your local data.
                </P>
            </MainContent>
        );
    }
}

const LineFlex = styled.div`
    display: flex;
    flex-direction: row;
`;

const AutoFlex = styled.div`
    display: flex;
    flex-direction: column;

    @media (min-width: 750px) {
        flex-direction: row;
    }
`

const ColSecHeading = P.extend`
    margin: 5px;
`;
const ColourSection = styled.div`
    padding: 20px;
    padding-top: 0px;
`;

const SchemeRadio = styled.input.attrs({
    type: 'radio',
    name: 'schemeRadio'
})`
    margin-top: 22px;
    margin-right: 10px;
`;

const ShortP = P.extend`
    margin-bottom: 0px;
`;


export const SettingsScreen = (props) => {
    const isDark = themes.compareTheme(props.rawTheme, themes.themes.dark);
    const isRed = themes.compareTheme(props.rawTheme, themes.themes.red);

    return (
        <MainContent>
            <H1>Settings</H1>

            <H2>Colour Scheme:</H2>

            <div>
                <LineFlex>
                    <SchemeRadio id="standard" defaultChecked={isDark} onClick={()=>{
                        props.changeTheme(themes.themes.dark);
                    }} />
                    <label htmlFor="standard">
                        <ShortP>Dark</ShortP>
                    </label>
                </LineFlex>
                <LineFlex>
                    <SchemeRadio id="red" defaultChecked={isRed} onClick={()=>{
                        props.changeTheme(themes.themes.red);
                    }} />
                    <label htmlFor="red">
                        <ShortP>Red</ShortP>
                    </label>
                </LineFlex>
                <LineFlex>
                    <SchemeRadio id="customCol" defaultChecked={!(isDark || isRed)} />
                    <label htmlFor="customCol">
                        <ShortP>Custom Colour Scheme:</ShortP>

                        <AutoFlex>
                            <ColourSection>
                                <ColSecHeading>Background Colour</ColSecHeading>
                                <ChromePicker disableAlpha={true} color={props.rawTheme.background} onChangeComplete={(val)=>{
                                    props.changeThemeVal('background', val.hex);
                                }} />
                            </ColourSection>
                            <ColourSection>
                                <ColSecHeading>Main Colour</ColSecHeading>
                                <ChromePicker disableAlpha={true} color={props.rawTheme.main} onChangeComplete={(val)=>{
                                    props.changeThemeVal('main', val.hex);
                                }} />
                            </ColourSection>
                            <ColourSection>
                                <ColSecHeading>Text Colour</ColSecHeading>
                                <ChromePicker disableAlpha={true} color={props.rawTheme.text} onChangeComplete={(val)=>{
                                    props.changeThemeVal('text', val.hex);
                                }} />
                            </ColourSection>
                        </AutoFlex>
                    </label>
                </LineFlex>
            </div>
        </MainContent>
    )
}



// WEBPACK FOOTER //
// ./src/jsx/screens.jsx