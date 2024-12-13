import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { getContractAction } from '../../../../redux/actions';
import { encryptMessage } from '../../../../cryptoUtils';
import { jsPDF } from "jspdf";
import Spinner from '../../../../constants/Spinner';
import Quill from 'quill';
import { ImageDrop } from 'quill-image-drop-module';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getContractFormatAction } from '../../../../redux/settings/actions';
const Contract = ({ billingId, activeTab, contractId, setBillingId, setClinicId, setQuillBuffer }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setError,
        clearErrors,
    } = useForm();

    const [quillValue, setQuillValue] = useState('');
    const [editMode, setEditMode] = useState(false);
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const contracts = store?.getContractReducer?.data;
    const contractFormat = store?.getContractFormatReducer?.data?.templates?.html;
    const billingResponse = store?.createSubscriptionPlanReducer?.data?.result;
    const user = JSON.parse(sessionStorage.getItem('hyper_user'));
    const [pdfUrl, setPdfUrl] = useState(null);
    console.log(quillValue, 'qqqqqqqqqqqqq')
    useEffect(() => {
        if (quillValue) {
            // try {
            //     const encoder = new TextEncoder();
            //     const uint8ArrayBuffer = encoder.encode(quillValue); // Convert string to Uint8Array
            //     const arrayFormat = Array.from(uint8ArrayBuffer); // Convert Uint8Array to Array
            setQuillBuffer(quillValue); // Use setQuillBuffer to store the array 
            // } catch (error) {
            //     console.error('Error generating Uint8Array buffer:', error);
            // }
        }
    }, [quillValue]);

    // Fetch data when the component is mounted or activeTab changes

    useEffect(() => {
        if (contractFormat) {
            const htmlContent = generateHTML(data);
            setQuillValue(htmlContent);
        }
    }, [contractFormat]);
    useEffect(() => {
        if (activeTab === 'contract') {
            const payload = {
                clinicId: billingResponse?._id,
                // clinicId: billingId,
            };
            dispatch(getContractAction({ key: encryptMessage(payload) }));
            dispatch(getContractFormatAction());
        }

        if (store?.getContractReducer?.data?.status === 200) {
            setBillingId(null);
            setClinicId(null);
        }
    }, [activeTab, billingId, dispatch, setBillingId, setClinicId]);

    const data = {
        planName: 'Basic Plan',
        amount: '$1200',
        date: new Date().toLocaleDateString(),
        clinicName: 'ABC Clinic',
        adminName: 'Admin User',
    };
    // Generate HTML content for the PDF
    console.log('error', quillValue)
    const generateHTML = (data) => {
        if (contractFormat) {
            return `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; padding: 20px; border: 1px solid #ccc;">
              ${contractFormat
                    .replace('{{planName}}', data.planName)
                    .replace('{{amount}}', data.amount)
                    .replace('{{date}}', data.date)
                    .replace('{{clinicName}}', data.clinicName)
                    .replace('{{adminName}}', data.adminName)}
          </body>
          </html>`;
        }
        return '';
    };
    const modules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
            ['link'],
            ['clean'],
        ],
    };

    return (
        <Row style={{ height: '100%' }} className="">
            <Row className=" scroll-container">
                <Col className={`${!editMode ? 'd-flex justify-content-center ' : ''}`} sm={editMode ? 6 : 12}>
                    <div dangerouslySetInnerHTML={{ __html: quillValue }} />
                </Col>
                <Col sm={editMode ? 6 : ''} className={editMode ? '' : 'd-none'}>
                    <ReactQuill
                        modules={modules}
                        value={quillValue}
                        onChange={(value) => setQuillValue(value)}
                        theme="snow"
                    />
                </Col>
            </Row>
            <Row>
                <Col sm={12} className="text-end">
                    {editMode ? (
                        <Button className="custom-buttons" onClick={() => setEditMode(false)}>
                            Close Editor
                        </Button>
                    ) : (
                        <Button className="custom-buttons" onClick={() => setEditMode(true)}>
                            Edit Contract
                        </Button>
                    )}
                </Col>
            </Row>

        </Row>
    );
};

export default Contract;
