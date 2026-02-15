const jwt = require("jsonwebtoken");

const verifyUser = (req, res, next) => {
    try {
        const token = req.cookies.LoginToken;

        if (!token) {
            return res.status(401).send("No Token Found");
        }

        const decoded = jwt.verify(token,"SKEY");

        req.user = decoded; // attach user data
        next(); // allow request to continue

    } catch (error) {
        return res.status(401).send("Invalid or Expired Token");
    }
};

module.exports = { verifyUser };
