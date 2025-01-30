import styled from 'styled-components';
import {Link} from "react-router-dom";
import {FaBars} from "react-icons/fa";

export const Nav = styled.div.withConfig({
    shouldForwardProp: (prop) => !['show'].includes(prop),
})`
    height: 80px;
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 0.5rem calc((100vw - 1000px) / 2);
    background: var(--color-shadow-1);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.18);
    backdrop-filter: blur(50px);
    position: fixed;
    transition: opacity 0.5s ease-in-out;
    opacity: ${({show}) => (show ? '1' : '0')};
    z-index: 100;

    & > :first-child {
        position: absolute;
        left: 0;
        top: 0;
        
        p {
            font-family: "Dancing Script", serif;
            font-weight: 400;
            font-style: normal;
            font-size: 45px;
        }
    }
`;

export const NavLink = styled(Link)`
    color: black;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    padding: 0 1.2rem;
    height: 100%;
    cursor: pointer;
    font-size: 20px;

    &:active {
        color: var(--color-blue-4);
    }
`;

export const Bars = styled(FaBars)`
    display: none;
    color: var(--color-blue-6);

    @media screen and (max-width: 1100px) {
        display: block;
        position: absolute;
        right: 0;
        top: 0;
        transform: translate(-100%, 65%);
        font-size: 1.8rem;
        cursor: pointer;
    }
`;

export const NavMenu = styled.div`
    display: flex;
    align-items: center;
    margin-right: -15px;
    
    @media screen and (max-width: 1100px) {
        display: none;
    }
`;

export const NavBtn = styled.div`
    display: flex;
    align-items: center;
    justify-content:  center;
    position: absolute;
    right: 0; 
    top: 50%;
    transform: translateY(-50%);
    margin-right: 25px;

    @media screen and (max-width: 1100px) {
        display: none;
    }
`;

export const NavBtnLink = styled(Link)`
    border-radius: 9999px;
    background: var(--color-blue-7);
    padding: 10px 22px;
    color: #fff;
    border: none;
    outline: none;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    text-decoration: none;
    font-size: 17px;

    &:hover {
        transition: all 0.2s ease-in-out;
        background: var(--color-blue-5);
    }`;

export const UserProfile = styled(Link)`
    align-items: center;
    border-radius: 36px;
    box-shadow: inset 0 0 1px 0 rgba(0, 0, 0, .3);
    color: #fff;
    display: flex;
    font-size: 13px;
    font-weight: 600;
    height: 36px;
    justify-content: center;
    line-height: 24px;
    width: 36px;
`;