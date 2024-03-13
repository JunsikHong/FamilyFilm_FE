import 'css/LogIn.css';
import { useReducer } from 'react';
import axios from 'axios';
import $ from 'jquery';
import Join from 'component/Join';
import { useNavigate } from 'react-router-dom';
import familyfilmicon from 'img/familyfilmicon.png';

const loginStateFunc = (state, action) => {
    state = {
        state: action.state
    }
    return state;
}

export default function LogIn({ loginYNAct }) {

    ////////////////////////////////////////////////////////////////////////////////////
    const [loginState, act] = useReducer(loginStateFunc, {
        state: 'login'
    }); //로그인 / 회원가입 상태 체크
    const navigate = useNavigate();//navigate 객체
    ////////////////////////////////////////////////////////////////////////////////////

    //로그인 버튼 클릭 시 서버에서 로그인 체크 후 성공 시 메인으로 이동
    function loginBtn() {
        axios.post('/login',
            {
                user_id: $('.id').val(),
                user_pw: $('.pw').val()
            }
        ).then(response => {
            if (response.data === 1) {
                const token =  response.headers.getAuthorization();
                const refreshtoken = response.headers.get('refreshtoken');
                ////////////////////////////////////////////////////////////////////////////////////////
                axios.post('/isExistFamily', {} , {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                        'RefreshToken' : refreshtoken
                    }
                }).then(response => {
                    if (response.data.length === 0) {
                        localStorage.setItem('token', token);
                        localStorage.setItem('refreshToken', refreshtoken);
                        localStorage.setItem('loginYN', 'success');
                        loginYNAct({ state: 'success' });
                        navigate('/RegistFamily');
                    } else if (response.data.length >= 1) {
                        localStorage.setItem('family_group_num', response.data[0].family_group_num);
                        localStorage.setItem('token', token);
                        localStorage.setItem('refreshToken', refreshtoken);
                        localStorage.setItem('loginYN', 'success');
                        loginYNAct({ state: 'success' });
                        navigate('/');
                    }
                });
                ////////////////////////////////////////////////////////////////////////////////////////
            } else {
                window.alert('로그인에 실패하였습니다.');
                navigate('/LogIn');
            }
        });
    }

    //카카오 로그인 선택 시 api-login 실행
    function apiLoginBtn() {
        act({ state: 'api-login' });
    }

    //회원가입 선택 시 회원가입 페이지로 이동
    function joinBtn() {
        act({ state: 'join' });
    }

    return (
        <>
            <div className="login-section">

                <div className="login-box">
                    {loginState.state === 'login' && (
                        <div className="login-wrap">
                            <div className='icon-box'>
                                <img className='familyicon' src={familyfilmicon}></img>
                            </div>
                           
                            <div className="input-idpw">
                                <input type="text" name='id' className="id" placeholder="아이디를 입력하세요"></input>
                                <input type="password" name='pw' className="pw" placeholder="비밀번호를 입력하세요"></input>
                            </div>
                            <div className="login-btn-wrap">
                                <button className="login-btn" onClick={loginBtn}>로그인</button>
                                <button className="api-login-btn" onClick={apiLoginBtn}>카카오 로그인</button>
                                <button className="join-btn" onClick={joinBtn}>회원가입</button>
                            </div>
                        </div>
                    )}
                    {loginState.state === 'join' && <Join act={act} />}
                </div>
            </div>
        </>
    );
}