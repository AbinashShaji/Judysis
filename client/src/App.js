
import './App.css';
import LandingNavbar from './Components/LandingPage/LandingNavbar';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'remixicon/fonts/remixicon.css';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Landingcarousel from './Components/LandingPage/Landingcarousel';
import AboutUs from './Components/Common/AboutUs';
import UserFooter from './Components/Common/UserFooter';
import LandingServices from './Components/LandingPage/LandingServices';
import ContactUs from './Components/Common/ContactUs';
import AdminLogin from './Components/Admin/Login/AdminLogin';
import AdminFooter from './Components/Admin/Common/AdminFooter';
import UserRegistration from './Components/User/UserRegistration';
import AdminMain from './Components/Admin/Dashboard/AdminMain';
import AdminNav from './Components/Admin/Common/AdminNav';
import ScrollToTop from './ScrollToTop';
import { ToastContainer, toast } from 'react-toastify';
import UserLogin from './Components/User/UserLogin';
import UserHome from './Components/User/UserHome';
import UserNavbar from './Components/User/UserNavbar';
import UserProfile from './Components/User/UserProfile';
import AdvcateReg from './Components/Advocates/AdvocateReg';
import AdvocateLogin from './Components/Advocates/AdvocateLogin';
import AdvocateHome from './Components/Advocates/AdvocateHome';
import AdvocateNavbar from './Components/Advocates/AdvocateNavbar';
import ViewProfile_AR from './Components/Admin/Dashboard/ViewProfile_AR';
import UserAddCases from './Components/User/UserAddCases';
import UserViewRecentCases from './Components/User/UserViewRecentCases';
import User_RequestAdvocate from './Components/User/User_RequestAdvocate';
import User_BookAppoinment from './Components/User/User_BookAppoinment';
import Advocate_ViewCaseRequest from './Components/Advocates/Advocate_ViewCaseRequest';
import AdvocateViewCaseReq from './Components/Advocates/AdvocateViewCaseReq';
import AdvocateEditProfile from './Components/Advocates/AdvocateEditProfile';
import UserChattoAdvocate from './Components/User/UserChattoAdvocate';
import AdvocateChat from './Components/Advocates/AdvocateChat';
import COLogin from './Components/CourtOffice/COLogin';
import COMain from './Components/CourtOffice/Dashboard/COMain';
import JudgeLogin from './Components/Judge/JudgeLogin';
import JudgeHome from './Components/Judge/JudgeHome';
import JudgeNavbar from './Components/Judge/JudgeNavbar';
import JudgeViewCases from './Components/Judge/JudgeViewCases';
import JudgeViewSingleCase from './Components/Judge/JudgeViewSingleCase';
import CaseHearings from './Components/Judge/CaseHearings';
import JudgeViewClosedCases from './Components/Judge/JudgeViewClosedCases';
import AdvocateViewAprvdCases from './Components/Advocates/AdvocateViewAprvdCases';
import AdvocateViewSingleAprvd from './Components/Advocates/AdvocateViewSingleAprvd';
import AdvocateCaseHearings from './Components/Advocates/AdvocateCaseHearings';
import UserViewHearingDetails from './Components/User/UserViewHearingDetails';
import User_ViewAllAdvocates from './Components/User/User_ViewAllAdvocates';
import User_ViewAdvocateDetail from './Components/User/User_ViewAdvocateDetail.jsx';
import UserAddFeedbacks from './Components/User/UserAddFeedbacks.js';

import ViewProfile_AllAdvocate from './Components/Admin/Dashboard/ViewProfile_AllAdvocate.js';

