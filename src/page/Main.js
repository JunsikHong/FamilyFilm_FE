import "css/Main.css"
import MainMemoList from "component/MainMemoList";
import MainCalendarList from "component/MainCalendarList";

export default function Main() {

    return (
        <div>
            <div className="main-wrap">
                <div className="main-section">

                    <div className="memo-section">
                        <MainMemoList/>
                    </div>

                    <div className="schedule-section">
                        <MainCalendarList/>
                    </div>

                    <div className="film-section">

                    </div>

                </div>
            </div>
        </div >
    );
}