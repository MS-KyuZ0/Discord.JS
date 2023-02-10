async function addMoney(data, money) {
  if (!data) return;

  data.money += money;
}

async function lessMoney(data, money) {
  if (!data) return;

  data.money -= money;
}

module.exports = { addMoney, lessMoney };
