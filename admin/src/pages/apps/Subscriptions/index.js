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

const Subscriptions = () => {
    const [skip, setSkip] = useState(1);
    const [search, setSearch] = useState('');
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const [showModal, setShowModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [dataToUpdate, setDataToUpdate] = useState(null);
    const subscriptionsResponse = store?.getSubscriptionsReducer?.data;
    const createSuccess = store?.createSubscriptionsReducer?.data?.status;
    const updateSuccess = store?.updateSubscriptionsReducer?.data?.status;
    useEffect(() => {
        dispatch(getSubscriptionsAction());
        if (createSuccess === 201 || updateSuccess === 200) {
            dispatch(stateEmptydAction())
            dispatch(getSubscriptionsAction());
        }
    }, [dispatch, createSuccess, updateSuccess])
    const handlePageChange = (pageNumber) => {
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
        dispatch(updateSubscriptionsAction({ key: encryptMessage({ id: data?._id, isActive: !data?.isActive }) }))
    }

    return (
        <div>
            <Row className='mt-2'>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Row className="mb-2">
                                <Col className='text-end'>
                                    <Button onClick={() => setShowModal(true)} className="custom-buttons">
                                        Add Subscriptions
                                    </Button>
                                    <AddSubscriptions data={dataToUpdate} show={showModal} closeModal={handleCloseModal} />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Table responsive className="table-centered table-nowrap mb-0">
                                        <thead className="">
                                            <tr key={''}>
                                                <th>Plan name</th>
                                                <th>Description</th>
                                                <th>Amount</th>
                                                <th>Date</th>
                                                <th>Plan Tenure</th>
                                                <th>Doctor Count</th>
                                                <th>Patient Count</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {store?.getSubscriptionsReducer?.loading ?
                                                <tr>
                                                    <td colSpan={7} className='text-center'>
                                                        <Spinner />
                                                    </td>
                                                </tr>
                                                :
                                                subscriptionsResponse?.totalPages === 0 ?
                                                    <tr>
                                                        <td colSpan={7} className='text-center'>
                                                            <h3 className='my-5'>No Data Found</h3>
                                                        </td>
                                                    </tr>
                                                    :

                                                    subscriptionsResponse?.plans?.map((data, index) => (
                                                        <tr key={index}>
                                                            <td className='text-capitalize'>
                                                                <Link to="#" className="text-body fw-bold">
                                                                    {data?.name}
                                                                </Link>
                                                            </td>
                                                            <td>
                                                                <span
                                                                    data-bs-toggle="tooltip"
                                                                    title={data?.description}
                                                                    className="d-inline-block text-truncate text-capitalize cursor-pointer">
                                                                    {data?.description?.slice(0, 20) + '...'}
                                                                </span>
                                                            </td>
                                                            <td className='text-capitalize'>{data?.totalAmount}</td>
                                                            <td className='text-capitalize'>{formatDate(data?.implimentFrom)}</td>
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
                                                                <Form.Switch onClick={() => handleStatusUpdate(data)} checked={data?.isActive} />
                                                            </td>
                                                            <td>
                                                                <Link to="#" className="action-icon" onClick={() => {
                                                                    setShowModal(true);
                                                                    setDataToUpdate(data);
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