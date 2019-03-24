const router = require('express').Router();
const guard = require('./guard');
const FormsManager = require("../managers/formsManager");

const formsManager = new FormsManager();

/**
 *  CREATE NEW FORM
 * TODO: Protect route
 */
router.post('/new', (req, res) => {
    const { body: { form } } = req;
    formsManager.createForm(form)
    .then(form => res.status(201).json(form))
    .catch(err => res.status(err.status).json(err.message));
});

/**
 * GET ALL Forms
 * TODO: Protect route
 */
router.get('/', (req, res) => {
    formsManager.getAllForms()
    .then(result => res.status(200).json(result.data))
    .catch(err => res.status(err.status).json(err.message));
});

/**
 * GET FORM BY ID
 * TODO: Protect route
 */
router.get('/:id', (req, res) => {
    formsManager.getFormById(req.params.id)
    .then(form => res.status(200).json(form.data))
    .catch(err => res.status(err.status).json(err.message));
});

/**
 * GET FORMS BY USER
 * TODO: Protect route
 */
router.get('/user/:id', (req, res) => {
    formsManager.getFormsByUser(req.params.id)
    .then(result => res.status(200).json(result.data))
    .catch(err => res.status(err.status).json(err.message));
});

module.exports = router;