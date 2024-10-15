const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',      // Change this if your MySQL server is on a different host
  user: 'root',  // Your MySQL username
  password: '1234', // Your MySQL password
  database: 'machinetest' // Your MySQL database name
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database.');
});

// Endpoint to handle form submission (POST request)
app.post('/', (req, res) => {
  const formData = req.body;

  // Log the form data to the console
  console.log('Form Data:', formData);

  // Insert data into the cv table
  const { personalInfo, workExperience, education, skills } = formData;

  const cvQuery = 'INSERT INTO cv (name, email, phone, summary) VALUES (?, ?, ?, ?)';
  db.query(cvQuery, [personalInfo.name, personalInfo.email, personalInfo.phone, personalInfo.summary], (error, results) => {
    if (error) {
      console.error('Error inserting CV data: ', error);
      return res.status(500).send({
        success: false,
        message: 'Error inserting CV data',
      });
    }

    const cvId = results.insertId; // Get the inserted CV ID

    // Insert work experience data
    workExperience.forEach(work => {
      const workQuery = 'INSERT INTO work_experience (cv_id, job_title, company, years) VALUES (?, ?, ?, ?)';
      db.query(workQuery, [cvId, work.jobTitle, work.company, work.years], (err) => {
        if (err) {
          console.error('Error inserting work experience data: ', err);
        }
      });
    });

    // Insert education data
    education.forEach(edu => {
      const eduQuery = 'INSERT INTO education (cv_id, degree, institution, years) VALUES (?, ?, ?, ?)';
      db.query(eduQuery, [cvId, edu.degree, edu.institution, edu.years], (err) => {
        if (err) {
          console.error('Error inserting education data: ', err);
        }
      });
    });

    // Insert skills data
    skills.forEach(skill => {
      const skillQuery = 'INSERT INTO skills (cv_id, skill) VALUES (?, ?)';
      db.query(skillQuery, [cvId, skill.skill], (err) => {
        if (err) {
          console.error('Error inserting skill data: ', err);
        }
      });
    });

    // Send a response back to the client
    res.status(200).send({
      success: true,
      message: 'Form data received and stored successfully!',
      data: formData
    });
  });
});

// Endpoint to fetch paginated CV data
app.get('/cv', (req, res) => {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
    const offset = (page - 1) * limit;
  
    // Query to get paginated CV data
    const cvQuery = `
      SELECT cv.id, 
             cv.name, 
             cv.email, 
             cv.phone, 
             cv.summary, 
             cv.date_added,  -- Include date_added here
             we.job_title, 
             we.company, 
             we.years AS work_years,
             e.degree, 
             e.institution, 
             e.years AS education_years,
             s.skill
      FROM cv
      LEFT JOIN work_experience we ON cv.id = we.cv_id
      LEFT JOIN education e ON cv.id = e.cv_id
      LEFT JOIN skills s ON cv.id = s.cv_id
      LIMIT ? OFFSET ?;`;
  
    db.query(cvQuery, [limit, offset], (error, results) => {
      if (error) {
        console.error('Error fetching CV data: ', error);
        return res.status(500).send({
          success: false,
          message: 'Error fetching CV data',
        });
      }
  
      // Process results to format as objects in arrays
      const formattedResults = results.reduce((acc, row) => {
        const existingCV = acc.find(cv => cv.id === row.id);
        
        if (!existingCV) {
          // Create a new CV object if it doesn't exist
          acc.push({
            id: row.id,
            name: row.name,
            email: row.email,
            phone: row.phone,
            summary: row.summary,
            date_added: row.date_added,  // Add date_added here
            work_experience: [],
            education: [],
            skills: []
          });
        }
        
        // Add work experience if available
        if (row.job_title) {
          acc.find(cv => cv.id === row.id).work_experience.push({
            job_title: row.job_title,
            company: row.company,
            years: row.work_years
          });
        }
  
        // Add education if available
        if (row.degree) {
          acc.find(cv => cv.id === row.id).education.push({
            degree: row.degree,
            institution: row.institution,
            years: row.education_years
          });
        }
  
        // Add skills if available
        if (row.skill) {
          acc.find(cv => cv.id === row.id).skills.push(row.skill);
        }
  
        return acc;
      }, []);
  
      // Send the formatted data back to the client
      res.status(200).send({
        success: true,
        message: 'CV data fetched successfully!',
        data: formattedResults,
        page: page,
        limit: limit,
      });
    });
  });
  
  

  

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
