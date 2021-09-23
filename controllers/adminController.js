const jwt = require("jsonwebtoken");
const User = require("../models/User");
const encrypt = require("../utils/encrypt");
const catchAsync = require("../utils/catchAsync");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWTSECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.uid);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_EXPIRES.split("s")[0] * 1000
    ),
    httpOnly: false,
    secure: false,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    result: {
      token: token,
      ...cookieOptions,
    },
  });
};

exports.signUp = catchAsync(async (req, res) => {
  const { to_Encrypt } = encrypt;

  const user = req.body;
  const encryptedPassword = to_Encrypt(user.password);
  user.password = encryptedPassword;

  let result = await User.findOne({ email: user.email });
  if (result) {
    res.json({ ok: false, message: "User exists", result, error: null });
    res.status(302).end();
  }

  result = await User.insertOne(user);

  res.json({ ok: true, message: "User inserted", result, error: null });
  res.status(201).end();
});

exports.isAdmin = async (req, res, next) => {
  if (req.query.token) {
    const token = req.query.token;

    jwt.verify(token, process.env.JWTSECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

exports.login = catchAsync(async (req, res, next) => {
  const { to_Decrypt } = encrypt;
  const { email, password } = req.body;

  if (!email || !password) {
    res.json({
      message: "No email or Password",
    });
    return;
  }

  const dbUser = await User.findOne({ email });

  if (dbUser && password === to_Decrypt(dbUser.password)) {
    createSendToken(dbUser, 200, res);
  } else {
    res.status(404).json({
      status: "fail",
      message: "incorrect email or password",
    });
  }
});

exports.logout = (req, res, next) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: false,
  });

  res.status(200).json({ status: "success" });
};
