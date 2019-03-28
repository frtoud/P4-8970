const router = require('express').Router();
const multer = require('multer');
var path = require('path');

var storage = multer.diskStorage({
// destination
destination: function (req, file, cb) {
    cb(null, './uploads/')
},
filename: function (req, file, cb) {
    cb(null, file.originalname);
}
});

var upload = multer({ storage: storage });


/**
 * UPLOAD SINGLE FILE
 */
router.post("/upload", upload.single("attachment"), function (req, res) {
    const file = req.file;
    if (!file) {
      res.status(400).send("Aucun fichier à attacher.")
    }
    res.send(file);
});

/**
 * UPLOAD MULTIPLE FILES
 */
router.post("/uploadMultiple", upload.array('attachments', 12), function (req, res) {
    const files = req.files;
    if (!files) {
      res.status(400).send("Aucun fichier à attacher.")
    }
    res.send(files);
});

/**
 * GET ATTACHMENT
 */
router.get("/uploads/:file", (req, res) => {
  const fileName = req.params.file;
  res.sendFile(path.resolve('uploads', fileName));
});

module.exports = router;