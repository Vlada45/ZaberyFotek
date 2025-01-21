import React, {useState, useRef, useCallback, useEffect, useMemo} from 'react';
import {MdCancel} from "react-icons/md";
import {logDOM} from "@testing-library/react";
import {toast} from "react-toastify";

/** Funkce pro ovládání jednotlivých prvků časové osy **/
const TimelinePieces = ({
                            piece,
                            pieceLeft,
                            piecesArray,
                            onPieceUpdate,
                            barWidth,
                            handlePieceUpdate,
                            activeIndex,
                            pieceIsClicked,
                            timelineWidth,
                            btnName,
                            transition,
                            imgFilter
                        }) => {

    // Změna velikosti prvku
    const [isResizing, setIsResizing] = useState(null);

    const startX = useRef(0);
    const startWidth = useRef(0);
    const startLeft = useRef(0);
    const containerRef = useRef(null);

    // Šířka prvku
    const [width, setWidth] = useState(piece.width || 100);

    // Levá odchylka prvku
    const [left, setLeft] = useState(piece.left || 0);

    // Kontrola názvu tlačítka
    const btnCondition = btnName !== "Vyberte prosím jeden z přechodů";

    // Předchozí prvek v časové ose
    const previousPiece = piecesArray.find(x => (x?.value) === (piece?.value - 1));

    // Následující prvek v časové ose
    const nextPiece = piecesArray.find(x => (x?.value) === (piece?.value + 1));

    /** Tah je detekován **/
    const onMouseDown = useCallback((e, direction) => {

        e.preventDefault();
        setIsResizing(direction);
        startX.current = e.clientX;
        startWidth.current = width;
        startLeft.current = left;

    }, [width, left]);

    /** Tah je v pohybu **/
    const onMouseMove = useCallback((e) => {

        const MIN_WIDTH = 100;

        if (isResizing) {

            // ID prvku
            const pieceID = piecesArray.findIndex(p => p.id === piece.id);

            const deltaX = e.clientX - startX.current;

            // Parametry pro novou šířku a levou odchylku
            let newWidth = Math.max(startWidth.current + (isResizing === 'right' ? deltaX : -deltaX), MIN_WIDTH);
            let newLeft = startLeft.current + (isResizing === 'left' ? deltaX : 0);

            // Nejbližší levý prvek
            const leftSidePiece = pieceID > 0 ? piecesArray[pieceID - 1] : null;

            // Nejbližší pravý prvek
            const rightSidePiece = pieceID < piecesArray.length - 1 ? piecesArray[pieceID + 1] : null;

            // Změna velikosti levé strany
            if (isResizing === 'left') {

                if ((leftSidePiece && newLeft < leftSidePiece.left + leftSidePiece.width) || newWidth === MIN_WIDTH) {

                    // newLeft = leftSidePiece.left + leftSidePiece.width;
                    //
                    // if (deltaX > 0) {
                    //
                    //     newWidth = startWidth.current;
                    //
                    // } else {
                    //
                    //     newWidth = -startWidth.current;
                    // }

                    return;

                }

                if (previousPiece?.transition?.transitionID !== undefined) {

                    if (!toast.isActive("unique-toast-1")) {
                        toast.info("Přechody: Pro změnu velikosti je třeba resetovat přechod předchozího prvku",
                            {toastId: "unique-toast-1"});
                    }

                    return;
                }

                // Funkce drag-resize je zastavena tak, aby nepřesahovala počátek prvku Timeline
                if (newLeft <= 0) {

                    return;
                }

                // Změna velikosti pravé strany
            } else if (isResizing === 'right') {

                if (rightSidePiece && newLeft + newWidth > rightSidePiece.left) {

                    // newWidth = rightSidePiece.left - newLeft;

                    return;
                }

                // Zamezení změny velikosti částice, pokud již obsahuje přechod
                if (piece?.transition?.transitionID !== undefined) {

                    if (!toast.isActive("unique-toast-2")) {
                        toast.info("Přechody: Pro změnu velikosti prvku použijte tlačítko RESET",
                            {toastId: "unique-toast-2"});
                    }

                    return;
                }

                // Funkce drag-resize je zastavena tak, aby nepřesahovala konec prvku Timeline
                if ((newLeft + newWidth) >= barWidth) {

                    return;
                }
            }

            // Nastavení nové šířky a levé odchylky
            setWidth(newWidth);
            setLeft(newLeft);

            // Nastavení aktuální šířky a levé odchylky prvku
            containerRef.current.style.width = `${newWidth}px`;
            containerRef.current.style.left = `${newLeft}px`;
        }

    }, [isResizing, piecesArray, piece.id, piece?.transition]);

    const [cancelClipBtn, setCancelBtn] = useState(true);

    const checkCancel = piece.isSubmitted && !cancelClipBtn;

    useEffect(() => {

        if (!piece) return;

        //console.log("ID", piece.id, piece?.transition?.coordinateRes);

        // ID prvku
        const pieceID = piecesArray.findIndex(p => p.id === piece.id);

        // console.log("PIECE", piece?.id, piece?.transition?.coordinateRes)

        // Nejbližší pravý prvek
        const rightSidePiece = pieceID < piecesArray.length - 1 ? piecesArray[pieceID + 1] : null;

        if (piece.isSubmitted && !isResizing) {

            setCancelBtn(false);

            const timelineWidthPX = timelineWidth.current.offsetWidth;

            const durationWidth = (timelineWidthPX / 60) * piece.duration;

            if (rightSidePiece !== null && (piece.left + durationWidth) < piecesArray[pieceID + 1].left) {

                // Nastavení délky částice z výběru časového úseku
                setWidth(durationWidth);

            } else if (rightSidePiece !== null && (piece.left + durationWidth) > piecesArray[pieceID + 1].left) {

                const maxWidth = piecesArray[pieceID + 1].left - (piece.left);

                console.log(maxWidth);

                setWidth(maxWidth);
            }

            handlePieceUpdate(
                piece.id, piece.src, width, left, piece.isSubmitted, piece.arrow,
                piece.duration, 0, piece.arrowDirection, piece.transition, piece.cameraSize
            );
        }

    }, [piece.isSubmitted, width, left, piece?.transition]);

    /** Funkce spravující kliknutí na částici v Timeline **/
    const handleClick = (type) => {

        pieceIsClicked = true;

        console.log(piece);

        if (type === "piece" && cancelClipBtn) {

            handlePieceUpdate(
                piece.id, piece.src, piece.width, piece.left, piece.isSubmitted, piece.arrow,
                piece.duration, 0, piece.arrowDirection, piece.transition, piece.cameraSize
            );

        } else if (type === "cancel") {

            // Zabraňuje spuštění kliknutí na prvek
            // event.stopPropagation();

            handlePieceUpdate(
                piece.id, piece.src, width, left, false, piece.arrow,
                piece.duration, 0, piece.arrowDirection, piece.transition, piece.cameraSize
            );

            // Smazání tlačítka
            setCancelBtn(true);
        }
    };

    /** Tah je ukončen **/
    const onMouseUp = useCallback(() => {

        // Aktualizace dat o prvku
        if (isResizing) {

            onPieceUpdate(piece.id, piece.src, width, left, piece.isSubmitted, piece.arrow,
                piece.duration, 0, piece.arrowDirection, piece.transition, piece.cameraSize);
        }

        setIsResizing(null);

    }, [isResizing, width, left, onPieceUpdate, piece.id, piece.isSubmitted, piece.arrow, piece.duration, piece.arrowDirection, piece.transition, piece.cameraSize]);

    useEffect(() => {

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);

            return () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };
        }
        ,
        [onMouseMove, onMouseUp]
    );

    // Stanovení stylů pro částici
    const boxStyles = {
        display: 'flex',
        width: `${width}px`,
        height: '50px',
        border: btnCondition
            ? (transition.idPieces &&
            Object.values(transition.idPieces).some(value => value === piece.id) && pieceIsClicked
                ? '2px solid #9e1a1f'
                : 'none')
            : (activeIndex === piece.id && pieceIsClicked
                ? '2px solid var(--color-blue-8)'
                : 'none'),
        position: 'absolute',
        //backgroundImage: `url(${piece.src})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'repeat-x',
        left: `${pieceLeft}px`,
        justifyContent: 'center'
    };

    const backgroundStyles = {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundImage: `url(${piece.src})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'repeat-x',
        filter: imgFilter
    };

    const handleStyles = {
        position: 'absolute',
        top: 0,
        width: '10px',
        height: '100%',
        cursor: 'ew-resize',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const leftHandleStyles = {
        ...handleStyles,
        backgroundColor: btnCondition
            ? '#ff5b61'
            : previousPiece?.transition?.transitionID !== undefined && previousPiece?.transition?.transitionID !== null
                ? '#ff5b61'
                : 'var(--color-blue-4)',
        left: 0,
    };

    const rightHandleStyles = {
        ...handleStyles,
        backgroundColor: btnCondition
            ? '#ff5b61'
            : piece?.transition?.transitionID !== undefined && piece?.transition?.transitionID !== null && nextPiece
                ? '#ff5b61'
                : 'var(--color-blue-4)',
        right: 0,
    };

    return (

        <div
            key={piece.id}
            ref={containerRef}
            style={boxStyles}
            onClick={(e) => handleClick("piece", e)}
        >
            <div style={backgroundStyles}></div>

            <div
                style={leftHandleStyles}
                onMouseDown={(e) => onMouseDown(e, 'left')}
            >|
            </div>

            <div
                style={rightHandleStyles}
                onMouseDown={(e) => onMouseDown(e, 'right')}
            >|
            </div>

            {/** Nabídka klip zrušit **/}
            {piece.isSubmitted && checkCancel && (
                <div
                    onClick={(e) => handleClick("cancel", e)}
                    style={{
                        display: checkCancel ? 'flex' : 'none',
                        position: 'absolute',
                        bottom: '0',
                        transform: 'translateY(30px)',
                        cursor: 'pointer',
                        background: "#9e1a1f",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "5px",
                        color: "white",
                        width: "100%",
                        gap: "5px",
                        maxWidth: "75px"
                    }}
                >
                    <MdCancel/> Zrušit

                </div>
            )}

            {(piece?.transition?.coordinateRes !== undefined && piece?.transition?.coordinateRes !== null) &&

                <div
                    title={'Přechod'}
                    style={{
                        position: 'absolute',
                        bottom: '0',
                        left: `${piece?.transition?.coordinateRes}px`,
                        transform: 'translateX(-2px) translateY(30px)',
                        cursor: 'pointer',
                        background: 'repeating-linear-gradient(to bottom, #ff5b61, #ff5b61 5px, transparent 5px, transparent 10px)',
                        width: '5px',
                        height: '30px'
                    }}
                >

                    <div style={{
                        position: 'absolute',
                        bottom: '0px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: '#f00'
                    }}></div>

                </div>
            }

        </div>
    );
};

export default TimelinePieces;