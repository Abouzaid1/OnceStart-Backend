var bcrypt = require('bcryptjs');
const User = require('../model/user.model');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'jwt_secret_key';
//Login
const login = async (req, res) => {
    const userData = req.body;
    console.log(userData);

    try {
        // Check if the username exists
        const existingUser = await User.findOne({ username: userData.username });
        console.log(existingUser);

        // If user does not exist, return an error
        if (!existingUser) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Compare the provided password with the stored password hash
        const isMatch = await bcrypt.compare(userData.password, existingUser.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: existingUser._id }, JWT_SECRET);

        // Return success response with token
        return res.status(200).json({
            message: 'Logged in successfully',
            user: {
                username: existingUser.username,
                photo: existingUser.photo,
                email: existingUser.email,
                token: token
            },
            token: token
        });

    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Internal server error" });
    }
}
//SignUp
const signUp = async (req, res) => {
    const userData = req.body
    const file = req.file
    console.log(userData);
    console.log(file);
    try {
        if (userData.username && userData.password && userData.email) {
            const existingUserByUsername = await User.findOne({ username: userData.username })
            const existingUserByEmail = await User.findOne({ email: userData.email })
            if (existingUserByUsername || existingUserByEmail) {
                return res.status(400).json({ message: 'Username already exists' });
            }
            bcrypt.hash(userData.password, 10, async (err, hash) => {
                if (err) {
                    return res.status(500).json({ message: 'Error hashing password' });
                }

                const hashedPassword = hash;
                const newUser = new User({ ...userData, password: hashedPassword, photo: req.file ? req.file.filename : null });

                try {
                    await newUser.save();
                    return res.status(201).json({ message: 'You are signed up successfully' });
                } catch (saveError) {
                    return res.status(500).json({ message: 'Error saving user' });
                }
            });
        } else {
            return res.status(400).json({ message: 'Data must be filled' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Failed to sign up' });
    }
}


module.exports = {
    login,
    signUp,
}