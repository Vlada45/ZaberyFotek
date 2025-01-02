const db = require('../utilities/db');
const NodeCache = require("node-cache");
const otpCache = new NodeCache({ stdTTL: 300, checkperiod: 310 });

let emailStore = '';

// Kontrola, zda email již existuje
const sqlEmailCheck = 'SELECT * FROM users WHERE email = ?';

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

        emailStore = email;
    }

    const otpKey = `otp_${emailStore}`;

    if (!otpPrev) {
        const generatedOtp = generateOTP();
        otpCache.set(otpKey, generatedOtp);
        resetPasswordMessage(email, res, generatedOtp);
    }

    if (otpPrev !== null) {

        const storedOtp = otpCache.get(otpKey);

        if (!storedOtp) {
            return res.status(409).json({ validation: false, message: "OTP nebylo nalezeno" });
        }
        if (parseInt(otpPrev) !== parseInt(storedOtp.toString())) {
            return res.status(409).json({ validation: false, message: "Chybně zadané OTP" });
        }

        // Obnovení hesla uživatele v DB
        updatePasswordInDb(emailStore, password, res);
    }
}

/** Ověření, zda se email již nachází v databázi **/
const emailCheck = (db, username, email, password, res) => {

    db.get(sqlEmailCheck, [email], (err, row) => {

        if (err) {
            return res.status(500).json({validation: false, message: 'Chyba databáze'});
        }

        // Endpoint: /loginUser
        if (username === null) {

            // Kontrola, zda uživatel existuje a heslo odpovídá
            if (row && row.password === password) {
                return res.status(200).json({validation: true, message: 'Přihlášení proběhlo úspěšně'});
            } else {
                return res.status(401).json({validation: false, message: 'Neplatný email nebo heslo'});
            }
        } else {

            // Endpoint: /validateForgotPassword
            if (username === undefined && password === undefined) {

                if (!row) {
                    return res.status(409).json({validation: false, message: 'Tento email není zaregistrovaný'});
                }

                otpVerification(db, username, email, password, null, res);

                // Endpoint: /register
            } else {

                if (row) {
                    return res.status(409).json({validation: false, message: 'Tento email je již zaregistrovaný'});
                }
                addUserDB(username, email, password, res);
            }
        }
    });
}

/**
 * Příslušné metody k Endpointu
 *
 **/

/** Metoda pro přidání uživatele do tabulky USERS **/
const addUserDB = (username, email, password, res) => {

    const sqlInsert = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.run(sqlInsert, [username, email, password], function (err) {

        if (err) {
            return res.status(500).json({validation: false, message: 'Chyba při přidávání uživatele do databáze'});
        }

        return res.status(200).json({validation: true, message: 'Registrace probíhla úspěšně'});
    });
}

/** Změna hesla uživatele v databázi **/
const updatePasswordInDb = (email, newPassword, res) => {

    db.run("UPDATE users SET password = ? WHERE email = ?", [newPassword, email], function (err) {
        if (err) {
            return res.status(500).json({ validation: false, message: 'Chyba při aktualizaci hesla' });
        }
        return res.status(200).json({ validation: true, message: 'Heslo bylo úspěšně aktualizováno' });
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
            console.error("Email sending error:", error);
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
    otpVerification
};