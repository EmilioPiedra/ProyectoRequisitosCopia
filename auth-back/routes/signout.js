const express = require('express');
const router = express.Router();
const Token = require("../schema/token");
const getTokenFromHeader = require("../auth/getTokenFromHeader");
const { jsonResponse } = require('../lib/jsonResponse');

router.delete("/", async function (req, res, next) {
    try {
        const refreshToken = getTokenFromHeader(req.headers);
        if (refreshToken) {
            await Token.findOneAndDelete({ token: refreshToken });
            res.status(200).json(jsonResponse(200, { message: "token borrado" }));
        }
    } catch (error) {
        console.log(error);
        res.status(500).json(jsonResponse(500, { error: "error al eliminar el token" }));
    }
});


module.exports = router;
