require('dotenv').config();
const express = require('express');
const path = require('path');

const userRoutes = require('./routes/userRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');

const sessionValidator = require('./middlewares/sessionValidator');
const { isAuthenticated, isAdmin } = require('./middlewares/authMiddleware');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');
const ipLogger = require('./middlewares/ipLogger');
const clearContextMiddleware = require('./middlewares/clearContextMiddleware');

const initializeEssentialData = require('./scripts/dbInitializer');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error("Error: JWT_SECRET is not specified! The application cannot start without it.");
    process.exit(1);
}

const app = express();
app.use(express.json());
app.use(ipLogger);
app.use(clearContextMiddleware);

// API Routes
app.use('/api/users', /*sessionValidator,*/ userRoutes);
app.use('/api/admin', isAuthenticated, isAdmin, adminRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/products', productRoutes);

// Default Endpoint
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
(async () => {
    await initializeEssentialData();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})();

module.exports = app;