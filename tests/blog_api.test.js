const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const testHelper = require('./test_helper');
const Blog = require('../models/blog')

const api = supertest(app);

beforeEach(async () => {
    await Blog.deleteMany({});
    console.log('deleted');
    for (let b of testHelper.initialBlogs) {
        const blog = new Blog(b);
        await blog.save()
        console.log("save");
    }
    console.log("saved");
})

describe.only("Get Route", () => {
    test.only("returning blogs in json format", async () => {
        console.log("test entered")
        await api.get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/);
        console.log("Json done");
    })

    test.only("returning all the blogs", async () => {
        const res = await api.get('/api/blogs');
        assert.strictEqual(res.body.length, testHelper.initialBlogs.length);
        console.log("res done")
    })
})



after(async () => {
    await mongoose.connection.close()
})