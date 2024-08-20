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

module.exports = blogRouter;