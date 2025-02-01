const db = require('../utilities/db');

/**
 * Sekce: Přidání dat o všech částicích
 * POST routa pro přidání dat o částicích do databáze.
 * Endpoint: /addClip
 */
const addPiecesData = (req, res) => {

    const {user_id, name, description, pieces, src, poster} = req.body;

    console.log("DATA", user_id, name, description);

    // Kontrola povinných polí
    if (!user_id || !name || !pieces || !Array.isArray(pieces)) {
        return res.status(400).json({
            error: "Missing required fields: user_id, name, or pieces (must be an array)."
        });
    }

    // Vytvoření bufferu z base64 zakódovaného video zdroje (src).
    const videoBuffer = Buffer.from(src.split(',')[1], 'base64');

    // Získání aktuálního data a času ve formátu ISO
    const createdAt = new Date().toISOString();

    // Transakční logika pro přidání klipu a jeho částic
    //db.run("BEGIN TRANSACTION");

    // Přidání klipu
    const insertClipQuery = `
      INSERT INTO clips (user_id, name, description, created_at, updated_at, src, poster) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(insertClipQuery, [user_id, name, description, createdAt, createdAt, videoBuffer, poster], function (err) {
        if (err) {
            console.error("Error adding clip:", err);
            //db.run("ROLLBACK");
            return res.status(500).json({error: "Failed to add clip."});
        }

        // ID vytvořeného klipu
        const clipId = this.lastID;

        // Vložení částic a jejich vazeb
        const insertPieceQuery = `
        INSERT INTO piece (value, src, width, left, isSubmitted, arrow, duration, special)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
        const insertTransitionQuery = `
        INSERT INTO transition (piece_id, coordinateRes, transitionID)
        VALUES (?, ?, ?)
      `;
        const insertTransitionIdPiecesQuery = `
        INSERT INTO transition_idPieces (piece_id, key, value)
        VALUES (?, ?, ?)
      `;
        const insertCameraSizeQuery = `
        INSERT INTO cameraSize (piece_id, currentIndex, height, width)
        VALUES (?, ?, ?, ?)
      `;
        const insertArrowDirectionQuery = `
        INSERT INTO arrowDirection (piece_id, x, y)
        VALUES (?, ?, ?)
      `;
        const insertClipPieceQuery = `
        INSERT INTO clip_pieces (clip_id, piece_id)
        VALUES (?, ?)
      `;

        let hasError = false;

        pieces.forEach((piece) => {
            const {
                value, src, width, left, isSubmitted, arrow, duration, special,
                transition, cameraSize, arrowDirection
            } = piece;

            //console.log(piece)

            // if (!value || !src || !width || !left || !arrow || !duration || !special) {
            //     hasError = true;
            //     console.error("Missing required piece fields.");
            //     return;
            // }

            // Přidání částice
            db.run(insertPieceQuery, [value, src, width, left, isSubmitted, arrow, duration, special], function (err) {
                if (err) {
                    console.error("Error adding piece:", err);
                    hasError = true;
                    return;
                }

                // ID vytvořené částice
                const pieceId = this.lastID;

                // Přidání přechodů (transition)
                if (transition) {
                    db.run(insertTransitionQuery, [pieceId, transition?.coordinateRes, transition?.transitionID], function (err) {
                        if (err) {
                            console.error("Error adding transition:", err);
                            hasError = true;
                            return;
                        }

                        // Přidání idPieces k přechodům
                        const transitionId = this.lastID;

                        if (transition.idPieces) {

                            Object.entries(transition.idPieces).forEach(([key, value]) => {

                                console.log("KEY", key, value)

                                if (key !== undefined && value !== undefined) {
                                    db.run(insertTransitionIdPiecesQuery, [transitionId, key, value], (err) => {
                                        if (err) {
                                            console.error("Error adding transition idPiece:", err);
                                            hasError = true;
                                        }
                                    });
                                }
                            });
                        }
                    });
                }

                // Přidání velikosti kamery (cameraSize)
                if (cameraSize) {
                    db.run(insertCameraSizeQuery, [pieceId, cameraSize?.currentIndex, cameraSize?.height, cameraSize?.width], (err) => {
                        if (err) {
                            console.error("Error adding camera size:", err);
                            hasError = true;
                        }
                    });
                }

                // Přidání směru šipky (arrowDirection)
                if (arrowDirection) {
                    db.run(insertArrowDirectionQuery, [pieceId, arrowDirection?.x, arrowDirection?.y], (err) => {
                        if (err) {
                            console.error("Error adding arrow direction:", err);
                            hasError = true;
                        }
                    });
                }

                // Vazba mezi klipem a částicí
                db.run(insertClipPieceQuery, [clipId, pieceId], (err) => {
                    if (err) {
                        console.error("Error linking piece to clip:", err);
                        hasError = true;
                    }
                });
            });
        });

        // Dokončení transakce
        if (hasError) {
            //db.run("ROLLBACK");
            return res.status(500).json({error: "Failed to add clip with pieces."});
        }

        // db.run("COMMIT", (err) => {
        //     if (err) {
        //         console.error("Error committing transaction:", err);
        //         return res.status(500).json({error: "Failed to commit transaction."});
        //     }
        //     res.status(201).json({message: "Clip and pieces added successfully.", clip_id: clipId});
        // });
        res.status(201).json({message: "Clip and pieces added successfully.", clip_id: clipId});
    });
};

/**
 * Sekce: Získání všech klipů daného uživatele
 * Endpoint: /getClips
*/
const getClips = (req, res) => {
    const { user_id, sortBy } = req.query;

    console.log("ID", user_id);

    let query = `SELECT * FROM clips`;
    const params = [];

    if (user_id) {
        query += ` WHERE user_id = ?`;
        params.push(user_id);
    }

    if (sortBy) {
        let sortColumn;
        switch (sortBy) {
            case 'name':
                sortColumn = 'name';
                break;
            case 'new':
                sortColumn = 'created_at DESC';
                break;
            case 'old':
                sortColumn = 'created_at ASC';
                break;
            case 'lastEdit':
                sortColumn = 'updated_at DESC';
                break;
            default:
                sortColumn = 'id';
        }
        query += ` ORDER BY ${sortColumn}`;
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: "Chyba při načtení klipů" });
        }

        const clipsData = rows.map((row) => ({
            id: row.id,
            name: row.name,
            description: row.description,
            created_at: row.created_at,
            updated_at: row.updated_at,
            src: `data:video/mp4;base64,${row.src.toString('base64')}`,
            poster: row?.poster
        }));

        return res.status(200).json({ clips: clipsData });
    });
};

/**
 * Sekce: Obnovení informací o daném klipu
 * Endpoint: /updateClip
 */
const updateClip = (req, res) => {
    const { clip_id, name, description } = req.body;

    // Čas obnovení klipu
    const updatedAt = new Date().toISOString();

    // Aktualizace dat klipu
    const query = `
        UPDATE clips
        SET name = ?, description = ?, updated_at = ?
        WHERE id = ?
    `;

    db.run(query, [name, description, updatedAt, clip_id], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Chyba obnovení klipu' });
        }

        if (this.changes > 0) {
            return res.status(200).json({ message: 'Informace o klipu byly změněny' });
        } else {
            return res.status(404).json({ error: 'Klip nenalezen' });
        }
    });
};

module.exports = {
    addPiecesData,
    getClips,
    updateClip
};
