const Review = require('../Models/reviewModel');

const checkAccess = async (req, res, next) => {
    try {
        if (req.user.role === 'admin') {
            return next();
        }
        const { reviewId } = req.params
        console.log(req.user)

        const userId = req.user.id
        const review = await Review.findByPk(reviewId);

        if (!review || review.author !== userId) {
            return res.status(403).json({ error: 'No Access' });
        }
        next();
    } catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).json({ error: 'An error occurred while processing authentication' });
    }
};

module.exports = checkAccess;
