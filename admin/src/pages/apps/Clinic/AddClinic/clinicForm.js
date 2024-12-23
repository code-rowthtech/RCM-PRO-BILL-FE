import React, { useEffect, useState, useRef } from 'react'
import { Col, Form, Row, Button, Table, InputGroup, Dropdown } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Spinner from '../../../../constants/Spinner';
import { useSelector, useDispatch } from 'react-redux';
import us from '../../../../assets/images/flags/us.jpg'
import {
    createClinicAction, deleteClinicAction, getCities2Action, getCitiesAction, getClinicById,
    getClinicByParentAction, getStatesByCountryAction,
    stateEmptydAction, updateClinicAction
} from '../../../../redux/clinics/actions';
import { FiDownloadCloud, FiMinus } from 'react-icons/fi';
import { handleUpload } from '../../../../helpers/HandleUpload';
import { encryptMessage } from '../../../../cryptoUtils';
import ToastHandle from '../../../../helpers/ToastMessage';
import { handleFirstSpace } from '../../../../helpers/noBeginningSpace';
import { MdOutlineRadioButtonChecked, MdOutlineRadioButtonUnchecked } from 'react-icons/md';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const ClinicForm = ({ setActiveTab, setClinicId, clinicId, setBillingId, setMultiple, setContractId, setResetEmail, setIsModalRequest, isModalRequest, resetEmail }) => {
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch, getValues,
        setError,
        setValue,
        clearErrors
    } = useForm();
    const navigate = useNavigate()

    // Variable initializations
    const clinicname = watch('clinicname');
    const email = watch('email');
    const contact = watch('contact');
    const clinicType = watch('clinicType');
    const stateGeoLocation = watch('stateName');
    const mailingStateGeoLocation = watch('mailingStateName');
    const isFormValid = clinicname && email && contact && clinicType;
    const [searchParams] = useSearchParams();
    const parentClincId = searchParams.get('clincid');
    const parentUserId = searchParams.get('userId');
    const [updatePage, setUpdatePage] = useState(false);
    const [counter, setCounter] = useState(0);
    const [selectedState, setSelectedState] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const [selectedCity, setSelectedCity] = useState(null);
    const [logo, setLogo] = useState(null);
    const [parentClinic, setParentclinic] = useState(null);
    const [logoName, setLogoName] = useState(null);
    const [focused, setFocused] = useState(false);
    const [mailingFocused, setMailingFocused] = useState(false);
    const [singleOrMultiple, setSingleOrMultiple] = useState(false);
    const [sameAsPrimary, setSameAsPrimary] = useState(false);
    const [longitude, setLongitude] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [mailingLongitude, setMailingLongitude] = useState(null);
    const [mailingLatitude, setMailingLatitude] = useState(null);
    const [stateToSelect, setStateToSelect] = useState(null);
    const [mailingStateToSelect, setMailingStateToSelect] = useState(null);
    const [medicalDetails, setMedicalDetails] = useState([
        { name: '', number: '', url: null, fileName: '' }
    ]);
    const [accreditationDetails, setAccreditationDetails] = useState([
        { name: '', number: '', url: null, fileName: '' }
    ]);
    const [stateDetails, setStateDetails] = useState([
        { name: '', number: '', url: null, fileName: '' }
    ]);
    const [posDetails, setPosDetails] = useState([
        { name: '', email: '', role: '', contact: '' }
    ])
    const [ids, setIds] = useState({
        userId: null, clinicId: null,
    })
    const [taxonomyCodes, setTaxonomyCodes] = useState(['']);
    const [stateUploading, setStateUploading] = useState(false);
    const [formValid, setFormValid] = useState(false);
    const [createTableData, setCreateTableData] = useState(null);
    const [searchedLocations, setSearchedLocations] = useState(null);
    const [searchedMailingLocations, setSearchedMailingLocations] = useState(null);
    const [selectedStates, setSelectedStates] = useState([]);
    const [statesMenu, setStatesMenu] = useState(false);
    const [clinicData, setClinicData] = useState(null);
    const [citySearch, setCitySearch] = useState(null);
    const [mailingCitySearch, setMailingCitySearch] = useState(null);
    const [logoUploading, setLogoUploading] = useState(false);
    const [accUploading, setAccUploading] = useState(false);
    useEffect(() => {
        const validCodes = taxonomyCodes.filter(code => code.trim() !== '');
        if (validCodes?.length > 0) {
            setResetEmail({ ...resetEmail, taxonomyCodes: taxonomyCodes })
        }
    }, [taxonomyCodes])

    // GET store data
    const store = useSelector((state) => state);
    const clinicTypeData = store?.getMastersDataReducer?.data?.clinicTypes;
    const createResponse = store?.createClinicsReducer?.data?.status;
    const clinicDataToUpdate = store?.getClinicByIdReducer?.data?.clinic;
    const clinicsList = store?.getClinicsByParentReducer?.data?.data;
    const decryptedRolesData = store?.getRolesDataReducer?.data?.roles;
    const statesData = store?.getStatesReducer?.data;
    const cities1 = store?.getCitiesReducer?.cities1?.data?.cities;
    const cities2 = store?.getCitiesReducer?.cities2?.data?.cities;
    const deleteResponse = store?.deleteClinicOnboardingReducer?.data?.status;
    const cities = store?.getCitiesReducer?.data?.cities;
    const createData = store?.createClinicsReducer?.data?.data;
    const parentData = store?.getClinicByIdReducer?.data?.clinic;
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    useEffect(() => {
        if (parentClincId && parentData) {
            setClinicData(parentData);
        }
    }, [parentClincId, parentData]);

    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    useEffect(() => {
        if (parentClincId) {
            const payload = {
                id: parentClincId
            }
            dispatch(getClinicById({ key: encryptMessage(payload) }))
            const data = {
                parentClinicId: parentClincId,
            };
            dispatch(getClinicByParentAction({ key: encryptMessage(data) }));
        }
    }, [parentClincId]);
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    useEffect(() => {
        const validateDetails = (details, keys) =>
            details.every((item) =>
                keys.every((key) => item?.[key]?.toString().trim())
            );

        const updatedResetEmail = { ...resetEmail };
        if (validateDetails(accreditationDetails, ['name', 'number', 'url', 'fileName'])) {
            updatedResetEmail.accreditationDetails = accreditationDetails;
        }
        if (validateDetails(stateDetails, ['name', 'number', 'url', 'fileName'])) {
            updatedResetEmail.stateOfLicensing = stateDetails;
        }
        if (
            posDetails.every(
                (item) =>
                    item?.name?.trim() &&
                    item?.email?.trim() &&
                    item?.role?.trim() &&
                    item?.contact?.trim()
            )
        ) {
            updatedResetEmail.pos = posDetails;
        }
        if (stateToSelect?._id) {
            updatedResetEmail.primaryAddress = {
                ...updatedResetEmail.primaryAddress,
                state: stateToSelect._id,
            };
        }
        setResetEmail(updatedResetEmail);
    }, [accreditationDetails, stateDetails, posDetails, stateToSelect, getValues, latitude, longitude, watch('city'), watch('street'), watch('zip')]);
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    useEffect(() => {
        if (decryptedRolesData) {
            const clinicRoleId = decryptedRolesData && decryptedRolesData.find(role => role?.name === "clinic")?._id;
            setResetEmail({ ...resetEmail, role: clinicRoleId })
        }
    }, [decryptedRolesData])
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    useEffect(() => {
        if (createResponse === 200) {
            reset();
            setLogo(null);
            setLogoName(null);
            setAccreditationDetails([{ name: '', number: '', url: null, fileName: '' }]);
            setPosDetails([{ name: '', number: '', url: null, fileName: '' }]);
            setStateDetails([{ name: '', number: '', url: null, fileName: '' }]);
            setMedicalDetails([{ name: '', number: '', url: null, fileName: '' }]);
            setSelectedCity(null);
            setSelectedState(null);
            setLatitude(null);
            setLongitude(null);
            setMailingLatitude(null);
            setMailingLongitude(null);
            setTaxonomyCodes(['']);
            setSameAsPrimary(false);
            if (!parentClincId && counter === 0 && !isModalRequest) {
                setBillingId(store?.createClinicsReducer?.data?.data?._id);
                setContractId(store?.createClinicsReducer?.data?.data?.clinicId?._id);
                setActiveTab('billing');
            }
        }
        if (createResponse === 200 && parentClincId) {
            const payload = {
                parentClinicId: parentClincId,
            };
            dispatch(getClinicByParentAction({ key: encryptMessage(payload) }));
        }
    }, [createResponse, clinicsList, parentClincId, counter]);
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    useEffect(() => {
        if (deleteResponse === 200 && parentClincId) {
            const payload = {
                parentClinicId: parentClincId,
            };
            dispatch(getClinicByParentAction({ key: encryptMessage(payload) }));
        }
    }, [deleteResponse])
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    useEffect(() => {
        if (resetEmail?.name && resetEmail?.email && resetEmail?.phone && resetEmail?.clinicType) {
            setFormValid(true)
        }
    }, [resetEmail])
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    useEffect(() => {
        if (createResponse === 200 && counter === 1) {
            setIds({
                userId: store?.createClinicsReducer?.data?.data?._id,
                clinicId: store?.createClinicsReducer?.data?.data?.clinicId?._id
            });
            navigate(`/apps/rcm/addclinic?clincid=${store?.createClinicsReducer?.data?.data?.clinicId?._id}&userId=${store?.createClinicsReducer?.data?.data?._id}`)
        }
    }, [createResponse, counter]);
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    useEffect(() => {
        if (createData) {
            setCreateTableData(createData)
        }
    }, [createData]);
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    useEffect(() => {
        if (latitude && longitude) {
            setFocused(false);
        }
        if (mailingLatitude && mailingLongitude) {
            setMailingFocused(false);
        }
    }, [latitude, longitude, mailingLatitude, mailingLongitude]);
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    useEffect(() => {
        if (stateGeoLocation) {
            setStateToSelect(statesData?.states && statesData?.states.find((data) => data?.state_code === stateGeoLocation));
        }
        if (mailingStateGeoLocation) {
            setMailingStateToSelect(statesData?.states && statesData?.states.find((data) => data?.state_code === mailingStateGeoLocation));
        }
    }, [stateGeoLocation, mailingStateGeoLocation])
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    useEffect(() => {
        if (citySearch) {
            setValue('city', cities1 && cities1.find((data) => data?.name === citySearch)?._id)
            setResetEmail((prevState) => ({
                ...prevState,
                primaryAddress: {
                    ...prevState.primaryAddress, // Preserve other fields inside primaryAddress
                    city: cities1 && cities1.find((data) => data?.name === citySearch)?._id,     // Update only the address field
                }
            }));
        }
        if (mailingCitySearch) {
            setValue('mailingCity', cities2 && cities2.find((data) => data?.name === mailingCitySearch)?._id)
        }
    }, [citySearch, cities1, mailingCitySearch, cities2])
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    useEffect(() => {
        if (stateToSelect) {
            dispatch(getCitiesAction({ state_code: stateToSelect?.id, name: citySearch ? citySearch : '', limit: 25, skip: '' }));
        }
        if (mailingStateToSelect) {
            dispatch(getCities2Action({ state_code: mailingStateToSelect?.id, name: mailingCitySearch ? mailingCitySearch : '', limit: 25, skip: '' }));
        }
    }, [stateToSelect, citySearch, mailingStateToSelect, mailingCitySearch])

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile, setLogoUploading);
            setLogo(url);
            setLogoName(selectedFile?.name)
        } catch (error) {
            console.error('Error during file upload:', error);
        }
    };
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    useEffect(() => {
        if (logo && logoName) {
            setResetEmail({
                ...resetEmail,
                logo: {
                    url: logo?.url.split('?')[0],  // Removes any query parameters from the URL
                    fileName: logoName,             // Assigns the logo file name
                },
            });
        }
    }, [logo, logoName]);

    const handleAccreditationChange = async (e, index) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile, setAccUploading);
            setAccreditationDetails((prevDetails) => {
                const updatedDetails = [...prevDetails];
                updatedDetails[index] = {
                    ...updatedDetails[index],
                    url: url?.url?.split('?')[0],
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
                    url: url?.url?.split('?')[0],
                    fileName: selectedFile.name,

                };
                return updatedDetails;
            });
        } catch (error) {
            console.error('Error during file upload:', error);
        }
    };

    const handleAccreditationInputChange = (e, field, index) => {
        const value = e.target.value;
        if (field === 'number' && !/^[a-zA-Z0-9]{0,10}$/.test(value)) {
            return;
        }
        setAccreditationDetails((prevDetails) => {
            const updatedDetails = [...prevDetails];
            updatedDetails[index] = {
                ...updatedDetails[index],
                [field]: value
            };
            return updatedDetails;
        });
    };

    const handleAddAccreditation = () => {
        const isIncomplete = accreditationDetails.some(
            (accreditation) =>
                !accreditation.name || !accreditation.number || !accreditation.url
        );

        if (isIncomplete) {
            ToastHandle('Please fill available accreditation fields before adding a new one.', 'danger');
            return;
        }
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
        const isIncomplete = medicalDetails.some(
            (medical) =>
                !medical.name || !medical.number || !medical.url
        );

        if (isIncomplete) {
            ToastHandle('Please fill available medical details fields before adding a new one', 'danger');
            return;
        }
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

    const handleAddPOS = () => {
        const isIncomplete = posDetails.some(
            (pos) =>
                !pos.name || !pos.role || !pos.contact || !pos.email
        );

        if (isIncomplete) {
            ToastHandle('Please fill available POC fields before adding a new one', 'danger');
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

    const handleStateSelection = (e) => {
        const selectedOption = e.target.selectedOptions[0]
        const key = JSON.parse(selectedOption.getAttribute('data-key'));
        setSelectedState(e.target.value);
        dispatch(getCitiesAction({ state_code: key, name: '', limit: 25 }));
    };
    const handleMailingStateSelection = (e) => {
        const selectedOption = e.target.selectedOptions[0]
        const key = JSON.parse(selectedOption.getAttribute('data-key'));
        setMailingStateToSelect(e.target.value);
        dispatch(getCities2Action({ state_code: key, name: '', limit: 25 }));
    };

    const handleCitySelection = (e) => {
        const value = e.target.value;
        setSelectedCity(value)
    };

    const checkForDuplicates = (accreditationDetails, stateDetails) => {
        const accreditationNumbers = accreditationDetails.map(item => item.number);
        const stateNumbers = stateDetails.map(item => item.number);
        const hasDuplicates = (array) => {
            const filteredArray = array.filter(number => number); // Remove empty/null values
            return filteredArray.some((number, index) => filteredArray.indexOf(number) !== index);
        };

        const accreditationHasDuplicates = hasDuplicates(accreditationNumbers);
        const stateHasDuplicates = hasDuplicates(stateNumbers);
        const crossArrayDuplicates = hasDuplicates([...accreditationNumbers, ...stateNumbers]);

        if (accreditationHasDuplicates) {
            ToastHandle('Duplicate document numbers found in Accreditation Details. Please ensure all document numbers are unique.', 'danger');
            return true;
        } else if (stateHasDuplicates) {
            ToastHandle('Duplicate document numbers found in State Details. Please ensure all document numbers are unique.', 'danger');
            return true;
        } else if (crossArrayDuplicates) {
            ToastHandle('Duplicate document numbers found across Accreditation and State Details. Please ensure all document numbers are unique.', 'danger');
            return true;
        }
        return false;
    };
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    useEffect(() => {
        checkForDuplicates(accreditationDetails, stateDetails);
    }, [accreditationDetails, stateDetails]);

    const onSubmit = (data) => {
        const isDuplicate = checkForDuplicates(accreditationDetails, stateDetails);
        if (!isDuplicate) {
            setIsModalRequest(false);
            const newPayload = {
                ...(parentClincId ? {
                    parentUserId: parentUserId,
                    parentClinicId: parentClincId,
                } : {}),
                flag: parentClincId ? "subClinic" : "Clinic",
                name: data?.clinicname,
                isPrimaryAndMailingAddressSame: sameAsPrimary,
                email: data?.email,
                phone: '+1' + data?.contact?.replace(/\D/g, ''),
                clinicType: data?.clinicType,
                ...(data?.taxId ? { taxIdOrEIN: data.taxId.replace(/^(\d{2})(\d*)/, '$1-$2') } : ''),
                ...(data?.npi ? { npiNumber: data?.npi } : ''),
                stateOfLicensing: stateDetails,
                accreditationDetails: accreditationDetails,
                ...(data?.clia ? { CLIA_Number: data?.clia } : {}),
                taxonomyCodes: taxonomyCodes,
                ...(data?.medicaid ? { medicaidNumber: data?.medicaid } : {}),
                ...(data?.medicare ? { medicareNumber: data?.medicare } : {}),
                pos: posDetails,
                primaryAddress: {
                    ...(data?.address ? { address: data?.address } : {}),
                    ...(data?.city ? { city: data?.city } : {}),
                    ...(data?.zip ? { zip: data?.zip } : {}),
                    ...(data?.street ? { street: data?.street } : {}),
                    ...(stateToSelect?._id ? { state: stateToSelect?._id } : {}),
                    ...(latitude ? { latitude: latitude } : {}),
                    ...(longitude ? { longitude: longitude } : {}),
                },
                mailingAddress: sameAsPrimary
                    ? {
                        ...(data?.address ? { address: data?.address } : {}),
                        ...(data?.city ? { city: data?.city } : {}),
                        ...(data?.zip ? { zip: data?.zip } : {}),
                        ...(data?.street ? { street: data?.street } : {}),
                        ...(stateToSelect?._id ? { state: stateToSelect?._id } : {}),
                        ...(latitude ? { latitude: latitude } : {}),
                        ...(longitude ? { longitude: longitude } : {})
                    }
                    : {
                        ...(data?.mailingAddress ? { address: data?.mailingAddress } : {}),
                        ...(data?.mailingCity ? { city: data?.mailingCity } : {}),
                        ...(data?.mailingZip ? { zip: data?.mailingZip } : {}),
                        ...(data?.mailingStreet ? { street: data?.mailingStreet } : {}),
                        ...(mailingStateToSelect?._id ? { state: mailingStateToSelect?._id } : {}),
                        ...(mailingLatitude ? { latitude: mailingLatitude } : {}),
                        ...(mailingLongitude ? { longitude: mailingLongitude } : {})
                    },
                logo: {
                    url: logo?.url.split('?')[0],
                    fileName: logoName
                },
                practiceSpecialty: data?.speciality,
            };
            dispatch(createClinicAction({ key: encryptMessage(newPayload) }));
        }
    };
    const handleDeleteClinic = (data) => {
        const payload = {
            id: data
        }
        dispatch(deleteClinicAction({ key: encryptMessage(payload) }))
    }

    const getGeolocation = (e) => {
        const addressToSearch = e.target.value;
        async function fetchGeocodeData(location) {
            const apiKey = '2a77840d874f4c35848e37042ce7c8ed';
            const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${apiKey}&language=en&pretty=1&countrycode=us`;

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Error fetching data: ${response.status} - ${response.statusText}`);
                }

                const data = await response.json();
                return data; // Return the geocoding data
            } catch (error) {
                console.error("Failed to fetch geocode data:", error);
                return null; // Return null in case of error
            }
        }
        fetchGeocodeData(addressToSearch)
            .then((data) => {
                if (data) {
                    setSearchedLocations(data?.results);
                } else {
                    console.log("No data returned.");
                }
            });
    }
    const getMailingGeolocation = (e) => {
        const addressToSearch = e.target.value;
        async function fetchGeocodeData(location) {
            const apiKey = '2a77840d874f4c35848e37042ce7c8ed'; // Replace with your API key
            const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${apiKey}&language=en&pretty=1&countrycode=us`;

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Error fetching data: ${response.status} - ${response.statusText}`);
                }

                const data = await response.json();
                return data;
            } catch (error) {
                console.error("Failed to fetch geocode data:", error);
                return null;
            }
        }
        fetchGeocodeData(addressToSearch)
            .then((data) => {
                if (data) {
                    setSearchedMailingLocations(data?.results);
                } else {
                    console.log("No data returned.");
                }
            });
    }

    const handleCheckboxChange = (stateName) => {
        setSelectedStates((prev) => {
            const updatedStates = prev.includes(stateName)
                ? prev.filter((name) => name !== stateName)
                : [...prev, stateName];
            setStateDetails((prevDetails) => {
                const newDetails = updatedStates.map((state) =>
                    prevDetails.find((detail) => detail.name === state) || { name: state, number: '', url: null, fileName: '' }
                );
                return newDetails;
            });
            return updatedStates;
        });
    };

    const handleStateInputChange = (e, field, index) => {
        const value = e.target.value;
        if (field === 'number' && !/^[a-zA-Z0-9]{0,10}$/.test(value)) {
            return;
        }
        setStateDetails((prevDetails) => {
            const updatedDetails = [...prevDetails];
            updatedDetails[index] = {
                ...updatedDetails[index],
                [field]: value,
            };
            return updatedDetails;
        });
    };

    const handleStateChange = async (e, index) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile, setStateUploading);
            setStateDetails((prevDetails) => {
                const updatedDetails = [...prevDetails];
                updatedDetails[index] = {
                    ...updatedDetails[index],
                    url: url?.url?.split('?')[0],
                    fileName: selectedFile.name,
                };
                return updatedDetails;
            });
        } catch (error) {
            console.error('Error during file upload:', error);
        }
    };

    const handleRemoveState = (index) => {
        setStateDetails((prevDetails) => {
            const updatedDetails = prevDetails.filter((_, i) => i !== index);
            setSelectedStates(updatedDetails.map((detail) => detail.name)); // Update selectedStates as well
            return updatedDetails;
        });
    };
    // const menuRef = useRef(null);
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    const containerRef = useRef(null);
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setStatesMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleAddTaxonomy = () => {
        const lastCode = taxonomyCodes[taxonomyCodes.length - 1];
        if (lastCode.trim()) {
            setTaxonomyCodes([...taxonomyCodes, '']);
        } else {
            ToastHandle('Please complete the current Taxonomy Code field before adding another.', 'danger')
        }
    };
    const handleRemoveTaxonomy = (index) => {
        setTaxonomyCodes((prev) => {
            const updatedCodes = prev.filter((_, i) => i !== index);
            return updatedCodes.length > 0 ? updatedCodes : [''];
        });

    };

    // Function to handle field changes
    const handleTaxonomyChange = (index, value) => {
        const updatedCodes = [...taxonomyCodes];
        updatedCodes[index] = value;
        setTaxonomyCodes(updatedCodes);
    };
    const clinicTypeSelected = watch('clinicType');
    const watchAllFields = watch(['address', 'zip', 'stateName', 'city', 'street']);

    return (
        <>
            <Form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <Col sm={6}>
                        <Form.Group className="mb-2">
                            <Form.Label className='mb-1'>Practice Name <span className='text-danger'>*</span></Form.Label>
                            <Form.Control
                                type="text"
                                {...register('clinicname', {
                                    required: 'This field is required',
                                    validate: (value) =>
                                        !value.startsWith(' ') || 'First character cannot be a space',
                                })}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value.startsWith(' ')) {
                                        e.target.value = value.trimStart(); // Prevent spaces at the start
                                    }
                                    setResetEmail({ ...resetEmail, name: e.target.value });
                                }}
                                placeholder="Practice name"
                            // onKeyPress={handleFirstSpace}
                            />
                            {errors.clinicname && <span className="text-danger">{errors.clinicname.message}</span>}
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-2">
                            <Form.Label className='mb-1'>Practice type <span className='text-danger'>*</span></Form.Label>
                            <Form.Select
                                {...register('clinicType', { required: 'This field is required' })}
                                className={` ${!resetEmail?.email ? 'emptyField' : 'selectedField'}`}
                                onChange={(e) => setResetEmail({ ...resetEmail, clinicType: e.target.value })}
                            >
                                <option value="">Select practice type</option>
                                {clinicTypeData?.map((data) => (
                                    <option key={data?._id} value={data?.name}>{data?.name}</option>
                                ))}
                            </Form.Select>
                            {errors.clinicType && <span className="text-danger">{errors.clinicType.message}</span>}
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-2">
                            <Form.Label className='mb-1'>Email ID<span className='text-danger'>*</span></Form.Label>
                            <Form.Control
                                type="text"
                                // defaultValue={updatePage ? clinicDataToUpdate?.email : ''}
                                {...register('email', {
                                    required: 'This field is required',
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Regex for email validation
                                        message: 'Please enter a valid email address'
                                    }
                                })}
                                onChange={(e) => {
                                    setResetEmail({ ...resetEmail, email: e.target.value })
                                    clearErrors('email')
                                }}
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
                                        message: 'Tax ID / EIN must be at least 9 characters long',
                                    },
                                    pattern: {
                                        value: /^[0-9]+$/,
                                        message: 'Tax ID / EIN must contain numbers only',
                                    },
                                })}
                                onKeyPress={(event) => {
                                    if (!/[0-9]/.test(event.key)) {
                                        event.preventDefault();
                                        clearErrors('clinicname');
                                    }
                                }}
                                maxLength={9}
                                onChange={(e) => {
                                    setResetEmail({ ...resetEmail, taxIdOrEIN: e.target.value })
                                    clearErrors('taxId');
                                }}
                                placeholder="Tax ID / EIN" />
                            {errors.taxId && <span className="text-danger">{errors.taxId.message}</span>}
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-0 position-relative">
                            <Form.Label className='mb-1'>Contact Person <span className='text-danger'>*</span></Form.Label>
                            <Form.Group>
                                <InputGroup>
                                    <InputGroup.Text className='ps-3 pe-1 fw-bold text-black'>&nbsp;&nbsp;+1</InputGroup.Text> {/* This is the prefix */}
                                    <Form.Control
                                        type="tel"
                                        // value={formattedPhone}
                                        {...register('contact', {
                                            required: 'This field is required',
                                            pattern: {
                                                value: /^(\d{3}-\d{3}-\d{4}|\d{9,10})$/, // Accepts either the hyphenated format (XXX-XXX-XXXX) or 9–10 digits without hyphens
                                                message: 'Contact must be in the format XXX-XXX-XXXX or contain only 9–10 digits',
                                            },
                                            maxLength: {
                                                value: 12,
                                                message: 'Contact must not exceed 10 digits'
                                            },
                                            minLength: {
                                                value: 11,
                                                message: 'Contact must not be less than 9 digits'
                                            }
                                        })}
                                        onChange={(e) => {
                                            const rawValue = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                                            const formattedValue = rawValue.replace(/(\d{3})(\d{3})(\d{0,4})/, (match, p1, p2, p3) =>
                                                p3 ? `${p1}-${p2}-${p3}` : `${p1}-${p2}`
                                            ); // Format dynamically
                                            e.target.value = formattedValue; // Update input value
                                            setResetEmail({ ...resetEmail, phone: rawValue });
                                            clearErrors('contact');
                                        }}
                                        defaultValue={updatePage ? clinicDataToUpdate?.phone : ''}
                                        placeholder="1234-234-234"
                                        maxLength={12}
                                        // onKeyPress={(event) => handleFirstSpace(event, 0)}
                                        onKeyPress={(event) => {
                                            // Only allow numeric characters (0-9)
                                            if (!/[0-9]/.test(event.key)) {
                                                event.preventDefault();
                                            }
                                        }}
                                    />
                                </InputGroup>
                            </Form.Group>

                            <div
                                className='position-absolute ' style={{ top: '52%', left: '1%' }}
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
                            <Form.Label className='mb-1'>NPI Type 2  Number</Form.Label>
                            <Form.Control
                                type="text"
                                {...register('npi', {
                                    minLength: {
                                        value: 10,
                                        message: 'NPI must be at least 10 characters long', // Error message
                                    },
                                    maxLength: {
                                        value: 10,
                                        message: 'NPI cannot exceed 10 characters', // Error message
                                    },
                                    pattern: {
                                        value: /^[0-9]+$/, // Pattern for numbers only
                                        message: 'NPI must contain numbers only', // Error message
                                    },
                                })}
                                defaultValue={updatePage ? clinicDataToUpdate?.npiNumber : ''}
                                placeholder="NPI Number"
                                maxLength={10}
                                onChange={(e) => {
                                    setResetEmail({ ...resetEmail, npiNumber: e.target.value })
                                    clearErrors('npi');
                                }}
                                // onKeyPress={(event) => handleFirstSpace(event, 0)} 
                                onKeyPress={(event) => {
                                    // Only allow numeric characters (0-9)
                                    if (!/[0-9]/.test(event.key)) {
                                        event.preventDefault();
                                    }
                                }}
                            />
                            {errors.npi && <span className="text-danger">{errors.npi.message}</span>}
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-2">
                            <Form.Label className='mb-1'>Practice Speciality Description</Form.Label>
                            <Form.Control
                                type="text"
                                {...register('speciality', {
                                    validate: (value) =>
                                        !value.startsWith(' ') || 'First character cannot be a space',
                                })}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value.startsWith(' ')) {
                                        e.target.value = value.trimStart(); // Prevent spaces at the start
                                    }
                                    setResetEmail({ ...resetEmail, practiceSpecialty: value });
                                    clearErrors('speciality');
                                }}
                                placeholder="Practice speciality"
                                onKeyPress={handleFirstSpace}
                            />
                            {errors.speciality && <span className="text-danger">{errors.speciality.message}</span>}
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-2">
                            <Form.Label className='mb-1'>CLIA  Number</Form.Label>
                            <Form.Control
                                type="text"
                                {...register('clia', {
                                    // required: "This field is required",
                                    pattern: {
                                        value: /^[A-Z0-9]{2}D[0-9]{7}$/, // Ensures the CLIA number matches the specific format
                                        message: 'CLIA number must be in the format XXDXXXXXXX, where X is alphanumeric and the rest are digits',
                                    },
                                })}
                                placeholder="CLIA Number"
                                maxLength={10}
                                onChange={(e) => {
                                    setResetEmail({ ...resetEmail, CLIA_Number: e.target.value });
                                    clearErrors('clia');
                                }}
                                onKeyPress={(event) => handleFirstSpace(event, 0)}
                            />
                            {errors.clia && <span className="text-danger">{errors.clia.message}</span>}
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-2">
                            <Form.Label className='mb-1'>Medicare Number</Form.Label>
                            <Form.Control
                                type="text"
                                {...register('medicare', {
                                    minLength: {
                                        value: 10,
                                        message: 'Medicare number must be at least 10 characters long', // Error message
                                    },
                                })}
                                placeholder="Medicare Number"
                                maxLength={10}
                                onChange={(e) => {
                                    setResetEmail({ ...resetEmail, medicareNumber: e.target.value })
                                    clearErrors('medicare')
                                }}
                                onKeyPress={(event) => handleFirstSpace(event, 0)}
                            />
                            {errors.medicare && <span className="text-danger">{errors.medicare.message}</span>}
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-2">
                            <Form.Label className='mb-1'>Medicaid Number</Form.Label>
                            <Form.Control
                                type="text"
                                {...register('medicaid', {
                                    minLength: {
                                        value: 10,
                                        message: 'Medicaid number must be at least 10 characters long', // Error message
                                    },
                                })}
                                placeholder="Medicaid Number"
                                maxLength={10}
                                onChange={(e) => {
                                    clearErrors('medicaid')
                                    setResetEmail({ ...resetEmail, medicaidNumber: e.target.value })
                                }}
                                onKeyPress={(event) => handleFirstSpace(event, 0)}
                            />
                            {errors.medicaid && <span className="text-danger">{errors.medicaid.message}</span>}
                        </Form.Group>
                    </Col>
                    {taxonomyCodes.map((code, index) => (
                        <Col sm={6} key={index}>
                            <Form.Group className="mb-2 position-relative">
                                <Form.Label className="mb-1">
                                    Taxonomy Code(s)
                                    {index === taxonomyCodes.length - 1 && (
                                        <span
                                            className="fs-5 uil-plus-circle plusicon ms-1 fw-bold cursor-pointer"
                                            onClick={handleAddTaxonomy}
                                        >
                                        </span>
                                    )}
                                    {/* <span className="text-danger">*</span> */}
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    {...register(`taxonomyCode[${index}]`, {
                                        //  required: 'This field is required'
                                    })}
                                    value={code}
                                    placeholder="Taxonomy Code"
                                    maxLength={10}
                                    onKeyPress={(event) => handleFirstSpace(event, index)}
                                    onChange={(e) => {
                                        clearErrors(`taxonomyCode[${index}]`)
                                        handleTaxonomyChange(index, e.target.value)
                                    }}
                                />
                                <span
                                    style={{ top: '55%', right: '1%' }}
                                    onClick={() => handleRemoveTaxonomy(index)} className={`${taxonomyCodes?.length === 1 ? 'd-none' : ''} uil-minus-circle cursor-pointer position-absolute fs-5 fw-bold text-danger`}></span>

                                {errors.taxonomyCode?.[index] && (
                                    <span className="text-danger">{errors.taxonomyCode[index].message}</span>
                                )}
                            </Form.Group>
                        </Col>
                    ))}
                    <Col sm={6} className='mb-2 d-flex flex-column position-relative'>
                        <Form.Label>Upload Logo</Form.Label>
                        <div
                            onClick={() => document.getElementById(`logo-file-input`).click()}
                            className={`custom-file-upload justify-content-between cursor-pointer ${logoName || logoUploading ? 'form-control' : 'custom-form-fields'}`}>
                            {logoName ? logoName : logoUploading ? 'Uploading...' : 'Upload Logo'}
                            <p className='mb-0'><FiDownloadCloud /></p>
                        </div>
                        <Form.Control
                            type="file"
                            id='logo-file-input'
                            className="rounded-circle"
                            style={{ display: 'none' }}
                            // {...register('logoimage', { required: 'This field is required' })}
                            // ref={logoFileInputRef}
                            accept=".png, .jpg, .jpeg, .svg" // Allow only specific file types
                            onChange={handleFileChange}
                        />
                        {/* {errors.logoimage && <span className="text-danger">{errors.logoimage.message}</span>} */}
                    </Col>
                    <hr />
                    <Col sm={12}>
                        <Form.Label>
                            Accreditation Details&nbsp;
                            <span
                                onClick={handleAddAccreditation}
                                className=' fs-5 uil-plus-circle plusicon ms-1 fw-bold cursor-pointer'>
                                {/* <CiCirclePlus size={20} /> */}
                            </span>
                        </Form.Label>
                    </Col>
                    {accreditationDetails.map((accreditation, index) => (
                        <React.Fragment key={index}>
                            <Col sm={4}>
                                <Form.Control
                                    type="text"
                                    value={accreditation?.name}
                                    placeholder="Name"
                                    onChange={(e) => handleAccreditationInputChange(e, 'name', index)}
                                // onKeyPress={han  dleFirstSpace}
                                />
                            </Col>
                            <Col sm={4}>
                                {/* <Form.Control
                                    type="text"
                                    value={accreditation?.number || ''}
                                    {...register('accDocno', {
                                        pattern: {
                                            value: /^[0-9]*$/,
                                            message: 'Document no must be a number'
                                        },
                                    })}
                                    placeholder="Document Number"
                                    onChange={(e) => handleAccreditationInputChange(e, 'number', index)}
                                    onKeyPress={(event) => handleFirstSpace(event, 0)}
                                />
                                {errors.accDocno && <span className="text-danger">{errors.accDocno.message}</span>} */}
                                <Form.Control
                                    type="text"
                                    value={accreditation?.number || ''}
                                    placeholder="Document Number"
                                    onChange={(e) => handleAccreditationInputChange(e, 'number', index)}
                                    onKeyPress={(event) => handleFirstSpace(event, 0)}
                                />
                                {errors?.accDocno && index === 0 && (
                                    <span className="text-danger">{errors.accDocno.message}</span>
                                )}

                            </Col>
                            <Col sm={4} className="mb-2 position-relative">
                                <div
                                    onClick={() => document.getElementById(`fileInput-accreditation=${index}`).click()}
                                    //  onClick={() => accreditationFileInputRef.current.click()}
                                    className={`custom-file-upload justify-content-between cursor-pointer ${accreditation.fileName || accUploading ? 'form-control' : 'custom-form-fields'}`}>
                                    {/* {accreditation.fileName ? accreditation?.fileName?.length > 30 ? accreditation?.fileName?.slice(0, 25) + '...' : accreditation?.fileName : 'Upload Document'} */}
                                    {accUploading
                                        ? accreditation?.fileName
                                            ? `${accreditation.fileName.length > 30
                                                ? accreditation.fileName.slice(0, 25) + '...'
                                                : accreditation.fileName} - Uploading...`
                                            : 'Uploading...'
                                        : accreditation?.fileName
                                            ? accreditation.fileName.length > 30
                                                ? accreditation.fileName.slice(0, 25) + '...'
                                                : accreditation.fileName
                                            : 'Upload Document'}

                                    {/* <p className='mb-0'><FiDownloadCloud /></p> */}
                                    {/* <p
                                        onClick={() => handleRemoveAccreditation(index)}
                                        style={{ right: '-2%', top: '20%' }}
                                        className={`${accreditationDetails.length <= 1 ? 'd-none' : ''} uil-minus-circle cursor-pointer position-absolute fw-bold text-danger`}>
                                    </p> */}
                                </div>
                                {/* <img className={`${accreditation ? "" : "d-none"}`} src={accreditation?.url} alt='...' /> */}
                                <Form.Control
                                    type="file"
                                    id={`fileInput-accreditation=${index}`}
                                    className="rounded-circle "
                                    style={{ display: 'none' }}
                                    // ref={accreditationFileInputRef}
                                    onChange={(e) => handleAccreditationChange(e, index)}
                                />
                                <span
                                    onClick={() => handleRemoveAccreditation(index)}
                                    style={{ right: '-0.4%', top: '20%' }}
                                    className={`${accreditationDetails.length <= 1 ? 'd-none' : ''} uil-minus-circle cursor-pointer position-absolute fs-5 fw-bold text-danger`}>
                                </span>
                            </Col>

                        </React.Fragment>
                    ))}

                    <hr />

                    <Col sm={12} className="position-relative">
                        <Form.Label ref={containerRef}>
                            State of Licensure&nbsp;
                            <span
                                onClick={() => setStatesMenu(!statesMenu)}
                                className={`plusicon ms-1 fs-5 ${statesMenu ? 'uil-angle-down' : 'uil-angle-up'} fw-bold cursor-pointer`}
                            ></span>
                            <div
                                // ref={menuRef}
                                className={`scroll-container ${statesMenu ? '' : 'd-none'} bg-white border border-secondary position-absolute ps-1 py-1`}
                                style={{ height: '14rem', width: '12em', zIndex: '111' }}
                            >
                                {/* <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}> */}
                                {statesData?.states?.map((data, index) => (
                                    <div className='d-flex align-items-center px-1' key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }} onClick={() => handleCheckboxChange(data?.name)}
                                    >
                                        {selectedStates.includes(data?.name) ?
                                            <MdOutlineRadioButtonChecked />
                                            :
                                            <MdOutlineRadioButtonUnchecked />
                                        }
                                        <span className='ps-1'>
                                            {data?.name}
                                        </span>
                                    </div>
                                ))}
                                {/* </ul> */}
                            </div>
                        </Form.Label>
                    </Col>
                    {stateDetails.map((data, index) => (
                        <React.Fragment key={index}>
                            <Col sm={4}>
                                <Form.Control
                                    type="text"
                                    value={data.name}
                                    readOnly // Display selected state name
                                    placeholder="State"
                                />
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
                                <div
                                    onClick={() => document.getElementById(`fileInput-state=${index}`).click()}
                                    className={`custom-file-upload justify-content-between cursor-pointer ${data.fileName || stateUploading ? 'form-control' : 'custom-form-fields'
                                        }`}
                                >
                                    {stateUploading
                                        ? data?.fileName
                                            ? `${data.fileName.length > 30
                                                ? data.fileName.slice(0, 25) + '...'
                                                : data.fileName} - Uploading...`
                                            : 'Uploading...'
                                        : data?.fileName
                                            ? data.fileName.length > 30
                                                ? data.fileName.slice(0, 25) + '...'
                                                : data.fileName
                                            : 'Upload Document'}

                                    <p className="mb-0">
                                        <FiDownloadCloud />
                                    </p>
                                </div>
                                <Form.Control
                                    type="file"
                                    id={`fileInput-state=${index}`}
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleStateChange(e, index)}
                                />
                                <span
                                    onClick={() => handleRemoveState(index)}
                                    className={`${stateDetails.length <= 1 ? 'd-none' : ''
                                        } uil-minus-circle cursor-pointer position-absolute fs-5 fw-bold text-danger`}
                                    style={{ right: '-0.4%', top: '22%' }}
                                ></span>
                            </Col>
                        </React.Fragment>
                    ))}
                    <hr />
                    <Col sm={12}>
                        <Row>
                            <Col sm={12} className='mb-2'>
                                <span className='text-black fw-semibold form-label'>Address Details</span>
                            </Col>
                            <Col sm={6}>
                                <Row className='position-relative'>
                                    <Col sm={12}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className="mb-1">Address</Form.Label>
                                            <div style={{ position: 'relative' }}>
                                                <Form.Control
                                                    type="text"
                                                    {...register('address', {
                                                    })}
                                                    onChange={(e) => {
                                                        getGeolocation(e);
                                                        setFocused(true);
                                                        clearErrors('address');
                                                        setResetEmail((prevState) => ({
                                                            ...prevState,
                                                            primaryAddress: {
                                                                ...prevState.primaryAddress, // Preserve other fields inside primaryAddress
                                                                address: e.target.value,     // Update only the address field
                                                            }
                                                        }));
                                                    }}

                                                    onFocus={() => setFocused(true)}
                                                    onBlur={() => {
                                                        setTimeout(() => setFocused(false), 200);
                                                    }}
                                                    placeholder="Search for address"
                                                    autoComplete="off"
                                                />
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        top: '100%',
                                                        left: 0,
                                                        width: '100%',
                                                        maxHeight: '150px',
                                                        zIndex: 111,
                                                        backgroundColor: '#fff',
                                                        border: '1px solid #ced4da',
                                                        borderTop: 'none',
                                                    }}
                                                    className={`scroll-container hover-bg-change ${searchedLocations?.length === 0 || !focused ? 'd-none' : ''}`}
                                                >
                                                    {searchedLocations?.map((data, index) => (
                                                        <p
                                                            key={index}
                                                            onClick={() => {
                                                                setValue('zip', data?.components?.postcode)
                                                                setValue('stateName', data?.components?.state_code)
                                                                setLatitude(data?.bounds?.southwest?.lat);
                                                                setLongitude(data?.bounds?.southwest?.lng);
                                                                setCitySearch(data?.components?.county)
                                                                setValue('address', data?.formatted)
                                                                setFocused(false);
                                                                setResetEmail((prevState) => ({
                                                                    ...prevState,
                                                                    primaryAddress: {
                                                                        ...prevState.primaryAddress, // Preserve other fields inside primaryAddress
                                                                        ...(data?.formatted ? { address: data?.formatted } : {}),     // Update only the address field
                                                                        ...(data?.components?.postcode ? { zip: data?.components?.postcode } : {}),     // Update only the address field
                                                                        ...(data?.bounds?.southwest?.lat ? { latitude: data?.bounds?.southwest?.lat } : {}),     // Update only the address field
                                                                        ...(data?.bounds?.southwest?.lng ? { longitude: data?.bounds?.southwest?.lng } : {}),     // Update only the address field
                                                                        // latitude: data?.bounds?.southwest?.lat,
                                                                        // longitude: data?.bounds?.southwest?.lng,
                                                                        // zip: data?.components?.postcode,
                                                                    }
                                                                }));
                                                            }}
                                                            style={{
                                                                margin: 0,
                                                                padding: '8px 12px',
                                                                cursor: 'pointer',
                                                            }}
                                                            className="hover-bg-change text-black"
                                                        >
                                                            {data?.formatted}
                                                        </p>
                                                    ))}
                                                    {searchedLocations?.length === 0 && <p className="text-muted px-2 py-1">No results found</p>}
                                                </div>
                                            </div>
                                            {errors.address && <span className="text-danger">{errors.address.message}</span>}
                                        </Form.Group>
                                    </Col>

                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className='mb-1'>Latitude</Form.Label>
                                            <Form.Control
                                                type="text"
                                                defaultValue={latitude}
                                                placeholder="Latitude"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className='mb-1'>Longitude</Form.Label>
                                            <Form.Control
                                                type="text"
                                                defaultValue={longitude}
                                                placeholder="Longitude" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Col>
                            <Col sm={6}>
                                <Row>
                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className='mb-1' >State</Form.Label>
                                            <Form.Select
                                                {...register('stateName')}
                                                data-has-value={!!getValues('stateName')}
                                                onBlur={(e) => {
                                                    e.target.setAttribute('data-has-value', !!e.target.value);
                                                }}
                                                onChange={(e) => {
                                                    handleStateSelection(e, 'primary');
                                                    clearErrors('stateName')
                                                }}
                                            >
                                                <option value=''>State</option>
                                                {statesData?.states?.map((data) => (
                                                    <option
                                                        key={data?.name}
                                                        data-key={data?.id}
                                                        value={data?.state_code}
                                                    >
                                                        {data?.name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            {errors.stateName && <span className="text-danger">{errors.stateName.message}</span>}
                                        </Form.Group>

                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className='mb-1'>City</Form.Label>
                                            <Form.Select
                                                disabled={store?.getCitiesReducer?.loading}
                                                {...register('city')}
                                                data-has-value={!!getValues('city')}
                                                onBlur={(e) => {
                                                    e.target.setAttribute('data-has-value', !!e.target.value);
                                                }}
                                                onChange={(e) => {
                                                    handleCitySelection(e);
                                                    clearErrors('city');
                                                }}
                                            >
                                                <option value='' >{store?.getCitiesReducer?.loading ? 'Loading...' : 'City'}</option>
                                                {cities1?.map((data) => (
                                                    <option key={data?.name} value={data?._id}>
                                                        {data?.name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            {errors.city && <span className="text-danger">{errors.city.message}</span>}
                                        </Form.Group>
                                    </Col>

                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className='mb-1'>Street</Form.Label>
                                            <Form.Control
                                                type="text"
                                                {...register('street')}
                                                onKeyPress={handleFirstSpace}
                                                onChange={(e) => {
                                                    clearErrors('street');
                                                    setResetEmail((prevState) => ({
                                                        ...prevState,
                                                        primaryAddress: {
                                                            ...prevState.primaryAddress, // Preserve other fields inside primaryAddress
                                                            street: e.target.value,     // Update only the address field
                                                        }
                                                    }));
                                                }}
                                                placeholder="Street" />
                                            {errors.street && <span className="text-danger">{errors.street.message}</span>}
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className='mb-1'>Zip</Form.Label>
                                            <Form.Control
                                                defaultValue={updatePage ? clinicDataToUpdate?.address?.zip : ''}
                                                type="text"
                                                {...register('zip', {
                                                    minLength: {
                                                        value: 5,
                                                        message: 'ZIP code must be at least 5 characters long',
                                                    },
                                                    pattern: {
                                                        value: /^[0-9]+$/,
                                                        message: 'ZIP code must contain numbers only',
                                                    },
                                                })}
                                                onKeyPress={handleFirstSpace}
                                                placeholder="Zip"
                                                maxLength={5}
                                            />
                                            {errors.zip && <span className="text-danger">{errors.zip.message}</span>}
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                    <hr />
                    <Col sm={12}>
                        <Row>
                            <Col sm={12} className='mb-2'>
                                <span className='text-black fw-semibold form-label'>Mailing Address</span>
                                <Form.Check
                                    type="checkbox"
                                    label="Same as Primary Address"
                                    disabled={
                                        !(
                                            resetEmail?.primaryAddress?.address &&
                                            resetEmail?.primaryAddress?.zip &&
                                            resetEmail?.primaryAddress?.street &&
                                            resetEmail?.primaryAddress?.state &&
                                            resetEmail?.primaryAddress?.city
                                        )
                                    }

                                    // style={{ cursor: getValues('zip') === '' ? 'not-allowed' : '' }}
                                    onChange={(e) => {

                                        if (e.target.checked) {
                                            setSameAsPrimary(true);
                                            setValue('mailingAddress', getValues('address'));
                                            setValue('mailingZip', getValues('zip'));
                                            setValue('mailingStreet', getValues('street'));
                                            setMailingLatitude(latitude);
                                            setMailingLongitude(longitude);
                                        } else {
                                            setSameAsPrimary(false)
                                            setValue('mailingAddress', '');
                                            setValue('mailingZip', '');
                                            setValue('mailingStreet', '');
                                            setMailingLatitude(null);
                                            setMailingLongitude(null);
                                        }
                                    }}
                                />
                            </Col>
                            <Col sm={6}>
                                <Row className='position-relative'>
                                    <Col sm={12}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className="mb-1">Address</Form.Label>
                                            <div style={{ position: 'relative' }}>
                                                <Form.Control
                                                    type="text"
                                                    defaultValue={updatePage ? clinicDataToUpdate?.address?.address1 : ''}
                                                    {...register('mailingAddress')}
                                                    onChange={(e) => {
                                                        getMailingGeolocation(e);
                                                        setMailingFocused(true);
                                                        clearErrors('mailingAddress')
                                                    }}
                                                    onFocus={() => setMailingFocused(true)}
                                                    onBlur={() => {
                                                        setTimeout(() => setMailingFocused(false), 200);
                                                    }}
                                                    placeholder="Search for address"
                                                    autoComplete="off"
                                                />
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        top: '100%',
                                                        left: 0,
                                                        width: '100%',
                                                        maxHeight: '150px',
                                                        zIndex: 111,
                                                        backgroundColor: '#fff',
                                                        border: '1px solid #ced4da',
                                                        borderTop: 'none',
                                                    }}
                                                    className={`scroll-container hover-bg-change ${searchedMailingLocations?.length === 0 || !mailingFocused ? 'd-none' : ''}`}
                                                >
                                                    {searchedMailingLocations?.map((data, index) => (
                                                        <p
                                                            key={index}
                                                            onClick={() => {
                                                                setValue('mailingZip', data?.components?.postcode)
                                                                setValue('mailingStateName', data?.components?.state_code)
                                                                setMailingLatitude(data?.bounds?.southwest?.lat);
                                                                setMailingLongitude(data?.bounds?.southwest?.lng);
                                                                setMailingCitySearch(data?.components?.county)
                                                                setValue('mailingAddress', data?.formatted)
                                                                setMailingFocused(false);
                                                            }}
                                                            style={{
                                                                margin: 0,
                                                                padding: '8px 12px',
                                                                cursor: 'pointer',
                                                            }}
                                                            className="hover-bg-change text-black"
                                                        >
                                                            {data?.formatted}
                                                        </p>
                                                    ))}
                                                    {searchedMailingLocations?.length === 0 && <p className="text-muted px-2 py-1">No results found</p>}
                                                </div>
                                            </div>
                                            {errors.mailingAddress && <span className="text-danger">{errors.mailingAddress.message}</span>}
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className='mb-1'>Latitude</Form.Label>
                                            <Form.Control
                                                type="text"
                                                defaultValue={mailingLatitude}
                                                placeholder="Latitude"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className='mb-1'>Longitude</Form.Label>
                                            <Form.Control
                                                type="text"
                                                defaultValue={mailingLongitude}
                                                placeholder="Longitude" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Col>
                            <Col sm={6}>
                                <Row>
                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className='mb-1' >State</Form.Label>
                                            {sameAsPrimary ?
                                                <Form.Control
                                                    onChange={() => clearErrors('mailingStateName')}
                                                    value={statesData?.states?.find((data) => data?.state_code === getValues('stateName'))?.name}
                                                    readOnly />
                                                :
                                                <Form.Select
                                                    {...register('mailingStateName')}
                                                    data-has-value={!!getValues('mailingStateName')}
                                                    onBlur={(e) => {
                                                        e.target.setAttribute('data-has-value', !!e.target.value);
                                                    }}
                                                    onChange={(e) => {
                                                        handleMailingStateSelection(e);
                                                        clearErrors('mailingStateName')
                                                    }}
                                                >
                                                    <option value=''>State</option>
                                                    {statesData?.states?.map((data) => (
                                                        <option
                                                            key={data?.name}
                                                            data-key={data?.id}
                                                            value={data?.state_code}
                                                        >
                                                            {data?.name}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            }
                                            {errors.mailingStateName && <span className="text-danger">{errors.mailingStateName.message}</span>}
                                        </Form.Group>

                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className='mb-1'>City</Form.Label>
                                            {sameAsPrimary ?
                                                <Form.Control
                                                    value={cities1?.find((data) => data?._id === getValues('city'))?.name}
                                                    readOnly />
                                                :
                                                <Form.Select
                                                    disabled={store?.getCitiesReducer?.loading}
                                                    {...register('mailingCity')}
                                                    data-has-value={!!getValues('mailingCity')}
                                                    onBlur={(e) => {
                                                        e.target.setAttribute('data-has-value', !!e.target.value);
                                                    }}
                                                    onChange={(e) => handleCitySelection(e)}
                                                >
                                                    <option value='' >{store?.getCitiesReducer?.loading ? 'Loading...' : 'City'}</option>
                                                    {cities2?.map((data) => (
                                                        <option key={data?.name} value={data?._id}>
                                                            {data?.name}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            }
                                            {errors.mailingCity && <span className="text-danger">{errors.mailingCity.message}</span>}
                                        </Form.Group>
                                    </Col>

                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className='mb-1'>Street</Form.Label>
                                            <Form.Control
                                                type="text"
                                                {...register('mailingStreet')}
                                                onKeyPress={handleFirstSpace}
                                                placeholder="Street" />
                                            {errors.mailingStreet && <span className="text-danger">{errors.mailingStreet.message}</span>}
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className='mb-1'>Zip</Form.Label>
                                            <Form.Control
                                                defaultValue={updatePage ? clinicDataToUpdate?.address?.zip : ''}
                                                type="text"
                                                {...register('mailingZip', {
                                                    minLength: {
                                                        value: 5,
                                                        message: 'ZIP code must be at least 5 characters long',
                                                    },
                                                    pattern: {
                                                        value: /^[0-9]+$/,
                                                        message: 'ZIP code must contain numbers only',
                                                    },
                                                })}
                                                onKeyPress={handleFirstSpace}
                                                placeholder="Zip"
                                                maxLength={5}
                                            />
                                            {errors.mailingZip && <span className="text-danger">{errors.mailingZip.message}</span>}
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
                                <span className="text-black fw-semibold form-label">
                                    POC (Point of contact)
                                    <span
                                        onClick={handleAddPOS}
                                        className="plusicon ms-1 fs-5 uil-plus-circle fw-bold cursor-pointer">
                                    </span>
                                </span>
                            </Col>
                            {posDetails.map((data, index) => (
                                <React.Fragment key={index}>
                                    <Col sm={12} className="form-label">
                                        {'POS ' + `${index + 1}`}
                                        <span
                                            onClick={() => handleRemovePOS(index)}
                                            className={`${posDetails.length <= 1 ? 'd-none' : ''} uil-minus-circle cursor-pointer fs-5 fw-bold text-danger`}
                                        />
                                    </Col>

                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className="mb-1">
                                                Full Name
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                {...register(`pocFullName${index}`)}
                                                value={data.name}
                                                onChange={(e) => {
                                                    clearErrors(`pocFullName${index}`);
                                                    handlePOSInputChange(e, 'name', index);
                                                }}
                                                onKeyPress={handleFirstSpace}
                                                placeholder="Full Name"
                                            />
                                            {errors[`pocFullName${index}`] && (
                                                <span className="text-danger">{errors[`pocFullName${index}`]?.message}</span>
                                            )}
                                        </Form.Group>
                                    </Col>

                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className="mb-1">Contact Email</Form.Label>
                                            <Form.Control
                                                type="email"
                                                value={data.email}
                                                {...register(`contactemail${index}`, {
                                                    pattern: {
                                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                        message: 'Please enter a valid email address',
                                                    },
                                                })}
                                                onChange={(e) => handlePOSInputChange(e, 'email', index)}
                                                placeholder="Contact Email"
                                            />
                                            {errors[`contactemail${index}`] && (
                                                <span className="text-danger">{errors[`contactemail${index}`]?.message}</span>
                                            )}
                                        </Form.Group>
                                    </Col>

                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className="mb-1">Job Title / Role</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Job Title / Role"
                                                onKeyPress={handleFirstSpace}
                                                onChange={(e) => handlePOSInputChange(e, 'role', index)}
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col sm={6}>
                                        <Form.Group className="mb-2 position-relative">
                                            <Form.Label className="mb-1">Phone Number</Form.Label>
                                            <InputGroup>
                                                <InputGroup.Text className="ps-3 pe-1 fw-bold text-black">&nbsp;&nbsp;+1</InputGroup.Text>
                                                <Form.Control
                                                    type="text"
                                                    value={data.contact}
                                                    {...register(`pocContact${index}`, {
                                                        pattern: {
                                                            value: /^[0-9]*$/,
                                                            message: 'Contact must be a number',
                                                        },
                                                        maxLength: {
                                                            value: 10,
                                                            message: 'Contact must not exceed 10 digits',
                                                        },
                                                        minLength: {
                                                            value: 9,
                                                            message: 'Contact must not be less than 9 digits',
                                                        },
                                                    })}
                                                    onChange={(e) => handlePOSInputChange(e, 'contact', index)}
                                                    onKeyPress={handleFirstSpace}
                                                    placeholder="Phone Number"
                                                    maxLength={10}
                                                />
                                            </InputGroup>
                                            <div className="position-absolute" style={{ top: '52%', left: '1%' }}>
                                                <img src={us} alt="country code flag" width={20} />
                                            </div>
                                        </Form.Group>
                                        {errors[`pocContact${index}`] && (
                                            <span className="text-danger pt-0">{errors[`pocContact${index}`]?.message}</span>
                                        )}
                                    </Col>
                                </React.Fragment>
                            ))}

                        </Row>

                    </Col>
                    <hr />
                    <Col md={12} className='mt-2 d-flex gap-2 justify-content-end'>

                        <Button variant="primary" type='submit' className='custom-buttons' disabled={!formValid || store?.createClinicsReducer?.loading}
                            onClick={() => {
                                if (!parentClincId) {
                                    setCounter(1)
                                } else {
                                    setCounter(2)
                                }
                            }}
                        >
                            {store?.createClinicsReducer?.loading && parentClincId ?
                                <Spinner color='white' className='spinner-border-sm' />
                                :
                                'Add Multiple Practices'
                            }
                        </Button>
                        <Button
                            variant="primary"
                            type={!parentClincId ? 'submit' : 'button'}
                            className='custom-buttons'
                            disabled={!formValid || store?.createClinicsReducer?.loading}
                            onClick={() => {
                                if (parentClincId && !isModalRequest) {
                                    setMultiple(counter)
                                    setActiveTab('billing');
                                    // setSingleOrMultiple(false);
                                    // setCounter(0);
                                }
                            }}
                        >
                            {store?.createClinicsReducer?.loading && !parentClincId ?
                                <Spinner color='white' className='spinner-border-sm' />
                                :
                                'Next'
                            }
                        </Button>
                    </Col>
                </Row >
            </Form >
            <Row className={`${clinicsList?.length > 0 || clinicData && parentClincId ? '' : 'd-none'}`}>
                <Col>
                    <Table responsive className="mt-3 table-centered border border-muted table-nowrap mb-0 ">
                        <thead>
                            <tr>
                                <th>Clinic Name</th>
                                <th>Location</th>
                                <th>Clinic Type</th>
                                <th>Email</th>
                                <th>Contact</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody className={`${!parentClincId ? 'd-none' : ''}`}>
                            <tr>
                                <td className='text-capitalize'>{clinicData?.name}</td>
                                <td>{(clinicData?.userId?.primaryAddress?.city?.state_code || 'N/A') + ' / ' + (clinicData?.userId?.primaryAddress?.city?.name || 'N/A')}</td>
                                <td>{clinicData?.clinicType}</td>
                                <td>{clinicData?.userId?.email}</td>
                                <td>{clinicData?.userId?.phone}</td>
                                <td style={{ cursor: 'not-allowed !important' }}> <i
                                    className="mdi mdi-delete cursor-pointer"
                                    style={{ cursor: 'not-allowed' }}
                                ></i></td>
                            </tr>
                            {store?.getClinicsByParentReducer?.loading ?
                                <tr>
                                    <td colSpan={5} className='text-center'>
                                        <Spinner />
                                    </td>
                                </tr>
                                :

                                clinicsList?.map((multipleData, index) => (
                                    <tr key={multipleData?._id}>
                                        <td className='text-capitalize'>{multipleData?.name}</td>
                                        <td>{(multipleData?.userId?.primaryAddress?.city?.state_code || 'N/A') + ' / ' + (multipleData?.userId?.primaryAddress?.city?.name || 'N/A')}</td>
                                        <td>{multipleData?.clinicType}</td>
                                        <td className='text-lowercase'>{multipleData?.userId?.email}</td>
                                        <td>{multipleData?.userId?.phone}</td>
                                        <td className='fs-4 d-flex gap-1'>
                                            <Link to={`/apps/rcm/updateclinic?updateid=${multipleData?._id}`} className="action-icon">
                                                <i className="mdi mdi-square-edit-outline cursor-pointer"></i>
                                            </Link>
                                            <i
                                                className="mdi mdi-delete cursor-pointer"
                                                style={{ cursor: store?.deleteClinicOnboardingReducer?.loading ? "not-allowed" : 'pointer' }}
                                                onClick={() => {
                                                    const payload = {
                                                        id: multipleData?._id,
                                                    };
                                                    dispatch(deleteClinicAction({ key: encryptMessage(payload) }));
                                                }}
                                            ></i>
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