import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    
    if (token && token.startsWith('Bearer ')) {
      token = token.split(' ')[1]; // Extract token text
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = { id: decoded.id };
      return next();
    }
    
    return res.status(401).json({ message: 'Authorization rejected, missing token' });
  } catch (error) {
    return res.status(401).json({ message: 'Token is invalid or expired' });
  }
};
