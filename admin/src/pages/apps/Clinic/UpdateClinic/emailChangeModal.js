import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { encryptMessage } from '../../../../cryptoUtils';
import { generateOtpAction, newEmailAction, stateEmptydAction, verifyOtpAction } from '../../../../redux/actions';
import Spinner from '../../../../constants/Spinner';

const EmailChangeModal = ({ show, onClose, email }) => {
    const { register, getValues, formState: { errors } } = useForm();
    const dispatch = useDispatch();
    const store = useSelector(state => state);

    const [otp, setOtp] = useState(Array(6).fill(''));
    const [otpGenerated, setOtpGenerated] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const otpGenerationResponse = store?.generateOtpReducer?.data;
    const otpVerificationResponse = store?.verifyOtpReducer?.data;
    useEffect(() => {
        if (store?.generateOtpReducer?.loading || store?.verifyOtpReducer?.loading || store?.newEmailReducer?.loading) {
            setLoading(true);
        } else {
            setLoading(false);
        }
    }, [, store?.generateOtpReducer, store?.verifyOtpReducer, store?.newEmailReducer])
    // Handle OTP generation
    const handleOtpGeneration = () => {
        const payload = { email };
        dispatch(generateOtpAction({ key: encryptMessage(payload) }));
    };

    // Handle OTP verification
    const handleOtpVerification = () => {
        const payload = { email: getValues('otpResetEmail'), otp: otp.join('') };
        dispatch(verifyOtpAction({ key: encryptMessage(payload) }));
    };

    // Handle adding new email
    const handleAddNewMail = () => {
        const payload = { email: 'ajay7ass77as@yopmail.com' };
        dispatch(newEmailAction({ key: encryptMessage(payload) }));
        setOtpGenerated(false);
        setOtpVerified(false);
    };

    // Handle state updates based on Redux responses
    useEffect(() => {
        if (otpGenerationResponse?.status === 200 && !otpGenerated) {
            setOtpGenerated(true);
            dispatch(stateEmptydAction()); // Reset state after action
        }

        if (otpVerificationResponse?.status === 200 && !otpVerified) {
            setOtpVerified(true);
            dispatch(stateEmptydAction()); // Reset state after action
        }
    }, [otpGenerationResponse, otpVerificationResponse, otpGenerated, otpVerified, dispatch]);

    // Handle OTP input changes
    const handleOtpChange = (value, index) => {
        if (!/^[0-9]$/.test(value) && value !== '') return; // Allow only digits
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < otp.length - 1) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    // Handle key navigation (Backspace)
    const handleOtpInput = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`).focus();
        }
    };

    return (
        <Modal centered size="md" show={show} onHide={onClose}>
            <Modal.Body>
                <Row className="mb-2 pb-2 d-flex align-items-center">
                    <Col sm={12}>
                        <h4 className="text-center">Change Clinic Email</h4>
                    </Col>
                </Row>
                <Form className="px-3">
                    <Row>
                        <Col sm={12}>
                            <Form.Label>Current Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                readOnly
                                value={email}
                                {...register('otpResetEmail')}
                            />
                            {errors.otpResetEmail && <span className="text-danger">{errors.otpResetEmail.message}</span>}
                        </Col>

                        {/* OTP Input */}
                        {otpGenerated && (
                            <Col sm={12} className="mt-3">
                                <Form.Label>Enter OTP sent to your registered email</Form.Label>
                                <Row className="justify-content-center">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={`otp-${index}`}
                                            type="text"
                                            maxLength="1"
                                            value={digit}
                                            onChange={(e) => handleOtpChange(e.target.value, index)}
                                            onKeyDown={(e) => handleOtpInput(e, index)}
                                            className="otp-input text-center mx-1"
                                            style={{ width: '2.5rem', height: '2.5rem', fontSize: '1.25rem' }}
                                        />
                                    ))}
                                </Row>
                            </Col>
                        )}

                        {/* New Email Input */}
                        {otpVerified && (
                            <Col sm={12} className="mt-3">
                                <Form.Label>New Email Address</Form.Label>
                                <Form.Control type="email" placeholder="Enter new email address" />
                            </Col>
                        )}

                        {/* Button */}
                        <Col sm={12} className="text-center mt-3">
                            <Button
                                className="custom-buttons"
                                disabled={loading}
                                onClick={() => {
                                    if (otpVerified) {
                                        handleAddNewMail();
                                    } else if (otpGenerated) {
                                        handleOtpVerification();
                                    } else {
                                        handleOtpGeneration();
                                    }
                                }}
                            >
                                {loading ?
                                    <Spinner className='spinner-border-sm' color='white' />
                                    :
                                    otpVerified
                                        ? 'Save'
                                        : otpGenerated
                                            ? 'Verify OTP'
                                            : 'Generate OTP'
                                }
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EmailChangeModal;
