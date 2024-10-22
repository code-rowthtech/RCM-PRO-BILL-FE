import React, { useState } from 'react';
import PageTitle from '../../../../components/PageTitle';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { FormInput } from '../../../../components';  // Assuming this is a custom form input component

const Index = () => {
    const [uploadedImage, setUploadedImage] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setUploadedImage(file);
        if (file) {
            console.log("Image file selected:", file);
        }
    };

    const handleDeleteImage = () => {
        setUploadedImage(null); // Clear the uploaded image
        document.getElementById('fileUpload').value = ""; // Reset the file input
    };

    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Clinics', path: '/apps/crm/addclinic', active: true },
                    { label: 'Add Clinics', path: '/apps/crm/addclinic', active: true },
                ]}
                title={'Add Clinic'}
            />
            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Form>
                                <Row>
                                    <Col md={4} className=''>
                                        <div className="row d-flex flex-column h-100">
                                            <div className="mb-0 p-3 text-center col-md-12 h-50">
                                                <input
                                                    type="file"
                                                    id="fileUpload"
                                                    className="d-none"
                                                    accept="image/*"
                                                    onChange={(e) => handleImageChange(e)}
                                                />
                                                <label htmlFor="fileUpload" className="w-100 h-100 border cursor-pointer">
                                                    <div className="image-placeholder  h-100 d-flex justify-content-center align-items-center">
                                                        {uploadedImage ? (
                                                            <img
                                                                src={URL.createObjectURL(uploadedImage)}
                                                                alt="Uploaded"
                                                                className="img-fluid h-100"
                                                                style={{ objectFit: "contain" }}
                                                            />
                                                        ) : (
                                                            <p className="text-muted">Drop Image Here Or Click To Upload</p>
                                                        )}
                                                    </div>
                                                </label>
                                            </div>
                                            {uploadedImage && (
                                                <div className="text-center">
                                                    <button className="btn grayish-buttons text-light" onClick={handleDeleteImage}>
                                                        Delete Image
                                                    </button>
                                                </div>
                                            )}
                                            {/* </div> */}

                                            {/* <Col md={12}>
                                                <Form.Group className="mb-0">
                                                    <Form.Label>Address</Form.Label>
                                                    <Form.Control as="textarea" rows={3} placeholder="Enter address" />
                                                </Form.Group>
                                            </Col> */}
                                        </div>

                                    </Col>

                                    <Col md={8}>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-2">
                                                    <Form.Label>Clinic Name</Form.Label>
                                                    <Form.Control type="text" placeholder="Enter clinic name" />
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Group className="mb-2">
                                                    <Form.Label>TIN / EIN Number</Form.Label>
                                                    <Form.Control type="text" placeholder="Enter tin / ein number" />
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Group className="mb-2">
                                                    <Form.Label>Email</Form.Label>
                                                    <Form.Control type="email" placeholder="Enter email" />
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Group className="mb-2">
                                                    <Form.Label>Type of Clinic</Form.Label>
                                                    <Form.Control type="text" placeholder="Enter type of clinic" />
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Group className="mb-2">
                                                    <Form.Label>Contact No.</Form.Label>
                                                    <Form.Control type="tel" placeholder="Enter contact number" />
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Group className="mb-2">
                                                    <Form.Label>Clinic License Number</Form.Label>
                                                    <Form.Control type="text" placeholder="Enter license number" />
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Group className="mb-2">
                                                    <Form.Label>Owner Name</Form.Label>
                                                    <Form.Control type="text" placeholder="Enter owner's number" />
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Group className="mb-2">
                                                    <Form.Label>Office Hours</Form.Label>
                                                    <Form.Control type="text" placeholder="Enter operational timings." />
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Group className="mb-2">
                                                    <Form.Label>EMR Number</Form.Label>
                                                    <Form.Control type="text" placeholder="Enter EMR Number" />
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Group className="mb-2">
                                                    <Form.Label>EMR Name</Form.Label>
                                                    <Form.Control type="text" placeholder="Enter EMR Name" />
                                                </Form.Group>
                                            </Col>

                                            <Col md={12}>
                                                <Form.Group className="mb-2">
                                                    <Form.Label>Website</Form.Label>
                                                    <Form.Control type="text" placeholder="Enter Website URL" />
                                                </Form.Group>
                                            </Col>
                                            <Col md={12}>
                                                <Form.Group className="mb-0">
                                                    <Form.Label>Permanent Address</Form.Label>
                                                    <Form.Control as="textarea" rows={3} placeholder="Enter address" />
                                                </Form.Group>
                                            </Col>


                                        </Row>

                                    </Col>
                                    <Col md={12} className='mt-2 text-end'>
                                        <Button variant="primary" type="submit" className='grayish-buttons'>Save</Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row >
        </>
    );
};

export default Index;
