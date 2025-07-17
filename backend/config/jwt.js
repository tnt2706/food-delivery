module.exports = {
    jwtSecret: process.env.JWT_SECRET || "tranngoctinh96",
    jwtExpiration: process.env.JWT_EXPIRATION || "30d",
    jwtAlgorithm: process.env.JWT_ALGORITHM || "HS256",
}