const express = require ('express');

const router = express.Router ();

router.use (express.json ());

router.get ('/', (req, res) => {
    res.status (200).json ({api: 'up'});
});



module.exports = router;
