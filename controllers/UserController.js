
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { signUp, signIn, verifyUserEmail } = require('../services/userService');
const { createJwtToken, createTokenUser } = require('../utils');

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
        const tokenUser = createTokenUser( result.data );
        const token = createJwtToken({ user: tokenUser });
        res.status(StatusCodes.OK).json({ message:'Login successful', access_token: token });
    }
};
const logout = async (req, res) => {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now() + 1000),
    });
    res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};
const verifyEmail = async ( req, res ) => {
    const result = await verifyUserEmail( req );
    if( result.status == 200 ){
        res.status(StatusCodes.OK).json( result );
    }else{
        throw new CustomError.BadRequestError(result.message);
    }
}

module.exports = {
    register,
    login,
    logout,
    verifyEmail
};
