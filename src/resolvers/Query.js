const { forwardTo } = require("prisma-binding");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Query = {
  products: forwardTo("db"),
  product: forwardTo("db"),
  productsConnection: forwardTo("db"),
  async me(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      return null;
    }
    return await ctx.db.query.user(
      {
        where: {
          id: ctx.request.userId
        }
      },
      info
    );
  },

  async signIn(parent, { email, password }, ctx, info) {
    const user = await ctx.db.query.user({
      where: {
        email: email.toLowerCase()
      }
    });
    if (!user) {
      throw Error("Email or password is not correct");
      return null;
    }

    if (bcrypt.hash(password, 10) !== user.password) {
      throw Error("Email or password is not correct");
      return null;
    }

    // TODO: Move to utils
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 3 // 3 days coockie life
    });

    return user;
  }
};

module.exports = Query;
