//css
import 'css/MainMemo.css';
import axios from 'axios';
import $ from 'jquery';

export default function MainMemoModify({memoState, act}) {
    
    //메모 상세 보기 상태로 바꾸기
    function getDetailMemo() {
        act({state : 'MainMemoDetail'});
    }

    //메모 저장하고 목록으로 가기
    function saveMemo() {
        axios.post('/modifyMemo',
            {memo_proper_num : memoState.detail.memo_proper_num,
             memo_title : $('.memo-modify-title').val(),
             memo_content : $('.memo-modify-detail').val()},
             {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token'),
                    'RefreshToken' : localStorage.getItem('refreshToken')
                }
             });
        act({state : 'MainMemoList'});
    }

    return (
        <>
            {memoState.state === 'MainMemoModify' && (
                <div className="memo-detail-box">
                    <div className="memo-detail-arrow" onClick={getDetailMemo}></div>
                    <div className="memo-save-btn" onClick={saveMemo}>저장</div>
                    <input type='text' className='memo-modify-title' defaultValue={memoState.detail.memo_title}/>
                    <textarea className='memo-modify-detail' defaultValue={memoState.detail.memo_content}/>
                </div>
            )}
        </>
    );
}