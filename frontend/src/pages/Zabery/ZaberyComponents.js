import styled, { keyframes } from 'styled-components';
import React from "react";
import {css} from "@emotion/react";


export const ZaberyPage = styled.div`
    display: flex;  
    height: 100vh;  
    overflow: hidden;
    padding-top: 50px;
    align-items: flex-start;
    font-size: 14px;
`;


export const ZaberySidebarContainer = styled.nav`
    height: auto;
    width: 250px;
    margin-left: 50px;
    flex-direction: column;
    background: var(--color-shadow-9);
    display: flex;
    border-radius: 25px;
    box-shadow: 0 5px 10px var(--color-shadow-6, 0.3);
    min-width: 250px;
    min-height: 465px;
    margin-top: 50px;

    // 520px
    @media screen and (max-width: 768px) {
        height: 100px;
        width: 100%;
        flex-direction: row;
        bottom: 0;
    }
`;


export const ZaberySidebarItem = styled.div.withConfig({
    shouldForwardProp: (prop) => !['isClicked'].includes(prop),
})`
    padding: 10px;
    border-radius: 25px;
    color: ${({isClicked}) => (isClicked ? '#00cc66' : 'white')};
    background: ${({isClicked}) => (isClicked ? 'var(--color-shadow-8)' : 'transparent')};
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: left;
    text-decoration: none;
    width: 100%;
    cursor: pointer;
    opacity: ${({isClicked}) => (isClicked ? '1' : '0.5')};
    transition: opacity 0.25s ease-in-out;
    box-sizing: border-box;
    gap: 10px;
    margin: 1px;
    text-align: left;

    &:hover {
        opacity: 1;
        background: var(--color-shadow-8);
    }
`;


export const Foto = styled.div`
    position: relative;
    flex: ${(props) => (props.item === 'item4' ? '0' : '1')};
    height: 100%;
    // 250px + margin-left 50px Container
    display: ${(props) => (props.item === 'item4' ? 'inline-flex' : 'flex')};;
    align-items: center;
    justify-content: center;
    max-width: ${(props) => (props.item === 'item4' ? 'none' : '1250px')};

    canvas {
        //max-width: 75%;  
        //max-height: 75%; 
        //width: calc(100vw * 0.75);
        //height: calc(100vw * 0.75);
        object-fit: contain;  
    }

    // 520px
    @media screen and (max-width: 768px) {
        margin-left: 0;
    }
`;

export const SubmitBtn = styled.div.withConfig({
    shouldForwardProp: (prop) => !['isMarked'].includes(prop),
})`
    height: 50px;
    padding: 15px;
    margin-top: 5px;
    text-transform: uppercase;
    letter-spacing: 1px;
    background: transparent;
    transition: all 0.3s cubic-bezier(0.67, 0.17, 0.40, 0.83);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: 1px solid #00cc66;

    &:hover {

        background: radial-gradient(#018844, #00cc66);;
    }

    ${(props) =>
            props.isMarked &&
            css`
                width: 50px;
                height: 50px;
                background: #018844;
                border-radius: 50%;
                transform: rotate(-180deg);
                padding: 0;
            `}
`;

export const CheckmarkIcon = styled.div`
    color: white;
    transition: all 1s;
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const PiecesContainer = styled.div`
    display: grid;
    color: white;
    font-size: 16px;
    font-weight: 500;
    padding: 15px;
    text-align: left;
    gap: 5px;
    animation: ${fadeIn} 2s ease;
`;

export const AddBtn = styled.button`
    cursor: pointer;
    width: 34px;
    height: 34px;
    margin-right: 2px;
    border-radius: 50px;
    opacity: 0.5;
    transition: opacity 0.25s ease-in-out;
    
    &:hover {
        opacity: 1;
    }
`;

export const ShowNum = styled.div`
    width: 68px;
    height: 34px;
    border-radius: 50px;
    color: white;
    background: var(--color-blue-4);
    text-align: center;
    font-size: 20px;
    margin-right: 15px;
