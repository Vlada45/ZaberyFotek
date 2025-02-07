const db = require('../utilities/db');
const NodeCache = require("node-cache");
const otpCache = new NodeCache({stdTTL: 300, checkperiod: 310});

let emailStore = '';

// Kontrola, zda email již existuje
const sqlEmailCheck = 'SELECT * FROM user WHERE email = ?';

/** Metoda pro zkontrolování příslušných údajů **/
const checkData = (type, dataType, res, validationErrors) => {

    if (type === "username") {

        // Počet slov ve vstupu Username
        const usernameWords = dataType.trim().split(/\s+/);

        if (!dataType || usernameWords.length < 2) {

            validationErrors.push({
                field: 'username',
                message: 'Uživatelské jméno musí obsahovat jméno a příjmení'
            });
        }
    } else if (type === "email") {

        // Ověření emailu, zda splňuje formát
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!dataType || !emailRegex.test(dataType)) {
            validationErrors.push({
                field: 'email',
                message: 'Zadaný email není ve správném formátu'
            });
        }

    } else if (type === "password") {

        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;

        if (!passwordRegex.test(dataType)) {

            validationErrors.push({
                field: 'password',
                message: 'Heslo musí obsahovat minimálně osm znaků, včetně písmen (velká a malá), čísel a speciálních znaků'
            });

        } else if (!dataType) {

            validationErrors.push({
                field: 'password',
                message: 'Heslo je povinné pole'
            });
        }

    } else if (type === "otp") {

        if (!dataType || dataType.length < 6) {

            validationErrors.push({
                field: 'otp',
                message: 'Chybně zadané OTP'
            });
        }
    }
}

/** Ověření, zda se email již nachází v databázi **/
const otpVerification = (db, username, email, password, otpPrev, res) => {

    if (email !== null) {

        // Uložení e-mailu, pokud je poskytnut
        emailStore = email;
    }

    // Klíč pro OTP v cache
    const otpKey = `otp_${emailStore}`;

    if (!otpPrev) {
        // Vygenerování nového OTP
        const generatedOtp = generateOTP();
        otpCache.set(otpKey, generatedOtp);
        resetPasswordMessage(email, res, generatedOtp);
    }

    if (otpPrev !== null) {

        // Načtení uloženého OTP z cache
        const storedOtp = otpCache.get(otpKey);

        if (!storedOtp) {
            return res.status(409).json({validation: false, message: "OTP nebylo nalezeno"});
        }
        if (parseInt(otpPrev) !== parseInt(storedOtp.toString())) {
            return res.status(409).json({validation: false, message: "Chybně zadané OTP"});
        }

        // Obnovení hesla uživatele v DB
        updatePasswordInDb(emailStore, password, res);
    }
}

/** Ověření, zda se email již nachází v databázi **/
const emailCheck = (db, username, email, password, type, image, res) => {

    db.get(sqlEmailCheck, [email], (err, row) => {

        if (err) {
            return res.status(500).json({validation: false, message: 'Chyba databáze'});
        }

        let newType = type;
        let newImage = image;

        if (row) {

            if (type === null) {
                newType = row.type;
            }
            if (image === null) {
                newImage = row.image;
            }
        }

        // Endpoint: /loginUser
        if (username === null) {

            // Kontrola, zda uživatel existuje a heslo odpovídá
            if (row && row.password === password) {

                return res.status(200).json({validation: true, message: 'Přihlášení proběhlo úspěšně', user: row});
            } else {
                return res.status(401).json({validation: false, message: 'Neplatný email nebo heslo'});
            }
        } else {

            // Endpoint: /validateForgotPassword
            if (username === undefined && password === undefined) {

                if (!row) {
                    return res.status(409).json({validation: false, message: 'Tento email není zaregistrovaný'});
                }

                // Pro typ účtu Google není požadováno žádné heslo
                if (row.type === 'google') {
                    return res.status(409).json({validation: false, message: 'Tento email je spojený s účtem Google'});
                }

                otpVerification(db, username, email, password, null, res);

                // Endpoint: /register
            } else {

                if (row && row.type !== 'google') {
                    return res.status(409).json({validation: false, message: 'Tento email je již zaregistrovaný'});
                }

                if (password === '-1') {

                    checkBeforeAdd(username, email, password, newType, newImage, row, res)
                } else {

                    checkBeforeAdd(username, email, password, newType, newImage, row, res);
                }
            }
        }
    });
}

