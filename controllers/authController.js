const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const bcrypt = require('bcrypt');
const { createJwtToken, createTokenUser } = require('../utils');
const { signUp, signIn, saveUserActivityLog} = require('../services/userService');
const register = async (req, res) => {
    let result = await signUp(req);
    if(result.status == 400){
        throw new CustomError.BadRequestError(result.message);
    }
    res.status(StatusCodes.CREATED).json({ message:'Registration successful', user: result.data });
};
const login = async (req, res) => {
    const result = await signIn( req )
    if ( result.status == 400 ){
        throw new CustomError.BadRequestError( result.message );
    } else if (result.status == 401 ){
        throw new CustomError.UnauthenticatedError( result.message );
    }else{
        const user = createTokenUser( result.data );
        console.log('USER', user)
        const token = createJwtToken({ user: user });
        let activityLog = await saveUserActivityLog(user.id, 'login', req)
        res.status(StatusCodes.OK).json({ message:'Login successful', access_token: token , user: user});
    }
};
const logout = async (req, res) => {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now() + 1000),
    });
    res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};

module.exports = {
    register,
    login,
    logout,
};
