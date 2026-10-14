
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors());
app.use(express.json());

// Connect to Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Student Management System Backend is running!"
  });
});

// Get all students from Supabase
app.get("/api/students", async (req, res) => {
  try {
    
/* Add a new student */
app.post("/api/students", async (req, res) => {
  try {
    const {
      roll_number,
      first_name,
      middle_name,
      last_name,
      department,
      email,
      mobile_number,
      semester,
      division,
      cgpa
    } = req.body;

    // Validate required fields
    if (!roll_number || !first_name || !last_name || !department) {
      return res.status(400).json({
        success: false,
        message: "Roll number, first name, last name and department are required."
      });
    }

    // Insert student into Supabase
    const { data, error } = await supabase
      .from("students")
      .insert([{
        roll_number,
        first_name,
        middle_name: middle_name || null,
        last_name,
        department,
        email: email || null,
        mobile_number: mobile_number || null,
        semester: semester ?? null,
        division: division || null,
        cgpa: cgpa ?? null
      }])
      .select()
      .single();

    if (error) {
      console.error("Insert student error:", error.message);

      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(201).json({
      success: true,
      message: "Student added successfully!",
      student: data
    });
  } catch (error) {
    console.error("Server error:", error.message);

    res.status(500).json({
      success: false,
      message: "Internal server error."
    });
  }
});

    const { data, error } = await supabase
      .from("students")
      .select("*")
      .order("student_id", { ascending: true });

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      count: data.length,
      students: data
    });
  } catch (error) {
    console.error("Fetch students error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch student records."
    });
  }
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
