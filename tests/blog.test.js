const { test, describe } = require('node:test');
const assert = require('node:assert')
const list_helper = require('../utils/list_helper');

test('dummy returns one', () => {
    const blogs = [];
    const result = list_helper.dummy(blogs);
    assert.equal(result, 1);
})

describe('Total Likes', () => {

    test('bigger list and calculated right', () => {
        const blogs = [
            {
                likes: 30
            },
            {
                likes: 40
            },
            {
                likes: 40
            }
        ]
        assert.equal(list_helper.totalLikes(blogs), 110);
    })

    test("zero likes for empty list", () => {
        assert.equal(list_helper.totalLikes([]), 0);
    })

    test("One element list", () => {
        assert.equal(list_helper.totalLikes([{ likes: 14 }]), 14);
    })
})