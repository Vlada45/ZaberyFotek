import React, {useEffect, useRef, useState} from 'react';
import {
    AddBtn,
    ArrowBtn,
    CheckmarkIcon,
    ContainerInputNumber,
    Foto,
    PieceImages,
    PiecesContainer,
    SectionOwnDirection,
    ShowNum,
    StyledInputNumber,
    StyledLabel,
    StyledLabelInput,
    SubmitBtn,
    TimeInput,
    ZaberyPage,
    ZaberySidebarContainer,
    ZaberySidebarItem
} from "./ZaberyComponents";
import {PiNumberCircleFour, PiNumberCircleOne, PiNumberCircleThree, PiNumberCircleTwo} from "react-icons/pi";
import {MinusCircleIcon, PlusCircleIcon} from "@heroicons/react/16/solid";
import {
    GoArrowDown,
    GoArrowDownLeft,
    GoArrowDownRight,
    GoArrowLeft,
    GoArrowRight,
    GoArrowUp,
    GoArrowUpLeft,
    GoArrowUpRight
} from "react-icons/go";
import {TimelineWidth} from "../../components/Timeline/TimelineWidth";
import Timeline from "../../components/Timeline/Timeline";
import {IoIosCheckmarkCircleOutline} from "react-icons/io";
import {MdOutlineZoomOutMap, MdZoomInMap} from "react-icons/md";
import {AiOutlineRotateLeft, AiOutlineRotateRight} from "react-icons/ai";
import {toast} from "react-toastify";
import {CanvasContent} from "../../components/Timeline/TimelineComponents";

