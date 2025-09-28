
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { signUp, signIn, verifyUserEmail, allUsers, saveUserActivityLog, allUserslogs, activityReports, updateUser } = require('../services/userService');
const { createJwtToken, createTokenUser } = require('../utils');
const getAllUsers = async (req, res) => {
    try {
        const result = await allUsers(req);
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
 const getAllUserActivityReport = async(req,res) =>{
    try{
        const result = await activityReports(req);
        if (result.status == 200) {
            res.status(StatusCodes.OK).json({ message: result.message, data: result.data });
        } else {
            res.status(StatusCodes.NOT_FOUND).json({ data: result.data });
        }

    } catch(error ){
        return error
    }
 }
 const update = async (req, res) =>{
    const result = await updateUser( req )
    if ( result.status == 400 ){
        throw new CustomError.BadRequestError( result.message );
    } else if (result.status == 401 ){
        throw new CustomError.UnauthenticatedError( result.message );
    }else if(result.status == 404){
        throw new CustomError.NotFoundError( result.message );
    }else{
        let activityLog = await saveUserActivityLog(result.data.id, 'update', req)
        res.status(StatusCodes.OK).json({ message:'Update successful', user: result.data});
    }
}


module.exports = {
    update,
    getAllUsers,
    getAllUsersLogs,
    getAllUserActivityReport
};
