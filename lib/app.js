const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');


// Built in middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5500', 'http://api.scryfall.com'], 
  credentials: true
}));


// App routes
app.use('/api/v1/users', require('./controllers/users'));
app.use('/api/v1/decks', require('./controllers/decks'));
app.use('/api/v1/cards', require('./controllers/cards'));

// Error handling & 404 middleware for when
// a request doesn't match any app routes
app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
