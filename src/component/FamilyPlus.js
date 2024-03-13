
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function FamimlyPlus({invitePublishFunc}) {
    
    const [familyInfo, setFamilyInfo] = useState(null);

    //현재 가족 정보
    useEffect(() => {
        axios.post('/getFamilyInfo',
        {
            family_group_num : localStorage.getItem('family_group_num')
        },
        {
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : localStorage.getItem('token'),
                'RefreshToken' : localStorage.getItem('refreshToken')
            }
        }).then(response => {
            setFamilyInfo(response.data);
        });
    }, []);

    //초대하기
    function invite() {
        invitePublishFunc();
    }

    return (
        <div className="familyplus-wrap">
            <div className="familyplus-outer-box">
                <div className="familyplus-inner-box">
                    <ul className="familyplus">
                        <li>{familyInfo !== null && familyInfo.family_name}에 새로운 구성원을 추가해보세요</li>
                        <li>
                            <input type="text" className="invite-id" placeholder="초대할 구성원의 아이디를 입력해주세요."></input>
                            <button onClick={invite} className="invite-btn">초대</button>
                        </li>
                    </ul>
                    <ul className='familyMemberList'>

                    </ul>
                </div>
            </div>
        </div>
    );
}