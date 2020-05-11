const express = require('express');

const router = express.Router();

const users = require('./userDb');
const posts = require('../posts/postDb');

router.post('/', validateUser, (req, res) => {
  // do your magic!
  const { name } = req.body;
  return users.insert({
    name,
  }).then(resp => {
    res.status(201).json(resp);
  }).catch(error => {
    res.status(500).json(error);
  });
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // do your magic!
  const { user } = req;
  const { text } = req.body;

  return posts.insert({
    user_id: user.id,
    text
  }).then(resp => {
    return res.status(201).json(resp);
  }).catch(error => {
    res.status(500).json(error);
  });

});

router.get('/', (req, res) => {
  // do your magic!
  return users.get()
    .then(resp => { return res.status(200).json(resp) })
    .catch(error => { res.status(500).json(error); });
});

router.get('/:id', validateUserId, (req, res) => {
  // do your magic!
  const { user } = req;
  res.status(200).json(user);
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // do your magic!
  const { user } = req;
  posts.get()
    .then(resp => {
      return res.status(200).json(resp.filter(post => post.user_id === user.id))
   })
  .catch(error => { res.status(500).json(error); });
});

router.delete('/:id', (req, res) => {
  // do your magic!
  const { user } = req;

  return users.remove(user.id)
  .then(resp => { return res.status(200).json(resp) })
  .catch(error => { res.status(500).json(error); });
  
});

router.put('/:id', validateUserId, (req, res) => {
  // do your magic!
  const { user } = req;
  return users.update(user.id, req.body)
  .then(resp => { return res.status(200).json(resp) })
  .catch(error => { res.status(500).json(error); });
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  if (!req.params.id) return res.status(500).json({ message: `Interal error, contact your friendly back-end developer.` });
  else {
    const id = parseInt(req.params.id);
    users.getById(id)
      .then(resp => {
        console.log(resp);
        if(!resp) return res.status(404).json({ message: `That user does not exist.` })
        req.user = resp;
        next();
      })
      .catch(error => { res.status(500).json(error); next(); });
  }
}

function validateUser(req, res, next) {
  // do your magic!
  if (!req.body || !req.body.name) return res.status(400).json({ message: `Please provide a 'name' field in the request body.` })
  else next();
}

function validatePost(req, res, next) {
  // do your magic!
  if (!req.body || !req.body.text) return res.status(400).json({ message: `Please provide a 'text' field in the request body.` })
  else next();
}

module.exports = router;
