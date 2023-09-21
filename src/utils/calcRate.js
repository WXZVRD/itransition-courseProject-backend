
const calculateRate = (ratings) => {
    const totalRating = ratings.reduce((sum, rating) => sum + rating.reviewerRate, 0);
    const averageRating = totalRating / ratings.length;
    return averageRating
}

module.exports = {
    calculateRate
}
