import 'css/Head.css';
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Notification from "component/Notification";
import FamilyList from "component/FamilyList";
import FamilyPlus from 'component/FamilyPlus';
import logo from 'img/familyfilm48.png';
import bell from 'img/icons8-벨-100.png';
import list from 'img/icons8-명부-32.png';
import plus from 'img/plus.png';
import mypage from 'img/icons8-관리자-설정-남성-64.png';
import SockJS from 'sockjs-client';
import * as Stomp from '@stomp/stompjs';
import $ from 'jquery';
import axios from 'axios';
import { useReducer } from 'react';
import { useRef } from 'react';

const MainNotificationState = (state, action) => {
    state = {
        state: action.state,
        detail: action.detail
    };
    return state;
}

export default function Head({loginYN}) {

    ////////////////////////////////////////////////////////////////////////////////////
    const [notificationState, act] = useReducer(MainNotificationState, {
        state: 'mainNotification',
        detail: []
    }); //notification 상태 및 목록
    const [headState, setHeadState] = useState('None'); //헤드 상태 체크
    const client = useRef({}); //websocket
    ////////////////////////////////////////////////////////////////////////////////////

    //로그인 성공시 websocket 연결 후 공지 구독
    useEffect(() => {
        if (localStorage.getItem('loginYN') === 'success') {
            client.current = new Stomp.Client({
                webSocketFactory: () => new SockJS('/ws'),
                connectHeaders: {
                    login: localStorage.getItem('family_proper_num'),
                    passcode: localStorage.getItem('token')
                },
                debug: function (str) { console.log(str) },
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
                onConnect: () => {
                    notificationFunc();
                    notificationLoadFunc();
                },

            });
            client.current.activate();
        }
    }, [loginYN.state]);

    //로그아웃 시 연결, 구독 끊기
    function websocketDisconnect() {
        client.current.unsubscribe('notification');
        client.current.unsubscribe('invite');
        client.current.deactivate({force : true});
        client.current.forceDisconnect();
    }

    //notification 구독
    function notificationFunc() {
        client.current.subscribe('/notification/recieve/' + localStorage.getItem('token'), serverMessage, {id: 'notification'});
    }

    //notification 초기 데이터 가져오기
    function notificationLoadFunc() {
        axios.post('/notification/selectNotification', {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token'),
                    'RefreshToken': localStorage.getItem('refreshToken')
                }
            }).then(response => {
                act({ detail: response.data });
            })
    }

    //초대 구독
    function inviteSubscribeFunc() {
        client.current.subscribe('/invite/' + localStorage.getItem('family_proper_num'), serverMessage, {id: 'invite'});
    }

    //초대 구독 끊기
    function inviteUnSubscribeFun() {
        client.current.unsubscribe('invite');
    }

    //초대 메시지 보내기
    function invitePublishFunc() {
        console.log($('.invite-id').val());
        client.current.publish({
            destination: '/familyfilm/submit/' + localStorage.getItem('family_proper_num'),
            headers: {},
            body: JSON.stringify({
                user_id: $('.invite-id').val(),
                family_proper_num: localStorage.getItem('family_proper_num')
            })
        });
        
    }

    //초대 Y
    function inviteY(notification_proper_num) {
        client.current.publish({
            destination: '/familyfilm/inviteAccept',
            headers: {},
            body: JSON.stringify({
                notification_proper_num: notification_proper_num
            })
        });
    }

    //초대 N
    function inviteN(notification_proper_num) {
        client.current.publish({
            destination: '/familyfilm/inviteDeny',
            headers: {},
            body: JSON.stringify({
                notification_proper_num: notification_proper_num
            })
        });
    }

    //서버 메시지 alert 처리
    const serverMessage = function(message) {
        alert(message.body);
    }

    return (
        <>
            <header>
                <div className='head-wrap'>
                    {notificationState.detail.length !== 0 && (
                        <div className='pre-notification-wrap'>
                            <div className='pre-notification'>
                                <p>notice</p>
                                <p>{notificationState.detail[0].family_name} 가족으로부터 초대요청을 받았습니다. 수락하시겠습니까?</p>
                                <div>
                                    <p className='inviteY' onClick={() => { inviteY(notificationState.detail[0].notification_proper_num) }}>O</p>
                                    <p className='inviteN' onClick={() => { inviteN(notificationState.detail[0].notification_proper_num) }}>X</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <nav className='head'>
                        <ul className='head-logo'>
                            <li>
                                <NavLink to="/"><img src={logo} alt='logo' className='logo-icon' /></NavLink>
                            </li>
                            <li>
                                {localStorage.getItem('loginYN') === 'success' && (
                                    <>
                                        <span className='FamilyPlus' onClick={() => {
                                            if (headState === 'None') {
                                                setHeadState('FamilyPlus');
                                                inviteSubscribeFunc();
                                            } else if (headState === 'FamilyPlus') {
                                                setHeadState('None');
                                                inviteUnSubscribeFun();
                                            }
                                        }}><img src={plus} alt='plus' className='plus-icon' /></span>
                                        {headState === 'FamilyPlus' && <FamilyPlus invitePublishFunc={invitePublishFunc} />}
                                    </>
                                )}
                            </li>
                        </ul>

                        <ul className='head-content'>
                            <li>
                                {localStorage.getItem('loginYN') === 'success' && (
                                    <>
                                        <span className='Notification' onClick={() => {
                                            if (headState === 'None') {
                                                setHeadState('Notification');
                                            } else if (headState === 'Notification') {
                                                setHeadState('None');
                                            }
                                        }}><img src={bell} alt='bell' className='bell-icon' /></span>
                                        {headState === 'Notification' && <Notification />}
                                    </>
                                )}
                            </li>
                            <li>
                                {localStorage.getItem('loginYN') === 'success' && (
                                    <>
                                        <span className='FamilyList' onClick={() => {
                                            if (headState === 'None') {
                                                setHeadState('FamilyList');
                                            } else if (headState === 'FamilyList') {
                                                setHeadState('None');
                                            }
                                        }}><img src={list} alt='list' className='list-icon' /></span>
                                        {headState === 'FamilyList' && <FamilyList />}
                                    </>
                                )}
                            </li>
                            <li>
                                {localStorage.getItem('loginYN') === 'success' && <NavLink to="/MyPage" activeclassname="active"><img src={mypage} alt='mypage' className='mypage-icon' /></NavLink>}
                                {localStorage.getItem('loginYN') !== 'success' && <NavLink to="/LogIn" activeclassname="active">로그인</NavLink>}
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>
        </>
    );
}