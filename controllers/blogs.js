const blogsRouter = require('express').Router()
const { request } = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { error } = require('../utils/logger')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.post('/',userExtractor, async (request, response, next) => {
    const body = request.body
    const blogUser = request.user

    if (!body.title || !body.url) {
        return response.status(400).json({ error: 'title or url missing' })
    }

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes === undefined ? 0 : body.likes,
        user: blogUser._id
    })

    const savedBlog = await blog.save()

    blogUser.blogs = blogUser.blogs.concat(savedBlog._id)
    await blogUser.save()

    const populated = await savedBlog.populate('user', { username: 1, name: 1 })
    response.status(201).json(populated)
})
blogsRouter.delete('/:id',userExtractor , async (request,response, next) => {
    const blogUser = request.user
    const blog = await Blog.findById(request.params.id)

    if (blog.user.toString() === blogUser._id.toString()) {
        await Blog.findByIdAndDelete(request.params.id)
        response.status(204).end()
    }
    else{
        return response.status(403).json({ error: 'cant delete other users blogs'})
    }

})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      body,
      { new: true, runValidators: true, context: 'query' }
    )

    const populated = await updatedBlog.populate('user', { username: 1, name: 1 })

    if (updatedBlog) {
      response.status(200).json(populated)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter