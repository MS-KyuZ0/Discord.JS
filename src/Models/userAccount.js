const { model, Schema } = require("mongoose");

const userAccount = new Schema({
  id: String,
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },
  maxHp: { type: Number, default: 100 },
  hp: { type: Number, default: 100 },
  damage: { type: Number, default: 20 },
  defense: { type: Number, default: 0 },
  money: { type: Number, default: 50000 },
  inventory: [
    {
      id: String,
      name: String,
      amount: Number,
      prize: Number,
    },
  ],
});

module.exports = model("user-account", userAccount);
