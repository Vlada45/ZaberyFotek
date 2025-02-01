const db = require('./db');

// Jednotlivé tabulky v databázi
const createTablesSQL = `

CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    image TEXT,
    type TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS clips (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    src TEXT,
    poster TEXT,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS piece (
    id INTEGER PRIMARY KEY,
    value INTEGER NOT NULL,
    src TEXT NOT NULL,
    width INTEGER NOT NULL,
    left INTEGER NOT NULL,
    isSubmitted BOOLEAN NOT NULL,
    arrow TEXT NOT NULL,
    duration INTEGER NOT NULL,
    special INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS transition (
    piece_id INTEGER NOT NULL,
    coordinateRes INTEGER NOT NULL,
    transitionID INTEGER NOT NULL,
    FOREIGN KEY (piece_id) REFERENCES piece(id)
);

CREATE TABLE IF NOT EXISTS arrowDirection (
    piece_id INTEGER NOT NULL,
    x TEXT NOT NULL,
    y TEXT NOT NULL,
    FOREIGN KEY (piece_id) REFERENCES piece(id)
);

CREATE TABLE IF NOT EXISTS transition_idPieces (
    piece_id INTEGER NOT NULL,
    key INTEGER NOT NULL,
    value INTEGER NOT NULL,
    FOREIGN KEY (piece_id) REFERENCES transition(piece_id)
);

CREATE TABLE IF NOT EXISTS cameraSize (
    piece_id INTEGER NOT NULL,
    currentIndex INTEGER NOT NULL,
    height TEXT NOT NULL,
    width TEXT NOT NULL,
    FOREIGN KEY (piece_id) REFERENCES piece(id)
);

CREATE TABLE IF NOT EXISTS clip_pieces (
    clip_id INTEGER NOT NULL,
    piece_id INTEGER NOT NULL,
    FOREIGN KEY (clip_id) REFERENCES clips(id),
    FOREIGN KEY (piece_id) REFERENCES piece(id)
);
`;

// Vytvoření tabulek v případě, že nejsou vytvořeny
db.exec(createTablesSQL, (err) => {
    if (err) {
        console.error('Chyba', err);
    } else {
        console.log('Tabulky byly úspěšně vytvořeny nebo načteny');
    }
});