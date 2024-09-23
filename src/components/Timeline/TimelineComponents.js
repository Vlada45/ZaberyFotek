import styled from "styled-components";

export const ClipContainer = styled.div`
    display: flex;
    height: calc(100vh * 0.5);
    width: calc(100vw * 0.75);
    margin-left: 25px;
    padding-top: 15px;
`;

export const VideoTools = styled.div`
    background: var(--color-shadow-8);
    flex: 1;
`;

export const VideoPreview = styled.div`
    background: black;
    flex: 3;
    display: flex;
    justify-content: center;
    align-items: center;
    
    canvas {
        width: 100%;
        height: 100%;
    }
`;

export const TimelineContainer = styled.div`
    display: grid;
    padding: 20px;
    background: var(--color-shadow-1);
    border-radius: 15px;
    margin: 25px 0 15px 25px;
    width: calc(100vw * 0.75);
`;