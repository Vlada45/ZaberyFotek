import React, {useCallback, useRef, useState} from 'react';
import {
    ArrowIcon,
    DefaultBtn,
    HeadDescription,
    HeadingContainer,
    HomeContainer,
    ImageArea,
    PlusIcon,
    TextDesc,
    TextElements,
} from "./HomeElements";
import {ReactTyped} from "react-typed";
import {Resizable} from "re-resizable";
import {Resizer} from "re-resizable/lib/resizer";
import {useNavigate} from "react-router-dom";

/** Obrazovka - Domovská stránka **/
function Home(props) {

    // Kontrola, zda je tlačítko zobrazeno
    const [isUploadBtnVisible, setIsUploadBtnVisible] = useState(true);

    // Změna rozvržení ImageArea
    const [isChanged, changeAreaDisplay] = useState(false);

    // Reference na vstupní soubor uživatele
    const fileInputRef = useRef(null);

    /** Výběr souboru uživatele **/
    const fileBtnClick = () => {
        fileInputRef.current.click();
    };

    // Obsah fotky
    const [imageSrc, setImageSrc] = useState(null);

    /** Funkce pro načtení obrázku **/
    const imageUpload = (event) => {

        // načtený soubor
        const file = event.target.files[0];

        if (file) {

            // Přečtení souboru
            const reader = new FileReader();

            reader.onload = (e) => {

                // Funkce pro načtení obsahu obrázku, imageSrc je získaná URL obrázku
                setImageSrc(e.target.result);
            };

            // Přečtení souboru jako URL
            reader.readAsDataURL(file);
            changeAreaDisplay(!isChanged);
            setIsUploadBtnVisible(false);

            // // Reset úložiště
            // localStorage.clear();

            // props.setImage(null);

            localStorage.removeItem('savedImage');
            // localStorage.setItem('img', URL.createObjectURL(file));

            // localStorage.removeItem('img');
            //
            // Nastavení fotky jako nově vytvořené url souboru obrázku
            props.setImage(URL.createObjectURL(file));

        }
    };

    // Přesměrování na jinou adresu
    const navigate = useNavigate()

    /** Přesměrování **/
    const redirectPage = ()=> {
        navigate("/zabery");
    }

    // Proměnná pro stav přetahování
    const [isDragging, setIsDragging] = useState(false);

    /** Kurzor se nachází nad plochou **/
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    /** Ukončení přetažení obrázku **/
    const handleDragLeave = () => {
        setIsDragging(false);
    };

    /** Položení obrázku na plochu **/
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            imageUpload({ target: { files: [file] } });
        }
    };

    return (

        <HomeContainer>

            <TextElements>

                <HeadingContainer>

                    <div> Vytvářím</div>

                    <ReactTyped
                        strings={["klipy", "animace", "přechody"]}
                        typeSpeed={200}
                        loop
                        backSpeed={40}
                        cursorChar="|"
                        showCursor={true}
                        style={{
                            background: "linear-gradient(176deg, #001fff, #d3d7f8)",
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            WebkitBoxDecorationBreak: "clone",
                            boxDecorationBreak: "clone",
                            textShadow: "none"
                        }}
                    />

                </HeadingContainer>

                <HeadDescription>Vytvořte si perfektní klip z jednoho obrázku</HeadDescription>

            </TextElements>

            <ImageArea
                isClicked={isChanged}
                backgroundIsVisible={isChanged}
                imageHeight={isChanged}
                imageWidth={isChanged}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={isDragging ? "drag-over" : ""}
            >
                {imageSrc && (
                    <img
                        id="foto"
                        src={imageSrc}
                        alt="Vaše fotografie"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            padding: "25px",
                        }}
                    />
                )}

                {isUploadBtnVisible && (
                    <DefaultBtn onClick={fileBtnClick}>
                        <PlusIcon />
                        <span>Vyberte fotografii</span>
                        <input type="file" accept="image/*" onChange={imageUpload} ref={fileInputRef} hidden />
                    </DefaultBtn>
                )}

                {isUploadBtnVisible && <TextDesc>Nebo můžete přetáhnout obrázek sem</TextDesc>}
            </ImageArea>

            {imageSrc && <DefaultBtn onClick={() => redirectPage()}>Pokračovat <ArrowIcon/> </DefaultBtn>}

        </HomeContainer>
    );
}

export default Home;