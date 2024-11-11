import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { createSubscriptionsAction } from '../../../../redux/actions';
import { encryptMessage } from '../../../../cryptoUtils';
import { IoMdClose } from 'react-icons/io';
import { getMastersDataAction } from '../../../../redux/settings/actions';

const calculateFinalAmount = (price, taxPercentage) => {
    if (typeof price !== 'number' || typeof taxPercentage !== 'number' || isNaN(price) || isNaN(taxPercentage)) {
        return 0;
    }
    const taxAmount = (price * taxPercentage) / 100;
    return price + taxAmount;
};

const AddSubscriptions = ({ show, closeModal }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm();
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const [finalAmount, setFinalAmount] = useState(0);

    // Watching changes on 'amount' and 'tax' fields
    const watchedPrice = watch('amount');
    const watchedTax = watch('tax');

    useEffect(() => {
        const parsedPrice = parseFloat(watchedPrice) || 0;
        const parsedTax = parseFloat(watchedTax) || 0;
        const calculatedAmount = calculateFinalAmount(parsedPrice, parsedTax);
        setFinalAmount(calculatedAmount);
    }, [watchedPrice, watchedTax]);
    useEffect(() => {
        if (show) {
            dispatch(getMastersDataAction({ status: true, category: 'plan_name', search: '', skip: '', limit: '' }));
        }
    }, [show])
    const plans = store?.getMastersDataReducer?.data?.clinicTypes;
    const onSubmit = (formData) => {
        const finalAmount = calculateFinalAmount(parseFloat(formData?.amount), parseFloat(formData?.tax));

        const payload = {
            name: formData?.name,
            amount: formData?.amount,
            billingFrequency: formData?.tenure,
            description: formData?.description,
            doctorLimit: formData?.doctorcount,
            patientLimit: formData?.patientcount,
            implimentFrom: formData?.date,
            tax: formData?.tax,
            totalAmount: finalAmount,
        };
        dispatch(createSubscriptionsAction({ key: encryptMessage(payload) }));
    };

    const createSuccess = store?.createSubscriptionsReducer?.data?.status;
    useEffect(() => {
        if (createSuccess === 201) {
            reset();
            closeModal();
        }
    }, [createSuccess]);

    return (
        <Modal centered show={show} size="md" onHide={closeModal}>
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
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col sm={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Plan Name</Form.Label>
                                <Form.Select
                                    {...register('name')}
                                >
                                    <option readOnly>Select</option>
                                    {plans && plans?.map((data, index) => (
                                        <option key={data?._id} value={data?.name}>{data?.name}</option>
                                    ))}
                                </Form.Select>
                                {errors.name && <span className="text-danger fs-6">{errors.name.message}</span>}
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Plan Tenure</Form.Label>
                                <Form.Select
                                    {...register('tenure', { required: 'Tenure is required' })}
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
                                <Form.Label>Tax</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter tax"
                                    {...register('tax', {
                                        required: 'Tax is required',
                                        validate: value => (parseFloat(value) > 0) || 'Tax must be greater than 0',
                                        pattern: {
                                            value: /^[0-9]+(\.[0-9]+)?$/,
                                            message: 'Only positive numbers are allowed',
                                        },
                                    })}
                                />
                                {errors.tax && <span className="text-danger fs-6">{errors.tax.message}</span>}
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Implemented Date</Form.Label>
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
                                <Form.Label>Total Amount</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Total amount"
                                    value={finalAmount}
                                    readOnly
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Modal.Footer className="border-0">
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

export default AddSubscriptions;
