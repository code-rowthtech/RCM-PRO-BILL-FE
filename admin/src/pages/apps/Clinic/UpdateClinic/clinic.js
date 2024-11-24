import React, { useRef, useState } from 'react';
import { Col, Form, Row, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FiDownloadCloud } from 'react-icons/fi';
import { handleUpload } from '../../../../helpers/HandleUpload';

const Clinic = () => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    const logoFileInputRef = useRef(null);
    const [logoName, setLogoName] = useState('');
    const [logo, setLogo] = useState(null); // Store the uploaded logo URL (optional)

    const formFields = [
        {
            label: 'Clinic Name',
            placeholder: 'Enter clinic name',
            name: 'name',
            validation: { required: 'Clinic name is required' },
        },
        {
            label: 'Email',
            placeholder: 'Enter email',
            name: 'email',
            validation: {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email format' },
            },
        },
        {
            label: 'Contact Person',
            placeholder: 'Enter contact person name',
            name: 'contact',
            validation: { required: 'Contact person name is required' },
        },
    ];

    const handleLogoClick = () => {
        if (logoFileInputRef.current) {
            logoFileInputRef.current.click();
        }
    };

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile); // Assume handleUpload returns the uploaded file URL
            setLogo(url);
            setLogoName(selectedFile?.name);

            // Update the form value for validation purposes
            setValue('logo', url, { shouldValidate: true });
        } catch (error) {
            console.error('Error during file upload:', error);
        }
    };

    const onSubmit = (data) => {
        console.log('Form Data:', data);
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
                {formFields.map((field, index) => (
                    <Col sm={6} key={index}>
                        <Form.Group>
                            <Form.Label className="mb-0 mt-2">
                                {field.label} <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                placeholder={field.placeholder}
                                {...register(field.name, field.validation)}
                                isInvalid={!!errors[field.name]}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors[field.name]?.message}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                ))}

                {/* Logo Upload Field */}
                <Col sm={6} className="mb-2 d-flex flex-column position-relative">
                    <Form.Label>Logo</Form.Label>
                    <div
                        onClick={handleLogoClick}
                        className={`custom-file-upload justify-content-between cursor-pointer ${logoName ? '' : 'custom-form-fields'
                            }`}
                    >
                        {logoName ? logoName : 'Upload Document'}
                        <p className="mb-0">
                            <FiDownloadCloud />
                        </p>
                    </div>
                    <Form.Control
                        type="file"
                        style={{ display: 'none' }}
                        ref={logoFileInputRef} // Assign the ref here
                        accept=".png, .jpg, .jpeg, .svg"
                        onChange={handleFileChange} // Register not required here
                    />
                    {errors.logo && (
                        <span className="text-danger">{errors.logo.message}</span>
                    )}
                </Col>
            </Row>
            <Button type="submit" className="mt-3">
                Submit
            </Button>
        </Form>
    );
};

export default Clinic;
