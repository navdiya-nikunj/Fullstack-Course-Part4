const tokenExtractor = (request, response, next) => {
    // code that extracts the token
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        request.token = authorization.replace('Bearer ', '')
    } else {
        response.status(401).json({ error: "invalid token" })
    }
    next()
}

module.exports = tokenExtractor;