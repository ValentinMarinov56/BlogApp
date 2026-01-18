const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title:'Man banned from casino',
        author:'Asen Borisov',
        url:'https://www.efbet.com/',
        likes: 3
    },
    {
        title:'Macedonia fucking explodes',
        author:'Vasil Gerginov',
        url:'https://www.youtube.com/',
        likes: 67
    }
]

const initialUsers = [
    {
        username:'HashemAsen',
        name:'Asen',
        passwordHash:'bwb123'
    },
    {
        usenrame:'VaskoMangala',
        name:'Vaso',
        passwordHash:'brd12399'
    }
]

const nonExistingId = async () => {
    const blog = new Blog({title: 'willremovethissoon'})
    await blog.save()
    await blog.deleteOne()

    return blog.id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    initialBlogs, initialUsers, nonExistingId, blogsInDb, usersInDb
}