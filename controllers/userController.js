const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password,roleArn} = req.body;
    const user = new User({ username, email, password,roleArn  });
    await user.save();
    res.status(201).json({ message: 'User created successfully', userId: user._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Log in a user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id,roleArn:user.roleArn,email:user.email,username:user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get user profile
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateUser= async (req,res)=>{
  console.log("In update");
  
  try {
    // Get user from the JWT token (extracted in verifyToken middleware)
    const userId = req.user.userId;

    // Get updated profile data from the request body
    const updatedProfile = req.body;

    // Find the user in the database and update the profile
    const user = await User.findById(userId);
    console.log("abc");
    
    if (!user) {
      console.log("no user");
      
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log("abc2");
    // Update the user's profile with the new data
    Object.assign(user, updatedProfile);
    
    console.log("abc3");
    // Save the updated user data
    await user.save();

    // Respond with updated user data
    res.status(200).json(user);
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ message: 'Server error. Failed to update profile.' });
  }
}