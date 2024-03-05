import "css/Calendar.css"
import { useState, useEffect, useReducer } from 'react';
import axios from 'axios';
import $ from 'jquery';
import calendar from "component/Calendar"
import MainCalendarDetail from "./MainCalendarDetail";
import MainCalendarCreate from "./MainCalendarCreate";
import MainCalendarModify from "./MainCalendarModify";

const MainScheduleState = (state, action) => {
    state = {
        state: action.state,
        detail: action.detail
    }
    return state;
}

export default function MainCalendarList() {

    ////////////////////////////////////////////////////////////////////////////////////////////////
    const [scheduleState, act] = useReducer(MainScheduleState, {
        state: 'MainScheduleList',
        detail: []
    });
    const [schedule, setSchedule] = useState([]); //일정 목록
    const [scheduleDate, setScheduleDate] = useState(new Date()); //선택 날짜
    ////////////////////////////////////////////////////////////////////////////////////////////////

    //calendar 현재 일정 정보 가져오기
    useEffect(() => {
        axios.post('/getSchedule', 
            { 
                family_proper_num : localStorage.getItem('family_proper_num'),
                scheduleDate: scheduleDate 
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token'),
                    'RefreshToken' : localStorage.getItem('refreshToken')
                }
            }
        )
            .then(response => {
                setSchedule(response.data);
            });
    }, [scheduleDate]);

    //달력 생성 및 기능
    useEffect(() => {
        //calendar 생성 함수
        calendar(schedule, scheduleDate);

        // 일정 선택 시 상세 일정 가져오기
        $('.dateBoard').children().click(function (e) {
            if ($(e.target).children().hasClass('hasTask')) {
                const currentYear = scheduleDate.getFullYear();
                const currentMonth = scheduleDate.getMonth() + 1;
                axios.post('/getScheduleDetail',
                    { 
                        family_proper_num : localStorage.getItem('family_proper_num'),
                        scheduleDate: currentYear + '-' + currentMonth + '-' + $(e.target).text() 
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': localStorage.getItem('token'),
                            'RefreshToken' : localStorage.getItem('refreshToken')
                        }
                    }
                ).then(response => {
                    act({
                        state: 'MainScheduleDetail',
                        detail: response.data
                    });
                });
            } else if ($(e.target).hasClass('noColor')) {
                act({ state: 'MainScheduleList' });
            } else {
                let createDate = '';
                createDate += scheduleDate.getFullYear() + '-'
                createDate += scheduleDate.getMonth() + 1 + '-';
                if ($(e.target).text() < 10) {
                    createDate += '0' + $(e.target).text();
                } else {
                    createDate += $(e.target).text();
                }
                act({
                    state: 'MainScheduleCreate',
                    detail: createDate
                });
            }
        });

        // 이전달 이동
        document.querySelector(`.prevDay`).onclick = () => {
            setScheduleDate(() => {
                const currentDate = new Date(scheduleDate);
                currentDate.setMonth(currentDate.getMonth() - 1);
                return currentDate;
            });
        }

        // 다음달 이동
        document.querySelector(`.nextDay`).onclick = () => {
            setScheduleDate(() => {
                const currentDate = new Date(scheduleDate);
                currentDate.setMonth(currentDate.getMonth() + 1);
                return currentDate;
            });
        }

        // 일정 상세 보기
        if (scheduleState.state === 'MainScheduleDetail') {
            $('.dateBoard').children().click(function () {
                act({ state: 'MainScheduleList' })
            })
        }
    }, [schedule, scheduleDate, scheduleState.state, act]);

    // 일정 생성하기
    function createSchedule() {
        act({ state: 'MainScheduleCreate' });
    }

    return (
        <>
            <div className='rap'>
                <div className="header">
                    <div className="btn prevDay"></div>
                    <h2 className='dateTitle'>none</h2>
                    <div className="btn nextDay"></div>
                </div>

                <div className="grid dateHead">
                    <div>일</div>
                    <div>월</div>
                    <div>화</div>
                    <div>수</div>
                    <div>목</div>
                    <div>금</div>
                    <div>토</div>
                </div>

                <div className="grid dateBoard"></div>

                {scheduleState.state === 'MainScheduleDetail' && (<MainCalendarDetail scheduleState={scheduleState} act={act} setSchedule={setSchedule} scheduleDate={scheduleDate}/>)}
                {scheduleState.state === 'MainScheduleCreate' && (<MainCalendarCreate scheduleState={scheduleState} act={act} setSchedule={setSchedule} scheduleDate={scheduleDate}/>)}
                {scheduleState.state === 'MainScheduleModify' && (<MainCalendarModify scheduleState={scheduleState} act={act} setSchedule={setSchedule} scheduleDate={scheduleDate}/>)}

                <div className="schedule-plus-button-wrap">
                    <button className="schedule-plus-button" onClick={createSchedule}></button>
                </div>
            </div>
        </>
    );
}