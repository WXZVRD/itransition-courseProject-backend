const { body } = require('express-validator');

const reviewValidation = [
    body('product.id', 'Product ID should not be empty').notEmpty(),
    body('product.title', 'Product title should not be empty').notEmpty(),
    body('product.type', 'Product type should not be empty').notEmpty(),
    body('product.averageRating', 'Product averageRating should not be empty').notEmpty(),
    body('title', 'Title should not be empty').notEmpty(),
    body('text', 'Text should be at least 50 characters long').isLength({ min: 50 }),
    body('img').optional(),
    body('tags').optional(),
];

module.exports = reviewValidation;
