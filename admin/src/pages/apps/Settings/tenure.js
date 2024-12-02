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
import { createdBy } from './userId'
import { handleFirstSpace } from '../../../helpers/noBeginningSpace'


const Tenure = () => {
    const store = useSelector((state) => state);
    const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm();
    const dispatch = useDispatch();
    const nameValue = watch("name");
    const [addTenureModal, setAddTenureModal] = useState(false);
    const [updateTenureModal, setUpdateTenureModal] = useState(false);
    const [updateData, setUpdateData] = useState(null);
    const [skip, setSkip] = useState(1);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState(true);
    const closeAddModal = () => {
        setAddTenureModal(false);
    }
    const closeUpdateModal = () => {
        setUpdateTenureModal(false);
        setUpdateData(null);
        reset();
    }
    const addTenure = (data) => {
        // Handle form submission logic, e.g., API call
        const payload = {
            name: data?.name,
            months: parseInt(data?.months),
            category: 'tenure',
            createdBy: createdBy,
        }
        // console.log(payload, 'payloadpayload')
        dispatch(createMastersDataAction({ key: encryptMessage(payload) }))
    };
    const updateTenure = (data) => {
        const payload = {
            name: data?.name,
            id: updateData?._id,
            months: parseInt(data?.months),
            category: 'tenure',
        }
        // console.log(payload)
        dispatch(updateMastersDataAction({ key: encryptMessage(payload) }))
    };
    const createResponse = store?.createMastersDataReducer?.data;
    const clinicTypeData = store?.getMastersDataReducer?.data?.clinicTypes;
    const updateResponse = store?.updateMastersDataReducer?.data?.status;
    useEffect(() => {
        dispatch(getMastersDataAction({ status: status, category: 'tenure', search: search, limit: 10, skip: skip }));
        if (store?.createMastersDataReducer?.data?.status === 201) {
            reset();
            closeAddModal()
        }
        if (updateResponse === 200) {
            dispatch(getMastersDataAction({ status: status, category: 'tenure', search: search, limit: 10, skip: skip }));
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
            settingType: 'tenure'
        }
        dispatch(updateMastersDataAction({ key: encryptMessage(payload) }))
    }
    useEffect(() => {
        if (updateData) {
            setValue('name', updateData?.name)
            setValue('months', updateData?.months)
        }
    }, [updateData])
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
                                        <Button onClick={() => setAddTenureModal(true)} className="custom-buttons">
                                            New Tenure
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
                                            <th>Name</th>
                                            <th>Months</th>
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
                                                        <td>
                                                            {data?.name}
                                                        </td>
                                                        <td>
                                                            {data?.months}
                                                        </td>
                                                        <td>
                                                            <Form.Switch checked={data?.isActive}
                                                                onChange={() => handleUpdate(data)}
                                                            />
                                                        </td>
                                                        <td>
                                                            {/* <Link to="#" className="action-icon"> */}
                                                            <i className="mdi fs-4 mdi-square-edit-outline cursor-pointer"
                                                                onClick={() => {
                                                                    setUpdateData(data)
                                                                    setUpdateTenureModal(true);
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
            <Modal centered show={addTenureModal} >
                <Modal.Body>
                    <Row className="border-bottom mb-2 pb-2 d-flex align-items-center">
                        <Col sm={1}></Col>
                        <Col sm={10}>
                            <h4 className="mb-0 text-center">New Tenure</h4>
                        </Col>
                        <Col sm={1}>
                            <IoMdClose className="fs-4 cursor-pointer" onClick={closeAddModal} />
                        </Col>
                    </Row>
                    <Form onSubmit={handleSubmit(addTenure)}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Tenure Name <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        onKeyPress={handleFirstSpace}
                                        placeholder="Enter Tenure Name"
                                        {...register("name", { required: "Tenure name is required" })}
                                    />
                                    {errors.name && <p className="text-danger">{errors.name.message}</p>}
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Re-Enter Tenure Name<span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Re-enter tenure name"
                                        onKeyPress={handleFirstSpace}
                                        {...register("reEnterName", {
                                            required: "Please re-enter tenure name",
                                            validate: value => value === nameValue || "Tenure name does not match"
                                        })}
                                    />
                                    {errors.reEnterName && <p className="text-danger">{errors.reEnterName.message}</p>}
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-0">
                                    <Form.Label>Months <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter no of months"
                                        onKeyPress={handleFirstSpace}
                                        {...register("months", {
                                            required: "Please enter the tenure validity months",
                                            pattern: {
                                                value: /^[1-9]\d*$/, // Matches numbers greater than 0
                                                message: "Only numbers greater than 0 are allowed",
                                            },
                                        })}
                                    />

                                </Form.Group>
                            </Col>
                            {errors.months && <p className="text-danger">{errors.months.message}</p>}
                        </Row>
                        <Modal.Footer>
                            <Button onClick={closeAddModal} className='custom-buttons'>
                                Close
                            </Button>
                            <Button type='submit' className='custom-buttons' disabled={store?.createMastersDataReducer?.loading}>
                                {store?.createMastersDataReducer?.loading
                                    ?
                                    <Spinner color='white' className='spinner-border-sm' />
                                    :
                                    'Submit'
                                }
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal centered show={updateTenureModal}>
                <Modal.Body>
                    <Row className="border-bottom mb-2 pb-2 d-flex align-items-center">
                        <Col sm={1}></Col>
                        <Col sm={10}>
                            <h4 className="mb-0 text-center">Edit Tenure</h4>
                        </Col>
                        <Col sm={1}>
                            <IoMdClose className="fs-4 cursor-pointer" onClick={closeUpdateModal} />
                        </Col>
                    </Row>
                    <Form onSubmit={handleSubmit(updateTenure)}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Tenure Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Tenure Name"
                                        onKeyPress={handleFirstSpace}
                                        {...register("name", { required: "Tenure name is required" })}
                                    />
                                    {errors.name && <p className="text-danger">{errors.name.message}</p>}
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Re-Enter Tenure Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Re-enter tenure name"
                                        onKeyPress={handleFirstSpace}
                                        {...register("reEnterName", {
                                            required: "Please re-enter tenure name",
                                            validate: value => value === nameValue || "Tenure name does not match"
                                        })}
                                    />
                                    {errors.reEnterName && <p className="text-danger">{errors.reEnterName.message}</p>}
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Months</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter no of months"
                                        onKeyPress={handleFirstSpace}
                                        {...register("months", {
                                            required: "Please enter the tenure validity months",
                                            pattern: {
                                                value: /^[1-9]\d*$/, // Matches numbers greater than 0
                                                message: "Only numbers greater than 0 are allowed",
                                            },
                                        })}
                                    />

                                    {errors.months && <p className="text-danger">{errors.months.message}</p>}
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
                                    <Spinner color='white' className='spinner-border-sm' />
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

export default Tenure;