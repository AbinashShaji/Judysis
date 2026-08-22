import React from 'react'
import '../../Styles/ContactUs.css'

function ContactUs() {
  return (
    <div className='container'>
        <div className="mt-5">
        <h3>Contact Us</h3>
        <div class="container">
          <p>
            Ready to get started? Contact [Your Legal Practice] today to discuss
            your legal needs. Whether you're seeking legal advice,
            representation, or case management services, we're here to help you
            navigate the complexities of the legal system.
          </p>

          <p>We look forward to serving you!</p>
          <div class="m-1">
            <div class="fs-6  mb-2">
              Post your message below. We will get back to you ASAP
            </div>
            <form id="contact_form" name="contact_form" onSubmit={()=>{alert('Posted Succesfully')}} >
              <div class="mb-5">
                <label for="message">Message</label>
                <textarea
                  class="form-control"
                  id="message"
                  name="message"
                  rows="5"
                  required
                ></textarea>
              </div>
              <div class="mb-5 row">
                <div class="col">
                  <label>Your Name:</label>
                  <input
                    type="text"
                    required
                    maxlength="50"
                    class="form-control"
                    id="name"
                    name="name"
                  />
                </div>
                <div class="col">
                  <label for="email_addr">Your Email:</label>
                  <input
                    type="email"
                    required
                    maxlength="50"
                    class="form-control"
                    id="email_addr"
                    name="email"
                    placeholder="name@example.com"
                  />
                </div>
              </div>
              <div class="d-grid">
                <button type="submit"  class="btn btn-warning ">
                  Post
                </button><br/>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactUs