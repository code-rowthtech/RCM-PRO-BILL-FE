import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Form, Modal, Row, Table } from 'react-bootstrap'
import Spinner from '../../../constants/Spinner'
import { FormInput } from '../../../components'
import { FiFileText, FiFilter } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form';
import { encryptMessage } from '../../../cryptoUtils'
import { createMastersDataAction, getMastersDataAction, stateEmptydAction, updateMastersDataAction } from '../../../redux/settings/actions'
import { IoMdClose } from 'react-icons/io'
import Paginations from '../../../helpers/Paginations'
import { formatDate } from '../../../helpers/dateFormat'
import { createdBy } from './userId'

const Designation = () => {
    const store = useSelector((state) => state);
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
    const dispatch = useDispatch();
    const nameValue = watch("name");
    const [addDesignationModal, setAddDesignationModal] = useState(false);
    const [updateDesignationModal, setUpdateDesignationModal] = useState(false);
    const [updateDate, setUpdateData] = useState(null);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState(true);
    const [skip, setSkip] = useState(1);
    const closeAddModal = () => {
        setAddDesignationModal(false);
    }
    const addDesignation = (data) => {
        const payload = {
            name: data?.name,
            description: data?.description,
            category: 'designation',
            createdBy: createdBy,
        }
        dispatch(createMastersDataAction({ key: encryptMessage(payload) }))
    };
    const createResponse = store?.createMastersDataReducer?.data;
    const clinicTypeData = store?.getMastersDataReducer?.data?.clinicTypes;
    const updateResponse = store?.updateMastersDataReducer?.data?.status;

    useEffect(() => {
        dispatch(getMastersDataAction({ status: status, category: 'designation', search: search, skip: skip, limit: 10 }));
        if (store?.createMastersDataReducer?.data?.status === 201) {
            reset();
            closeAddModal()
        }
        if (updateResponse === 200) {
            dispatch(getMastersDataAction({ status: status, category: 'designation', search: search, limit: 10, skip: skip }));
            dispatch(stateEmptydAction());
        }
    }, [store?.createMastersDataReducer?.data, dispatch, search, status, skip, updateResponse]);
    const handleStatusChange = (isActive) => {
        setStatus(isActive);
        setSearch('');
    };
    const handlePageChange = (pageNumber) => {
        setSkip(pageNumber);
    };
    const handleUpdate = (data) => {
        const payload = {
            id: data?._id,
            isActive: !data?.isActive,
            settingType: 'designation'
        }
        dispatch(updateMastersDataAction({ key: encryptMessage(payload) }))
    }
    return (
        <Row className='mt-2'>
            <Col xs={12}>
                <Card>
                    <Card.Body className='scroll-container' style={{ height: '88vh' }}>
                        <Row className="mb-2">
                            <Col sm={6}>
                                <Button variant={status === false ? 'outlined' : ''}
                                    onClick={() => handleStatusChange(true)}
                                    className={`${status === true ? 'custom-buttons' : 'bg-none border-primary'} me-2`}
                                >
                                    Active
                                </Button>

                                <Button variant={status === true ? 'outlined' : ''}
                                    onClick={() => handleStatusChange(false)}
                                    className={`${status === false ? 'custom-buttons' : 'bg-none border-primary'} me-2`}
                                >
                                    Inactive
                                </Button>
                            </Col>

                            <Col sm={6} className='text-end'>
                                <Row className="gy-2 gx-2 align-items-center justify-content-xl-end justify-content-between ">
                                    <Col xs="auto" className='d-flex gap-2'>
                                        <FormInput
                                            type="text"
                                            onChange={(e) => {
                                                setSearch(e.target.value);
                                                setSkip(1);
                                            }}
                                            placeholder="Search..." />
                                        <Button className="custom-buttons ">
                                            <FiFilter className='fs-4' />
                                        </Button>
                                        <Button className="custom-buttons ">
                                            <FiFileText className='fs-4' />
                                        </Button>
                                        <Button onClick={() => setAddDesignationModal(true)} className="custom-buttons">
                                            New Designation
                                        </Button>
                                    </Col>
                                </Row>

                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Table responsive className="table-centered table-nowrap mb-0">
                                    <thead className="ght">
                                        <tr key={''}>
                                            <th>S.no</th>
                                            <th>Clinic Type</th>
                                            <th>Created Date</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {store?.getMastersDataReducer?.loading ?
                                            <tr>
                                                <td colSpan={6} className='text-center'>
                                                    <Spinner />
                                                </td>
                                            </tr>
                                            :
                                            store?.getMastersDataReducer?.data?.pagination?.totalRecords === 0 ?
                                                <tr>
                                                    <td colSpan={6} className='text-center'>
                                                        <h3 className='my-5'>No Data Found</h3>
                                                    </td>
                                                </tr>
                                                :

                                                clinicTypeData?.map((data, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            {data?.name}
                                                        </td>
                                                        {/* <td className='text-capitalize'>
                                                            <span
                                                                data-bs-toggle="tooltip"
                                                                title={data?.description}
                                                                className="d-inline-block text-truncate text-capitalize cursor-pointer">
                                                                {data?.description.substring(0, 20) + '...'}
                                                            </span>
                                                        </td> */}
                                                        <td className='text-capitalize'>{new Date(data?.createdAt).toLocaleDateString('en-GB')}</td>
                                                        <td>
                                                            <Form.Switch checked={data?.isActive} onChange={() => handleUpdate(data)} />
                                                        </td>
                                                        <td>
                                                            {/* <Link to="#" className="action-icon"> */}
                                                            {/* <i className="mdi mdi-square-edit-outline"></i> */}
                                                            {/* </Link> */}
                                                            <i className="mdi fs-4 mdi-square-edit-outline cursor-pointer"
                                                                onClick={() => {
                                                                    setUpdateData(data)
                                                                    setUpdateDesignationModal(true);
                                                                }} />
                                                        </td>
                                                    </tr>
                                                ))
                                        }
                                    </tbody>
                                </Table>
                                <Row>
                                    <Col className='mt-2 d-flex justify-content-end'>
                                        <Paginations
                                            currentPage={skip}
                                            totalPages={store?.getMastersDataReducer?.data?.pagination?.totalPages}
                                            onPageChange={handlePageChange}
                                        />
                                    </Col>
                                </Row>
                            </Col>

                        </Row>
                    </Card.Body>
                </Card>
            </Col>
            <Modal centered show={addDesignationModal} onHide={closeAddModal}>
                {/* <Modal.Header
                    onHide={closeAddModal}
                    closeButton
                    className={'modal-colored-header pb-0 border-0 text-center'}>
                </Modal.Header> */}
                <Modal.Body>
                    <Row className="border-bottom mb-2 pb-2 d-flex align-items-center">
                        <Col sm={1}></Col>
                        <Col sm={10}>
                            <h4 className="mb-0 text-center">New Designation</h4>
                        </Col>
                        <Col sm={1}>
                            <IoMdClose className="fs-4 cursor-pointer" onClick={closeAddModal} />
                        </Col>
                    </Row>
                    {/* <h4 className="mt-0 text-center">New Clinic Type</h4> */}
                    <Form autoComplete='off' onSubmit={handleSubmit(addDesignation)}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Designation Name <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter designation name"
                                        {...register("name", { required: "Designation name is required" })}
                                    />
                                    {errors.name && <p className="text-danger">{errors.name.message}</p>}
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Re-Enter Designation Name <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Re-enter Designation Name"
                                        {...register("reEnterName", {
                                            required: "Please re-enter designation name",
                                            validate: value => value === nameValue || "Designation names do not match"
                                        })}
                                    />
                                    {errors.reEnterName && <p className="text-danger">{errors.reEnterName.message}</p>}
                                </Form.Group>
                            </Col>
                        </Row>
                        <Modal.Footer>
                            <Button onClick={closeAddModal} className='custom-buttons'>
                                Close
                            </Button>
                            <Button type='submit' className='custom-buttons' disabled={store?.createMastersDataReducer?.loading}>
                                {store?.createMastersDataReducer?.loading
                                    ?
                                    < Spinner color='white' className='spinner-border-sm' />
                                    :
                                    'Submit'
                                }
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>

        </Row>
    )
}

export default Designation