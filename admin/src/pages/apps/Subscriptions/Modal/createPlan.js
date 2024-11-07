import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { createSubscriptionsAction } from '../../../../redux/actions';
import { encryptMessage } from '../../../../cryptoUtils';
import Multiselect from "multiselect-react-dropdown";
import { IoMdClose } from 'react-icons/io';

const AddSubscriptions = ({ show, closeModal }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const onSubmit = (formData) => {
        const payload = {
            name: formData?.name,
            price: formData?.amount,
            billingFrequency: formData?.tenure,
            description: formData?.description,
            doctorLimit: formData?.doctorcount,
            patientLimit: formData?.patientcount,
            implimentFrom: formData?.date,
        }
        dispatch(createSubscriptionsAction({ key: encryptMessage(payload) }));

    };
    const createSuccess = store?.createSubscriptionsReducer?.data?.status;
    useEffect(() => {
        if (createSuccess === 201) {
            reset();
            closeModal();
        }
    }, [createSuccess])
    return (
        <Modal centered show={show} size='md' onHide={closeModal}>
            {/* <Modal.Header
                onHide={closeModal}
                closeButton
                className={'modal-colored-header pb-0 border-0 text-center'}>
                <Row>
                    <Col>
                        New Plan
                    </Col>
                </Row>
            </Modal.Header> */}
            <Modal.Body>
                <Row className="border-bottom mb-2 pb-2 d-flex align-items-center">
                    <Col sm={1}></Col>
                    <Col sm={10}>
                        <h4 className="mb-0 text-center">New Plan</h4>
                    </Col>
                    <Col sm={1}>
                        <IoMdClose className="fs-4 cursor-pointer" onClick={closeModal} />
                    </Col>
                </Row>
                {/* <h4 className="mt-0 text-center">New Plan</h4> */}
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col sm={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Plan Name</Form.Label>
                                <Form.Control
                                    type="text"
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
                                <Form.Select
                                    {...register('tenure', { required: 'Tenure is required' })}
                                >
                                    <option value='' >Select tenure</option>
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
                                    as={'textarea'}
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

export default AddSubscriptions;
