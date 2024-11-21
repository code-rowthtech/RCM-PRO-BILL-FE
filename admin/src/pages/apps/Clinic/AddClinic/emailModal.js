import React, { useEffect } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { createClinicAction, createPermissionAction } from '../../../../redux/actions';
import { encryptMessage } from '../../../../cryptoUtils';
import Spinner from '../../../../constants/Spinner';
import { IoMdClose } from 'react-icons/io';
import ToastHandle from '../../../../helpers/ToastMessage';
const SendEmailModal = ({ show, closeModal, mailId }) => {
    const dispatch = useDispatch();
    // Using useForm hook for form handling and validation
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();
    const store = useSelector((state) => state);
    const createResponse = store?.createClinicsReducer?.data?.status;
    useEffect(() => {
        if (createResponse === 200) {
            closeModal();
        }
    }, [createResponse])
    const onSubmit = () => {
        dispatch(createClinicAction({ key: encryptMessage(mailId) }))
    }
    return (
        <Modal centered size='md' show={show} onHide={closeModal}>
            {/* <Modal.Header
                onHide={closeModal}
                closeButton
                className={'modal-colored-header pb-0 border-0 text-center'}>
            </Modal.Header> */}
            <Modal.Body>
                <Row className=" mb-2 pb-2 d-flex align-items-center">
                    <Col sm={1}></Col>
                    <Col sm={10}>
                        <h4 className="mb-0 text-center">Email to clinic</h4>
                    </Col>
                    <Col sm={1}>
                        {/* <IoMdClose className="fs-4 cursor-pointer" onClick={closeModal} /> */}
                    </Col>
                </Row>
                {/* <h4 className="mt-0 text-center">Add Permissions</h4> */}
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col md={12}
                            className='d-flex justify-content-center'>
                            <Form.Group
                                className="mb-2 w-50">
                                <Form.Control
                                    type="email"
                                    readOnly
                                    value={mailId?.email}
                                    {...register('email', { required: 'Email is required' })}
                                />
                                {errors.email && <span className="text-danger">{errors.email.message}</span>}
                            </Form.Group>
                        </Col>
                        <Col sm={12} className='text-center'>
                            The clinic will receive a onboarding mail email at {mailId?.email}.
                        </Col>
                        <Col sm={12} className='text-center mt-2' >
                            <Button type='submit' className='custom-buttons' disabled={store?.createClinicsReducer?.loading}>
                                {store?.createClinicsReducer?.loading ?
                                    <Spinner color='white' className='spinner-border-sm' />
                                    :
                                    'Send'
                                }
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default SendEmailModal;
