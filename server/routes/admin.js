const router = require('express').Router();
const guard = require('./guard');
const UsersManager = require("../managers/usersManager");

const usersManager = new UsersManager();

/**
 *  CREATE NEW USER 
 */
router.post('/users/new', /*guard.admin,*/ (req, res) => {
    const { body: { user } } = req;
    usersManager.createUser(user)
    .then(user => res.status(201).json(user))
    .catch(err => res.status(err.status).json(err.message));
});

/** 
 * COMMON ROUTE FOR PROMOTING USERS AND UPDATING THEIR INFOS 
 */
router.patch('/users/:id', /*guard.admin,*/ (req, res) => {
    const { body: { user } } = req;
    usersManager.updateUserByID(req.params.id, user)
    .then(user => res.status(200).json(user))
    .catch(err => res.status(err.status).json(err.message));
});

/** 
 * DELETE USER ACCOUNT 
 */
router.delete('/users/:id', /*guard.admin,*/ (req, res) => {
    usersManager.deleteUser(req.params.id)
    .then(() => res.status(204).send())
    .catch(err => res.status(err.status).json(err.message));
});

/** 
 * RESET USER PASSWORD 
 */
router.get('/users/reset/:id', /*guard.admin,*/ (req, res) => {
    usersManager.resetPassword(req.params.id)
    .then(() => res.status(200).send())
    .catch(err => res.status(err.status).json(err.message));
});

module.exports = router;