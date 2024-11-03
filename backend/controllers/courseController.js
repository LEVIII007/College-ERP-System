const connectDB = require("../utils/db");

exports.getAllCourses = async (req, res) => {
    let client;
    try {
        client = await connectDB(); // Establish the connection
        const { rows: courses } = await client.query('SELECT * FROM course');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (client) client.release(); // Release the client back to the pool
    }
};

exports.getCourseById = async (req, res) => {
    let client;
    try {
        client = await connectDB(); // Establish the connection
        const { rows: course } = await client.query('SELECT * FROM course WHERE id = $1', [req.params.id]);
        if (course.length === 0) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.json(course[0]); // Return the first course object
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (client) client.release(); // Release the client back to the pool
    }
};

exports.createCourse = async (req, res) => {
    let client;
    try {
        client = await connectDB(); // Establish the connection

        const { name } = req.body; // Assuming name is the only required field
        const { rows } = await client.query('INSERT INTO course (name) VALUES ($1) RETURNING id', [name]);
        
        res.status(201).json({
            message: "Course created successfully",
            courseId: rows[0].id, // Return the ID of the created course
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    } finally {
        if (client) client.release(); // Release the client back to the pool
    }
};

exports.updateCourse = async (req, res) => {
    let client;
    try {
        client = await connectDB(); // Establish the connection

        const { name } = req.body; // Assuming name is the only field being updated
        const { rowCount } = await client.query('UPDATE course SET name = $1 WHERE id = $2', [name, req.params.id]);
        
        if (rowCount === 0) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.json({
            message: "Course details updated!"
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    } finally {
        if (client) client.release(); // Release the client back to the pool
    }
};

exports.deleteCourse = async (req, res) => {
    let client;
    try {
        client = await connectDB(); // Establish the connection

        const { rowCount } = await client.query('DELETE FROM course WHERE id = $1', [req.params.id]);

        if (rowCount === 0) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.json({ message: "Course deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (client) client.release(); // Release the client back to the pool
    }
};
