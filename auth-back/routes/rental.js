const express = require('express');
const { jsonResponse } = require('../lib/jsonResponse');
const rental = require('../schema/rental');
const router = express.Router();

router.get('/', async (req, res) => {
    const data = await rental.find().populate('pickUpLocation').populate('returnLocation');
    res.status(200).json(jsonResponse(200, data));
});

router.post('/', async (req, res) => {
    try {
        const created = await rental.create(req.body);
        res.status(200).json(jsonResponse(200, created));
    } catch (error) {
        res.status(400).json(error)
    }
})

module.exports = router;