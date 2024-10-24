import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import Multiselect from "multiselect-react-dropdown";
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';

const UpdateRole = ({ show, closeModal, data }) => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    // Update form values when `data` changes
    useEffect(() => {
        if (data) {
            setValue('name', data.name || '');
            setValue('description', data.description || '');
        }
    }, [data, setValue]);

    const onSubmit = (formData) => {
        console.log('Updated data:', formData);
        closeModal();
    };

    return (
        <Modal show={show} onHide={closeModal}>
            <Modal.Header
                onHide={closeModal}
                closeButton
                className={'modal-colored-header pb-0 border-0 text-center'}>
            </Modal.Header>
            <Modal.Body>
                <h4 className="mt-0 text-center">Update Role</h4>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col md={12}>
                            <Form.Group className="mb-2">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter role name"
                                    {...register('name', { required: 'Name is required' })}
                                />
                                {errors.name && <span className="text-danger">{errors.name.message}</span>}
                            </Form.Group>
                        </Col>

                        <Col md={12}>
                            <Form.Group className="mb-2">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Enter role description"
                                    {...register('description', { required: 'Description is required' })}
                                />
                                {errors.description && <span className="text-danger">{errors.description.message}</span>}
                            </Form.Group>
                        </Col>
                        <Col md={12}>
                            <Form.Group className="mb-2">
                                <Form.Label>Permissions</Form.Label>
                                <Multiselect
                                    // options={decryptedPermissionsData}
                                    displayValue="name"
                                    className="form-control p-0"
                                    placeholder="Select Permissions"
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Modal.Footer>
                        <Button type='submit' className='grayish-buttons'>
                            Update
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default UpdateRole;
