import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getContractAction } from '../../../../redux/actions';
import { encryptMessage } from '../../../../cryptoUtils';
import { Button, Col, Row, Table } from 'react-bootstrap';
import Spinner from '../../../../constants/Spinner';
import ReactQuill from 'react-quill';
import { getContractFormatAction } from '../../../../redux/settings/actions';

const Contracttable = ({ activeTab, id, setQuillBuffer }) => {
    const dispatch = useDispatch();
    const [viewList, setViewList] = useState(false);
    const [quillValue, setQuillValue] = useState('');
    const [editMode, setEditMode] = useState(false);
    const store = useSelector((state) => state);
    const contracts = store?.getContractReducer?.data?.contract;
    const contractFormat = store?.getContractFormatReducer?.data?.templates?.html;

    // console.log(store?.getContractReducer, 'aaaaaaaaaaaaaaaaaaaaaaaa')
    useEffect(() => {
        if (activeTab === 'contract') {
            const payload = {
                clinicId: id
            }
            dispatch(getContractAction({ key: encryptMessage(payload) }))
            dispatch(getContractFormatAction());
        }
    }, [activeTab]);

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
    useEffect(() => {
        if (contractFormat) {
            const htmlContent = generateHTML(data);
            setQuillValue(htmlContent);
        }
    }, [contractFormat]);
    const handleDownload = (fileUrl) => {
        if (fileUrl) {
            window.open(fileUrl, '_blank');
        }
    };
    useEffect(() => {
        if (quillValue) {
            setQuillBuffer(quillValue);
        }
    }, [quillValue]);
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
        <div>
            {store?.getContractReducer?.loading ?
                <Row>
                    <Col className='d-flex justify-content-center align-items-center'>
                        <Spinner />
                    </Col>
                </Row>
                :
                contracts?.adminId ?
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
                            {
                                store?.getContractReducer?.loading ?
                                    <tr>
                                        <td className='text-center' colSpan={5}>
                                            <Spinner />
                                        </td>
                                    </tr>
                                    : contracts?.length === 0 ? (
                                        <tr>
                                            <td className="text-center" colSpan={5}>
                                                No data found
                                            </td>
                                        </tr>
                                    ) :
                                        // contracts?.map((contracts, index) => (
                                        <tr key={contracts?._id}>
                                            <td>{contracts?.contractName}</td>
                                            <td><span className={`${contracts?.clinicSignStatus ? 'bg-success' : 'bg-secondary'} text-light px-1 rounded-1`}>{contracts?.clinicSignStatus ? 'Signed' : 'Pending'}</span></td>
                                            <td><span className={`${contracts?.adminSignStatus ? 'bg-success' : 'bg-secondary'} text-light px-1 rounded-1`}>{contracts?.adminSignStatus ? 'Signed' : 'Pending'}</span></td>
                                            <td>
                                                {new Date(contracts?.sentDate).toLocaleDateString('en-GB')}
                                            </td>
                                            <td>
                                                <i className="fs-4 me-1 uil-external-link-alt"
                                                    onClick={() => {
                                                        setViewList(!viewList);
                                                    }}></i>
                                                <div className={`${viewList ? 'px-1 position-absolute bg-white' : 'd-none'}`}>
                                                    <p className='mb-0 border px-1 pe-3 cursor-pointer view-docs' onClick={() => {
                                                        handleDownload(contracts?.documentFileUrl);
                                                        setViewList(false);
                                                    }}>Document</p>
                                                    <p className='mb-0 border px-1 pe-3 cursor-pointer view-docs' onClick={() => {
                                                        handleDownload(contracts?.certificateFileUrl);
                                                        setViewList(false);
                                                    }}>Certificate</p>
                                                </div>
                                            </td>
                                        </tr>
                                // ))
                            }
                        </tbody>
                    </Table>
                    :
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
            }


        </div>
    )
}

export default Contracttable