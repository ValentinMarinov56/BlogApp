const {test, after, beforeEach, describe} = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const { error } = require('node:console')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)

    await User.deleteMany({})
    await User.insertMany(helper.initialUsers)
})

describe('blog tests', () => {
    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')

        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('is the id variable written as "id"', async () => {
        const response = await api.get('/api/blogs')

        const firstBlog = response.body[0]
        const blogKeys = Object.keys(firstBlog)

        assert.strictEqual(blogKeys.includes('id'),true)
    })
    test('can you add blogs with POST', async () => {
        const blogsAtStart = helper.initialBlogs
        const newBlog = {
            title:"test title",
            author:"test author",
            url:"test url",
            likes: 15
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogAtEnd.length - 1,blogsAtStart.length)

        const titles = blogAtEnd.map(t => t.title)
        assert.strictEqual(titles.includes('test title'), true)
    })
    test('post with no likes should have 0 likes', async () => {
        const newBlog = {
            title:"test title",
            author:"test author",
            url:"test url",
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogAtEnd = await helper.blogsInDb()
        const titles = blogAtEnd.map(t => t.title)
        assert.strictEqual(titles.includes('test title'),true)
    })
    test('post with no title and/or no url shouldnt be added', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const noTitleBlog = {
            author:"test author",
            url:"test url"
        }
        const noUrlBlog = {
            title:"test title",
            author:"test author",
        }
        const noUrlAndNoTitle = {
            author:"test author"
        }

        await api
            .post('/api/blogs')
            .send(noTitleBlog)
            .expect(400)
        await api
            .post('/api/blogs')
            .send(noUrlBlog)
            .expect(400)
        await api
            .post('/api/blogs')
            .send(noUrlAndNoTitle)
            .expect(400)
        
        const blogAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtStart.length, blogAtEnd.length)
    })
    test('deleting a blog using its id', async () => {
        const blogsAtStart = await helper.blogsInDb()

        const blogToDelete = {
            title:"test title",
            author:"test author",
            url:"test url",
            likes: 15
        }

        await api
            .post('/api/blogs')
            .send(blogToDelete)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAfterPost = await helper.blogsInDb()

        const blogToDeleteWithId = blogsAfterPost.find(t => t.title == 'test title')

        await api
            .delete(`/api/blogs/${blogToDeleteWithId.id}`)
            .expect(204)
        
        const blogsAtEnd = await helper.blogsInDb()

        assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
    })
    test('update a blog', async () => {
        const blogToUpdate = {
            title:"test title",
            author:"test author",
            url:"test url",
            likes: 15
        }

        await api
            .post('/api/blogs')
            .send(blogToUpdate)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAfterPost = await helper.blogsInDb()
        const blogToUpdateWithId = blogsAfterPost.find(t => t.title == 'test title')
        blogToUpdateWithId.likes = blogToUpdateWithId.likes + 1

        await api
            .put(`/api/blogs/${blogToUpdateWithId.id}`)
            .send(blogToUpdateWithId)
            .expect(200)
        
        const blogsAfterPut = await helper.blogsInDb()
        const blogAfterLikesUpdate =  blogsAfterPut.find(t => t.title == 'test title')

        assert.strictEqual(blogAfterLikesUpdate.likes, blogToUpdate.likes + 1)
    })
})

describe('user test', () => {
    test('adding a valid user', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username:"testusername",
            name:"testname",
            password:"789999",
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const usersAtEnd = await helper.usersInDb()

        assert.strictEqual(usersAtStart.length + 1, usersAtEnd.length)
    })
    test('trying to add a invalid user', async () => {
        const usersAtStart = await helper.usersInDb()

        const invalidUserUsername = {
            username: '',
            name:'Aaaa',
            password:'12345'
        }

        const invalidUserPassword = {
            username:'Aaaaa',
            name:'Aaaa',
            password:''
        }

        await api
            .post('/api/users')
            .send(invalidUserUsername)
            .expect(400)
        await api
            .post('/api/users')
            .send(invalidUserPassword)
            .expect(400)

        const usersAtEnd = await helper.usersInDb()

        assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })
})

after(async () => {
  await mongoose.connection.close()
})