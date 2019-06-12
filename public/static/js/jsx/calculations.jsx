import * as data from './pData';


export function timeTillNextMsg(isFormal){
    const cTime = new Date();
    const currDay = cTime.getDay();

    const dayBellData = isFormal?data.formalData:data.bellData[currDay];

    if(dayBellData){
        const hour = cTime.getHours();// Eg 9 at 9am, 13 at 1pm
        const min = cTime.getMinutes();// Eg 42 at 4:42pm

        for(let pTime in dayBellData){
            const currMsg = dayBellData[pTime];// Eg. "the end of period 1"

            const pHour = parseInt(pTime[0]+pTime[1],10);// Finds the hour
            const pMin = parseInt(pTime[3]+pTime[4],10);// Finds the min

            if(hour < pHour || (hour === pHour && min < pMin)){// We are not past this period, so its the one we need to display
                const minsDiff = (pHour-hour)*60 + pMin-min;
                
                return {minsDiff:minsDiff, nextMsg:currMsg};
            }
		if minsDiff = 2 {
			showButton = function() {
        Push.create("2 Minutes Remaining", {
            body: "There are 2 Minutes remaining until the next session.",
            icon: "/icon.png",
            timeout: 5000,
            onClick: function() {
                console.log(this);
            }
        });
    };
		}
        }

        return {isSchoolEnded:true};
    }else {
        return {isWeekend:true};
    }
}

export function getCurrPeriodId(isFormal){
    const cTime = new Date();
    const currDay = cTime.getDay();

    const dayBellData = isFormal?data.formalPeriodData:data.periodData[currDay];

    if(dayBellData){
        const hour = cTime.getHours();// Eg 9 at 9am, 13 at 1pm
        const min = cTime.getMinutes();// Eg 42 at 4:42pm

        for(let pTime in dayBellData){
            const pHour = parseInt(pTime[0]+pTime[1],10);// Finds the hour
            const pMin = parseInt(pTime[3]+pTime[4],10);// Finds the min

            if(hour < pHour || (hour === pHour && min < pMin)){// We are not past this period, so its the one we need to display
                return dayBellData[pTime];// Show this period
            }
        }
    }
    return null;
}



// WEBPACK FOOTER //
// ./src/jsx/calculations.jsx