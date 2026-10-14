require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors());
app.use(express.json());

// Identify and read Supabase environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_KEY ||
  process.env.SUPABASE_ANON_KEY;

// Safe startup validation: report missing variables without exposing secret values
const missingEnvVars = [];
if (!supabaseUrl) {
  missingEnvVars.push("SUPABASE_URL");
}
if (!supabaseKey) {
  missingEnvVars.push("SUPABASE_SECRET_KEY");
}

if (missingEnvVars.length > 0) {
  console.error("==================================================================");
  console.error("❌ CRITICAL CONFIGURATION ERROR: Missing Supabase Environment Variables!");
  console.error(`   The following required variable(s) are missing: ${missingEnvVars.join(", ")}`);
  console.error("   If deploying on Render, configure them in Render Dashboard -> Environment.");
  console.error("   Expected: SUPABASE_URL and SUPABASE_SECRET_KEY");
  console.error("==================================================================");
} else {
  console.log("✅ Supabase environment variables detected successfully.");
}

// Connect to Supabase safely without throwing unhandled exceptions at startup
const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Student Management System Backend is running!",
    supabaseConfigured: Boolean(supabase)
  });
});

// Get all students from Supabase
app.get("/api/students", async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({
        success: false,
        message: "Supabase client is not initialized. Please ensure SUPABASE_URL and SUPABASE_SECRET_KEY are set in Render environment variables."
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

// Add a new student
app.post("/api/students", async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({
        success: false,
        message: "Supabase client is not initialized. Please ensure SUPABASE_URL and SUPABASE_SECRET_KEY are set in Render environment variables."
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

// Start server using process.env.PORT or default to 5000
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
  });
}

module.exports = app;
