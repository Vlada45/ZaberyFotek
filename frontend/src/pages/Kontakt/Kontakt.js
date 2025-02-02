import {DesUl, InfoContainer, TextDecoration} from "../O projektu/OprojektuComponents";
import {HeadingContainer, TextElements} from "../Home/HomeElements";
import {Card} from "../Account/AccountComponents";
import React from "react";
import {useIntersectionObserver} from "../../components/ScrollAnimation/useIntersectionObserver";

/** Obrazovka - Kontakt **/
function Kontakt() {

    // Importování vlastní funkce pro scroll animaci
    const visibleItems = useIntersectionObserver();

    return (
        <InfoContainer style={{minHeight: '100vh'}}>
            <HeadingContainer style={{
                animation: "slideDown 1s ease-out",
                height: 'fit-content',
                marginTop: '1em'
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
                    marginBottom: '2em'
                }}>
                    <HeadingContainer style={{
                        fontSize: '2em',
                        marginTop: '10px',
                        textDecoration: 'underline',
                        textDecorationStyle: 'dashed',
                        textUnderlineOffset: '5px'
                    }}>
                        Máte dotaz nebo podnět?
                    </HeadingContainer>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        marginLeft: '5%'
                    }}>
                        <p style={{marginTop: '25px'}}>Neváhejte mě kontaktovat v případě jakýchkoliv otázek či návrhů.
                            Rád vám pomohu nebo zvážím vaše nápady na vylepšení.</p>

                        <DesUl style={{justifyContent: 'space-around', width: '100%', gap: '10px'}}>

                            <div>

                                <HeadingContainer id={"item-1"} className={`order-item ${visibleItems.includes('item-1') ? 'visible' : ''}`} style={{
                                    fontSize: '1.25em',
                                    marginTop: '10px',
                                }}>
                                    S čím se na mě můžete obrátit?
                                </HeadingContainer>

                                <ul style={{display: 'flex', gap: '10px', flexDirection: 'column', marginTop: '20px'}}>
                                    <li id={"item-2"} className={`order-item ${visibleItems.includes('item-2') ? 'visible' : ''}`} style={{display: 'flex'}}>
                                        <span style={{marginRight: '10px'}}>▶</span>
                                        <TextDecoration> Objevení chyby </TextDecoration> (problému)
                                    </li>
                                    <li id={"item-3"} className={`order-item ${visibleItems.includes('item-3') ? 'visible' : ''}`} style={{display: 'flex', alignItems: 'center'}}>
                                        <span style={{marginRight: '10px'}}>▶</span>
                                        <TextDecoration> Jakýkoliv nápad na zlepšení </TextDecoration>
                                    </li>
                                    <li id={"item-4"} className={`order-item ${visibleItems.includes('item-4') ? 'visible' : ''}`} style={{display: 'flex', alignItems: 'center'}}>
                                        <span style={{marginRight: '10px'}}>▶</span>
                                        <TextDecoration> Odeslání zpětné vazby </TextDecoration>
                                    </li>
                                </ul>
                            </div>

                            <div>

                                <HeadingContainer id={"item-5"} className={`order-item ${visibleItems.includes('item-5') ? 'visible' : ''}`} style={{
                                    fontSize: '1.25em',
                                    marginTop: '10px',
                                    justifyContent: 'flex-start'
                                }}>
                                    Kontaktní údaje:
                                </HeadingContainer>

                                <ul style={{display: 'flex', gap: '10px', flexDirection: 'column', marginTop: '20px'}}>

                                    <li id={"item-6"} className={`order-item ${visibleItems.includes('item-6') ? 'visible' : ''}`} style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                    }}>
                                        <TextDecoration><span style={{
                                            marginRight: '10px',
                                            color: 'black'
                                        }}>▶</span> E-mail:</TextDecoration>
                                        <span
                                            style={{textAlign: 'left', marginTop: '10px'}}>socsamojlov@gmail.com</span>
                                    </li>
                                    <li id={"item-7"} className={`order-item ${visibleItems.includes('item-7') ? 'visible' : ''}`} style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                    }}>
                                        <TextDecoration><span style={{
                                            marginRight: '10px',
                                            color: 'black'
                                        }}>▶</span> Adresa:</TextDecoration>
                                        <span
                                            style={{textAlign: 'left', marginTop: '10px'}}>Arabská 682/14, Praha 6 - Vokovice</span>
                                    </li>
                                    <li id={"item-8"} className={`order-item ${visibleItems.includes('item-8') ? 'visible' : ''}`} style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                    }}>
                                        <TextDecoration><span style={{
                                            marginRight: '10px',
                                            color: 'black'
                                        }}>▶</span> GitHub:</TextDecoration>
                                        <a href={'https://github.com/Vlada45'}
                                            style={{textAlign: 'left', marginTop: '10px', color: 'blue'}}>https://github.com/Vlada45</a>
                                    </li>
                                </ul>
                            </div>
                        </DesUl>
                    </div>
                </Card>
            </TextElements>

        </InfoContainer>
    );
}

export default Kontakt;
