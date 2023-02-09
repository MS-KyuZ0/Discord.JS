const { model, Schema } = require("mongoose");

const guildPrefix = new Schema({
  guildId: String,
  prefix: String,
});

module.exports = model("guild-prefix", guildPrefix);
