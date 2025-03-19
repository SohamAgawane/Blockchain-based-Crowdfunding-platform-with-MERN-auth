const Joi = require("joi");
const jwt = require('jsonwebtoken');

const signupValidation = (req, res, next) =>{
    const schema = Joi.object({
        name:Joi.string().min(3).max(100).required(),
        email:Joi.string().email().required(),
        password:Joi.string().min(4).max(50).required()
    });

    const {error} = schema.validate(req.body);
    if(error)
    {
        return res.status(400).json({message:"Bad request", error});
    }

    next();
}

const loginValidation = (req, res, next) =>{
    const schema = Joi.object({
        email:Joi.string().email().required(),
        password:Joi.string().min(4).max(50).required()
    });

    const {error} = schema.validate(req.body);
    if(error)
    {
        return res.status(400).json({message:"Bad request", error});
    }

    next();
}

const authenticate = (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1]; // Extract token after 'Bearer'
  
      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }
  
      // Verify the token (replace "your-secret-key" with your actual key)
      const user = jwt.verify(token, "your-secret-key");
      req.user = user; // Attach user data to request object
  
      next(); // Proceed to the next middleware/controller
    } catch (error) {
      res.status(403).json({ message: "Invalid or expired token" });
    }
  };
  
  
module.exports = {
    signupValidation,
    loginValidation,
    authenticate
}