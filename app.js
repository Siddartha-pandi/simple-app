const express = require("express");
const sql = require("mssql");

const app = express();
app.use(express.json());

const dbConfig = process.env.DB_CONNECTION;

const appMode = process.env.APP_MODE;

async function getConnection() {
  try {
    return await sql.connect(dbConfig);
  } catch (err) {
    console.error("DB Connection Failed", err);
  }
}

app.get("/", (req, res) => {
  res.send(`App is running in ${appMode} mode ✅`);
});

app.get("/add", async (req, res) => {
  try {
    const pool = await getConnection();
    await pool.request().query(`
      INSERT INTO Customers (Name, Email)
      VALUES ('Nagendhra Kushal Siddartha', 'team@azure.com')
    `);
    res.send("Customer added ✅");
  } catch (err) {
    res.send("Error adding customer ❌ " + err);
  }
});

app.get("/customers", async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM Customers");
    res.json(result.recordset);
  } catch (err) {
    res.send("Error fetching customers ❌ " + err);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
