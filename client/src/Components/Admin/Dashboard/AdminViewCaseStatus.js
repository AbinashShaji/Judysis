import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';


function AdminViewCaseStatus() {

    const [data, setData] = useState([]);
const { id } = useParams();

// useEffect(() => {
//   axiosInstance
//     .post(`/getStatusByCaseId/${id}`)
//     .then((res) => {
//       console.log(res);
//       if (res.data.status === 200) {
//         setData(res.data.data || []);
//       } else {
//         setData([]);
//       }
//     })
//     .catch((error) => {
//       console.error("Error!", error);
//     });
// }, [id]);
  return (
    <div className="adv_client_payment_status">
      <div className="container advocate_home_container2 pt-5 pb-5">
        {data.length > 0 ? (
          <div className="advocate_home_container2_table table-responsive">
            <table className="table align-center">
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Status</th>
                  <th scope="col">description</th>
                </tr>
              </thead>
              <tbody>
                {data.map((payment, index) => (
                  <tr key={index}>
                    <td>{payment.date.slice(0,10)}</td>
                    <td>{payment.status}</td>
                    <td>{payment.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-payment-request">
            <h2>No Case Updates</h2>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminViewCaseStatus
