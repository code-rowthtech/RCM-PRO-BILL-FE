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

/* bottom link of account pages */
const BottomLink = () => {
    const { t } = useTranslation();
    return (
        <Row className="mt-3">
            {/* <Col className="text-center">
                    <p className="text-muted">
                        {t("Don't have an account?")}{' '}
                        <Link to={'/account/register'} className="text-muted ms-1">
                            <b>{t('Sign Up')}</b>
                        </Link>
                    </p>
                </Col> */}
        </Row>
    );
};

const Login = (): React$Element<any> => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const location = useLocation();
    const redirectUrl = location.state && location.state.from ? location.state.from.pathname : '/dashboard/project';

    useEffect(() => {
        dispatch(resetAuth());
    }, [dispatch]);

    const { loading, userLoggedIn, user, error } = useSelector((state) => ({
        loading: state.Auth.loading,
        user: state.Auth.user,
        error: state.Auth.error,
        userLoggedIn: state.Auth.userLoggedIn,
    }));
    useEffect(() => {
        if (error) {
            ToastHandle(error, 'danger')
        }
    }, [error]);

    /*
    form validation schema
    */

    const schemaResolver = yupResolver(
        yup.object().shape({
            username: yup.string().required(t('Please enter Username')),
            password: yup.string().required(t('Please enter Password')),
        })
    );

    /*
    handle form submission
    */
    // const onSubmit = (formData) => {

    //     dispatch(loginUser({ email: formData.username, password: formData.password }));
    // };
    const onSubmit = (formData) => {
        // Trim the username and password to remove leading and trailing spaces
        const username = formData.username.trim();
        const password = formData.password.trim();

        // Check if either username or password is empty after trimming
        if (!username || !password) {
            // Show an error message (you can customize this as needed)
            ToastHandle("Username and password cannot be empty or spaces only.", 'danger');
            return;
        }

        // Dispatch the loginUser action if validation passes
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

                {/* {error && (
                    <Alert variant="danger" className="my-2">
                        {error ? 'Please try again' : ''}
                    </Alert>
                )} */}

                <VerticalForm
                    onSubmit={(data) => {
                        // Sanitize the input values on form submission
                        const sanitizedData = {
                            ...data,
                            username: data.username.trim(),
                            password: data.password.trim(),
                        };
                        onSubmit(sanitizedData);
                    }}
                    resolver={schemaResolver}
                >
                    <FormInput
                        label={t('Email')}
                        type="text"
                        name="username"
                        placeholder={t('Enter your Email')}
                        containerClass={'mb-3'}
                        onChange={(e) => {
                            e.target.value = e.target.value.replace(/^\s+|\s+$/g, ''); // Trim spaces
                        }}
                    />
                    <FormInput
                        label={t('Password')}
                        type="password"
                        name="password"
                        placeholder={t('Enter your password')}
                        containerClass={'mb-3'}
                        onChange={(e) => {
                            e.target.value = e.target.value.replace(/^\s+|\s+$/g, ''); // Trim spaces
                        }}
                    />

                    <div className="mb-3 mb-0 text-center">
                        <Button className="custom-buttons" type="submit" disabled={loading}>
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
