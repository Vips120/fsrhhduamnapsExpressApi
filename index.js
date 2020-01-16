let express = require("express");
let app = express();
let morgan = require("morgan");
let port = process.env.PORT || 4800;
let Joi = require("@hapi/joi");
let config = require("config");
let U = require("./middleware/index");
// console.log(app);
app.use(express.json()); //in built-middleware

// app.use(express.static("public"));
// app.use(express.urlencoded());
// app.use(U);
app.use(morgan("tiny"));
console.log(`Default mode: ${app.get('env')}`);
console.log(`mode: ${process.env.NODE_ENV}`);

console.log(`app name: ${config.get("name")}`);
console.log(`mode: ${config.get("email")}`);
console.log(`password: ${config.get("password")}`);



let courses = [{ id: 1, name: "Angular" },
{ id: 2, name: "Rxjs" },
 { id: 3, name: "react native" },
    { id: 4, name: " Javascripit " }
];

//fetch all data
app.get("/api/courses", (req, res) => {
    // res.send("hello user");
    res.send(courses);
});

//fetch data by id
app.get("/api/course/:id", (req, res) => {
    // let id = req.params.id;
    // res.send(id);
    let course = courses.find(item => item.id === parseInt(req.params.id));
    if (!course) { return res.status(404).send({ message: "Invalid course id" }) };
    let { id, name } = course;
    res.send(name);
});


//create a new course

app.post("/api/course/newcourse", (req, res) => {
    let { error } = ValidationError(req.body);
    // console.log(result);
    if(error) {return res.send(error.details[0].message)}

    let course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(courses);
});

//DRY
//update a course

app.put("/api/course/updatecourse/:id", (req, res) => {
    // id
    let course = courses.find(item => item.id === parseInt(req.params.id));
    if (!course) { return res.status(404).send({ message: "Invalid course id" }) };
    //joi
   
    let { error } = ValidationError(req.body);
    // console.log(result);
    if (error) { return res.send(error.details[0].message) }
    //save
    course.name = req.body.name;
    res.send(courses);
});

//REMOVE COURSE
app.delete("/api/course/removecourse/:id", (req, res) => {
      // id
      let course = courses.find(item => item.id === parseInt(req.params.id));
    if (!course) { return res.status(404).send({ message: "Invalid course id" }) };
    let index = courses.indexOf(course); // 2
    courses.splice(index, 1);
    res.send({message: "Removed the data", c: courses});
})

function ValidationError(error) {
    let Schema = Joi.object({
        name: Joi.string().min(4).max(100).alphanum().required()
    });
    return Schema.validate(error);
}




app.listen(port, () => {console.log(`port working on ${port}`)})