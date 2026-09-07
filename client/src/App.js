/**
 * ============================================================================
 * COMPONENT: App.js (Frontend Master Route Controller)
 * HANDOVER SUMMARY:
 * This is the central navigation map for the entire JudiSys frontend.
 * It uses React Router to decide which screen, navigation bar, and footer to display
 * based on the URL in the browser address bar. It organizes routes into 5 distinct
 * user roles: Public/Common, Admin, Citizen (Litigant), Advocate (Lawyer), Judge, 
 * and Court Office.
 * ============================================================================
 */

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
      {/* 
        BrowserRouter manages history and synchronizes the UI with the URL.
        'basename="judisys"' sets the base path for deployment hosting.
      */}
      <BrowserRouter basename="judisys">
        {/* Helper that automatically scrolls the browser window to top on page transition */}
        <ScrollToTop />

        {/* Global Toast Alert container for pop-up success and error alerts */}
        <ToastContainer
          autoClose={3000}        // Alerts stay on screen for 3 seconds
          hideProgressBar={true}  // Clean alert styling
          position="top-right"    // Appears at top-right corner of the user's screen
        />

        <div>
          <Routes>
            {/* =======================================================
                1. PUBLIC & COMMON INFORMATION PAGES (No Login Required)
               ======================================================= */}
            
            {/* Home Landing Page: Hero slider carousel with introductory information */}
            <Route path="/" element={(<LandingNavbar />, <Landingcarousel />)} />
            
            {/* About Us Information screen explaining JudiSys judicial mission */}
            <Route path="/aboutus" element={[ <AboutUs />, <UserFooter />]} />
            
            {/* Services Overview listing citizen features, lawyer discovery, and court docketing */}
            <Route path="/services" element={[ <LandingServices />, <UserFooter />]} />
            
            {/* Contact Information & Help Desk inquiry screen */}
            <Route path="/contactus" element={[<LandingNavbar />, <ContactUs />, <UserFooter />]} />
            
            {/* About Us page with logged-in Citizen navigation header */}
            <Route path="/user_aboutus" element={[<UserNavbar />, <AboutUs />, <UserFooter />]} />
            
            {/* About Us page with logged-in Advocate navigation header */}
            <Route path="/advocate_aboutus" element={[<AdvocateNavbar />, <AboutUs />, <UserFooter />]} />

            {/* =======================================================
                2. SYSTEM ADMINISTRATOR PORTAL (ROLE: ADMIN)
               ======================================================= */}
            
            {/* Admin Login: Sign in with master credentials */}
            <Route path="/admin-login" element={[<LandingNavbar />, <AdminLogin />, <AdminFooter />]} />
            
            {/* Admin Master Dashboard: Displays platform statistics, totals, and metrics */}
            <Route path="/admin-dashboard" element={[<AdminNav />, <AdminMain data="admindashboard" />, <AdminFooter />]} />
            
            {/* User Directory: List all approved citizens with activate/deactivate controls */}
            <Route path="/admin-viewallusers" element={[<AdminNav />, <AdminMain data="adminviewallusers" />, <AdminFooter />]} />
            
            {/* Pending Citizen Applications: Review and approve new user signups */}
            <Route path="/admin-userreqs" element={[<AdminNav />, <AdminMain data="admin-userreqs" />, <AdminFooter />]} />
            
            {/* Advocate Directory: List all verified lawyers in the judicial network */}
            <Route path="/admin-viewalladvocates" element={[<AdminNav />, <AdminMain data="adminviewalladvocates" />, <AdminFooter />]} />
            
            {/* Pending Advocate Verification: Inspect Bar Council IDs and approve new lawyers */}
            <Route path="/admin-adv-reqs" element={[<AdminNav />, <AdminMain data="admin-adv-reqs" />, <AdminFooter />]} />
            
            {/* Single Advocate Review: Detailed document inspection modal for lawyer applications */}
            <Route path="/adminviewrequest/:id" element={[<AdminNav />, <AdminMain data="adminviewrequest" />, <AdminFooter />]} />
            
            {/* Single Citizen Review: Detailed user profile inspection */}
            <Route path="/admin_view_single_user/:id" element={[<AdminNav />, <AdminMain data="admin-view-single-user" />, <AdminFooter />]} />
            
            {/* Master Case Oversight: View all filed legal cases across the platform */}
            <Route path="/admin_view_cases" element={[<AdminNav />, <AdminMain data="admin_view_cases" />, <AdminFooter />]} />
            
            {/* Citizen Reviews & Feedback: Read user suggestions and platform complaints */}
            <Route path="/admin_view_feedbacks" element={[<AdminNav />, <AdminMain data="admin_view_feedbacks" />, <AdminFooter />]} />
            
            {/* Detailed Case Dossier: View petition, evidence attachments, and assigned parties */}
            <Route path="/admin_view_single_case/:id" element={[<AdminNav />, <AdminMain data="viewSingleCase" />, <AdminFooter />]} />

            {/* Advocate Profile Overview: Inspect an active lawyer's full profile */}
            <Route path='/admin_view_single_advocate/:id' element={[<AdminNav />,<ViewProfile_AllAdvocate/>,<AdminFooter />]}/>
            
            {/* Judge Directory: List all judges and manage their active courtroom status */}
            <Route path="/admin_view_judges" element={[<AdminNav />, <AdminMain data="admin_view_judges" />, <AdminFooter />]} />

            {/* =======================================================
                3. CITIZEN / LITIGANT PORTAL (ROLE: USER)
               ======================================================= */}
            
            {/* Citizen Onboarding: Registration form with photo upload */}
            <Route path="/user-reg" element={[<LandingNavbar />, <UserRegistration />, <UserFooter />]} />
            
            {/* Citizen Sign In: Authenticate and access litigant services */}
            <Route path="/user-login" element={[<LandingNavbar />, <UserLogin />, <UserFooter />]} />
            
            {/* Citizen Dashboard: Main hub showing active cases and quick actions */}
            <Route path="/user-home" element={[<UserNavbar />, <UserHome />, <UserFooter />]} />
            
            {/* Citizen Profile: View and edit personal contact info and profile photo */}
            <Route path="/user_profile" element={[<UserNavbar />, <UserProfile />, <UserFooter />]} />
            
            {/* Case History: List of all cases filed by this citizen with current milestones */}
            <Route path="/user_view_case" element={[<UserNavbar />, <UserViewRecentCases />, <UserFooter />]} />
            
            {/* Request Lawyer: Submit a legal case to an advocate for representation */}
            <Route path="/user-request-advocate/:id" element={[<UserNavbar />, <User_RequestAdvocate />, <UserFooter />]} />
            
            {/* Book Appointment: Schedule a consultation slot with a selected advocate */}
            <Route path="/user_bookappoinment/:id/:cid" element={[<UserNavbar />, <User_BookAppoinment />, <UserFooter />]} />
            
            {/* File New Case: Digital petition submission form with evidence upload */}
            <Route path="/user_add_case" element={[<UserNavbar />, <UserAddCases />, <UserFooter />]} />
            
            {/* In-App Legal Chat: Real-time messaging between citizen and assigned lawyer */}
            <Route path="/user_chat_to_advocate/:aid" element={[<UserNavbar />, <UserChattoAdvocate />, <UserFooter />]} />
            
            {/* Court Hearing Timeline: Chronological courtroom progress log and upcoming dates */}
            <Route path="/user_view_case_updations/:id" element={[<UserNavbar />, <UserViewHearingDetails />, <UserFooter />]} />
            
            {/* Lawyer Catalog: Search verified lawyers filtered by legal specialization */}
            <Route path="/user-viewalladvocate" element={[<UserNavbar />,<User_ViewAllAdvocates />,<UserFooter/>]} />
            
            {/* Lawyer Public Profile: Bio, experience, qualifications, and star ratings */}
            <Route path="/user_view_advocate_detail/:id" element={[<UserNavbar />,<User_ViewAdvocateDetail/>,<UserFooter/>]} />
            
            {/* Submit Feedback: Leave ratings and service comments for the administration */}
            <Route path="/user-add-feed" element={[<UserNavbar />,<UserAddFeedbacks/>,<UserFooter/>]} />

            {/* =======================================================
                4. ADVOCATE / LAWYER PORTAL (ROLE: ADVOCATE)
               ======================================================= */}
            
            {/* Lawyer Registration: Upload Bar Council proof and professional credentials */}
            <Route path="/att-signup" element={[<LandingNavbar />, <AdvcateReg />, <UserFooter />]} />
            
            {/* Lawyer Sign In: Authenticate to access lawyer dashboard */}
            <Route path="/advocate-login" element={[<LandingNavbar />, <AdvocateLogin />, <UserFooter />]} />
            
            {/* Lawyer Home Dashboard: Overview of active cases, appointments, and upcoming hearings */}
            <Route path="/advocate-home" element={[<AdvocateNavbar />, <AdvocateHome />, <UserFooter />]} />
            
            {/* Incoming Case Requests: Queue of citizens asking for legal representation */}
            <Route path="/advocate_viewcasereq" element={[<AdvocateNavbar />, <Advocate_ViewCaseRequest />, <UserFooter />]} />
            
            {/* Review Single Case Request: Accept or decline citizen petition representation */}
            <Route path="/advocate_view_single_case_req/:id" element={[<AdvocateNavbar />, <AdvocateViewCaseReq />, <UserFooter />]} />
            
            {/* Lawyer Profile Settings: Update contact info, bio, and practice details */}
            <Route path="/advocate_edit_profile" element={[<AdvocateNavbar />, <AdvocateEditProfile />, <UserFooter />]} />
            
            {/* Lawyer Chat Hub: Messenger interface with conversation list of all clients */}
            <Route path="/advocate_chat" element={[<AdvocateNavbar />, <AdvocateChat />, <UserFooter />]} />
            
            {/* Direct Client Chat: Opens active chat thread with a specific citizen */}
            <Route path="/advocate_single_chat/:uid" element={[<AdvocateNavbar />, <AdvocateChat />, <UserFooter />]} />
            
            {/* Active Caseload: List of all ongoing trials represented by this lawyer */}
            <Route path="/advocate_view_all_recent_case" element={[<AdvocateNavbar />, <AdvocateViewAprvdCases />, <UserFooter />]} />
            
            {/* Detailed Case Dossier for Advocate: Review court documents and opponent party info */}
            <Route path="/single_aprvd_case_req/:id" element={[<AdvocateNavbar />, <AdvocateViewSingleAprvd />, <UserFooter />]} />
            
            {/* Court Hearing Calendar: Lawyer's schedule of upcoming courtroom proceedings */}
            <Route path="/adv-case-hearings/:id" element={[<AdvocateNavbar />, <AdvocateCaseHearings />, <UserFooter />]} />

            {/* =======================================================
                5. COURT OFFICE PORTAL (ROLE: COURT CLERK / OFFICE)
               ======================================================= */}
            
            {/* Court Office Login: Authentication for administrative court staff */}
            <Route path="/co-login" element={[<LandingNavbar />, <COLogin />, <AdminFooter />]} />
            
            {/* Court Office Dashboard: Administrative court management center */}
            <Route path="/co-dashboard" element={[<AdminNav />, <COMain data="co-dashboard" />, <AdminFooter />]} />
            
            {/* Citizen Registry: View all registered citizens in the jurisdiction */}
            <Route path="/co-viewallusers" element={[<AdminNav />, <COMain data="co-viewallusers" />, <AdminFooter />]} />
            
            {/* Onboard Judge: Register a new presiding judge into the judicial network */}
            <Route path="/co-add-judge" element={[<AdminNav />, <COMain data="add-judge" />, <AdminFooter />]} />
            
            {/* Presiding Judges List: View and filter all courtroom judges */}
            <Route path="/co-view-judges" element={[<AdminNav />, <COMain data="co-view-judges" />, <AdminFooter />]} />
            
            {/* Court Case Log: Review all cases filed across the court registry */}
            <Route path="co_view_cases" element={[<AdminNav />, <COMain data="co_view_cases" />, <AdminFooter />]} />

            {/* Judge Detail Inspection: View single judge profile and courtroom assignments */}
            <Route path="co-view-single-judge/:id" element={[<AdminNav />, <COMain data="co-view-single-judge" />, <AdminFooter />]} />
            
            {/* Single Case Inspection: Court clerk review of case petition and evidence */}
            <Route path="co-view-singleCase/:id" element={[<AdminNav />, <COMain data="co-view-singleCase" />, <AdminFooter />]} />
            
            {/* Cases Awaiting Judge Assignment: Queue of cases accepted by lawyers ready for trial */}
            <Route path="co_view_AllAccepted_Cases" element={[<AdminNav />, <COMain data="co_view_AllAccepted_Cases" />, <AdminFooter />]} />
            
            {/* Assign Presiding Judge: Assign an active judge to an accepted case */}
            <Route path="co_view_AllAcceptedCases_Single/:id" element={[<AdminNav />, <COMain data="co_view_AllAcceptedCases_Single" />, <AdminFooter />]} />

            {/* =======================================================
                6. JUDGE PORTAL (ROLE: JUDGE)
               ======================================================= */}
            
            {/* Judge Login: Official courtroom authentication */}
            <Route path="/judge-login" element={[<LandingNavbar />, <JudgeLogin />, <AdminFooter />]} />
            
            {/* Judge Chamber Home: Today's hearings overview and courtroom docket */}
            <Route path="/judge-home" element={[<JudgeNavbar />, <JudgeHome />, <AdminFooter />]} />
            
            {/* Active Court Docket: Cases currently under judicial trial by this judge */}
            <Route path="/judge-view-cases" element={[<JudgeNavbar />, <JudgeViewCases />, <AdminFooter />]} />
            
            {/* Judicial Dossier Review: Judge inspects case petitions and legal arguments */}
            <Route path="/judge_view_single_case_req/:id" element={[<JudgeNavbar />, <JudgeViewSingleCase />, <AdminFooter />]} />
            
            {/* Hearing Management: Record court proceedings, next hearing dates, and final verdicts */}
            <Route path="/case-hearings/:id" element={[<JudgeNavbar />,<CaseHearings/>,<AdminFooter/>]} />
            
            {/* Concluded Cases Archive: Review past closed cases and completed verdicts */}
            <Route path="/judge-view-closed-cases" element={[<JudgeNavbar />,<JudgeViewClosedCases/>,<AdminFooter/>]} />

          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;