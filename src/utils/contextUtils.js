let context = {};

const setContext = (key, value) => {
    context[key] = value;
};

const getContext = (key) => {
    return context[key];
};

const clearContext = () => {
    context = {};
};

module.exports = { setContext, getContext, clearContext };