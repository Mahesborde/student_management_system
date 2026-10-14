require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors());
app.use(express.json());

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_ANON_KEY;

let supabase = null;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

// Health check endpoint
app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "Student Management System Backend is running on Vercel!"
  });
});

// Fetch students endpoint
app.get("/api/students", async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({
        success: false,
        message: "Supabase environment variables (SUPABASE_URL, SUPABASE_SECRET_KEY) are missing in Vercel settings."
      });
    }

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
      message: "Failed to fetch student records: " + error.message
    });
  }
});

// Add new student endpoint
app.post("/api/students", async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({
        success: false,
        message: "Supabase environment variables (SUPABASE_URL, SUPABASE_SECRET_KEY) are missing in Vercel settings."
      });
    }

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

    if (!roll_number || !first_name || !last_name || !department) {
      return res.status(400).json({
        success: false,
        message: "Roll number, first name, last name, and department are required."
      });
    }

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

module.exports = app;
