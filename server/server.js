const mysql = require('mysql2');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const bodyParser=require('body-parser');
const session = require('express-session');

const db = require('./db');
const app = express();
const port = 6969;
const salt = 10;
let sessionUser={};

app.use(express.json())
app.use(cors());
app.use(cors({
    origin:["http://localhost:6969"],
    methods:["GET","POST"],
    credentials:true,
}));//for sessions
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
    key:"userId",
    secret:"MiaKhalifa",
    resave:false,
    saveUninitialized:false,
    cookie:{
        expires:60*60*24,
        },
    })
);


//user registration
app.post("/api/register",(req,res)=>{
    console.log(req.body);
    const {name,password,address,gender,email,contact} = req.body;
    res.send(req.body);
    bcrypt.hash(password,salt,(err,hash)=>{
        const insert = "INSERT INTO  users(name,password,address,gender,email,contact) VALUES (?,?,?,?,?,?)";
        db.query(insert,[name,hash,address,gender,email,contact],(err)=>
        {
            if(err) console.log("hi");
        })
    })
    
})

//user login
app.post("/api/login",(req,res)=>{
    console.log(req.body);
    const {name,password} = req.body;
    const login = `SELECT * FROM users WHERE name='${name}'`;
    db.query(login, (err, result) => {
    if (err) {
        console.log(err);
    }
    else {
        if(result.length>0) {
             
            req.session.user=result;
            console.log("---",req.session.user);
            bcrypt.compare(password,result[0].password,(err,test)=>{
                if(test) {
                    
                    sessionUser=req.session.user;
                    res.send(sessionUser);
                   
                }
                else {res.send({"result":"Wrong Password"});}
            })
        }
        else {res.send({"result":"Wrong Username"})}
    }
    });
});


//admin login
app.post("/api/admin/login",(req,res)=>{
    console.log(req.body);
    const {name,password} = req.body;
    const login = `SELECT * FROM admin WHERE name='${name}'`;
    db.query(login, (err, result) => {
    if (err) {
        console.log(err);
    }
    else {
        if(result.length>0) {
            req.session.user=result;
            if(password==result[0].password){
                sessionUser=req.session.user;
                console.log(sessionUser)
                res.send(sessionUser);
            }
            else {res.send({"result":"Wrong Password"});}
        }
        else {res.send({"result":"Wrong Username"})}
    }
    });
});

//doctor registration
app.post("/api/DoctorRegister",(req,res)=>{
    console.log(req.body);
    const {name,password,specialisation,gender,email,contact,profile} = req.body;
    res.send(req.body);
    bcrypt.hash(password,salt,(err,hash)=>{
        const insert = "INSERT INTO  doctor(name,password,specialisation,gender,email,contact,profile) VALUES (?,?,?,?,?,?,?)";
        db.query(insert,[name,hash,specialisation,gender,email,contact,profile],(err)=>
        {
            if(err) console.log(err);
            else console.log("not here!!")
        })
    })
    
})


//get patient
app.get("/api/getPatient",(req,res)=>{
    const get = "SELECT * FROM users";
    db.query(get,(error,result)=>{
        console.log(error);
        res.send(result);
    });
});


//delete patient
app.delete("/api/remove/:id",(req,res)=>{
    const id = req.params.id;
    console.log(id);
    const remove = "DELETE FROM users WHERE id = ?";
    db.query(remove,id,(err,result)=>
    {
        if(err) console.log(err);
    })
});

//get Doctors
app.get("/api/getDoctors",(req,res)=>{
    const get = "SELECT * FROM doctor";
    db.query(get,(error,result)=>{
        console.log(error);
        res.send(result);
    });
});


//delete Doctor
app.delete("/api/removeDoctor/:id",(req,res)=>{
    const id = req.params.id;
    console.log(id);
    const remove = "DELETE FROM doctor WHERE id = ?";
    db.query(remove,id,(err,result)=>
    {
        if(err) console.log(err);
    })
});


//getPatient
app.get("/api/getPatient/:id",(req,res)=>{
    const id=req.params.id;
    console.log(id);
    const sqlGet = "SELECT * FROM users WHERE id = ?";
    db.query(sqlGet,[id],(err,result)=>{
        if(err) console.log(err);
        console.log(result);
        res.send(result);
    });
});

//updatePaient
app.put("/api/updatePatient/:id",(req,res)=>{
    const {id}=req.params;
    const {name,email,contact,address} = req.body;
    const sqlUpdate = "UPDATE users SET name=?,email=?,address=?,contact=? WHERE id = ?";
    db.query(sqlUpdate,[name,email,address,contact,id],(err,result)=>{
        if(err) console.log(err)
    res.send(result);
});
});

//getPatient
app.get("/api/getDoctor/:id",(req,res)=>{
    const id=req.params.id;
    console.log(id);
    const sqlGet = "SELECT * FROM doctor WHERE id = ?";
    db.query(sqlGet,[id],(err,result)=>{
        if(err) console.log(err);
        console.log(result);
        res.send(result);
    });
});

