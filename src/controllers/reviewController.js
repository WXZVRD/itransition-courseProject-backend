const { cloudinary } = require('../../cloud');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid').v4;
const sequelize = require("../../database");

const User = require('../Models/userModel')
const Tag = require('../Models/tagModel')
const Review = require('../Models/reviewModel');
const Product = require('../Models/productModel')
const Rating = require('../Models/ratingModel')

const ESService = require('../services/ESService')
const tagService = require('../services/tagService');
const { validationResult } = require('express-validator');
const {calculateRate} = require("../utils/calcRate");
const Console = require("console");

require('dotenv').config();

class reviewController {

    constructor() {}

    async create (req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json(errors.array());
                return;
            }

            if (req.body.tags) {
                await tagService.createOrUpdateTags(req.body.tags);
            }

            const productId = req.body.product.id;
            const author = req.user.id;
            const rating = parseInt(req.body.product.averageRating);

            const product = await Product.findByPk(productId);

            if (!product) {
                await Product.create({
                    id: productId,
                    title: req.body.product.title,
                    type: req.body.product.type,
                });

                await Rating.create({
                    productId: productId,
                    reviewerId: author,
                    reviewerRate: rating,
                });

                await Product.update({
                    averageRating: rating
                }, {
                    where: { id: productId }
                });
            } else {
                await Rating.create({
                    productId: productId,
                    reviewerId: author,
                    reviewerRate: rating
                });

                const ratings = await Rating.findAll({
                    where: { productId: productId }
                });

                const averageRating = calculateRate(ratings)

                await Product.update({
                    averageRating: averageRating
                }, {
                    where: { id: productId }
                });
            }

            const reviewObj = {
                productId: productId,
                type: req.body.product.type,
                author: author,
                title: req.body.title,
                text: req.body.text,
                tags: req.body.tags,
                img: req.body.img,
                grade: rating,
            };

