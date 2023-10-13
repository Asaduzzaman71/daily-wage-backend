const jwt = require('jsonwebtoken')

const createSignedToken = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};

const isTokenValid = ({ token }) =>{
  return jwt.verify(token, process.env.JWT_SECRET)
};

const createJwtToken = ({ user }) => {
  const token = createSignedToken({ payload: user });
  return token
};

module.exports = {
  createSignedToken,
  isTokenValid,
  createJwtToken,
};
