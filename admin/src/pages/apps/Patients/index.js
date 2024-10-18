import React from 'react'
import PageTitle from '../../../components/PageTitle'
import { Card, Col, Row } from 'react-bootstrap'
import { FormInput } from '../../../components'

const Patients = () => {
    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Patients', path: '/apps/patients/list', active: true },
                ]}
                title={'Patients'}
            />
            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Row className="mb-2">
                                <Col xs="auto">
                                    <FormInput type="text" name="search" placeholder="Search..." />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default Patients