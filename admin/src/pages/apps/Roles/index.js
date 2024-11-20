import React, { useState } from 'react';
import { Button, Card, Col, Form, Row, Table } from 'react-bootstrap';
import { FormInput } from '../../../components';
import AddRoles from './Modal/createRole';
import UpdateRole from './Modal/updateRole';
import { Link } from 'react-router-dom';

const RoleManagement = () => {
    const [showModal, setShowModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('subadmin');
    const [dataToUpdate, setDataToUpdate] = useState(null);

    const handleClosemodal = () => {
        setShowModal(false);
    };

    const closeUpdateModal = () => {
        setShowUpdateModal(false);
        setDataToUpdate(null);
    };

    const handleStatusChange = (data) => {
        setStatus(data);
        setSearch('');
    };

    return (
        <div>
            <Row className='mt-2'>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Row className="mb-2 d-flex justify-content-between">
                                <Col sm={6}>
                                    <Button
                                        variant={status === 'subadmin' ? 'outlined' : ''}
                                        onClick={() => handleStatusChange('subadmin')}
                                        className={`${status === 'subadmin' ? 'custom-buttons' : 'bg-none border-primary'} me-2`}
                                    >
                                        Sub Admin
                                    </Button>

                                    <Button
                                        variant={status === 'sales' ? 'outlined' : ''}
                                        onClick={() => handleStatusChange('sales')}
                                        className={`${status === 'sales' ? 'custom-buttons' : 'bg-none border-primary'} me-2`}
                                    >
                                        Sales
                                    </Button>
                                    <Button
                                        variant={status === 'other' ? 'outlined' : ''}
                                        onClick={() => handleStatusChange('other')}
                                        className={`${status === 'other' ? 'custom-buttons' : 'bg-none border-primary'} me-2`}
                                    >
                                        Other
                                    </Button>
                                </Col>
                                <Col xs='auto'>
                                    <Row className="gy-2 gx-2 align-items-center justify-content-xl-end justify-content-between ">
                                        <Col xs="auto" className='d-flex gap-2'>
                                            <FormInput
                                                type="text"
                                                onChange={(e) => {
                                                    setSearch(e.target.value);
                                                }}
                                                placeholder="Search..."
                                            />
                                            <Button className='custom-buttons' onClick={() => setShowModal(true)}>
                                                <span className='uil-plus'></span> Add New User
                                            </Button>
                                        </Col>
                                    </Row>
                                </Col>
                                <AddRoles show={showModal} closeModal={handleClosemodal} />
                            </Row>
                            <Row>
                                <Col>
                                    <Table responsive className="table-centered table-nowrap mb-0">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Name</th>
                                                <th>Role</th>
                                                <th>Username</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* Placeholder row for data */}
                                            <tr>
                                                <td>1</td>
                                                <td className='cursor-pointer'>
                                                    <span
                                                        title={'Permissions'}
                                                        className="d-inline-block text-truncate text-capitalize"
                                                    >
                                                        Sample Role
                                                    </span>
                                                </td>
                                                <td>Sub Admin</td>
                                                <td>sample@domain.com</td>
                                                <td>
                                                    <Form.Switch checked={status === 'active'} />
                                                </td>
                                                <td>
                                                    <Link to="#" className="action-icon" onClick={() => {
                                                        setShowUpdateModal(true);
                                                        setDataToUpdate({ name: 'Sample Role' });
                                                    }}>
                                                        <i className="mdi mdi-square-edit-outline"></i>
                                                    </Link>
                                                    {/* <UpdateRole show={showUpdateModal} closeModal={closeUpdateModal} data={dataToUpdate} /> */}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default RoleManagement;
