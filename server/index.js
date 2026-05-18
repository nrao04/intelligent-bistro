require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { menuItems } = require("../shared/menuItems.ts");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", menuItemCount: menuItems.length });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
