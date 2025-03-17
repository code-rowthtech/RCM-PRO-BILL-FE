// @flow
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';

// actions
import { changeSidebarType } from '../redux/actions';

// components
import ProfileDropdown from '../components/ProfileDropdown';

// images
import profilePic from '../assets/images/users/avatar-1.jpg';
import logoSmDark from '../assets/images/logo_sm_dark.png';
import logoSmLight from '../assets/images/logo_sm.png';
import logo from '../assets/images/logo-light.png';

// constants
import * as layoutConstants from '../constants/layout';

const ProfileMenus = [
    {
        label: 'Lock Screen',
        icon: 'mdi mdi-lock-outline',
        redirectTo: '/account/lock-screen',
    },
    {
        label: 'Logout',
        icon: 'mdi mdi-logout',
        redirectTo: '/account/logout',
    },
];

type TopbarProps = {
    hideLogo?: boolean,
    navCssClasses?: string,
    openLeftMenuCallBack?: () => void,
    topbarDark?: boolean,
};

const Topbar = ({ hideLogo, navCssClasses, openLeftMenuCallBack, topbarDark }: TopbarProps): React$Element<any> => {
    const dispatch = useDispatch();
    const [isopen, setIsopen] = useState(false);
    const navbarCssClasses = navCssClasses || '';
    const containerCssClasses = !hideLogo ? 'container-fluid' : '';
    const { layoutType, leftSideBarType } = useSelector((state) => ({
        layoutType: state.Layout.layoutType,
        leftSideBarType: state.Layout.leftSideBarType,
    }));

    const location = useLocation(); // Get the current location object
    const { pathname, search } = location; // Extract pathname and search query

    const pathToTitleMap = {
        '/dashboard': 'Dashboard',
        '/dashboard/project': 'Dashboard',
        '/profile': 'Profile',
        '/apps/subscriptions/list': 'Subscriptions',
        '/apps/roles/list': 'Role Management',
        '/apps/rcm/allclinics': 'Practices',
        '/apps/rcm/addclinic': 'Add Practice',
        '/apps/rcm/updateclinic': 'Update Practice',
        '/settings/planName': 'Plans',
        '/settings/tenure': 'Tenures',
        '/settings/permissions': 'Permissions',
        '/settings/roles': 'Roles',
        '/settings/clinicType': 'Practice Types',
        '/settings/jobtitle': 'Job Title',
        '/settings/contractFormat': 'Contract Format',
        '/settings/designation': 'Designation',
        '/settings/code': 'Codes',

    };
    const getPageTitle = (path, queryString) => {
        const queryParams = new URLSearchParams(queryString);

        for (const [key, title] of Object.entries(pathToTitleMap)) {
            if (key.includes('?')) {
                const [basePath, paramStr] = key.split('?');
                if (path.startsWith(basePath)) {
                    const expectedParams = new URLSearchParams(paramStr);

                    // Check if all query params match
                    const allMatch = Array.from(expectedParams.entries()).every(([param, value]) =>
                        queryParams.get(param) === value
                    );

                    if (allMatch) {
                        return title;
                    }
                }
            } else if (path.startsWith(key)) {
                return title;
            }
        }

        return 'Page Not Found';
    };

    // State to manage the page title
    const [pageTitle, setPageTitle] = useState(() => getPageTitle(pathname, search));

    useEffect(() => {
        // Check if the pathname is '/apps/rcm/addclinic' and has the query parameter 'clincid'
        if (pathname === '/apps/rcm/addclinic' && search.includes('clincid')) {
            setPageTitle('Add Sub Practice');
        } else {
            // Use the default logic to get the title
            setPageTitle(getPageTitle(pathname, search));
        }
    }, [pathname, search]);


    const handleLeftMenuCallBack = () => {
        setIsopen((prevState) => !prevState);
        if (openLeftMenuCallBack) openLeftMenuCallBack();

        switch (layoutType) {
            case layoutConstants.LAYOUT_VERTICAL:
                if (window.innerWidth >= 768) {
                    if (leftSideBarType === 'fixed' || leftSideBarType === 'scrollable')
                        dispatch(changeSidebarType(layoutConstants.LEFT_SIDEBAR_TYPE_CONDENSED));
                    if (leftSideBarType === 'condensed')
                        dispatch(changeSidebarType(layoutConstants.LEFT_SIDEBAR_TYPE_FIXED));
                }
                break;

            case layoutConstants.LAYOUT_FULL:
                if (document.body) {
                    document.body.classList.toggle('hide-menu');
                }
                break;
            default:
                break;
        }
    };

    return (
        <>
            <div className={classNames('navbar-custom', navbarCssClasses)}>
                <div className={containerCssClasses}>
                    {!hideLogo && (
                        <Link to="/" className="topnav-logo">
                            <span className="topnav-logo-lg">
                                <img src={logo} alt="logo" height="16" />
                            </span>
                            <span className="topnav-logo-sm">
                                <img src={topbarDark ? logoSmLight : logoSmDark} alt="logo" height="16" />
                            </span>
                        </Link>
                    )}

                    <ul className="list-unstyled topbar-menu float-end mb-0">
                        <li className="dropdown notification-list">
                        </li>
                        <li className="dropdown notification-list">
                            <ProfileDropdown
                                profilePic={profilePic}
                                menuItems={ProfileMenus}
                            />
                        </li>
                    </ul>

                    {(layoutType === layoutConstants.LAYOUT_VERTICAL || layoutType === layoutConstants.LAYOUT_FULL) && (
                        <div className='d-flex align-items-center'>
                            <button className="button-menu-mobile open-left" onClick={handleLeftMenuCallBack}>
                                <i className="mdi mdi-menu" />
                            </button>
                            <h4 className=''>{pageTitle}</h4>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Topbar;