/**
 * Aktualizace dat uživatele na základě vybraného typu
 *  Ověření, zda se email již nachází v databázi
 **/
const updateUserData = (db, type, username, email, inputData, res) => {

    db.get(sqlEmailCheck, [email], (err, row) => {
        if (err) {
            return res.status(500).json({validation: false, message: 'Database error during email check'});
        }

        let updateType = '';
        let queryParams = [];

        if (type === 'username') {

            updateType = "UPDATE user SET username = ? WHERE email = ?";
            queryParams = [inputData, email];

        } else if (type === 'email') {

            if (row?.type === 'google') {
                return res.status(409).json({validation: false, message: 'Typ účtu Google nelze změnit'});
            }
            updateType = "UPDATE user SET email = ? WHERE email = ?";
            queryParams = [inputData, email];

        } else if (type === 'deleteAccount') {

            updateType = "DELETE FROM user WHERE email = ?";
            queryParams = [email];

            // Smazání účtu uživatele
            return db.run(updateType, queryParams, (err) => {

                if (err) {
                    return res.status(500).json({validation: false, message: 'Chyba databáze'});
                }
                return res.status(200).json({validation: true, message: 'Váš účet byl úspěšně smazán'});
            });

        }

        // Aktualizace dat uživatele
        db.run(updateType, queryParams, (err) => {
            if (err) {
                return res.status(500).json({validation: false, message: 'Chyba databáze'});
            }
            return res.status(200).json({validation: true, message: 'Údaje byly úspěšně změněny', user: row});
        });
    });
}

/** Funkce pro smazání klipu **/
/** Funkce pro smazání klipu **/
const deleteClip = (db, clip_id, res) => {

    // Získání klipu podle ID
    db.get('SELECT * FROM clips WHERE id = ?', [clip_id], (err, row) => {
        if (err) {
            return res.status(500).json({error: 'Chyba při kontrole klipu'});
        }

        if (!row) {
            return res.status(404).json({error: 'Klip nenalezen'});
        }

        // Smazání souvisejících vztahů z tabulky clip_pieces
        db.run('DELETE FROM clip_pieces WHERE clip_id = ?', [clip_id], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({error: 'Chyba při mazání clip_pieces'});
            }

            // Načtení souvisejících kusů pro smazání
            db.all('SELECT piece_id FROM clip_pieces WHERE clip_id = ?', [clip_id], (err, pieceResult) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({error: 'Chyba při načítání piece_ids'});
                }

                if (pieceResult.length === 0) {
                    db.run('DELETE FROM clips WHERE id = ?', [clip_id], (err) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).json({error: 'Chyba při mazání klipu'});
                        }

                        // Odpověď, že klip byl úspěšně smazán
                        return res.status(200).json({message: 'Klip byl úspěšně smazán'});
                    });
                    return;
                }

                // Definice tabulek, ze kterých se budou mazat data
                const tablesToDeleteFrom = [
                    'transition',
                    'arrowDirection',
                    'transition_idPieces',
                    'cameraSize',
                    'piece',
                ];

                // Vytvoření seznamu piece_id pro použití v SQL dotazech
                const pieceIds = pieceResult.map(row => row.piece_id);
                const pieceIdsList = pieceIds.join(', ');

                // Procházení tabulek a provedení mazání pro každou z nich
                tablesToDeleteFrom.forEach((table) => {
                    // Nastavení názvu sloupce - pro tabulku "piece" je sloupec "id", jinak "piece_id"
                    const column = table === 'piece' ? 'id' : 'piece_id';

                    // Sestavení SQL dotazu pro mazání
                    const query = `DELETE FROM ${table} WHERE ${column} IN (${pieceIdsList})`;

                    // Spuštění dotazu
                    db.run(query, (err) => {
                        if (err) {
                            // Ošetření chyby při mazání z konkrétní tabulky
                            console.error(`Chyba při mazání z tabulky ${table}:`, err);
                            return res.status(500).json({ error: `Chyba při mazání ${table}` });
                        }
                    });
                });

                // Nakonec smažeme samotný klip
                db.run('DELETE FROM clips WHERE id = ?', [clip_id], (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({error: 'Chyba při mazání klipu'});
                    }

                    // Odpověď, že klip byl úspěšně smazán
                    return res.status(200).json({message: 'Klip byl úspěšně smazán'});
                });
            });
        });
    });
}

