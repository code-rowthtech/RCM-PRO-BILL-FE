import React from 'react';
import PageTitle from '../../../../components/PageTitle';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { FormInput } from '../../../../components';  // Assuming this is a custom form input component

const Index = () => {
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log("Image file selected:", file);
            // You can display the image preview or handle the file upload here
        }
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
                                        <div className="row d-flex  flex-column justify-content-between h-100">
                                            <div className="mb-3 p-3 text-center  col-md-12 h-50">
                                                {/* Hidden Input */}
                                                <input
                                                    type="file"
                                                    id="fileUpload"
                                                    className="d-none "
                                                    accept="image/*"
                                                    onChange={(e) => handleImageChange(e)} // File handling logic
                                                />
                                                {/* Label associated with input */}
                                                <label htmlFor="fileUpload" className="w-100 h-100 border cursor-pointer">
                                                    <div className="image-placeholder h-100 d-flex justify-content-center align-items-center">
                                                        <p className="text-muted">Drop Image Here Or Click To Upload</p>
                                                    </div>
                                                </label>
                                            </div>

                                            <Col md={12}>
                                                <Form.Group className="mb-0">
                                                    <Form.Label>Address</Form.Label>
                                                    <Form.Control as="textarea" rows={3} placeholder="Enter address" />
                                                </Form.Group>
                                            </Col>
                                        </div>

                                    </Col>

                                    <Col md={8}>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>First Name</Form.Label>
                                                    <Form.Control type="text" placeholder="Enter first name" />
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Last Name</Form.Label>
                                                    <Form.Control type="text" placeholder="Enter last name" />
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Email</Form.Label>
                                                    <Form.Control type="email" placeholder="Enter email" />
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Birthday</Form.Label>
                                                    <Form.Control type="date" />
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Mobile No.</Form.Label>
                                                    <Form.Control type="tel" placeholder="Enter mobile number" />
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Marital Status</Form.Label>
                                                    <Form.Select>
                                                        <option>Single</option>
                                                        <option>Married</option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Sex</Form.Label>
                                                    <Form.Select>
                                                        <option>Male</option>
                                                        <option>Female</option>
                                                        <option>Other</option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Blood Group</Form.Label>
                                                    <Form.Select>
                                                        <option>A+</option>
                                                        <option>B+</option>
                                                        <option>O+</option>
                                                        <option>AB+</option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Patient Height</Form.Label>
                                                    <Form.Control type="text" placeholder="Enter height" />
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Patient Weight</Form.Label>
                                                    <Form.Control type="text" placeholder="Enter weight" />
                                                </Form.Group>
                                            </Col>

                                            <Col md={12}>
                                                <Form.Group className="mb-0">
                                                    <Form.Label>Patient History</Form.Label>
                                                    <Form.Control as="textarea" rows={3} placeholder="Enter patient history" />
                                                </Form.Group>
                                            </Col>


                                        </Row>

                                    </Col>
                                    <Col md={12} className='mt-2 text-end'>
                                        <Button variant="primary" type="submit">Save</Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default Index;
