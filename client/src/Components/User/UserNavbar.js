import React, { useEffect } from 'react'
import img1 from '../../Assets/logo2.png';
import { Link, useNavigate } from 'react-router-dom';
import '../../Styles/AdminNav.css'

function UserNavbar() {

    const navigate=useNavigate();
    const userId=localStorage.getItem('user')
    console.log(userId);
    

    useEffect(()=>{
        if(userId===null){
            navigate('/')
        }
    })

    const handleLogout = () => {
      localStorage.removeItem('user');
        navigate("/");
        // setTimeout(() => {
        //   window.location.reload();
        // }, 500);
       
      };

  return (
    <div>
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark landing_custom_navbar landing_custom_-right">
    <div className="container-fluid">
        {/* <Link className="navbar-brand" to="#home"> */}
        <img
            alt="Logo"
            src={img1}
            width="70"
            height="80"
            className="d-inline-block align-top"
          />{' '}
          JudiSys
        {/* </Link> */}
        <button className="navbar-toggler" 
        type="button" 
        data-toggle="collapse" 
        data-target="#navbarNav"
         aria-controls="navbarNav" 
         aria-expanded="false"
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse flex-grow-0 mt-3 landingnavbar_text" >
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/user-home">Home</Link> 
            </li>
            <li className="nav-item dropdown">
              <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Cases
              </Link>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <Link to='/user_add_case' className="dropdown-item" >Add Cases</Link>
                <Link to='/user_view_case' className="dropdown-item" >Recent Cases</Link>
                {/* <Link to={''}  className="dropdown-item" >Advocates</Link> */}
                
              </div>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/user-viewalladvocate">Advocate</Link>
            </li>
           
            <li className="nav-item">
              <Link className="nav-link" to="/user-add-feed">Feedback</Link>
            </li>
            <li className="nav-item dropdown">
              <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Settings
              </Link>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <Link to='/user_profile' className="dropdown-item" >Profile</Link>
                <Link onClick={handleLogout} to='' className="dropdown-item" >Logout</Link>
                {/* <button onClick={handleLogout} className="dropdown-item" style={{ border: 'none', background: 'none', padding: 0, color: 'inherit',marginLeft:'15px' }}> */}
  {/* Logout
</button> */}

              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    </div>
  )
}

export default UserNavbar
