// @flow
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';

// actions
import { showRightSidebar, changeSidebarType } from '../redux/actions';

// components
import ProfileDropdown from '../components/ProfileDropdown';

// images
import profilePic from '../assets/images/users/avatar-1.jpg';
import avatar1 from '../assets/images/users/avatar-2.jpg';
import avatar2 from '../assets/images/users/avatar-4.jpg';
import logoSmDark from '../assets/images/logo_sm_dark.png';
import logoSmLight from '../assets/images/logo_sm.png';
import logo from '../assets/images/logo-light.png';

//constants
import * as layoutConstants from '../constants/layout';
import { Button } from 'react-bootstrap';

// get the notifications

// get the profilemenu
const ProfileMenus = [
    // {
    //     label: 'My Account',
    //     icon: 'mdi mdi-account-circle',
    //     redirectTo: '#',
    // },
    // {
    //     label: 'Settings',
    //     icon: 'mdi mdi-account-edit',
    //     redirectTo: '#',
    // },
    // {
    //     label: 'Support',
    //     icon: 'mdi mdi-lifebuoy',
    //     redirectTo: '#',
    // },
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

    /**
     * Toggle the leftmenu when having mobile screen
     */
    const handleLeftMenuCallBack = () => {
        setIsopen((prevState) => !prevState);
        if (openLeftMenuCallBack) openLeftMenuCallBack();

        switch (layoutType) {
            case layoutConstants.LAYOUT_VERTICAL:
                // condition added
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

    /**
     * Toggles the right sidebar
     */
    // const handleRightSideBar = () => {
    //     dispatch(showRightSidebar());
    // };
    const location = useLocation(); // Get the current location object
    const { pathname } = location; // Extract pathname

    // Define a mapping of paths to titles
    const pathToTitleMap = {
        '/dashboard': 'Dashboard',
        '/dashboard/project': 'Dashboard', // Example of multiple paths mapping to the same title
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
        '/apps/rcm/addclinic?clincid': 'Add Sub Practices'

    };

    // Get the title for the current path or use a default value
    const getPageTitle = (path) => {
        const keys = Object.keys(pathToTitleMap);
        // Match the full path or prefixes
        for (const key of keys) {
            if (path.startsWith(key)) {
                return pathToTitleMap[key];
            }
        }
        return 'Page Not Found'; // Fallback title
    };

    const pageTitle = getPageTitle(pathname);

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

                    {/* toggle for vertical layout */}
                    {(layoutType === layoutConstants.LAYOUT_VERTICAL || layoutType === layoutConstants.LAYOUT_FULL) && (
                        <div className='d-flex align-items-center'>
                            <button className="button-menu-mobile open-left" onClick={handleLeftMenuCallBack}>
                                <i className="mdi mdi-menu" />
                            </button>
                            <h4 className=''>{pageTitle}</h4>
                        </div>
                    )}

                    {/* toggle for horizontal layout */}
                    {layoutType === layoutConstants.LAYOUT_HORIZONTAL && (
                        <Link
                            to="#"
                            className={classNames('navbar-toggle', { open: isopen })}
                            onClick={handleLeftMenuCallBack}>
                            <div className="lines">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </Link>
                    )}

                    {/* toggle for detached layout */}
                    {layoutType === layoutConstants.LAYOUT_DETACHED && (
                        <Link to="#" className="button-menu-mobile disable-btn" onClick={handleLeftMenuCallBack}>
                            <div className="lines">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
};

export default Topbar;
