const express = require("express");
const { register, login } = require("../actions/authActions");
const router = express.Router();

router.post("/register", async (req, res) => {
  const datas = req.body;

  if (!datas) {
    return res.status(400).json({ message: "Données invalides" });
  }

  const result = await register(datas);

  const statusMap = {
    bon: () => res.status(201).json(result),
    "name-exist": () => res.status(409).json({ message: "Nom existant" }),
    "email-exist": () =>
      res.status(409).json({ message: "Utilisateur existant" }),
    error: () =>
      res.status(500).json({ message: "Erreur au niveau du serveur" }),
  };

  return (statusMap[result.status] || statusMap["error"])();
});
router.post("/login", async (req, res) => {
  const datas = req.body;
  if (!datas) {
    return res.status(400).json({ message: "Données invalides" });
  }
  const result = await login(datas);
  if (result.success) {
    return res.status(200).json(result);
  } else {
    return res.status(409).json(result);
  }
});
module.exports = router;
