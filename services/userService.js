const User = require("../models/User");
const UserVerify = require("../models/UserVerify");
const UserActivity = require("../models/UserActivity");
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const bcrypt = require('bcrypt');
const { transporter } = require('../config/email');

// const saveUser = async (req) => {
//     //check email existance
//     const emailAlreadyExist = await getUserByEmail(req);
//     if(emailAlreadyExist){
//         return { status:400, message:"Email already exists" }
//     }
//     //hashed password before save into db
//     req.body.password = await bcrypt.hash(req.body.password, 10);
//     req.body.profile_pic = req.file.filename
//     const user = createOrUpdateUser(req);
//     return { status: 200, message: 'User saved successfully', data: user }
// };

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
const getUserByEmail = async (email) => {
    const user = await User.findOne({
      where: { email : email},
      include: [
        {
          model: UserVerify,
          as: "userVerify",
        },
      ],
    });
    return user;
  };
const randomNumber = (min, max) => {
    return Math.floor(
        Math.random() * (max - min) + min
    )
}
const signUp = async (req) => {
    //check email existance
    const emailAlreadyExist = await getUserByEmail(req.body.email);
    if (emailAlreadyExist){
        return { status: 400, message: "Email already exists" }
    }
    //hashed password before save into db
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const token = randomNumber(100000, 999999);
    req.body.profilePic = req?.file ? req.file.filename : null
    const { name, email, password, phone, role, profilePic } = req.body;
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role,
      profilePic
    });
    const userVerify = await UserVerify.create({
      userId: user.id,
      emailVerificationToken: token,
      isEmailVerified: false,
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

const signIn = async (req) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return { status: 400, message: "Please provide email and password" }
    }
    const user = await getUserByEmail(req.body.email);
    if (!user) {
        return { status: 401, message: "Invalid Credentials" }
    }
    const isPasswordCorrect = await bcrypt.compare( password, user.password );
    if ( !isPasswordCorrect ) {
        return { status: 401, message: "Invalid Credentials" }
    }
    if ( user.userVerify.isEmailVerified == false ) {
        return { status: 401, message: "Account verification pending" }
    }
    const userActivity = await UserActivity.create({
        userId: user.id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
    });
    return { status: 200, data: user }
};

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
const allUsers = async () => {
    try {
        const users = await User.findAll();
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
  try {
    const userLogs = await UserActivity.findAll({
      limit,
      offset,
    });
    console.log('userLogs',userLogs)
    return { status: 200, message: 'Activity logs found', data: userLogs }
  } catch (error) {
    return error
  }
}

module.exports = { signUp, signIn, verifyUserEmail, allUsers, allUserslogs, randomNumber, getUserByEmail }
