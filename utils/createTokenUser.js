const createTokenUser = (user) => {
  return { id: user.id, name: user.name, role: user.role, profile_pic: user.profile_pic, userVerify: user.userVerify };
};

module.exports = createTokenUser;
