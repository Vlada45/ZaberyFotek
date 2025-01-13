import React, {useEffect, useState} from "react";
import {Bounce, toast, ToastContainer} from "react-toastify";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {
    AccountButton,
    AccountContainer,
    AccountSettingsContainer,
    ButtonContainer,
    Card,
    CardBtn,
    CardContent,
    CardDescription,
    CardInput,
    CardTextArea,
    CardTitle,
    ChangeContainer,
    CreateButton,
    EditIcon,
    EmptyMessage,
    GridContainer,
    InfoCard,
    InfoLabel,
    InfoValue,
    LoginOptions,
    LogOutBtn,
    MainContent,
    Option,
    OptionIcon,
    OptionLabel,
    OptionRow,
    ProjectsContainer,
    Section,
    SectionParagraph,
    SectionTitle,
    Select,
    Sidebar,
    SidebarItem
} from "./AccountComponents";
import {FaRegFolder, FaRegUserCircle} from "react-icons/fa";
import {MdCheck, MdDelete, MdDownload, MdLogout, MdModeEditOutline} from "react-icons/md";
import {FcGoogle} from "react-icons/fc";
import {FiEdit} from "react-icons/fi";
import {IoSettingsOutline} from "react-icons/io5";
import {TbPhotoVideo} from "react-icons/tb";
import PopUpComponent from "../../components/PopUp/PopUp";
import axios from "axios";
import {Label} from "../Prihlaseni/LoginComponents";

