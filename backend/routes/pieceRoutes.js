const express = require('express');
const { addPiecesData, getClips, updateClip } = require('../controllers/pieceControllers');

// Vytvoření nového routeru
const router = express.Router();

// Definování POST rout
router.post('/addClip', addPiecesData);
router.get('/getClips', getClips);
router.post('/updateClip', updateClip);

// Export routeru pro použití v jiných souborech
module.exports = router;