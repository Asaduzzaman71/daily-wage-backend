// const User = require("../models/User");
// const UserVerify = require("../models/UserVerify");
// const UserActivity = require("../models/UserActivity");
const db = require('../models')
const User = db.User
const UserVerify = db.UserVerify
const UserActivity = db.UserActivity
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const bcrypt = require('bcrypt');
const { transporter } = require('../config/email');
const { Sequelize, Op } = require('sequelize');

//  Returns a random number between min (inclusive) and max (exclusive)
const randomNumber = (min, max) => {
    return Math.floor(
        Math.random() * (max - min) + min
    )
}
const getUserByEmail = async (email) => {
    const user = await User.scope('withPassword').findOne({
      where: { email : email },
      include: [{ model: UserVerify, as: 'userVerify'}]
    });
    return user;
};
const signIn = async (req) => {
    try {
        const { email, password } = req.body;
        const user = await getUserByEmail(email);
        
        if (!user) {
            return { status: 401, message: "Invalid Credentials" }
        }
        
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        
        if (!isPasswordCorrect) {
            return { status: 401, message: "Invalid Credentials" }
        }
        
        if (user?.userVerify?.is_email_verified == false) {
            return { status: 401, message: "Account verification pending" }
        }
        
        return { status: 200, data: user }
    } catch (error) {
        console.error('Error in signIn:', error);
        return { status: 500, message: "Internal server error" }
    }
};
const signUp = async (req) => {
    //check email existance
    const emailAlreadyExist = await getUserByEmail(req.body.email);
    if (emailAlreadyExist){
        return { status: 400, message: "Email already exists" }
    }
    //hashed password before save into db
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const token = randomNumber(100000, 999999);
    const { name, email, password, phone, role = 'user' } = req.body;
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role,
    });
    const userVerify = await UserVerify.create({
      user_id: user.id,
      email_verification_token: token,
      is_email_verified: true,
    });
    
    // var mailOptions = {
    //     from: 'rabbimahmud95@gmail.com',
    //     to: 'rabbyasaduzzaman@gmail.com',
    //     subject: 'Sending Email using Node.js',
    //     html: `<h1>Welcome</h1>Use the following OTP to verify email<p>${token}</p>`
    // };
    // transporter.sendMail(mailOptions, function (error, info) {
    //     if (error) {
    //         console.log(error);
    //     } else {
    //         console.log('Email sent: ' + info.response);
    //     }
    // });
    return { status: 201, message: 'User saved successfully', data: user }
};
const saveUserActivityLog = async(userId, activity, req) =>{

   

    const userActivityLog = await UserActivity.create({
        user_id: userId,
        ip_address: req.ip,
        activity,
        browser : req.useragent.browser,
        os : req.useragent.os,
        device : req.useragent.isMobile ? 'Mobile' : 'Desktop'

    })
     console.log('userActivityLog==================>', userActivityLog)
    return userActivityLog;

}


const verifyUserEmail = async ( req ) => {
    if (!req.body.email || !req.body.otp) {
        return { status: 400, message: "Invalid request" }
    }
    const user = await getUserByEmail(req.body.email);
    if ( user){
        if (user.userVerify.emailVerificationToken == req.body.otp ){
            const result = await verifyAccountByUserId( user.id )
            if( result ){
                return { status: 200, message: "Email verified successfully" }
            }else{
                return { status: 400, message: "Invalid OTP" }
            }
        }
    }
}
const allUsers = async (req) => {
    try {
       
        const searchName = req.query.name;
        console.log('Search Name:', searchName);
        let users
        if(searchName){
            users = await User.findAll({
                where: {
                    name: {
                    [Op.like]: `%${searchName}%`,
                    },
                },
                include: [{ model: UserVerify, as:'userVerify'}]
            });
        }else{
            users = await User.findAll({
                include: [{ model: UserVerify, as:'userVerify'}]
            });
        }
        return { status: 200, message: 'Users found', data: users }
    } catch (error) {
        return error
    }
};
const allUserslogs = async (req) => {
  const page = req.query.page || 1; // Current page
  const perPage = 10; // Number of items per page
  const offset = (page - 1) * perPage;
  const limit = perPage;
  let queryOptions = {
        where: {
            createdAt: {
                [Op.between]: [req.query.startDate, req.query.endDate],
            },
        },
        include: [
            {
                model: User,
                as:'user'
            },
        ],
        limit,
        offset
    };
    const searchName = req.query.name;
    if (searchName) {
        queryOptions.include[0].where = {
            name: {
                [Op.like]: `%${searchName}%`,
            },
        };
    }
  try {
    let userLogs
    if(req.user.role == 'admin'){
        userLogs = await UserActivity.findAndCountAll(queryOptions);
    }else{
        const authUserId = req.user.userId 
        if (authUserId) {
            queryOptions.where = {
                ...queryOptions.where,
                userId: authUserId,
            };
        }
        userLogs = await UserActivity.findAndCountAll(queryOptions);
    }
    return { status: 200, message: 'Activity logs found', data: userLogs }
  } catch (error) {
    return error
  }
}

const activityReports = async ( req ) => {
    try {
        let userAtivities
        userAtivities = await UserActivity.findAll({
            attributes: ['userId', [Sequelize.fn('COUNT', Sequelize.col('activity')), 'activityCount']],
            where: {
                createdAt: {
                    [Op.between]: [req.query.startDate, req.query.endDate],
                },
            },
            group: ['userId'],
            include: [
                {
                    model: User,
                    as: 'user'
                },
            ],
        })
        return { status: 200, message: 'Activity logs found', data: userAtivities }
    } catch (error) {
        return error
    }
}
module.exports = { signUp, signIn, verifyUserEmail, allUsers, allUserslogs, randomNumber, getUserByEmail, saveUserActivityLog , activityReports}
