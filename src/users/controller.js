const { User } = require('./models');
const bcrypt = require('bcrypt');
const { loginSchema, userSchema } = require('./schemas');
const { ValidationError, where } = require('sequelize');
const e = require('express');
const { generateToken, generateRefreshToken } = require('../middleware/security')

const createUser = async (req, res) => {
    const { error } = userSchema.validate(req.body, { abortEarly: false });
    if (error) {
        res.status(400).json({ errors: error.details.map(e => e.message) });
    }
    const { name, email, password } = req.body;
    await User.findOne({ where: { email: email } }).then(user => {
        if (user) {
            res.status(409).json({ error: 'Email already in use' });
        } else {
            User.create({ name, email, password: bcrypt.hashSync(password, 10) }).then(user => {
                res.status(201).json({ status: "Success", detials: "User created!" });
            }).catch(err => {
                res.status(500).json({ error: err.message });
            });
        }
    });
};

const userLogin = async (req, res) => {
    const { error } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
        res.status(400).json({ errors: error.details.map(e => e.message) });
    }
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email } });
    if (!user || !bcrypt.compare(password, user.password)) {
        res.status(404).json({ error: 'Invalid credentials!' });
    } else {
        const refreshToken = await generateRefreshToken(user);
        res.cookie('refreshToken', refreshToken, { httpOnly: true });
        res.status(200).json({ token: generateToken(user) });
    }
}

module.exports = { createUser, userLogin };
