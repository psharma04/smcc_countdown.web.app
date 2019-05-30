import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import {
    ThemeProvider
} from 'styled-components';

import * as serviceWorker from './serviceWorker';

import './index.css';

import {
    MenuBar
} from './jsx/components';
import {
    HomeScreen,
    ClassScreen,
    SettingsScreen,
    AboutScreen
} from './jsx/screens';
import * as calc from './jsx/calculations';

import {
    themes,
    saveTheme,
    getTheme
} from './jsx/themes';
import {
    timeToMinsString
} from './jsx/utils';


const BackgroundMain = styled.div `
    background-color: ${props => props.theme.background};
    min-height: 100vh;
`;

class App extends React.Component {
    constructor(props) {
        super(props);

        this.firstLoad = true;

        let theme = themes.dark;

        this.customTheme = false; // Flag saying that the theme is not defaulted.

        const localTheme = getTheme();
        if (localTheme) {
            this.customTheme = true;
            theme = localTheme;
        }


        // Week
        let aIsOdd = false;
        const isOddData = localStorage.getItem("girracountAIsOdd");
        if (isOddData) {
            // We have data
            aIsOdd = JSON.parse(isOddData);
        } else {
            localStorage.setItem("girracountAIsOdd", JSON.stringify(false));
        }

        // Timetable
        let pData = null;
        const savedData = localStorage.getItem('girracountTimetableData');
        if (savedData) {
            pData = JSON.parse(savedData);

            if (pData && !pData.classes) {
                alert('Girraween countdown no longer uses the old timetable format. Please reupload your iCal file to use Girraween Countdown timetables.');

                pData = null;
                localStorage.removeItem('girracountTimetableData');
            }
        }

        // Updating header:
        this.updateInterval = setInterval(() => {
            this.update();
        }, 4000);


        this.state = {
            currScreenName: "notloaded",
            loggedIn: false,
            aIsOdd: aIsOdd,
            pData: pData,
            isFormal: false,
            timeLeftData: calc.timeTillNextMsg(false),
            theme: theme
        }
    }

    componentDidMount() {
        this.changeScreen("home");
    }

    update() {
        this.setState({ ...this.state,
            timeLeftData: calc.timeTillNextMsg(this.state.isFormal)
        });

        if (this.state.timeLeftData.minsDiff) {
            document.title = `${timeToMinsString(this.state.timeLeftData.minsDiff,true)} left: Girracount`;
        } else {
            document.title = 'Girraween Countdown';
        }
    }

    changeScreen(nextScreenName) {
        this.setState({ ...this.state,
            currScreenName: nextScreenName
        });
    }

    handleThemeSwitch(on) {
        this.setState({ ...this.state,
            darkTheme: on
        });
    }

    changeThemeVal(key, val) {
        this.customTheme = true;
        const newTheme = { ...this.state.theme,
            [key]: val
        };
        saveTheme(newTheme);
        this.setState({ ...this.state,
            theme: newTheme
        });
    }

    changeTheme(newTheme) {
        this.customTheme = true;
        saveTheme(newTheme);
        this.setState({ ...this.state,
            theme: newTheme
        });
    }

    setAIsOdd(isOdd) {
        localStorage.setItem("girracountAIsOdd", JSON.stringify(isOdd));
        this.setState({ ...this.state,
            aIsOdd: isOdd
        });
    }

    setIsFormal(newVal) {
        this.setState({ ...this.state,
            isFormal: newVal
        });
    }

    setPData(newPData) {
        localStorage.setItem('girracountTimetableData', JSON.stringify(newPData));

        this.setState({ ...this.state,
            pData: newPData
        });
    }

    render() {
        let nextScreen = null;

        const {
            timeLeftData
        } = this.state;

        switch (this.state.currScreenName) {
            case "home":
                nextScreen = < HomeScreen
                aIsOdd = {
                    this.state.aIsOdd
                }
                setAIsOdd = {
                    (isOdd) => this.setAIsOdd(isOdd)
                }
                pData = {
                    this.state.pData
                }
                isFormal = {
                    this.state.isFormal
                }
                setIsFormal = {
                    (newVal) => this.setIsFormal(newVal)
                }
                timeLeftData = {
                    timeLeftData
                }
                nextPMsg = {
                    this.state.nextPMsg
                }
                />;
                break;
            case "classEdit":
                nextScreen = < ClassScreen
                pData = {
                    this.state.pData
                }
                setPData = {
                    (newPData) => this.setPData(newPData)
                }
                />;
                break;
            case "about":
                nextScreen = < AboutScreen / > ;
                break;
            case "settings":
                nextScreen = < SettingsScreen
                changeThemeVal = {
                    (key, val) => this.changeThemeVal(key, val)
                }
                changeTheme = {
                    (newTheme) => this.changeTheme(newTheme)
                }
                rawTheme = {
                    this.state.theme
                }
                />;
                break;
            default:
                if (this.firstLoad) {
                    this.firstLoad = false; // At first, we will try to load a non-existant scene, so ignore this case.
                } else {
                    console.warn(`tried to load screen that was non-existant: ${this.state.currScreenName}`);
                }
                return <div / > ;
        }

        return ( <
            ThemeProvider theme = {
                this.state.theme
            } >
            <
            BackgroundMain >
            <
            MenuBar isLoggedIn = {
                this.state.loggedIn
            }
            changeScreen = {
                (sName) => {
                    this.changeScreen(sName);
                }
            }
            />

            {
                nextScreen
            } <
            /BackgroundMain> <
            /ThemeProvider>
        )
    }
}

ReactDOM.render( < App / > , document.getElementById('root'));

serviceWorker.register();



// WEBPACK FOOTER //
// ./src/index.js