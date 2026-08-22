import React from 'react'
import '../../Styles/LandingServices.css'
import img1 from "../../Assets/law11.jpeg"
import img3 from "../../Assets/law12.jpg"
import img2 from "../../Assets/img22.jpeg"
import UserNavbar from "../User/UserNavbar";
import AdvocateNavbar from "../Advocates/AdvocateNavbar";
import LandingNavbar from './LandingNavbar'


function LandingServices() {
  const userId = localStorage.getItem("user");
  const advocateId = localStorage.getItem("advocate");

  return (
    <>
          {userId ? (
        <UserNavbar />
      ) : advocateId ? (
        <AdvocateNavbar />
      ) : (
        // <></>
        <LandingNavbar />
      )}

    <div className='landinservicealign'>
   <h1 className='landinserviceh1'> Our Services</h1>
    {/* Cards */}
   
<div class="container">
  <div class="row">
    <div class="col-md-4">
      <div class="card h-100">
      <img class=" card-img-top landinserviceimg" src={img2} alt="Card image cap"/>
    <div class="card-body">
    <h5 class="card-title">Expert Legal Advice</h5>
    <p class="card-text text-justify service-justify">Our experienced advocates provide expert legal advice on various legal matters. Whether you need guidance on family law, business law, or criminal law, we've got you covered.</p>
    
    </div>      </div>
    </div>
    <div class="col-md-4">
      <div class="card h-100">
      <img class="card-img-top landinserviceimg" src={img1} alt="Card image cap"/>
    <div class="card-body">
    <h5 class="card-title">Case Representation</h5>
      <p class="card-text text-justify service-justify">Hire our skilled advocates to represent you in court. We handle cases with professionalism and dedication, ensuring the best possible outcome for our clients.</p>
  
    </div></div>
    </div>
    <div class="col-md-4">
      <div class="card h-100">
      <img class="card-img-top landinserviceimg" src={img3} alt="Card image cap"/>
    <div class="card-body">
    <h5 class="card-title">Case Tracking</h5>
      <p class="card-text text-justify service-justify">Track the status of your case in real-time through our online portal. Receive updates, court dates, and documentation, ensuring you are informed every step of the way.</p>

    </div>      </div>
    </div>
  </div><br/>
</div>

    </div>
    </>
  )
}

export default LandingServices