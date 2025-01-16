import React, { useEffect, useState } from 'react';
import PageTitle from '../../../components/PageTitle';
import { Card, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import { FormInput } from '../../../components';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getPatientsAction } from '../../../redux/patients/actions';
import Spinner from '../../../constants/Spinner';
import Paginations from '../../../helpers/Paginations';
import { IoMdClose } from 'react-icons/io';
import { formatDate } from '../../../helpers/dateFormat';
const calculateAge = (dob) => {
    if (!dob) return null; // Handle missing or invalid dates
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    // Adjust age if the current date is before the birthday this year
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};


const Patients = () => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const [clinicId, setClinicId] = useState('');
    const [skip, setSkip] = useState(1);
    const [search, setSearch] = useState('');
    const [detailsModal, setDetailsModal] = useState(false);
    const [selectedDetails, setSelectedDetails] = useState(null);
    const decrytedPatientsData = store?.getPatientsReducer?.data?.patients;
    useEffect(() => {
        const payload = {
            clinicId: clinicId,
            skip: skip,
            limit: 10,
            search: search,
        }
        dispatch(getPatientsAction({ payload }));
    }, [dispatch, search, skip])
    const handlePageChange = (pageNumber) => {
        setSkip(pageNumber);
    };
    const closeDetailsModal = () => {
        setDetailsModal(false);
        setSelectedDetails(null);
    };

    return (
        <>
            {/* <PageTitle
                breadCrumbItems={[
                    { label: 'Patients', path: '/apps/patients/list', active: true },
                ]}
                title={'Patients'}
            /> */}
            <Row className='mt-2'>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Row className="mb-2">
                                <Col xs="auto">
                                    <FormInput onChange={(e) => setSearch(e.target.value)} type="text" name="search" placeholder="Search..." />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Table responsive className="table-centered table-nowrap mb-0">
                                        <thead className="tablelight">
                                            <tr key={''}>
                                                <th>Sr. No.</th>
                                                <th>Patients name</th>
                                                <th>Age</th>
                                                <th>Gender</th>
                                                <th>Amount</th>
                                                <th>Appointment Date</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {store?.getPatientsReducer?.loading ?
                                                <tr>
                                                    <td colSpan={8} className='text-center py-5'>
                                                        <Spinner />
                                                    </td>
                                                </tr>
                                                :
                                                store?.getPatientsReducer?.data?.total === 0 ?
                                                    <tr>
                                                        <td colSpan={8} className='text-center'>
                                                            <h3 className='my-5'>No Data Found</h3>
                                                        </td>
                                                    </tr>
                                                    :
                                                    decrytedPatientsData?.map((data, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td className='text-capitalize'>
                                                                {data?.firstName + ' ' + data?.lastName}
                                                            </td>
                                                            <td>
                                                                {data?.dob ? calculateAge(data.dob) : 'N/A'}
                                                            </td>

                                                            <td>
                                                                {data?.gender}
                                                            </td>
                                                            <td>
                                                                {data?.amount || '----'}
                                                            </td>
                                                            <td>
                                                                {formatDate(data?.appointments[0]?.date)}
                                                            </td>
                                                            <td>
                                                                {data?.status || '---   '}
                                                            </td>
                                                            <td>
                                                                <Link to="#" className="action-icon">
                                                                    <i
                                                                        onClick={() => {
                                                                            setDetailsModal(true);
                                                                            setSelectedDetails(data);
                                                                        }}
                                                                        className="mdi mdi-eye"></i>
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))
                                            }
                                        </tbody>
                                    </Table>
                                    <Row>
                                        <Col className='mt-2 d-flex justify-content-end'>
                                            <Paginations
                                                currentPage={skip}
                                                totalPages={store?.getPatientsReducer?.data?.totalPages}
                                                onPageChange={handlePageChange}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Modal centered show={detailsModal} onHide={closeDetailsModal}>
                {/* <Modal.Header
                    onHide={closeDetailsModal}
                    closeButton
                    className={'modal-colored-header pb-0 border-0 text-center'}>
                </Modal.Header> */}
                <Modal.Body>
                    <Row className="border-bottom mb-2 pb-2 d-flex align-items-center">
                        <Col sm={1}></Col>
                        <Col sm={10}>
                            <h4 className="mb-0 text-center">Patient Details</h4>
                        </Col>
                        <Col sm={1}>
                            <IoMdClose className="fs-4 cursor-pointer" onClick={closeDetailsModal} />
                        </Col>
                    </Row>
                    {/* <h4 className="mt-0 text-center">Patient Details</h4> */}
                    <Row>
                        <Col className='light-border-bottom d-flex justify-content-between align-items-center'>
                            <Col sm={6}>
                                <h5>Name</h5>
                            </Col>
                            <Col sm={6}>
                                <p className='mb-0 text-start'>
                                    {selectedDetails?.firstName + ' ' + selectedDetails?.lastName}
                                </p>
                            </Col>
                        </Col>
                    </Row>
                    <Row>
                        <Col className='light-border-bottom d-flex justify-content-between align-items-center'>
                            <Col sm={6}>
                                <h5>Gender</h5>
                            </Col>
                            <Col sm={6}>
                                <p className='mb-0 text-start'>
                                    {selectedDetails?.gender}
                                </p>
                            </Col>
                        </Col>
                    </Row>
                    <Row>
                        <Col className='light-border-bottom d-flex justify-content-between align-items-center'>
                            <Col sm={6}>
                                <h5>Email</h5>
                            </Col>
                            <Col sm={6}>
                                <p className='mb-0 text-start'>{selectedDetails?.email}</p>
                            </Col>
                        </Col>
                    </Row>
                    <Row>
                        <Col className='light-border-bottom d-flex justify-content-between align-items-center'>
                            <Col sm={6}>
                                <h5>Phone</h5>
                            </Col>
                            <Col sm={6}>
                                <p className='mb-0 text-start'>{selectedDetails?.phone}</p>
                            </Col>
                        </Col>
                    </Row>
                    <Row>
                        <Col className='light-border-bottom d-flex justify-content-between align-items-center'>
                            <Col sm={6}>
                                <h5>Insaurance Provider</h5>
                            </Col>
                            <Col sm={6}>
                                <p className='mb-0 text-start'>{selectedDetails?.insuranceProvider}</p>
                            </Col>
                        </Col>
                    </Row>
                    <Row>
                        <Col className='light-border-bottom d-flex justify-content-between align-items-center'>
                            <Col sm={6}>
                                <h5>Address</h5>
                            </Col>
                            <Col sm={6}>
                                <p className='mb-0 text-start'>
                                    {`${selectedDetails?.address?.street}, ${selectedDetails?.address?.city}, ${selectedDetails?.address?.state} (${selectedDetails?.address?.zipCode})`}
                                </p>
                            </Col>
                        </Col>
                    </Row>
                    <Row>
                        <Col className='light-border-bottom d-flex justify-content-between align-items-center'>
                            <Col sm={6}>
                                <h5>Plan type</h5>
                            </Col>
                            <Col sm={6}>
                                <p className='mb-0 text-start'>{selectedDetails?.insurancePlan}</p>
                            </Col>
                        </Col>
                    </Row>


                    <Row>
                        <Col className='light-border-bottom d-flex justify-content-between align-items-center'>
                            <Col sm={6}>
                                <h5>Policy no.</h5>
                            </Col>
                            <Col sm={6}>
                                <p className='mb-0 text-start'>{selectedDetails?.insurancePolicyNumber}</p>
                            </Col>
                        </Col>
                    </Row>
                    <Row>
                        <Col className='light-border-bottom d-flex justify-content-between align-items-center'>
                            <Col sm={6}>
                                <h5>Allergies</h5>
                            </Col>
                            <Col sm={6}>
                                <p className='mb-0 text-start'>
                                    {selectedDetails?.allergies}
                                </p>
                            </Col>
                        </Col>
                    </Row>
                    <Row>
                        <Col className='d-flex justify-content-between align-items-center'>
                            <Col sm={6}>
                                <h5>Emergency contacts</h5>
                            </Col>
                            <Col sm={6}>
                                <p className='mb-0 text-start'>
                                    {selectedDetails?.emergencyContacts?.map((data) => data?.phone).join(', ')}
                                </p>
                            </Col>
                        </Col>
                    </Row>

                </Modal.Body>
            </Modal>
        </>
    )
}

export default Patients