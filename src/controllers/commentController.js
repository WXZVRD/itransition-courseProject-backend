
const Comment = require('../Models/commentModel')
const User = require('../Models/userModel')

const ESService = require('../services/ESService')

class CommentController {
    constructor() {
    }

    async create (req, res) {
        try {
            const { reviewId, text } = req.body
            const author = req.user.id
            const comment = await Comment.create({
                reviewId: reviewId,
                author: author,
                text: text
            });

            await ESService.create('comments', comment.id, comment)

            const createdComment = await Comment.findByPk(comment.id, {
                include: User
            });

            res.status(200).json(createdComment)
        } catch (error) {
            console.error(`Error: ${error}`);
            res.status(500).json({ error: 'An error occurred while creating the comment' });
        }
    }

    async getAll (req, res) {
        try {
            const { reviewId } = req.query;

            const comments = await Comment.findAll({
                where: { reviewId: reviewId },
                include: [{
                    model: User,
                    attributes: ['id', 'name', 'secondName', 'avatar', 'likes']
                }]
            });

            if (!comments) {
                return res.status(404).json({ error: 'Comments not found' });
            }

            res.status(200).json(comments);
        } catch (error) {
            console.error(`Error: ${error}`);
            res.status(500).json({ error: 'An error occurred while fetching comments' });
        }
    }

}

module.exports = new CommentController();
