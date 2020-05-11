const express = require('express');

const router = express.Router();

const db = require('./postDb');

router.get('/', (req, res) => {
  // do your magic!
  return db.get()
    .then(resp => { return res.status(200).json(resp) })
    .catch(error => { res.status(500).json(error); });
});

router.get('/:id', validatePostId, (req, res) => {
  // do your magic!
  const { post } = req;
  res.status(200).json(post);
});

router.delete('/:id', (req, res) => {
  // do your magic!
  if (!req.params.id) return res.status(500).json({ message: `Interal error, contact your friendly back-end developer.` });
  const id = parseInt(req.params.id);
  return db.remove(id)
  .then(resp => { return res.status(200).json(resp); })
  .catch(error => { return res.status(500).json(error); })
});

router.put('/:id', (req, res) => {
  // do your magic!
  if (!req.params.id) return res.status(500).json({ message: `Interal error, contact your friendly back-end developer.` });
  const id = parseInt(req.params.id);
  return db.update(id, req.body)
  .then(resp => { return res.status(200).json(resp); })
  .catch(error => { return res.status(500).json(error); })
});

// custom middleware

function validatePostId(req, res, next) {
  if (!req.params.id) return res.status(500).json({ message: `Interal error, contact your friendly back-end developer.` });
  else {
    const id = parseInt(req.params.id);
    db.getById(id)
      .then(resp => {
        if(!resp) return res.status(404).json({ message: `That user does not exist.` })
        req.post = resp;
        next();
      })
      .catch(error => { res.status(500).json(error); next(); });
  }
}

module.exports = router;
