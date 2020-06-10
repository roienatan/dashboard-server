const jwt = require('jsonwebtoken');
const { ADMIN_SECRET, USER_SECRET } = require('./constants');

module.exports = {
    generateUserToken: userId => {
        console.log('generating user token');
        return jwt.sign({ data: userId }, USER_SECRET, { expiresIn: '1h' });
    },

    generateAdminToken: adminId => {
        console.log('generating admin token');
        return jwt.sign({ data: adminId }, ADMIN_SECRET, { expiresIn: '1h' });
    },

    isAuthenticated: (req, res, next) => {
        console.log('verifying user token');
        jwt.verify(req.headers.authorization, USER_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Not Authorized' });
            }
            next();
        })
    },

    requiresAdmin: (req, res, next) => {
        console.log('verifying admin token');
        jwt.verify(req.headers.authorization, ADMIN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Not Authorized' });
            }
            next();
        })
    }
}