require("dotenv").config();
const app = require("./app");
const connectdb = require("./config/db.js");

const PORT = process.env.PORT || 5000;

connectdb()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Database connection failed. Server not started:", err.message);
    });