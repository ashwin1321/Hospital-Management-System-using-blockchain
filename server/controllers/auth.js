// controller for logging in
// otp for login
// logout

const { connectDb, client } = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.loginController = async (req, res) => {
    res.send("login");
}

exports.registerController = async (req, res) => {

    const role = req.body.role;

    try {

        if (role === "doctor") {
            const { name, email, did } = req.body;
            const password = "123abc";

            const hashedPassword = await bcrypt.hash(password, 10);

            if (!name || !email || !did) {
                return res.status(400).json({ error: "Please fill all the fields" });
            }

            const query = `SELECT * FROM doctors WHERE email = $1`;
            const values = [email];

            const result = await client.query(query, values);

            if (result.rows.length > 0) {
                return res.status(400).json({ userExists: "Email already exists" });
            }
            else {

                const query = `INSERT INTO doctors (name, email, password, role, did) VALUES ($1, $2, $3, $4, $5)`;
                const values = [name, email, hashedPassword, role, did];

                const result = await client.query(query, values)
                res.status(200).json({ message: "Doctor registered successfully" });
            }



        }

        if (role === "lab") {
            const { name, email, lid } = req.body;
            const password = "123abc";

            const hashedPassword = await bcrypt.hash(password, 10);

            const query = `SELECT * FROM lab WHERE email = $1`;
            const values = [email];

            const result = await client.query(query, values);

            if (result.rows.length > 0) {
                return res.status(400).json({ userExists: "Email already exists" });
            }
            else {
                const query = `INSERT INTO lab (name, email, password, role, lid) VALUES ($1, $2, $3, $4, $5)`;
                const values = [name, email, hashedPassword, role, lid];

                const result = await client.query(query, values)
                res.status(200).json({ message: "Lab Assistant registered successfully" });
            }
        }

        if (role === "patient") {
            const { name, email, citizenship, age, password, pid } = req.body; // generate pid from frontend 

            const hashedPassword = await bcrypt.hash(password, 10);

            const query = `SELECT * FROM patients WHERE citizenship = $1`;
            const values = [citizenship];
            const result = await client.query(query, values);

            if (result.rows.length > 0) {
                return res.status(400).json({ userExists: "user already exists" });
            }
            else {
                const query = `INSERT INTO patients (name, email, citizenship, age, password, role, pid) VALUES ($1, $2, $3, $4, $5, $6, $7)`;
                const values = [name, email, citizenship, age, hashedPassword, role, pid];

                const result = client.query(query, values);
                res.status(200).json({ message: "Patient registered successfully" });
            }
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });

    }


}

exports.logoutController = async (req, res) => { }

