import React, { useEffect } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { updateRolesAction } from '../../../../redux/actions';
import { encryptMessage } from '../../../../cryptoUtils';
import { IoMdClose } from 'react-icons/io';
import { getMastersDataAction } from '../../../../redux/settings/actions';

const UpdateSubscriptions = ({ show, closeModal, data }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset, getValues,
    } = useForm();

    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    useEffect(() => {
        if (show) {
            dispatch(getMastersDataAction({ status: true, category: 'plan_name', search: '', skip: '', limit: '' }));
        }
    }, [show])
    const plans = store?.getMastersDataReducer?.data?.clinicTypes;
    useEffect(() => {
        // Reset form values with the passed data when the modal opens
        if (show && data) {
            reset({
                name: data?.name || '',
                amount: data?.price || '',
                tenure: data?.billingFrequency || '',
                doctorcount: data?.doctorLimit || '',
                date: data?.implimentFrom || '',
                patientcount: data?.patientLimit || '',
                description: data?.description || ''
            });
        }
    }, [show, data, reset]);
    const idFromStorage = JSON.parse(sessionStorage.getItem('hyper_user'))?._id;
    const onSubmit = (formData) => {
        const payload = {
            id: data?._id,
            name: formData?.name,
            price: formData?.amount,
            billingFrequency: formData?.tenure,
            description: formData?.description,
            doctorLimit: formData?.doctorcount,
            patientLimit: formData?.patientcount,
            implimentFrom: formData?.date,
            role: idFromStorage
        }
        dispatch(updateRolesAction({ key: encryptMessage(payload) }));
        closeModal();
    }
    return (
        <Modal show={show} size='md' centered>
            {/* <Modal.Header
                onHide={closeModal}
                closeButton
                className={'modal-colored-header pb-0 border-0 text-center'}>
            </Modal.Header> */}
            <Modal.Body>
                <Row className="border-bottom mb-2 pb-2 d-flex align-items-center">
                    <Col sm={1}></Col>
                    <Col sm={10}>
                        <h4 className="mb-0 text-center">Edit Plan</h4>
                    </Col>
                    <Col sm={1}>
                        <IoMdClose className="fs-4 cursor-pointer" onClick={closeModal} />
                    </Col>
                </Row>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col sm={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Plan Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    defaultValue={data?.name}
                                    placeholder="Enter plan name"
                                    {...register('name', {
                                        required: 'Name is required',
                                        pattern: {
                                            value: /^(?! )[A-Za-z0-9 ]*$/,
                                            message: 'Special characters, leading spaces allowed',
                                        },
                                    })}
                                />
                                {errors.name && <span className="text-danger fs-6">{errors.name.message}</span>}
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Amount</Form.Label>
                                <Form.Control
                                    type="text"
                                    defaultValue={data?.price}
                                    placeholder="Enter amount"
                                    {...register('amount', {
                                        required: 'Amount is required',
                                        validate: value => (parseFloat(value) > 0) || 'Amount must be greater than 0',
                                        pattern: {
                                            value: /^[0-9]+(\.[0-9]+)?$/,
                                            message: 'Only positive numbers are allowed',
                                        },
                                    })}
                                />
                                {errors.amount && <span className="text-danger fs-6">{errors.amount.message}</span>}
                            </Form.Group>

                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Plan Tenure</Form.Label>
                                <Form.Select defaultValue={data?.billingFrequency}
                                    {...register('tenure', { required: 'Tenure is required' })}
                                >
                                    <option value=''>Select tenure</option>
                                    <option value='monthly'>Monthly</option>
                                    <option value='half-yearly'>Half yearly</option>
                                    <option value='yearly'>Yearly</option>
                                </Form.Select>
                                {errors.tenure && <span className="text-danger fs-6">{errors.tenure.message}</span>}

                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Doctor Count</Form.Label>
                                <Form.Control
                                    defaultValue={data?.doctorLimit}
                                    type="text"
                                    placeholder="Enter doctor count"
                                    {...register('doctorcount', {
                                        required: 'Doctor count is required',
                                        validate: value => (parseInt(value) > 0) || 'Doctor count must be a positive number greater than 0',
                                        pattern: {
                                            value: /^[1-9][0-9]*$/,
                                            message: 'Only positive numbers are allowed',
                                        },
                                    })}
                                />
                                {errors.doctorcount && <span className="text-danger fs-6">{errors.doctorcount.message}</span>}
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    placeholder="Select date"
                                    {...register('date', { required: 'Date is required' })}
                                />
                                {errors.date && <span className="text-danger fs-6">{errors.date.message}</span>}
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Patient Count</Form.Label>
                                <Form.Control
                                    defaultValue={data?.patientLimit}
                                    type="text"
                                    placeholder="Enter patient count"
                                    {...register('patientcount', {
                                        required: 'Patient count is required',
                                        validate: value => (parseInt(value) > 0) || 'Patient count must be a positive number greater than 0',
                                        pattern: {
                                            value: /^[1-9][0-9]*$/,
                                            message: 'Only positive numbers are allowed',
                                        },
                                    })}
                                />
                                {errors.patientcount && <span className="text-danger fs-6">{errors.patientcount.message}</span>}
                            </Form.Group>
                        </Col>
                        <Col sm={12}>
                            <Form.Group className="mb-2">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    defaultValue={data?.description}
                                    as="textarea"
                                    placeholder="Enter description"
                                    {...register('description', { required: 'Description is required' })}
                                />
                                {errors.description && <span className="text-danger fs-6">{errors.description.message}</span>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Modal.Footer className='border-0'>
                        <Button type='submit' className='custom-buttons'>
                            Save
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default UpdateSubscriptions;