/**
 * Příslušné metody k Endpointu
 *
 **/

/** Ověření, zda v DB se již nachází tento uživatel **/
const checkBeforeAdd = (username, email, password, newType, newImage, row, res) => {

    if (row?.username?.length > 0) {

        return res.status(200).json({validation: true, message: 'Přihlášení proběhlo úspěšně', user: row});

    } else {

        addUserDB(username, email, password, newType, newImage, res);
    }
}

/** Metoda pro přidání uživatele do tabulky USER **/
const addUserDB = (username, email, password, type, image, res) => {

    const sqlInsert = 'INSERT INTO user (username, email, password, type, image) VALUES (?, ?, ?, ?, ?)';
    db.run(sqlInsert, [username, email, password, type, image], function (err) {

        if (err) {
            return res.status(500).json({validation: false, message: 'Chyba při přidávání uživatele do databáze'});
        }

        const id = this.lastID;

        return res.status(200).json({
            validation: true, message: 'Registrace probíhla úspěšně', user: {
                id: id,
                username: username,
                email: email,
                password: password,
                image: image,
                type: type
            }
        });
    });
}

/** Změna hesla uživatele v databázi **/
const updatePasswordInDb = (email, newPassword, res) => {
    const duplicateCheck = 'SELECT password FROM user WHERE email = ?';

    // Kontrola stávajícího hesla uživatele v databázi
    db.get(duplicateCheck, [email], (err, row) => {
        if (err) {
            // Chyba při přístupu k databázi
            return res.status(500).json({validation: false, message: 'Chyba databáze'});
        } else if (!row) {
            // Uživatel nebyl nalezen
            return res.status(404).json({validation: false, message: 'Uživatel nebyl nalezen'});
        } else if (row.password === newPassword) {
            // Nové heslo je stejné jako původní
            return res.status(401).json({validation: false, message: 'Nové heslo nesmí být shodné s původním'});
        }

        // Aktualizace hesla, pokud všechny předchozí podmínky projdou
        db.run("UPDATE user SET password = ? WHERE email = ?", [newPassword, email], function (err) {
            if (err) {
                // Chyba při aktualizaci hesla v databázi
                return res.status(500).json({validation: false, message: 'Chyba při aktualizaci hesla'});
            }

            // Heslo bylo úspěšně aktualizováno
            return res.status(200).json({validation: true, message: 'Heslo bylo úspěšně aktualizováno', user: row});
        });
    });
};

/** Odeslání zpráva s odkazem pro obnovení hesla **/
const resetPasswordMessage = (email, res, OTP) => {

    // Knihovna pro odesílání e-mailů
    const nodemailer = require('nodemailer');

    const path = require('path');
    const fs = require('fs');

    const projectRoot = path.resolve(__dirname, '..');
    const filePath = path.join(projectRoot, '../frontend/src/pages/ZapomenuteHeslo/resetPasswordMessage.html');

    // Načtení HTML zprávy ze složky frontend
    let HTMLtemplate = fs.readFileSync(filePath, 'utf8');

    console.log("OTP", OTP);

    HTMLtemplate = HTMLtemplate.replace('${OTP}', OTP);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.PERSONAL_EMAIL,
            pass: process.env.PERSONAL_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const emailConfig = {
        from: process.env.PERSONAL_EMAIL,
        to: email,
        subject: "Resetování hesla",
        html: HTMLtemplate,
    };

    transporter.sendMail(emailConfig, function (error, info) {
        if (error) {
            console.error("Chyba při posílání:", error);
            return res.status(500).json({
                validation: false,
                message: 'Chyba při odeslání zprávy',
                error: error.message
            });
        }
        return res.status(200).json({validation: true, message: 'Email byl úspěšně odeslán', otp: OTP});
    });
}

/** Funkce pro generování jednorázového kódu **/
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);
};


module.exports = {
    checkData,
    emailCheck,
    otpVerification,
    updateUserData,
    deleteClip
};