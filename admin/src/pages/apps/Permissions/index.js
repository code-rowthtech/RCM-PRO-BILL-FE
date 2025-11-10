import React, { useEffect, useState } from 'react';
import PageTitle from '../../../components/PageTitle';
import { Button, Card, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import { FormInput } from '../../../components';
import { Link } from 'react-router-dom';
import AddPermissions from './Modal/addPermissions';
import { useDispatch, useSelector } from 'react-redux';
import { deletePermissionAction, getPermissionAction, stateEmptydAction, updatePermissionAction } from '../../../redux/actions';
import { decryptMessage, encryptMessage } from '../../../cryptoUtils';
import Loader from '../../../components/Loader';
import Spinner from '../../../constants/Spinner';
import Paginations from '../../../helpers/Paginations';
import { IoMdClose } from 'react-icons/io';
import { getMastersDataAction } from '../../../redux/settings/actions';
const Permissions = () => {
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [selected, setSelected] = useState(null);
    const [search, setSearch] = useState('');
    const [skip, setSkip] = useState(1)
    const store = useSelector((state) => state);
    const decryptedPermissionsData = store?.getPermissionsDataReducer?.data?.data;
    const deleteSuccess = store?.deletePermissionsDataReducer?.data?.success;
    const updateSuccess = store?.updatePermissionsDataReducer?.data?.success;

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getPermissionAction({ search: search, limit: 10, skip: skip }));
        if (store?.createPermissionsDataReducer?.data?.success === true) {
            dispatch(getPermissionAction({ search: search, limit: 10, skip: skip }));
            dispatch(stateEmptydAction())
        }
        if (deleteSuccess === true) {
            dispatch(getPermissionAction({ search: search, limit: 10, skip: skip }));
            closeDeleteModal();
            dispatch(stateEmptydAction())
        }
        if (updateSuccess === true) {
            dispatch(getPermissionAction({ search: search, limit: 10, skip: skip }));
            dispatch(stateEmptydAction())
        }
    }, [dispatch, store?.createPermissionsDataReducer?.data?.success, deleteSuccess, updateSuccess, search, skip])

    const closeDeleteModal = () => {
        setDeleteModal(false);
        setDeleteId(null);
    }

    const handleDelete = () => {
        const payload = {
            id: deleteId
        }
        dispatch(deletePermissionAction({ key: encryptMessage(JSON.stringify(payload)) }));
    }

    const handlePageChange = (pageNumber) => {
        setSkip(pageNumber);
    }
    return (
        <div>
            <Row className='mt-2'>
                <Col xs={12}>
                    <Card>
                        <Card.Body className='scroll-container' style={{ height: '88vh' }}>
                            <Row className="mb-2 d-flex justify-content-between">
                                <Col xs="auto">
                                </Col>
                                <Col xs='auto'>
                                    <Row className="gy-2 gx-2 align-items-center justify-content-xl-end justify-content-between ">
                                        <Col xs="auto" className='d-flex gap-2'>
                                            <FormInput onChange={(e) => setSearch(e.target.value)} type="text" name="search" placeholder="Search..." />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Table responsive className="table-centered table-nowrap mb-0">
                                        <thead>
                                            <tr key={''}>
                                                <th colSpan={2}>#</th>
                                                <th colSpan={2}>Permission Name</th>
                                                <th>Description</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {store?.getPermissionsDataReducer?.loading ?
                                                <tr className='fs-1 fw-bold'>
                                                    <td colSpan={5} className='text-center py-3 fs-4 fw-bold'>
                                                        <Spinner className="spinner-border-lg m-2" />

                                                    </td>
                                                </tr>
                                                :
                                                store?.getPermissionsDataReducer?.data?.totalPermissions === 0 ?
                                                    <tr>
                                                        <td colSpan={5} className='text-center'>
                                                            <h3 className='my-5'>No Data Found</h3>
                                                        </td>
                                                    </tr>
                                                    :
                                                    decryptedPermissionsData && decryptedPermissionsData.map((data, index) => (
                                                        <tr key={index}>
                                                            <td colSpan={2}>{index + 1}</td>
                                                            <td className='fw-bold text-body text-capitalize' colSpan={2} onClick={() => setSelected(data?._id)}>
                                                                {data?.permission}
                                                            </td>
                                                            <td>
                                                                {data?.description}
                                                            </td>
                                                        </tr>
                                                    ))}
                                        </tbody>
                                    </Table>
                                </Col>
                                <Row>
                                    <Col className='mt-2 d-flex justify-content-end'>
                                        <Paginations
                                            currentPage={skip}
                                            totalPages={store?.getPermissionsDataReducer?.data?.totalPages}
                                            onPageChange={handlePageChange}
                                        />
                                    </Col>
                                </Row>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Modal centered show={deleteModal} onHide={closeDeleteModal}>
                <Modal.Body>
                    <Row className="border-bottom mb-2 pb-2 d-flex align-items-center">
                        <Col sm={1}></Col>
                        <Col sm={10}>
                            <h4 className="mb-0 text-center">Delete Permission</h4>
                        </Col>
                        <Col sm={1}>
                            <IoMdClose className="fs-4 cursor-pointer" onClick={closeDeleteModal} />
                        </Col>
                    </Row>
                    <p>
                        Are you sure you want to remove the selected permissions?
                        This action cannot be undone.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={closeDeleteModal} className='custom-buttons'>
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} className='custom-buttons' disabled={store?.deletePermissionsDataReducer?.loading}>
                        {store?.deletePermissionsDataReducer?.loading ?
                            <Spinner className="spinner-border-sm " />
                            :
                            'Delete'
                        }
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Permissions;