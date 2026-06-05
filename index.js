import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";
import env from "dotenv";
const app = express();
const port = 3000;

app.listen(port,(req,res)=>{
     console.log("app is running");
});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

env.config();

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});
db.connect();

const saltround = 10;
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.get("/register", (req,res)=>{
     res.render("register.ejs")
});

app.get("/login", (req,res)=>{
     res.render("login.ejs")
});

app.get("/logout",(req,res)=>{
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});



app.post("/register", async(req,res)=>{
    try {
        const email = req.body.email;
const password = req.body.password;
console.log(email);
console.log(password);
bcrypt.hash(password , saltround , async(err,hash)=>{
        await db.query("INSERT INTO users (email,password) VALUES ($1,$2)" , 
[ email , hash])
      });
console.log("done");
res.send("completed");
    } catch (error) {
        console.log(error);
    }
});

app.get("/dashboard",async(req,res)=>{
    let user_id = req.user.id;
    console.log()
    let result = await db.query("SELECT * FROM meals WHERE user_id = $1" ,[user_id]);
    let M = result.rows;
    res.render("dashboard.ejs" , {meals:M});
})

app.post("/login",
    passport.authenticate("local", {
  successRedirect: '/dashboard',
  failureRedirect: '/login'
}));

passport.use( "local", 
    new Strategy( async function verify(username, password, cb){
    try {
        console.log("sttart");
          const result  = await db.query("SELECT * FROM users WHERE email = $1",[username]);
         if (result.rows.length>0) {
            let user = result.rows[0];
            let ogpassword = user.password;
            bcrypt.compare(password , ogpassword , (err, valid)=>{
                if (valid) {
                    return cb(null, user);
                                } else {
                     return cb(null, false);
                } 
            }) ;
         } else {
             console.log("the user is not in our database")
                                  return cb(null, false);

         }
        } catch (error) {
      return cb(error); // Error handling
    }
  }
));

passport.serializeUser((user,cb)=>{
        console.log(user);
    return cb(null , user.id)
})

passport.deserializeUser( async (id,cb)=>{
   const result =  await db.query("SELECT * FROM users WHERE id = $1",[id]);
   let user = result.rows[0]
    return cb(null, user);
});

app.get("/meals/:id", async(req,res)=>{
       let id = req.params.id;
      console.log(id);
       let result = await db.query("SELECT * FROM meals WHERE id = $1" , [id]);
       let result2 = await db.query("SELECT * FROM symptoms WHERE meal_id = $1" , [id]);
       let ress = result.rows[0];
       let ress2 = result2.rows;
       console.log(ress);
       console.log(ress2)
        res.render("symptoms.ejs", {name: ress.notes , symptoms: ress2  ,meal_id: id} )
});


app.post("/add-meal" , async(req,res)=>{
    console.log(req.session);
    let user_id = req.user.id;
   let type = req.body.type;
   let rate = req.body.rate;
   let date = req.body.date;
   let note = req.body.notes;
   await db.query("INSERT INTO meals(user_id ,meal_type, meal_date,rating,notes) VALUES($1,$2,$3,$4,$5)" , [user_id ,type,date,rate,note]);
   console.log("done added");
   res.redirect("/dashboard");
});

app.post("/meals/:id/Symptoms" , async(req,res)=>{
    let meal_id = req.params.id
    let symp = req.body.add;
let user = req.user.id;
await db.query("INSERT INTO symptoms (meal_id ,symptoms) VALUES ($1 , $2) ",[meal_id , symp]);  
res.redirect("/dashboard");
});

app.get("/meals" , async(req,res)=>{
       let user_id = req.user.id;
       let result = await db.query("SELECT * FROM meals WHERE user_id = $1" , [user_id]);
       let list = result.rows;
       console.log(list)
       res.render("meals.ejs", {meals:list});
});

app.get("/symptoms", async(req,res)=>{
      let user_id = req.user.id;
       let result = await db.query(`SELECT 
         meals.id,
         meals.notes,
         symptoms.id ,
         symptoms.symptoms 
       FROM meals
       LEFT JOIN symptoms
       ON meals.id = symptoms.meal_id
       WHERE meals.user_id = $1` , [user_id]);
       let list = result.rows;
       console.log(list)
       res.render("list.ejs", {list:list});
});



