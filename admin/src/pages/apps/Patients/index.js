import React from 'react'
import PageTitle from '../../../components/PageTitle'
import { Card, Col, Form, Row, Table } from 'react-bootstrap'
import { FormInput } from '../../../components'
import { Link } from 'react-router-dom'

const Patients = () => {
    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Patients', path: '/apps/patients/list', active: true },
                ]}
                title={'Patients'}
            />
            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Row className="mb-2">
                                <Col xs="auto">
                                    <FormInput type="text" name="search" placeholder="Search..." />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Table responsive className="table-centered table-nowrap mb-0">
                                        <thead className="table-light">
                                            <tr key={''}>
                                                {/* <th style={{ width: '20px' }}>
                                                    <Form>
                                                        <Form.Check type="checkbox" id="all" />
                                                    </Form>
                                                </th> */}
                                                <th style={{ width: '20px' }}>
                                                    S.no
                                                </th>
                                                <th>Name</th>
                                                <th>Date of birth</th>
                                                <th>Gender</th>
                                                <th>Contact</th>
                                                <th>Address</th>
                                                <th>Policy Number</th>
                                                <th>Primary Care Physician </th>
                                                {/* <th style={{ width: '125px' }}>Action</th> */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[0, 1, 2, 3, 4, 5].map((index) => (
                                                <tr key={index}>
                                                    {/* <td>
                                                        <Form>
                                                            <Form.Check type="checkbox" id={`#`} />
                                                        </Form>
                                                    </td> */}
                                                    <td>
                                                        {index + 1}
                                                    </td>
                                                    <td>
                                                        Name
                                                    </td>
                                                    <td>
                                                        {/* <Link to="#" className="text-body fw-bold">
                                                            Name
                                                        </Link> */}
                                                        DD-MM-YYYY
                                                    </td>
                                                    <td>
                                                        Gender
                                                    </td>
                                                    <td>
                                                        Contact no.
                                                    </td>
                                                    <td>
                                                        Address
                                                    </td>
                                                    <td>Policy no</td>
                                                    <td>
                                                        Primary physician
                                                    </td>
                                                    {/* <td>
                                                        <Link to="#" className="action-icon">
                                                            <i className="mdi mdi-square-edit-outline"></i>
                                                        </Link>
                                                        <Link to="#" className="action-icon">
                                                            <i className="mdi mdi-delete"></i>
                                                        </Link>
                                                    </td> */}
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
        </>
    )
}

export default Patients