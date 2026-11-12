const express = require("express");

const app = express();

const router = express.Router();

app.use(express.json());

let students = [
    {
        id: 1, name: "john", className: "jss1", course: "node.js"
    },
    {
        id: 2, name: "mary", className: "jss2", course: "express.js"
    },
    {
        id: 7, name: "lekan", className: "jss1", course: "JavaScripts"
    }
]

app.get("/students", (req, res) => {
    res.json(students)
});

app
.post("/students", (req, res)=>{

    let newStudent = req.body;


    if(!newStudent.name || !newStudent.course || !newStudent.className){
        return res.status(400).json({
            success: false,
            message: `all entry is required`
        });
    }


    // checking if student already exist

     if(students.some(s => s.name.trim().toLowerCase() === newStudent.name.trim().toLowerCase())){
        return res.status(409).json({
            success: false,
            message: `student already exist`
        });
    }

    // generating next id

    const newId = Math.max(...students.map(s => s.id))+1;

    newStudent.id = newId;

    // Object.assign(students.id += 1);
students.push(newStudent)
    res.json({
        message: "student successfullly registered",
        newStudent,
        students
    });
});



app.patch("/students/:id", (req, res) => {
    console.log("Patch has been hit.............")
    const studentId = parseInt(req.params.id);

    // Find student to edit
    const student = students.find(s => s.id === studentId);

    if (!student) {
        return res.status(404).json({
            success: false,
            message: "Student not found"
        });
    }

    // Check for duplicate name
    if (req.body.name && students.some(s =>
        s.id !== studentId &&
        s.name.trim().toLowerCase() === req.body.name.trim().toLowerCase()
    )) {
        return res.status(409).json({
            success: false,
            message: "Student name already exists"
        });
    }

    // Update student
    if (req.body.name !== undefined){
        student.name = req.body.name;
    }
    if (req.body.course !== undefined){
        student.course = req.body.course;
    }
    if (req.body.className !== undefined){
        student.className = req.body.className;
    }
    console.log()
    res.json({
    
        success: true,
        message: `${student.name} updated successfully`,
        student,
        students
    });
});



app.delete("/students/:id", (req, res) => {
    const studentId = parseInt(req.params.id);

    const student = students.find(s => s.id === studentId)

    if(!student){
       return res.status(404).json({success: false, message: `student to delete not found`})
    }

    students = students.filter(s => s.id !== studentId)

     res.json({
        success: true,
        message: `${student.name} deleted succesfully`,
        student,
        students
    });

});


app.listen(5000, () => {
    console.log("server is running on port 5000");
});