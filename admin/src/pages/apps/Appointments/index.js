// @flow
import React from 'react';
import { Badge, Button, Card, Col, Form, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import PageTitle from '../../../components/PageTitle';
import { FormInput } from '../../../components';
import { orderData } from './data';
// Define the types for each order item
type OrderListItems = {
    orderId: string,
    avatar: string,
    name: string,
    projectName: string,
    country: string,
    city: string,
    date: string,
    orderStatus: string,
};

type OrderListProps = {
    orderData: Array<OrderListItems>,
};

// Order details component
const AppointmentsList = ({ orderData }: OrderListProps): React$Element<React$FragmentType> => {
    return (
        <Table responsive className="table-centered table-nowrap mb-0">
            <thead>
                <tr key={''}>
                    {/* <th style={{ width: '20px' }}>
                        <Form>
                            <Form.Check type="checkbox" id="all" />
                        </Form>
                    </th> */}
                    <th>Description</th>
                    <th>Client Name</th>
                    <th>Attendant Name</th>
                    <th>Time</th>
                    <th>Date</th>
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
                            <Link to="#" className="text-body fw-bold">
                                Appointment description
                            </Link>
                        </td>
                        <td>
                            Client Name
                        </td>
                        <td>
                            Attendant name
                        </td>
                        <td>
                            14:00
                        </td>
                        <td>DD/MM/YYYY</td>
                        <td>
                            Status
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
    );
};

// Main component that renders the page and order details
const Appointments = ({ orderData }: { orderData: Array<OrderListItems> }): React$Element<React$FragmentType> => {
    return (
        <>
            {/* <PageTitle
                breadCrumbItems={[
                    { label: 'Appointments', path: '/apps/appointments/list', active: true },
                ]}
                title={'Appointment List'}
            /> */}

            <Row className='mt-2'>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Row className="mb-2">
                                <Col xl={8}>
                                    <Row className="gy-2 gx-2 align-items-center justify-content-xl-start justify-content-between">
                                        <Col xs="auto">
                                            <FormInput type="text" name="search" placeholder="Search..." />
                                        </Col>
                                        {/* <Col xs="auto">
                                            <Form.Group as={Row}>
                                                <Form.Label htmlFor="exampleEmail3" column sm={3}>
                                                    Status
                                                </Form.Label>
                                                <Col sm={9}>
                                                    <FormInput
                                                        name="select"
                                                        type="select"
                                                        className="form-select"
                                                        key="select">
                                                        <option>Choose...</option>
                                                        <option>Paid</option>
                                                        <option>Awaiting Authorization</option>
                                                        <option>Payment failed</option>
                                                        <option>Cash On Delivery</option>
                                                        <option>Fulfilled</option>
                                                        <option>Unfulfilled</option>
                                                    </FormInput>
                                                </Col>
                                            </Form.Group>
                                        </Col> */}
                                    </Row>
                                </Col>
                                {/* <Col xl={4}>
                                    <div className="text-xl-end mt-xl-0 mt-2">
                                        <Button variant="danger" className="mb-2 me-2">
                                            <i className="mdi mdi-basket me-1"></i> Add New Order
                                        </Button>
                                        <Button variant="light" className="mb-2">
                                            Export
                                        </Button>
                                    </div>
                                </Col> */}
                            </Row>

                            <AppointmentsList orderData={orderData} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default Appointments;
