import React, { useState } from 'react';
import { toast } from 'react-toastify';
import '../../Styles/UserFeed.css'
import { register } from '../Services/CommonServices';


function UserAddFeedbacks() {
  const [complaint, setComplaint] = useState('');
  const id=localStorage.getItem('user')

  const handleComplaintChange = (event) => {
    setComplaint(event.target.value);
  };

  const handleAddComplaint = async(event) => {
    event.preventDefault();
    
    try {
     

      const result = await register({'feedback':complaint,userId:id}, 'addfeedback');

      if (result.success) {
        console.log(result);

        toast.success('Feedback Added successfully!');
       


      } else {
        console.error('Feedback error:', result);
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred during Registration');
    }


   
    setComplaint('');
  };

  return (
    <div>
      <div className='feed-heading-div container-fluid'>
        <label className='feed-reg-title'>Add Feedback</label>
      </div>
      <div className='payment-card-center'>
        <div className="card card-style-change">
          <form onSubmit={handleAddComplaint}>
            <div className="card-body">
              <div className='row row-position-adjust'>
                <div className='col-5'>
                  <p className='payment-name-style'>Feedback</p>
                </div>
                <div className='col-2'>
                  <div className='payment-name-style'>:</div>
                </div>
                <div className='col-5'>
                  <textarea
                    className="form-control border border-dark mb-2"
                    name="complaint"
                    value={complaint}
                    onChange={handleComplaintChange}
                    required
                  />
                </div>
              </div>
              <div className="col-12 text-center mt-3">
                <button type="submit" className="btn bg-gold but-move">
                  Add
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserAddFeedbacks;
