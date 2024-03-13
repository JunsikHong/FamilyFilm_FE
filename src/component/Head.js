import 'css/Head.css';
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Notification from "component/Notification";
import FamilyList from "component/FamilyList";
import FamilyPlus from 'component/FamilyPlus';
import logo from 'img/familyfilmicon.png';
import bell from 'img/bellicon.png';
import plus from 'img/plusicon.png';
import mypage from 'img/settingicon.png';
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
    const [inputRelation, setInputRelation] = useState('none'); //초대 수락시 관계입력
    const [bannerTitle, setBannerTitle] = useState(''); //가족이름
    const [headState, setHeadState] = useState('None'); //헤드 상태 체크
    const client = useRef({}); //websocket
    const navigate = useNavigate();//navigate 객체
    ////////////////////////////////////////////////////////////////////////////////////

    //로그인 성공시 websocket 연결 후 공지 구독
    //로그인 성공시 가족이름 가져오기
    useEffect(() => {
        if (localStorage.getItem('loginYN') === 'success') {
            client.current = new Stomp.Client({
                webSocketFactory: () => new SockJS('/ws'),
                connectHeaders: {
                    login: localStorage.getItem('family_group_num'),
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

            axios.post('/getFamilyInfo', 
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
                setBannerTitle(response.data.family_name);
            });
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
        client.current.subscribe('/invite/' + localStorage.getItem('family_group_num'), serverMessage, {id: 'invite'});
    }

    //초대 구독 끊기
    function inviteUnSubscribeFun() {
        client.current.unsubscribe('invite');
    }

    //초대 메시지 보내기
    function invitePublishFunc() {
        console.log($('.invite-id').val());
        client.current.publish({
            destination: '/familyfilm/submit/' + localStorage.getItem('family_group_num'),
            headers: {},
            body: JSON.stringify({
                user_id: $('.invite-id').val(),
                family_group_num: localStorage.getItem('family_group_num')
            })
        });
        
    }

    //초대 Y
    function inviteY() {
        setInputRelation('block');
    }

    //초대 Y + 관계 입력
    function inputRelationY() {
        client.current.publish({
            destination: '/familyfilm/inviteAccept',
            headers: {},
            body: JSON.stringify({
                notification_proper_num: notificationState.detail[0].notification_proper_num
            })
        });
        axios.post('/inputRelationY', 
        {
            family_group_num :  notificationState.detail[0].family_group_num,
            family_relationship_proper_num : $('.input-relation').val()
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token'),
                'RefreshToken' : localStorage.getItem('refreshToken')
            }
        })
        .then(response => {
            if(response.data !== 1) {
                window.alert('초대응답에 실패하였습니다.');                
            } else {
                act({ detail: [] });
                setInputRelation('none');
                localStorage.setItem('family_group_num', notificationState.detail[0].family_group_num);
                navigate('/');
            }
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
        window.alert(message.body);
    }

    return (
        <>
            <header>
                {localStorage.getItem('loginYN') === 'success' &&
                <div className='head-wrap'>
                    {notificationState.detail.length !== 0 && (
                        <div className='pre-notification-wrap'>
                            <div className='pre-notification'>
                                <p>notice</p>
                                <p>{notificationState.detail[0].family_name} 가족으로부터 초대요청을 받았습니다. 수락하시겠습니까?</p>
                                <div>
                                    <p className='inviteY' onClick={() => { inviteY() }}>O</p>
                                    <p className='inviteN' onClick={() => { inviteN(notificationState.detail[0].notification_proper_num) }}>X</p>
                                </div>
                                <div className='input-relation-wrap' style={{display : inputRelation}}>
                                    <input type='text' className='input-relation' placeholder='초대자와의 관계'></input>
                                    <p className='input-relationY' onClick={() => { inputRelationY() }}>완료</p>
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

                        <div className='family-name-wrap'>
                            <p className='family-name'>{bannerTitle}</p>
                        </div>

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
                                        }}><img alt='list' className='list-icon' /></span>
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
                </div>}
            </header>
        </>
    );
}