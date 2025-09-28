// const User = require("../models/User");
// const UserVerify = require("../models/UserVerify");
// const UserActivity = require("../models/UserActivity");
const db = require('../models')
const User = db.User
const UserVerify = db.UserVerify
const UserActivity = db.UserActivity
const Role = db.Role;
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
      include: 
        [
            { model: UserVerify, as: 'userVerify' },
            { model: Role, as: 'role' } 
        ]
    });
    return user;
};
const signIn = async (req) => {
    try {
        const { email, password } = req.body;
        const user = await getUserByEmail(email);
        console.log('user=================>', user);
        
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
const updateUser = async(req) =>{
    try{
    // Get the user ID from the request parameters
        const { id } = req.params;
        // Get the fields to update from the request body
        const { name, email, password, phone } = req.body;

        // 1. Find the user to be updated
        const user = await User.findByPk(id);

        // If the user does not exist, return a 404 error
        if (!user) {
            return { status: 404, message: "User not found." };
        }

        // 2. Handle email update: check if the new email already exists for another user
        if (email && email !== user.email) {
            const emailAlreadyExist = await getUserByEmail(email);
            if (emailAlreadyExist) {
                return { status: 400, message: "Email already exists." };
            }
        }

        // 3. Handle password update: if a new password is provided, hash it
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        // 4. Update the user's other fields, if they exist in the request body
        user.name = name || user.name;
        user.email = email || user.email;
        user.phone = phone || user.phone;

        // 5. Save the updated user to the database
       let updatedUser =  await user.save();
       // Remove password from response
        updatedUser = updatedUser.toJSON ? updatedUser.toJSON() : updatedUser;
        delete updatedUser.password;

        // 6. Return a success message and the updated user data
        return { 
            status: 200, 
            message: 'User updated successfully.', 
            data: updatedUser 
        };

    } catch (error) {
        console.error("Error updating user:", error);
        return { status: 500, message: "Internal server error." };
    }

}
const saveUserActivityLog = async(userId, activity, req) =>{

    const ipAddress = 
        req.ip ||
        req.socket?.remoteAddress ||
        req.connection?.remoteAddress ||
        req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
        req.headers['x-real-ip'] ||
        req.headers['x-client-ip'] || '127.0.0.1'
    
    const userActivityLog = await UserActivity.create({
        user_id: userId,
        ip_address: ipAddress,
        activity,
        browser : req.useragent.browser,
        os : req.useragent.os,
        device : req.useragent.isMobile ? 'Mobile' : 'Desktop'

    })
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
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 1; // Default to 10 items per page
        const offset = (page - 1) * limit; // Calculate offset
        
        const searchName = req.query.name;
        console.log('Search Name:', searchName);
        
        let whereCondition = {};
        if (searchName) {
            whereCondition.name = {
                [Op.like]: `%${searchName}%`,
            };
        }
        
        // Use `findAndCountAll` to get both the data and total count
        const { count, rows: users } = await User.findAndCountAll({
            where: whereCondition,
            include: [{ model: UserVerify, as: 'userVerify' }],
            limit: limit,
            offset: offset,
        });

        // Calculate total pages
        const totalPages = Math.ceil(count / limit);
        
        return {
            status: 200,
            message: 'Users found',
            data: {
                users: users,
                pagination: {
                    totalItems: count,
                    totalPages: totalPages,
                    currentPage: page,
                    itemsPerPage: limit,
                },
            },
        };
    } catch (error) {
        console.error('Error fetching users:', error);
        return { status: 500, message: 'Internal server error', error: error.message };
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
module.exports = { signUp, signIn, verifyUserEmail, updateUser, allUsers, allUserslogs, randomNumber, getUserByEmail, saveUserActivityLog , activityReports}
