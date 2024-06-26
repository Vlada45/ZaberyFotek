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

function Sidebar({isOpen, toggle}) {

    return (
        <SidebarContainer isOpen={isOpen} onClick={toggle}>

            <Icon onClick={toggle}>

                <CloseIcon />

            </Icon>

            <SidebarWrapper>

                <SidebarMenu>

                    <SidebarLink to={"o-projektu"}>O projektu</SidebarLink>
                    <SidebarLink to={"sluzby"}>Služby</SidebarLink>
                    <SidebarLink to={"kontakt"}>Kontakt</SidebarLink>
                    <SidebarLink to={"prihlaseni"}>Přihlášení</SidebarLink>

                </SidebarMenu>

                <SidebarBtn>

                    <SidebarBtnLink to={"/"}>Vyzkoušet nyní</SidebarBtnLink>

                </SidebarBtn>

            </SidebarWrapper>

        </SidebarContainer>
    );
}

export default Sidebar;