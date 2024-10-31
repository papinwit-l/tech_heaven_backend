module.exports.auth = async (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return createError(401, "unauthenticated");
    }
    const accessToken = authorization.split(" ")[1];
    if (accessToken === null) {
      return createError(401, "unauthenticated");
    }
    // console.log("object",accessToken)
    const payload = jwt.verify(accessToken, process.env.JWT_SECRET);
    // console.log(payload,'111111111111111111111111111111')
    const user = await prisma.user.findUnique({ where: { id: payload.user.id } });
    if (!user) {
      createError(401, "unauthenticated user not found");
    }
    delete user.password;
    req.user = user;
    next();
  };