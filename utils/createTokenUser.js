const createTokenUser = (user) => {
  return { userId: user.id, name: user.name, role: user.role, profilePic: user.profilePic, userVerify: user.userVerify };
};

module.exports = createTokenUser;
