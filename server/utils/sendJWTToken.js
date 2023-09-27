import dotenv from 'dotenv'
dotenv.config();

//   options for cookie
const accessTokenExpire = parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRE);
const refreshTokenExpire = parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRE);

export const accessTokenOptions = {
  expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000),
  maxAge: accessTokenExpire * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};

export const refreshTokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
  maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};

//function to send jwt token after user login
export const sendJWTToken = (res, user, statusCode) => {
  const access_token = user.getSignedJwtAccessToken();
  const refresh_token = user.getSignedJwtRefreshToken();

  //   only set secure to true in production mode
  if (process.env.NODE_ENV === "production") {
    accessTokenOptions.secure = true;
    refreshTokenOptions.secure = true;
  }

  //   adding res cookies
  res.cookie("access_token", access_token, accessTokenOptions);
  res.cookie("refresh_token", refresh_token, refreshTokenOptions);

  res.status(statusCode).json({
    success: true,
    user,
    access_token,
  });
};
