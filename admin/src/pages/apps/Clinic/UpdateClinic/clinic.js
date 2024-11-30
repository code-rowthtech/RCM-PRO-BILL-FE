// src/components/Clinic.js

import React, { useEffect, useRef, useState } from 'react';
import { Col, Form, Row, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FiDownloadCloud } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { handleUpload } from '../../../../helpers/HandleUpload';
import us from '../../../../assets/images/flags/us.jpg'
import ToastHandle from '../../../../helpers/ToastMessage';
import { getCitiesAction, updateClinicAction } from '../../../../redux/actions';
import Spinner from '../../../../constants/Spinner';
import { encryptMessage } from '../../../../cryptoUtils';
import { handleFirstSpace } from '../../../../helpers/noBeginningSpace';

const Clinic = ({ id }) => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    const logoFileInputRef = useRef(null);
    const [logoName, setLogoName] = useState('');
    const [logo, setLogo] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);

    const store = useSelector((state) => state);
    const clinicData = store?.getClinicByIdReducer?.data?.clinic;
    const clinicTypeData = store?.getMastersDataReducer?.data?.clinicTypes;
    const statesData = store?.getStatesReducer?.data;
    const cities = store?.getCitiesReducer?.data?.cities;
    const [formDetails, setFormDetails] = useState({
        accreditationDetails: [{ name: '', number: '', url: null, fileName: '' }],
        medicalDetails: [{ name: '', number: '', url: null, fileName: '' }],
        stateDetails: [{ name: '', number: '', url: null, fileName: '' }],
    });
    const [posDetails, setPosDetails] = useState([
        { name: '', email: '', role: '', contact: '' }
    ])
    console.log(clinicData)
    useEffect(() => {
        setFormDetails((prevDetails) => ({
            ...prevDetails,
            accreditationDetails: clinicData?.accreditationDetails || prevDetails.accreditationDetails,
            medicalDetails: clinicData?.medicalLicenses || prevDetails.medicalDetails,
            stateDetails: clinicData?.stateOfLicensing || prevDetails.stateDetails,
        }));
        setPosDetails(clinicData?.pos || []);

    }, [clinicData]);

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

    const handleInputChange = (e, field, type, index) => {
        const value = e.target.value;
        setFormDetails((prevDetails) => {
            const updatedDetails = { ...prevDetails };
            updatedDetails[type][index] = {
                ...updatedDetails[type][index],
                [field]: value,
            };
            return updatedDetails;
        });
    };

    const handleFileUpload = async (e, type, index) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile);
            setFormDetails((prevDetails) => {
                const updatedDetails = { ...prevDetails };
                updatedDetails[type][index] = {
                    ...updatedDetails[type][index],
                    url: url?.url?.split('?')[0],
                    fileName: selectedFile.name,
                };
                return updatedDetails;
            });
        } catch (error) {
            console.error('Error during file upload:', error);
        }
    };

    const handleAddField = (type) => {
        setFormDetails((prevDetails) => ({
            ...prevDetails,
            [type]: [...prevDetails[type], { name: '', number: '', url: null, fileName: '' }],
        }));
    };

    const handleRemoveField = (type, index) => {
        setFormDetails((prevDetails) => ({
            ...prevDetails,
            [type]: prevDetails[type].filter((_, i) => i !== index),
        }));
    };

    const dispatch = useDispatch()
    const handleStateSelection = (e) => {
        setSelectedState(e.target.value)
        const selectedState = JSON.parse(e.target.value);
        dispatch(getCitiesAction({ state_code: selectedState.id, name: '', limit: 25 }));
    };

    const handleCitySelection = (e) => {
        const value = e.target.value;
        if (value) {
            try {
                const citySelected = JSON.parse(value);
                setSelectedCity(citySelected);
            } catch (error) {
                console.error('Invalid JSON:', value);
            }
        }
    };


    const setField = (key, value) => value && setValue(key, value);

    useEffect(() => {
        setField('clinicType', clinicData?.clinicType);
        setField('contact', clinicData?.userId?.phone);
        setField('name', clinicData?.name);
        setField('taxId', clinicData?.taxIdOrEIN);
        setField('npi', clinicData?.npiNumber);
        setField('email', clinicData?.userId?.email);
        setField('address', clinicData?.userId?.address?.address1);
        setField('street', clinicData?.userId?.address?.street);
        setField('zip', clinicData?.userId?.address?.zip);
        if (clinicData?.logo) {
            setLogoName(clinicData?.logo?.fileName)
        }
        const stateName = clinicData?.userId?.address?.state;
        if (stateName) {
            const matchingState = statesData?.states?.find(
                (state) => state.name === stateName
            );
            if (matchingState) {
                setValue('stateName', JSON.stringify({
                    name: matchingState?.name,
                    state_code: matchingState?.state_code,
                    id: matchingState?.id,
                    _id: matchingState?._id,
                }));
            }
        }

    }, [clinicData, statesData, setValue]);

    const onSubmit = (data) => {
        const newPayload = {
            name: data?.name || clinicData?.name, // Clinic name
            // email: data?.email.toLowerCase() || clinicData?.userId?.email.toLowerCase(), // Email
            ...(data?.email.toLowerCase() !== clinicData?.userId?.email.toLowerCase() && {
                email: data?.email.toLowerCase() || clinicData?.userId?.email.toLowerCase(),
            }),
            phone: data?.contact || clinicData?.userId?.phone, // Phone number
            clinicType: data?.clinicType || clinicData?.clinicType, // Clinic Type
            taxIdOrEIN: data?.taxId || clinicData?.taxIdOrEIN, // Tax ID/EIN
            npiNumber: data?.npi || clinicData?.npiNumber, // NPI number
            medicalLicenses: formDetails.medicalDetails || clinicData?.medicalLicenses, // Medical Licenses
            stateOfLicensing: formDetails.stateDetails || clinicData?.stateOfLicensing, // State Licensing
            accreditationDetails: formDetails.accreditationDetails || clinicData?.accreditationDetails, // Accreditation Details
            logo: logo?.url?.split('?')[0] || clinicData?.logo, // Logo
            logo: {
                url: logo?.url.split('?')[0],
                fileName: logoName
            },
            id: id || clinicData?._id, // Clinic ID
            address: {
                address1: data?.address || clinicData?.userId?.address?.address1, // Address 1
                city: selectedCity?._id || clinicData?.userId?.address?.city, // City ID
                state: JSON.parse(selectedState)?._id || clinicData?.userId?.address?.state, // State ID
                street: data?.street || clinicData?.userId?.address?.street, // Street
                zip: data?.zip || clinicData?.userId?.address?.zip, // Zip Code
                latitude: selectedCity?.latitude || clinicData?.userId?.address?.latitude, // Latitude
                longitude: selectedCity?.longitude || clinicData?.userId?.address?.longitude, // Longitude
            },
            pos: posDetails,
        };

        console.log(newPayload, 'newPayload');
        dispatch(updateClinicAction({ key: encryptMessage(newPayload) }));
    };

    const handleAddPOS = () => {
        const isIncomplete = posDetails.some(
            (pos) =>
                !pos.name || !pos.role || !pos.contact || !pos.email
        );

        if (isIncomplete) {
            // Show a toast message if any field is incomplete
            ToastHandle('Please fill all the fields before adding a new one', 'danger');
            return;
        }
        setPosDetails([
            ...posDetails,
            { name: '', email: '', role: null, contact: '' }
        ]);
    };
    const handleRemovePOS = (index) => {
        setPosDetails((prevDetails) => {
            const updatedDetails = prevDetails.filter((_, i) => i !== index);
            return updatedDetails;
        });
    };

    const handlePOSInputChange = (e, field, index) => {
        const value = e.target.value;
        setPosDetails((prevDetails) => {
            const updatedDetails = [...prevDetails];
            updatedDetails[index] = {
                ...updatedDetails[index],
                [field]: value
            };
            return updatedDetails;
        });
    };
    return (
        <>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    {/* Clinic Name Field */}
                    <Col sm={6}>
                        <Form.Group className="mb-2">
                            <Form.Label className="mb-1">
                                Clinic Name <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                placeholder="Enter clinic name"
                                {...register('name', { required: 'This field is required' })}
                                onKeyPress={handleFirstSpace}
                            />
                            {errors.name && <span className="text-danger">{errors.name.message}</span>}
                        </Form.Group>

                    </Col>

                    {/* Clinic Type Field */}
                    <Col sm={6}>
                        <Form.Group className="mb-2">
                            <Form.Label className="mb-1">Clinic Type <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                {...register('clinicType', { required: 'This field is required' })}
                            >
                                <option value="">Select clinic type</option>
                                {clinicTypeData?.map((data) => (
                                    <option key={data?._id} value={data?.name}>{data?.name}</option>
                                ))}
                            </Form.Select>
                            {errors.clinicType && <span className="text-danger">{errors.clinicType.message}</span>}
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-2">
                            <Form.Label className='mb-1'>Email ID <span className='text-danger'>*</span></Form.Label>
                            <Form.Control
                                type="text"
                                {...register('email', {
                                    required: 'This field is required',
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Regex for email validation
                                        message: 'Please enter a valid email address'
                                    }
                                })}
                                placeholder="Email ID"
                            />

                            {errors.email && <span className="text-danger">{errors.email.message}</span>}
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-2">
                            <Form.Label className='mb-1'>Tax ID / EIN</Form.Label>
                            <Form.Control
                                type="text"
                                {...register('taxId', {
                                    minLength: {
                                        value: 9,
                                        message: 'Tax ID / EIN must be at least 9 characters long', // Error message
                                    },
                                })}
                                // defaultValue={updatePage ? clinicDataToUpdate?.taxIdOrEIN : ''}
                                onKeyPress={(event) => handleFirstSpace(event, 0)}
                                maxLength={9}
                                placeholder="Tax ID / EIN" />
                            {errors.taxId && <span className="text-danger">{errors.taxId.message}</span>}
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-0 position-relative">
                            <Form.Label className='mb-1'>Contact Person <span className='text-danger'>*</span></Form.Label>
                            <Form.Control
                                type="text"
                                defaultValue={clinicData?.userId?.phone}
                                style={{ paddingLeft: '5.5%' }}
                                {...register('contact', {
                                    required: 'This field is required',
                                    pattern: {
                                        value: /^[0-9]*$/,
                                        message: 'Contact must be a number'
                                    },
                                    maxLength: {
                                        value: 10,
                                        message: 'Contact must not exceed 10 digits'
                                    },
                                    minLength: {
                                        value: 10,
                                        message: 'Contact must not be less than 10 digits '
                                    }
                                })}
                                placeholder="1234-234-234"
                                maxLength={10}
                            />
                            <div
                                className='position-absolute' style={{ top: '52%', left: '1%' }}
                            >
                                <img
                                    src={us}
                                    alt="country code flag"
                                    width={20} />
                            </div>


                        </Form.Group>
                        {errors.contact && <span className="text-danger">{errors.contact.message}</span>}
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-2">
                            <Form.Label className='mb-1'>NPI Number</Form.Label>
                            <Form.Control
                                defaultValue={clinicData?.npiNumber}
                                type="text"
                                {...register('npi')}
                                placeholder="NPI Number" />
                            {/* {errors.npi && <span className="text-danger">{errors.npi.message}</span>} */}
                        </Form.Group>
                    </Col>
                    <Col sm={6} className='mb-2 d-flex flex-column position-relative'>
                        <Form.Label>Upload Logo</Form.Label>
                        <div onClick={handleLogoClick}
                            className={`custom-file-upload justify-content-between cursor-pointer ${logoName ? 'form-control' : 'custom-form-fields'}`}>
                            {logoName ? logoName : 'Upload Document'}
                            <p className='mb-0'><FiDownloadCloud /></p>
                        </div>
                        <Form.Control
                            type="file"
                            className="rounded-circle"
                            style={{ display: 'none' }}
                            // {...register('logoimage', { required: 'This field is required' })}
                            ref={logoFileInputRef}
                            accept=".png, .jpg, .jpeg, .svg" // Allow only specific file types
                            onChange={handleFileChange}
                        />
                        {/* {errors.logoimage && <span className="text-danger">{errors.logoimage.message}</span>} */}
                    </Col>
                    <hr />
                    {/* Dynamic Fields Section */}
                    {['accreditationDetails', 'medicalDetails', 'stateDetails'].map((type) => (
                        <React.Fragment key={type}>
                            <Col sm={12}>
                                <Form.Label>
                                    {type === 'accreditationDetails'
                                        ? 'Accreditation Details'
                                        : type === 'stateDetails'
                                            ? 'State of Licensing'
                                            : 'Medical Details'}
                                    <span
                                        onClick={() => {
                                            // Check if all the required fields are filled before allowing adding a new field
                                            const allFieldsFilled = formDetails[type].every(item => item.name && item.number && item.url);
                                            if (!allFieldsFilled) {
                                                ToastHandle('Please fill all the fields before adding a new one', 'danger');
                                                return;  // Prevent adding a new field
                                            }
                                            handleAddField(type);  // Add new field if validation passes
                                        }}
                                        className="fs-5 uil-plus-circle plusicon ms-1 fw-bold cursor-pointer"
                                    >
                                        {/* Add Icon */}
                                    </span>
                                </Form.Label>
                            </Col>
                            {formDetails[type].map((item, index) => (
                                <React.Fragment key={index}>
                                    {type === 'stateDetails' ? (
                                        <Col sm={4}>
                                            <Form.Select
                                                onChange={(e) => handleInputChange(e, 'name', type, index)}
                                            >
                                                <option value="">Select State</option>
                                                {statesData?.states?.map((data) => (
                                                    <option
                                                        key={data?._id}
                                                        value={data?.name}
                                                    >
                                                        {data?.name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Col>
                                    ) : (
                                        <Col sm={4}>
                                            <Form.Control
                                                type="text"
                                                value={item.name}
                                                placeholder="Name"
                                                onChange={(e) => handleInputChange(e, 'name', type, index)}
                                            />
                                        </Col>
                                    )}
                                    <Col sm={4}>
                                        <Form.Control
                                            type="text"
                                            value={item.number}
                                            placeholder="Document Number"
                                            onKeyPress={(event) => handleFirstSpace(event, 0)}
                                            onChange={(e) => handleInputChange(e, 'number', type, index)}
                                        />
                                    </Col>
                                    <Col sm={4} className="mb-2 position-relative">
                                        <div
                                            onClick={() => document.getElementById(`fileInput-${type}-${index}`).click()}
                                            className={`custom-file-upload justify-content-between cursor-pointer ${item.url ? 'form-control' : 'custom-form-fields'}`}
                                        >
                                            {item.url ? item.url?.slice(0, 35) + '...' : 'Upload Document'}
                                            <p className="mb-0"><FiDownloadCloud /></p>
                                        </div>
                                        <Form.Control
                                            id={`fileInput-${type}-${index}`}
                                            type="file"
                                            style={{ display: 'none' }}
                                            onChange={(e) => handleFileUpload(e, type, index)}
                                        />

                                        <span
                                            onClick={() => handleRemoveField(type, index)}
                                            className={`${formDetails[type].length > 1 ? '' : 'd-none'} uil-minus-circle cursor-pointer position-absolute fs-5 fw-bold text-danger`}
                                            style={{ right: '-0.5%', top: '20%', zIndex: '111' }}
                                        >
                                            {/* Remove Icon */}
                                        </span>
                                    </Col>
                                </React.Fragment>
                            ))}
                            <hr />
                        </React.Fragment>
                    ))}

                    <Col sm={12}>
                        <Row>
                            <Col sm={12} className='mb-2'>
                                <span className='text-black form-label fw-semibold'>Address Details</span>
                            </Col>
                            <Col sm={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label className='mb-1'>Address 1</Form.Label>
                                    <Form.Control
                                        as={'textarea'}
                                        rows={5}
                                        {...register('address')}
                                        placeholder="Address 1" />
                                    {/* {errors.address1 && <span className="text-danger">{errors.address1.message}</span>} */}
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Row>
                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className='mb-1'>State</Form.Label>
                                            <Form.Select
                                                // defaultValue={clinicData?.userId?.address?.state}
                                                {...register('stateName')}
                                                onChange={(e) => handleStateSelection(e)}
                                            >
                                                <option value=''>State</option>
                                                {statesData?.states?.map((data) => (
                                                    <option
                                                        key={data?.state_code}
                                                        value={JSON.stringify({
                                                            name: data?.name,
                                                            state_code: data?.state_code,
                                                            id: data?.id,
                                                            _id: data?._id,
                                                        })}
                                                    >
                                                        {data?.name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>

                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className='mb-1'>City</Form.Label>
                                            {/* {
                                                store?.getCitiesReducer?.loading ?
                                                    <Row>
                                                        <Col sm={12}>
                                                            <Spinner className='fs-5' />
                                                        </Col>
                                                    </Row>
                                                    : */}
                                            <Form.Select
                                                {...register('city')}
                                                onChange={(e) => handleCitySelection(e)}
                                                defaultValue={clinicData?.userId?.address?.city}
                                            >
                                                <option>{store?.getCitiesReducer?.loading ? 'Loading...' : 'City'}</option>
                                                {cities?.map((data) => (
                                                    <option key={data?._id} value={JSON.stringify({ _id: data?._id, name: data?.name, latitude: data?.latitude, longitude: data?.longitude })}>
                                                        {data?.name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            {/* } */}
                                        </Form.Group>
                                    </Col>

                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className='mb-1'>Street</Form.Label>
                                            <Form.Control
                                                type="text"
                                                {...register('street')}
                                                placeholder="Street" />
                                            {/* {errors.street && <span className="text-danger">{errors.street.message}</span>} */}
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className='mb-1'>Zip</Form.Label>
                                            <Form.Control
                                                type="text"
                                                {...register('zip')}
                                                placeholder="Zip" />
                                            {/* {errors.zip && <span className="text-danger">{errors.zip.message}</span>} */}
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                    <hr />
                    <Col sm={12}>
                        <Row>
                            <Col sm={12} className="mb-2">
                                <span className="text-black fw-semibold form-label  ">
                                    POC (Point of contact)
                                    <span
                                        onClick={handleAddPOS}
                                        className="plusicon ms-1 fs-5 uil-plus-circle fw-bold cursor-pointer">
                                    </span>
                                </span>
                            </Col>
                            {posDetails.map((data, index) => (
                                <React.Fragment key={index}>
                                    <Col sm={12} className='form-label'>
                                        {'POS ' + `${index + 1}`}
                                        <span
                                            onClick={() => handleRemovePOS(index)}
                                            className={`${posDetails.length <= 1 ? 'd-none' : ''} uil-minus-circle cursor-pointer  fs-5 fw-bold text-danger`}>
                                        </span>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className="mb-1">Full Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => handlePOSInputChange(e, 'name', index)}
                                                placeholder="Full Name"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className="mb-1">Contact Email</Form.Label>
                                            <Form.Control
                                                type="email"
                                                value={data.email}
                                                {...register('contactemail', {
                                                    pattern: {
                                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Regex for email validation
                                                        message: 'Please enter a valid email address'
                                                    }
                                                })}
                                                onChange={(e) => handlePOSInputChange(e, 'email', index)}
                                                placeholder="Contact Email"
                                            />
                                            {errors.contactemail && <span className="text-danger">{errors.contactemail.message}</span>}

                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className="mb-1">Job Title / Role</Form.Label>
                                            <Form.Control
                                                type='text'
                                                value={data?.role}
                                                placeholder='Job Title / Role'
                                                onChange={(e) => handlePOSInputChange(e, 'role', index)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className="mb-1">Phone Number</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={data.contact}
                                                onChange={(e) => handlePOSInputChange(e, 'contact', index)}
                                                placeholder="Phone Number"
                                                maxLength={10}
                                            />
                                        </Form.Group>
                                    </Col>
                                </React.Fragment>
                            ))}
                        </Row>

                    </Col>
                </Row>
                <Row>
                    <Col className='text-end'>
                        <Button type="submit" disabled={store?.updateClinicsReducer?.loading} className="mt-3">
                            {store?.updateClinicsReducer?.loading ?
                                <Spinner color='white' className='spinner-border-sm' />
                                :
                                'Update'
                            }
                        </Button>
                    </Col>
                </Row>
            </Form >
        </>

    );
};

export default Clinic;
