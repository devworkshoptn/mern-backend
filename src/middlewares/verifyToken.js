const jwt = require("jsonwebtoken");

module.exports = (request, response, next) => {
  const { authorization } = request.headers;
  if (!authorization || authorization === "") {
    return response.status(401).send({ message: "Unauthorized" });
  }
  const token = authorization.split(" ")[1];
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    request.user = user;
    next();
  } catch (error) {
    console.log(error);
    return response.status(403).send({ message: "Forbidden" });
  }
};
