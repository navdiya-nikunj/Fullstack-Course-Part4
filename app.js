const express = require('express');
const app = express();
require('express-async-errors')
const config = require('./utils/config');
const cors = require('cors');
const logger = require('./utils/logger');
const blogRouter = require('./controllers/blogRouter');
const errorHandler = require('./middlewhere/errorMiddlewhere')
const userRouter = require('./controllers/userRouter');
const loginRouter = require('./controllers/login');
const mongoose = require('mongoose');
const tokenExtractor = require('./middlewhere/tokenExtractor');
const userExtractor = require('./middlewhere/userExtractor');

mongoose.set('strictQuery', false);

logger.info('connecting to', config.MONGO_URI);

mongoose.connect(config.MONGO_URI).then(() => {
    logger.info('connected to MongoDB');
}).catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
})

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));
app.use(tokenExtractor);
app.use('/api/login', loginRouter)
app.use('/api/blogs', userExtractor, blogRouter);
app.use('/api/users', userRouter);
app.use(errorHandler);
module.exports = app;