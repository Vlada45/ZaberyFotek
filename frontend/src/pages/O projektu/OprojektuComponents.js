import styled, {keyframes} from "styled-components";
export const UList = styled.ul`
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    margin-top: 25px;
    flex-direction: column;
    
`;

export const DesUl = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
    margin-top: 15px;
    width: 75%;
    //margin-left: 25%;
`;

export const TextDecoration = styled.div`
    color: var(--home-blue-dark);
    font-weight: 500;
    margin-right: 5px;
`;

export const OrderList = styled.div`
    margin-top: 15px;

    div {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
    }

    span {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        background-color: #4f58bd;
        color: #fff;
        margin-right: 10px;
    }
`;

export const InfoContainer = styled.div`
    background: linear-gradient(to bottom, transparent 0%, var(--color-blue-2) 25%, var(--color-blue-4) 100%);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 25px;
    overflow: visible;
`;