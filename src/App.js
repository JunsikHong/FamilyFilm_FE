//css
import 'App.css';
import 'css/Head.css';

//lib
import { Routes, Route, Navigate } from "react-router-dom";
import { useReducer } from 'react';

//component
import Head from "component/Head"

//page
import NotFound from "page/NotFound";
import Main from "page/Main";
import LogIn from "page/LogIn";
import Film from "page/Film";
import Memo from "page/Memo";
import Schedule from "page/Schedule";
import MyPage from 'page/MyPage';
import RegistFamily from 'page/RegistFamily';

const loginYNFunc = function (state, action) {
  state = {
    state: action.state
  }
  return state;
}

function App() {

  ////////////////////////////////////////////////////////////////////////////////////
  const [loginYN, act] = useReducer(loginYNFunc, {
    state: 'fail'
  });//login 여부 상태 확인
  ////////////////////////////////////////////////////////////////////////////////////

  return (
    <>
      <Head loginYN={loginYN}/>
      <Routes>
        {localStorage.getItem('loginYN') !== 'success' && (
          <>
            <Route path="/LogIn" element={<LogIn loginYN={loginYN} loginYNAct={act} />} />
            <Route path="*" element={<Navigate replace to="/LogIn" />} />
          </>
        )}

        {localStorage.getItem('loginYN') === 'success' && (
          <>
            <Route path="/" element={<Main />} />
            <Route path="/RegistFamily" element={<RegistFamily />} />
            <Route path="/Film" element={<Film />} />
            <Route path="/Memo" element={<Memo />} />
            <Route path="/Schedule" element={<Schedule />} />
            <Route path="/MyPage" element={<MyPage loginYN={loginYN} loginYNAct={act} />} />
            <Route path="*" element={<NotFound />} />
          </>
        )}
      </Routes>
    </>
  );
}

export default App;