/** Komponenta Account umožňuje uživateli prohlížet a spravovat jeho vytvořené klipy **/
function Account() {

    // Nastavení aktivní položky menu (výchozí je "Moje projekty")
    const [activeItem, setActiveItem] = useState('Moje projekty');

    // Získání aktuálního umístění uživatele (URL) pro případné použití v logice
    const location = useLocation();

    /** Funkce pro změnu aktivní položky menu **/
    const handleItemClick = (item) => {
        setActiveItem(item);
    };

    // Získání dat o přihlášeném uživateli z localStorage
    const loggedInUser = localStorage.getItem("user");

    // Parsování dat uživatele z JSON řetězce
    const userData = JSON.parse(loggedInUser);

    console.log("LOGGED", userData);

    // Načtené klipy
    const [clips, setClips] = useState([]);

    const [final, setFinal] = useState(false);

    // Přesměrování uživatele na jinou stránku pomocí hooku navigate
    const navigate = useNavigate();

    // Nastavení typu akce (např. změna hesla, smazání účtu apod.)
    const [type, setType] = useState('');

    // Seřazení klipu podle daného typu
    const [sortCriteria, setSortCriteria] = useState('');

    // Aktivní id klipu
    const [idClip, setIdClip] = useState(null);

    // Proměnné určené dle úpravy klipu
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedDescription, setEditedDescription] = useState('');

    const [loading, setLoading] = useState(false);

    // Otevření a zavření modálního okna
    const [open, setOpen] = useState(false);
    const closeModal = () => setOpen(false);

    // Ověření typu účtu uživatele
    const connected = userData?.verified_email !== null;

    /** Aktivní prvek při filtru **/
    const handleSortChange = (e) => {
        setSortCriteria(e.target.value);
    };

    // Efekt pro zobrazení oznámení při úspěšné akci
    useEffect(() => {

        if (location.state?.successMessage) {
            toast.success(location.state.successMessage);
        }
    }, [location.state]);

    /** Okno pro smazání klipu **/
    const handleDeleteClick = (id) => {
        setOpen(o => !o);

        localStorage.removeItem('idClip');
        localStorage.setItem('idClip', id);

        setIdClip(id);
    };

    /** Načítání nejnovějších verzí klipů **/
    useEffect(() => {

        // const storedClipId = localStorage.getItem('idClip');

        // console.log("STORED", storedClipId)

        // if (storedClipId !== idClip) {
        //     setIdClip(storedClipId);
        // }

        // if (storedClipId === 'clipDeleted') {
        //     toast.success('Klip byl úspěšně smazán');
        // }

        if ((activeItem === 'Moje projekty' || clips.length === 0) && !loading) {
            setLoading(true);

            axios
                .post('http://localhost:4000/data/getClips', {
                    user_id: userData?.id,
                    sortBy: sortCriteria,
                })
                .then((res) => {

                    setClips(res.data?.clips);

                })
                .catch((err) => {
                    toast.error(err.response?.data?.error || 'Chyba načtení klipů');
                })
                .finally(() => {
                    setLoading(false);
                });
        }

    }, [sortCriteria, idClip, isEditing, activeItem]);

    /** Inicializuje stav úprav pro vybraný klip, pokud je aktivní režim úprav **/
    useEffect(() => {
        if (isEditing && idClip) {
            const clip = clips.find((clip) => clip.id === idClip);
            if (clip) {
                if (!editedTitle) setEditedTitle(clip.name);
                if (!editedDescription) setEditedDescription(clip.description);
            }
        }
    }, [isEditing, idClip, clips, editedTitle, editedDescription]);

    /** Změna informací o daném klipu **/
    const handleEditClick = (id, action) => {

        if (!action) {
            setIsEditing(true);
            setIdClip(id);
            setEditedTitle('');
            setEditedDescription('');
        } else {
            axios
                .post('http://localhost:4000/data/updateClip', {
                    clip_id: idClip,
                    name: editedTitle,
                    description: editedDescription,
                })
                .then((res) => {
                    if (res.data.message) {
                        toast.success(res.data.message);
                    }
                    setIsEditing(false);
                    setEditedTitle('');
                    setEditedDescription('');
                })
                .catch((err) => {
                    toast.error(err.response?.data?.error || 'Někde nastala chyba');
                });
        }
    }

    return (
        <AccountContainer>
            <Sidebar>
                <SidebarItem
                    active={activeItem === 'Moje projekty'}
                    onClick={() => {
                        handleItemClick('Moje projekty')
                    }}
                >
                    <FaRegFolder style={{fontSize: '18px'}}/> Moje projekty
                </SidebarItem>
                {/*<SidebarItem*/}
                {/*    active={activeItem === 'Můj plán'}*/}
                {/*    onClick={() => handleItemClick('Můj plán')}*/}
                {/*>*/}
                {/*    Můj plán*/}
                {/*</SidebarItem>*/}
                <SidebarItem
                    active={activeItem === 'Nastavení účtu'}
                    onClick={() => handleItemClick('Nastavení účtu')}
                >
                    <IoSettingsOutline style={{fontSize: '20px'}}/> Nastavení účtu
                </SidebarItem>
            </Sidebar>
            <MainContent>
                {activeItem === 'Moje projekty' && (

                    <div>

                        {clips.length > 0 ? (
                            <ProjectsContainer>
                                <div style={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <SectionTitle>{activeItem}</SectionTitle>
                                    <div>
                                        <Label htmlFor='sort-select'>Seřadit podle:</Label>
                                        <Select id='sort-select' value={sortCriteria} onChange={handleSortChange}>
                                            <Option value=''>Výchozí</Option>
                                            <Option value='name'>Název</Option>
                                            <Option value='new'>Od nejnovějšího</Option>
                                            <Option value='old'>Od nejstaršího</Option>
                                            <Option value='lastEdit'>Poslední úprava</Option>
                                        </Select>
                                    </div>
                                </div>

                                <GridContainer>
                                    {clips.map((clip) => {

                                        const isEditingCurrentClip = isEditing && clip.id === idClip;

                                        let videoSrc = clip.src;

                                        if (clip?.src.toString().startsWith('data:')) {
                                            videoSrc = clip.src;
                                        } else if (clip?.src.toString().startsWith('blob:')) {
                                            videoSrc = clip.src;
                                        } else {
                                            const videoBlob = new Blob([clip.src], {type: 'video/mp4'});
                                            videoSrc = URL.createObjectURL(videoBlob);
                                        }

                                        return (<Card key={clip.id}>
                                            <video
                                                controls
                                                src={videoSrc}
                                                poster={clip.poster}
                                                style={{width: '100%', objectFit: 'cover', height: '250px'}}
                                            >
                                                Zdá se, že váš prohlížeč nepodporuje tento typ videa
                                            </video>
                                            <CardContent>
                                                <CardBtn
                                                    className="edit"
                                                    index={0}
                                                    onClick={() => {
                                                        handleEditClick(clip.id, isEditingCurrentClip);
                                                    }}>
                                                    {isEditingCurrentClip ? (
                                                        <MdCheck style={{color: 'white'}}/>
                                                    ) : <MdModeEditOutline style={{color: 'white'}}/>}
                                                </CardBtn>

                                                <a
                                                    href={videoSrc}
                                                    download={`${clip.name}.mp4`}
                                                    style={{textDecoration: 'none'}}
                                                >
                                                    <CardBtn
                                                        className="download"
                                                        index={1}
                                                    >
                                                        <MdDownload style={{color: 'white'}}/>
                                                    </CardBtn>
                                                </a>

                                                <CardBtn
                                                    className="delete"
                                                    index={2}
                                                    onClick={() => handleDeleteClick(clip.id)}
                                                >

                                                    {open && (
                                                        <PopUpComponent
                                                            open={open}
                                                            closeModal={closeModal}
                                                            userData={userData}
                                                            type={'deleteClip'}
                                                            blur={true}
                                                        />
                                                    )}

                                                    <MdDelete style={{color: 'white'}}/>

                                                </CardBtn>

                                                {isEditingCurrentClip ? (
                                                    <>
                                                        <CardInput
                                                            value={editedTitle}
                                                            onChange={(e) => setEditedTitle(e.target.value)}
                                                            placeholder="Nový nadpis"
                                                        />
                                                        <CardTextArea
                                                            value={editedDescription}
                                                            onChange={(e) => setEditedDescription(e.target.value)}
                                                            placeholder="Upravit popis"
                                                        />
                                                    </>
                                                ) : (
                                                    <>
                                                        <CardTitle>{clip.name}</CardTitle>
                                                        <CardDescription>
                                                            {clip.description || 'Popis ke klipu nebyl uveden.'}
                                                        </CardDescription>
                                                    </>
                                                )}
                                            </CardContent>
                                        </Card>);
                                    })}
                                </GridContainer>
                            </ProjectsContainer>

                        ) : (
                            <ProjectsContainer style={{alignItems: 'center', justifyContent: 'center'}}>
                                <SectionTitle>{activeItem}</SectionTitle>
                                <EmptyMessage>Zatím žádné projekty.</EmptyMessage>
                                <CreateButton onClick={() => navigate("/")}>
                                    <TbPhotoVideo style={{fontSize: '20px'}}/> Vytvořit nový klip
                                </CreateButton>
                            </ProjectsContainer>
                        )}
                    </div>
                )}
                {/*{activeItem === 'Můj plán' && (*/}
                {/*    <PlanContainer>*/}
                {/*        <EmptyMessage>Your plan details will appear here.</EmptyMessage>*/}
                {/*    </PlanContainer>*/}
                {/*)}*/}
                {activeItem === 'Nastavení účtu' && (
                    <AccountSettingsContainer>
                        <SectionTitle>{activeItem}
                            <LogOutBtn onClick={() => {
                                localStorage.removeItem("user")
                                navigate('/prihlaseni', {
                                    state: {successMessage: 'Odhlášení proběhlo úspěšně'},
                                });
                            }}
                            >
                                <MdLogout
                                    style={{cursor: 'pointer'}}
                                    title={'Odhlásit se'}/>
                            </LogOutBtn>
                        </SectionTitle>

                        <InfoCard>
                            <InfoLabel>Jméno</InfoLabel>
                            <InfoValue>{userData?.username}</InfoValue>
                            <EditIcon onClick={() => {
                                setOpen(o => !o);
                                setType('username');
                            }
                            }>
                                <FiEdit/>
                            </EditIcon>
                            {open && <PopUpComponent open={open}
                                                     closeModal={closeModal}
                                                     userData={userData}
                                                     type={type}
                            />}
                        </InfoCard>
                        <InfoCard>
                            <InfoLabel>Email</InfoLabel>
                            <InfoValue>{userData?.email}</InfoValue>
                            <EditIcon onClick={() => {
                                setOpen(o => !o)
                                setType('email')
                            }
                            }><FiEdit/>
                            </EditIcon>

                            {open && <PopUpComponent open={open}
                                                     closeModal={closeModal}
                                                     userData={userData}
                                                     type={type}
                                                     blur={false}
                                                     width={false}
                            />}
                        </InfoCard>


                        <SectionTitle style={{marginTop: '15px'}}>Možnosti přihlášení</SectionTitle>
                        <LoginOptions>

                            <OptionRow>
                                <OptionIcon>
                                    <FaRegUserCircle/>
                                    <span>Výchozí</span>
                                </OptionIcon>
                                <OptionLabel
                                    connected={connected}>{connected ?
                                    '—' :
                                    'Připojeno'}</OptionLabel>
                            </OptionRow>

                            <OptionRow>
                                <OptionIcon>
                                    <FcGoogle/>
                                    <span>Google</span>
                                </OptionIcon>
                                <OptionLabel
                                    connected={!connected}>{!connected ?
                                    '—' :
                                    'Připojeno'}</OptionLabel>
                            </OptionRow>
                        </LoginOptions>

                        <ChangeContainer>
                            {/* Levá sekce - Změna hesla */}
                            <Section>
                                <SectionTitle>Změna hesla</SectionTitle>
                                <SectionParagraph>
                                    Zde můžete změnit své heslo pro lepší zabezpečení
                                </SectionParagraph>
                                <ButtonContainer>
                                    <AccountButton color="#ff7f4e">
                                        <Link to="/zapomenute-heslo">Upravit heslo</Link>
                                    </AccountButton>
                                </ButtonContainer>
                            </Section>

                            {/* Pravá sekce - Smazání účtu */}
                            <Section>
                                <SectionTitle>Smazání účtu</SectionTitle>
                                <SectionParagraph>
                                    Všechna vaše data budou trvale odstraněna
                                </SectionParagraph>
                                <ButtonContainer>
                                    <AccountButton
                                        color="#d9534f"
                                        onClick={() => {
                                            setOpen((o) => !o);
                                            setType('deleteAccount');
                                        }}
                                    >
                                        Smazat účet
                                    </AccountButton>
                                </ButtonContainer>
                            </Section>
                        </ChangeContainer>

                    </AccountSettingsContainer>
                )}
            </MainContent>

            <ToastContainer
                position="bottom-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
        </AccountContainer>
    );
}

export default Account;