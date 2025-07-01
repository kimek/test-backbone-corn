const cornService = require('../repository/corn-repo');

const purchaseCorn = (req, res) => {
  const clientIp = req.ip;
  const currentTime = Date.now();

  cornService.addPurchase(clientIp, currentTime, (err) => {
    if (err) {
      return res.status(500).send('Server error');
    }

    res.status(200).send('🌽');
  });
};

module.exports = {
  purchaseCorn
};
