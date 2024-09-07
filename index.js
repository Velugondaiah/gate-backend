const express = require("express")
const app = express()
const {open} = require("sqlite")
const bcrypt = require("bcrypt")
const sqlite3 = require("sqlite3")
const jwt = require("jsonwebtoken");
const path = require("path")
const cors = require("cors")
const { error } = require("console")
app.use(express.json())
const dbPath = path.join(__dirname , "gate.db")
let db = null;
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from frontend running at localhost:3000
}));

const initilizeServerAndDB = async () => {
    try{
        db = await open({
            filename : dbPath,
            driver : sqlite3.Database
        })
        app.listen( process.env.PORT ||3001 , () => {
            console.log("running http://localhost:3001")
        })
    }catch(e){
        console.log(`DB Error${e.message}`)
       process.exit(1)
    }

}
initilizeServerAndDB()

app.post("/users", async (request, response) => {
    const {  name, password} = request.body;
    const hashedPassword = await bcrypt.hash(request.body.password, 10);
    const selectUserQuery = `SELECT * FROM register WHERE name = ?`;
    const dbUser = await db.get(selectUserQuery , [name]);
    console.log(dbUser)
    if (dbUser === undefined) {
      const createUserQuery = `
        INSERT INTO 
          register (  name, password ) 
        VALUES 
          ( ? , ?
            
          )`;
      const dbResponse = await db.run(createUserQuery , [name , hashedPassword]);
      const newUserId = dbResponse.lastID;
      response.status(200)
      response.send({success : `Created new user with 9`});
      
    } else {
      response.status(400);
      response.send({error_msg : "User already exists"});
       
    }
  });


  app.post("/login", async (request, response) => {
    const { name, password } = request.body;
    const selectUserQuery = `SELECT * FROM register WHERE name = '${name}'`;
    const dbUser = await db.get(selectUserQuery);
    if (dbUser === undefined) {
      response.status(400);
      response.json({error_ms : "Invalid User"});
    } else {
      const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
      if (isPasswordMatched === true) {
        const payload = {
          name: name,
        };
        const jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN");
        response.send({ jwt_token : jwtToken });
      } else {
        response.status(400);
        response.json({error_msg : "Invalid Password"});
      }
    }
  });