import { useNavigate } from "react-router-dom";

export default function MyPage({loginYNAct}) {
    ////////////////////////////////////////////////////////////////////////////////////
    const navigate = useNavigate();//navigate 객체
    ////////////////////////////////////////////////////////////////////////////////////

    //logout 버튼 누를 때 localstorage에서 삭제
    function logout() {
        localStorage.removeItem('loginYN');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('family_group_num');
        loginYNAct({state : 'fail'});
        navigate('/LogIn');
    }

    return (
        <>
        <button onClick={logout}>logout</button>
        </>
    );
}