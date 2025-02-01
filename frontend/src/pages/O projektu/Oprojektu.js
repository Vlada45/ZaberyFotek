import React from 'react';
import {HeadingContainer, HomeContainer, TextElements} from "../Home/HomeElements";
import {Card} from "../Account/AccountComponents";

function Oprojektu() {

    return (
        <HomeContainer style={{
            background: 'linear-gradient(to bottom, transparent 0%, var(--color-blue-2) 25%, var(--color-blue-4) 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            gap: '25px'
        }}>

            <HeadingContainer style={{animation: "slideDown 1s ease-out", height: 'fit-content'}}>O
                projektu</HeadingContainer>

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
                    backdropFilter: 'blur(5px)',
                    WebkitBackdropFilter: 'blur(5px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.3)',
                    width: '50%',
                    padding: '20px',
                }}>
                    <HeadingContainer style={{fontSize: '2em', marginTop: '10px'}}> 📌 Základní
                        informace:</HeadingContainer>

                    <ul style={{
                        display: 'grid',
                        gridTemplateRows: 'auto auto',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        marginLeft: '30px',
                        marginTop: '10px'
                    }}>
                        <li style={{
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%'
                        }}>
                            <span style={{display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center', width: '15%'}} role="img" aria-label="book">📚</span>
                            <span style={{display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start', width: '85%'}}>Studentský projekt</span>
                        </li>

                        <li style={{
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%'
                        }}>
                            <span style={{display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center', width: '15%'}} role="img" aria-label="technology">📱</span>
                            <span style={{display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start', width: '85%'}}>Použité technologie:</span>
                        </li>

                        <ul>
                            <li style={{display: 'flex', alignItems: 'center'}}>
                                <span style={{marginRight: '10px'}}>▶</span> Frontend: React + Axios +
                                Styled-components
                            </li>
                            <li style={{display: 'flex', alignItems: 'center'}}>
                                <span style={{marginRight: '10px'}}>▶</span> Backend: Node.js + Express.js
                            </li>
                            <li style={{display: 'flex', alignItems: 'center'}}>
                                <span style={{marginRight: '10px'}}>▶</span> Databáze: SQLite
                            </li>
                        </ul>
                    </ul>

                    {/*<ul style={{marginTop: '10px'}}>*/}
                    {/*    <li>Studentský projekt</li>*/}
                    {/*    <li>studentský projekt</li>*/}
                    {/*    <li>studentský projekt</li>*/}

                    {/*</ul>*/}
                </Card>

                <Card style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(5px)',
                    WebkitBackdropFilter: 'blur(5px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.3)',
                    width: '50%',
                    padding: '20px'
                }}>
                    <HeadingContainer style={{fontSize: '2em', marginTop: '10px'}}>Základní
                        informace:</HeadingContainer>

                    <p style={{
                        whiteSpace: 'pre-line',
                        textAlign: 'justify',
                        lineHeight: '1.6', marginTop: '10px'
                    }}>
                        Jedná se o studentský projekt, který poskytuje uživatelům snadno upravovat obrázky,
                        rozdělovat je na části, vytvářet klipy a následně je spojovat do finálního videa.

                        Inspirací pro tento projekt byla autorova snaha posunout prezentaci svých uměleckých děl
                        na vyšší úroveň – místo jednoduchého sdílení fotografií na sociálních sítích chtěl
                        nabídnout dynamickou formu prezentace prostřednictvím krátkých klipů. </p>
                    {/*<ul>*/}
                    {/*    <li>studentský projekt</li>*/}
                    {/*</ul>*/}
                </Card>

                <Card style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(5px)',
                    WebkitBackdropFilter: 'blur(5px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.3)',
                    width: '50%',
                    padding: '20px'
                }}>
                    <HeadingContainer style={{fontSize: '2em', marginTop: '10px'}}>Zdrojový kód:</HeadingContainer>


                    <a href="https://github.com/Vlada45/ZaberyFotek" target="_blank" rel="noopener noreferrer" style={{
                        background: 'transparent',
                        width: '50%',
                        marginTop: '10px',
                        cursor: 'pointer'
                    }}>
                        <img
                            src="/githubLogo.png"
                            alt="GitHub logo"
                        />
                    </a>

                    {/*<ul>*/}
                    {/*    <li>studentský projekt</li>*/}
                    {/*</ul>*/}
                </Card>

            </TextElements>
        </HomeContainer>
    );
}

export default Oprojektu;
