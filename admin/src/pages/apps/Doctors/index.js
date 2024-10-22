import React from 'react'
import PageTitle from '../../../components/PageTitle'
import { Card, Col, Form, Row, Table } from 'react-bootstrap'
import { FormInput } from '../../../components'
import { Link } from 'react-router-dom'

const Doctors = () => {
    return (
        <div>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Doctors', path: '/apps/doctors/list', active: true },
                ]}
                title={'Doctors'}
            />
            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Row className="mb-2">
                                <Col xs="auto">
                                    <FormInput type="text" name="search" placeholder="Search..." />
                                </Col>
                                <Col>
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
                                                <th>Fullname</th>
                                                <th>Specialization</th>
                                                <th>Contact</th>
                                                <th>E-mail</th>
                                                <th>Experience</th>
                                                <th>Status</th>
                                                <th style={{ width: '125px' }}>Action</th>
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
                                                        <Link to="#" className="text-body fw-bold">
                                                            Name
                                                        </Link>
                                                    </td>
                                                    <td>
                                                        Specialization
                                                    </td>
                                                    <td>
                                                        Contact no.
                                                    </td>
                                                    <td>
                                                        Email
                                                    </td>
                                                    <td>Experience</td>
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

export default Doctors