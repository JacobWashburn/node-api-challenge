const express = require('express');

const router = express.Router();

router.use(express.json());

router.get('/', (req, res) => {
  res.status(200).json({ api: 'up' });
});

router.get('/', (req, res, next) => {
  Shouts.find()
    .then(shouts => {
      res.status(200).json(shouts);
    })
    .catch(error => next(error));
});

router.post('/', (req, res, next) => {
  Shouts.add(req.body)
    .then(shout => {
      res.status(201).json(shout);
    })
    .catch(error => next(error));
});

router.use(errorHandler);

function errorHandler(error, req, res, next) {

  res.status(500).json(error.message);
}

module.exports = router;
