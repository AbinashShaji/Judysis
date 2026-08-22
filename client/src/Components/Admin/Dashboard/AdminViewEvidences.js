import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap'; 
function AdminViewEvidences() {

    const [data, setData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [fileUrl, setFileUrl] = useState('');
    const { id } = useParams();
  
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
  
    const handleViewClick = (filename) => {
      // setFileUrl(`${imageUrl}/${filename}`);
      setShowModal(true);
    };
  
    const handleCloseModal = () => {
      setShowModal(false);
      setFileUrl('');
    };

  return (
    <div>
    <div className="adv_client_payment_status">
      <div className="container advocate_home_container2 pt-5 pb-5">
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
                    <td>
                      <Link to="#" onClick={() => handleViewClick(payment.file.filename)}>View</Link>
                    </td>
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

    {/* Modal */}
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>File Viewer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
