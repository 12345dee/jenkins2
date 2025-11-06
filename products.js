const express = require('express');
const router = express.Router();


// sample in-memory products
const PRODUCTS = [
{ id: 1, name: 'T‑shirt', price: 19.99 },
{ id: 2, name: 'Mug', price: 9.99 },
{ id: 3, name: 'Sticker', price: 2.5 }
];


router.get('/', (req, res) => res.json(PRODUCTS));


module.exports = router;
