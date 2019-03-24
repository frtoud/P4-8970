const express = require('express');
const router = express.Router();

//Call other needed route indexes here from their own folders
router.use('/users', require('./users'));
router.use('/admin', require('./admin'));
router.use('/forms', require('./forms'));

router.get('/', (req, res) => {
    res.status(204).send();
});

module.exports = router;