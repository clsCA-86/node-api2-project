// implement your posts router here
// implement your posts router here
const express = require('express')
const Post = require('./posts-model')

const router = express.Router()

//ENDPOINTS

router.get('/', async(req, res) => {
  Post.find()
  .then(posts => {
    res.json(posts)
  })
  .catch(err => {
    res.status(500).json({
      message: "The posts information could not be retrieved",
      err: err.message,
      stack: err.stack,
    })
  })
})

router.get('/:id', async(req, res) => {
  const { id } = req.params
  Post.findById(id)
  .then(post => {
    if(!post) {
      res.status(404).json({
        message: "The post with the specified ID does not exist" 
      })
    }
    res.json(post)
  })
  .catch(err => {
    res.status(500).json({
      message: "The post information could not be retrieved",
      err: err.message,
      stack: err.stack,
    })
  })
})

router.post('/', async(req, res) => {
  const post = req.body
  if(!post.contents || !post.title) {
    res.status(400).json({
      message: "Please provide title and contents for the post"
    })
  } else {
    Post.insert(post)
    .then(({ id }) => {
      return Post.findById(id)
    })
    .then(newPost => {
      res.status(201).json(newPost)
    })
    .catch(err => {
      res.status(500).json({
        message: "There was an error while saving the post to the database",
        err: err.message,
        stack: err.stack,
      })
    })
  }
})

router.put('/:id', (req, res) => {
  const { contents, title } = req.body
  if(!contents || !title) {
    res.status(400).json({
     message: "Please provide title and contents for the post"
    })
  } else {
    Post.findById(req.params.id)
    .then(possiblePost => {
      if(!possiblePost) {
        res.status(404).json({
          message: "The post with the specified ID does not exist", 
        })
      } else {
        return Post.update(req.params.id, req.body)
      }
    })
    .then(data => {
      if(data) {
        return Post.findById(req.params.id)
      }
    })
    .then(post => {
      res.json(post)
    }).catch(err => {
      res.status(500).json({
        message: "The post information could not be modified",
        err: err.message,
        stack: err.stack,
      })
    })
  } 
})

router.delete('/:id', async (req, res) => {
  try{
    const post = await Post.findById(req.params.id)
    if(!post) {
      res.status(404).json({
        message: "The post with the specified ID does not exist"
      })
    } else {
      await Post.remove(req.params.id)
      res.json(post)
    }
  }
  catch (err) {
    res.status(500).json({
      message: "The post could not be removed",
      err: err.message,
      stack: err.stack,
    })
  }
})

//GET/COMMENTS

router.get('/:id/comments', async (req, res) => {
  try{
    const { id } = req.params
    Post.findById(id)
    .then(async post => {
      if(!post) {
        res.status(404).json({
          message: "The post with the specified ID does not exist"
        })
      } else {
        const comments = await Post.findPostComments(id)
        res.json(comments)
      }
    })
  }catch (err) {
    res.status(500).json({
      message: "The comments information could not be retrieved",
      err: err.message,
      stack: err.stack,
    })
  }
})

module.exports = router