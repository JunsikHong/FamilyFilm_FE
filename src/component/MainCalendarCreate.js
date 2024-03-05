import $ from 'jquery';
import axios from 'axios';

export default function MainCalendarCreate({ scheduleState, act, setSchedule, scheduleDate }) {

    //취소 누를 때 리스트로
    function cancel() {
        act({ state: 'MainScheduleList' });
    }

    //색 변경 창 띄우기
    function modifyColor() {
        $('.schedule-modify-color').css('display', 'block');
    }

    //색 변경하기
    function selectColor(e) {
        $('.selColor').css('background-color', $(e.target).css('background-color'));
        $('.schedule-modify-color').css('display', 'none');
    }

    //저장 누를 때 저장하기
    function saveNewSchedule() {
        axios.post('/saveNewSchedule',
            {
                schedule_color: $('.selColor').css('background-color'),
                schedule_title: $('.schedule-modify-title').val(),
                schedule_date: $('.schedule-modify-date').val(),
                schedule_location: $('.schedule-modify-location').val(),
                family_proper_num: localStorage.getItem('family_proper_num')
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token'),
                    'RefreshToken' : localStorage.getItem('refreshToken')
                }
            }
        ).then(response => {
            if (response.data === 1) {
                console.log($('.schedule-modify-date').val());
                axios.post('/getScheduleDetail',
                    {
                        family_proper_num: localStorage.getItem('family_proper_num'),
                        scheduleDate: $('.schedule-modify-date').val()
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': localStorage.getItem('token'),
                            'RefreshToken' : localStorage.getItem('refreshToken')
                        }
                    }
                ).then(response => {
                    axios.post('/getSchedule',
                        {
                            family_proper_num: localStorage.getItem('family_proper_num'),
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
                        act({
                            state: 'MainScheduleDetail',
                            detail: response.data
                        });
                });
            }
        });
    }

    return (
        <>
            {scheduleState.state === 'MainScheduleCreate' && (
                <div className="schedule-detail-wrap">
                    <div className="schedule-detail-box">
                        <p className="schedule-save" onClick={saveNewSchedule}>저장</p>
                        <p className="schedule-cancel" onClick={cancel}>취소</p>
                        <p className="schedule-color schedule-modify-span selColor" onClick={modifyColor}></p>

                        {/* 색 선택창 */}
                        <div className='schedule-modify-color'>
                            <p className='schedule-color' style={{ backgroundColor: 'rgb(99, 38, 38)' }} onClick={selectColor}></p><span className='schedule-color-detail'>가을낙엽</span>
                            <br />
                            <br />
                            <p className='schedule-color' style={{ backgroundColor: 'rgb(45, 99, 38)' }} onClick={selectColor}></p><span className='schedule-color-detail'>푸른초원</span>
                            <br />
                            <br />
                            <p className='schedule-color' style={{ backgroundColor: 'rgb(65, 228, 228)' }} onClick={selectColor}></p><span className='schedule-color-detail'>시원바다</span>
                            <br />
                            <br />
                            <p className='schedule-color' style={{ backgroundColor: 'rgb(228, 65, 179)' }} onClick={selectColor}></p><span className='schedule-color-detail'>따뜻꽃</span>
                        </div>

                        <input className="schedule-modify-title" name="schedule-modify-title" type="text" placeholder="제목"></input>
                        <div className="schedule-detail-date">
                            <span className="schedule-modify-span">날짜 : </span>
                            <input className="schedule-modify-date" name="schedule-modify-date" type="date" defaultValue={scheduleState.detail}></input>
                        </div>
                        <div className="schedule-location">
                            <span className="schedule-modify-span">위치 : </span>
                            <input className="schedule-modify-location" name="schedule-modify-location" type="text" placeholder="위치"></input>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}