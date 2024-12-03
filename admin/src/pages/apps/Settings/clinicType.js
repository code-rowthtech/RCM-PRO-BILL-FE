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



const ClinicType = () => {
    const store = useSelector((state) => state);
    const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm();
    const dispatch = useDispatch();
    const nameValue = watch("name");
    const [skip, setSkip] = useState(1);
    const [addDepartmentModal, setAddDepartmentModal] = useState(false);
    const [updateClinicTypeModal, setUpdateClinicTypeModal] = useState(false);
    const [updateData, setUpdateData] = useState(null);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState(true);
    const closeAddModal = () => {
        setAddDepartmentModal(false);
    }
    const addClinicType = (data) => {
        // Handle form submission logic, e.g., API call
        const payload = {
            name: data?.name,
            description: data?.description,
            category: 'clinic_type',
            createdBy: createdBy,
        }
        dispatch(createMastersDataAction({ key: encryptMessage(payload) }))
    };
    const closeUpdateModal = () => {
        setUpdateClinicTypeModal(false);
        setUpdateData(null);
        reset();
    }
    const createResponse = store?.createMastersDataReducer?.data;
    const clinicTypeData = store?.getMastersDataReducer?.data?.clinicTypes;
    const updateResponse = store?.updateMastersDataReducer?.data?.status;

    useEffect(() => {
        dispatch(getMastersDataAction({ status: status, category: 'clinic_type', search: search, skip: skip, limit: 10 }));
        if (store?.createMastersDataReducer?.data?.status === 201) {
            reset();
            closeAddModal()
        }
        if (updateResponse === 200) {
            dispatch(getMastersDataAction({ status: status, category: 'clinic_type', search: search, limit: 10, skip: skip }));
            closeUpdateModal()
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
            settingType: 'clinic type'
        }
        dispatch(updateMastersDataAction({ key: encryptMessage(payload) }))
    }
    useEffect(() => {
        if (updateData) {
            setValue('name', updateData?.name)
            setValue('description', updateData?.description)
        }
    }, [updateData])
    const updateClinicType = (data) => {
        const payload = {
            name: data?.name,
            id: updateData?._id,
            description: data?.description,
            category: 'clinic_type',
        }
        dispatch(updateMastersDataAction({ key: encryptMessage(payload) }))
    };
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
                                        <Button onClick={() => setAddDepartmentModal(true)} className="custom-buttons">
                                            New Practice Type
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
                                            <th>Practice Type</th>
                                            <th>Description</th>
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
                                                        <td className='text-capitalize'>
                                                            {data?.name}
                                                        </td>
                                                        <td className='text-capitalize'>
                                                            <span
                                                                data-bs-toggle="tooltip"
                                                                title={data?.description}
                                                                className="d-inline-block text-truncate text-capitalize cursor-pointer">
                                                                {data?.description
                                                                    ? (data?.description?.length > 20
                                                                        ? data?.description.slice(0, 20) + '...'
                                                                        : data?.description)
                                                                    : 'N/A'}
                                                            </span>
                                                        </td>
                                                        <td className='text-capitalize'>{formatDate(data?.createdAt)}</td>
                                                        <td>
                                                            <Form.Switch checked={data?.isActive} onChange={() => handleUpdate(data)} />
                                                        </td>
                                                        <td>
                                                            {/* <Link to="#" className="action-icon"> */}
                                                            <i className="mdi fs-4 mdi-square-edit-outline cursor-pointer"
                                                                onClick={() => {
                                                                    setUpdateData(data)
                                                                    setUpdateClinicTypeModal(true);
                                                                }} />
                                                            {/* </Link> */}
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
            <Modal centered show={addDepartmentModal} >
                <Modal.Body>
                    <Row className="border-bottom mb-2 pb-2 d-flex align-items-center">
                        <Col sm={1}></Col>
                        <Col sm={10}>
                            <h4 className="mb-0 text-center">New Practice Type</h4>
                        </Col>
                        <Col sm={1}>
                            <IoMdClose className="fs-4 cursor-pointer" onClick={closeAddModal} />
                        </Col>
                    </Row>
                    {/* <h4 className="mt-0 text-center">New Clinic Type</h4> */}
                    <Form onSubmit={handleSubmit(addClinicType)}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Name <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter name"
                                        {...register("name", { required: "Name is required" })}
                                    />
                                    {errors.name && <p className="text-danger">{errors.name.message}</p>}
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Re-Enter Name <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Re-enter name"
                                        {...register("reEnterName", {
                                            required: "Please re-enter your name",
                                            validate: value => value === nameValue || "Names do not match"
                                        })}
                                    />
                                    {errors.reEnterName && <p className="text-danger">{errors.reEnterName.message}</p>}
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        {...register("description")}
                                        placeholder="Enter description"
                                    />
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

            <Modal centered show={updateClinicTypeModal} >
                <Modal.Body>
                    <Row className="border-bottom mb-2 pb-2 d-flex align-items-center">
                        <Col sm={1}></Col>
                        <Col sm={10}>
                            <h4 className="mb-0 text-center">Edit Practice Type</h4>
                        </Col>
                        <Col sm={1}>
                            <IoMdClose className="fs-4 cursor-pointer" onClick={closeUpdateModal} />
                        </Col>
                    </Row>
                    {/* <h4 className="mt-0 text-center">New Clinic Type</h4> */}
                    <Form onSubmit={handleSubmit(updateClinicType)}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter plan name"
                                        {...register("name", { required: "Plan name is required" })}
                                    />
                                    {errors.name && <p className="text-danger">{errors.name.message}</p>}
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Re-Enter Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Re-enter Plan Name"
                                        {...register("reEnterName", {
                                            required: "Please re-enter plan name",
                                            validate: value => value === nameValue || "Plan names do not match"
                                        })}
                                    />
                                    {errors.reEnterName && <p className="text-danger">{errors.reEnterName.message}</p>}
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as={'textarea'}
                                        rows={3}
                                        placeholder="Enter description"
                                        {...register("description")}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Modal.Footer>
                            <Button onClick={closeUpdateModal} className='custom-buttons'>
                                Close
                            </Button>
                            <Button type='submit' className='custom-buttons' disabled={store?.updateMastersDataReducer?.loading}>
                                {store?.updateMastersDataReducer?.loading
                                    ?
                                    < Spinner color='white' className='spinner-border-sm' />
                                    :
                                    'Update'
                                }
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
        </Row>
    )
}

export default ClinicType