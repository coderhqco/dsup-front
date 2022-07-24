import { Routes, Route} from 'react-router-dom';
import SignUpConfirm from './components/signUpConform';
import ClaimYourSeat from './components/Claim-Your-Seat';
import Home from './Home';
import EnterTheFloor from './components/Enter-the-Floor';
import Header from './components/Header';
import Footer from './components/Footer';
import Error from './components/Error';
import VoterPage from './components/Voter-Page';
import ProtectedRoute from './protectedRoutes';


function App(){
  return (
    <Routes>
      <Route>
        <Route index element={<><Header/><Home/><Footer/></>}/>
        <Route path='/claim-your-seat' element={<><Header/><ClaimYourSeat/><Footer/></>}/>
        <Route path="/enter-the-floor" element={<><Header/><EnterTheFloor/><Footer/></>}/>
        <Route path="/voter-page" element={<ProtectedRoute><Header/><VoterPage/><Footer/></ProtectedRoute>}/>
        <Route path="/sign-up" element={<><Header/><SignUpConfirm/><Footer/></>}/>
        <Route path='/*' element={<><Header/><Error/> <Footer/> </>}></Route>
      </Route>
    </Routes>
  )
}

export default App;