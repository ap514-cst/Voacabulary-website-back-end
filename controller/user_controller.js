const userModel = require("../model/userModel");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
    try {
        const { name, email, number, password} = req.body;

        // check field
        if (!name || !email || !number || !password ) {
            return res.status(400).json({ 
                success: false,
                message: "fill all field" 
            });
        }

       

        
        if (password.length < 6) {
            return res.status(400).json({ 
                success: false,
                message: "password most be up 6 " 
            });
        }

        // check exist user
        const userExist = await userModel.findOne({ email });
        if (userExist) {
            return res.status(400).json({ 
                success: false,
                message: "already exist" 
            });
        }

        // check number
        const phoneExist = await userModel.findOne({ number });
        if (phoneExist) {
            return res.status(400).json({ 
                success: false,
                message: " already exist" 
            });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // new user
        const user = new userModel({
            name,
            email,
            number,
            password: hashedPassword
            
        });

        
        const newUser = await user.save();

        res.status(201).json({ 
            success: true,
            message: "succesfull",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                number: newUser.number
            }
        });

    } catch (error) {
        console.log("Registration Error:", error.message);
          if (error.code === 11000) {
            return res.status(400).json({ 
                success: false,
                message: " already exist" 
            });
        }
        
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                success: false,
                message: error.message 
            });
        }
        res.status(500).json("internal sever is down ")
    }
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

       
        const user = await userModel.findOne({ email });
        
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: "wrong user" 
            });
        }

        // matching password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false,
                message: "email ar password wrong" 
            });
        }

        
        user.lastLogin = new Date();
        await user.save();

        
        res.status(200).json({ 
            success: true,
            message: "susscufull",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                number: user.number,
                role: user.role
            }
        });

    } catch (error) {
        console.log("Login Error:", error.message);
        res.status(500).json({ 
            success: false,
            message: "server error" 
        });
    }
};

module.exports = { registerUser, loginUser };

