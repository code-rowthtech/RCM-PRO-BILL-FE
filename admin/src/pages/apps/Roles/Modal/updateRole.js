import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { createPermissionAction, createRolesAction, createUserRolesAction, getPermissionAction, updateUserRolesAction } from '../../../../redux/actions';
import { encryptMessage } from '../../../../cryptoUtils';
import Multiselect from "multiselect-react-dropdown";
import { IoMdClose } from 'react-icons/io';
import Spinner from '../../../../constants/Spinner';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icons for eye visibility toggle
import { getMastersDataAction } from '../../../../redux/settings/actions';
import { createdBy } from '../../Settings/userId';

const UpdateRoles = ({ show, closeModal, data }) => {

    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch, setValue
    } = useForm();
    const idFromStorage = JSON.parse(sessionStorage.getItem('hyper_user'));
    const [selectedPermissionIds, setSelectedPermissionIds] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const store = useSelector((state) => state);
    const createResponse = store?.createUserRolesReducer?.data?.status;
    const decryptedPermissionsData = store?.getPermissionsDataReducer?.data?.data?.map((item) => ({
        ...item,
        name: `${item?.name}`,
    }));
    const decryptedRolesData = store?.getRolesDataReducer?.data?.roles;

    const clinicTypeData = store?.getMastersDataReducer?.data?.clinicTypes;
    console.log(data, 'dataaaaaaaaaaa')
    useEffect(() => {
        if (data) {
            setValue('name', data?.name)
            setValue('email', data?.email)
            setValue('phone', data?.phone)
            // if (data?.joiningDate) {
            //     const formattedJoiningDate = new Date(data.joiningDate)
            //         .toISOString()
            //         .split('T')[0]; // Format as YYYY-MM-DD
            //     setValue('joiningDate', formattedJoiningDate);
            // }

            setValue('designation', data?.designation)
            setValue('role', data?.role?._id)
            const formattedLeavingDate = data?.leavingDate
                ? new Date(data?.leavingDate).toISOString().split('T')[0]
                : '';

            setValue('leavingDate', formattedLeavingDate);
        }
    }, [data, setValue])

    const [updateId, setUpdateId] = useState(null);
    useEffect(() => {
        if (data?._id) {
            setUpdateId(data?._id)
        }
        const fields = {
            name: data?.firstName,
            email: data?.email,
            phone: data?.phone,
            joiningDate: data?.joiningDate,
            role: data?.role?._id,
            designation: data?.designation,
        };

        Object.entries(fields).forEach(([key, value]) => {
            if (value) setValue(key, value);
        });
    }, [data, setValue]);


    const password = watch('password');
    const confirmPassword = watch('confirmPassword');
    const designation = store?.getMastersDataReducer?.data?.clinicTypes;
    const onSubmit = (data) => {
        const payload = {
            id: updateId,
            firstName: data.name,
            email: data.email,
            password: data.password,
            phone: data?.phone,
            // reportingTo: createdBy,
            // createdById: createdBy,
            ...(data.leavingDate ? { leavingDate: data.leavingDate } : {}),// Add conditionally
            role: data.role,
        };
        dispatch(updateUserRolesAction({ key: `${encryptMessage(payload)}` }))
    };

    const handleSelect = (selectedList) => {
        const selectedIds = selectedList.map((item) => item._id);
        setSelectedPermissionIds(selectedIds);
    };

    const handleRemove = (selectedList) => {
        const selectedIds = selectedList.map((item) => item._id);
        setSelectedPermissionIds(selectedIds);
    };

    useEffect(() => {
        if (createResponse === 201) {
            reset();
            closeModal();
        }
    }, [createResponse]);

    return (
        <Modal centered show={show} onHide={closeModal}>
            <Modal.Body>
                <Row className="border-bottom mb-2 pb-2 d-flex align-items-center">
                    <Col sm={1}></Col>
                    <Col sm={10}>
                        <h4 className="mb-0 text-center">Update User</h4>
                    </Col>
                    <Col sm={1}>
                        <IoMdClose className="fs-4 cursor-pointer" onClick={closeModal} />
                    </Col>
                </Row>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row >
                        <Col sm={6}>
                            <Form.Group className='mb-2'>
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Name"
                                    {...register('name')}
                                />
                                {errors.name && <span className="text-danger">{errors.name.message}</span>}
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className='mb-2'>
                                <Form.Label>Email ID</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Email ID"
                                    {...register('email')}
                                />
                                {errors.email && <span className="text-danger">{errors.email.message}</span>}
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className='mb-2'>
                                <Form.Label>Contact No</Form.Label>
                                <Form.Control
                                    type="text"
                                    maxLength={10}
                                    placeholder="Contact No"
                                    {...register('phone')}
                                />
                                {errors.phone && <span className="text-danger">{errors.phone.message}</span>}
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className='mb-2'>
                                <Form.Label>Reporting</Form.Label>
                                <Form.Select disabled>
                                    <option>Reporting</option>
                                    <option value="">1</option>
                                    <option value="">2</option>
                                    <option value="">3</option>
                                </Form.Select>
                                {errors.phone && <span className="text-danger">{errors.phone.message}</span>}
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className='mb-2'>
                                <Form.Label>Date of Joining</Form.Label>
                                <Form.Control
                                    type="date"
                                    readOnly
                                    value={data?.joiningDate ? new Date(data.joiningDate).toISOString().split('T')[0] : ''}
                                    {...register('joiningDate')}
                                />

                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className='mb-2'>
                                <Form.Label>Date of Leaving</Form.Label>
                                <Form.Control
                                    type="date"
                                    {...register('leavingDate')}
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className='mb-2'>
                                <Form.Label>Designation <span className='text-danger'>*</span></Form.Label>
                                <Form.Select
                                    {...register('designation')}>
                                    <option value={''} key={''}>Designation</option>
                                    {designation?.map((data, i) => (
                                        <option key={data?._id} value={data?.name}>{data?.name}</option>
                                    ))}
                                </Form.Select>
                                {errors.phone && <span className="text-danger">{errors.phone.message}</span>}
                            </Form.Group>
                        </Col>
                        <Col sm={6} >
                            <Form.Group className='mb-2'>
                                <Form.Label>Role <span className='text-danger'>*</span></Form.Label>
                                <Form.Select
                                    {...register('role')}
                                    className='text-capitalize'>
                                    <option value='' key=''>Select role</option>
                                    {decryptedRolesData?.map((data) => (
                                        <option className='text-capitalize' value={data?._id} key={data?._id}>{data?.name}</option>
                                    ))}
                                </Form.Select>
                                {errors?.role && <span className='text-danger'>{errors?.role?.message}</span>}
                            </Form.Group>
                        </Col>
                    </Row>
                    {/* <hr className='my-1' /> */}

                    <Modal.Footer className='border-0'>
                        <Button className='custom-buttons' onClick={() => closeModal()}>Cancel</Button>
                        <Button type='submit' disabled={store?.updateUserRolesReducer?.loading} className='custom-buttons'>
                            {store?.updateUserRolesReducer?.loading ?
                                <Spinner color='white' className="spinner-border-sm" />
                                :
                                'Update user'
                            }
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default UpdateRoles;
