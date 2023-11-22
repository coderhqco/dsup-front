import { Routes, Route} from 'react-router-dom';
import SignUpConfirm from './components/signUpConform.jsx';
import ClaimYourSeat from './components/Claim-Your-Seat.jsx';
import Home from './Home.jsx';
import EnterTheFloor from './components/Enter-the-Floor.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Error from './components/Error.jsx';
import VoterPage from './components/Voter-Page.jsx';
import ProtectedRoute from './protectedRoutes.js';
import JoinPod from './components/joinPod.jsx';
import HouseKeeping from './components/houseKeeping/houseKeeping.jsx';
import UserActivate from './components/UserActivate';
import PodBackNforth from './components/PodBackNforth.jsx';
import SettingsPage from './components/SettingsPage.jsx';
// import SearchFeature from './components/SearchFeature.jsx';
import BillPage from './components/bills/BillPage.jsx';
import MemberContactPage from './components/MemberContactPage.jsx';


function App(){
  return (
    <Routes>
      <Route>
        <Route index element={<><Header/><Home/><Footer/></>}/>
        <Route path='/claim-your-seat' element={<><Header/><ClaimYourSeat/><Footer/></>}/>
        <Route path="/enter-the-floor" element={<><Header/><EnterTheFloor/><Footer/></>}/>

        <Route path="/voter-page" element={<ProtectedRoute><Header/><VoterPage/><Footer/></ProtectedRoute>}/>
        <Route path="/house-keeping-page" element={<ProtectedRoute><Header/><HouseKeeping/><Footer/></ProtectedRoute>}/>
        <Route path="/join-pod" element={<ProtectedRoute><Header/><JoinPod/><Footer/></ProtectedRoute>}/>
        <Route path="/pod-back-n-forth" element={<ProtectedRoute><Header/><PodBackNforth/><Footer/></ProtectedRoute>}/>
        
        <Route path="/sign-up" element={<><Header/><SignUpConfirm/><Footer/></>}/>
        <Route path="/api/activate/:uid/:token" element={<><Header/><UserActivate/><Footer/></>}/>
        <Route path='/*' element={<><Header/><Error/> <Footer/> </>}></Route>
        <Route path="/settings" element={<><Header/><SettingsPage/><Footer/></>}/>
        {/* <Route path="/search" element={<><Header/><SearchFeature/><Footer/></>}/> */}
        <Route path="/bill/:billId" element={<><Header/><BillPage/><Footer/></>}/>
        {/* fake path below, real path above for rendering the specific bill that gets clicked on */}
        <Route path="/bill" element={<><Header/><BillPage/><Footer/></>}/>
        <Route path="/member-contact" element={<><Header/><MemberContactPage/><Footer/></>}/>
      </Route>
    </Routes>
  )
}

export default App;