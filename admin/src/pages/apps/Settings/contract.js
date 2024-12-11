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

  // Access Redux store for contract format
  const contractFormat = useSelector((state) => state?.getContractFormatReducer?.data?.templates?.html);

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

  // Generate dynamic HTML content
  const data = {
    planName: 'Basic Plan',
    amount: '$1200',
    date: new Date().toLocaleDateString(),
    clinicName: 'ABC Clinic',
    adminName: 'Admin User',
  };

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
      html: quillValue,
      contractType: 'Primary',
    };
    if (quillValue) {
      dispatch(createContractAction({ key: encryptMessage(payload) }));
    }
  };

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
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ContractFormat;
