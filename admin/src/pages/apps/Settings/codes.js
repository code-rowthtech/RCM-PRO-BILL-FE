import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Form, Table, Spinner, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { getCodesAction } from '../../../redux/settings/actions';
import { IoEye } from 'react-icons/io5';

const Codes = () => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const codesData = store?.getCodesReducer?.data?.data;
    const [search, setSearch] = useState('');
    const [codeType, setCodeType] = useState('icd-cm');
    useEffect(() => {
        dispatch(
            getCodesAction({
                status: '',
                codeType: codeType,
                search: search, // Pass search term to API
                limit: 10,
                skip: 0,
                page: 1,
            })
        );
    }, [dispatch, search, codeType]);

    return (
        <Row className="mt-2">
            <Col xs={12}>
                <Card>
                    <Card.Body className="scroll-container" style={{ height: '88vh' }}>
                        <Row className="mb-3">
                            <Col sm={6}>
                                <Form.Label className="mb-1">Search</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Search..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </Col>

                            {/* Multi-Select Search */}
                            <Col sm={6} className="mb-2">
                                <Form.Label className="mb-1">Select Categories</Form.Label>
                                <Form.Select value={codeType} onChange={(e) => setCodeType(e.target.value)}>
                                    <option value="">Select your Categories</option>
                                    <option value="icd-cm">ICDCM</option>
                                    <option value="icd-pcs">ICDPCS</option>
                                    <option value="cpt">CPT</option>
                                    <option value="hcpcs-level-2">HCPSCTWO</option>
                                    <option value="food-allergy">FoodAllergies</option>
                                    <option value="ndc-product">NDCProductModel</option>
                                    <option value="ndc-package">NDCPackageModel</option>
                                </Form.Select>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Table responsive className="table-centered table-nowrap mb-0">
                                    <thead className="ght">
                                        <tr>
                                            <th>S.no</th>
                                            <th>Code Type</th>
                                            <th>Title</th>
                                            <th>Status</th>
                                            <th>Value</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {store?.getCodesReducer?.loading ? (
                                            <tr>
                                                <td colSpan={6} className="text-center">
                                                    <Spinner animation="border" />
                                                </td>
                                            </tr>
                                        ) : codesData?.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="text-center">
                                                    <h3 className="my-5">No Data Found</h3>
                                                </td>
                                            </tr>
                                        ) : (
                                            codesData?.map((data, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{data?.codeType}</td>
                                                    <td>{data?.title}</td>
                                                    <td>
                                                        <Form.Switch checked={data?.status} disabled />
                                                    </td>
                                                    <td>{data?.value}</td>
                                                    <td>
                                                        <IoEye />
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default Codes;
