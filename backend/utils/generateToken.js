import jwt from "jsonwebtoken";
const generateToken = (res, user_id) => {
  //create token
  const token = jwt.sign({ user_id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  //set jwt as hhtp-only cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    samesite: "strict",
    maxAge: 1000 * 60 * 60 * 24 * 30, //30 days
  });
};

export default generateToken;
