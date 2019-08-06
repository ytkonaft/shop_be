const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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
  },

  async signIn(parent, { email, password }, ctx, info) {
    const user = await ctx.db.query.user({
      where: {
        email: email.toLowerCase()
      }
    });

    if (!user) {
      throw new Error("Email or password is not correct");
      return null;
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw new Error("Email or password is not correct");
      return null;
    }

    // TODO: Move to utils
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 3 // 3 days coockie life
    });

    return user;
  },

  async signUp(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();
    const password = await bcrypt.hash(args.password, 10);
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ["USER"] }
        }
      },
      info
    );
    // TODO: Move to utils
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 3 // 3 days coockie life
    });

    return user;
  },
  signOut(parent, args, ctx, info) {
    ctx.response.clearCookie("token");
    return { message: "Logged out" };
  }
};

module.exports = Mutations;
