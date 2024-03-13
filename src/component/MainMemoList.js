//css
import 'css/MainMemo.css';

//lib
import { useState, useEffect, useReducer } from 'react';
import axios from 'axios';

//component
import MainMemoDetail from './MainMemoDetail';
import MainMemoCreate from './MainMemoCreate';
import MainMemoModify from './MainMemoModify';

//redux
const mainMemoState = (state, action) => {
    state = {
        state: action.state,
        detail: action.detail
    };
    return state;
}

export default function MainMemoList() {

    /////////////////////////////////////////////////////////////////////////////////////////
    const [memoState, act] = useReducer(mainMemoState, {
        state: 'MainMemoList',
        detail: null
    }); //메모 창 상태
    const [memo, setMemo] = useState([]); //메모 목록
    const [memoProperNum, setMemoProperNum] = useState(''); //메모 고유번호
    /////////////////////////////////////////////////////////////////////////////////////////

    //memo 정보 가져오기
    useEffect(() => {
        axios.post('/getMemo', 
        {
            family_group_num : localStorage.getItem('family_group_num')
        }, 
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token'),
                'RefreshToken' : localStorage.getItem('refreshToken')
            }
        })
            .then(response => {
                setMemo(response.data);
            });
    }, [memoState, act]);

    //메모 시간 표시 함수
    function dateChange(date) {
        const modifyDate = new Date(date);
        const timeDiff = new Date() - new Date(date);
        const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
        let displayDate;

        if (hoursDiff < 24) {
            if (hoursDiff < 1) {
                const minutesDiff = Math.floor(timeDiff / (1000 * 60));
                displayDate = `${minutesDiff}분 전`;
            } else {
                displayDate = `${hoursDiff}시간 전`;
            }
        } else {
            const month = modifyDate.getMonth() + 1; // month는 0부터 시작하므로 +1 해줍니다.
            const day = modifyDate.getDate();
            displayDate = `${month}월 ${day}일`;
        }
        return displayDate;
    }

    //메모 상세정보 가져오기
    function getMemoDetail(memo_proper_num) {
        setMemoProperNum(memo_proper_num);
        act({ state: 'MainMemoDetail' });
    }

    //메모 추가
    function createMemo() {
        act({ state: 'MainMemoCreate' });
    }

    //메모 삭제
    function deleteMemo(memo_proper_num) {
        if (window.confirm('삭제하시겠습니까?')) {
            axios.post('/deleteMemo', 
                { memo_proper_num: memo_proper_num },
                { 
                    headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token'),
                    'RefreshToken' : localStorage.getItem('refreshToken')
                    }
                }
            ).then(response => {
                if (response.data === 1) {
                    alert('삭제 되었습니다.');
                    act({ state: 'MainMemoList' });
                } else {
                    alert('실패하였습니다.');
                }
            });
        }
    }

    return (
        <>
            <div className="memo-section">
                {memoState.state === 'MainMemoList' && (
                    <div className="memo-box">

                        {/* memo 목록이 없을 때 */}
                        {memo.length === 0 && (
                            <>
                                <div className="memo-detail-box">
                                    <p className='noMemo'>우리 가족의 이야기를 만들어보세요</p>
                                </div>
                            </>
                        )}

                        {/* memo 목록이 있을 때 */}
                        {memo.length !== 0 && (
                            <>
                                <div className="memo-real-title">
                                    우리 가족 이야기
                                </div>
                                <div className="memo-more-btn">

                                </div>
                                <table className="memo-table">
                                    <thead>
                                        <tr className="memo-table-title">
                                            <th >

                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {memo.map((element, index) => (
                                            <tr className="memo-content" key={index}>
                                                <td>
                                                    <div className="memo-border">
                                                        <div className='memo-title-content-box'>
                                                            <p className="memo-title">{element.memo_title}</p>
                                                            <p className='memo-limit-content'>{element.memo_content}</p>
                                                        </div>
                                                        <div className='memo-writer-date-delete-box'>
                                                            
                                                            <p className='memo-writer'>{element.family_relationship_proper_num}</p>
                                                            <p className='memo-date'>{dateChange(element.memo_modify_date)}</p>
                                                            
                                                            <p className='memo-delete' onClick={() => { deleteMemo(element.memo_proper_num) }}>삭제</p>
                                                            <p className="memo-arrow" onClick={() => { getMemoDetail(element.memo_proper_num) }}></p>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        <tr className="last-content">

                                        </tr>
                                    </tbody>
                                </table>
                            </>
                        )}

                        <div className="memo-plus-button-wrap">
                            <button className="memo-plus-button" onClick={createMemo}></button>
                        </div>
                    </div>
                )}
                {memoState.state === 'MainMemoDetail' && <MainMemoDetail memoProperNum={memoProperNum} memoState={memoState} act={act} />}
                {memoState.state === 'MainMemoCreate' && <MainMemoCreate memoState={memoState} act={act} />}
                {memoState.state === 'MainMemoModify' && <MainMemoModify memoState={memoState} act={act} />}
            </div >
        </>
    );
}