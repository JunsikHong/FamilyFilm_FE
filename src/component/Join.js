import $ from 'jquery';
import axios from 'axios';

export default function Join({ act }) {

    //로그인 창으로 돌아가기
    function prevBtn() {
        act({ state: 'login' });
    }

    //회원가입 전 모든 완료 후 로그인으로 돌아가기
    function joinActBtn() {
        if ($('.id').val() === '') {
            $('.idCheck').css('color', 'red');
            $('.idCheck').text('아이디를 입력하세요.');
        } else if ($('.pw').val() === '') {
            $('.pwCheck').css('color', 'red');
            $('.pwCheck').text('비밀번호를 입력하세요');
        } else if ($('.pw-check').val() === '') {
            $('.pw-checkCheck').css('color', 'red');
            $('.pw-checkCheck').text('비밀번호를 입력하세요');
        } else if ($('.name').val() === '') {
            $('.nameCheck').css('color', 'red');
            $('.nameCheck').text('이름을 입력하세요.');
        } else if ($('.birth').val() === '') {
            $('.birthCheck').css('color', 'red');
            $('.birthCheck').text('생년월일을 입력하세요');
        } else {
            if ($('.idCheck').text() === '중복검사 성공' &&
                pwCheck() === 'success' &&
                pwCheckCheck() === 'success' &&
                nameCheck() === 'success' &&
                birthCheck() === 'success') {
                axios.post('/join',
                    {
                        user_id: $('.id').val(),
                        user_pw: $('.pw').val(),
                        user_name: $('.name').val(),
                        user_birth: $('.birth').val()
                    }
                ).then(response => {
                    if (response.data === 1) {
                        window.alert('회원가입에 성공하였습니다.');
                        act({ state: 'login' });
                    } else {
                        window.alert('회원가입에 실패하였습니다.');
                        act({ state: 'login' });
                    }
                });
            }
        }
    }

    //아이디 정규표현식 검사 및 중복검사
    function idCheck() {
        const idInput = $('.id').val();
        var regex = /^[a-z]+[a-z0-9]{4,19}$/g;
        if (regex.test(idInput)) {
            axios.post('/idDuplicateCheck',
                { user_id: idInput }
            ).then(response => {
                if (response.data === 0) {
                    $('.idCheck').css('color', 'green');
                    $('.idCheck').text('중복검사 성공');
                } else {
                    $('.idCheck').css('color', 'red');
                    $('.idCheck').text('이미 있는 아이디입니다.');
                }
            });
        } else {
            $('.idCheck').css('color', 'red');
            $('.idCheck').text('아이디는 영문자 또는 숫자 6~20자 입니다.');
        }
    }

    //비밀번호 정규표현식 검사
    function pwCheck() {
        let result = '';
        const pwInput = $('.pw').val();
        var regex = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/;
        if (regex.test(pwInput)) {
            $('.pwCheck').css('color', 'green');
            $('.pwCheck').text('안전한 비밀번호입니다.');
            result = 'success';
        } else {
            $('.pwCheck').css('color', 'red');
            $('.pwCheck').text('8 ~ 16자 영문, 숫자, 특수문자를 포함해야합니다.');
        }
        return result;
    }

    //비밀번호 확인 검사
    function pwCheckCheck() {
        let result = '';
        const pwCheckInput = $('.pw-check').val();
        if (pwCheckInput === $('.pw').val()) {
            $('.pw-checkCheck').css('color', 'green');
            $('.pw-checkCheck').text('비밀번호가 일치합니다.');
            result = 'success';
        } else {
            $('.pw-checkCheck').css('color', 'red');
            $('.pw-checkCheck').text('비밀번호가 일치하지 않습니다.');
        }
        return result;
    }

    //이름 정규표현식 검사
    function nameCheck() {
        let result = '';
        const nameInput = $('.name').val();
        const regex = /[ㄱ-힣]/;
        if (regex.test(nameInput)) {
            $('.nameCheck').css('color', 'green');
            $('.nameCheck').text(nameInput + '님 환영합니다.');
            result = 'success';
        } else {
            $('.nameCheck').css('color', 'red');
            $('.nameCheck').text('한글만 작성해주시길 바랍니다.');
        }
        return result;
    }

    //생년월일 입력 검사
    function birthCheck() {
        let result = '';
        const birthInput = $('.birth').val();
        if (birthInput !== '') {
            $('.birth').addClass('has-value');
            $('.birthCheck').css('color', 'green');
            $('.birthCheck').text('생년월일이 정상적으로 입력되었습니다.');
            result = 'success';
        }
        return result;
    }

    return (
        <div className="join-outer-box">
            <div className="login-arrow" onClick={prevBtn}></div>
            <div className="join-wrap">
                <div className='join-title'>

                </div>
                <div className='input-idpw'>
                    <input type="text" name='id' className="id join-input" placeholder="아이디를 입력하세요" onChange={idCheck}></input>
                    <p className="idCheck"></p>
                    <input type="password" name='pw' className="pw join-input" placeholder="비밀번호를 입력하세요" onChange={pwCheck}></input>
                    <p className="pwCheck"></p>
                    <input type="password" name='pw-check' className="pw-check join-input" placeholder="비밀번호를 똑같이 입력하세요" onChange={pwCheckCheck}></input>
                    <p className="pw-checkCheck"></p>
                    <input type="text" name="name" className="name join-input" placeholder="이름을 입력하세요" onChange={nameCheck}></input>
                    <p className="nameCheck"></p>
                    <input type="date" name="birth" className="birth join-input" data-placeholder='생년월일 입력' onChange={birthCheck}></input>
                    <p className='birthCheck'></p>
                </div>
                <div className="join-btn-wrap">
                    <button className="join-btn" onClick={joinActBtn}>회원가입</button>
                </div>
            </div>
        </div>
    );
}