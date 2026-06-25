const jwt = require("jsonwebtoken");
const blackListData = require("../model/blackList.model.js");

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({
            message: " Token not provided"
        });
    }

    const tokenBlacklisted = await blackListData.findOne({token});

    if(tokenBlacklisted){
        return res.status(401).json({
            message: "Unauthorized, token is blacklisted"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({
            message: "Unauthorized, invalid token"
        })
    }
}

module.exports = authMiddleware;