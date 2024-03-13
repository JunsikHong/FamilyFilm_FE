import logo from 'img/familyfilmicon.png';
import 'css/RegistFamily.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';

export default function RegistFamily() {

    /////////////////////////////////////////////////////////////////////////////////////////
    const navigate = useNavigate(); //navigate 객체
    /////////////////////////////////////////////////////////////////////////////////////////

    //등록 누를 시 가족 그룹 생성
    function registFamily() {
        axios.post('/registFamily', 
        {
            family_name : $('.family_name').val(),
            family_group_pw : $('.family_group_pw').val(),
            family_introduce : $('.family_introduce').val(),
            family_relationship_proper_num : $('.family_relationship_proper_num').val()
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token'),
                'RefreshToken' : localStorage.getItem('refreshToken')
            }
        })
        .then(response => {
            if(response.data === 'fail') {
                window.alert('등록에 실패하였습니다.');                
            } else {
                localStorage.setItem('family_group_num', response.data);
                navigate('/');
            }
        });

    }
    
    return (
        <>
        <div className='regist-family-back'>
            <div className='regist-family-wrap'>
                <div className='regist-family-box'>
                    <div className='regist-family-left'>
                        <img src={logo} alt='logo' className='regist-family-logo' />
                        <p className='regist-family-title'>우리 가족은 어떤 가족인가요?</p>
                    </div>
                    <div className='regist-family-right'>
                        <div className='family-input-box'>
                            <input type="text" name='family_name' className="family_name family-input" placeholder="우리 가족의 이름은?"></input>
                            <p className="familyNameCheck"></p>
                            <input type="password" name='family_group_pw' className="family_group_pw family-input" placeholder="비밀번호를 입력하세요"></input>
                            <p className="familyPwCheck"></p>
                            <input type="password" name='family_group_pw_check' className="family_group_pw_check family-input" placeholder="비밀번호를 똑같이 입력하세요"></input>
                            <p className="familyPwCheckCheck"></p>
                            <input type="text" name="family_introduce" className="family_introduce family-input" placeholder="우리 가족을 소개해보세요"></input>
                            <input type="text" name="family_relationship_proper_num" className="family_relationship_proper_num family-input" placeholder='나는 우리가족에서 누구인가요?'></input>
                        </div>
                        <div className='regist-family-button-box'>
                            <button className='regist-family-button' onClick={registFamily}>등록</button>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </>
    );
}