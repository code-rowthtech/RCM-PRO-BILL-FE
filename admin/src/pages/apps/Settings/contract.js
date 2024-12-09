import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { generatePDFBlob, generatePDFBuffer } from '../../../helpers/contractFormat';  // Import your helper functions
import { jsPDF } from "jspdf";

const ContractFormat = ({ data }) => {
    const [pdfUrl, setPdfUrl] = useState(null);  // State for the PDF Blob URL
    const [pdfBuffer, setPdfBuffer] = useState(null); // State for the PDF Buffer (optional)

    function generateHTML(data) {
        return `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Contract Agreement</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  margin: 40px;
                  color: #333;
                  line-height: 1.6;
                }
                h2 {
                  text-align: center;
                  color: #444;
                  border-bottom: 2px solid #ddd;
                  padding-bottom: 10px;
                }
                .details, .signature-section {
                  margin-top: 30px;
                }
                .details p {
                  font-size: 14px;
                }
                .signature-table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-top: 40px;
                }
                .signature-table th, .signature-table td {
                  border: 1px solid #ddd;
                  padding: 10px;
                  vertical-align: top;
                }
                .signature-table th {
                  background-color: #f9f9f9;
                  width: 20%;
                }
                .signature-placeholder {
                  position: relative;
                  height: 50px; / Space for the signature /
                }
                .anchor {
                  position: absolute;
                  left: 0;
                  top: 0;
                  font-size: 1px;
                  color: transparent;
                }
              </style>
            </head>
            <body>
              <h2>Contract Agreement</h2>
              <div class="details">
                <p><strong>Plan Name:</strong> {data.planName}</p>
                <p><strong>Amount:</strong> {data.amount}</p>
                <p><strong>Date:</strong> {data.date}</p>
                <p><strong>Clinic Name:</strong> {data.clinicName}</p>
                <p><strong>Admin Name:</strong> {data.adminName}</p>
              </div>
      
              <h3>Signatures</h3>
              <div class="signature-section">
                <table class="signature-table">
                  <tr>
                    <th>Clinic</th>
                    <td>
                      <strong>Signature:</strong>
                      <div class="signature-placeholder">
                        <span class="anchor">/ClinicSignature</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>Admin</th>
                    <td>
                      <strong>Signature:</strong>
                      <div class="signature-placeholder">
                        <span class="anchor">/AdminSignature</span>
                      </div>
                    </td>
                  </tr>
                </table>
                <h2>Terms and conditions: </h2>
              </div>
            </body>
          </html>
        `;
    }

    function generatePDFBlob(data) {
        const htmlContent = generateHTML(data);

        return new Promise((resolve, reject) => {
            const doc = new jsPDF();

            // Add content to the PDF (you can add text, images, etc.)
            doc.html(htmlContent, {
                callback: (doc) => {
                    const blob = doc.output('blob');  // Generate a Blob
                    resolve(URL.createObjectURL(blob));  // Generate Blob URL
                },
                x: 10,
                y: 10,
                width: 180, // Specify the width of the page
            });
        });
    }
    function generatePDFBuffer(data) {
        const htmlContent = generateHTML(data);

        return new Promise((resolve, reject) => {
            const doc = new jsPDF();

            doc.html(htmlContent, {
                callback: (doc) => {
                    try {
                        const buffer = doc.output('arraybuffer'); // Get the arraybuffer
                        resolve(buffer); // Return the PDF buffer
                    } catch (error) {
                        reject(error);
                    }
                },
                x: 10,
                y: 10,
                width: 180,
            });
        });
    }

    useEffect(() => {
        // Generate the Blob URL for the PDF and set it to state
        generatePDFBlob(data)
            .then((url) => {
                setPdfUrl(url);
            })
            .catch((error) => {
                console.error('Error generating PDF Blob:', error);
            });

        // Optionally, generate the PDF Buffer for other use cases like uploading
        generatePDFBuffer(data)
            .then((buffer) => {
                setPdfBuffer(buffer); // Store the buffer for further actions (e.g., upload to server)
                const uint8Array = new Uint8Array(buffer);
                console.log('Generated PDF Buffer:', uint8Array);
            })
            .catch((error) => {
                console.error('Error generating PDF buffer:', error);
            });
    }, [data]);  // Regenerate PDF if `data` changes
    return (
        <div>
            <Row className="mt-2">
                <Col xs={12}>
                    <Card>
                        <Card.Body className="scroll-container" style={{ height: '88vh' }}>
                            <Row className="mb-2">
                                <Col className="text-end">
                                    {/* Button for future actions */}
                                    <Button className="custom-buttons" onClick={() => alert('Edit functionality coming soon!')}>
                                        Edit Contract
                                    </Button>
                                </Col>
                            </Row>

                            <Row style={{ height: '100%' }} className="d-flex justify-content-between">
                                {/* Render the PDF in an iframe */}
                                {pdfUrl ? (
                                    <iframe
                                        src={pdfUrl}
                                        width="100%"
                                        height="100%"
                                        frameBorder="0"
                                        title="Contract Agreement"
                                    >
                                        This browser does not support PDF viewing.
                                    </iframe>
                                ) : (
                                    <div className="text-center w-100">
                                        <p>Loading PDF...</p>
                                    </div>
                                )}
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ContractFormat;
