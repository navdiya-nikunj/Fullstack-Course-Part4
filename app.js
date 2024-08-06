const express = require('express');
const app = express();
const config = require('./utils/config');
const cors = require('cors');
const logger = require('./utils/logger');
const blogRouter = require('./controllers/blogRouter');

const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

logger.info('connecting to', config.MONGO_URI);

mongoose.connect(config.MONGO_URI).then(() => {
    logger.info('connected to MongoDB');
}).catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
})

app.use(cors());
app.use(express.json());
app.use(express.static('dist')); ~
    app.use('/api/blogs', blogRouter);

module.exports = app;