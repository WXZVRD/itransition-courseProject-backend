
const User = require('../Models/userModel')


class userController {

    async block(req, res) {
        try {
            const usersId = req.body;

            await User.update(
                { isBlocked: true },
                { where: { id: usersId } }
            );

            res.status(200).json({ success: 'users has been blocked' });
            } catch (error) {
                console.error(`Error: ${error}`);
                res.status(500).json({ error: 'An error occurred while blocking the user' });
            }
        }

    async unblock (req, res) {
        try {
            const usersId = req.body;

            await User.update(
                { isBlocked: false },
                { where: { id: usersId } }
            );

            res.status(200).json({ success: 'users has been unblocked' });
        } catch (error) {
            console.error(`Error: ${error}`);
            res.status(500).json({ error: 'An error occurred while unblocking user' });
        }
    }

    async getUsers (req, res) {
        try {
            const users = await User.findAll();
            if (!users) {
                return res.status(404).json({ error: 'users not found' });
            }

            const modifiedUsers = users.map((user) => ({
                id: user.id,
                name: user.name,
                avatar: user.avatar,
                isAdmin: user.isAdmin,
                isBlocked: user.isBlocked,
                likes: user.likes,
            }));

            res.status(200).json(modifiedUsers);
        } catch (error) {
            console.error(`Error: ${error}`);
            res.status(500).json({ error: 'An error occurred while fetching the users' });
        }
    }

    async getOneUser (req, res) {
        try {
            const { userId } = req.query
            const user = await User.findByPk(userId)

            res.status(200).json(user);
        } catch (error) {
            console.error(`Error: ${error}`);
            res.status(500).json({ error: 'An error occurred while fetching the user' });
        }
    }

    async makeAdmin (req, res) {
        try {
            const usersId = req.body;

            await User.update(
                { isAdmin: true },
                { where: { id: usersId } }
            );

            res.status(200).json({ success: "user's rights changed" });
        } catch (error) {
            console.error(`Error: ${error}`);
            res.status(500).json({ error: 'An error occurred while fetching the users' });
        }
    }

    async delete (req, res) {
        try {
            const usersId = req.body;

            console.log(usersId)

            await User.destroy({
                where:{ id: usersId }
            })

            res.status(200).json({ success: 'users has been deleted' });
        } catch (error) {
            console.error(`Error: ${error}`);
            res.status(500).json({ error: 'An error occurred while deleting the user' });
        }
    }

}

module.exports = new userController()