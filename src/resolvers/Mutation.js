const { processUpload } = require("../modules/fileApi");

const Mutations = {
  async createProduct(parent, args, ctx, info) {
    // TODO: Check auth
    const { image, ...rest } = args;
    const imageUrl = await processUpload(await image, ctx);

    const product = await ctx.db.mutation.createProduct(
      {
        data: {
          ...rest,
          image: imageUrl
        }
      },
      info
    );
    return product;
  },
  async uploadFile(parent, { file }, ctx, info) {
    return await processUpload(await file, ctx);
  }
};

module.exports = Mutations;
