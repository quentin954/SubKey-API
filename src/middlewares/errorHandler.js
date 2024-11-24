const errorHandler = (err, req, res, next) => {
    console.error(err);

    return res.status(500).json({
        success: false,
        message: "An unexpected error occurred."
    });
};

const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Method ${req.method} not allowed on route ${req.originalUrl}. Please refer to the documentation.`
    });
};

module.exports = { errorHandler, notFoundHandler };