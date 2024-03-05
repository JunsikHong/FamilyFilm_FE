//css
import 'css/MainMemo.css';

//lib
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function MainMemoDetail({ memoProperNum, memoState, act }) {

    /////////////////////////////////////////////////////////////////////////////////////////
    const [memoDetail, setMemoDetail] = useState(null); //메모 상세
    /////////////////////////////////////////////////////////////////////////////////////////

    //메모 상세 정보 가져오기
    useEffect(() => {
        axios.post('/getMemoDetail',
            { memoProperNum: memoProperNum },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token'),
                    'RefreshToken' : localStorage.getItem('refreshToken')
                }
            })
            .then(response => {
                setMemoDetail(response.data);
            });
    }, [memoProperNum]);

    //메모 목록 보기 상태로 바꾸기
    function getMemoList() {
        act({ state: 'MainMemoList' });
    }

    //메모 수정 상태로 바꾸기
    function modifyMemo() {
        act({
            state: 'MainMemoModify',
            detail: memoDetail
        });
    }

    //메모 추가
    function createMemo() {
        act({ state: 'MainMemoCreate' });
    }

    return (
        <>
            {memoState.state === 'MainMemoDetail' && (
                <div className="memo-detail-box">
                    <div className="memo-detail-arrow" onClick={getMemoList}></div>
                    <div className="memo-modify-btn" onClick={modifyMemo}>수정</div>
                    <div className="memo-detail-title">
                        {memoDetail !== null && memoDetail.memo_title}
                    </div>
                    <div className="memo-detail-content">
                        {memoDetail !== null && memoDetail.memo_content}
                    </div>
                    <div className="memo-plus-button-wrap">
                        <button className="memo-plus-button" onClick={createMemo}></button>
                    </div>
                </div>)}
        </>
    );
}