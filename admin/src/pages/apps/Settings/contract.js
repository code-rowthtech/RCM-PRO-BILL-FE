import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import Quill from 'quill';
import { ImageDrop } from 'quill-image-drop-module';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { createContractAction, getContractFormatAction } from '../../../redux/settings/actions';
import { encryptMessage } from '../../../cryptoUtils';
import { useDispatch, useSelector } from 'react-redux';

Quill.register('modules/imageDrop', ImageDrop);

const ContractFormat = () => {
  const [quillValue, setQuillValue] = useState('');
  const [editMode, setEditMode] = useState(false);
  const dispatch = useDispatch();
  // console.log(quillValue, 'quillValuequillValue')
  // Access Redux store for contract format
  const store = useSelector((state) => state);
  const contractFormat = store?.getContractFormatReducer?.data?.templates?.html;
  console.log(store?.getContractFormatReducer?.data?.templates?.fileUrl, 'contractFormat')
  // Fetch contract format on mount
  useEffect(() => {
    dispatch(getContractFormatAction());
  }, [dispatch]);


  // Update `quillValue` when `contractFormat` is loaded
  useEffect(() => {
    if (contractFormat) {
      const htmlContent = generateHTML(data);
      setQuillValue(htmlContent);
    }
  }, [contractFormat]);

  const data = {
    planName: 'Basic Plan',
    amount: '$1200',
    date: new Date().toLocaleDateString(),
    clinicName: 'ABC Clinic',
    adminName: 'Admin User',
  };


  const htmlll = `
    <html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        @page {
            size: A4;
            margin: 50px;
        }
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            color: #333;
        }
        h2 {
            text-align: center;
            margin-bottom: 20px;
        }
        h3 {
            color: #0066cc;
            margin-top: 20px;
            font-size: 18px;
        }
        .section {
            margin-bottom: 20px;
            padding: 10px;
            border-bottom: 1px solid #ccc;
        }
        .section p {
            margin: 5px 0;
        }
        .signature-section {
            margin-top: 30px;
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
            height: 50px;
            border: 1px dashed #888;
        }
        .signature-placeholder span {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 14px;
            color: #bbb;
        }
        .terms ul {
            padding-left: 20px;
        }
        .terms li {
            margin-bottom: 5px;
        }
        .contract-date {
            font-weight: bold;
        }
.heading-align{
text-align: center;
}
    </style>
</head>
<body>
    <h2 class='heading-align'>Contract Agreement</h2>
   
    <p>This Agreement ("Agreement") is entered into as of <span class="contract-date">{paymentDetail.jobDate}</span> ("Effective Date") by and between:</p>
    
    <div class="section">
        <h3>Practice Details:</h3>
        <p><strong>Practice Name:</strong> ${data?.clinicName || 'N/A'}</p>
        <p><strong>Subscription Plan:</strong> ${data?.planName || 'N/A'}</p>
        <p><strong>Address:</strong> ${data?.adddress || 'N/A'}</p>
    </div>
    
    <div class="section">
        <h3>Provider Details:</h3>
        <p><strong>Name:</strong> ${data?.adminName || "N/A"}</p>
        <p><strong>Address:</strong> ${data?.providerAddress || "N/A"}</p>
    </div>
    
    <div class="section">
        <h3>Service Provided by Provider:</h3>
        <p><strong>Description of Services:</strong> [Description of medical services to be provided]</p>
        <p><strong>Duration:</strong> Duration of contract agreement</p>
        <p><strong>Payment Amount and Schedule:</strong>${data?.amount || "N/A"}</p>
    </div>
    
    <div class="section">
        <h3>Responsibilities of the Provider:</h3>
        <p>Company shall, on behalf of Customer and in Customer’s name, bill patients for all Accounts Receivable, and shall bill such claims for reimbursement or indemnification from patients, third-party payers, and government health care programs for items and services provided through Customer.</p>
        <p>Company shall with Customer’s assistance obtain third-party payer information for coordination of benefits involving the Accounts Receivable and, when appropriate, shall endeavor to collect such benefits.</p>
        <p>Company may engage in collection efforts or may refer delinquent Accounts Receivable to a collection agency or attorney to enforce the rights of Customer as creditor under any contract or in connection with the provision of items or the rendering of any service.</p>
    </div>
    
    <div class="section">
        <h3>Responsibilities of the Client:</h3>
        <p>The Client agrees to provide all necessary information and documentation to the Provider to facilitate the services.</p>
        <p>The Client agrees to make payments according to the terms specified.</p>
    </div>
    
    <div class="section">
        <h3>Service Fee:</h3>
        <p>Customer agrees to pay the startup fee indicated on the Order Form.</p>
        <p>As compensation for the Revenue Cycle Management Services provided by Company, Customer shall pay a monthly fee as indicated on the Order Form. Company shall submit monthly invoices for the Service Fee reflecting revenue cycle management services delivered, which shall be due and payable by Customer within fifteen (15) days following receipt.</p>
    </div>
    
    <div class="section">
        <h3>Overpayments:</h3>
        <p>Company and Customer shall cooperate to investigate potential overpayments and, where appropriate, refund such overpayments collected through Company’s revenue cycle management services.</p>
    </div>
    
    <div class="section">
        <h3>Access to Documents:</h3>
        <p>Customer shall have access to and the right to inspect and copy any documents, bills or other information recorded electronically by Company pursuant to this RCM Agreement.</p>
    </div>
    
    <div class="section">
        <h3>Compliance:</h3>
        <p>Company shall perform all services under this RCM Agreement in accordance with Customer’s fee schedules, and consistent with all applicable laws, third-party payer RCM Agreements, policies, and procedures.</p>
    </div>
    
    <div class="section">
        <h3>Term:</h3>
        <p>The term of this RCM Agreement, including renewal terms, is defined by the Billing Form.</p>
    </div>
    
    <div class="section">
        <h3>Termination:</h3>
 <p>Following the expiration of the Initial Term (defined by the Order Form) and, thereafter, at any time during any Renewal Term (defined by the Order Form), either party may terminate this RCM Agreement for any reason, with or without cause, upon ninety (90) days prior written notice to the other party. For notice to be effective under this section, written notice must comply with the Notice provision of the MSA and contain the header: “NINETY (90) DAY NOTICE OF TERMINATION.”</p>
<p>During the term and during any period after a party provides notice of termination, Customer will continue to send information to Company to enable Company to continue to perform routine revenue cycle management activities relating to the Accounts Receivable up to the termination effective date.</p>
<p>No termination of this RCM Agreement or any other agreement between Customer and Company shall relieve Customer of the obligation to pay all amounts due and owing to Company.</p>
        <p>Either party may terminate this RCM Agreement for any reason, with or without cause, upon ninety (90) days prior written notice to the other party.</p>
    </div>
    
    <div class="section">
        <h3>Obligations After Termination:</h3>
        <p>Company will continue to perform open claims follow-up activities on the claims billed by the Company for sixty (60) days after the termination date (the “Runout Period”).</p>
<p>Company will continue to perform open claims follow up activities on the claims billed by the Company for sixty (60) days after the termination date (the “Runout Period”) and will be compensated therefore in accordance with the provisions of this RCM Agreement for ninety (90) days after the termination date. Customer further understands and agrees that the Runout Period is reasonable and necessary for Company to collect on revenue cycle management services that were performed by Company prior to the termination date, but that remain uncollected by Company upon termination of this RCM Agreement.</p>
<p>If Customer fails to provide the required 90 days’ notice of termination as provided for herein, or if Customer provides the required 90 days’ notice of termination but ceases sending billing and/or payment information to Company as required herein, the Company shall prepare a final billing to the Customer. The balance of the final billing will be calculated as follows: Company shall take the entire balance of the Customer’s open receivables, multiplied by the compensation rate outlined in Section 3(b) of this RCM Agreement. The parties agree that this calculation is fair and reasonable compensation for Company’s efforts in providing the services hereunder, and such amount shall not be treated as liquidated or other damages.</p>
    </div>
    
    <div class="section">
        <h3>No Inducement:</h3>
        <p>Nothing in this RCM Agreement is intended to, or shall be construed to require, influence or effectuate the referral of any patient or the payment of any consideration based upon the volume or value of any patient referrals.</p>
    </div>
    
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
    </div>
</body>
</html>

  `
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

  const createContract = () => {
    const payload = {
      html: htmlll,
      contractType: 'Standard',
    };
    if (quillValue || htmlll) {
      dispatch(createContractAction({ key: encryptMessage(payload) }));
    }
  };
  const handleUpdateContract = () => {
    const payload = {
      html: quillValue,

    }
  }
  return (
    <div>
      <Row className="mt-2">
        <Col xs={12}>
          <Card>
            <Card.Body className="scroll-container" style={{ height: '88vh' }}>
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
                {/* <Button onClick={createContract}>Create Contract</Button> */}
              </Row>
              <Row className="mt-2">
                <Col className={`${!editMode ? 'd-flex justify-content-center ' : 'd-none'}`} sm={editMode ? '' : 12}>
                  <iframe
                    src={store?.getContractFormatReducer?.data?.templates?.fileUrl}
                    title={store?.getContractFormatReducer?.data?.templates?.fileName}
                    width="100%"
                    height="620px"
                    className="px-4"
                    style={{ border: 'none' }}
                  />
                </Col>
                <Col sm={editMode ? 12 : ''} className={editMode ? '' : 'd-none'}>
                  <ReactQuill
                    modules={modules}
                    value={quillValue}
                    onChange={(value) => setQuillValue(value)}
                    theme="snow"
                  />
                </Col>
                <Col className={`${editMode ? ' mt-2 text-end' : 'd-none'}`}>
                  <Button onClick={handleUpdateContract}>
                    Save
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ContractFormat;
