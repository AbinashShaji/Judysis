import React, { useEffect } from "react";
import "../../Styles/UserHome.css";
import icon1 from "../../Assets/userBannerIcon1.png";
import icon2 from "../../Assets/userBannerIcon2.png";
import icon3 from "../../Assets/userBannerIcon3.png";
import icon4 from "../../Assets/userBannerIcon4.png";
import img from "../../Assets/userHomeAboutImage.png";
import ficon1 from "../../Assets/userFeaturesIcon1.png";
import ficon2 from "../../Assets/userFeaturesIcon2.png";
import ficon3 from "../../Assets/userFeaturesIcon3.png";
import { useNavigate } from "react-router-dom";

function UserHome() {

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('user') == null) {
      navigate('/user-login');
    }
  }, [navigate]);

  return (
    <div>
      <div className="user_home bg-dark">
        <div className="container">
          <div className="row">
            <div className="col-6"></div>
            <div className="col-6">
              <div className="user_home_container">
                <div className="user_home_content_box">
                  <p className="user_home_title text-justify">
                    Reputation. Respect, Results.
                  </p>
                  <p className="user_home_content mt-4 text-justify">
                    We know what is to defend rights.We work with people for,and
                    with the full respect to the law.
                  </p>
                </div>
              </div>
            </div>
            <div className="user_home_card_container ">
              <div className="user_home_cards">
                <img src={icon1} />
                <p>Bussiness Law</p>
              </div>
              <div className="user_home_cards">
                <img src={icon2} />
                <p>Civil Litigation </p>
              </div>
              <div className="user_home_cards">
                <img src={icon3} />
                <p>Insurance Defence</p>
              </div>
              <div className="user_home_cards">
                <img src={icon4} />
                <p>Quick Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="user_home_about">
        <div className="container">
          <div className="row">
            <div className="col-8 pt-5 pb-4">
              <p className="user_home_about_title">Learn About Us</p>
              <p className="user_home_about_content text-justify">
                welcome to our platform, where innovation meets efficiency in
                the legal landscape, wpride ourselves on offering a cutting-edge
                solution designed to simplfy and streamlinethe complexities of
                legal processe.our platform serves as a hub for
                administrates,advocates, judges, and court coordinators alike,
                providing intitute tols and resources tallored to their
                respective roles
              </p>
              <p className="user_home_about_content text-justify">
                For administrators, our feature-rich dashboard empovers seamless
                management of useraccounts, including the addition and removal
                of judges, verification of advocates credentials, and
                appointment of court coordinators.
              </p>
            </div>
            <div className="col-4">
              <div className="user_home_about_image">
                <img src={img} className="img-fluid" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="user_home_features">
        <div className="container">
            <div className="row">
                <div className="user_home_features_title mt-4">
                    <p className="user_home_about_title" >Our Features</p>
                </div>
                <div className="user_home_features_container" >
                <div className="user_features_cards">
                    <img src={ficon1}/>
                    <div className="mx-4" >
                        <p className="user_features_card_title" >Results you deserve</p>
                        <p className="user_features_card_content text-justify" >ensuring that you receive the outcomes you rightfully meritthrough our dedicaed efforts and commitment to inevery aspect of our service.</p>
                    </div>
                </div>
                <div className="user_features_cards">
                    <img src={ficon2}/>
                    <div className="mx-4" >
                        <p className="user_features_card_title" >Efficiency & Trust</p>
                        <p className="user_features_card_content text-justify" >Delivering services with a focus on botheffectiveness and reliability, ensuring that you can acheive your goals efficiently and with unwavering trust.</p>
                    </div>
                </div>
                <div className="user_features_cards">
                    <img src={ficon3}/>
                    <div className="mx-4" >
                        <p className="user_features_card_title" >Best Law Practices</p>
                        <p className="user_features_card_content text-justify" >implementing superior methods and strategies to provideexceptional legal services and uphold the higheststandards of client satisfaction.</p>
                    </div>
                </div>
                
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default UserHome;
