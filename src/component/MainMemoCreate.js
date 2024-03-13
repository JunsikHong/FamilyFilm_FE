//css
import 'css/MainMemo.css';
import axios from 'axios';
import $ from 'jquery';

export default function MainMemoCreate({ memoState, act }) {

    //메모 상세 보기 상태로 바꾸기
    function getDetailMemo() {
        act({state : 'MainMemoList'});
    }

    //메모 저장하고 목록으로 가기
    function saveMemo() {
        axios.post('/createMemo',
            {
                memo_title : $('.memo-create-title').val(),
                memo_content : $('.memo-create-detail').val(),
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
            if(response.data === 1) {
                alert('메모 저장에 성공하였습니다!');
                act({state : 'MainMemoList'});
            } else {
                alert('메모 저장에 실패하였습니다');
            }
        });
    }
    
    return (
        <>
            {memoState.state === 'MainMemoCreate' && (
                <div className="memo-detail-box">
                    <div className="memo-detail-arrow" onClick={getDetailMemo}></div>
                    <div className="memo-create-btn" onClick={saveMemo}>추가</div>
                    <input type='text' className='memo-create-title' placeholder='제목' />
                    <textarea className='memo-create-detail' placeholder='내용'/>
                </div>
            )}
        </>
    );
}