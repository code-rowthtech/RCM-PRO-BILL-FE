import React, { useEffect, useState } from 'react';
import { Row, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { getContractAction } from '../../../../redux/actions';
import { encryptMessage } from '../../../../cryptoUtils';
import { jsPDF } from "jspdf";
import Spinner from '../../../../constants/Spinner'; // Assuming you have a spinner component

const Contract = ({ billingId, activeTab, contractId, setBillingId, setClinicId, setBuffer }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setError,
        clearErrors,
    } = useForm();

    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const contracts = store?.getContractReducer?.data;
    const billingResponse = store?.createSubscriptionPlanReducer?.data?.result;
    const user = JSON.parse(sessionStorage.getItem('hyper_user'));
    const [pdfUrl, setPdfUrl] = useState(null);
    console.log(store?.getContractReducer?.data, 'contractscontracts')
    // Fetch data when the component is mounted or activeTab changes
    useEffect(() => {
        if (activeTab === 'contract') {
            const payload = {
                clinicId: billingResponse?._id,
                // clinicId: billingId,
            };
            dispatch(getContractAction({ key: encryptMessage(payload) }));
        }

        if (store?.getContractReducer?.data?.status === 200) {
            setBillingId(null);
            setClinicId(null);
        }
    }, [activeTab, billingId, dispatch, setBillingId, setClinicId]);

    // Generate HTML content for the PDF
    const generateHTML = (data) => `
       <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contract Agreement</title>
    <style>
        body {
            font-family: 'Roboto', Arial, sans-serif;
            margin: 0;
            padding: 0;
            color: #333;
            background-color: #f9f9f9;
            line-height: 1.6;
        }

        .container {
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background-color: #fff;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
        }

        h2 {
            text-align: center;
            color: #555;
            margin-bottom: 20px;
            font-size: 24px;
        }

        .details {
            margin-top: 20px;
            line-height: 1.8;
        }

        .details p {
            font-size: 16px;
            margin: 8px 0;
        }

        .details strong {
            color: #444;
        }

        .signature-section {
            margin-top: 40px;
        }

        .signature-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin-top: 20px;
        }

        .signature-table th, 
        .signature-table td {
            padding: 15px;
            text-align: left;
            border: 1px solid #e5e5e5;
        }

        .signature-table th {
            background-color: #f7f7f7;
            font-weight: bold;
            color: #555;
        }

        .signature-table td {
            background-color: #fcfcfc;
        }

        .footer {
            text-align: center;
            margin-top: 40px;
            font-size: 14px;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2 class="header">Contract Agreement</h2>
        <div class="details">
            <p><strong>Plan Name:</strong> ${data.planName}</p>
            <p><strong>Amount:</strong> ${data.amount}</p>
            <p><strong>Date:</strong> ${data.date}</p>
            <p><strong>Clinic Name:</strong> ${data.clinicName}</p>
            <p><strong>Admin Name:</strong> ${data.adminName}</p>
        </div>

        <div class="signature-section">
            <table class="signature-table">
                <tr>
                    <th>Clinic</th>
                    <td>Signature: ________________________</td>
                </tr>
                <tr>
                    <th>Admin</th>
                    <td>Signature: ________________________</td>
                </tr>
            </table>
        </div>
    </div>

    <div class="footer">
        <p>Generated on: ${data.date}</p>
    </div>
</body>
</html>

    `;

    // Generate PDF once the contract data is available
    useEffect(() => {
        // if (user) {
        const sampleData = {
            planName: billingResponse?.userId?.subscription?.name,
            amount: billingResponse?.userId?.subscription?.amount,
            date: new Date().toISOString().split('T')[0],
            clinicName: billingResponse?.name,
            adminName: user?.name,
        };
        generatePDFBlob(sampleData);
        // }
    }, []);

    // Generate a PDF Blob and set the PDF URL
    const generatePDFBlob = async (data) => {
        const htmlContent = generateHTML(data);

        const doc = new jsPDF();

        return new Promise((resolve, reject) => {
            try {
                const doc = new jsPDF(); // Initialize jsPDF instance

                // Render the HTML content into the PDF
                doc.html(htmlContent, {
                    callback: (doc) => {
                        try {
                            const blob = doc.output('blob');
                            console.log('Blob:', blob);
                            setPdfUrl(URL.createObjectURL(blob))
                            // Generate the PDF as an ArrayBuffer
                            const buffer = doc.output('arraybuffer');
                            console.log(buffer, 'buffer')
                            resolve(buffer); // Resolve with the generated buffer
                            setBuffer(Array.from(new Uint8Array(buffer)))
                        } catch (error) {
                            reject(`Error generating PDF buffer: ${error.message}`);
                        }
                    },
                    x: 10, // Adjust x position for rendering
                    y: 10, // Adjust y position for rendering
                    width: 180, // Set content width (adjust as needed)
                });
            } catch (error) {
                reject(`Error initializing jsPDF: ${error.message}`);
            }
        });
    };

    function generatePDFBuffer(data) {
        const htmlContent = generateHTML(data); // Generate the HTML content dynamically

        return new Promise((resolve, reject) => {
            try {
                const doc = new jsPDF(); // Initialize jsPDF instance

                // Render the HTML content into the PDF
                doc.html(htmlContent, {
                    callback: (doc) => {
                        try {
                            // Generate the PDF as an ArrayBuffer
                            const buffer = doc.output('arraybuffer');
                            resolve(buffer); // Resolve with the generated buffer
                        } catch (error) {
                            reject(`Error generating PDF buffer: ${error.message}`);
                        }
                    },
                    x: 10, // Adjust x position for rendering
                    y: 10, // Adjust y position for rendering
                    width: 180, // Set content width (adjust as needed)
                });
            } catch (error) {
                reject(`Error initializing jsPDF: ${error.message}`);
            }
        });
    }
    return (
        <Row style={{ height: '100%' }} className="d-flex justify-content-between">
            {contracts?.contract ?
                pdfUrl ? (
                    <Table responsive className="table-centered border border-muted table-nowrap mb-0">
                        <thead>
                            <tr>
                                <th>Contract Name</th>
                                <th>Practice Sign</th>
                                <th>Probill Sign</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </Table>
                ) : (
                    <div className="text-center w-100">
                        <Spinner />
                    </div>
                )
                :
                `${store?.getContractReducer?.data?.message}`
            }

        </Row>
    );
};

export default Contract;
