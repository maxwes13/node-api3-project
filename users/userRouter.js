const express = require('express');

const router = express.Router();


const posts = require("../posts/postDb.js")

router.use((req, res, next) => { 
  console.log("in the router middleware")
  next()
})

router.get('/', (req, res) => {
  // do your magic!
  posts.get()
    .then(posts => {
    if(posts) {
      res.status(200).json(posts)
    } else {
      res.status(404).json({ message: "Cannot get posts" })
    }
  })
  .catch(error => {
    console.log("Error getting posts ", error)
    res.status(500).json({ errorMessage: "Error getting posts" })
  })
});

router.get('/:id', validatePostId, (req, res) => {
  // do your magic!
    posts.getById(req.params.id)
  .then(post => {
    if(post) {
      res.status(200).json(post)
    } else {
      res.status(404).json({ message: "Post not found" })
    }
  })
  .catch(error => {
    console.log("Error getting specified id post ", error)
    res.status(500).json({ errorMessage: "Error getting specified id post" })
  })
});

router.delete('/:id', validatePostId, (req, res) => {
  // do your magic!
    posts.remove(req.params.id)
  .then(count => {
    if(count > 0) {
      res.status(200).json({ message: "The post has been deleted" })
    } else {
      res.status(404).json({ message: "The post cannot be deleted" })
    }
  })
  .catch(error => {
    console.log("Error deleting specified post ", error)
    res.status(500).json({ errorMessage: "Error deleting specified post" })
  })
});

router.put('/:id', validatePostId, (req, res) => {
  // do your magic!
  posts.update(req.params.id, req.body)
  .then(post => {
    if(post) {
      res.status(200).json(post)
    } else {
      res.status(404).json({ message: "The post could not be updated" })
    }  
  }) 
  .catch(error => {
    console.log("Error updating post ", error)
    res.status(500).json({ errorMessage: "Error updating post" })
  })
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
  const { id } = req.params
  posts.getById(id)
  .then(post => {
    if(post) {
      req.post = post 
      next()
    } else {
      res.status(404).json({ message: "Post id not found" })
    }
  })
  .catch(error => {
    console.log("Error finding post id ", error)
    res.status(500).json({ errorMessage: "Error finding post id" })
  })
}




module.exports = router;
