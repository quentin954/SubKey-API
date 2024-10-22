require('dotenv').config();
const express = require('express');

const userRoutes = require('./routes/userRoutes');
const sessionRoutes = require('./routes/sessionRoutes');

const errorHandler = require('./middlewares/errorHandler');

const app = express();
app.use(express.json());

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/session', sessionRoutes);

// Default Endpoint
app.get('/', (req, res) => {
    res.send('SubKey-API is running');
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;