const app = require("./app");
const connectdb = require("./config/db.js");
require("dotenv").config();
connectdb();
const PORT = 5000;
app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})