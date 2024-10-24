import React, { useEffect, useState } from 'react'
import PageTitle from '../../../components/PageTitle'
import { Button, Card, Col, Form, Row, Table } from 'react-bootstrap'
import { FormInput } from '../../../components'
import { Link } from 'react-router-dom'
import AddRoles from './Modal/createRole'
import { useDispatch, useSelector } from 'react-redux'
import { getRolesAction } from '../../../redux/actions'
import UpdateRole from './Modal/updateRole'

const Roles = () => {
    const [showModal, setShowModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const decryptedRolesData = store?.getRolesDataReducer?.data?.roles;
    console.log(decryptedRolesData)
    const handleClosemodal = () => {
        setShowModal(false);
    };
    useEffect(() => {
        dispatch(getRolesAction());
    }, [dispatch])

    const [dataToUpdate, setDataToUpdate] = useState(null);

    const closeUpdateModal = () => {
        setShowUpdateModal(false);
        setDataToUpdate(null);
    }

    return (
        <div>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Roles', path: '/apps/Roles/list', active: true },
                ]}
                title={'Roles'}
            />
            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Row className="mb-2 d-flex justify-content-between">
                                <Col xs="auto">
                                    <FormInput type="text" name="search" placeholder="Search..." />
                                </Col>
                                <Col xs='auto'>
                                    <Button className='grayish-buttons' onClick={() => setShowModal(true)}><span className='uil-plus'></span> Add Roles</Button>
                                </Col>
                                <AddRoles show={showModal} closeModal={handleClosemodal} />
                            </Row>
                            <Row>
                                <Col>
                                    <Table responsive className="table-centered table-nowrap mb-0">
                                        <thead className="table-light">
                                            <tr key={''}>
                                                <th>
                                                    S.no
                                                </th>
                                                <th>Name</th>
                                                <th>Description</th>
                                                {/* <th>Created By</th> */}
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {decryptedRolesData?.map((data, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        {index + 1}
                                                    </td>
                                                    <td>
                                                        <Link to="#" className="text-body fw-bold text-capitalize">
                                                            {data?.name}
                                                        </Link>
                                                    </td>
                                                    <td>
                                                        {data?.description}
                                                    </td>
                                                    {/* <td>
                                                        {data?.permissions}
                                                    </td> */}
                                                    <td>
                                                        <Form.Switch checked={data?.status === 'active'} />
                                                    </td>
                                                    <td>
                                                        <Link to="#" className="action-icon" onClick={() => {
                                                            setShowUpdateModal(true);
                                                            setDataToUpdate(data);
                                                        }}>
                                                            <i className="mdi mdi-square-edit-outline"></i>
                                                        </Link>
                                                        <UpdateRole show={showUpdateModal} closeModal={closeUpdateModal} data={dataToUpdate} />
                                                    </td>
                                                </tr>
                                            ))}

                                        </tbody>
                                    </Table>
                                </Col>

                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default Roles