import React, { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PrivateRoute from './PrivateRoute';
import Root from './Root';
import * as layoutConstants from '../constants/layout';

// All layouts/containers
import DefaultLayout from '../layouts/Default';
import VerticalLayout from '../layouts/Vertical';
import DetachedLayout from '../layouts/Detached';
import HorizontalLayout from '../layouts/Horizontal';
import FullLayout from '../layouts/Full';
import Blood from '../pages/apps/Settings/blood';

// lazy load all the views

// auth
const Login = React.lazy(() => import('../pages/account/Login'));
const Logout = React.lazy(() => import('../pages/account/Logout'));
const Register = React.lazy(() => import('../pages/account/Register'));
const Confirm = React.lazy(() => import('../pages/account/Confirm'));
const ForgetPassword = React.lazy(() => import('../pages/account/ForgetPassword'));
const ResetPassword = React.lazy(() => import('../pages/account/ResetPassword'));
const LockScreen = React.lazy(() => import('../pages/account/LockScreen'));

const Login2 = React.lazy(() => import('../pages/account2/Login2'));
const Logout2 = React.lazy(() => import('../pages/account2/Logout2'));
const Register2 = React.lazy(() => import('../pages/account2/Register2'));
const Confirm2 = React.lazy(() => import('../pages/account2/Confirm2'));
const ForgetPassword2 = React.lazy(() => import('../pages/account2/ForgetPassword2'));
const LockScreen2 = React.lazy(() => import('../pages/account2/LockScreen2'));

// dashboard
const ProjectDashboard = React.lazy(() => import('../pages/dashboard/Project'));
const AllClinics = React.lazy(() => import('../pages/apps/Clinic/AllClinics'));
const AddClinics = React.lazy(() => import('../pages/apps/Clinic/AddClinic/index'));
const UpdateClinic = React.lazy(() => import('../pages/apps/Clinic/UpdateClinic/index'));
const AppointmentsList = React.lazy(() => import('../pages/apps/Appointments/index'));
const Subscriptions = React.lazy(() => import('../pages/apps/Subscriptions/index'));
// const AddSubscriptions = React.lazy(() => import('../pages/apps/Subscriptions/Addsubscriptions/index'));
const Doctors = React.lazy(() => import('../pages/apps/Doctors/index'));
const Patients = React.lazy(() => import('../pages/apps/Patients/index'));
const Permissions = React.lazy(() => import('../pages/apps/Permissions/index'));
const RoleManagement = React.lazy(() => import('../pages/apps/Roles/index'));

// SETTINGS
const PlanName = React.lazy(() => import('../pages/apps/Settings/planName'))
const Speciality = React.lazy(() => import('../pages/apps/Settings/speciality'))
const Departments = React.lazy(() => import('../pages/apps/Settings/departments'))
const Codes = React.lazy(() => import('../pages/apps/Settings/codes'))

const ContractFormat = React.lazy(() => import('../pages/apps/Settings/contract'))
const Designation = React.lazy(() => import('../pages/apps/Settings/designation'))
const ClinicType = React.lazy(() => import('../pages/apps/Settings/clinicType'))
const Location = React.lazy(() => import('../pages/apps/Settings/location'))
const Roles = React.lazy(() => import('../pages/apps/Settings/roles'))
const Tenure = React.lazy(() => import('../pages/apps/Settings/tenure'))
const JobTitle = React.lazy(() => import('../pages/apps/Settings/jobTitle'))

// pages

const ErrorPageNotFound = React.lazy(() => import('../pages/error/PageNotFound'));
const ErrorPageNotFoundAlt = React.lazy(() => import('../pages/error/PageNotFoundAlt'));
const ServerError = React.lazy(() => import('../pages/error/ServerError'));

// - other
const Invoice = React.lazy(() => import('../pages/other/Invoice'));
const Pricing = React.lazy(() => import('../pages/other/Pricing'));
const Maintenance = React.lazy(() => import('../pages/other/Maintenance'));
const Starter = React.lazy(() => import('../pages/other/Starter'));
const PreLoader = React.lazy(() => import('../pages/other/PreLoader'));
const Timeline = React.lazy(() => import('../pages/other/Timeline'));
// icons
const Dripicons = React.lazy(() => import('../pages/icons/Dripicons'));
const MDIIcons = React.lazy(() => import('../pages/icons/MDIIcons'));
const Unicons = React.lazy(() => import('../pages/icons/Unicons'));

const loading = () => <div className=""></div>;

type LoadComponentProps = {
    component: React.LazyExoticComponent<() => JSX.Element>,
};

const LoadComponent = ({ component: Component }: LoadComponentProps) => (
    <Suspense fallback={loading()}>
        <Component />
    </Suspense>
);

const AllRoutes = () => {
    const { layout } = useSelector((state) => ({
        layout: state.Layout,
    }));

    const getLayout = () => {
        let layoutCls = VerticalLayout;

        switch (layout.layoutType) {
            case layoutConstants.LAYOUT_HORIZONTAL:
                layoutCls = HorizontalLayout;
                break;
            case layoutConstants.LAYOUT_DETACHED:
                layoutCls = DetachedLayout;
                break;
            case layoutConstants.LAYOUT_FULL:
                layoutCls = FullLayout;
                break;
            default:
                layoutCls = VerticalLayout;
                break;
        }
        return layoutCls;
    };
    let Layout = getLayout();

    return useRoutes([
        { path: '/', element: <Root /> },
        {
            // public routes
            path: '/',
            element: <DefaultLayout />,
            children: [
                {
                    path: 'account',
                    children: [
                        { path: 'login', element: <LoadComponent component={Login} /> },
                        { path: 'register', element: <LoadComponent component={Register} /> },
                        { path: 'confirm', element: <LoadComponent component={Confirm} /> },
                        { path: 'forget-password', element: <LoadComponent component={ForgetPassword} /> },
                        { path: 'reset-password/:token', element: <LoadComponent component={ResetPassword} /> },
                        { path: 'lock-screen', element: <LoadComponent component={LockScreen} /> },
                        { path: 'logout', element: <LoadComponent component={Logout} /> },
                        { path: 'login2', element: <LoadComponent component={Login2} /> },
                        { path: 'register2', element: <LoadComponent component={Register2} /> },
                        { path: 'confirm2', element: <LoadComponent component={Confirm2} /> },
                        { path: 'forget-password2', element: <LoadComponent component={ForgetPassword2} /> },
                        { path: 'lock-screen2', element: <LoadComponent component={LockScreen2} /> },
                        { path: 'logout2', element: <LoadComponent component={Logout2} /> },
                    ],
                },
                {
                    path: 'error-404',
                    element: <LoadComponent component={ErrorPageNotFound} />,
                },
                {
                    path: 'error-500',
                    element: <LoadComponent component={ServerError} />,
                },
                {
                    path: 'maintenance',
                    element: <LoadComponent component={Maintenance} />,
                },
            ],
        },
        {
            // auth protected routes
            path: '/',
            element: <PrivateRoute component={Layout} />,
            children: [
                {
                    path: 'dashboard',
                    children: [
                        {
                            path: 'project',
                            element: <LoadComponent component={ProjectDashboard} />,
                        },
                    ],
                },
                {
                    path: 'apps',
                    children: [
                        {
                            path: 'rcm',
                            children: [
                                {
                                    path: 'allclinics',
                                    element: <LoadComponent component={AllClinics} />,
                                },
                                {
                                    path: 'addclinic',
                                    element: <LoadComponent component={AddClinics} />,
                                },
                                {
                                    path: 'updateclinic',
                                    element: <LoadComponent component={UpdateClinic} />,
                                },
                            ],
                        },
                        {
                            path: 'appointments',
                            children: [
                                {
                                    path: 'list',
                                    element: <LoadComponent component={AppointmentsList} />,
                                },
                            ],
                        },
                        {
                            path: 'users',
                            children: [
                                {
                                    path: 'list',
                                    element: <LoadComponent component={RoleManagement} />,
                                },
                            ],
                        },
                        {
                            path: 'doctors',
                            children: [
                                {
                                    path: 'list',
                                    element: <LoadComponent component={Doctors} />,
                                },
                            ],
                        },
                        {
                            path: 'subscriptions',
                            children: [
                                {
                                    path: 'list',
                                    element: <LoadComponent component={Subscriptions} />,
                                },
                            ],
                        },
                        {
                            path: 'patients',
                            children: [
                                {
                                    path: 'list',
                                    element: <LoadComponent component={Patients} />,
                                },
                            ],
                        },
                    ],
                },
                {
                    path: 'settings',
                    children: [
                        {
                            path: 'planName',
                            element: <LoadComponent component={PlanName} />,
                        },
                        {
                            path: 'permissions',
                            element: <LoadComponent component={Permissions} />,
                        },
                        {
                            path: 'tenure',
                            element: <LoadComponent component={Tenure} />,
                        },
                        {
                            path: 'jobtitle',
                            element: <LoadComponent component={JobTitle} />,
                        },
                        {
                            path: 'roles',
                            element: <LoadComponent component={Roles} />
                        },
                        {
                            path: 'speciality',
                            element: <LoadComponent component={Speciality} />,
                        },
                        {
                            path: 'department',
                            element: <LoadComponent component={Departments} />,
                        },
                        {
                            path: 'code',
                            element: <LoadComponent component={Codes} />,
                        },
                        {
                            path: 'contractFormat',
                            element: <LoadComponent component={ContractFormat} />,
                        },
                        {
                            path: 'designation',
                            element: <LoadComponent component={Designation} />,
                        },
                        {
                            path: 'bloodGroup',
                            element: <LoadComponent component={Blood} />,
                        },
                        {
                            path: 'clinicType',
                            element: <LoadComponent component={ClinicType} />,
                        },

                        {
                            path: 'location',
                            element: <LoadComponent component={Location} />,
                        },
                    ],
                },
            ],
        },
    ]);
};

export { AllRoutes };
