import React, { useEffect, useState } from 'react';
import { Accordion, Col, Row } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { getPatientEncounterDataAction } from '../redux/patients/actions';
import Spinner from '../constants/Spinner';

const EncounterSummary = ({ patientId }) => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    
    // Get data from Redux store
    const encounterData = store?.getPatientEncounterDataReducer?.data;
    const loading = store?.getPatientEncounterDataReducer?.loading;

    useEffect(() => {
        if (patientId) {
            dispatch(getPatientEncounterDataAction({ patientId }));
        }
    }, [patientId, dispatch]);

    const handleItemClick = (fieldName, formattedData, itemId) => {
        // Autopopulation logic for admin panel
        if (window.populateEncounterField) {
            window.populateEncounterField(fieldName, formattedData, itemId);
        } else {
            // Fallback: copy to clipboard or show notification
            navigator.clipboard?.writeText(formattedData);
            console.log(`Copied to clipboard: ${formattedData}`);
        }
    };

    const renderSection = (title, data, fieldMapping) => (
        <Accordion.Item eventKey={title.toLowerCase()}>
            <Accordion.Header>
                <span className='fw-semibold fs-6'>{title}</span>
            </Accordion.Header>
            <Accordion.Body className="p-2">
                {data?.length > 0 ? (
                    <div style={{ height: '30vh' }} className="scroll-container">
                        <ul className="list-unstyled pb-0 mb-0">
                            {data.slice(0, 4).map((item, index) => (
                                <li 
                                    key={index} 
                                    className="mb-2 d-flex justify-content-between align-items-start cursor-pointer"
                                    onClick={() => handleItemClick(fieldMapping.field, fieldMapping.formatter(item), item._id)}
                                >
                                    <div className="fs-6">
                                        <strong title={fieldMapping.title(item)}>
                                            {fieldMapping.title(item)?.length > 30 
                                                ? fieldMapping.title(item).slice(0, 29) + '...' 
                                                : fieldMapping.title(item)}
                                        </strong>
                                        <div className="text-muted small">
                                            {fieldMapping.subtitle(item)}
                                        </div>
                                    </div>
                                    {fieldMapping.badge && (
                                        <span className="fs-6 fw-semibold">
                                            {fieldMapping.badge(item)}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="text-muted">{`No ${title.toLowerCase()} recorded`}</div>
                )}
            </Accordion.Body>
        </Accordion.Item>
    );

    const sectionConfigs = [
        {
            title: 'Allergy',
            data: encounterData?.allergies || [],
            fieldMapping: {
                field: 'Social History',
                title: (item) => item.code?.text || 'Unknown Allergy',
                subtitle: (item) => item.clinicalStatus?.text || 'Status not available',
                formatter: (item) => `Allergy: ${item.code?.text || 'N/A'}\nSeverity: ${item.criticality?.display || 'N/A'}\nStatus: ${item.clinicalStatus?.text || 'N/A'}`,
                badge: (item) => item.criticality?.display
            }
        },
        {
            title: 'Problems',
            data: encounterData?.problems || [],
            fieldMapping: {
                field: 'Reason for Visit',
                title: (item) => item.code?.text || 'Unknown Problem',
                subtitle: (item) => item.clinicalStatus?.text || 'Status not available',
                formatter: (item) => `Problem: ${item.code?.text || 'N/A'}\nStatus: ${item.clinicalStatus?.text || 'N/A'}\nOnset Date: ${item.onsetDateTime ? new Date(item.onsetDateTime).toLocaleDateString() : 'N/A'}`,
                badge: (item) => item.onsetDateTime ? new Date(item.onsetDateTime).toLocaleDateString() : ''
            }
        },
        {
            title: 'Medications',
            data: encounterData?.medications || [],
            fieldMapping: {
                field: 'Prescriptions (Medications)',
                title: (item) => item.drugId?.proprietaryName || 'Unknown Medication',
                subtitle: (item) => item.dosageInstruction?.[0]?.text || '',
                formatter: (item) => `Medication: ${item.drugId?.proprietaryName || 'N/A'}\nInstructions: ${item.dosageInstruction?.[0]?.text || 'N/A'}\nStatus: ${item.status || 'Unknown'}`,
                badge: (item) => item.status
            }
        }
    ];

    if (loading) {
        return (
            <Row className='position-relative'>
                <Col sm={12} className='mt-1 text-center py-5'>
                    <Spinner />
                </Col>
            </Row>
        );
    }

    return (
        <Row className='position-relative'>
            <Col sm={12} className='mt-1'>
                <Accordion alwaysOpen>
                    {sectionConfigs.map((config) => 
                        renderSection(config.title, config.data, config.fieldMapping)
                    )}
                </Accordion>
            </Col>
        </Row>
    );
};

export default EncounterSummary;