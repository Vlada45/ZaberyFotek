import styled from "styled-components";
import {FaArrowRight, FaPlus} from "react-icons/fa";
import {Resizable} from "re-resizable";

export const HomeContainer = styled.div`
    display: grid;
    background: radial-gradient(circle at top left, var(--color-blue-9) 0%, var(--color-blue-5) 10%, transparent 20%),
                radial-gradient(circle at bottom right, var(--color-blue-9) 0%, var(--color-blue-5) 10%, transparent 20%);
    width: 100vw;
    height: 100vh;
    min-height: 800px;
    z-index: -1;
    justify-content: center;
    overflow: hidden;
`;

export const TextElements = styled.div`
    display: block;
    text-align: center;
    margin-top: 80px;
`;

export const HeadingContainer = styled.h1`
    display: flex;
    color: var(--color-shadow-9);
    text-align: center;
    justify-content: center;
    font-size: 6em;
    align-items: center;
    margin-top: 75px;
    gap: 20px;

    @media screen and (max-width: 768px) {
        display: grid;
        font-size: 4em;
        gap: 0;
    }

    @media screen and (max-width: 300px) {
        display: grid;
        font-size: 2.5em;
    }
`;

export const HeadDescription = styled.p`
    font-size: 1.5em;
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    color: var(--color-shadow-7);
    margin-top: 10px;
    margin-left: 25px;
    margin-right: 25px;
`;

export const ImageArea = styled.div.withConfig({
    shouldForwardProp: (prop) => !['backgroundIsVisible', 'imageHeight', 'imageWidth', 'maxHeight', 'isClicked'].includes(prop),
})`
    display: ${({ isClicked }) => (isClicked ? 'flex' : 'grid')};
    justify-items: center;
    height: ${({ isClicked, imageHeight }) =>
            (isClicked && imageHeight.height !== 0 ? `${imageHeight.height}px` : 'calc(100vw * 0.40)')};
    width: ${({ isClicked, imageWidth }) =>
            (isClicked && imageWidth.width !== 0 ? `${imageWidth.width}px` : 'calc(100vw * 0.75)')};
    transition: width 0.5s ease;
    max-width: 750px;
    min-width: 200px;
    min-height: 200px;
    max-height: ${({ maxHeight }) => (maxHeight ? '500px' : '625px')};
    background-color: #fff;
    background-image: ${({ backgroundIsVisible }) => (backgroundIsVisible ? 'none' : 'linear-gradient(45deg, var(--color-shadow-1) 25%, transparent 25%, transparent 75%, var(--color-shadow-1) 75%), linear-gradient(45deg, var(--color-shadow-1) 25%, transparent 25%, transparent 75%, var(--color-shadow-1) 75%);')}; 
    background-size: 40px 40px;
    background-position: 0 0, 20px 20px;
    border-radius:15px;
    justify-content: center;
    align-content: center;
    box-shadow: 0 8px 32px 0 rgba( 0, 0, 0, 0.18 );
    margin: 25px;
`;


export const PlusIcon = styled(FaPlus)`
    border-radius: 50%;
    color: white;
    margin-right: 15px;
    background: var(--color-blue-7);
    transform: scale(1.25);
`;

export const DefaultBtn = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    transform: perspective(1px) translateZ(0);
    box-shadow: 0 0 1px rgba(0, 0, 0, 0);
    position: relative;
    transition-property: color;
    transition-duration: 0.3s;
    color: white;
    background: var(--color-blue-8);
    padding: 15px;
    border-radius: 0.5rem;
    font-size: 1.25rem;
    letter-spacing: 0.05rem;
    width: 300px;

    @media screen and (max-width: 400px) {
        max-width: 200px;
    }

    &::before {
        content: "";
        position: absolute;
        z-index: -1;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--color-blue-6);
        transform: scaleX(0);
        transform-origin: 0 50%;
        transition-property: transform;
        transition-duration: 0.3s;
        transition-timing-function: ease-out;
        border-radius: 0.5rem;
    }

    &:hover {
        color: white;
    }

    &:hover::before {
        transform: scaleX(1);
    }
    
`;

export const TextDesc = styled.p`
    color: black;
    font-weight: 700;
    font-size: 1.5rem;
    text-align: center;
    margin-top: 25px;

    @media screen and (max-width: 600px) {
        font-size: 1.25rem;
    }

    @media screen and (max-width: 400px) {
        display: none;
    }
`;


export const ResizeImage = styled(Resizable)`

    display: ${({ isShowed }) => (isShowed ? 'flex' : 'none')};
`;

export const RowBtn = styled.button`
    height: 50px;
    width: 50px;
    background: var(--color-blue-6);
`;

export const ArrowIcon = styled(FaArrowRight)`
    border-radius: 50%;
    color: white;
    margin-left: 15px;
    background: var(--color-blue-7);
    transform: scale(1.25);
`;
