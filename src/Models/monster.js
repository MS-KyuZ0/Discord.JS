const { model, Schema } = require("mongoose");

const monsterSchema = new Schema({
  name: String,
  hp: Number,
  maxHp: Number,
  level: Number,
  money: Number,
  xp: Number,
});

module.exports = model("monster", monsterSchema);