function App() {
  return (
    <div className="App">

      <BrowserRouter basename="judisys">
        <ScrollToTop />
        <ToastContainer
          autoClose={3000}  // 3 seconds default close time
          hideProgressBar={true}  // Hide progress bar globally
          position="top-right"  // Default position for all toasts
        />
        <div>
          <Routes>
            {/* Common routes */}
            <Route path="/" element={(<LandingNavbar />, <Landingcarousel />)} />
            <Route path="/aboutus" element={[ <AboutUs />, <UserFooter />]} />
            <Route path="/services" element={[ <LandingServices />, <UserFooter />]} />
            <Route path="/contactus" element={[<LandingNavbar />, <ContactUs />, <UserFooter />]} />
            <Route path="/user_aboutus" element={[<UserNavbar />, <AboutUs />, <UserFooter />]} />
            <Route path="/advocate_aboutus" element={[<AdvocateNavbar />, <AboutUs />, <UserFooter />]} />



            {/* Admin  */}
            <Route path="/admin-login" element={[<LandingNavbar />, <AdminLogin />, <AdminFooter />]} />
            <Route path="/admin-dashboard" element={[<AdminNav />, <AdminMain data="admindashboard" />, <AdminFooter />]} />
            <Route path="/admin-viewallusers" element={[<AdminNav />, <AdminMain data="adminviewallusers" />, <AdminFooter />]} />
            <Route path="/admin-userreqs" element={[<AdminNav />, <AdminMain data="admin-userreqs" />, <AdminFooter />]} />
            <Route path="/admin-viewalladvocates" element={[<AdminNav />, <AdminMain data="adminviewalladvocates" />, <AdminFooter />]} />
            <Route path="/admin-adv-reqs" element={[<AdminNav />, <AdminMain data="admin-adv-reqs" />, <AdminFooter />]} />
            <Route path="/adminviewrequest/:id" element={[<AdminNav />, <AdminMain data="adminviewrequest" />, <AdminFooter />]} />
            <Route path="/admin_view_single_user/:id" element={[<AdminNav />, <AdminMain data="admin-view-single-user" />, <AdminFooter />]} />
            <Route path="/admin_view_cases" element={[<AdminNav />, <AdminMain data="admin_view_cases" />, <AdminFooter />]} />
            <Route path="/admin_view_feedbacks" element={[<AdminNav />, <AdminMain data="admin_view_feedbacks" />, <AdminFooter />]} />
            <Route path="/admin_view_single_case/:id" element={[<AdminNav />, <AdminMain data="viewSingleCase" />, <AdminFooter />]} />

            <Route path='/admin_view_single_advocate/:id' element={[<AdminNav />,<ViewProfile_AllAdvocate/>,<AdminFooter />]}/>
            <Route path="/admin_view_judges" element={[<AdminNav />, <AdminMain data="admin_view_judges" />, <AdminFooter />]} />

            {/* user */}
            <Route path="/user-reg" element={[<LandingNavbar />, <UserRegistration />, <UserFooter />]} />
            <Route path="/user-login" element={[<LandingNavbar />, <UserLogin />, <UserFooter />]} />
            <Route path="/user-home" element={[<UserNavbar />, <UserHome />, <UserFooter />]} />
            <Route path="/user_profile" element={[<UserNavbar />, <UserProfile />, <UserFooter />]} />
            <Route path="/user_view_case" element={[<UserNavbar />, <UserViewRecentCases />, <UserFooter />]} />
            <Route path="/user-request-advocate/:id" element={[<UserNavbar />, <User_RequestAdvocate />, <UserFooter />]} />
            <Route path="/user_bookappoinment/:id/:cid" element={[<UserNavbar />, <User_BookAppoinment />, <UserFooter />]} />
            <Route path="/user_add_case" element={[<UserNavbar />, <UserAddCases />, <UserFooter />]} />
            <Route path="/user_chat_to_advocate/:aid" element={[<UserNavbar />, <UserChattoAdvocate />, <UserFooter />]} />
            <Route path="/user_view_case_updations/:id" element={[<UserNavbar />, <UserViewHearingDetails />, <UserFooter />]} />
            <Route path="/user-viewalladvocate" element={[<UserNavbar />,<User_ViewAllAdvocates />,<UserFooter/>]} />
            <Route path="/user_view_advocate_detail/:id" element={[<UserNavbar />,<User_ViewAdvocateDetail/>,<UserFooter/>]} />
            <Route path="/user-add-feed" element={[<UserNavbar />,<UserAddFeedbacks/>,<UserFooter/>]} />
            



            {/* Advocate */}
            <Route path="/att-signup" element={[<LandingNavbar />, <AdvcateReg />, <UserFooter />]} />
            <Route path="/advocate-login" element={[<LandingNavbar />, <AdvocateLogin />, <UserFooter />]} />
            <Route path="/advocate-home" element={[<AdvocateNavbar />, <AdvocateHome />, <UserFooter />]} />
            <Route path="/advocate_viewcasereq" element={[<AdvocateNavbar />, <Advocate_ViewCaseRequest />, <UserFooter />]} />
            <Route path="/advocate_view_single_case_req/:id" element={[<AdvocateNavbar />, <AdvocateViewCaseReq />, <UserFooter />]} />
            <Route path="/advocate_edit_profile" element={[<AdvocateNavbar />, <AdvocateEditProfile />, <UserFooter />]} />
            <Route path="/advocate_chat" element={[<AdvocateNavbar />, <AdvocateChat />, <UserFooter />]} />
            <Route path="/advocate_single_chat/:uid" element={[<AdvocateNavbar />, <AdvocateChat />, <UserFooter />]} />
            <Route path="/advocate_view_all_recent_case" element={[<AdvocateNavbar />, <AdvocateViewAprvdCases />, <UserFooter />]} />
            <Route path="/single_aprvd_case_req/:id" element={[<AdvocateNavbar />, <AdvocateViewSingleAprvd />, <UserFooter />]} />
            <Route path="/adv-case-hearings/:id" element={[<AdvocateNavbar />, <AdvocateCaseHearings />, <UserFooter />]} />



            {/* CO */}
            <Route path="/co-login" element={[<LandingNavbar />, <COLogin />, <AdminFooter />]} />
            <Route path="/co-dashboard" element={[<AdminNav />, <COMain data="co-dashboard" />, <AdminFooter />]} />
            <Route path="/co-viewallusers" element={[<AdminNav />, <COMain data="co-viewallusers" />, <AdminFooter />]} />
            <Route path="/co-add-judge" element={[<AdminNav />, <COMain data="add-judge" />, <AdminFooter />]} />
            <Route path="/co-view-judges" element={[<AdminNav />, <COMain data="co-view-judges" />, <AdminFooter />]} />
            <Route path="co_view_cases" element={[<AdminNav />, <COMain data="co_view_cases" />, <AdminFooter />]} />

            <Route path="co-view-single-judge/:id" element={[<AdminNav />, <COMain data="co-view-single-judge" />, <AdminFooter />]} />
            <Route path="co-view-singleCase/:id" element={[<AdminNav />, <COMain data="co-view-singleCase" />, <AdminFooter />]} />
            <Route path="co_view_AllAccepted_Cases" element={[<AdminNav />, <COMain data="co_view_AllAccepted_Cases" />, <AdminFooter />]} />
            <Route path="co_view_AllAcceptedCases_Single/:id" element={[<AdminNav />, <COMain data="co_view_AllAcceptedCases_Single" />, <AdminFooter />]} />


            {/* Judge */}
            <Route path="/judge-login" element={[<LandingNavbar />, <JudgeLogin />, <AdminFooter />]} />
            <Route path="/judge-home" element={[<JudgeNavbar />, <JudgeHome />, <AdminFooter />]} />
            <Route path="/judge-view-cases" element={[<JudgeNavbar />, <JudgeViewCases />, <AdminFooter />]} />
            <Route path="/judge_view_single_case_req/:id" element={[<JudgeNavbar />, <JudgeViewSingleCase />, <AdminFooter />]} />
            <Route path="/case-hearings/:id" element={[<JudgeNavbar />,<CaseHearings/>,<AdminFooter/>]} />
            <Route path="/judge-view-closed-cases" element={[<JudgeNavbar />,<JudgeViewClosedCases/>,<AdminFooter/>]} />


          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;