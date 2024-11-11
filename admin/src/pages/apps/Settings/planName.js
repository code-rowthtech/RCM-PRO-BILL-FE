import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Form, Modal, Row, Table } from 'react-bootstrap'
import Spinner from '../../../constants/Spinner'
import { FormInput } from '../../../components'
import { FiFileText, FiFilter } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form';
import { encryptMessage } from '../../../cryptoUtils'
import { createMastersDataAction, getMastersDataAction } from '../../../redux/settings/actions'
import { IoMdClose } from 'react-icons/io'
import Paginations from '../../../helpers/Paginations'

function formatDate(dateString) {
    const date = new Date(dateString);

    // Define options for custom formatting
    const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    const dateOptions = { day: 'numeric', month: 'short', year: 'numeric' };

    // Format time and date separately
    const formattedTime = date.toLocaleTimeString('en-US', timeOptions);
    const formattedDate = date.toLocaleDateString('en-US', dateOptions);

    // Customize day suffix (st, nd, rd, th)
    const day = date.getDate();
    const suffix = ["th", "st", "nd", "rd"][(day % 10 > 3 || Math.floor(day % 100 / 10) === 1) ? 0 : day % 10];

    return `${formattedTime} ${day}${suffix}    ${formattedDate.split(' ')[1]} ${date.getFullYear()}`;
}

const PlanName = () => {
    const store = useSelector((state) => state);
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
    const dispatch = useDispatch();
    const nameValue = watch("name");
    const [addPlanNameModal, setAddPlanNameModal] = useState(false);
    const [search, setSearch] = useState('');
    const [skip, setSkip] = useState(1);
    const [status, setStatus] = useState(true);
    const closeAddModal = () => {
        setAddPlanNameModal(false);
    }
    const addPlanName = (data) => {
        const payload = {
            name: data?.name,
            description: data?.description,
            category: 'plan_name',
        }
        dispatch(createMastersDataAction({ key: encryptMessage(payload) }))
    };
    const createResponse = store?.createMastersDataReducer?.data;
    const clinicTypeData = store?.getMastersDataReducer?.data?.clinicTypes;
    useEffect(() => {
        dispatch(getMastersDataAction({ status: status, category: 'plan_name', search: search, skip: skip, limit: 10 }));
        if (store?.createMastersDataReducer?.data?.status === 201) {
            reset();
            closeAddModal()
        }
    }, [store?.createMastersDataReducer?.data, dispatch, search, status, skip]);
    const handleStatusChange = (isActive) => {
        setStatus(isActive);
        setSearch('');
    };
    const handlePageChange = (pageNumber) => {
        setSkip(pageNumber);
    };
    return (
        <Row className='mt-2'>
            <Col xs={12}>
                <Card>
                    <Card.Body>
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
                                        <Button onClick={() => setAddPlanNameModal(true)} className="custom-buttons">
                                            New Plan Name
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
                                                        <td className='text-capitalize'>{formatDate(data?.createdAt)}</td>
                                                        <td>
                                                            <Form.Switch checked />
                                                        </td>
                                                        <td>
                                                            {/* <Link to="#" className="action-icon"> */}
                                                            <i className="mdi mdi-square-edit-outline"></i>
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
            <Modal centered show={addPlanNameModal} onHide={closeAddModal}>
                {/* <Modal.Header
                    onHide={closeAddModal}
                    closeButton
                    className={'modal-colored-header pb-0 border-0 text-center'}>
                </Modal.Header> */}
                <Modal.Body>
                    <Row className="border-bottom mb-2 pb-2 d-flex align-items-center">
                        <Col sm={1}></Col>
                        <Col sm={10}>
                            <h4 className="mb-0 text-center">New Plan Name</h4>
                        </Col>
                        <Col sm={1}>
                            <IoMdClose className="fs-4 cursor-pointer" onClick={closeAddModal} />
                        </Col>
                    </Row>
                    {/* <h4 className="mt-0 text-center">New Clinic Type</h4> */}
                    <Form onSubmit={handleSubmit(addPlanName)}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Plan Name *</Form.Label>
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
                                    <Form.Label>Re-Enter Plan Name *</Form.Label>
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
                            <Button onClick={closeAddModal} className='custom-buttons'>
                                Close
                            </Button>
                            <Button type='submit' className='custom-buttons' disabled={store?.createMastersDataReducer?.loading}>
                                {store?.createMastersDataReducer?.loading
                                    ?
                                    < Spinner />
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

export default PlanName