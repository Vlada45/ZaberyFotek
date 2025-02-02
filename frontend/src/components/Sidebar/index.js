import React from 'react';
import {
    CloseIcon,
    Icon,
    SidebarBtn,
    SidebarBtnLink,
    SidebarContainer,
    SidebarLink,
    SidebarMenu,
    SidebarWrapper
} from "./SidebarComponents";
import {UserProfile} from "../Navbar/NavbarComponents";

/** Navbar pro zařízení s menší obrazovkou **/
function Sidebar({isOpen, toggle}) {

    const loggedInUser = localStorage.getItem("user");

    const data = JSON.parse(loggedInUser);

    const firstLetter = data?.username?.charAt(0);

    const icon = data?.image;

    console.log(data.username);

    return (
        <SidebarContainer isOpen={isOpen} onClick={toggle}>

            <Icon onClick={toggle}>

                <CloseIcon/>

            </Icon>

            <SidebarWrapper>

                <SidebarMenu>

                    <SidebarLink to={"o-projektu"}>O projektu</SidebarLink>
                    <SidebarLink to={"kontakt"}>Kontakt</SidebarLink>
                    <SidebarLink to={""}>Vyzkoušet nyní</SidebarLink>

                </SidebarMenu>

                <SidebarBtn>
                    {loggedInUser ? (
                        <SidebarBtnLink
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: '25px',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            to={'ucet'}
                        >
                            {icon ? (
                                <UserProfile to={"ucet"}>
                                    <img
                                        src={icon}
                                        alt={'Ikona Google'}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                </UserProfile>
                            ) : (
                                <UserProfile style={{ background: '#fc555f' }} to={"ucet"}>
                                    {firstLetter}
                                </UserProfile>
                            )}
                            {data?.username}
                        </SidebarBtnLink>
                    ) : (
                        <SidebarBtn>
                            <SidebarLink to={"prihlaseni"}>Přihlášení</SidebarLink>
                            <SidebarBtnLink to={"registrace"}>Registrace</SidebarBtnLink>
                        </SidebarBtn>
                    )}
                </SidebarBtn>

            </SidebarWrapper>

        </SidebarContainer>
    );
}

export default Sidebar;