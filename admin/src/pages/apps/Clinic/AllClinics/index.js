// @flow
import React, { useEffect, useState } from 'react';
import { Badge, Button, Card, Col, Form, Row, Table } from 'react-bootstrap';

// component
import PageTitle from '../../../../components/PageTitle';
import { FormInput } from '../../../../components';
// dummy data
import { orderData } from './data';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { getClinicAction, stateEmptydAction, updateClinicAction } from '../../../../redux/clinics/actions'
import Spinner from '../../../../constants/Spinner';
import Paginations from '../../../../helpers/Paginations';
import { encryptMessage } from '../../../../cryptoUtils';

const OrderList = (): React$Element<React$FragmentType> => {
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [skip, setSkip] = useState(1);
    const [status, setStatus] = useState(true);
    const store = useSelector((state) => state);
    const clinicsData = store?.getClinicsReducer?.data?.data;
    // console.log(clinicsData, 'clinicsDataclinicsDataclinicsData')
    const updateSuccess = store?.updateClinicsReducer?.data?.status;
    useEffect(() => {
        const payload = {
            name: name,
            skip: skip,
            limit: 10,
            status: status,
        }
        dispatch(getClinicAction({ payload }))
        if (updateSuccess === 200) {
            dispatch(getClinicAction({ payload }))
        }
    }, [dispatch, name, updateSuccess, skip, status])

    const handleStatusUpdate = (data) => {
        const payload = {
            id: data?._id,
            status: !data?.status
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

    return (
        <>
            <Row className='mt-2'>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
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
                                        <th>End Date <span className=' uil-info-circle mb-0 cursor-pointer'
                                            data-toggle="tooltip"
                                            data-placement="top"
                                            title="Last Date of Subscription" /></th>
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
                                                            {data?.address?.city?.state_code + ' / ' + data?.address?.city?.name}
                                                        </td>
                                                        <td>{data?.clinicType}</td>
                                                        <td>
                                                            12/11/2024
                                                        </td>
                                                        <td>
                                                            5 days
                                                        </td>
                                                        <td>
                                                            <span className='bg-secondary rounded-1 text-white py-0 px-1'>
                                                                Pending
                                                            </span>
                                                        </td>
                                                        <td>
                                                            {/* <span
                                                                //  onClick={() => handleStatusUpdate(data)}
                                                                className='bg-secondary rounded-1 text-white py-0 px-1'>
                                                                {data?.status === true ? 'Active' : 'Inactive'}
                                                            </span> */}
                                                            <Form.Switch
                                                                onClick={() => handleStatusUpdate(data)}
                                                                checked={data?.status === true} />
                                                        </td>
                                                        <td>
                                                            <Link to={`/apps/crm/addclinic?updateid=${data?._id}`} className="action-icon">
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
        </>
    );
};

export default OrderList;
