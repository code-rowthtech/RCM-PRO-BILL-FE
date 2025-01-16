import React, { useEffect, useState } from 'react'
import PageTitle from '../../../components/PageTitle'
import { Button, Card, Col, Form, Modal, Row, Table } from 'react-bootstrap'
import { FormInput } from '../../../components'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Paginations from '../../../helpers/Paginations'
import Spinner from '../../../constants/Spinner'
import { getSubscriptionsAction, stateEmptydAction, updateSubscriptionsAction } from '../../../redux/subscriptions/actions'
import AddSubscriptions from './Modal/createPlan'
import { encryptMessage } from '../../../cryptoUtils'
import UpdateSubscriptions from './Modal/updatePlan';
import { formatDate } from '../../../helpers/dateFormat'
import { userPermissions } from '../../../helpers/userPermissions'
import ToastHandle from '../../../helpers/ToastMessage'

const Subscriptions = () => {
    const [skip, setSkip] = useState(1);
    const [search, setSearch] = useState('');
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const [showModal, setShowModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [dataToUpdate, setDataToUpdate] = useState(null);
    const [status, setStatus] = useState(true);
    const subscriptionsResponse = store?.getSubscriptionsReducer?.data;
    const createSuccess = store?.createSubscriptionsReducer?.data?.status;
    const updateSuccess = store?.updateSubscriptionsReducer?.data?.status;
    const isAddPresent = userPermissions.includes('add subscription') || userPermissions.includes('ADD_A_SUBSCRIPTION');
    const isUpdatePresent = userPermissions.includes('edit subscription') || userPermissions.includes('UPDATE_A_SUBSCRIPTION');
    useEffect(() => {
        dispatch(getSubscriptionsAction({ status: status, search: search, skip: skip }));
        if (createSuccess === 201 || updateSuccess === 200) {
            dispatch(stateEmptydAction())
            dispatch(getSubscriptionsAction({ status: status, search: search, skip: skip }));
        }
    }, [dispatch, createSuccess, updateSuccess, status, skip, search])
    const handlePageChange = (pageNumber) => {
        setSearch('');
        setSkip(pageNumber);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setDataToUpdate(null)
    }

    const handleCloseUpdateModal = () => {
        setShowUpdateModal(false);
        setDataToUpdate(null);
    }

    const handleStatusUpdate = (data) => {
        dispatch(updateSubscriptionsAction({ key: encryptMessage({ id: data?._id, isActive: !data?.isActive, type: 'toggle' }) }))
        // if (isUpdatePresent) {
        // } else {
        //     ToastHandle('You are not authoized for updating subscription plans.', 'danger')
        // }
    }


    const handleStatusChange = (isActive) => {
        setStatus(isActive);
        setSearch('');
    };
    return (
        <div>
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
                                                onChange={(e) => {
                                                    setSearch(e.target.value);
                                                    setSkip(1);
                                                }}
                                                placeholder="Search..." />
                                            <Button onClick={() => {
                                                setShowModal(true)
                                                // if (isAddPresent) {
                                                // } else {
                                                // ToastHandle('You are not authoized for adding subscription plans.', 'danger')
                                                // }
                                            }} className="custom-buttons">
                                                New Plan
                                            </Button>
                                            <AddSubscriptions data={dataToUpdate} show={showModal} closeModal={handleCloseModal} />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Table responsive className="table-centered table-nowrap mb-0">
                                        <thead className="">
                                            <tr key={''}>
                                                <th>S.no</th>
                                                <th>Plan name</th>
                                                <th>Amount</th>
                                                <th>Date</th>
                                                <th>Plan Tenure</th>
                                                <th>Doctor Count</th>
                                                <th>Patient Count</th>
                                                <th>Description</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody >
                                            {store?.getSubscriptionsReducer?.loading ?
                                                <tr>
                                                    <td colSpan={9} className='text-center'>
                                                        <Spinner />
                                                    </td>
                                                </tr>
                                                :
                                                subscriptionsResponse?.totalPages === 0 ?
                                                    <tr>
                                                        <td colSpan={9} className='text-center'>
                                                            <h3 className='my-5'>No Data Found</h3>
                                                        </td>
                                                    </tr>
                                                    :

                                                    subscriptionsResponse?.plans?.map((data, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td className='text-capitalize'>
                                                                {data?.name}
                                                            </td>
                                                            <td className='text-capitalize'>$ {data?.totalAmount?.toLocaleString('en-US')}</td>
                                                            <td className='text-capitalize'>{new Date(data?.implimentFrom)?.toLocaleDateString('en-GB')}</td>
                                                            <td className='text-capitalize'>
                                                                {data?.billingFrequency}

                                                            </td>

                                                            <td>
                                                                {data?.doctorLimit}
                                                            </td>
                                                            <td>
                                                                {data?.patientLimit}
                                                            </td>
                                                            <td>
                                                                <span
                                                                    data-bs-toggle="tooltip"
                                                                    title={data?.description}
                                                                    className="d-inline-block text-truncate text-capitalize">
                                                                    {data?.description
                                                                        ? (data?.description?.length > 20
                                                                            ? data?.description.slice(0, 20) + '...'
                                                                            : data?.description)
                                                                        : 'N/A'}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <Form.Switch onClick={() => handleStatusUpdate(data)} checked={data?.isActive} />
                                                            </td>
                                                            <td>
                                                                <Link to="#" className="action-icon" onClick={() => {
                                                                    setShowModal(true);
                                                                    setDataToUpdate(data);
                                                                    // if (isUpdatePresent) {

                                                                    // } else {
                                                                    //     ToastHandle('You are not authoized for updating subscription plans.', 'danger')
                                                                    // }
                                                                }}>
                                                                    <i className="mdi mdi-square-edit-outline"></i>
                                                                </Link>
                                                                {/* <UpdateSubscriptions show={showUpdateModal} data={dataToUpdate} closeModal={handleCloseUpdateModal} /> */}
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
                                        totalPages={store?.getSubscriptionsReducer?.data?.totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

        </div>
    )
}

export default Subscriptions