const mongoose  = require('mongoose');

const connect = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("connection built successfully");
    }catch(error){
        console.log(error.message);
    }
}
module.exports = connect;