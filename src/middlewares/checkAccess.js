const Review = require('../Models/reviewModel');
const { Op } = require('sequelize');

const checkAccess = async (req, res, next) => {
    try {
        if (req.user.role === 'admin') {
            return next();
        }

        const {reviewIds} = req.body;

        const userId = req.user.id;
        console.log(reviewIds);

        const count = await Review.count({
            where: {
                author: userId,
                id: {
                    [Op.in]: reviewIds
                },
            },
        });


        if (count !== reviewIds.length) {
            return res.status(403).json({ error: 'No Access' });
        }

        next();
    } catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).json({ error: 'An error occurred while processing authentication' });
    }
};

module.exports = checkAccess;
