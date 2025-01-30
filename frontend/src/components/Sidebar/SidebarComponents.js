import styled from "styled-components";
import {FaTimes} from "react-icons/fa";
import {Link as LinkR} from "react-router-dom";
import {Link} from "react-router-dom";

export const SidebarContainer = styled.aside.withConfig({
        shouldForwardProp: (prop) => !['isOpen'].includes(prop),
    })`
    position: fixed;
    z-index: 999;
    height: 100%;
    width: 100%;
    background: white;
    display: grid;
    align-items: center;
    left: 0;
    transition: 0.3s ease-in-out;
    opacity: ${({isOpen}) => (isOpen ? '100%' : '0')};
    top: ${({isOpen}) => (isOpen ? '0' : '-100%')};`
;

export const CloseIcon = styled(FaTimes)`
    color: var(--color-blue-6);`
;

export const Icon = styled.div`
    position: absolute;
    top: 1.2rem;
    right: 1.5rem;
    background: transparent;
    font-size: 2rem;
    cursor: pointer;`
;

export const SidebarWrapper = styled.div`
    color: black;`
;

export const SidebarMenu = styled.ul`
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(6, 80px);
    text-align: center;

    @media screen and (max-width: 480px) {
        grid-template-rows: repeat(6, 60px);
    }`
;

export const SidebarLink = styled(Link)`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    transition: 0.2s ease-in-out;
    text-decoration: none;
    list-style: none;
    color: black;
    cursor: pointer;

    &:hover {
        color: var(--color-blue-6);
        transition: 0.2s ease-in-out;
    }`
;

export const SidebarBtn = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    `
;

export const SidebarBtnLink = styled(LinkR)`
    border-radius: 50px;
    background: var(--color-blue-8);
    white-space: nowrap;
    padding: 16px 64px;
    color: white;
    font-size: 16px;
    outline: none;
    border: none;
    transition: all 0.2s ease-in-out;
    text-decoration: none;

    &:hover {
        transition: all 0.2s ease-in-out;
        color: yellow;
        background: var(--color-blue-8);
    }`
;
