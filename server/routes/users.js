const router = require('express').Router();
const UsersManager = require("../managers/usersManager");

const usersManager = new UsersManager();

/**
 * AUTHENTICATE USER
 */
router.post('/login', (req, res) => {
    const { body: { user } } = req;
    usersManager.authenticateUser(user)
    .then(user => res.status(200).json(user.data))
    .catch(err => res.status(err.status).json(err.message));
});

/**
 * GET ACCOUNT ACTIVATION VIEW
 */
router.get('/verify/:id', (req, res) => {
    const today = new Date();
    usersManager.getUserById(req.params.id)
    .then(user => {
        if (user.data.linkExpiration > today) {
            res.status(200).send();
        }
        else {
            res.status(400).json("Lien expiré.");
        }
    })
    .catch(err => res.status(err.status).json(err.message));
});

/**
 * SET PASSWORD FOR NEW USER
 */
router.patch('/verify/:id', (req, res) => {
    const { body: { user } } = req;
    usersManager.setUserPassword(req.params.id, user.password)
    .then(user => res.status(200).json(user))
    .catch(err => res.status(err.status).json(err.message));
});

/**
 * GET ALL USERS
 */
router.get('/', (req, res) => {
    usersManager.getUsersByType(req.query.type)
    .then(result => res.status(200).json(result.data))
    .catch(err => res.status(err.status).json(err.message));
});

/**
* GET USER BY ID
*/
router.get('/:id', (req, res) => {
    usersManager.getUserById(req.params.id)
    .then(user => res.status(200).json(user.data))
    .catch(err => res.status(err.status).json(err.message));
});

module.exports = router;