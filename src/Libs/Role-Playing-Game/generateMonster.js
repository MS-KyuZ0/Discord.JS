const isMonsters = require("../../../monster-list.json");
const isMonster = require("../../Models/monster");

async function generateMonsterStats(player) {
  const maxHealth =
    Math.floor(Math.random() * player.maxHp + player.level) + 50;
  const gold = Math.floor(Math.random() * 500 * player.level) + 100;
  const experience = Math.floor(Math.random() * 90 * player.level) + 10;
  const mLevel = player.level + Math.floor(Math.random() * 3);
  const monsterName = isMonsters[Math.floor(Math.random() * isMonsters.length)];
  const theMonster = isMonster.create({
    name: monsterName,
    hp: maxHealth,
    maxHp: maxHealth,
    level: mLevel,
    money: gold,
    xp: experience,
  });

  return theMonster;
}

module.exports = { generateMonsterStats };
