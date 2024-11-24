require('dotenv').config();
const express = require('express');
const path = require('path');

const userRoutes = require('./routes/userRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const adminRoutes = require('./routes/adminRoutes');

const sessionValidator = require('./middlewares/sessionValidator');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

const app = express();
app.use(express.json());

// API Routes
app.use('/api/users', sessionValidator, userRoutes);
app.use('/api/admin', adminRoutes); // add isAdmin middleware
app.use('/api/session', sessionRoutes);

// Default Endpoint
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;