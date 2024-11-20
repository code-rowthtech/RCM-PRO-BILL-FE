import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { createSubscriptionsAction, updateRolesAction, updateSubscriptionsAction } from '../../../../redux/actions';
import { encryptMessage } from '../../../../cryptoUtils';
import { IoMdClose } from 'react-icons/io';
import { getMastersDataAction } from '../../../../redux/settings/actions';
import { formatDate } from '../../../../helpers/dateFormat';

const calculateFinalAmount = (price, taxPercentage) => {
    const taxAmount = (price * taxPercentage) / 100;
    return price + taxAmount;
};


const SubscriptionModal = ({ show, closeModal, data = null }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm();
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const [finalAmount, setFinalAmount] = useState(0);
    const isUpdateMode = Boolean(data); // Determines if this is "update" mode
    const watchedPrice = watch('amount');
    const watchedTax = watch('tax');
    useEffect(() => {
        const parsedPrice = parseFloat(watchedPrice) || 0;
        const parsedTax = parseFloat(watchedTax) || 0;
        const calculatedAmount = calculateFinalAmount(parsedPrice, parsedTax);
        setFinalAmount(calculatedAmount);
    }, [watchedPrice, watchedTax]);

    useEffect(() => {
        // if (show) {
        dispatch(getMastersDataAction({ status: true, category: 'plan_name', search: '', skip: '', limit: '' }));
        if (isUpdateMode && data) {
            reset();
        }
        // }
    }, [data])
    const plans = store?.getMastersDataReducer?.data?.clinicTypes;

    // const onSubmit = (formData) => {
    //     const payload = {
    //         name: formData.name,
    //         amount: formData.amount,
    //         billingFrequency: formData.tenure,
    //         description: formData.description,
    //         doctorLimit: formData.doctorcount,
    //         patientLimit: formData.patientcount,
    //         implimentFrom: formData.date,
    //         tax: formData.tax,
    //         totalAmount: finalAmount,
    //         ...(isUpdateMode ? { id: data._id } : {}), // Only add id if in update mode
    //     };

    //     if (isUpdateMode) {
    //         dispatch(updateSubscriptionsAction({ key: encryptMessage(payload) }));
    //     } else {
    //         dispatch(createSubscriptionsAction({ key: encryptMessage(payload) }));
    //     }
    //     closeModal();
    // };

    const onSubmit = (formData) => {
        // Prepare payload with only changed values
        const payload = {};

        if (formData.name !== data?.name) payload.name = formData.name;
        if (formData.amount !== data?.amount) payload.amount = formData.amount;
        if (formData.tenure !== data?.billingFrequency) payload.billingFrequency = formData.tenure;
        if (formData.description !== data?.description) payload.description = formData.description;
        if (formData.doctorcount !== data?.doctorLimit) payload.doctorLimit = formData.doctorcount;
        if (formData.patientcount !== data?.patientLimit) payload.patientLimit = formData.patientcount;
        if (formData.date !== formatDate(data?.implimentFrom)) payload.implimentFrom = formData.date;
        if (formData.tax !== data?.tax) payload.tax = formData.tax;
        if (formData.discount !== data?.discount) payload.discount = formData.discount;
        payload.totalAmount = finalAmount;

        // If it's an update, include the ID
        if (isUpdateMode) {
            payload.id = data._id;
            dispatch(updateSubscriptionsAction({ key: encryptMessage(payload) }));
        } else {
            dispatch(createSubscriptionsAction({ key: encryptMessage(payload) }));
        }

        closeModal();
    };

    return (
        <Modal centered show={show} size="md" onHide={closeModal}>
            <Modal.Body>
                <Row className="border-bottom mb-2 pb-2 d-flex align-items-center">
                    <Col sm={1}></Col>
                    <Col sm={10}>
                        <h4 className="mb-0 text-center">{isUpdateMode ? 'Edit Plan' : 'New Plan'}</h4>
                    </Col>
                    <Col sm={1}>
                        <IoMdClose className="fs-4 cursor-pointer" onClick={closeModal} />
                    </Col>
                </Row>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col sm={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Plan Name <span className='text-danger'>*</span></Form.Label>
                                <Form.Select
                                    defaultValue={isUpdateMode ? data?.name : ""}
                                    {...register('name', { required: 'This field is required' })}
                                >
                                    <option value="">Select</option>
                                    {plans?.map((plan) => (
                                        <option key={plan._id} value={plan.name}>
                                            {plan.name}
                                        </option>
                                    ))}
                                </Form.Select>
                                {errors.name && <span className="text-danger fs-6">{errors.name.message}</span>}
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Plan Tenure <span className='text-danger'>*</span></Form.Label>
                                <Form.Select
                                    defaultValue={isUpdateMode ? data?.billingFrequency : ''}
                                    {...register('tenure', { required: 'This field is required' })}
                                >
                                    <option value="">Select tenure</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="half-yearly">Half yearly</option>
                                    <option value="yearly">Yearly</option>
                                </Form.Select>
                                {errors.tenure && <span className="text-danger fs-6">{errors.tenure.message}</span>}
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Amount <span className='text-danger'>*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    defaultValue={isUpdateMode ? data?.amount : ''}
                                    placeholder="Enter amount"
                                    {...register('amount', {
                                        required: 'This field is required',
                                        validate: value => parseFloat(value) >= 0 || 'Amount must be a positive number',
                                    })}
                                />
                                {errors.amount && <span className="text-danger fs-6">{errors.amount.message}</span>}
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Tax <span className='text-danger'>*</span></Form.Label>
                                <Form.Control
                                    defaultValue={isUpdateMode ? data?.tax : ''}
                                    type="text"
                                    placeholder="Enter tax"
                                    {...register('tax', {
                                        required: 'This field is required',
                                        validate: value => parseFloat(value) >= 0 || 'Tax must be a positive number.',
                                    })}
                                />
                                {errors.tax && <span className="text-danger fs-6">{errors.tax.message}</span>}
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Implemented Date <span className='text-danger'>*</span></Form.Label>
                                <Form.Control
                                    type="date"
                                    defaultValue={isUpdateMode ? formatDate(data?.implimentFrom) : ''} // Ensure the date is formatted correctly
                                    placeholder="Select date"
                                    {...register('date', { required: 'This field is required' })}
                                />


                                {errors.date && <span className="text-danger fs-6">{errors.date.message}</span>}
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Patient Count <span className='text-danger'>*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    defaultValue={isUpdateMode ? data?.patientLimit : ''}
                                    placeholder="Enter patient count"
                                    {...register('patientcount', {
                                        required: 'This field count is required',
                                        validate: value => parseInt(value) > 0 || 'Patient count must be positive',
                                    })}
                                />
                                {errors.patientcount && <span className="text-danger fs-6">{errors.patientcount.message}</span>}
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Doctor Count <span className='text-danger'>*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    defaultValue={isUpdateMode ? data?.doctorLimit : ''}
                                    placeholder="Enter doctor count"
                                    {...register('doctorcount', {
                                        required: 'This field count is required',
                                        validate: value => parseInt(value) > 0 || 'Doctor count must be positive',
                                    })}
                                />
                                {errors.doctorcount && <span className="text-danger fs-6">{errors.doctorcount.message}</span>}
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Total Amount <span className='text-danger'>*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Total amount"
                                    value={finalAmount}
                                    readOnly
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Discount <span className='text-danger'>*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    {...register('discount', { required: 'This field is required' })}
                                    placeholder="Discount Percentage"
                                />
                            </Form.Group>
                            {errors.discount && <span className="text-danger fs-6">{errors.discount.message}</span>}
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as={'textarea'}
                                    {...register('description')}
                                    rows={3}
                                    placeholder="Enter description"
                                    defaultValue={isUpdateMode ? data?.description : ''}
                                />
                            </Form.Group>

                        </Col>
                    </Row>
                    <Modal.Footer className='pb-0 px-0'>
                        <Button className="custom-buttons" onClick={closeModal}>
                            Cancel
                        </Button>
                        <Button type="submit" className="custom-buttons">
                            Save
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>

        </Modal>
    );
};

export default SubscriptionModal;
