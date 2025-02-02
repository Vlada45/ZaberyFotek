import React, {useEffect, useState} from 'react';
import {HeadingContainer, TextElements} from "../Home/HomeElements";
import {Card, InfoCard} from "../Account/AccountComponents";
import {DesUl, InfoContainer, OrderList, TextDecoration, UList} from "./OprojektuComponents";
import {FaFilePdf} from "react-icons/fa";
import {Button} from "../Prihlaseni/LoginComponents";
import {useIntersectionObserver} from "../../components/ScrollAnimation/useIntersectionObserver";

/** Obrazovka - O projektu **/
function Oprojektu() {

    // Importování vlastní funkce pro scroll animaci
    const visibleItems = useIntersectionObserver();

    return (
        <InfoContainer>

            <HeadingContainer style={{
                animation: "slideDown 1s ease-out",
                height: 'fit-content'
            }}>O
                projektu</HeadingContainer>

            <TextElements style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '25px',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '0px'
            }}>

                <Card id={"item-1"} className={`order-item ${visibleItems.includes('item-1') ? 'visible' : ''}`}
                      style={{
                          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          background: 'rgba(255, 255, 255, 0.3)',
                          width: '75%',
                          padding: '20px',
                          minWidth: '375px',
                      }}>
                    <HeadingContainer style={{
                        fontSize: '2em', marginTop: '10px', textDecoration: 'underline',
                        textDecorationStyle: 'dashed',
                        textUnderlineOffset: '5px'
                    }}> Základní
                        informace:</HeadingContainer>

                    <UList>
                        <li style={{
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            flexDirection: 'column'
                        }}>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%'
                            }}>
                                <h2 style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center', width: '15%'
                                }} role="img" aria-label="technology">📚</h2>
                                <h2 style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start', width: '85%'
                                }}>Studentský projekt</h2>

                            </div>

                            <DesUl>

                                <ul style={{
                                    display: 'flex',
                                    gap: '10px',
                                    flexDirection: 'column'
                                }}>
                                    <li style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                    }}>
                                        <TextDecoration><span style={{
                                            marginRight: '10px',
                                            color: 'black'
                                        }}>▶</span> Účel:</TextDecoration>
                                        <span style={{textAlign: "left"}}>Tvorba záběrů z obrázků a jejich spojení do videoklipů</span>
                                    </li>
                                    <li style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                    }}>
                                        <TextDecoration><span style={{
                                            marginRight: '10px',
                                            color: 'black'
                                        }}>▶</span> Myšlenka:</TextDecoration>
                                        <span
                                            style={{textAlign: "left"}}>Prezentace uměleckých děl formou záběrů fotek</span>
                                    </li>
                                    <li style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                    }}>

                                        <TextDecoration><span style={{
                                            marginRight: '10px',
                                            color: 'black'
                                        }}>▶</span> Přínos:</TextDecoration>
                                        <span style={{textAlign: "left"}}>Rychlé a jednoduché vytváření videí</span>
                                    </li>
                                </ul>

                            </DesUl>
                        </li>

                        <li style={{
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            flexDirection: 'column'
                        }}>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%'
                            }}>
                                <h2 style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center', width: '15%'
                                }} role="img" aria-label="technology">📱</h2>
                                <h2 style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start', width: '85%'
                                }}>Použité technologie:</h2>

                            </div>

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
                        </li>
                    </UList>
                </Card>

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
                    }}> Hlavní funkce:</HeadingContainer>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        marginLeft: '5%'
                    }}>
                        <OrderList>
                            <div id="item-3"
                                 className={`order-item ${visibleItems.includes('item-3') ? 'visible' : ''}`}>
                                <span>1</span> Úprava obrázků
                            </div>
                            <div id="item-4"
                                 className={`order-item ${visibleItems.includes('item-4') ? 'visible' : ''}`}>
                                <span>2</span> Rozdělení obrázků na části
                            </div>
                            <div id="item-5"
                                 className={`order-item ${visibleItems.includes('item-5') ? 'visible' : ''}`}>
                                <span>3</span> Tvorba krátkých klipů
                            </div>
                            <div id="item-6"
                                 className={`order-item ${visibleItems.includes('item-6') ? 'visible' : ''}`}>
                                <span>4</span> Spojení klipů do finálního videa
                            </div>
                        </OrderList>
                    </div>
                </Card>


                <Card id="item-7"
                      className={`order-item ${visibleItems.includes('item-7') ? 'visible' : ''}`} style={{
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.3)',
                    width: '75%',
                    padding: '20px',
                    minWidth: '375px'
                }}>
                    <HeadingContainer style={{
                        fontSize: '2em',
                        marginTop: '10px',
                        textDecoration: 'underline',
                        textDecorationStyle: 'dashed',
                        textUnderlineOffset: '5px'
                    }}>Popis:</HeadingContainer>

                    <p style={{
                        whiteSpace: 'pre-line',
                        textAlign: 'justify',
                        lineHeight: '1.6', marginTop: '10px',
                        padding: '10px'
                    }}>
                        Jedná se o studentský projekt, který poskytuje uživatelům snadno upravovat obrázky,
                        rozdělovat je na části, vytvářet klipy a následně je spojovat do finálního videa.

                        Inspirací pro tento projekt byla autorova snaha posunout prezentaci svých uměleckých děl
                        na vyšší úroveň – místo jednoduchého sdílení fotografií na sociálních sítích chtěl
                        nabídnout dynamickou formu prezentace prostřednictvím krátkých klipů. <br/> <br/>

                        Tento projekt je zároveň součástí mé maturitní práce. Níže naleznete kompletní dokumentaci k projektu.
                    </p>

                    <a href={'/Dokumentace - Záběry fotek.pdf'} target = '_blank' style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>

                        <Button style={{width: '50%', background: 'linear-gradient(to right,  #4f5d8b 0%, var(--home-blue-dark) 100%)', marginTop: '25px'}}><FaFilePdf /> DOKUMENTACE PDF</Button>

                    </a>
                    {/*<ul>*/}
                    {/*    <li>studentský projekt</li>*/}
                    {/*</ul>*/}
                </Card>

                <Card id="item-8"
                      className={`order-item ${visibleItems.includes('item-8') ? 'visible' : ''}`} style={{
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.3)',
                    width: '75%',
                    padding: '20px',
                    minWidth: '375px', marginBottom: '25px'
                }}>
                    <HeadingContainer style={{
                        fontSize: '2em',
                        marginTop: '10px',
                        textDecoration: 'underline',
                        textDecorationStyle: 'dashed',
                        textUnderlineOffset: '5px'
                    }}>Zdrojový kód:</HeadingContainer>


                    <a href="https://github.com/Vlada45/ZaberyFotek" target="_blank" rel="noopener noreferrer" style={{
                        background: 'transparent',
                        cursor: 'pointer'
                    }}>
                        <img
                            style={{display: "inline-flex", width: '25%', marginTop: '10px'}}
                            src="/githubLogo.png"
                            alt="GitHub logo"
                        />
                    </a>
                </Card>

            </TextElements>
        </InfoContainer>
    );
}

export default Oprojektu;
