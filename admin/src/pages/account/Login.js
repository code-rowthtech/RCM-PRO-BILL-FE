// @flow
import React, { useEffect } from 'react';
import { Button, Alert, Row, Col } from 'react-bootstrap';
import { Link, Navigate, useLocation } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
//actions
import { resetAuth, loginUser } from '../../redux/actions';
// components
import { VerticalForm, FormInput } from '../../components/';
import AccountLayout from './AccountLayout';
import { decryptMessage, encryptMessage } from '../../cryptoUtils';
import Loader from '../../components/Loader';
import Spinner from '../../constants/Spinner';
import ToastHandle from '../../helpers/ToastMessage';
import UploadToS3 from '../../helpers/uploads3';

const BottomLink = () => {
    const { t } = useTranslation();
    return (
        <Row className="mt-3">
            {/* Add links if needed */}
        </Row>
    );
};

const Login = (): React$Element<any> => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const location = useLocation();
    const redirectUrl = location.state && location.state.from ? location.state.from.pathname : 'dashboard';

    useEffect(() => {
        dispatch(resetAuth());
    }, [dispatch]);

    const { loading, userLoggedIn, user, error } = useSelector((state) => ({
        loading: state.Auth.loading,
        user: state.Auth.user,
        error: state.Auth.error,
        userLoggedIn: state.Auth.userLoggedIn,
    }));

    // useEffect(() => {
    //     if (error) {
    //         ToastHandle(error, 'danger');
    //     }
    // }, [error]);

    /*
    form validation schema
    */
    const schemaResolver = yupResolver(
        yup.object().shape({
            username: yup.string().required(t('Please enter Username')).email(t('Please enter a valid Email')),
            password: yup.string().required(t('Please enter Password')),
        })
    );

    /*
    handle form submission
    */
    const onSubmit = (formData) => {
        const username = formData.username.trim();
        const password = formData.password.trim();

        if (!username || !password) {
            ToastHandle('Username and password cannot be empty or spaces only.', 'danger');
            return;
        }

        dispatch(loginUser({ email: username, password }));
    };

    return (
        <>
            {(userLoggedIn || user) && <Navigate to={redirectUrl} replace />}
            <AccountLayout bottomLinks={<BottomLink />}>
                <div className="text-center w-75 m-auto">
                    <h4 className="text-dark-50 text-center mt-0 fw-bold">{t('Sign In')}</h4>
                    <p className="text-muted mb-4">
                        {t('Enter your email address and password to access admin panel.')}
                    </p>
                </div>

                <VerticalForm
                    onSubmit={(data) => onSubmit(data)}
                    resolver={schemaResolver}
                >
                    <FormInput
                        label={t('Email')}
                        type="email"
                        name="username"
                        placeholder={t('Enter your Email')}
                        containerClass={'mb-3'}
                        defaultValue=""
                    />
                    <FormInput
                        label={t('Password')}
                        type="password"
                        name="password"
                        placeholder={t('Enter your password')}
                        containerClass={'mb-3'}
                        onCopy={(e) => e.preventDefault()}
                        onCut={(e) => e.preventDefault()}
                        onPaste={(e) => e.preventDefault()}
                        defaultValue="" // Ensures the field is initialized
                    />

                    <div className="mb-3  mb-0 d-flex justify-content-center">
                        <Button className="custom-buttons w-25 " type="submit" disabled={loading}>
                            {loading ? (
                                <Spinner color="white" className="spinner-border-sm" />
                            ) : (
                                `${t('Log In')}`
                            )}
                        </Button>
                    </div>
                </VerticalForm>
            </AccountLayout>
        </>
    );
};

export default Login;
