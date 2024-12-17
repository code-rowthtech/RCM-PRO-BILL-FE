import { Children } from "react";

const MENU_ITEMS = [
    // { key: 'navigation', label: 'Navigation', isTitle: true },
    {
        key: 'dashboards',
        label: 'Dashboard',
        isTitle: false,
        icon: 'uil-home-alt',
        url: '/dashboard/project',
    },
    // {
    //     key: 'apps-crm',
    //     label: 'Clinics',
    //     isTitle: false,
    //     // badge: { variant: 'danger', text: 'New' },
    //     icon: 'uil-ambulance',
    //     children: [
    //         {
    //             key: 'add-clinic',
    //             label: 'Add Clinics',
    //             url: '/apps/crm/addclinic',
    //             parentKey: 'apps-crm',
    //         },
    //     ]
    // },
    {
        key: 'all-clinic',
        label: 'Practice',
        url: '/apps/rcm/allclinics',
        icon: 'uil-map-pin',
    },
    {
        key: 'rolemanagement',
        label: 'Role Management',
        icon: 'uil-user-circle',
        url: '/apps/roles/list',
    },
    // {
    //     key: 'doctors',
    //     label: 'Doctors',
    //     icon: 'dripicons-medical',
    //     url: '/apps/doctors/list',
    // },
    // {
    //     key: 'patients',
    //     label: 'Patients',
    //     icon: 'uil-thermometer',
    //     url: '/apps/patients/list',
    // },
    // {
    //     key: 'appointments',
    //     label: 'Appointments',
    //     icon: 'uil-schedule',
    //     url: '/apps/appointments/list',
    // },
    // {
    //     key: 'permissions',
    //     label: 'Permissions',
    //     icon: 'uil-lock-open-alt',
    //     url: '/apps/permissions/list',
    // },

    {
        key: 'subscriptions',
        label: 'Subscriptions',
        icon: 'uil-money-withdrawal',
        url: '/apps/subscriptions/list',
    },
    // {
    //     key: 'settings',
    //     label: 'Settings',
    //     icon: 'bi-gear',
    //     url: '/apps/subscriptions/list',
    // },

    {
        key: 'settings',
        label: 'Settings',
        isTitle: false,
        icon: 'uil-copy-alt',
        children: [
            {
                key: 'planname',
                label: 'Plan Name',
                url: '/settings/planName',
                parentKey: 'settings',
            },
            {
                key: 'tenure',
                label: 'Tenure',
                url: '/settings/tenure',
                parentKey: 'settings',
            },
            {
                key: 'jobtitle',
                label: 'Job Title',
                url: '/settings/jobtitle',
                parentKey: 'settings',
            },
            {
                key: 'permissions',
                label: 'Permissions',
                url: '/settings/permissions',
                parentKey: 'settings',
            },
            {
                key: 'roles',
                label: 'Roles',
                url: '/settings/roles',
                parentKey: 'settings',
            },
            // {
            //     key: 'speciality',
            //     label: 'Practice Speciality',
            //     url: '/settings/speciality',
            //     parentKey: 'settings',
            // },
            // {
            //     key: 'department',
            //     label: 'Departments',
            //     url: '/settings/department',
            //     parentKey: 'settings',
            // },
            {
                key: 'contractformat',
                label: 'Contract Format',
                url: '/settings/contractFormat',
                parentKey: 'settings',
            },
            {
                key: 'designation',
                label: 'Designation',
                url: '/settings/designation',
                parentKey: 'settings',
            },
            // {
            //     key: 'bloodGroup',
            //     label: 'Blood Group',
            //     url: '/settings/bloodGroup',
            //     parentKey: 'settings',
            // },
            {
                key: 'clinicType',
                label: 'Practice Type',
                url: '/settings/clinicType',
                parentKey: 'settings',
            },
            // {
            //     key: 'location',
            //     label: 'Location',
            //     url: '/settings/location',
            //     parentKey: 'settings',
            // },
        ],

    },
    {
        key: 'logout',
        label: 'Logout',
        icon: 'mdi mdi-logout',
        // url: '',
    },
];

export default MENU_ITEMS;
