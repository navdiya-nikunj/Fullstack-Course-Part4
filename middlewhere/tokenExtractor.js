const tokenExtractor = (request, response, next) => {
    // code that extracts the token
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        request.token = authorization.replace('Bearer ', '')
    } else {
        request.token = null;
    }
    next();
}

module.exports = tokenExtractor;