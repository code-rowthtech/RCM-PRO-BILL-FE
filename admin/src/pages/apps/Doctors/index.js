import React, { useEffect, useState } from 'react'
import PageTitle from '../../../components/PageTitle'
import { Button, Card, Col, Form, Modal, Row, Table } from 'react-bootstrap'
import { FormInput } from '../../../components'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getDoctorsAction } from '../../../redux/doctors/actions'
import Paginations from '../../../helpers/Paginations'
import Spinner from '../../../constants/Spinner'
import { IoMdClose } from 'react-icons/io'
import PasswordModal from '../../../helpers/viewContactModal'
const Doctors = () => {
    const [skip, setSkip] = useState(1);
    const [clinicId, setClinicId] = useState('');
    const [detailsModal, setDetailsModal] = useState(false);
    const [selectedDetails, setSelectedDetails] = useState(null);
    const [search, setSearch] = useState('');
    const [passwordModal, setPasswordModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const doctorsResponse = store?.getDoctorsReducer?.data?.data;
    useEffect(() => {
        const payload = {
            skip: skip,
            limit: 10,
            clinicId: clinicId,
            search: search,
        }
        dispatch(getDoctorsAction(payload))
    }, [dispatch, skip, search]);
    const handlePageChange = (pageNumber) => {
        setSkip(pageNumber);
    };
    const closeDetailsModal = () => {
        setDetailsModal(false);
        setSelectedDetails(null);
    };

    const closePasswordModal = () => {
        {
            setPasswordModal(false);
        }
    }

    const handlePasswordClick = () => {

    }
    return (
        <div>
            {/* <PageTitle
                breadCrumbItems={[
                    { label: 'Doctors', path: '/apps/doctors/list', active: true },
                ]}
                title={'Doctors'}
            /> */}
            <Row className='mt-2'>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Row className="mb-2">
                                <Col xs="auto">
                                    <FormInput
                                        type="text"
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search..." />
                                </Col>
                                <Col>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Table responsive className="table-centered table-nowrap mb-0">
                                        <thead className="ght">
                                            <tr key={''}>
                                                <th>Fullname</th>
                                                <th>Clinic Name</th>
                                                <th>City</th>
                                                <th>Contact</th>
                                                <th>E-mail</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {store?.getDoctorsReducer?.loading ?
                                                <tr>
                                                    <td colSpan={6} className='text-center'>
                                                        <Spinner />
                                                    </td>
                                                </tr>
                                                :
                                                store?.getDoctorsReducer?.data?.totalDocs === 0 ?
                                                    <tr>
                                                        <td colSpan={6} className='text-center'>
                                                            <h3 className='my-5'>No Data Found</h3>
                                                        </td>
                                                    </tr>
                                                    :

                                                    doctorsResponse?.map((data, index) => (
                                                        <tr key={index}>
                                                            <td>
                                                                <Link to="#" className="text-body fw-bold">
                                                                    {data?.title + ' ' + data?.firstName + " " + data?.lastName}
                                                                </Link>
                                                            </td>
                                                            <td className='text-capitalize'>{data?.clinicId?.name || 'N/A'}</td>
                                                            <td>
                                                                {data?.city}
                                                            </td>

                                                            <td onClick={handlePasswordClick}>
                                                                {showPassword ? data?.phone : '**********'}
                                                            </td>
                                                            <PasswordModal closeModal={closePasswordModal} show={passwordModal} setShowPassword={setShowPassword} />
                                                            <td className='text-lowercase'>
                                                                {data?.email}
                                                            </td>
                                                            <td>
                                                                <Link to="#" className="action-icon">
                                                                    <i
                                                                        onClick={() => {
                                                                            setDetailsModal(true);
                                                                            setSelectedDetails(data);
                                                                        }}
                                                                        className="mdi mdi-eye cursor-pointer"></i>
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))
                                            }

                                        </tbody>
                                    </Table>
                                </Col>

                            </Row>
                            <Row>
                                <Col className='mt-2 d-flex justify-content-end'>
                                    <Paginations
                                        currentPage={skip}
                                        totalPages={store?.getDoctorsReducer?.data?.totalPages}
                                        onPageChange={handlePageChange}
                                    />
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
                    className={'modal-colored-header pb-0 border-0 text-center'}> */}
                {/* </Modal.Header> */}
                <Modal.Body>
                    <Row className="border-bottom mb-2 pb-2 d-flex align-items-center">
                        <Col sm={1}></Col>
                        <Col sm={10}>
                            <h4 className="mb-0 text-center">Doctor Details</h4>
                        </Col>
                        <Col sm={1}>
                            <IoMdClose className="fs-4 cursor-pointer" onClick={closeDetailsModal} />
                        </Col>
                    </Row>
                    {/* <h4 className="mt-0 text-center">Doctor Details</h4> */}
                    <Row>
                        <Col className='light-border-bottom d-flex justify-content-between align-items-center'>
                            <Col sm={6}>
                                <h5>Name</h5>
                            </Col>
                            <Col sm={6}>
                                <p className='mb-0 text-start'>{selectedDetails?.title + ' ' + selectedDetails?.firstName + ' ' + selectedDetails?.lastName}</p>
                            </Col>
                        </Col>
                    </Row>
                    <Row>
                        <Col className='light-border-bottom d-flex justify-content-between align-items-center'>
                            <Col sm={6}>
                                <h5>Gender</h5>
                            </Col>
                            <Col sm={6}>
                                <p className='mb-0 text-start'>{selectedDetails?.gender}</p>
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
                                <h5>Bio</h5>
                            </Col>
                            <Col sm={6}>
                                <p className='mb-0 text-start'>{selectedDetails?.bio}</p>
                            </Col>
                        </Col>
                    </Row>
                    <Row>
                        <Col className='light-border-bottom d-flex justify-content-between align-items-center'>
                            <Col sm={6}>
                                <h5>Address</h5>
                            </Col>
                            <Col sm={6}>
                                <p className='mb-0 text-start'>{selectedDetails?.address}</p>
                            </Col>
                        </Col>
                    </Row>
                    <Row>
                        <Col className='light-border-bottom d-flex justify-content-between align-items-center'>
                            <Col sm={6}>
                                <h5>VAT</h5>
                            </Col>
                            <Col sm={6}>
                                <p className='mb-0 text-start'>{selectedDetails?.VAT}</p>
                            </Col>
                        </Col>
                    </Row>


                    <Row>
                        <Col className='light-border-bottom d-flex justify-content-between align-items-center'>
                            <Col sm={6}>
                                <h5>City</h5>
                            </Col>
                            <Col sm={6}>
                                <p className='mb-0 text-start'>{selectedDetails?.city}</p>
                            </Col>
                        </Col>
                    </Row>
                    <Row>
                        <Col className='light-border-bottom d-flex justify-content-between align-items-center'>
                            <Col sm={6}>
                                <h5>Clinic Name</h5>
                            </Col>
                            <Col sm={6}>
                                <p className='mb-0 text-start'>{selectedDetails?.clinicId?.name}</p>
                            </Col>
                        </Col>
                    </Row>
                    <Row>
                        <Col className='light-border-bottom d-flex justify-content-between align-items-center'>
                            <Col sm={6}>
                                <h5>D.O.B</h5>
                            </Col>
                            <Col sm={6}>
                                <p className='mb-0 text-start'>{selectedDetails?.dateOfBirth}</p>
                            </Col>
                        </Col>
                    </Row>
                    <Row>
                        <Col className='d-flex justify-content-between align-items-center'>
                            <Col sm={6}>
                                <h5>System Name</h5>
                            </Col>
                            <Col sm={6}>
                                <p className='mb-0 text-start'>{selectedDetails?.systemName}</p>
                            </Col>
                        </Col>
                    </Row>

                </Modal.Body>
            </Modal>
        </div>
    )
}

export default Doctors