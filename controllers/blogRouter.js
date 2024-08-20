const blogRouter = require('express').Router();
const Blog = require('../models/blog');

blogRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({});
    res.json(blogs);
});

blogRouter.post('/', async (req, res, next) => {

    try {

        let blog;
        if (Object.keys(req.body).includes('likes')) {
            blog = new Blog(req.body);
        } else {
            blog = new Blog({ ...req.body, likes: 0 })
        }
        const addedblog = await blog.save();
        res.status(201).json(addedblog);
    } catch (error) {
        next(error);
    }


})

blogRouter.delete('/:id', async (req, res, next) => {
    const id = req.params.id;

    try {
        const blog = await Blog.findByIdAndDelete(id);
        res.send(204).json(blog);
    }
    catch (e) {
        console.log(e);
        next(e);
    }
})

blogRouter.put('/:id', async (req, res, next) => {
    const id = req.params.id;
    const body = req.body;
    try {
        const blog = await Blog.findById(id);
        const blogToUpdate = {
            title: body.title || blog.title,
            author: body.author || blog.author,
            url: body.url || blog.url,
            likes: body.likes || blog.likes
        }

        const updatedBlog = await Blog.findByIdAndUpdate(id, blogToUpdate, { new: true });
        res.send(201).json(updatedBlog);
    } catch (e) {
        next(e);
    }


})

blogRouter.get('/:id', async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id);
        res.send(200).json(blog);
    } catch (e) {
        next(e);
    }
})

module.exports = blogRouter;