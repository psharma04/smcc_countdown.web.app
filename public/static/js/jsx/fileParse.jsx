import ICAL from 'ical.js';

const amountOfDays = 10;

export function parseIcal(file, onFinish){
    const outputData = {};

    const reader = new FileReader();
    reader.onload = (e)=>{
        const data = e.target.result;
        
        const JCAL = ICAL.parse(data);
        const calData = JCAL[2];

        let prevDay = -1;
        let dayCount = 0;

        const classes = [];

        for(let i=0;i<calData.length && dayCount<=amountOfDays;i++){
            const currentSection = calData[i];
            const currentData = currentSection[1];
            
            const classRaw = currentData[5][3];
            const classEndOnly = classRaw.split(':')[1];
            
            let currClass = classEndOnly;
            const len = currClass.length;
            if(currClass[len-3] === "Y" && currClass[len-2] === "r"){
                currClass = currClass.substring(0,len-4);// Chop off Yr9 from the end
            }else if(currClass[len-4] === "Y" && currClass[len-3] === "r"){
                currClass = currClass.substring(0,len-5);// Chop off Yr10 from the end
            }

            if(currClass[0] === " "){
                currClass = currClass.substring(1,len);// Chop whitespace from start
            }

            const currRoomRaw = currentData[6][3];
            let currRoom = currRoomRaw;
            if(currRoom.substring(0,5) === "Room:"){// Clip room from the start.
                currRoom = currRoom.substring(6, currRoom.length);
            }

            var period = currentData[4][3].split(/\r?\n/)[1];
            // Clip "Period: " from the start...
            if(period.substring(0,7) === "Period:"){
                period = period.substring(8,period.length);
            }


            const currDate = new Date(currentData[0][3]);
            const currDay = currDate.getDay();

            if(currDay !== prevDay){
                dayCount += 1;
                if(dayCount > amountOfDays){
                    break; // We are out of days
                }
            }

            if(classes.indexOf(currClass) < 0){
                // We don't have this class in our list.
                classes.push(currClass);
            }

            const currWeekId = dayCount<6?0:1;
            if(!outputData[currWeekId]){
                outputData[currWeekId] = {};
            }
            if(!outputData[currWeekId][currDay]){
                outputData[currWeekId][currDay] = {};
            }

            outputData[currWeekId][currDay][period] = {
                class: classes.indexOf(currClass),
                room: currRoom
            }

            prevDay = currDay;
        }

        onFinish({
            bodyData: outputData,
            classes: classes
        });
    }
    reader.readAsText(file);
}


// WEBPACK FOOTER //
// ./src/jsx/fileParse.jsx