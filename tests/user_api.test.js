const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const { describe, test, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose')

beforeEach(async () => {
    await User.deleteMany({});
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync("abc@123", salt);
    const initalUser = new User({
        name: "Nikunj",
        username: "dontknow",
        hashedPassword: hash
    })

    await initalUser.save();
})

describe.only('adding user', () => {
    test.only('empty username', async () => {
        const user = {
            name: "krip",
            password: "afirersd"
        }
        await api.post('/blogApp/api/users').send(user).expect(400);
    })

    test.only('short username', async () => {
        const user = {
            name: 'krip',
            username: "pr",
            password: "fsgfsfgd"
        }
        await api.post('/blogApp/api/users').send(user).expect(400);
    })
    test.only('short password', async () => {
        const user = {
            name: 'krip',
            username: "prfrg",
            password: "fs"
        }
        await api.post('/blogApp/api/users').send(user).expect(400);
    })
    test.only('username exists', async () => {
        const user = {
            name: "krip",
            username: 'dontknow',
            password: "afirersd"
        }
        await api.post('/blogApp/api/users').send(user).expect(400);
    })
})

after(async () => {
    await mongoose.connection.close();
})
