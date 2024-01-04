// const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017";

// function getValue(){
//     console.log("connect");
// };

// const connectToMongo = async()=>{

//    const data= await getValue();
//    console.log(data);
// }
// module.exports = connectToMongo;

const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false)
        mongoose.connect(mongoURI) 
        console.log('Mongo connected')
    } catch(error) {
        console.log(error)
        process.exit()
    }
}

module.exports = connectDB