`;

export const PieceImages = styled.div`
    display: grid;
    margin-left: 50px;
    gap: 50px;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    grid-template-rows: repeat(auto-fit, minmax(200px, 1fr));
    box-sizing: border-box;
    max-width: 100%;
    width: 100%;
    position: relative;
    
    div {

        display: flex;
        background: linear-gradient(45deg, var(--color-shadow-8), 1) 0, var(--color-shadow-4) 100%;
        width: 100%;
        height: 100%;
        max-width: 250px;
        max-height: 250px;
        padding: 25px;
        box-shadow: 0 5px 20px var(--color-shadow-4, 0.3);
        border-radius: 10px;
        cursor: pointer;

        img {
            object-fit: contain;
        }
    }
    

    @media screen and (max-width: 768px) {
        margin-left: 0;
        justify-items: center;
        align-items: center;
    }
`;

export const ArrowBtn = styled.button.withConfig({
    shouldForwardProp: (prop) => !['isClicked'].includes(prop),
})`
    cursor: pointer;
    color: ${({isClicked}) => (isClicked ? '#00cc66' : 'white')};
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    padding: 5px;
    font-size: 20px;
    margin: 2px;
    opacity: ${({isClicked}) => (isClicked ? '1' : '0.5')};
    transition: opacity 0.25s ease-in-out;
    border: ${({isClicked}) => (isClicked ? '1px solid #00cc66' : 'none')};
    box-shadow: ${({isClicked}) => (isClicked ? '0 5px 5px #00cc66' : '0 5px 5px var(--color-shadow-8)')};
    
    &:hover {
        opacity: 1;
    }
`;

export const StyledInputNumber = styled.input`
    width: 50px;
    padding: 5px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
    text-align: center;
    color: black;

    &:focus {
        border-color: #00ea76;
        outline: none;
    }
`;

export const ContainerInputNumber = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
`;

export const LabelWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
`;

export const StyledLabelInput = styled.label.withConfig({
    shouldForwardProp: (prop) => !['isClicked'].includes(prop),
})`
    color: ${({isClicked}) => (isClicked ? '#005027' : '#ffee29')};;
`;

export const StyledLabel = styled.label.withConfig({
    shouldForwardProp: (prop) => !['isClicked'].includes(prop),
})`
    color: ${({isClicked}) => (isClicked ? '#00e776' : '#ffee29')};
`;

export const SectionOwnDirection = styled.label.withConfig({
    shouldForwardProp: (prop) => !['isClicked'].includes(prop),
})`
    display: flex;
    flex-direction: row;
    gap: 10px;
    background: ${({isClicked}) => (isClicked ? '#00cc66' : 'transparent')};
    color: ${({isClicked}) => (isClicked ? '#00e776' : '#ffee29')};
    padding: 2px;
    border-radius: 5px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.3s ease-in;
`;

/** Citace, tento kód byl z části převzán z níže uvedeného zdroje:
 *
 * https://blog.logrocket.com/creating-custom-css-range-slider-javascript-upgrades/
 *
 * **/
export const TimeInput = styled.input`
    
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    cursor: pointer;
    outline: none;
    overflow: hidden;
    border-radius: 16px;

    /* Webkit prohlížeče */
    &::-webkit-slider-runnable-track {
        height: 15px;
        background: #ccc;
        border-radius: 16px;
    }

    /* Mozilla Firefox */
    &::-moz-range-track {
        height: 15px;
        background: #ccc;
        border-radius: 16px;
    }

    /* Webkit prohlížeče */
    &::-webkit-slider-thumb {
        
        -webkit-appearance: none;
        appearance: none;
        height: 15px;
        width: 15px;
        background-color: #fff;
        border-radius: 50%;
        border: 2px solid #00cc66;
        box-shadow: -407px 0 0 400px #00cc66;
    }

    /* Mozilla Firefox */
    &::-moz-range-thumb {
        height: 15px;
        width: 15px;
        background-color: #fff;
        border-radius: 50%;
        border: 1px solid #00cc66;
        box-shadow: -407px 0 0 400px #00cc66;
    }
`;