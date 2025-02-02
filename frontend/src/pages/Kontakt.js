import Oprojektu from "./O projektu/Oprojektu";
import {DesUl, InfoContainer, OrderList, TextDecoration} from "./O projektu/OprojektuComponents";
import {HeadingContainer, TextElements} from "./Home/HomeElements";
import {Card} from "./Account/AccountComponents";
import React, {useEffect} from "react";
import {useIntersectionObserver} from "../components/ScrollAnimation/useIntersectionObserver";

function Kontakt() {

    // Importování vlastní funkce pro scroll animaci
    const visibleItems = useIntersectionObserver();

    return (
        <InfoContainer style={{height: '100vh'}}>
            <HeadingContainer style={{
                animation: "slideDown 1s ease-out",
                height: 'fit-content'
            }}>
                Kontakt</HeadingContainer>

            <TextElements style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '25px',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '0px'
            }}>
                <Card style={{
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.3)',
                    width: '75%',
                    padding: '20px',
                    minWidth: '375px',
                }}>
                    <HeadingContainer style={{
                        fontSize: '2em',
                        marginTop: '10px',
                        textDecoration: 'underline',
                        textDecorationStyle: 'dashed',
                        textUnderlineOffset: '5px'
                    }}>
                        Nahlásit chybu
                    </HeadingContainer>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        marginLeft: '5%'
                    }}>
                        <p>Pokud jste narazili na chybu, nebo máte nápad, jak zlepšit tuto aplikaci, neváhejte nás kontaktovat pomocí následujících informací.</p>
                        <DesUl>

                            <ul style={{display: 'flex', gap: '10px', flexDirection: 'column'}}>
                                <li style={{display: 'flex', alignItems: 'center'}}>
                                    <span style={{marginRight: '10px'}}>▶</span>
                                    <TextDecoration> Frontend: </TextDecoration> React + Axios
                                </li>
                                <li style={{display: 'flex', alignItems: 'center'}}>
                                    <span style={{marginRight: '10px'}}>▶</span>
                                    <TextDecoration>Backend: </TextDecoration> Node.js + Express.js
                                </li>
                                <li style={{display: 'flex', alignItems: 'center'}}>
                                    <span style={{marginRight: '10px'}}>▶</span>
                                    <TextDecoration> Databáze: </TextDecoration> SQLite
                                </li>
                            </ul>
                        </DesUl>
                    </div>
                </Card>
            </TextElements>

        </InfoContainer>
    );
}

export default Kontakt;
