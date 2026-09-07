/**
 * ==============================================================================
 * SYSTEM ADMINISTRATOR VIEW CASE EVIDENCES (AdminViewEvidences.js)
 * ==============================================================================
 * 
 * What This Component Does:
 * -------------------------
 * This screen displays a table of all supplementary evidence documents and proof
 * uploaded for a specific court case by either the lawyer or petitioner.
 * The administrator can inspect:
 *   - Evidence Title
 *   - Evidence Description / context
 *   - Scanned file attachment (with a "View" link that opens a popup document viewer)
 * 
 * Routing & Rendering Flow:
 * -------------------------
 * - Rendered by `AdminMain.js` when visiting `/admin_view_added_evidences/:id`
 *   (accessed by clicking "Evidences Info" in `AdminViewSingleCase.js`).
 * - Extracts case ID from the URL parameters (`useParams`).
 * - Clicking "View" opens a popup modal with an interactive preview of the document.
 * ==============================================================================
 */

import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap'; 

/**
 * AdminViewEvidences Component
 * ----------------------------
 * Renders the case evidence files list and document preview modal.
 */
function AdminViewEvidences() {
    // State storing the list of uploaded evidence documents
    const [data, setData] = useState([]);
    // Controls document preview popup modal visibility
    const [showModal, setShowModal] = useState(false);
    // Full web link to access the evidence file
    const [fileUrl, setFileUrl] = useState('');
    // Read case ID from URL parameters
    const { id } = useParams();
  
    // Hook placeholder: Call POST `/getEvidenceByCaseId/${id}` to load evidence files from MongoDB
    // useEffect(() => { 
    //   axiosInstance
    //     .post(`/getEvidenceByCaseId/${id}`)
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
  
    /**
     * handleViewClick
     * ---------------
     * Triggered when the admin clicks "View" on an evidence item. Opens preview modal.
     * 
     * @param {string} filename - Filename of the uploaded evidence document
     */
    const handleViewClick = (filename) => {
      // setFileUrl(`${imageUrl}/${filename}`);
      setShowModal(true);
    };
  
    /**
     * handleCloseModal
     * ----------------
     * Closes the document preview popup modal.
     */
    const handleCloseModal = () => {
      setShowModal(false);
      setFileUrl('');
    };

  return (
    <div>
    <div className="adv_client_payment_status">
      <div className="container advocate_home_container2 pt-5 pb-5">
        {/* Render table if evidence records exist */}
        {data.length > 0 ? (
          <div className="advocate_home_container2_table table-responsive">
            <table className="table align-center">
              <thead>
                <tr>
                  <th scope="col">Title</th>
                  <th scope="col">Description</th>
                  <th scope="col">Files</th>
                </tr>
              </thead>
              <tbody>
                {data.map((payment, index) => (
                  <tr key={index}>
                    <td>{payment.title}</td>
                    <td>{payment.description}</td>
                    {/* Open Evidence File Preview Link */}
                    <td>
                      <Link to="#" onClick={() => handleViewClick(payment.file.filename)}>View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty State */
          <div className="no-payment-request">
            <h2>No Case Updates</h2>
          </div>
        )}
      </div>
    </div>

    {/* POPUP MODAL: Interactive Evidence Document Viewer */}
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>File Viewer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Document preview iframe or img tag */}
        {/* {fileUrl && (
          <>
            {fileUrl.endsWith('.pdf') ? (
              <iframe src={fileUrl} width="100%" height="500px" title="PDF Viewer" />
            ) : (
              <img src={fileUrl} alt="Evidence" className="img-fluid" />
            )}
          </>
        )} */}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  </div>
  )
}

export default AdminViewEvidences
