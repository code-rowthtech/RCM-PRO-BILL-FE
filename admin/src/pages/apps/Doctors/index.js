import React from 'react'
import PageTitle from '../../../components/PageTitle'
import { Card, Col, Row } from 'react-bootstrap'
import { FormInput } from '../../../components'

const Doctors = () => {
    return (
        <div>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Doctors', path: '/apps/doctors/list', active: true },
                ]}
                title={'Doctors'}
            />
            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Row className="mb-2">
                                <Col xs="auto">
                                    <FormInput type="text" name="search" placeholder="Search..." />
                                </Col>
                                <Col>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default Doctors