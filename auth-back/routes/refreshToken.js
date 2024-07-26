const express = require('express');
const getTokenFromHeader = require('../auth/getTokenFromHeader');
const router = express.Router();
const Token = require("../schema/token");
const { verifyRefreshToken } = require('../auth/verifyTokens');

router.post('/', async (req, res) => {
    const refreshToken = getTokenFromHeader(req.headers);
    if (refreshToken) {
        try {
            const found = await Token.findOne({ token: refreshToken });
            if (!found) {
                return res.status(401).send(jsonResponse(401, { error: "No autorizado" }));
            }

            const payload = verifyRefreshToken(found.token);
            if (payload) {
                const accessToekn = generateAccessToken(payload.user);
                return res.status(200).send(jsonResponse(200, { accessToekn }));
            } else {
                return res.status(401).send(jsonResponse(401, { error: "No autorizado" }));
            }
        } catch (error) {
            return res.status(401).send(jsonResponse(401, { error: "No autorizado" }));
        }
    } else {
        res.status(401).send(jsonResponse(401, { error: "no autorizado" }));
    }
    res.send('refresh token route');
});

module.exports = router;
