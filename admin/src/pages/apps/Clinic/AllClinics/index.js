// @flow
import React, { useEffect, useState } from 'react';
import { Badge, Button, Card, Col, Form, Modal, Row, Table } from 'react-bootstrap';

// component
import PageTitle from '../../../../components/PageTitle';
import { FormInput } from '../../../../components';
// dummy data
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { getClinicAction, stateEmptydAction, updateClinicAction } from '../../../../redux/clinics/actions'
import Spinner from '../../../../constants/Spinner';
import Paginations from '../../../../helpers/Paginations';
import { encryptMessage } from '../../../../cryptoUtils';
import { IoMdClose } from 'react-icons/io';
import { GoAlert } from 'react-icons/go';

const OrderList = (): React$Element<React$FragmentType> => {
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [skip, setSkip] = useState(1);
    const [status, setStatus] = useState(true);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteData, setDeleteData] = useState(null);
    const store = useSelector((state) => state);
    const clinicsData = store?.getClinicsReducer?.data?.data;
    const updateSuccess = store?.updateClinicsReducer?.data?.status;
    useEffect(() => {
        const payload = {
            name: name,
            skip: skip,
            limit: 10,
            status: status,
        }
        dispatch(getClinicAction({ payload }));
        if (updateSuccess === 200) {
            dispatch(getClinicAction({ payload }))
            closeDeleteModal();
        }
    }, [dispatch, name, updateSuccess, skip, status])

    const handleStatusUpdate = () => {
        const payload = {
            id: deleteData?._id,
            status: !deleteData?.status
        }
        dispatch(updateClinicAction({ key: encryptMessage(payload) }));
        dispatch(stateEmptydAction());
    }

    const handlePageChange = (pageNumber) => {
        setSkip(pageNumber);
    };
    const handleStatusChange = (isActive) => {
        setStatus(isActive);
        setName('');
    };

    const closeDeleteModal = () => {
        setDeleteModal(false);
    }
    const handleOpenDeleteModal = (data) => {
        setDeleteModal(true);
        setDeleteData(data);
    }


    return (
        <>
            <Row className='mt-2'>
                <Col xs={12}>
                    <Card>
                        <Card.Body className='scroll-container' style={{ height: '88vh' }}>
                            <Row className="mb-2">
                                <Col sm={6}>
                                    <Button variant={status === false ? 'outlined' : ''}
                                        onClick={() => handleStatusChange(true)}
                                        className={`${status === true ? 'custom-buttons' : 'bg-none border-primary'} me-2`}
                                    >
                                        Active
                                    </Button>

                                    <Button variant={status === true ? 'outlined' : ''}
                                        onClick={() => handleStatusChange(false)}
                                        className={`${status === false ? 'custom-buttons' : 'bg-none border-primary'} me-2`}
                                    >
                                        Inactive
                                    </Button>
                                </Col>
                                <Col sm={6} className='text-end'>
                                    <Row className="gy-2 gx-2 align-items-center justify-content-xl-end justify-content-between ">
                                        <Col xs="auto" className='d-flex gap-2'>
                                            <FormInput
                                                type="text"
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Search..." />
                                            <Button as={Link} to="/apps/crm/addclinic" className="custom-buttons">
                                                New Clinic
                                            </Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Table responsive className="table-centered border border-muted table-nowrap mb-0">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th >Clinic Name</th>
                                        <th>Location</th>
                                        <th>Clinic Type</th>
                                        <th>End Date&nbsp; <span className=' uil-info-circle allclinics-info mb-0 cursor-pointer'
                                        // data-toggle="tooltip"
                                        // data-placement="top"
                                        // data-delay='{"show":"0", "hide":"3000"}'
                                        // title="Last Date of Subscription"
                                        /></th>
                                        <th>Countdown</th>
                                        <th>Contract</th>
                                        <th>Status</th>
                                        <th style={{ width: '125px' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {store?.getClinicsReducer?.loading ? (
                                        <tr>
                                            <td className='text-center' colSpan={9}>
                                                <Spinner className="spinner-border-lg m-2" />
                                            </td>
                                        </tr>
                                    ) : (
                                        store?.getClinicsReducer?.data?.totalClinics === 0 ? (
                                            <tr>
                                                <td className='text-center' colSpan={9}>
                                                    <h3 className='my-5'>No Data Found</h3>
                                                </td>
                                            </tr>
                                        ) : (
                                            clinicsData && clinicsData?.map((data, i) => {
                                                return (
                                                    <tr key={i}>
                                                        <td>{i + 1}</td>
                                                        <td className=''>
                                                            {/* <img
                                                                src={data?.logo}
                                                                alt="Placeholder"
                                                                className='rounded-circle'
                                                                width="40"
                                                                height="40"
                                                            /> */}
                                                            <p className='mb-0 text-capitalize'>{data?.name}</p>
                                                        </td>
                                                        <td>
                                                            {(data?.userId?.address?.city?.state_code || 'N/A') + ' / ' + (data?.userId?.address?.city?.name || 'N/A')}
                                                        </td>
                                                        <td>{data?.clinicType}</td>
                                                        <td>
                                                            {data?.userId?.subscription?.subscriptionRenewalDate
                                                                ? new Date(data.userId.subscription.subscriptionRenewalDate).toLocaleDateString('en-GB')
                                                                : 'N/A'}
                                                        </td>
                                                        <td>
                                                            {data?.userId?.subscription?.subscriptionRenewalDate
                                                                ? (() => {
                                                                    const today = new Date();
                                                                    const renewalDate = new Date(data.userId.subscription.subscriptionRenewalDate);
                                                                    const diffTime = renewalDate - today; // Difference in milliseconds
                                                                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert to days
                                                                    return diffDays >= 0
                                                                        ? `${diffDays} day${diffDays !== 1 ? 's' : ''}`
                                                                        : 'Expired';
                                                                })()
                                                                : 'N/A'}

                                                        </td>
                                                        <td>
                                                            <span
                                                                className={`${data?.userId?.contractId?.clinicSignStatus === true && data?.userId?.contractId?.adminSignStatus === true ? 'bg-success' : 'bg-secondary'} rounded-1 text-white py-0 px-1`}>
                                                                {data?.userId?.contractId?.clinicSignStatus === true && data?.userId?.contractId?.adminSignStatus === true ?
                                                                    'Signed'
                                                                    :
                                                                    'Pending'
                                                                }
                                                            </span>
                                                        </td>
                                                        <td>
                                                            {/* <span
                                                                //  onClick={() => handleStatusUpdate(data)}
                                                                className='bg-secondary rounded-1 text-white py-0 px-1'>
                                                                {data?.status === true ? 'Active' : 'Inactive'}
                                                            </span> */}
                                                            <Form.Switch
                                                                onClick={() => handleOpenDeleteModal(data)}
                                                                checked={data?.status === true} />
                                                        </td>
                                                        <td>
                                                            <Link to={`/apps/crm/updateclinic?updateid=${data?._id}`} className="action-icon">
                                                                <i className="mdi mdi-square-edit-outline"></i>
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )
                                    )}
                                </tbody>
                            </Table>
                            <Row>
                                <Col className='mt-2 d-flex justify-content-end'>
                                    <Paginations
                                        currentPage={skip}
                                        totalPages={store?.getClinicsReducer?.data?.totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Modal show={deleteModal} onHide={closeDeleteModal} centered size='md' >
                <Modal.Body>
                    <div>
                        <Row className="border-bottom mb-2 pb-2 d-flex align-items-center">
                            <Col sm={1}></Col>
                            <Col sm={10}>
                                <h4 className="mb-0  d-flex align-items-center justify-content-center"><span className='text-danger'><GoAlert />&nbsp;</span>{deleteData?.status === true ? 'Deactivate' : "Activate"} Clinic</h4>
                            </Col>
                            <Col sm={1}>
                                <IoMdClose className="fs-4 cursor-pointer" onClick={closeDeleteModal} />
                            </Col>
                        </Row>
                        <Row className=''>
                            {deleteData?.status === true ?
                                <Col sm={12}>
                                    <p className='mb-0'>
                                        Once this change is applied, please be aware that <strong>{deleteData?.name}</strong> will:
                                    </p>
                                    <ul>
                                        <li>Lose access to
                                            their account and will not be able to log in.</li>
                                        <li>All plans associated with their account will be deactivated or canceled.</li>
                                        <li>Any services linked to the
                                            account will be suspended and they will not be able to make any changes to account settings or details.</li>
                                    </ul>

                                    {/* <p>
                                        All plans associated with their account will be deactivated or canceled. Any services linked to the
                                        account will be suspended and they will not be able to make any changes to account settings or details.
                                    </p> */}
                                </Col>
                                :
                                <Col>
                                    After this {deleteData?.name} will have full access to their account, plans, and services.
                                </Col>
                            }
                            <Modal.Footer className='d-flex justify-content-end gap-2'>
                                <Button className='custom-buttons' onClick={closeDeleteModal}>
                                    Cancel
                                </Button>
                                <Button className='custom-buttons' disabled={store?.updateClinicsReducer?.loading} onClick={() => handleStatusUpdate()}>
                                    {store?.updateClinicsReducer?.loading ?
                                        <Spinner color='light' className='spinner-border-sm' />
                                        :
                                        deleteData?.status === true ? 'Deactivate' : "Activate"
                                    }
                                </Button>
                            </Modal.Footer>
                        </Row>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default OrderList;
