const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');



blogRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 });
    res.json(blogs);
});

blogRouter.post('/', async (req, res, next) => {

    try {
        let blog;
        console.log(req.user.id);
        const user = await User.findById(req.user.id);
        console.log(user);
        if (Object.keys(req.body).includes('likes')) {
            blog = new Blog({ ...req.body, user: req.user.id });
        } else {
            blog = new Blog({ ...req.body, likes: 0, user: req.user.id })
        }
        const addedblog = await blog.save();
        user.blogs = user.blogs.concat(addedblog.id);
        await user.save();
        res.status(201).json(addedblog);
    } catch (error) {
        console.log(error);
        next(error);
    }


})

blogRouter.delete('/:id', async (req, res, next) => {
    const id = req.params.id;

    try {
        const blog = await Blog.findById(id);

        if (blog.user.toString() !== req.user.id.toString()) {
            res.status(400).json({ error: "unauthorized action" })
        }
        const deletedBlog = await Blog.findByIdAndDelete(id);
        res.status(204).json(deletedBlog);
    }
    catch (e) {
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
        res.status(201).json(updatedBlog);
    } catch (e) {
        next(e);
    }


})

blogRouter.get('/:id', async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('BlogUser');
        res.status(200).json(blog);
    } catch (e) {
        next(e);
    }
})

module.exports = blogRouter;