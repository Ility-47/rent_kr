// middleware/validateTableData.js
const Joi = require('joi');

const tableSchemas = {
    auto: Joi.object({
        brand: Joi.string().required(),
        model: Joi.string().required(),
        year: Joi.number().integer().min(1900).max(new Date().getFullYear()),
        price: Joi.number().min(0),
        status: Joi.string().valid('available', 'rented', 'maintenance')
    }),
    // Добавьте схемы для других таблиц
};

module.exports = (table) => (req, res, next) => {
    if (!tableSchemas[table]) return next();
    
    const { error } = tableSchemas[table].validate(req.body);
    if (error) {
        return res.status(400).json({ 
            message: error.details[0].message 
        });
    }
    
    next();
};