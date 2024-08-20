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

const invalidId = async () => {
    const blogs = await Blog.find({});
    const blogId = blogs[0].id;
    await Blog.findByIdAndDelete(blogId);
    return blogId;
}

module.exports = ({
    blogsInDb, initialBlogs, invalidId
})