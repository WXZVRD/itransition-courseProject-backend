
const User = require('../Models/userModel')


class userController {

    async block(req, res) {
        try {
            const { userId } = req.body;

            console.log(userId)
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ error: 'user not found' });
            }

            await user.update({
                isBlocked: true
            });

            res.status(200).json({ success: 'user has been blocked' });
            } catch (error) {
                console.error(`Error: ${error}`);
                res.status(500).json({ error: 'An error occurred while blocking the user' });
            }
        }

    async unblock (req, res) {
        try {
            const userId = req.body.userId;
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ error: 'user not found' });
            }

            await user.update({
                isBlocked: false
            });

            res.status(200).json({ success: 'user has been unblocked' });
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

    async makeAdmin (req, res) {
        try {
            const userId = req.body.userId;
            const user = await User.findByPk(userId);

            if (!user) {
                return res.status(404).json({ error: 'user not found' });
            }

            await user.update({
                isAdmin: true
            });

            res.status(200).json({ success: "user's rights changed" });
        } catch (error) {
            console.error(`Error: ${error}`);
            res.status(500).json({ error: 'An error occurred while fetching the users' });
        }
    }

    async delete (req, res) {
        try {
            const userId = req.body.userId;
            const user = await User.findByPk(userId);

            if (!user) {
                return res.status(404).json({ error: 'user not found' });
            }

            await user.destroy();

            res.status(200).json({ success: 'user has been deleted' });
        } catch (error) {
            console.error(`Error: ${error}`);
            res.status(500).json({ error: 'An error occurred while deleting the user' });
        }
    }

}

module.exports = new userController()