import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { createSubscriptionsAction, updateRolesAction, updateSubscriptionsAction } from '../../../../redux/actions';
import { encryptMessage } from '../../../../cryptoUtils';
import { IoMdClose } from 'react-icons/io';
import { getMastersDataAction, getTenureAction } from '../../../../redux/settings/actions';
import { formatDate } from '../../../../helpers/dateFormat';
import Spinner from '../../../../constants/Spinner';

// const calculateFinalAmount = (price, taxPercentage) => {
//     const taxAmount = (price * taxPercentage) / 100;
//     return price + taxAmount;
// };
const calculateFinalAmount = (price, taxPercentage, discountPercentage) => {
    const discountAmount = (price * discountPercentage) / 100;
    const priceAfterDiscount = price - discountAmount;
    const taxAmount = (priceAfterDiscount * taxPercentage) / 100;
    return priceAfterDiscount + taxAmount;
};


const SubscriptionModal = ({ show, closeModal, data = null }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset, getValues,
        watch, clearErrors, setValue
    } = useForm();
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const [finalAmount, setFinalAmount] = useState(0);
    const [tenureMonth, setTenureMonth] = useState(null);
    const isUpdateMode = Boolean(data); // Determines if this is "update" mode
    const watchedPrice = watch('amount');
    const watchedTax = watch('tax');
    const watchedDiscount = watch('discount');
    const plans = store?.getMastersDataReducer?.data?.clinicTypes;
    const tenure = store?.getTenureReducer?.data?.tenure;
    const updateResponse = store?.updateSubscriptionsReducer?.data?.status;
    const createResponse = store?.createSubscriptionsReducer?.data?.status;
    // useEffect(() => {
    //     const parsedPrice = parseFloat(watchedPrice) || 0;
    //     const parsedTax = parseFloat(watchedTax) || 0;
    //     const calculatedAmount = calculateFinalAmount(parsedPrice, parsedTax);
    //     setFinalAmount(calculatedAmount);
    // }, [watchedPrice, watchedTax]);
    useEffect(() => {
        const parsedPrice = parseFloat(watchedPrice) || 0;
        const parsedTax = parseFloat(watchedTax) || 0;
        const parsedDiscount = parseFloat(watchedDiscount) || 0;

        const calculatedAmount = calculateFinalAmount(parsedPrice, parsedTax, parsedDiscount);
        setFinalAmount(calculatedAmount);
    }, [watchedPrice, watchedTax, watchedDiscount]);

    useEffect(() => {
        if (show) {
            dispatch(getMastersDataAction({ status: true, category: 'plan_name', search: '', skip: '', limit: '' }));
            dispatch(getTenureAction({ status: true, search: '', skip: '', limit: '' }));
        }
    }, [dispatch, show])
    useEffect(() => {
        if (isUpdateMode && data) {
            console.log(data?.implimentFrom)
            setValue('name', plans && plans.find((plans) => plans?.name === data?.name)?.name);
            setValue('tenure', tenure && tenure.find((tenure) => tenure?.name === data?.billingFrequency)?.name);
            setValue('amount', data?.amount);
            setValue('tax', data?.tax);
            setValue('patientcount', data?.patientLimit);
            setValue('doctorcount', data?.doctorLimit);
            setValue('discount', data?.discount);
            setValue('description', data?.description);
            setValue('date', data?.implimentFrom ? new Date(data.implimentFrom).toISOString().split('T')[0] : '');
        }
    }, [isUpdateMode, data, setValue, plans, tenure])

    useEffect(() => {
        if (updateResponse === 200 || createResponse === 201) {
            closeModal();
            reset();
        }
    }, [createResponse, updateResponse])
    const onSubmit = (formData) => {
        const payload = {};
        if (formData.name !== data?.name) payload.name = formData.name;
        if (formData.amount !== data?.amount) payload.amount = formData.amount;
        if (formData.tenure !== data?.billingFrequency) payload.billingFrequency = formData.tenure;
        if (formData.tenure !== data?.months) payload.months = tenureMonth;
        if (formData.description !== data?.description) payload.description = formData.description;
        if (formData.doctorcount !== data?.doctorLimit) payload.doctorLimit = formData.doctorcount;
        if (formData.patientcount !== data?.patientLimit) payload.patientLimit = formData.patientcount;
        if (formData.date !== formatDate(data?.implimentFrom)) payload.implimentFrom = formData.date;
        if (formData.tax !== data?.tax) payload.tax = formData.tax;
        if (formData.discount !== data?.discount) payload.discount = formData.discount;
        payload.totalAmount = finalAmount;
        payload.months = tenureMonth;
        if (isUpdateMode) {
            payload.id = data._id;
            dispatch(updateSubscriptionsAction({ key: encryptMessage(payload) }));
        } else {
            dispatch(createSubscriptionsAction({ key: encryptMessage(payload) }));
        }
    };
    const dateField = watch('date')
    return (
        <Modal centered show={show} size="md">
            <Modal.Body>
                <Row className="border-bottom mb-2 pb-2 d-flex align-items-center">
                    <Col sm={1}></Col>
                    <Col sm={10}>
                        <h4 className="mb-0 text-center">{isUpdateMode ? 'Edit Plan' : 'New Plan'}</h4>
                    </Col>
                    <Col sm={1}>
                        <IoMdClose className="fs-4 cursor-pointer" onClick={() => {
                            closeModal();
                            reset();
                        }} />
                    </Col>
                </Row>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col sm={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Plan Name <span className='text-danger'>*</span></Form.Label>
                                <Form.Select
                                    // defaultValue={isUpdateMode ? data?.name : ""}
                                    {...register('name', { required: 'Please select a plan name' })}
                                    data-has-value={!!getValues('name')}
                                    onBlur={(e) => {
                                        e.target.setAttribute('data-has-value', !!e.target.value);
                                    }}
                                >
                                    <option value="">Select</option>
                                    {plans?.map((plan) => (
                                        <option key={plan?._id} value={plan?.name}>
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
                                    {...register('tenure', { required: 'Please select a tenure for the plan.' })}
                                    onChange={(e) => {
                                        const selectedOption = tenure?.find(option => option.name === e.target.value);
                                        setTenureMonth(selectedOption?.months);
                                        clearErrors('tenure');
                                    }}                                >
                                    <option value="">Select tenure</option>
                                    {tenure?.map((data) => (
                                        <option value={data?.name} key={data?.months}>{data?.name}</option>
                                    ))}
                                </Form.Select>
                                {errors.tenure && <span className="text-danger fs-6">{errors.tenure.message}</span>}
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Amount <span className='text-danger'>*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    // defaultValue={isUpdateMode ? data?.amount : ''}
                                    placeholder="Enter amount"
                                    {...register('amount', {
                                        required: 'This field is required',
                                        validate: value => parseFloat(value) >= 0 || 'Amount must be a positive number',
                                    })}
                                    onInput={(e) => {
                                        if (e.target.value < 0) {
                                            e.target.value = ''; // Clear the input if it's negative
                                        }
                                    }}
                                />
                                {errors.amount && <span className="text-danger fs-6">{errors.amount.message}</span>}
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Tax Rate <span className='text-danger'>*</span></Form.Label>
                                <Form.Control
                                    // defaultValue={isUpdateMode ? data?.tax : ''}
                                    type="text"
                                    placeholder="Enter tax"
                                    {...register('tax', {
                                        required: 'This field is required',
                                        validate: value => parseFloat(value) >= 0 || 'Tax must be a positive number.',
                                    })}
                                    onInput={(e) => {
                                        if (e.target.value < 0) {
                                            e.target.value = ''; // Clear the input if it's negative
                                        }
                                    }}
                                />
                                {errors.tax && <span className="text-danger fs-6">{errors.tax.message}</span>}
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
                                <Form.Label>Discount</Form.Label>
                                <Form.Control
                                    type="text"
                                    {...register('discount',
                                        //  { required: 'This field is required' }
                                    )}
                                    placeholder="Discount Percentage"
                                    onInput={(e) => {
                                        if (e.target.value < 0) {
                                            e.target.value = ''; // Clear the input if it's negative
                                        }
                                    }}
                                />
                            </Form.Group>
                            {errors.discount && <span className="text-danger fs-6">{errors.discount.message}</span>}
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Start Date <span className='text-danger'>*</span></Form.Label>
                                <Form.Control
                                    type="date"
                                    className={` ${!dateField ? 'emptyField' : 'selectedField'}`}
                                    // defaultValue={isUpdateMode ? formatDate(data?.implimentFrom) : ''} // Ensure the date is formatted correctly
                                    placeholder="Select date"
                                    {...register('date', { required: 'This field is required' })}
                                />
                                {errors.date && <span className="text-danger fs-6">{errors.date.message}</span>}
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Patient Count </Form.Label>
                                <Form.Control
                                    type="text"
                                    // defaultValue={isUpdateMode ? data?.patientLimit : ''}
                                    placeholder="Enter patient count"
                                    {...register('patientcount', {
                                        // required: 'This field is required',
                                        validate: value => parseInt(value) > 0 || 'Patient count must be positive',
                                    })}
                                    onInput={(e) => {
                                        if (e.target.value < 0) {
                                            e.target.value = ''; // Clear the input if it's negative
                                        }
                                    }}
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
                                        required: 'This field is required',
                                        validate: value => parseInt(value) > 0 || 'Doctor count must be positive',
                                    })}
                                    onInput={(e) => {
                                        if (e.target.value < 0) {
                                            e.target.value = ''; // Clear the input if it's negative
                                        }
                                    }}
                                />
                                {errors.doctorcount && <span className="text-danger fs-6">{errors.doctorcount.message}</span>}
                            </Form.Group>
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
                        {/* <Button className="custom-buttons" onClick={() => {
                            closeModal();
                            reset();
                        }}>
                            Cancel
                        </Button> */}
                        <Button disabled={store?.createSubscriptionsReducer?.loading || store?.updateSubscriptionsReducer?.loading} type="submit" className="custom-buttons">
                            {store?.createSubscriptionsReducer?.loading || store?.updateSubscriptionsReducer?.loading ?
                                <Spinner color='white' className='spinner-border-sm' />
                                :
                                'Save'
                            }
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>

        </Modal>
    );
};

export default SubscriptionModal;
