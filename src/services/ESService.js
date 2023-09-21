const client = require('../../elasticsearch');

module.exports = {
    create: async (index, id, data) => {
        try {
            const response = await client.index({
                index,
                id,
                body: data
            });
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    delete: async (index, id) => {
        try {
            const response = await client.delete({ index, id });
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    search: async (index, query) => {
        try {
            const response = await client.search({
                index,
                body: {
                    query: {
                        bool: {
                            should: [
                                {
                                    match: {
                                        title: {
                                            query: query,
                                            operator: "or",
                                            fuzziness: "auto",
                                            prefix_length: 2
                                        }
                                    }
                                },
                                {
                                    match: {
                                        text: {
                                            query: query,
                                            operator: "or",
                                            fuzziness: "auto",
                                            prefix_length: 2
                                        }
                                    }
                                }
                            ]
                        }
                    }
                },
                size: 20,
            });
            return response.body.hits.hits;
        } catch (error) {
            console.error(error);
            return { error: 'An error occurred while searching' };
        }
    }


}
