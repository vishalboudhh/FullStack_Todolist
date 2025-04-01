import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import bcrypt from 'bcrypt';

export const register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All filed are required!"
            })
        }

        //Finding user already registered with this email
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "This email is already in the database use another email",
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullName,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            success: true,
            message: 'Account created successfull'
        })
    } catch (error) {
        console.log(`Erron in register user controller`, error);
    }
};

export const login = async (req, res) => {
    try {

        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All filed are required!"
            });
        };

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'user is not found in database register first'
            });
        };

        const isPassword = await bcrypt.compare(password, user.password);
        if (!isPassword) {
            return res.status(404).json({
                success: false,
                message: "Please enter the correct password",
            });
        };

        const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });


        return res
            .status(200)
            .cookie("token", token, { httpOnly: true, sameSite: "strict", maxAge: 24 * 60 * 60 * 1000 })
            .json({
                success: true,
                message: `${user.fullName} account is successfully loggedin`
            });
    } catch (error) {
        console.log(`Error in login user controller`, error);

    }
};

export const logout = async (req,res) =>{
    try {
        
        return res.status(200).cookie("token","",{maxAge:0}).json({
            success:true,
            message:`user logout successfully`
        });
    } catch (error) {
        console.log(`Error in logout user controller`,error);
        
    }
};

export const getCurrentUser = async (req, res) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Not authenticated",
        });
      }
      // Verify and decode token
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const user = await User.findById(decoded.userId).select("-password");
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error("Error fetching current user:", error);
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  };
