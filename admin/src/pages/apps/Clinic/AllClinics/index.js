// @flow
import React, { useEffect, useState } from 'react';
import { Badge, Button, Card, Col, Form, Pagination, Row, Table } from 'react-bootstrap';

// component
import PageTitle from '../../../../components/PageTitle';
import { FormInput } from '../../../../components';

// dummy data
import { orderData } from './data';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { getClinicAction } from '../../../../redux/clinics/actions'
import Spinner from '../../../../constants/Spinner';
import Paginations from '../../../../helpers/Paginations';


const OrderList = (): React$Element<React$FragmentType> => {
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [skip, setSkip] = useState(1);
    const store = useSelector((state) => state);
    const clinicsData = store?.getClinicsReducer?.data;
    useEffect(() => {
        const payload = {
            name: name,
            skip: skip,
            limit: 10,
        }
        dispatch(getClinicAction({ payload }))
    }, [dispatch, name])
    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Clinics', path: '/apps/crm/orders', active: true },
                    { label: 'All clinics', path: '/apps/crm/orders', active: true },
                ]}
                title={'All Clinics'}
            />

            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Row className="mb-2">
                                <Col xl={8}>
                                    <Row className="gy-2 gx-2 align-items-center justify-content-xl-start justify-content-between">
                                        <Col xs="auto">
                                            <FormInput
                                                type="text"
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Search..." />
                                        </Col>

                                    </Row>
                                </Col>

                            </Row>

                            {/* <OrderDetails orderData={orderData} /> */}
                            <Table responsive className="table-centered table-nowrap mb-0">
                                <thead className="table-light">
                                    <tr>
                                        {/* <th>S.no</th> */}
                                        <th>Clinic Name</th>
                                        <th>Email</th>
                                        <th>Phone number</th>
                                        <th>Address</th>
                                        <th>Status</th>
                                        <th style={{ width: '125px' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {store?.getClinicsReducer?.loading ? (
                                        <tr>
                                            <td className='text-center' colSpan={7}>
                                                <Spinner className="spinner-border-lg m-2" />
                                            </td>
                                        </tr>
                                    ) : (
                                        clinicsData?.clinics?.length === 0 ? (
                                            <tr>
                                                <td className='text-center' colSpan={7}>
                                                    No Data Found
                                                </td>
                                            </tr>
                                        ) : (
                                            clinicsData?.clinics?.map((data, i) => {
                                                return (
                                                    <tr key={i}>
                                                        {/* <td>{i + 1}</td> */}
                                                        <td className='text-capitalize'>{data?.name}</td>
                                                        <td className='text-lowercase cursor-pointer'>
                                                            {data?.email && data?.email.length > 10 ? (
                                                                <span
                                                                    data-bs-toggle="tooltip"
                                                                    title={data?.email}
                                                                    className="d-inline-block text-truncate"
                                                                >
                                                                    {data?.email.substring(0, 10) + '...'}
                                                                </span>
                                                            ) : (
                                                                data?.email
                                                            )}
                                                        </td>
                                                        <td>{data?.phone}</td>
                                                        <td className='text-capitalize cursor-pointer'>
                                                            {data?.address && data?.address.length > 15 ? (
                                                                <span
                                                                    data-bs-toggle="tooltip"
                                                                    title={data?.address}
                                                                    className="d-inline-block text-truncate"
                                                                >
                                                                    {data?.address.substring(0, 15) + '...'}
                                                                </span>
                                                            ) : (
                                                                data?.address
                                                            )}
                                                        </td>
                                                        <td><Form.Switch checked={data?.status === true} /></td>
                                                        <td>
                                                            <Link to={`/apps/crm/updateclinic?id=${data?._id}`} className="action-icon">
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
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default OrderList;
