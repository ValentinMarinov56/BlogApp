const blog = require("../models/blog");

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0)
}

const favoriteBlog = (blogs) => {
    let blogToReturn = blogs[0]
        blogs.forEach(blog => {
        if (blogToReturn.likes < blog.likes) {
            blogToReturn = blog
        }
    });
    return blogToReturn.likes ? blogToReturn.likes : 0
}
module.exports = {
    totalLikes,
    favoriteBlog
}