import React, { useEffect, useState, useRef } from 'react'
import { Col, Form, Row, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Spinner from '../../../../constants/Spinner';
import { useSelector, useDispatch } from 'react-redux';
import profileDummy from '../../../../assets/images/profileDummy.png'
import { getMastersDataAction } from '../../../../redux/settings/actions';
import { createClinicAction, getCitiesAction, getStatesByCountryAction } from '../../../../redux/clinics/actions';
import { VscLoading } from 'react-icons/vsc';
import { useNavigate } from 'react-router-dom';
import { FaDownload, FaPlus } from 'react-icons/fa';
import { CiCircleMinus, CiCirclePlus } from 'react-icons/ci';
import { FiDownloadCloud, FiMinus } from 'react-icons/fi';
import UploadToS3 from '../../../../helpers/uploads3';
const ClinicForm = ({ setActiveTab }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setError,
        clearErrors
    } = useForm();
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const navigate = useNavigate();
    const [selectedState, setSelectedState] = useState(null);
    const [medicalLicenses, setMedicalLicenses] = useState(null);
    const [stateOfLicensing, setStateOfLicensing] = useState(null);
    const [logo, setLogo] = useState(null);
    const [accreditationLogo, setAccreditationLogo] = useState(null);
    const [accreditationDetails, setAccreditationDetails] = useState([
        { name: '', documentNumber: '', file: null }
    ]);
    const [medicalDetails, setMedicalDetails] = useState([
        { name: '', documentNumber: '', file: null }
    ]);
    const [stateDetails, setStateDetails] = useState([
        { name: '', documentNumber: '', file: null }
    ]);
    const clinicTypeData = store?.getMastersDataReducer?.data?.clinicTypes;
    useEffect(() => {
        dispatch(getMastersDataAction({ status: true, category: 'clinic_type', search: '', limit: '' }));
        dispatch(getStatesByCountryAction());
    }, [dispatch]);


    const statesData = store?.getStatesReducer?.data;
    const cities = store?.getCitiesReducer?.data?.cities;
    const handleStateSelection = (e) => {
        // console.log(e.target.value)
        const parsedData = JSON.parse(e.target.value)
        setSelectedState(parsedData?._id);
        if (e) {
            dispatch(getCitiesAction({ state_code: parsedData?.stateCode }))
        }
    }

    const handleAddMultiple = () => {
        navigate('/apps/crm/addclinic?id=jandansjdajd')
    }

    const decryptedRolesData = store?.getRolesDataReducer?.data?.roles;

    const onSubmit = (data) => {
        // console.log(data, 'Received data');
        if (data.Password !== data.confirmPassword) {
            setError('confirmPassword', {
                type: 'manual',
                message: 'Passwords do not match',
            });
            return;
        }

        const clinicRoleId = decryptedRolesData && decryptedRolesData.find(role => role?.name === "clinic")?._id;
        const formData = new FormData();
        // Populate FormData with required fields based on schema
        formData.append('name', data?.clinicname || '');
        formData.append('email', data?.email || '');
        formData.append('password', data?.Password || ''); // Make sure to handle this securely on the backend
        formData.append('role', clinicRoleId || '');
        formData.append('phone', data?.contact || '');
        formData.append('phone2', data?.alternateContact || ''); // Add an alternate contact field if needed
        formData.append('clinicType', data?.clinicType || '');
        formData.append('taxIdOrEIN', data?.taxId || '');
        formData.append('npiNumber', data?.npi || '');
        formData.append('medicalLicenses', medicalLicenses || ''); // Handle as an array if needed
        formData.append('stateOfLicensing', stateOfLicensing || '');
        formData.append('accreditationDetails', data?.accreditation || '');
        formData.append('logo', logo || '');
        // Nested address fields
        formData.append('address[address1]', data?.address || '');
        formData.append('address[city]', data?.city || '');
        formData.append('address[state]', data?.state || '');
        formData.append('address[street]', data?.street || '');
        formData.append('address[zip]', data?.zip || '');

        // Logging for debugging
        for (let [key, value] of formData.entries()) {
            // console.log(`FormData entry - ${key}:`, value);
        }

        // Use formData in your API request
        dispatch(createClinicAction(formData));
    };

    const logoFileInputRef = useRef(null); // Reference to the logo file input
    const accreditationFileInputRef = useRef(null); // Reference to accreditation file input
    const medicalFileInputRef = useRef(null); // Reference to accreditation file input
    const stateFileInputRef = useRef(null); // Reference to accreditation file input

    // Trigger file input when image is clicked
    const handleLogoClick = () => {
        logoFileInputRef.current.click();
    };


    // Handle file selection
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setLogo(selectedFile); // Update state with the selected file
    };

    const handleAccreditationChange = (e, index) => {
        const selectedFile = e.target.files[0];
        setAccreditationDetails((prevDetails) => {
            const updatedDetails = [...prevDetails];
            updatedDetails[index] = {
                ...updatedDetails[index],
                file: selectedFile
            };
            return updatedDetails;
        });
    };
    const handleMedicalChange = (e, index) => {
        const selectedFile = e.target.files[0];
        setMedicalDetails((prevDetails) => {
            const updatedDetails = [...prevDetails];
            updatedDetails[index] = {
                ...updatedDetails[index],
                file: selectedFile
            };
            return updatedDetails;
        });
    };
    const handleStateChange = (e, index) => {
        const selectedFile = e.target.files[0];
        setStateDetails((prevDetails) => {
            const updatedDetails = [...prevDetails];
            updatedDetails[index] = {
                ...updatedDetails[index],
                file: selectedFile
            };
            return updatedDetails;
        });
    };

    // Handle accreditation input changes
    const handleAccreditationInputChange = (e, field, index) => {
        const value = e.target.value;
        setAccreditationDetails((prevDetails) => {
            const updatedDetails = [...prevDetails];
            updatedDetails[index] = {
                ...updatedDetails[index],
                [field]: value
            };
            return updatedDetails;
        });
    };
    const handleMedicalInputChange = (e, field, index) => {
        const value = e.target.value;
        setMedicalDetails((prevDetails) => {
            const updatedDetails = [...prevDetails];
            updatedDetails[index] = {
                ...updatedDetails[index],
                [field]: value
            };
            return updatedDetails;
        });
    };
    const handleStateInputChange = (e, field, index) => {
        const value = e.target.value;
        setStateDetails((prevDetails) => {
            const updatedDetails = [...prevDetails];
            updatedDetails[index] = {
                ...updatedDetails[index],
                [field]: value
            };
            return updatedDetails;
        });
    };

    // Add a new accreditation entry
    const handleAddAccreditation = () => {
        setAccreditationDetails([
            ...accreditationDetails,
            { name: '', documentNumber: '', file: null }
        ]);
    };
    const handleRemoveAccreditation = (index) => {
        setAccreditationDetails((prevDetails) => {
            const updatedDetails = prevDetails.filter((_, i) => i !== index);
            return updatedDetails;
        });
    };
    const handleAddMedical = () => {
        setMedicalDetails([
            ...medicalDetails,
            { name: '', documentNumber: '', file: null }
        ]);
    };
    const handleRemoveMedical = (index) => {
        setMedicalDetails((prevDetails) => {
            const updatedDetails = prevDetails.filter((_, i) => i !== index);
            return updatedDetails;
        });
    };
    const handleAddState = () => {
        setStateDetails([
            ...stateDetails,
            { name: '', documentNumber: '', file: null }
        ]);
    };
    const handleRemoveState = (index) => {
        setStateDetails((prevDetails) => {
            const updatedDetails = prevDetails.filter((_, i) => i !== index);
            return updatedDetails;
        });
    };
    // console.log(medicalDetails, 'medicalDetailsmedicalDetailsmedicalDetails');
    // console.log(accreditationDetails, 'accreditationDetailsaccreditationDetailsaccreditationDetails')
    return (
        <>
            <UploadToS3 />
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <Col sm={6}>
                        <Form.Group className="mb-2">
                            <Form.Label className='mb-1'>Clinic Name</Form.Label>
                            <Form.Control
                                type="text"
                                {...register('clinicname')}
                                placeholder="Clinic name" />
                            {/* {errors.clinicname && <span className="text-danger">{errors.clinicname.message}</span>} */}
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-2">
                            <Form.Label className='mb-1'>Clinic type</Form.Label>
                            <Form.Select
                                {...register('clinicType')}                        >
                                <option>Clinic type</option>
                                {clinicTypeData?.map((data) => (
                                    <option value={data?._id}>{data?.name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-2">
                            <Form.Label className='mb-1'>Email</Form.Label>
                            <Form.Control
                                type="email"
                                {...register('email')}
                                placeholder="Email" />
                            {/* {errors.email && <span className="text-danger">{errors.email.message}</span>} */}
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-2">
                            <Form.Label className='mb-1'>Tax ID / EIN</Form.Label>
                            <Form.Control
                                type="text"
                                {...register('taxId')}
                                placeholder="Tax ID / EIN" />
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-2">
                            <Form.Label className='mb-1'>Contact Person</Form.Label>
                            <Form.Control
                                type="text"
                                {...register('contact')}
                                placeholder="1234-234-234" />
                            {/* {errors.contact1 && <span className="text-danger">{errors.contact1.message}</span>} */}
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-2">
                            <Form.Label className='mb-1'>NPI Number</Form.Label>
                            <Form.Control
                                type="text"
                                {...register('npi')}
                                placeholder="NPI Number" />
                            {/* {errors.npi && <span className="text-danger">{errors.npi.message}</span>} */}
                        </Form.Group>
                    </Col>
                    <Col sm={12} className='mb-2 d-flex flex-column'>
                        <Form.Label>Logo</Form.Label>
                        <img
                            src={logo ? URL.createObjectURL(logo) : profileDummy}
                            alt="Upload icon"
                            className="upload-icon cursor-pointer "
                            style={{ cursor: 'pointer' }} // Change cursor to indicate clickable
                            onClick={handleLogoClick}
                        />
                        <Form.Control
                            type="file"
                            className="rounded-circle"
                            style={{ display: 'none' }}
                            ref={logoFileInputRef}
                            onChange={handleFileChange}
                        />
                    </Col>
                    <hr />
                    <Col sm={12}>
                        <Form.Label>
                            Accreditation Details&nbsp;
                            <span
                                onClick={handleAddAccreditation}
                                className='text-black fs-5 uil-plus-circle fw-bold cursor-pointer'>
                                {/* <CiCirclePlus size={20} /> */}
                            </span>
                        </Form.Label>
                    </Col>
                    {accreditationDetails.map((accreditation, index) => (
                        <React.Fragment key={index}>
                            <Col sm={4}>
                                <Form.Control
                                    type="text"
                                    value={accreditation.name}
                                    placeholder="Name"
                                    onChange={(e) => handleAccreditationInputChange(e, 'name', index)}
                                />
                            </Col>
                            <Col sm={4}>
                                <Form.Control
                                    type="text"
                                    value={accreditation.documentNumber}
                                    placeholder="Document Number"
                                    onChange={(e) => handleAccreditationInputChange(e, 'documentNumber', index)}
                                />
                            </Col>
                            <Col sm={4} className="mb-2 position-relative">
                                <div onClick={() => accreditationFileInputRef.current.click()}
                                    className=' custom-file-upload justify-content-between cursor-pointer'>
                                    {accreditation.file ? accreditation.file.name : 'Upload Document'}
                                    <p className='mb-0'><FiDownloadCloud /></p>
                                </div>
                                <Form.Control
                                    type="file"
                                    className="rounded-circle "
                                    style={{ display: 'none' }}
                                    ref={accreditationFileInputRef}
                                    onChange={(e) => handleAccreditationChange(e, index)}
                                />
                                <span
                                    onClick={() => handleRemoveAccreditation(index)}
                                    style={{ right: '-2%', top: '20%' }}
                                    className={`${accreditationDetails.length <= 1 ? 'd-none' : ''} uil-minus-circle cursor-pointer position-absolute fs-5 fw-bold text-danger`}>
                                    {/* <CiCircleMinus size={16} fontWeight={900} /> */}
                                </span>
                            </Col>

                        </React.Fragment>
                    ))}
                    <hr />
                    <Col sm={12}>
                        <Form.Label>
                            Medical Licenses&nbsp;
                            <span
                                onClick={handleAddMedical}
                                className='text-black fs-5 uil-plus-circle fw-bold cursor-pointer'>
                            </span>
                        </Form.Label>
                    </Col>
                    {medicalDetails.map((medical, index) => (
                        <React.Fragment key={index}>
                            <Col sm={4}>
                                <Form.Control
                                    type="text"
                                    value={medical.name}
                                    placeholder="Name"
                                    onChange={(e) => handleMedicalInputChange(e, 'name', index)}
                                />
                            </Col>
                            <Col sm={4}>
                                <Form.Control
                                    type="text"
                                    value={medical.documentNumber}
                                    placeholder="Document Number"
                                    onChange={(e) => handleMedicalInputChange(e, 'documentNumber', index)}
                                />
                            </Col>
                            <Col sm={4} className="mb-2 position-relative">
                                <div onClick={() => medicalFileInputRef.current.click()}
                                    className=' custom-file-upload justify-content-between cursor-pointer'>
                                    {medical.file ? medical.file.name : 'Upload Document'}
                                    <p className='mb-0'><FiDownloadCloud /></p>
                                </div>
                                <Form.Control
                                    type="file"
                                    className="rounded-circle "
                                    style={{ display: 'none' }}
                                    ref={medicalFileInputRef}
                                    onChange={(e) => handleMedicalChange(e, index)}
                                />
                                <span
                                    onClick={() => handleRemoveMedical(index)}
                                    style={{ right: '-2%', top: '20%' }}
                                    className={`${medicalDetails.length <= 1 ? 'd-none' : ''} uil-minus-circle cursor-pointer position-absolute fs-5 fw-bold text-danger`}>
                                </span>
                            </Col>

                        </React.Fragment>
                    ))}
                    <hr />
                    <Col sm={12}>
                        <Form.Label>
                            State of Licensing&nbsp;
                            <span
                                onClick={handleAddState}
                                className='text-black fs-5 uil-plus-circle fw-bold cursor-pointer'>
                            </span>
                        </Form.Label>
                    </Col>
                    {stateDetails.map((data, index) => (
                        <React.Fragment key={index}>
                            <Col sm={4}>
                                <Form.Control
                                    type="text"
                                    value={data.name}
                                    placeholder="Name"
                                    onChange={(e) => handleStateInputChange(e, 'name', index)}
                                />
                            </Col>
                            <Col sm={4}>
                                <Form.Control
                                    type="text"
                                    value={data.documentNumber}
                                    placeholder="Document Number"
                                    onChange={(e) => handleStateInputChange(e, 'documentNumber', index)}
                                />
                            </Col>
                            <Col sm={4} className="mb-2 position-relative">
                                <div onClick={() => stateFileInputRef.current.click()}
                                    className=' custom-file-upload justify-content-between cursor-pointer'>
                                    {data.file ? data.file.name : 'Upload Document'}
                                    <p className='mb-0'><FiDownloadCloud /></p>
                                </div>
                                <Form.Control
                                    type="file"
                                    className="rounded-circle "
                                    style={{ display: 'none' }}
                                    ref={stateFileInputRef}
                                    onChange={(e) => handleStateChange(e, index)}
                                />
                                <span
                                    onClick={() => handleRemoveState(index)}
                                    style={{ right: '-2%', top: '20%' }}
                                    className={`${stateDetails.length <= 1 ? 'd-none' : ''} uil-minus-circle cursor-pointer position-absolute fs-5 fw-bold text-danger`}>
                                </span>
                            </Col>

                        </React.Fragment>
                    ))}
                    <hr />
                    <Col sm={12}>
                        <Row>
                            <Col sm={12} className='mb-2'>
                                <span className='text-black fw-semibold'>Address Details</span>
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
                                                onChange={(e) => handleStateSelection(e)}>
                                                <option>State</option>
                                                {statesData?.states?.map((data) => (
                                                    <option
                                                        value={JSON.stringify({ _id: data?._id, stateCode: data?.state_code })}
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
                                            {
                                                store?.getCitiesReducer?.loading ?
                                                    <Row>
                                                        <Col sm={12}>
                                                            <Spinner className='fs-5' />
                                                        </Col>
                                                    </Row>
                                                    :
                                                    <Form.Select
                                                        {...register('city')}>
                                                        <option>{store?.getCitiesReducer?.loading ? 'Loading...' : 'City'}</option>
                                                        {cities?.map((data) => (
                                                            <option value={data?._id}>{data?.name}</option>
                                                        ))}
                                                    </Form.Select>
                                            }
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
                    <Col md={12} className='mt-2 d-flex gap-2 justify-content-end'>
                        <Button variant="primary" onClick={handleAddMultiple} className='custom-buttons'>
                            Add Multiple
                        </Button>
                        <Button variant="primary" type="submit" disabled={store?.createClinicsReducer?.loading} className='custom-buttons'>
                            {store?.createClinicsReducer?.loading ?
                                <Spinner className="spinner-border-sm" />
                                :
                                'Save'
                            }
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    );
}

export default ClinicForm;