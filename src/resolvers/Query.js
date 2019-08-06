const { forwardTo } = require("prisma-binding");

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
  }
};

module.exports = Query;
