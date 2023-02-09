const { model, Schema } = require("mongoose");

const userAccount = new Schema({
  userId: String,
  userName: String,
  level: Number,
  xp: Number,
  inventory: [
    {
      id: String,
      emoji: String,
      amount: Number,
      prize: Number,
    },
  ],
  Status: {
    damage: Number,
    defense: Number,
  },
  money: Number,
});

module.exports = model("user-account", userAccount);
