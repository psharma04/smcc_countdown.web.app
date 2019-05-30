
export const themes = {
    dark: {
        background: '#000000',
        main: '#c5c5c5',
        text: '#ffffff'
    },
    red: {
        background: '#ffffff',
        main: '#ff0000',
        text: '#000000'
    }
}

export function saveTheme(theme){
    localStorage.setItem('girracountdownTheme', JSON.stringify(theme));
}

export function getTheme(){
    const val = localStorage.getItem('girracountdownTheme');
    if(val){
        return JSON.parse(val);
    }
    return false;
}

export function compareTheme(theme1, theme2){
    return theme1.background === theme2.background &&
        theme1.main === theme2.main &&
        theme1.text === theme2.text;
}



// WEBPACK FOOTER //
// ./src/jsx/themes.jsx