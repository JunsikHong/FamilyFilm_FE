import "css/Calendar.css"
import axios from 'axios';

export default function MainCalendarDetail({ scheduleState, act, setSchedule, scheduleDate }) {

    //스케쥴 수정
    function modifySchedule(element) {
        act({state : 'MainScheduleModify',
             detail : element});
    }

    //스케쥴 삭제
    function deleteSchedule(element) {
        if(window.confirm('삭제하시겠습니까?')) {
            axios.post('/deleteSchedule',
                {schedule_proper_num : element.schedule_proper_num},
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('token'),
                        'RefreshToken' : localStorage.getItem('refreshToken')
                    }
                }
            ).then(response => {
                if(response.data === 1) {            
                    alert('삭제 되었습니다.');
                    axios.post('/getSchedule',
                        {
                            family_group_num: localStorage.getItem('family_group_num'),
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
                    act({ state : 'MainScheduleList' });
                } else {
                    alert('실패하였습니다.');
                }
            });
        }
    }

    return (
        <>
            {scheduleState.state === 'MainScheduleDetail' && (
                <div className="schedule-detail-wrap">
                    {scheduleState.detail.map((element, index) => (
                        <div key={index} className="schedule-detail-box">
                            <p className="schedule-modify" onClick={() => ( modifySchedule(element) )}>수정</p>
                            <p className="schedule-delete" onClick={() => ( deleteSchedule(element) )}>삭제</p>
                            <p className="schedule-color" style={{ backgroundColor: element.schedule_color }}></p>
                            <div className="schedule-detail-title">
                                {element.schedule_title}
                            </div>
                            <div className="schedule-detail-date">
                                <span>날짜 : </span>
                                {element.schedule_date.replace(/^(\d{4}-\d{2}-\d{2}).*$/, '$1')}
                            </div>
                            <div className="schedule-location">
                                <span>위치 : </span>
                                {element.schedule_ar}
                                {element.schedule_ar_detail}
                            </div>
                            <hr />
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}