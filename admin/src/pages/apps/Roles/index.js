import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import { FormInput } from '../../../components';
import AddRoles from './Modal/createRole';
import UpdateRole from './Modal/updateRole';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getRolesAction, getUserRolesAction, updateUserRolesAction } from '../../../redux/actions';
import { getMastersDataAction } from '../../../redux/settings/actions';
import Paginations from '../../../helpers/Paginations';
import Spinner from '../../../constants/Spinner';
import { IoMdClose } from 'react-icons/io';
import { GoAlert } from 'react-icons/go';
import { encryptMessage } from '../../../cryptoUtils';
import { stateEmptydAction } from '../../../redux/roles/actions';
import { userPermissions } from '../../../helpers/userPermissions';
import ToastHandle from '../../../helpers/ToastMessage';
import UpdateRoles from './Modal/updateRole';

const RoleManagement = () => {
    const [showModal, setShowModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
    const [search, setSearch] = useState('');
    const [skip, setSkip] = useState(1)
    const [status, setStatus] = useState(true);
    const [dataToUpdate, setDataToUpdate] = useState(null);
    const [statusModal, setStatusModal] = useState(false);
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const createResponse = store?.createUserRolesReducer?.data?.status;
    const updateResponse = store?.updateUserRolesReducer?.data?.status;
    const apiData = store?.getUserRolesReducer?.data?.users;
    const isAddPresent = userPermissions.includes('Create Users') || userPermissions.includes('ADD_A_USER');
    const isUpdatePresent = userPermissions.includes('Update Users') || userPermissions.includes('UPDATE_A_USER');
    useEffect(() => {
        dispatch(getUserRolesAction({ skip: skip, limit: 10, search: '', status: status }))
        if (createResponse === 201 || updateResponse === 200) {
            dispatch(getUserRolesAction({ skip: skip, limit: 10, search: '', status: status }));
            dispatch(stateEmptydAction())
            setShowModal(false);
            setStatusModal(false);
            setUpdateModal(false);
        }
    }, [dispatch, search, skip, status, createResponse, updateResponse])
    useEffect(() => {
        dispatch(getRolesAction({ limit: '', skip: '', search: search, status: '' }));
        dispatch(getMastersDataAction({ status: true, category: 'designation', search: '', limit: '' }));
    }, [dispatch])
    const handleClosemodal = () => {
        setShowModal(false);
    };

    // const users=store?.
    // useEffect(() => {
    //     if (createResponse === 201 || updateResponse === 200) {
    //         setShowModal(false);
    //         dispatch(getUserRolesAction({ skip: 1, limit: 10, search: '', status: true }))
    //     }
    // }, [createResponse])


    const handleStatusChange = (data) => {
        setStatus(data);
        setSearch('');
    };

    const handlePageChange = (pageNumber) => {
        setSkip(pageNumber);
    };
    const closeStatusModal = () => {
        setStatusModal(false)
    }
    const handleStatusUpdate = () => {
        const payload = {
            id: dataToUpdate?._id,
            status: !dataToUpdate?.status
        }
        dispatch(updateUserRolesAction({ key: encryptMessage(payload) }))
    }
    const closeUpdateModal = () => {
        setUpdateModal(false);
        setDataToUpdate(null);
    }
    return (
        <div>
            <Row className='mt-2'>
                <Col xs={12}>
                    <Card>
                        <Card.Body className='scroll-container' style={{ height: '88vh' }}>
                            <Row className="mb-2 d-flex justify-content-between">
                                <Col sm={6}>
                                    <Button
                                        variant={status === true ? 'outlined' : ''}
                                        onClick={() => handleStatusChange(true)}
                                        className={`${status === true ? 'custom-buttons' : 'bg-none border-primary'} me-2`}
                                    >
                                        Active
                                    </Button>

                                    <Button
                                        variant={status === false ? 'outlined' : ''}
                                        onClick={() => handleStatusChange(false)}
                                        className={`${status === false ? 'custom-buttons' : 'bg-none border-primary'} me-2`}
                                    >
                                        Inactive
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
                                            <Button className='custom-buttons' onClick={() => {
                                                setShowModal(true)
                                                // if (isAddPresent) {
                                                // } else {
                                                //     ToastHandle('You dont have permission to create new user.', 'danger')
                                                // }
                                            }
                                            }>
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
                                                <th>S.no</th>
                                                <th>Name</th>
                                                <th>Role</th>
                                                <th>Username</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                store?.getUserRolesReducer?.loading ? (
                                                    <tr>
                                                        <td className="text-center" colSpan={6}>
                                                            <Spinner className="spinner-border-lg m-2" />
                                                        </td>
                                                    </tr>
                                                ) : apiData?.length === 0 ? (
                                                    <tr>
                                                        <td className="text-center" colSpan={6}>
                                                            <h3 className="my-5">No Data Found</h3>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    apiData?.map((data, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td> {/* Displaying the index + 1 for the row number */}
                                                            <td className="text-capitalize">{data?.firstName}</td>
                                                            <td className="text-capitalize">{data?.role?.name}</td>
                                                            <td>{data?.email}</td>
                                                            <td>
                                                                <Form.Switch
                                                                    onClick={() => {
                                                                        // if (isUpdatePresent) {

                                                                        // } else {
                                                                        //     ToastHandle('You dont have permission for updating users', 'danger')
                                                                        // }
                                                                        setStatusModal(true);
                                                                        setDataToUpdate(data);
                                                                    }}
                                                                    checked={data?.status} />
                                                            </td>
                                                            <td>
                                                                <Link
                                                                    to="#"
                                                                    className="action-icon"
                                                                    onClick={() => {
                                                                        setUpdateModal(true);
                                                                        setDataToUpdate(data);
                                                                        // if (isUpdatePresent) {
                                                                        // } else {
                                                                        //     ToastHandle("You are not authorized to update a user", 'danger')
                                                                        // }
                                                                    }}
                                                                >
                                                                    <i className="mdi fs-4 cursor-pointer mdi-square-edit-outline"></i>
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )
                                            }

                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                            <Row>

                                <Col className='mt-2 d-flex justify-content-end'>
                                    <Paginations
                                        currentPage={skip}
                                        totalPages={store?.getUserRolesReducer?.data?.pagination?.totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <UpdateRoles data={dataToUpdate} show={updateModal} closeModal={closeUpdateModal} />
            <Modal show={statusModal} centered size='md' >
                <Modal.Body>
                    <div>
                        <Row className="border-bottom mb-2 pb-2 d-flex align-items-center">
                            <Col sm={1}></Col>
                            <Col sm={10}>
                                <h4 className="mb-0  d-flex align-items-center justify-content-center"><span className='text-danger'><GoAlert />&nbsp;</span>{dataToUpdate?.status === true ? 'Deactivate' : "Activate"} User</h4>
                            </Col>
                            <Col sm={1}>
                                <IoMdClose className="fs-4 cursor-pointer" onClick={closeStatusModal} />
                            </Col>
                        </Row>
                        <Row className=''>
                            <Col sm={12}>
                                <p className='mb-0'>
                                    Once this change is applied, please be aware that <strong>{dataToUpdate?.name}</strong> will be&nbsp;
                                    {dataToUpdate?.status === true ? 'deactivated' : "activated"}
                                </p>
                            </Col>
                        </Row>
                    </div>
                </Modal.Body>
                <Modal.Footer className='d-flex justify-content-end gap-2'>
                    <Button className='custom-buttons' onClick={closeStatusModal}>
                        Cancel
                    </Button>
                    <Button className='custom-buttons' disabled={store?.updateUserRolesReducer?.loading} onClick={() => handleStatusUpdate()}>
                        {store?.updateUserRolesReducer?.loading ?
                            <Spinner color='light' className='spinner-border-sm' />
                            :
                            dataToUpdate?.status === true ? 'Deactivate' : "Activate"
                        }
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default RoleManagement;
