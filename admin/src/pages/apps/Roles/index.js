import React, { useState } from 'react'
import PageTitle from '../../../components/PageTitle'
import { Button, Card, Col, Form, Row, Table } from 'react-bootstrap'
import { FormInput } from '../../../components'
import { Link } from 'react-router-dom'
import AddRoles from './Modal/createRole'

const Roles = () => {
    const [showModal, setShowModal] = useState(false);
    const handleClosemodal = () => {
        setShowModal(false);
    };
    return (
        <div>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Roles', path: '/apps/Roles/list', active: true },
                ]}
                title={'Roles'}
            />
            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Row className="mb-2 d-flex justify-content-between">
                                <Col xs="auto">
                                    <FormInput type="text" name="search" placeholder="Search..." />
                                </Col>
                                <Col xs='auto'>
                                    <Button className='grayish-buttons' onClick={() => setShowModal(true)}><span className='uil-plus'></span> Add Roles</Button>
                                </Col>
                                <AddRoles show={showModal} closeModal={handleClosemodal} />
                            </Row>
                            <Row>
                                <Col>
                                    <Table responsive className="table-centered table-nowrap mb-0">
                                        <thead className="table-light">
                                            <tr key={''}>
                                                <th>
                                                    S.no
                                                </th>
                                                <th>Name</th>
                                                {/* <th>Description</th> */}
                                                <th>Created By</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[0, 1, 2, 3, 4, 5].map((index) => (
                                                <tr key={index}>
                                                    <td>
                                                        {index + 1}
                                                    </td>
                                                    <td>
                                                        <Link to="#" className="text-body fw-bold">
                                                            Role
                                                        </Link>
                                                    </td>
                                                    {/* <td>
                                                        Description
                                                    </td> */}
                                                    <td>
                                                        Created by
                                                    </td>
                                                    <td>
                                                        <Form.Switch checked />
                                                    </td>
                                                    <td>
                                                        <Link to="#" className="action-icon">
                                                            <i className="mdi mdi-square-edit-outline"></i>
                                                        </Link>
                                                        <Link to="#" className="action-icon">
                                                            <i className="mdi mdi-delete"></i>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}

                                        </tbody>
                                    </Table>
                                </Col>

                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default Roles