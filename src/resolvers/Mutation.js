const { processUpload } = require("../modules/fileApi");

const Mutations = {
  async createProduct(parent, args, ctx, info) {
    // TODO: Check auth
    const { image, ...rest } = args;
    // TODO: IMAGE VALIDATION
    const imageUrl = image ? await processUpload(await image, ctx) : null;
    console.log(imageUrl);
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
  },

  async deleteProduct(parent, args, ctx, info) {
    const where = { id: args.id };
    const product = await ctx.db.query.product({ where }, info);
    // TODO CHECK PERMISSION
    return ctx.db.mutation.deleteProduct({ where }, info);
  },

  async updateProduct(parent, args, ctx, info) {
    const { image, id, ...updated } = args;

    if (!image) {
      updated.image = null;
    } else if (typeof image === "string" || image instanceof String) {
      updated.image = image;
    } else {
      updated.image = await processUpload(await image, ctx);
    }

    const product = await ctx.db.mutation.updateProduct({
      data: updated,
      where: {
        id: args.id
      }
    });
    return product;
  }
};

module.exports = Mutations;
