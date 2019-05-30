import React from 'react';
import styled from 'styled-components';

const classStyles = [
    'rgba(255, 0, 15, 0.5)',
    'rgba(255, 126, 0, 0.5)',
    'rgba(255, 183, 0, 0.5)',
    'rgba(0, 191, 18, 0.5)',
    'rgba(0, 116, 19, 0.5)',
    'rgba(0, 185, 255, 0.5)',
    'rgba(0, 55, 255, 0.5)',
    'rgba(117, 0, 255, 0.5)',
    'rgba(197, 0, 255, 0.5)',
    'rgba(255, 0, 204, 0.5)',
    'rgba(255, 0, 93, 0.5)'
]

const Table = styled.table`
    border-collapse: collapse;
`;

const TD = styled.td`
    padding: 10px;
    font-size: 1.2rem;

    border: 2px solid ${props => props.theme.text};
    color: ${props => props.theme.text};

    background-color: ${props => classStyles[props.classId]};
`;

const TD5 = TD.extend`
    width: calc(100%/5);
`

export function dataToTable(pData, showChangeValueScreen, week){
    const tableData = [];

    const weekData = pData.bodyData[week];

    const {classes} = pData;

    for(let rawDayId in weekData){
        const currDay = weekData[rawDayId];
        
        for(let pId in currDay){
            const currPer = currDay[pId];
            
            if(currPer){// If this period isn't null eg. p0 = null
                const listId = pId==="RC"?0:(parseInt(pId,10)+1);
                const dayId = parseInt(rawDayId,10);
                
                if(!tableData[listId]){
                    // Add this column to the table
                    tableData[listId] = [
                        null,
                        <TD5 key={`1${pId}`} />,
                        <TD5 key={`2${pId}`} />,
                        <TD5 key={`3${pId}`} />,
                        <TD5 key={`4${pId}`} />,
                        <TD5 key={`5${pId}`} />
                    ];
                }

                tableData[listId][dayId] = (
                    <TD5 key={rawDayId+pId} classId={currPer.class} onClick={()=>showChangeValueScreen(week,dayId, pId)}>
                        {classes[currPer.class]} in room {currPer.room}
                    </TD5>
                );
            }
        }
    }

    return (
        <Table>
            <tbody>
                {
                    tableData.map((val,iteration)=>{
                        return (
                            <tr key={iteration}>
                                {val}
                            </tr>
                        )
                    })
                }
            </tbody>
        </Table>
    )
}


const TodayTable = Table.extend`
    width: 100%;
    @media (min-width: 900px){
        width: auto;
        float: right;
    }
`;

const TH = TD.withComponent('th');

const TDHighlight = TD.extend`
    color: ${props => props.theme.background};

    background-color: ${props => props.theme.text};
`;

export function getToday(timetable, currWeekName, currPeriodId){
    const currWeek = timetable.bodyData[currWeekName === "Week A"?0:1];

    const {classes} = timetable;
    
    const currDayId = new Date().getDay();
    const currDay = currWeek[currDayId];

    if(currDay){// Check this is a school day
        const tableElements = [];

        for(let pIndex in currDay){
            const currPeriod = currDay[pIndex];

            if(currPeriod){
                const nextRow = (
                    <tr key={pIndex}>
                        {
                            parseInt(pIndex,10) === currPeriodId?
                            (
                                <TDHighlight>
                                    {classes[currPeriod.class]} in room {currPeriod.room}
                                </TDHighlight>
                            ):
                            (
                                <TD>
                                    {classes[currPeriod.class]} in room {currPeriod.room}
                                </TD>
                            )
                        }
                    </tr>
                );

                if(pIndex === "RC"){
                    // Add this to the start
                    tableElements.unshift(nextRow);
                }else {
                    // Add to the end
                    tableElements.push(nextRow);
                }
            }
        }

        return (
            <TodayTable>
                <tbody>
                    <tr><TH>Today's Timetable</TH></tr>
                    {tableElements}
                </tbody>
            </TodayTable>
        )
    }

    return null;
}


export function getWeek() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
    // January 4 is always in week 1.
    const week1 = new Date(d.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000
                        - 3 + (week1.getDay() + 6) % 7) / 7);
}

export function timeToMinsString(timeLeft,shortHand){
    if(timeLeft === 1){
        return shortHand?'1 min':'1 minute';
    }else {
        return shortHand?`${timeLeft} mins`:`${timeLeft} minutes`;
    }
}


// WEBPACK FOOTER //
// ./src/jsx/utils.jsx