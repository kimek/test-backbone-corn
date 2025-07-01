const db = require('../db/database.js');

const getLastPurchase = (clientIp, callback) => {
  const sql = `
    SELECT timestamp FROM purchase_logs
    WHERE client_identifier = ?
    ORDER BY timestamp DESC
    LIMIT 1
  `;
  db.get(sql, [clientIp], callback);
};

const addPurchase = (clientIp, timestamp, callback) => {
  const sql = `INSERT INTO purchase_logs (client_identifier, timestamp) VALUES (?, ?)`;
  db.run(sql, [clientIp, timestamp], callback);
};

module.exports = {
  getLastPurchase,
  addPurchase
};
