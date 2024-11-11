import React, { useEffect, useState, useRef } from 'react'
import { Col, Form, Row, Button, Table } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Spinner from '../../../../constants/Spinner';
import { useSelector, useDispatch } from 'react-redux';
import profileDummy from '../../../../assets/images/profileDummy.png'
import { getMastersDataAction } from '../../../../redux/settings/actions';
import { createClinicAction, getCitiesAction, getClinicById, getClinicByParentAction, getStatesByCountryAction } from '../../../../redux/clinics/actions';
import { VscLoading } from 'react-icons/vsc';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaDownload, FaPlus } from 'react-icons/fa';
import { CiCircleMinus, CiCirclePlus } from 'react-icons/ci';
import { FiDownloadCloud, FiMinus } from 'react-icons/fi';
import UploadToS3 from '../../../../helpers/uploads3';
import { handleUpload } from '../../../../helpers/HandleUpload';
import { encryptMessage } from '../../../../cryptoUtils';
const ClinicForm = ({ setActiveTab, setClinicId, clinicId }) => {
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
    const [searchParams] = useSearchParams();
    const updateId = searchParams.get('updateid');
    const [updatePage, setUpdatePage] = useState(false);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [medicalLicenses, setMedicalLicenses] = useState(null);
    const [stateOfLicensing, setStateOfLicensing] = useState(null);
    const [logo, setLogo] = useState(null);
    const [accreditationLogo, setAccreditationLogo] = useState(null);
    const [addType, setAddType] = useState('')
    // const [clinicId, setClinicId] = useState(null);
    const [accreditationDetails, setAccreditationDetails] = useState([
        { name: '', number: '', url: null, fileName: '' }
    ]);
    const [medicalDetails, setMedicalDetails] = useState([
        { name: '', number: '', url: null, fileName: '' }
    ]);
    const [stateDetails, setStateDetails] = useState([
        { name: '', number: '', url: null, fileName: '' }
    ]);
    const [nextClicked, setNextClicked] = useState(false);
    const clinicTypeData = store?.getMastersDataReducer?.data?.clinicTypes;
    const createResponse = store?.createClinicsReducer?.data?.status;
    const clinicDataToUpdate = store?.getClinicByIdReducer?.data?.clinic;
    const clinicsList = store?.getClinicsByParentReducer?.data?.data;
    useEffect(() => {
        if (clinicId) {
            const payload = {
                parentClinic: clinicId,
            }
            dispatch(getClinicByParentAction({ key: encryptMessage(payload) }));
        }
    }, [clinicId])
    useEffect(() => {
        if (createResponse === 200) {
            reset();
            if (clinicsList?.length > 0) {
                const payload = {
                    parentClinic: clinicsList[0]?._id,
                }
                dispatch(getClinicByParentAction({ key: encryptMessage(payload) }));
            } else {
                setClinicId(store?.createClinicsReducer?.data?.data?._id);
            }
        }
        if (createResponse === 200 && nextClicked === true) {
            setActiveTab('billing');
        }
        if (store?.createClinicsReducer?.data) {
            // setMultipleData(store?.createClinicsReducer?.data?.data);
        }
    }, [createResponse])
    useEffect(() => {
        if (updateId) {
            dispatch(getClinicById({ key: encryptMessage({ id: updateId }) }))
            setUpdatePage(true)
        }
        dispatch(getMastersDataAction({ status: true, category: 'clinic_type', search: '', limit: '' }));
        dispatch(getStatesByCountryAction());
    }, [dispatch, updateId, createResponse === 200]);
    const statesData = store?.getStatesReducer?.data;
    const cities = store?.getCitiesReducer?.data?.cities;
    const handleStateSelection = (e) => {
        setSelectedState(e.target.value)
        try {
            const selectedState = JSON.parse(e.target.value);
            if (selectedState?.state_code) {
                dispatch(getCitiesAction({ state_code: selectedState.id }));
            }
        } catch (error) {
            console.error('Error parsing selected state:', error);
        }
    };
    const handleCitySelection = (e) => {
        const citySelected = JSON.parse(e.target.value);
        setSelectedCity(citySelected)
    }

    const decryptedRolesData = store?.getRolesDataReducer?.data?.roles;
    const onSubmit = (data) => {
        if (data.Password !== data.confirmPassword) {
            setError('confirmPassword', {
                type: 'manual',
                message: 'Passwords do not match',
            });
            return;
        }
        const clinicRoleId = decryptedRolesData && decryptedRolesData.find(role => role?.name === "clinic")?._id;
        const payload = {
            ...(clinicsList && { parentClinic: clinicId }),
            name: data?.clinicname,
            email: data?.email,
            role: clinicRoleId,
            phone: data?.contact,
            clinicType: data?.clinicType,
            taxIdOrEIN: data?.taxId,
            npiNumber: data?.npi,
            medicalLicenses: medicalDetails,
            stateOfLicensing: stateDetails,
            accreditationDetails: accreditationDetails,
            logo: logo,
            address: {
                address1: data?.address,
                city: selectedCity?._id,
                state: selectedState?._id,
                street: data?.street,
                zip: data?.zip,
                latitude: selectedCity?.latitude,
                longitude: selectedCity?.longitude,
            }
        }
        dispatch(createClinicAction({ key: encryptMessage(payload) }))
    };
    const logoFileInputRef = useRef(null);
    const accreditationFileInputRef = useRef(null);
    const medicalFileInputRef = useRef(null);
    const stateFileInputRef = useRef(null);
    const handleLogoClick = () => {
        logoFileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile);
            setLogo(url);
        } catch (error) {
            console.error('Error during file upload:', error);
        }
    };

    const handleAccreditationChange = async (e, index) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile);
            setAccreditationDetails((prevDetails) => {
                const updatedDetails = [...prevDetails];
                updatedDetails[index] = {
                    ...updatedDetails[index],
                    url: url,
                    fileName: selectedFile.name,
                };
                return updatedDetails;
            });
        } catch (error) {
            console.error('Error during file upload:', error);
        }
    };

    const handleStateChange = async (e, index) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile);
            setStateDetails((prevDetails) => {
                const updatedDetails = [...prevDetails];
                updatedDetails[index] = {
                    ...updatedDetails[index],
                    url: url,
                    fileName: selectedFile.name,

                };
                return updatedDetails;
            });
        } catch (error) {
            console.error('Error during file upload:', error);
        }
    };

    const handleMedicalChange = async (e, index) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile);
            setMedicalDetails((prevDetails) => {
                const updatedDetails = [...prevDetails];
                updatedDetails[index] = {
                    ...updatedDetails[index],
                    url: url,
                    fileName: selectedFile.name,

                };
                return updatedDetails;
            });
        } catch (error) {
            console.error('Error during file upload:', error);
        }
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

    const handleAddAccreditation = () => {
        setAccreditationDetails([
            ...accreditationDetails,
            { name: '', number: '', url: null }
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
            { name: '', number: '', url: null }
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
            { name: '', number: '', url: null }
        ]);
    };

    const handleRemoveState = (index) => {
        setStateDetails((prevDetails) => {
            const updatedDetails = prevDetails.filter((_, i) => i !== index);
            return updatedDetails;
        });
    };
    return (
        <>
            {/* <UploadToS3 /> */}
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <Col sm={6}>
                        {clinicId}
                        <Form.Group className="mb-2">
                            <Form.Label className='mb-1'>Clinic Name</Form.Label>
                            <Form.Control
                                type="text"
                                {...register('clinicname')}
                                defaultValue={updatePage ? clinicDataToUpdate?.name : ''}
                                placeholder="Clinic name" />
                            {/* {errors.clinicname && <span className="text-danger">{errors.clinicname.message}</span>} */}
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-2">
                            <Form.Label className='mb-1'>Clinic type</Form.Label>
                            <Form.Select
                                defaultValue={updatePage ? clinicDataToUpdate?.clinicType?._id : ''}
                                {...register('clinicType')}                        >
                                <option>Clinic type</option>
                                {clinicTypeData?.map((data) => (
                                    <option key={data?._id} value={data?.name}>{data?.name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-2">
                            <Form.Label className='mb-1'>Email</Form.Label>
                            <Form.Control
                                type="email"
                                defaultValue={updatePage ? clinicDataToUpdate?.email : ''}
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
                                defaultValue={updatePage ? clinicDataToUpdate?.taxIdOrEIN : ''}
                                placeholder="Tax ID / EIN" />
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-2">
                            <Form.Label className='mb-1'>Contact Person</Form.Label>
                            <Form.Control
                                type="text"
                                {...register('contact')}
                                defaultValue={updatePage ? clinicDataToUpdate?.phone : ''}
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
                                defaultValue={updatePage ? clinicDataToUpdate?.npiNumber : ''}
                                placeholder="NPI Number" />
                            {/* {errors.npi && <span className="text-danger">{errors.npi.message}</span>} */}
                        </Form.Group>
                    </Col>
                    <Col sm={6} className='mb-2 d-flex flex-column position-relative'>
                        <Form.Label>Logo</Form.Label>
                        <img
                            src={profileDummy}
                            alt="Upload icon"
                            className="upload-icon cursor-pointer "
                            style={{ cursor: 'pointer' }} // Change cursor to indicate clickable
                            onClick={handleLogoClick}
                        />
                        <i onClick={handleLogoClick} className="mdi mdi-square-edit-outline position-absolute cursor-pointer" style={{ left: '13%', top: '15%' }}></i>
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
                                    value={accreditation.number}
                                    placeholder="Document Number"
                                    onChange={(e) => handleAccreditationInputChange(e, 'number', index)}
                                />
                            </Col>
                            <Col sm={4} className="mb-2 position-relative">
                                <div onClick={() => accreditationFileInputRef.current.click()}
                                    className=' custom-file-upload justify-content-between cursor-pointer'>
                                    {accreditation.fileName ? accreditation.fileName : 'Upload Document'}
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
                                    value={medical.number}
                                    placeholder="Document Number"
                                    onChange={(e) => handleMedicalInputChange(e, 'number', index)}
                                />
                            </Col>
                            <Col sm={4} className="mb-2 position-relative">
                                <div onClick={() => medicalFileInputRef.current.click()}
                                    className=' custom-file-upload justify-content-between cursor-pointer'>
                                    {medical.fileName ? medical.fileName : 'Upload Document'}
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
                                <Form.Select
                                    onChange={(e) => handleStateInputChange(e, 'name', index)}
                                >
                                    <option>State</option>
                                    {statesData?.states?.map((data) => (
                                        <option
                                            value={data?.name} key={data?._id}
                                        >
                                            {data?.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Col>
                            <Col sm={4}>
                                <Form.Control
                                    type="text"
                                    value={data.number}
                                    placeholder="Document Number"
                                    onChange={(e) => handleStateInputChange(e, 'number', index)}
                                />
                            </Col>
                            <Col sm={4} className="mb-2 position-relative">
                                <div onClick={() => stateFileInputRef.current.click()}
                                    className=' custom-file-upload justify-content-between cursor-pointer'>
                                    {data.fileName ? data.fileName : 'Upload Document'}
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
                                        defaultValue={updatePage ? clinicDataToUpdate?.clinicType?.address?.address1 : ''}
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
                                                {...register('stateName')}
                                                onChange={(e) => handleStateSelection(e)}
                                            >
                                                <option>State</option>
                                                {statesData?.states?.map((data) => (
                                                    <option
                                                        key={data?.state_code} // Unique key for each option
                                                        value={JSON.stringify({ name: data?.name, state_code: data?.state_code, id: data?.id, _id: data?._id })}
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
                                                        {...register('city')}
                                                        onChange={(e) => handleCitySelection(e)}
                                                    >
                                                        <option>{store?.getCitiesReducer?.loading ? 'Loading...' : 'City'}</option>
                                                        {cities?.map((data) => (
                                                            <option value={JSON.stringify({ _id: data?._id, name: data?.name, latitude: data?.latitude, longitude: data?.longitude })}>{data?.name}</option>
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
                        <Button variant="primary" type='submit' className='custom-buttons'>
                            Add Multiple
                        </Button>
                        <Button variant="primary" type="submit" disabled={store?.createClinicsReducer?.loading} onClick={() => setNextClicked(true)} className='custom-buttons'>
                            {store?.createClinicsReducer?.loading ?
                                <Spinner className="spinner-border-sm" />
                                :
                                'Save'
                            }
                        </Button>
                    </Col>
                </Row >
            </Form >
            <Row className={`${clinicsList?.length > 0 ? '' : 'd-none'}`}>
                <Col>
                    <Table responsive className="mt-3 table-centered border border-muted table-nowrap mb-0 ">
                        <thead>
                            <tr>
                                <th>Clinic Name</th>
                                <th>Location</th>
                                <th>Specialist</th>
                                <th>Email</th>
                                <th>Contact</th>
                                {/* <th>Tax / EIN Id</th> */}
                                {/* <th></th> */}
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {store?.getClinicsByParentReducer?.loading ?
                                <Spinner />
                                :

                                clinicsList?.map((multipleData) => (
                                    <tr>
                                        <td className='text-capitalize'>{multipleData?.name}</td>
                                        <td>{multipleData?.address?.city?.state_code || '' + ' / ' + multipleData?.address?.city?.name || ''}</td>
                                        <td>{multipleData?.clinicType}</td>
                                        <td className='text-lowercase'>{multipleData?.email}</td>
                                        <td>{multipleData?.phone}</td>
                                        {/* <td>{multipleData?.taxIdOrEIN}</td> */}
                                        <td className='fs-4 d-flex gap-1'>
                                            <i className="mdi mdi-square-edit-outline cursor-pointer"></i>
                                            <i className="mdi mdi-delete cursor-pointer"></i>
                                        </td>
                                    </tr>
                                )
                                )}

                        </tbody>
                    </Table>
                </Col>
            </Row>
        </>
    );
}

export default ClinicForm;