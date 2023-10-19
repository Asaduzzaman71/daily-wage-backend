
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { signUp, signIn, verifyUserEmail, allUsers, saveUserActivityLog } = require('../services/userService');
const { createJwtToken, createTokenUser } = require('../utils');
const getAllUsers = async (req, res) => {
    try {
        const result = await allUsers();
        if (result.status == 200) {
            res.status(StatusCodes.OK).json({ message: result.message, data: result.data });
        } else {
            res.status(StatusCodes.NOT_FOUND).json({ data: result.data });
        }
    } catch (error) {
        return error
    }
};
const getAllUsersLogs = async (req, res) => {
    try {
        const result = await allUserslogs(req);
        if (result.status == 200) {
            res.status(StatusCodes.OK).json({ message: result.message, data: result.data });
        } else {
            res.status(StatusCodes.NOT_FOUND).json({ data: result.data });
        }
    } catch (error) {
        return error
    }
};
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
    await saveUserActivityLog(req.body.userId, 'logout', req)
    res.status(StatusCodes.OK).json({ msg: 'logged out succfull!' });
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
    verifyEmail,
    getAllUsers,
    getAllUsersLogs
};
