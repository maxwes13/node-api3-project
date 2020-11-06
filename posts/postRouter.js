const express = require('express');

const router = express.Router();

const users = require("./userDb.js")
const posts = require("../posts/postDb.js")

router.use((req, res, next) => {
  console.log("in the router middleware")
  next()
})

router.post('/', validateUser, (req, res) => {
  // do your magic!
  users.insert(req.body)
  .then(user => {
    res.status(201).json(user)
  })
  .catch(error => {
    console.log("Error adding user ", error)
    res.status(500).json({ errorMessage: "Error adding user" })
  })

});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // do your magic!
  const postInfo = {
    ...req.body,
    user_id: req.params.id
  }
  posts.insert(postInfo)
  .then(post => {
    res.status(201).json(post)
  })
  .catch(error => {
    console.log("Error adding post ", error)
    res.status(500).json({ errorMessage: "Error adding post" })
  })
});

router.get('/', (req, res) => {
  // do your magic!
  users.get()
  .then(users => {
    if(users) {
      res.status(200).json(users)
    } else {
      res.status(404).json({ message: "Cannot get users" })
    }
  })
  .catch(error => {
    console.log("Error getting users ", error)
    res.status(500).json({ errorMessage: "Error getting users" })
  })
});

router.get('/:id', validateUserId, (req, res) => {
  // do your magic!
  users.getById(req.params.id)
  .then(user => {
    if(user) {
      res.status(200).json(user)
    } else {
      res.status(404).json({ message: "User not found" })
    }
  })
  .catch(error => {
    console.log("Error getting specified id user ", error)
    res.status(500).json({ errorMessage: "Error getting specified id user" })
  })
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // do your magic!
  users.getUserPosts(req.params.id)
  .then(posts => {
    if(posts) {
      res.status(200).json(posts)
    } else {
      res.status(404).json({ message: "Error getting user id posts" })
    }
  })
  .catch(error => {
    console.log("Error getting user id posts ", error)
    res.status(500).json({ errorMessage: "Error getting user id posts" })
  })
});

router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!
  users.remove(req.params.id)
  .then(count => {
    if(count > 0) {
      res.status(200).json({ message: "The user has been deleted" })
    } else {
      res.status(404).json({ message: "The user cannot be deleted" })
    }
  })
  .catch(error => {
    console.log("Error deleting specified user ", error)
    res.status(500).json({ errorMessage: "Error deleting specified user" })
  })
});

router.put('/:id', validateUserId, (req, res) => {
  // do your magic!
  users.update(req.params.id, req.body)
  .then(user => {
    if(user) {
      res.status(200).json(user)
    } else {
      res.status(404).json({ message: "The user could not be updated" })
    }  
  }) 
  .catch(error => {
    console.log("Error updating user ", error)
    res.status(500).json({ errorMessage: "Error updating user" })
  })

});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  const { id } = req.params
  users.getById(id)
  .then(user => {
    if(user) {
      req.user = user 
      next()
    } else {
      res.status(404).json({ message: "Invalid user id" })
    }
  })
  .catch(error => {
    console.log("Error finding user id ", error)
    res.status(500).json({ errorMessage: "Error finding user id" })
  })
}

function validateUser(req, res, next) {
  // do your magic!
  const user = req.body
  console.log("User validation for ", user)
  if(req.body && Object.keys(req.body). length > 0) {
    if('name' in req.body) {
      next()
    } else {
      res.status(400).json({ message: "Missing required name field" })
    }
  } else {
    res.status(400).json({ message: "Missing user data" })
  }
}

function validatePost(req, res, next) {
  // do your magic!
  const post = req.body
  console.log("Post validation for ", post)
  if(req.body && Object.keys(req.body).length > 0) {
    if('text' in req.body) {
      next()
    } else {
      res.status(400).json({ message: "Missing required text field" })
    }
  } else {
    res.status(400).json({ message: "Missing post data" })
  }
}

module.exports = router;