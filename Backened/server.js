require("dotenv").config();
const app = require("./app");
const connectdb = require("./config/db.js");
connectdb();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});