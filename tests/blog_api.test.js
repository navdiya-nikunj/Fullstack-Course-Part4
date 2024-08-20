const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const testHelper = require('./test_helper');
const Blog = require('../models/blog');
const { title } = require('node:process');

const api = supertest(app);

beforeEach(async () => {
    await Blog.deleteMany({});
    for (let b of testHelper.initialBlogs) {
        const blog = new Blog(b);
        await blog.save()
    }
})

describe("Get Route", () => {
    test("returning blogs in json format", async () => {
        console.log("test entered")
        await api.get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/);
        console.log("Json done");
    })

    test("returning all the blogs", async () => {
        const res = await api.get('/api/blogs');
        assert.strictEqual(res.body.length, testHelper.initialBlogs.length);
        console.log("res done")
    })

    test("id property for blogs exists", async () => {
        const res = await api.get('/api/blogs');
        const idExists = res.body.every(blog => Object.keys(blog).includes('id'));
        assert(idExists);
    })
})

describe("Post route tests", () => {


    test("new valid post added", async () => {
        const newblog = {
            title: "Anthing",
            author: "anyone",
            url: "www.anyone.url",
            likes: 20
        }

        const res = await api.post('/api/blogs').send(newblog).expect(201).expect('Content-Type', /application\/json/);

        const blogsInDb = await testHelper.blogsInDb();
        assert(blogsInDb.length, testHelper.initialBlogs.length + 1);
        delete res.body.id;
        const addedblog = res.body;
        assert.deepStrictEqual(addedblog, newblog)

    })

    test("Likes default to 0", async () => {
        const newblog = {
            title: "Anthing",
            author: "anyone",
            url: "www.anyone.url",
        }
        const res = await api.post('/api/blogs').send(newblog).expect(201).expect('Content-Type', /application\/json/);
        assert.strictEqual(res.body.likes, 0);
    })

    test("title missing", async () => {
        const newblog = {
            author: "anyone",
            url: "www.anyone.url",
        }
        await api.post('/api/blogs').send(newblog).expect(400)
    })
    test("url missing", async () => {
        const newblog = {
            title: "anything",
            author: "anyone",

        }
        await api.post('/api/blogs').send(newblog).expect(400)
    })
})

describe.only('Delete the blog', () => {
    test("valid id delete", async () => {
        const blogsBeforeDelete = await testHelper.blogsInDb();
        const blogToDelete = blogsBeforeDelete[0];

        await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

        const blogsAfterDelete = await testHelper.blogsInDb();
        assert.strictEqual(blogsAfterDelete.length, testHelper.initialBlogs.length - 1);

        const blogs = blogsAfterDelete.map(blog => blog.title);
        assert(!blogs.includes(blogToDelete.title));
    })

    test.only("invalid id", async () => {
        const invalidId = testHelper.invalidId;
        await api.delete(`/api/blogs/${invalidId}`).expect(400);
    })
})

after(async () => {
    await mongoose.connection.close()
})