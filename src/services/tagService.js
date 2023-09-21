const Tag = require('../Models/tagModel');

const createOrUpdateTags = async (newTags) => {
    const tags = [];

    for (const newTag of newTags) {
        const tag = await Tag.findOrCreate({
            where: { title: newTag.trim() },
            defaults: { title: newTag.trim() }
        });

        tags.push(tag);
    }

    return tags;
};

module.exports = {
    createOrUpdateTags,
};
