const errorHandler = (err, req, res, next) => {
    console.error(err);

    return res.status(500).json({
        success: false,
        message: "An unexpected error occurred."
    });
};

module.exports = errorHandler;