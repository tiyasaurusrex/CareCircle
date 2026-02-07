import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const registerUser = async (req, res) => {
try {
const { email, password } = req.body;
const hashedPassword = await bcrypt.hash(password, 10);


const user = { email, password: hashedPassword };


res.json({ success: true, data: user });
} catch (err) {
res.status(500).json({ success: false, message: "Registration failed" });
}
};


export const loginUser = async (req, res) => {
try {
const { email, password } = req.body;


const token = jwt.sign({ email }, "secret", { expiresIn: "1d" });
res.json({ success: true, data: { token } });
} catch (err) {
res.status(401).json({ success: false, message: "Login failed" });
}
};