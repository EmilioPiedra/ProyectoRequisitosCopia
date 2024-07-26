const getTokenFromHeader = require("./getTokenFromHeader");
const { verifyAccessToken } = require("./verifyTokens");

function authenticate(req, res, next) {
    const token = getTokenFromHeader(req.headers);
    if (token) {
        const decoded = verifyAccessToken(token);
        if (decoded) {
            req.user = { ...decoded.user };
            next();
        } else {
            return res.status(401).send(jsonResponse(401, { error: "token no autorizado" }));

        }

    } else {
        return res.status(401).send(jsonResponse(401, { error: "token no autorizado" }));

    }

}

module.exports = authenticate;