/** Hlavní funkce obsahující veškeré nástroje a komponenty k vytvoření daného klipu **/
function Zabery(props) {

    let {timelineRef, barWidth} = TimelineWidth();

    barWidth -= 75;

    // Vybrané částice obrázku uživatelem
    const [selectedPieces, setSelectedPieces] = useState([]);

    // Délka částice
    const [rangeValue, setRangeValue] = useState(15);

    // Aktuální obrázek
    const [currentImage, setCurrentImage] = useState('');

    // Aktivní vybraný filtr obrázku
    const [imgFilter, setImgFilter] = useState('Bez filtru');

    let positionX = [];

    let positionY = [];

    let [vertIndex, setVertIndex] = useState(0);

    let [horIndex, setHorIndex] = useState(0);

    // Přidávání jednotlivých linií
    const [items, setItems] = useState([]);

    // Zobrazení směrů šipek a délky částice v časové ose Timeline
    const [pieceStatus, setPieceStatus] = useState(false);

    // Vlastní směr - Start
    const [xArrowStart, setXArrowStart] = useState('');
    const [yArrowStart, setYArrowStart] = useState('');

    // Vlastní směr - End
    const [xArrowEnd, setXArrowEnd] = useState('');
    const [yArrowEnd, setYArrowEnd] = useState('');

    /** Kontrola nastavené šířky nebo výšky **/
    const handleInputChange = (e, setter) => {

        const value = e.target.value;

        // Maximální vstup je čtyřciferné číslo
        if (value.length <= 4) {
            setter(value);
        }
        if (value === "") {

            toast.error("Vstupní pole nemůže být prázdné");

        }
    };

    /** Funkce pro přidání nové linie **/
    const addItem = (array, newItem) => {

        const updatedItems = [...array, newItem];

        console.log('Updated Items:', updatedItems);

        setItems(updatedItems);
    };

    /** Vypsání prvků **/
    const logItems = () => {

        console.log('Current Items:', items);

    };

    /** Funkce pro odstranění poslední linie **/
    const deleteLastItem = (array, type) => {

        console.log('Deleted Items:', array);

        const indexToRemove = array
            .map((item, index) => item.type === type ? index : -1)
            .filter(index => index !== -1)
            .pop();

        const result = indexToRemove !== undefined
            ? array.filter((_, index) => index !== indexToRemove)
            : array;

        setItems(result);
    };

    // Aktivní prvek v seznamu SidebarContainer
    const [activeItem, setActiveItem] = useState(null);

    // Aktivní směr pro obrázek
    const [activeArrow, setActiveArrow] = useState('arrow1');

    // Směr pohybu v klipu
    const [arrowDirection, setArrowDirection] = useState({x: "+", y: "-"});

    // Funkce pro zobrazení jednoho prvku
    const handleVisibility = (item, setFunction, directions) => {

        // Zobrazení původní plochy
        canvasRef.current.style.display = 'inline';

        setFunction(prevActiveItem => {

            console.log("PREVITEM", prevActiveItem)

            const newActiveItem = (prevActiveItem === item ? null : item);

            console.log("NEW", activeItem)

            return newActiveItem;
        });

        if (item.includes('arrow') && activeArrow != null) {

            handleClickMark(false);

            setActiveArrow(item);

            setArrowDirection(directions);
        }
    };

    useEffect(() => {
        console.log("ACTIVE", arrowDirection);

        const extractedNumber = parseInt(activeArrow.match(/\d+/)?.[0], 10);

        if (activeItem !== 'item4') {

            setPieceStatus(false);
        }

        // Některé šipky mají souřadnicovou osu také nula, proto nastavíme  obsah na prázdný
        if (extractedNumber % 2 === 0 && extractedNumber < 10) {

            setXArrowStart('');
            setYArrowStart('');
            setXArrowEnd('');
            setYArrowEnd('');
        } else {

            setXArrowStart(arrowDirection?.x?.split(' ').map(Number)?.[0] ?? '');
            setYArrowStart(arrowDirection?.y?.split(' ').map(Number)?.[0] ?? '');
            setXArrowEnd(arrowDirection?.x?.split(' ').map(Number)?.[1] ?? '');
            setYArrowEnd(arrowDirection?.y?.split(' ').map(Number)?.[1] ?? '');
        }

        handleClickMark(false);

    }, [activeArrow, arrowDirection, activeItem]);


    // Počet aktuálních sloupců a řádků v paneli nástrojů
    const [row, setAsRows] = useState(0);
    const [column, setAsColumns] = useState(0);

    // Ukládání dat o liniích
    const [lines, setLines] = useState({vertical: [], horizontal: []});

    // Stav tahu linie
    const [dragging, setDragging] = useState(null);

    // Inicializace plochy
    const canvasRef = useRef(null);

    // Souřadnice liní
    const [startOffset, setStartOffset] = useState(null);

    // Aktivní prvek Timeline
    const [timelineItem, setTimelineItem] = useState(null);

    /** Funkce pro přidání nebo odebrání řádků **/
    const operationHandler = (operation, type, setType, word) => {

        // Přidávání linií
        if (operation === "+") {

            setType(type + 1);

            // Akutální počet linií
            const newLines = {...lines};

            let position = 0;

            // Přidání sloupce
            if (word === "columnAdd") {

                position = canvasRef.current.width / (type + 2);

                // Přidání vertikální čáry uprostřed plátna
                newLines.vertical.push(position);

                addItem(items, {id: vertIndex, type: 'vertical', position: position});

                setVertIndex(vertIndex + 1);

            } else {

                position = canvasRef.current.height / (type + 2);

                // Přidání horizontální čáry uprostřed plátna
                newLines.horizontal.push(position);

                addItem(items, {id: horIndex, type: 'horizontal', position: position});

                setHorIndex(horIndex + 1);
            }

            setLines(newLines);

            // Odebírání linií
        } else {

            if (type !== 0) {

                setType(type - 1);

                const newLines = {...lines};

                // Odstranění veritkální linie
                if (word === "columnDel") {

                    newLines.vertical.pop();

                    deleteLastItem(items, 'vertical');

                    setVertIndex(vertIndex - 1);

                    // Odstranění horizontální linie
                } else {

                    newLines.horizontal.pop();

                    deleteLastItem(items, 'horizontal');

                    setHorIndex(horIndex - 1);
                }

                setLines(newLines);
            }
        }

        // console.log(items);

        // Překreslení plochy
        drawCanvas();
    };

    // Responzivita plochy
    useEffect(() => {

        window.addEventListener('resize', drawCanvas);

        return () => window.removeEventListener('resize', drawCanvas);
    }, [props.image]);

    // Slova pro výběr změny stlyu obrázku
    const filters = [
        {name: 'Bez filtru', value: 'none'},
        {name: 'Vignette', value: 'brightness(0.9) contrast(1.2) drop-shadow(0px 0px 20px rgba(0, 0, 0, 0.5))'},
        {name: 'Black & White', value: 'grayscale(100%)'},
        {name: 'Warm', value: 'sepia(60%) brightness(1.1)'},
        {name: 'Cool', value: 'brightness(0.9) contrast(1.1) hue-rotate(-20deg)'},
        {name: 'Vintage', value: 'sepia(80%) contrast(0.8) brightness(0.9)'},
    ];

    /** Funkce pro získání aktivního filtru obrázku **/
    const getFilter = () => {
        return filters.find(filter => filter.name === imgFilter)?.value || 'none';
    };


    /** Vykreslení plochy **/
    const drawCanvas = () => {

        // Inicializace plochy
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Obrázek
        const image = new Image();

        const savedImage = localStorage.getItem('savedImage');

        // console.log(savedImage);

        let isSaved = false;

        // Pokud fotografie není uložená
        if (!savedImage) {

            image.src = props.image;
            setCurrentImage(props.image);
            isSaved = false;

            // Pokud fotografie je uložená
        } else {

            image.src = savedImage;
            setCurrentImage(savedImage);
            isSaved = true;
        }

        image.style.border = '5px solid red';

        // Načtení obrázku
        image.onload = () => {

            // Vlastní responzivita obrázku
            responsivityCheck(canvas, image);

            // Nastavení filtru
            ctx.filter = getFilter();

            // Vykreslení obrázku do plochy
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

            // Odstranění filtru
            ctx.filter = 'none';

            // Barva linie
            ctx.strokeStyle = 'red';

            // Tloušťka linie
            ctx.lineWidth = 5;

            // Vykreslení vertikálních linií
            lines.vertical.forEach(x => {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            });

            // Vykreslení horizontálních linií
            lines.horizontal.forEach(y => {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            });


            if (!isSaved) {

                // Přidání nové fotky
                localStorage.setItem('savedImage', canvas.toDataURL());
            }
        }
    };

    const responsivityCheck = (canvas, image) => {

        if (image.height > 1000) {

            const prev = image.height;

            image.height = 800;
            image.width *= (800 / prev);
        }

        if (image.width > 1000) {

            const prev = image.width;

            image.width = 800;
            image.height *= (800 / prev);
        }

        // Velikost obrazovky uživatele
        if (window.innerWidth > 1200) {

            canvas.width = image.width;
            canvas.height = image.height;

        } else if (window.innerWidth > 1000 && window.innerWidth < 1200) {

            canvas.width = image.width * 0.75;
            canvas.height = image.height * 0.75;

        } else if (window.innerWidth > 800 && window.innerWidth < 1000) {

            canvas.width = image.width * 0.5;
            canvas.height = image.height * 0.5;

        } else {

            canvas.width = image.width * 0.35;
            canvas.height = image.height * 0.35;
        }
    }

    /** Funkce pro kontrolu, zda se linie existuje  **/
    const lineCheck = (hook, index, type, coordinates, newData) => {

        let itemExists = false;

        hook.forEach((x) => {

            if (x.id === index && x.type === type) {
                itemExists = true;
            }

        });

        // Pokud linie nebyla přidána
        if (!itemExists) {

            // Přidání linie
            addItem(items, {id: index, type: type, position: coordinates});

            // Obnovení hodnoty linie
        } else {

            setItems((prevItems) => {

                return prevItems.map((item) =>
                    item.id === index && item.type === type
                        ? {...item, ...newData}
                        : item
                );
            });
        }
    }

    /** Tah je detekován **/
    const handleMouseDown = (e) => {

        const canvas = canvasRef.current;

        // Rozměry plochy
        const rect = canvas.getBoundingClientRect();

        // Výpočet souřadnice tahu
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        let closestLine = null;

        lines.vertical.forEach((x, index) => {

            // Výpočet vzdálenosti od vertikální linie
            const distance = Math.abs(mouseX - x);

            if (distance < 5) {

                closestLine = {type: 'vertical', index, x};
            }
        });

        lines.horizontal.forEach((y, index) => {

            // Výpočet vzdálenosti od horizontální linie
            const distance = Math.abs(mouseY - y);

            if (distance < 5) {

                closestLine = {type: 'horizontal', index, y};
            }
        });

        // Přetahování linie
        if (closestLine) {

            setDragging(closestLine);

            // Uložení souřadnic linií
            setStartOffset({x: mouseX - closestLine.x, y: mouseY - closestLine.y});
        }
    };

    /** Tah je v pohybu nad plochou **/
    const handleMouseMove = (e) => {

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        let cursor = 'default';

        if (dragging) {

            console.log(`Vertical: ${lines.vertical.join(', ')}`);
            console.log(`Horizontal: ${lines.horizontal.join(', ')}`);

            // Určení typu pohybu tahu
            if (dragging.type === 'vertical') {

                const newX = (mouseX - startOffset.x);

                lines.vertical[dragging.index] = newX;
                lineCheck(items, dragging.index, 'vertical', newX, {
                    id: dragging.index,
                    type: 'vertical',
                    position: newX
                });
                cursor = 'ew-resize';

            } else if (dragging.type === 'horizontal') {

                const newY = (mouseY - startOffset.y);

                lines.horizontal[dragging.index] = newY;
                lineCheck(items, dragging.index, 'horizontal', newY, {
                    id: dragging.index,
                    type: 'horizontal',
                    position: newY
                });
                cursor = 'ns-resize';
            }

            // Aktualizace stavu linií
            setLines({...lines});

            drawCanvas();

            // Pokud uživatel nepřetahuje, ale pohybuje myší
        } else {

            lines.vertical.forEach(x => {
                if (Math.abs(mouseX - x) < 5) cursor = 'ew-resize';
            });

            lines.horizontal.forEach(y => {
                if (Math.abs(mouseY - y) < 5) cursor = 'ns-resize';
            });
        }

        canvas.style.cursor = cursor;
    };

    /** Tah je ukončen **/
    const handleMouseUp = () => {

        setDragging(null);
        setStartOffset(null);
    };

    /** Přidání a odstranění posluchačů událostí myši na canvas **/
    useEffect(() => {

        const canvas = canvasRef.current;
        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handleMouseUp);

        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseup', handleMouseUp);
        };
    }, [lines, dragging]);

    /** Vykreslení obrázku a plochy **/
    useEffect(() => {
        drawCanvas();

        console.log("SLYSIME SE")
    }, [props.image, imgFilter]);

    const sortLines = (position) => {

        let temp = 0;

        for (let i = 0; i < position.length; i++) {

            for (let j = i + 1; j < position.length; j++) {

                if (position[i] > position[j]) {

                    temp = position[i];

                    position[i] = position[j];

                    position[j] = temp;
                }
            }
        }
    }

    /** Funkce pro zobrazení jednotlivých částic z fotografie **/
    const getPieces = () => {

        // const itemsVer = items.map(line =>
        //     line.type === 'vertical'
        // );
        //
        // console.log(itemsVer);

        // Nahraná fotografie
        const image = new Image();
        image.src = currentImage;

        items.forEach(line => {

            if (line.type === 'vertical') {

                const w = (line.position * image.width) / canvasRef.current.width;

                positionX.push(w);

            } else {

                const h = (line.position * image.height) / canvasRef.current.height;

                positionY.push(h);
            }
        });

        sortLines(positionX);
        sortLines(positionY);

        console.log(positionX, positionY);

        // Pole pro částice
        const pieces = [];

        console.log("REAL", image.width, image.height)

        // Souřadnicová pole
        const finalPositionX = [0, ...positionX, image.width];
        const finalPositionY = [0, ...positionY, image.height];

        let idImg = 0;

        // Řádky
        for (let i = 0; i < finalPositionY.length - 1; i++) {

            // Sloupce
            for (let j = 0; j < finalPositionX.length - 1; j++) {

                // Pozice x, y na ploše
                const x = finalPositionX[j];
                const y = finalPositionY[i];

                // Šířka a výška částice
                const width = finalPositionX[j + 1] - x;
                const height = finalPositionY[i + 1] - y;

                // Nová plocha
                const pieceCanvas = document.createElement('canvas');
                pieceCanvas.width = width;
                pieceCanvas.height = height;

                // Nová částice
                const pieceContext = pieceCanvas.getContext('2d');

                // Nastavení filtru
                pieceContext.filter = getFilter();

                pieceContext.drawImage(image, x, y, width, height, 0, 0, width, height);

                // Přidání údajů o částicích do pole
                pieces.push({
                    id: idImg,
                    src: pieceCanvas.toDataURL()
                });

                idImg++;
            }
        }

        // Smazání původní plochy
        canvasRef.current.style.display = 'none';


        return (
            <PieceImages>

                {pieces.map(({id, src}) => {

                    // Informace o částicích
                    console.log("Piece info +++++++++", selectedPieces, pieces);

                    // Zvolený prvek uživatelem
                    const selectedPiece = selectedPieces.find(item => item.id === id);

                    return (
                        <div
                            key={id}
                            id={id}
                            onClick={() => {

                                setSelectedPieces((prevSelectedPieces) =>
                                    prevSelectedPieces.filter((selectedPiece) =>
                                        pieces.some((piece) => piece.id === selectedPiece.id)
                                    )
                                );

                                handlePieces(
                                    id,
                                    src,
                                    null,
                                    null,
                                    null,
                                    activeArrow,
                                    rangeValue,
                                    1,
                                    arrowDirection,
                                    null)}}

                            style={{
                                position: "relative"
                            }}
                        >
                            <img
                                id={id}
                                src={src}
                                alt={`Piece ${id}`}
                            />

                            {selectedPiece && (

                                <div
                                    style={{
                                        backgroundColor: "var(--color-blue-7)",
                                        border: "1px solid white",
                                        borderRadius: "50%",
                                        width: "25px",
                                        height: "25px",
                                        padding: "8px",
                                        fontSize: "12px",
                                        fontWeight: "bold",
                                        color: "white",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        display: "flex",
                                        transform: "translateY(-25px)"
                                    }}
                                >
                                    {selectedPiece.value}

                                </div>
                            )}
                        </div>
                    );
                })}

            </PieceImages>
        );
    }

    /** Funkce se aktivuje v případě, když uživatel klikne/posune danou vygenerovanou částici **/
    const handlePieces = (id,
                          src = null,
                          newWidth = null,
                          newLeft = null,
                          isSubmitted = null,
                          arrow = null,
                          duration = null,
                          special = null,
                          arrowDirection = null,
                          transition = null,
                          cameraSize = null) => {

        const checkNull =
            id !== null &&
            isSubmitted !== null &&
            arrowDirection !== null &&
            (newWidth == null || newLeft == null) &&
            cameraSize !== null;


        setTimelineItem(id);

        setActiveArrow(arrow);

        setRangeValue(duration);

        setArrowDirection(arrowDirection);

        //console.log("SUBMITTED", cameraSize);

        // Obnovení pole pro částice
        setSelectedPieces(prevItems => {

            const existingItem = prevItems.find(item => item.id === id);
            const pieceWidth = newWidth || 100;

            const checkItems = [newWidth, newLeft, isSubmitted, arrow, duration].every(param => param !== null);

            // SEKCE - Kamera
            if (special === 2) {

                return prevItems.map(item =>
                    item.id === id
                        ? {
                            ...item,
                            cameraSize: cameraSize,
                        } : item
                );

                // SEKCE - Přechody
            } else if (special === 4) {

                return prevItems.map(item =>
                    item.id === id
                        ? {
                            ...item,
                            transition: transition,
                        } : item
                );
            }

            // Vyjíměčný případ pro změnu proměnných po klinutí na tlačítko "ULOŽIT"
            else if (special === 3) {

                return prevItems.map(item =>
                    item.id === id
                        ? {
                            ...item,
                            isSubmitted: isSubmitted,
                            arrow: arrow,
                            duration: duration,
                            arrowDirection: arrowDirection
                        }
                        : item
                );

                // Vyjíměčný případ
            } else if (existingItem && special === 1) {

                // Smazání částice s číslem
                const deletedItem = prevItems.filter(item => item.id !== id);

                // Obnovení hodnot u ostatnich částic
                return deletedItem.map((item, index) => ({

                    ...item,
                    id: item.id,
                    value: index + 1
                }));
            }

            // Kontrola, zda částice existuje (není null)
            else if (existingItem) {

                // Aktualizace částice s novou šířkou, levou odchylkou a isSubmitted
                return prevItems.map((item, index) =>
                    item.id === id
                        ? {
                            ...item,
                            id: item.id,
                            //value: index,
                            width: newWidth,
                            left: newLeft,
                            isSubmitted: isSubmitted,
                            arrow: arrow,
                            duration: duration,
                            special: special,
                            arrowDirection: arrowDirection,
                            transition: transition,
                            cameraSize: cameraSize,
                        }
                        : item
                );
            }

            // Přidání částice
            else if (!existingItem && src) {

                const updatedItems = [
                    ...prevItems,
                    {
                        id: id,
                        value: prevItems.length + 1,
                        src: src,
                        width: pieceWidth,
                        left: 0,
                        isSubmitted: false,
                        arrow: 'arrow1',
                        duration: 15,
                        special: special,
                        arrowDirection: arrowDirection,
                        transition: transition,
                        cameraSize: {width: "100 px", height: "100 px", currentIndex: 1},
                    }
                ];

                // Přepočítání pozice pro všechny částice včetně nové
                return updateItems(updatedItems, pieceWidth);
            }

            // Pokud žádná podmínka není splněna
            return prevItems;
        });
    };

    /** Funkce pro responzivitu prvků v Timeline **/
    const updateItems = (updatedItems, pieceWidth) => {

        return updatedItems.map((item, index) => {

            const gap = (barWidth - (updatedItems.length * pieceWidth)) / (updatedItems.length + 1);
            const left = gap + index * (pieceWidth + gap);

            return {
                ...item,
                value: index + 1,
                left: left
            };
        });
    };


    // // Neustálý cyklus pro správnou funkčnost responzivity částic
    // useEffect(() => {
    //
    //     setSelectedPieces(prevPieces => {
    //
    //         const pieceWidth = 100;
    //
    //         return prevPieces.map((piece, index) => {
    //             const gap = (barWidth - (prevPieces.length * pieceWidth)) / (prevPieces.length + 1);
    //             const left = gap + index * (pieceWidth + gap);
    //             return {...piece, left};
    //         });
    //     });
    //
    // }, [barWidth]);

    const [isMarked, setIsMarked] = useState(false);

    /** Funkce pro zobrazení efektů tlačítka **/
    const handleClickMark = (isMarked) => {

        // Aktuálně zvolený prvek
        const currentPiece = selectedPieces.find(piece => piece.id === timelineItem);

        // Předchozí prvek v časové ose
        const previousPiece = selectedPieces.find(x => (x?.value) === (currentPiece?.value - 1));

        const durationValue =
            (currentPiece?.transition?.transitionID !== null &&
                currentPiece?.transition?.transitionID !== undefined) ||
            (previousPiece?.transition?.transitionID !== null &&
                previousPiece?.transition?.transitionID !== undefined) ||
            !isMarked ? currentPiece?.duration : rangeValue;

        handlePieces(
            timelineItem,
            currentPiece?.src,
            currentPiece?.width,
            currentPiece?.left,
            isMarked,
            activeArrow,
            durationValue,
            3,
            arrowDirection,
            currentPiece?.transition,
            currentPiece?.cameraSize);

        if (isMarked) {

            setIsMarked(true);

            // po jedné sekundě se tlačítko vrátí do původního stavu
            setTimeout(() => {
                setIsMarked(false);
            }, 1000);
        }
    };

    /** Kliknutí na prvek v Timeline **/
    const handlePieceClick = (status) => {

        if (activeItem === 'item4') {

            console.log("STATUS:", status)
            setPieceStatus(status);
        }
    };

    // Styly pro text
    const textStyles = {
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    };

    // Styly pro vlastní směr
    const rowStyles = {display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center'};

    return (
        <ZaberyPage>

            <ZaberySidebarContainer>
                <h3 style={{
                    textAlign: "center",
                    color: "white",
                    fontSize: "20px",
                    background: "var(--color-blue-4)",
                    borderRadius: "15px",
                    marginBottom: "10px",
                    letterSpacing: "1px",
                    padding: "15px"

                }}>NÁVOD NA KLIP</h3>

                <ZaberySidebarItem isClicked={activeItem === 'item1'}
                                   onClick={() => handleVisibility('item1', setActiveItem)}>

                    <PiNumberCircleOne style={{height: "35px", width: "35px"}}/> Upravit obrázek

                </ZaberySidebarItem>

                {activeItem === 'item1' && (

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '15px',
                        color: 'white',
                        marginTop: '5px',
                        marginBottom: '10px'
                    }}>
                        {filters.map((item, index) => (
                            <CanvasContent
                                key={index}
                                style={{
                                    ...textStyles,
                                    backgroundColor: imgFilter === item.name ? '#00b75c' : 'transparent',
                                    boxShadow: imgFilter === item.name ? '0px 2px 4px #79ff73' : '0px 2px 4px var(--color-shadow-6)',
                                    cursor: 'pointer'
                                }}
                                onClick={() => setImgFilter(item.name)}
                            >
                                {item.name}
                            </CanvasContent>
                        ))}
                    </div>
                )}

                <ZaberySidebarItem isClicked={activeItem === 'item2'}
                                   onClick={() => handleVisibility('item2', setActiveItem)}>

                    <PiNumberCircleTwo style={{height: "35px", width: "35px"}}/> Rozdělit na části

                </ZaberySidebarItem>

                {activeItem === 'item2' && (

                    <PiecesContainer>

                        <p>Sloupce:</p>

                        <div style={{display: "inline-flex", margin: "12px 0 18px 0", width: "100%"}}>

                            <ShowNum>{column}</ShowNum>

                            <AddBtn
                                onClick={() => operationHandler("+", column, setAsColumns, "columnAdd")}>
                                <PlusCircleIcon style={{color: "var(--color-shadow-7)"}}/>
                            </AddBtn>

                            <AddBtn
                                onClick={() => operationHandler("-", column, setAsColumns, "columnDel")}>
                                <MinusCircleIcon style={{color: "var(--color-shadow-7)"}}/>
                            </AddBtn>

                        </div>

                        <p>Řádky:</p>

                        <div style={{display: "inline-flex", margin: "12px 0 18px 0", width: "100%"}}>

                            <ShowNum>{row}</ShowNum>

                            <AddBtn onClick={() => operationHandler("+", row, setAsRows, "rowAdd")}>
                                <PlusCircleIcon style={{color: "var(--color-shadow-7)"}}/>
                            </AddBtn>

                            <AddBtn onClick={() => operationHandler("-", row, setAsRows, "rowDel")}>
                                <MinusCircleIcon style={{color: "var(--color-shadow-7)"}}/>
                            </AddBtn>

                        </div>
                    </PiecesContainer>
                )}

                <ZaberySidebarItem isClicked={activeItem === 'item3'}
                                   onClick={() => handleVisibility('item3', setActiveItem)}>

                    <PiNumberCircleThree style={{height: "35px", width: "35px"}}/> Výběr částic

                </ZaberySidebarItem>

                <ZaberySidebarItem isClicked={activeItem === 'item4'}
                                   onClick={() => handleVisibility('item4', setActiveItem)}
                >

                    <PiNumberCircleFour style={{height: "35px", width: "35px"}}/> Vytvořit klipy

                </ZaberySidebarItem>

                {/** Active item 4  **/}
                {pieceStatus &&

                    <PiecesContainer>

                        <p>Směry:</p>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(4, 1fr)",
                                gap: "5px",
                                padding: "15px"
                            }}>

                            <ArrowBtn isClicked={activeArrow === 'arrow1'}
                                      onClick={() => handleVisibility('arrow1', setActiveArrow, {x: "+", y: "-"})}
                                      title={"Vpravo nahoru"}
                            >
                                <GoArrowUpRight/>
                            </ArrowBtn>

                            <ArrowBtn isClicked={activeArrow === 'arrow2'}
                                      onClick={() => handleVisibility('arrow2', setActiveArrow, {x: "+", y: "0"})}
                                      title={"Vpravo"}>
                                <GoArrowRight/>
                            </ArrowBtn>

                            <ArrowBtn isClicked={activeArrow === 'arrow3'}
                                      onClick={() => handleVisibility('arrow3', setActiveArrow, {x: "+", y: "+"})}
                                      title={"Vpravo dolů"}>
                                <GoArrowDownRight/>
                            </ArrowBtn>

                            <ArrowBtn isClicked={activeArrow === 'arrow4'}
                                      onClick={() => handleVisibility('arrow4', setActiveArrow, {x: "0", y: "+"})}
                                      title={"Dolů"}>
                                <GoArrowDown/>
                            </ArrowBtn>

                            <ArrowBtn isClicked={activeArrow === 'arrow5'}
                                      onClick={() => handleVisibility('arrow5', setActiveArrow, {x: "-", y: "+"})}
                                      title={"Vlevo dolů"}>
                                <GoArrowDownLeft/>
                            </ArrowBtn>

                            <ArrowBtn isClicked={activeArrow === 'arrow6'}
                                      onClick={() => handleVisibility('arrow6', setActiveArrow, {x: "-", y: "0"})}
                                      title={"Vlevo"}>
                                <GoArrowLeft/>
                            </ArrowBtn>

                            <ArrowBtn isClicked={activeArrow === 'arrow7'}
                                      onClick={() => handleVisibility('arrow7', setActiveArrow, {x: "-", y: "-"})}
                                      title={"Vlevo nahoru"}>
                                <GoArrowUpLeft/>
                            </ArrowBtn>

                            <ArrowBtn isClicked={activeArrow === 'arrow8'}
                                      onClick={() => handleVisibility('arrow8', setActiveArrow, {x: "0", y: "-"})}
                                      title={"Nahoru"}>
                                <GoArrowUp/>
                            </ArrowBtn>

                            <ArrowBtn isClicked={activeArrow === 'arrow9'}
                                      onClick={() => handleVisibility('arrow9', setActiveArrow, {x: "zoom", y: "in"})}
                                      title={"Přiblížení"}>
                                <MdZoomInMap/>
                            </ArrowBtn>

                            <ArrowBtn isClicked={activeArrow === 'arrow10'}
                                      onClick={() => handleVisibility('arrow10', setActiveArrow, {x: "zoom", y: "out"})}
                                      title={"Oddálení"}>
                                <MdOutlineZoomOutMap/>
                            </ArrowBtn>

                            <ArrowBtn isClicked={activeArrow === 'arrow11'}
                                      onClick={() => handleVisibility('arrow11', setActiveArrow, {
                                          x: "rotation",
                                          y: "positive"
                                      })}
                                      title={"Rotace ve směru hodin"}>
                                <AiOutlineRotateRight/>
                            </ArrowBtn>

                            <ArrowBtn isClicked={activeArrow === 'arrow12'}
                                      onClick={() => handleVisibility('arrow12', setActiveArrow, {
                                          x: "rotation",
                                          y: "negative"
                                      })}
                                      title={"Rotace proti směru hodin"}>
                                <AiOutlineRotateLeft/>
                            </ArrowBtn>

                        </div>

                        <StyledLabel isClicked={activeArrow === 'arrow13'}>Vlastní směr:</StyledLabel>

                        <ContainerInputNumber
                            onClick={() =>
                                handleVisibility('arrow13', setActiveArrow, {
                                    x: `${xArrowStart || 0} ${xArrowEnd || 0}`,
                                    y: `${yArrowStart || 0} ${yArrowEnd || 0}`,
                                })
                            }
                        >
                            {/* Sekce START */}
                            <SectionOwnDirection isClicked={activeArrow === 'arrow13'}>

                                <div style={rowStyles}>
                                    <StyledLabel style={{color: 'white'}}>START:</StyledLabel>
                                    <div style={rowStyles}>
                                        <StyledLabelInput isClicked={activeArrow === 'arrow13'}>X:</StyledLabelInput>
                                        <StyledInputNumber
                                            type="number"
                                            value={xArrowStart}
                                            onChange={(e) => handleInputChange(e, setXArrowStart)}
                                        />
                                    </div>

                                    <div style={rowStyles}>
                                        <StyledLabelInput isClicked={activeArrow === 'arrow13'}>Y:</StyledLabelInput>
                                        <StyledInputNumber
                                            type="number"
                                            value={yArrowStart}
                                            onChange={(e) => handleInputChange(e, setYArrowStart)}
                                        />
                                    </div>
                                </div>
                            </SectionOwnDirection>

                            {/* Sekce CÍL */}
                            <SectionOwnDirection isClicked={activeArrow === 'arrow13'}>

                                <div style={rowStyles}>
                                    <StyledLabel
                                        style={{color: 'white'}}>CÍL:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</StyledLabel>
                                    <div style={rowStyles}>
                                        <StyledLabelInput isClicked={activeArrow === 'arrow13'}>X:</StyledLabelInput>
                                        <StyledInputNumber
                                            type="number"
                                            value={xArrowEnd}
                                            onChange={(e) => handleInputChange(e, setXArrowEnd)}
                                        />
                                    </div>

                                    <div style={rowStyles}>
                                        <StyledLabelInput isClicked={activeArrow === 'arrow13'}>Y:</StyledLabelInput>
                                        <StyledInputNumber
                                            type="number"
                                            value={yArrowEnd}
                                            onChange={(e) => handleInputChange(e, setYArrowEnd)}
                                        />
                                    </div>
                                </div>
                            </SectionOwnDirection>
                        </ContainerInputNumber>

                        <p style={{margin: '15px 0 5px 0'}}>Doba přehrávání:</p>

                        <div style={{
                            display: 'block',
                            width: '100%',
                            margin: 'auto',
                            textAlign: 'center'
                        }}>

                            <TimeInput type={'range'} min={'0'} max={'60'} value={rangeValue}
                                       onChange={(e) => {
                                           console.log(rangeValue);
                                           setRangeValue(+e.target.value)
                                       }}/>

                            <label>{rangeValue > 0 ? rangeValue : 15} s</label>
                        </div>

                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            width: "100%"
                        }}>

                            <SubmitBtn isMarked={isMarked}
                                       onClick={() => handleClickMark(true)}>

                                <CheckmarkIcon>
                                    {isMarked ? <IoIosCheckmarkCircleOutline style={{
                                        transform: "rotate(180deg)",
                                        transition: "all 0.5s",
                                        fontSize: "50px"
                                    }}/> : "Uložit"}


                                </CheckmarkIcon>

                            </SubmitBtn>

                        </div>

                    </PiecesContainer>}

            </ZaberySidebarContainer>

            <Foto id={"Foto"} item={activeItem} ref={timelineRef}>

                <canvas ref={canvasRef}></canvas>

                {/* Vybrané částice */}
                {activeItem === 'item3' && getPieces()}

                {activeItem === 'item4' &&
                    <Timeline canvasRef={canvasRef} selectedPieces={selectedPieces} handlePieces={handlePieces}
                              handlePieceClick={handlePieceClick} imgFilter={getFilter()}
                    />

                }

            </Foto>

            {/*<ClipTimeline>*/}


            {/*</ClipTimeline>*/}

        </ZaberyPage>
    );
}

export default Zabery;