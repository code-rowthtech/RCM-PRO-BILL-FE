import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

const PasswordModal = ({ show, closeModal, setShowPassword }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        setShowPassword(true)
    };


    return (
        <Modal centered show={show} onHide={closeModal}>
            <Modal.Body>
                <div>
                    <h2>Enter Password to View Phone Number</h2>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                    />
                    <Button onClick={closeModal}>Close</Button>
                    {error && <p className="error">{error}</p>}
                    <Button onClick={handleSubmit}>Submit</Button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default PasswordModal;
