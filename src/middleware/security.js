require('dotenv').config()
const jwt = require('jsonwebtoken');
const bycrypt = require('bcrypt');
const { RefreshToken } = require('../users/models');
const { where } = require('sequelize');


function generateToken(user) {
    return jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15s' });
}

async function generateRefreshToken(user) {
    const refreshToken = jwt.sign({ email: user.email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '5m' });
    const tokenRecord = await RefreshToken.findOne({ where: { email: user.email } });
    const encryptedRefreshToken = bycrypt.hashSync(refreshToken, 10);
    if (tokenRecord) {
        await RefreshToken.update({ refeshToken: encryptedRefreshToken }, { where: { email: user.email } });
    } else {
        await RefreshToken.create({ email: user.email, refreshToken: encryptedRefreshToken });
    }
    return refreshToken;
}

const isAuthenticated = (req, res, next) => {
    const auth = req.headers['authorization'];
    if (!auth || auth.split(' ') < 2) {
        return res.sendStatus(401);
    }
    const token = auth.split(' ')[1];
    const { error } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (error) {
        return res.sendStatus(403);
    }
    next();
}

// Verify refresh token
function verifyRefreshToken(token) {
    try {
        return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
        return null;
    }
}
const token = async (req, res) => {
    if (!req.cookies || !req.cookies.refreshToken || req.cookies.refeshToken === '{}') {
        return res.sendStatus(401);
    }
    const decodedToken = verifyRefreshToken(req.cookies.refreshToken);
    if (!decodedToken) {
        return res.sendStatus(403);
    }
    const refeshTokenObject = await RefreshToken.findOne({ where: { email: decodedToken.email } });

    if (!refeshTokenObject || !bycrypt.compare(req.cookies.refreshToken, refeshTokenObject.refreshToken)) {
        return res.sendStatus(403);
    }
    const user = { email: refeshTokenObject.email };
    const refreshToken = await generateRefreshToken(user);
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    res.status(200).json({ token: generateToken(user) });
};

const deleteToken = async (req, res) => {
    if (req.cookies && req.cookies.refreshToken) {
        const decodedToken = verifyRefreshToken(req.cookies.refreshToken);
        if (decodedToken) {
            await RefreshToken.destroy({ where: { email: decodedToken.email } })
        }
    }
    res.clearCookie('refreshToken', { path: '/' });
    res.sendStatus(200);
}


module.exports = {
    isAuthenticated,
    generateToken,
    generateRefreshToken,
    token,
    deleteToken
}