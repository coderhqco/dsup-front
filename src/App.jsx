import Home from './Home';
import Header from "./components/Header";
import Footer from "./components/Footer";
import ClaimYourSeat from './components/Claim-Your-Seat'
import EnterTheFloor from './components/Enter-the-Floor'
import Error from './components/Error';
import { Routes, Route} from 'react-router-dom';
import SignUpConfirm from './components/signUpConform';
import VoterPage from './components/Voter-Page';

function App(){
  return (
    <Routes>
      <Route>
        <Route index element={<><Header/><Home/><Footer/></>}/>
        <Route path='/claim-your-seat' element={<><Header/><ClaimYourSeat/><Footer/></>}/>
        <Route path="/enter-the-floor" element={<><Header/><EnterTheFloor/><Footer/></>}/>
        <Route path="/voter-page" element={<><Header/><VoterPage/><Footer/></>}/>
        <Route path="/sign-up" element={<><Header/><SignUpConfirm/><Footer/></>}/>
        <Route path='/*' element={<><Header/><Error/> <Footer/> </>}></Route>
      </Route>
    </Routes>
  )
}

export default App;