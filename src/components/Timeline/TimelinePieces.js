import React, {useState, useRef, useCallback, useEffect} from 'react';

/** Funkce pro ovládání jednotlivých prvků časové osy **/
const TimelinePieces = ({piece, pieceLeft, piecesArray, onPieceUpdate, barWidth, handlePieceUpdate, activeIndex, pieceIsClicked}) => {

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

                // console.log(newLeft);

                if (leftSidePiece && newLeft < leftSidePiece.left + leftSidePiece.width) {

                    newLeft = leftSidePiece.left + leftSidePiece.width;

                    if (deltaX > 0) {

                        newWidth = startWidth.current;

                    } else {

                        newWidth = -startWidth.current;
                    }

                }

                // Funkce drag-resize je zastavena tak, aby nepřesahovala počátek prvku Timeline
                if (newLeft <= 0) {

                    return;
                }

            // Změna velikosti pravé strany
            } else if (isResizing === 'right') {

                if (rightSidePiece && newLeft + newWidth > rightSidePiece.left) {

                    newWidth = rightSidePiece.left - newLeft;
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

    }, [isResizing, piecesArray, piece.id]);

    /** Tah je ukončen **/
    const onMouseUp = useCallback(() => {

        // Aktualizace dat o prvku
        if (isResizing) {

            onPieceUpdate(piece.id, piece.src, width, left, piece.isSubmitted, piece.direction, piece.duration, piece.frameRate, piece.scanSpeed);
        }

        setIsResizing(null);

    }, [isResizing, width, left, onPieceUpdate, piece.id, piece.isSubmitted, piece.direction, piece.duration, piece.frameRate, piece.scanSpeed]);

    useEffect(() => {
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
    }, [onMouseMove, onMouseUp]);

    const boxStyles = {
        display: 'flex',
        width: `${width}px`,
        height: '50px',
        border: (activeIndex === piece.id) && pieceIsClicked ? '2px solid var(--color-blue-8)' : 'none',
        position: 'absolute',
        backgroundImage: `url(${piece.src})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'repeat-x',
        left: `${pieceLeft}px`
    };

    const handleStyles = {
        position: 'absolute',
        top: 0,
        width: '10px',
        height: '100%',
        backgroundColor: 'var(--color-blue-4)',
        cursor: 'ew-resize',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const leftHandleStyles = {
        ...handleStyles,
        left: 0,
    };

    const rightHandleStyles = {
        ...handleStyles,
        right: 0,
    };

    return (

        <div
            key={piece.id}
            ref={containerRef}
            style={boxStyles}
            onClick={() => handlePieceUpdate(piece.id, piece.src, width, left, piece.isSubmitted, piece.arrow, piece.duration, piece.frameRate, piece.scanSpeed, 0, piece.arrowDirection)}
        >
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

            <div style={{position: "absolute", bottom: "0", transform: "translateY(30px)", }}> Upravit </div>
        </div>
    );
};

export default TimelinePieces;