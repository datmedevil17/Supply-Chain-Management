
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");



module.exports = buildModule("Tracking", (m) => {


  const Tracking = m.contract("Tracking", []);

  return { Tracking };
});