//updatePaient
app.put("/api/updateDoctor/:id",(req,res)=>{
    const {id}=req.params;
    const {name,email,contact,specialisation} = req.body;
    const sqlUpdate = "UPDATE doctor SET name=?,email=?,specialisation=?,contact=? WHERE id = ?";
    db.query(sqlUpdate,[name,email,specialisation,contact,id],(err,result)=>{
        if(err) console.log(err)
    res.send(result);
});
});

//appointment registration
app.post("/api/appointment",(req,res)=>{
    console.log(req.body);
    const {id,userid,name,age,gender,disease,contact,date,time} = req.body;
    res.send(req.body);
        const insert = "INSERT INTO appointment(doctorid,userid,name,age,gender,disease,contact,date,time,status) VALUES (?,?,?,?,?,?,?,?,?,?)";
        db.query(insert,[id,userid,name,age,gender,disease,contact,date,time,'Not Approved'],(err)=>
        {
            if(err) console.log(err); 
            else console.log("not here!!")
        });
    });

    //doctor login
    app.post("/api/doctorLogin",(req,res)=>{
        console.log(req.body);
        const {name,password} = req.body;
        const login = `SELECT * FROM doctor WHERE name='${name}'`;
        db.query(login, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            if(result.length>0) {
                req.session.user=result;
                console.log("---",req.session.user);
                bcrypt.compare(password,result[0].password,(err,test)=>{
                    if(test) {
                        sessionUser=req.session.user;
                        res.send(sessionUser);
                    }
                    else {res.send({"result":"Wrong Password"});}
                })
            }
            else {res.send({"result":"Wrong Username"})}
        }
        });
    });

    
    //get Appointment
    app.get('/api/getAppointment/:id',(req,res)=>{
        const id=req.params.id;
        console.log(id);
        const sqlGet = "SELECT * FROM appointment WHERE doctorid = ? ORDER BY id DESC";
        db.query(sqlGet,[id],(err,result)=>{
            if(err) {console.log(err);}
            else {console.log(result);res.send(result);}
        });
    });

     //get All Appointment
     app.get("/api/getAppointment",(req,res)=>{
        console.log("ihhi")
        const sqlGet = "SELECT * FROM appointment";
        db.query(sqlGet,(err,result)=>{
            if(err) {console.log(err);}
            else {console.log(result);res.send(result);}
        });
    });
    
    //delete Appointment
    app.delete("/api/removeAppointment/:id",(req,res)=>{
        const id = req.params.id;
        console.log(id);
        const remove = "DELETE FROM appointment WHERE id = ?";
        db.query(remove,id,(err,result)=>
        {
            if(err) console.log(err);
        })
    });

//accept appointment
    app.put("/api/acceptAppointment/:id",(req,res)=>{
        const id = req.params.id;
        console.log(id);
        const query = "UPDATE appointment SET status = 'Accepted' WHERE id = ?";
        db.query(query,[id],(err,result)=>
        {
            if(err) console.log(err);
            res.send(result);
        })
    });

    //decline appointment
    app.put("/api/declineAppointment/:id",(req,res)=>{
        const id = req.params.id;
        console.log(id);
        const query = "UPDATE appointment SET status = 'Declined' WHERE id = ?";
        db.query(query,[id],(err,result)=>
        {
            if(err) console.log(err);
            res.send(result);
        })
    });
//done appoinment
    app.put("/api/doneAppointment/:id",(req,res)=>{
        const id = req.params.id;
        console.log(id);
        const query = "UPDATE appointment SET status = 'Done' WHERE id = ?";
        db.query(query,[id],(err,result)=>
        {
            if(err) console.log(err);
            res.send(result);
        })
    });

//get appointment details
    app.get('/api/getUpdateAppointment/:id',(req,res)=>{
        const id=req.params.id;
        console.log(id);
        const sqlGet = "SELECT * FROM appointment WHERE id = ?";
        db.query(sqlGet,[id],(err,result)=>{
            if(err) {console.log(err);}
            else {console.log(result);res.send(result);}
        });
    });
    
//update appointment
    app.put("/api/getUpdateAppointment/:id",(req,res)=>{
        const {id}=req.params;
        const {date,time} = req.body;
        const sqlUpdate = "UPDATE appointment SET date=?,time=?,status = 'Updated' WHERE id = ?";
        db.query(sqlUpdate,[date,time,id],(err,result)=>{
            if(err) console.log(err)
        res.send(result);
    });
    });

//get user Appointment
    app.get('/api/userAppointment/:id',(req,res)=>{
        const userid=req.params.id;
        console.log(userid);
        const sqlGet = "SELECT * FROM appointment WHERE userid = ? ORDER BY id DESC";
        db.query(sqlGet,[userid],(err,result)=>{
            if(err) {console.log(err);}
            else {console.log(result);res.send(result);}
        });
    });


app.listen(port, () => console.log(`Server listening on port ${port}!`));