import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE||'7d',
    });
}

//@route   POST /api/auth/register
//@desc    Register a new user
//@access  Public
export const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                error: 
                userExists.email===email ? 'Email already in use' : 'Username already in use',
                statusCode:400
            });
        }
        const user = await User.create({ username, email, password });
        const token = generateToken(user._id);
        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    profileImage: user.profileImage,
                    createdAt: user.createdAt
                },
                token
            },
            message: 'User registered successfully'
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                error: 'Invalid user data'
            });
        }
    } catch (err) {
        next(err);
    }
};

//@route   POST /api/auth/login
//@desc    Login user and return JWT token
//@access  Public
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Please provide email and password',
                statusCode:400
            });
        }
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password',
                statusCode:401
            });
        }
        const isMatched = await user.matchPassword(password);
        if (!isMatched) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password',
                statusCode:401
            });
        }

        const token = generateToken(user._id);
        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    username: user.username,    
                    email: user.email,
                    profileImage: user.profileImage,
                },
                token
            },
            message: 'Logged in successfully'
        });
    } catch (err) {
        next(err);
    }
};      

//@route   GET /api/auth/profile
//@desc    Get user profile
//@access  Private
export const getProfile = async (req, res, next) => {
    try {
        const user=await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            },
        });
    } catch (err) {
        next(err);
    }   
};
//@route   PUT /api/auth/profile
//@desc    Update user profile
//@access  Private  
export const updateProfile = async (req, res, next) => {
    try {
        const { username, email, profileImage } = req.body;
        const user = await User.findById(req.user.id);
        if(username) user.username = username;
        if(email) user.email = email;
        if(profileImage) user.profileImage = profileImage;
        await user.save();
        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
            },
            message: 'Profile updated successfully'
        });
    } catch (err) {
        next(err);
    }};

//@route   PUT /api/auth/change-password
//@desc    Change user password
//@access  Private
export const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                error: 'Please provide current and new password',
                statusCode:400
            });
        }
        const user = await User.findById(req.user.id).select('+password');

        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Current password is incorrect',
                statusCode:401
            });
        }
        user.password = newPassword;
        await user.save();
        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (err) {
        next(err);
    }
};