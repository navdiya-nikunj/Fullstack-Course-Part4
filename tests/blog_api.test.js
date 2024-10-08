const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const testHelper = require('./test_helper');
const Blog = require('../models/blog');
const { title } = require('node:process');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const api = supertest(app);

let token;
let userid;
beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});
    for (let b of testHelper.initialBlogs) {
        const blog = new Blog(b);
        await blog.save()
    }
    const user = {
        name: "test",
        username: 'test1',
        password: 'test1'
    }
    await api.post('/api/users').send(user).expect(201);
    const re = await api.post('/api/login').send({ username: user.username, password: user.password }).expect(200);
    token = re.body.token;
    userid = jwt.verify(token, process.env.SECRET).id;

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

describe.only("Post route tests", async () => {

    test.only("new valid post added", async () => {

        const newblog = {
            title: "Anthing",
            author: "anyone",
            url: "www.anyone.url",
            likes: 20
        }

        const res = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newblog).expect(201).expect('Content-Type', /application\/json/);

        const blogsInDb = await testHelper.blogsInDb();
        assert(blogsInDb.length, testHelper.initialBlogs.length + 1);
        delete res.body.id;
        const addedblog = res.body;
        assert.deepStrictEqual(addedblog, { ...newblog, user: userid });

    })

    test.only("Likes default to 0", async () => {
        const newblog = {
            title: "Anthing",
            author: "anyone",
            url: "www.anyone.url",
        }
        const res = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newblog).expect(201).expect('Content-Type', /application\/json/);
        assert.strictEqual(res.body.likes, 0);
    })

    test.only("title missing", async () => {
        const newblog = {
            author: "anyone",
            url: "www.anyone.url",
        }
        await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newblog).expect(400)
    })
    test.only("url missing", async () => {
        const newblog = {
            title: "anything",
            author: "anyone",

        }
        await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newblog).expect(400)
    })

    test.only("invalid token", async () => {
        const newblog = {
            title: "Anthing",
            author: "anyone",
            url: "www.anyone.url",
            likes: 20
        }

        await api.post('/api/blogs').send(newblog).expect(401);

    })

})

describe('Delete the blog', () => {
    test("valid id delete", async () => {
        const blogsBeforeDelete = await testHelper.blogsInDb();
        const blogToDelete = blogsBeforeDelete[0];

        await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

        const blogsAfterDelete = await testHelper.blogsInDb();
        assert.strictEqual(blogsAfterDelete.length, testHelper.initialBlogs.length - 1);

        const blogs = blogsAfterDelete.map(blog => blog.title);
        assert(!blogs.includes(blogToDelete.title));
    })

    test("invalid id", async () => {
        const invalidId = testHelper.invalidId;
        await api.delete(`/api/blogs/${invalidId}`).expect(400);
    })
})

describe("put route", () => {
    test("valid id info update", async () => {
        const blogsBefore = await testHelper.blogsInDb();
        const blogtoUpdateId = blogsBefore[0].id;
        const blogToUpdate = {
            likes: 41
        }
        const res1 = await api.put(`/api/blogs/${blogtoUpdateId}`).send(blogToUpdate).expect(201);
        const res2 = await api.get(`/api/blogs/${blogtoUpdateId}`).expect(200);
        assert.deepStrictEqual(res1.body, res2.body);
    })
})

after(async () => {
    await mongoose.connection.close()
})