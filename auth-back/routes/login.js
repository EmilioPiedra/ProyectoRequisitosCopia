const express = require('express');
const { jsonResponse } = require('../lib/jsonResponse');
const router = express.Router();
const user = require("../schema/user")
const getUserInfo = require("../lib/getUserInfo");


router.post('/', async (req, res) => {
    const { userName, password } = req.body;
    if (!!!userName || !!!password) {
        return res.status(400).json(jsonResponse(400, { error: "Campos requeridos faltantes" }));
    }

    const User = await user.findOne({ userName });
    if (User) {
        const correctPassword = await User.comparePassword(password, User.password);

        if (correctPassword) {
            const accessToken = User.createAccessToken();
            const refreshToken = await User.createRefreshToken();

            console.log({ accessToken, refreshToken });
            return res.json(
                jsonResponse(200, {
                    accessToken,
                    refreshToken,
                    user: getUserInfo(User),
                })
            );
        } else {
            return res.status(400).json(
                jsonResponse(400, {
                    error: "password incorrect",
                }));
        }
    } else {
        return res.status(400).json(
            jsonResponse(400, {
                error: "username and/or password incorrect",
            }));
    }


});

module.exports = router;
