const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    let sum = 0;
    blogs.forEach(blog => {
        sum += blog.likes
    });
    return sum;
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return {};
    }
    let max = 0;
    let id = 0;
    blogs.forEach((blog, idx) => {
        if (blog.likes > max) {
            id = idx;
            max = blog.likes
        }
    })
    return {
        title: blogs[id].title,
        author: blogs[id].author,
        likes: blogs[id].likes
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}