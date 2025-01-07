import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getContractAction } from '../../../../redux/actions';
import { encryptMessage } from '../../../../cryptoUtils';
import { Button, Col, Modal, Row, Table } from 'react-bootstrap';
import Spinner from '../../../../constants/Spinner';
import ReactQuill from 'react-quill';
import { getContractFormatAction } from '../../../../redux/settings/actions';
import { IoMdClose } from 'react-icons/io';
import { useSearchParams } from 'react-router-dom';

const Contracttable = ({ activeTab, setQuillBuffer }) => {
    const dispatch = useDispatch();
    const [viewList, setViewList] = useState(false);
    const [show, setShow] = useState(false);
    const handleCloseContractModal = () => {
        setShow(false);
    }
    const [searchParams] = useSearchParams();
    const id = searchParams.get('updateid');
    const [quillValue, setQuillValue] = useState('');
    const [editMode, setEditMode] = useState(false);
    const store = useSelector((state) => state);
    const contracts = store?.getContractReducer?.data;
    console.log(store?.getContractReducer?.data, 'contracts')
    const contractFormat = store?.getContractFormatReducer?.data?.templates?.html;
    useEffect(() => {
        if (activeTab === 'contract') {
            const payload = {
                clinicId: id,
            }
            dispatch(getContractAction({ key: encryptMessage(payload) }))
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
                contracts ?
                    <Table responsive className="table-centered border border-muted table-nowrap mb-0">
                        <thead>
                            <tr>
                                <th>Contract Name</th>
                                <th>Practice Sign</th>
                                <th>Probill Sign</th>
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
                                    : contracts?.standardContract ? (
                                        <tr key={contracts?.standardContract?._id}>
                                            <td>Standard Contract Agreement</td>
                                            <td><span className={`bg-secondary text-light px-1 rounded-1`}>Pending</span></td>
                                            <td><span className={`bg-secondary text-light px-1 rounded-1`}>Pending</span></td>
                                            <td>
                                                <i className="fs-4 me-1 uil-eye cursor-pointer"
                                                    onClick={() => {
                                                        setShow(true)
                                                    }}></i>
                                                <i className="mdi mdi-square-edit-outline cursor-pointer fs-4"></i>
                                            </td>
                                        </tr>
                                    ) :
                                        // contracts?.map((contracts, index) => (
                                        <tr key={contracts?._id}>
                                            <td>{contracts?.contract?.contractName}</td>
                                            <td><span className={`${contracts?.contract?.clinicSignStatus ? 'bg-success' : 'bg-secondary'} text-light px-1 rounded-1`}>{contracts?.contract?.clinicSignStatus ? 'Signed' : 'Pending'}</span></td>
                                            <td><span className={`${contracts?.contract?.adminSignStatus ? 'bg-success' : 'bg-secondary'} text-light px-1 rounded-1`}>{contracts?.contract?.adminSignStatus ? 'Signed' : 'Pending'}</span></td>
                                            <td>
                                                <i className="fs-4 me-1 uil-eye cursor-pointer"
                                                    onClick={() => {
                                                        setShow(true)
                                                    }}></i>
                                                <i className="mdi mdi-square-edit-outline cursor-pointer fs-4"></i>
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
            <Modal centered show={show} size='xl'>
                <Modal.Body>
                    <Row className="border-bottom mb-2 pb-2 d-flex align-items-center">
                        <Col sm={1}></Col>
                        <Col sm={10}>
                            <h4 className="mb-0 text-center">Contract</h4>
                        </Col>
                        <Col sm={1}>
                            <IoMdClose className="fs-4 cursor-pointer" onClick={handleCloseContractModal} />
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12}>
                            <iframe
                                src={contracts?.standardContract?.fileUrl || contracts?.contract?.contractTemplateId?.fileUrl}
                                title={contracts?.contract?.contractName}
                                width="100%"
                                height="620px"
                                className="px-4"
                                style={{ border: 'none' }}
                            />
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>

        </div>
    )
}

export default Contracttable