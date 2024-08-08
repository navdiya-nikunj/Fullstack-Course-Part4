const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: "I watched harry potter",
        author: "nikunj",
        url: "https://www/nikunj.com",
        likes: 35
    },
    {
        title: "Hp",
        author: "krip",
        url: "https://www.krip.com",
        likes: 30
    }

]

const blogsInDb = async () => {
    const blogs = await Blog.find({});
    return blogs.map(blog => blog.toJSON());
}

module.exports = ({
    blogsInDb, initialBlogs
})