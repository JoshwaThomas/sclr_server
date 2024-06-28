const express = require('express');
const router = express.Router();
const AmountModel = require('../models/amt');

router.post("/freshamt", (req, res) => {
    AmountModel.create(req.body)
    .then(result => res.json(result))
    .catch(err => res.json(err));
    
    
})

module.exports = router;