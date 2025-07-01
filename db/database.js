const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run(`
    CREATE TABLE purchase_logs (
      client_identifier TEXT NOT NULL,
      timestamp INTEGER NOT NULL
    )
  `);
  // we can add some index ideally here
});

process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      // some handles here
    }
    process.exit(0);
  });
});

module.exports = db;
