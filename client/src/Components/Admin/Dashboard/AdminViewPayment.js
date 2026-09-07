/**
 * ==============================================================================
 * SYSTEM ADMINISTRATOR VIEW CASE PAYMENTS (AdminViewPayment.js)
 * ==============================================================================
 * 
 * What This Component Does:
 * -------------------------
 * This screen displays the financial ledger of fee payment requests and settlement
 * statuses between the client and advocate for a specific court case.
 * The administrator can inspect:
 *   - Payment category / milestone reason
 *   - Fee amount in Rupees
 *   - Date payment was requested
 *   - Payment settlement status: "Pending" (unpaid) or "Received" (paid)
 * 
 * Routing & Rendering Flow:
 * -------------------------
 * - Rendered by `AdminMain.js` when visiting `/admin_view_client_payment_status/:id`
 *   (accessed by clicking "Payment Info" in `AdminViewSingleCase.js`).
 * - Extracts case ID from the URL parameters (`useParams`).
 * ==============================================================================
 */

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

/**
 * AdminViewPayment Component
 * --------------------------
 * Renders the tabular financial ledger of case payments.
 */
function AdminViewPayment() {
  // State storing the list of payment transactions for this case
  const [data, setData] = useState([]);
  // Extract case ID from URL parameters
  const { id } = useParams();

  // Hook placeholder: Calls POST `/getPaymentsByCaseId/${id}` to load transaction records from MongoDB
  // useEffect(() => {
  //   axiosInstance
  //     .post(`/getPaymentsByCaseId/${id}`)
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
        {/* Render payment transactions if records exist */}
        {data.length > 0 ? (
          <div className="advocate_home_container2_table table-responsive">
            <table className="table align-center">
              <thead>
                <tr>
                  <th scope="col">Payment Info</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Request Date</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((payment, index) => (
                  <tr key={index}>
                    <td>{payment.category}</td>
                    <td>₹{payment.amount}</td>
                    <td>{payment.date ? payment.date.slice(0, 10) : '-'}</td>
                    {/* Status Badge: Pending vs Received */}
                    <td>
                      {payment.paymentStatus === false ? (
                        <p className="btn btn-outline-danger">Pending</p>
                      ) : (
                        <p className="btn btn-outline-success">Received</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty State */
          <div className="no-payment-request">
            <h2>No Payment Request Added</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminViewPayment;