            const review = await Review.create(reviewObj);
            const result = await ESService.create('reviews', review.id, review);
            res.json(result);
        } catch (error) {
            console.error(`Error: ${error}`);
            res.status(500).json({ error: 'An error occurred while creating the review' });
        }
    }

    async delete (req, res) {
        try {
            const { reviewId } = req.params
            await Review.destroy({where: {id: reviewId}})

            await ESService.delete('reviews', reviewId)

            res.json({succes: 'Succesfully deleted!'})
        } catch (error) {
            console.error(`Error: ${error}`);
            res.status(500).json({error: 'An error occurred while deleting the review'});
        }
    }

    async getTopRated (req, res) {
        try {
            const reviews = await Review.findAll({
                limit: 6,
                include: [
                    {
                        model: User,
                        attributes: ['id', 'name', 'secondName', 'avatar', 'likes']
                    },
                    {
                        model: Product,
                    }
                ],
                order: [['averageRating', 'DESC']],
            });

            res.status(200).json(reviews)
        } catch (error) {
            console.error(`Error: ${error}`);
            res.status(500).json({error: 'An error occurred while fetching reviews'});
        }
    }

    async getLatest (req, res) {
        try {
            const reviews = await Review.findAll({
                limit: 6,
                include: [
                    {
                        model: User,
                        attributes: ['id', 'name', 'secondName', 'avatar', 'likes']
                    },
                    {
                        model: Product,
                    }
                ],
                order: [['createdAt', 'DESC']],
            });

            res.status(200).json(reviews)
        } catch (error) {
            console.error(`Error: ${error}`);
            res.status(500).json({error: 'An error occurred while fetching reviews'});
        }
    }

    async getReview (req, res) {
        try {
            const { reviewId, userId } = req.query

            console.log(userId)


            const review = await Review.findByPk(reviewId, {
                include: [
                    User,
                    Product
                ]
            })
            if (!review) {
                return res.status(400).json({error: 'No current review by this id'})
            }


            if (userId){
                const ratings = await Rating.findOne({
                    where: {
                        reviewerId: userId,
                        productId : review.productId
                    }
                });
                if (ratings){
                    const realReview = {
                        ...review.dataValues,
                        reviewerRate: ratings.dataValues.reviewerRate
                    };
                    res.json(realReview)
                } else {
                    const realReview = {
                        ...review.dataValues,
                        reviewerRate: 0
                    };
                    res.json(realReview);
                }
            } else {
                res.json(review)
            }
        } catch (error) {
            console.error(`Error: ${error}`);
            res.status(500).json({error: 'An error occurred while fetching reviews'});
        }
    }

    async getSimilar (req, res) {
        try {
            const { productId } = req.query

            const review = await Review.findAll({
                limit: 6,
                where: {
                    productId: productId
                },
                include: [
                    User,
                    Product
                ]
            })
            if (!review) {
                return res.status(400).json({error: 'No current review by product ID'})
            }

            res.json(review)
        } catch (error) {
            console.error(`Error: ${error}`);
            res.status(500).json({error: 'An error occurred while fetching reviews'});
        }
    }

    async getTags (req, res) {
        try {
            const tags = await Tag.findAll({
                limit: 20
            })
            if (!tags) {
                return res.status(400).json({error: 'No current review by this id'})
            }

            res.json(tags)
        } catch (error) {
            console.error(`Error: ${error}`);
            res.status(500).json({error: 'An error occurred while fetching reviews'});
        }
    }

    async update (req, res) {
        const { reviewId, tags } = req.body
        try {
            const review = await Review.findByPk(reviewId);
            if (!review) {
                return res.status(400).json({error: 'No current review by this id'});
            }
            if (tags) {
                await tagService.createOrUpdateTags(tags.tags);
            }

            await review.update(tags);

            res.json(review);
        } catch (error) {
            console.error(`Error: ${error}`);
            res.status(500).json({error: 'An error occurred while updating reviews'});
        }
    }

    async upload (req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({error: 'No file uploaded'});
            }

            const extName = path.extname(req.file.originalname).toLowerCase();
            const tempFilePath = path.join(__dirname, '../../uploads', `temp${extName}`);

            fs.writeFileSync(tempFilePath, req.file.buffer);

            const result = await cloudinary.uploader.upload(tempFilePath, {
                folder: 'uploads',
                public_id: uuid()
            });

            fs.unlinkSync(tempFilePath);

            res.json(result.secure_url);
        } catch (error) {
            console.error('Error: ', error);
            res.status(500).json({error: 'An error occurred while uploading the image'});
        }
    }

    async putLike (req, res) {

        console.log('LLLLLLIKEDDDDDDDDDDDDDDDDDD')
        const t = await sequelize.transaction();
        try {
            const { authorId, reviewId } = req.body
            const userId = req.user.id

            const review = await Review.findByPk(reviewId, {transaction: t});
            if (review.likes.includes(userId)) {
                await Review.update(
                    {likes: sequelize.literal(`array_remove(likes, '${userId}'::uuid)`)},
                    {where: {id: reviewId}, transaction: t}
                );

                const user = await User.findByPk(authorId, {transaction: t});
                await user.decrement('likes', { by: 1 })
                await user.save({transaction: t});
            } else {
                await Review.update(
                    {likes: sequelize.literal(`array_append(likes, '${userId}'::uuid)`)},
                    {where: {id: reviewId}, transaction: t}
                );

                const user = await User.findByPk(authorId, {transaction: t});
                await user.increment('likes', { by: 1 })
                await user.save({transaction: t});
            }

            await t.commit();
            res.json({success: 'Successfully updated likes'});
        } catch (error) {
            await t.rollback();

            console.error(`Error: ${error}`);
            res.status(500).json({error: 'An error occurred while updating likes'});
        }
    }

    async rateProduct(req, res) {
        try {
            const { productId, userRating } = req.body;

            const userId = req.user.id;

            const product = await Product.findByPk(productId);
            if (!product) {
                return res.status(400).json({ error: 'Product not found' });
            }

            const reviewRating = await Rating.findOne({ where: { reviewerId: userId, productId: productId } });

            if (!reviewRating) {
                await Rating.create({
                    productId: productId,
                    reviewerId: userId,
                    reviewerRate: userRating,
                });

                const ratings = await Rating.findAll({
                    where: { productId: productId }
                });
                const averageRating = calculateRate(ratings);

                await product.update({
                    averageRating: averageRating
                });
            } else {
                await reviewRating.update({
                    reviewerRate: userRating
                });

                const ratings = await Rating.findAll({
                    where: { productId: productId }
                });

                const averageRating = calculateRate(ratings);

                await product.update({
                    averageRating: averageRating
                });
            }

            res.json({ success: 'Successfully rated!' });
        } catch (error) {
            console.error(`Error: ${error}`);
            res.status(500).json({ error: 'An error occurred while processing the rating' });
        }
    }

    async search (req, res) {
        try {
            const { query } = req.query

            console.log(query)

            const result = await ESService.search(['reviews', 'comments'], query);

            res.json(result)
        } catch (error) {
            console.error(`Error: ${error}`);
            res.status(500).json({ error: 'An error occurred while searching' });
        }
    }

}

module.exports = new reviewController
