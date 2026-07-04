const crypto = require("crypto");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendVerificationEmail = async (user, code) => {
  await sendEmail({
    to: user.email,
    subject: "Verify your MenStyle Pro account",
    text: `Hi ${user.name}, your verification code is ${code}. It expires in 10 minutes.`,
    html: `<p>Hi ${user.name},</p><p>Your MenStyle Pro verification code is:</p><h2 style="letter-spacing:4px">${code}</h2><p>This code expires in 10 minutes.</p>`,
  });
};

// @desc Register new customer (does NOT log in — sends a verification code first)
// @route POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password, referralCode } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    // Emails listed in ADMIN_EMAILS (.env) automatically get the admin role on signup.
    const adminEmails = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    const role = adminEmails.includes(email.toLowerCase()) ? "admin" : "customer";

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role,
      referralCode: crypto.randomBytes(4).toString("hex").toUpperCase(),
    });

    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) {
        referrer.rewardPoints += 100; // referral bonus
        user.rewardPoints += 50;
        await referrer.save();
      }
    }

    const code = generateCode();
    user.emailVerificationCode = code;
    user.emailVerificationExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendVerificationEmail(user, code);

    res.status(201).json({
      message: "Account created. Enter the verification code sent to your email to continue.",
      email: user.email,
    });
  } catch (err) {
    next(err);
  }
};

// @desc Verify email with the 6-digit code sent at registration; logs the user in on success
// @route POST /api/auth/verify-email
exports.verifyEmail = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email }).select("+emailVerificationCode +emailVerificationExpires");

    if (!user) return res.status(404).json({ message: "No account with this email" });
    if (user.isVerified) return res.status(400).json({ message: "This account is already verified" });
    if (
      !user.emailVerificationCode ||
      user.emailVerificationCode !== code ||
      user.emailVerificationExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    user.isVerified = true;
    user.emailVerificationCode = undefined;
    user.emailVerificationExpires = undefined;
    user.visitCount += 1;
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      rewardPoints: user.rewardPoints,
      referralCode: user.referralCode,
      token: generateToken(user._id, user.role),
    });
  } catch (err) {
    next(err);
  }
};

// @desc Resend a fresh verification code
// @route POST /api/auth/resend-verification
exports.resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "No account with this email" });
    if (user.isVerified) return res.status(400).json({ message: "This account is already verified" });

    const code = generateCode();
    user.emailVerificationCode = code;
    user.emailVerificationExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendVerificationEmail(user, code);

    res.json({ message: "A new verification code has been sent to your email." });
  } catch (err) {
    next(err);
  }
};

// @desc Login with email + password
// @route POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
        needsVerification: true,
        email: user.email,
      });
    }

    user.visitCount += 1;
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      rewardPoints: user.rewardPoints,
      membershipTier: user.membershipTier,
      token: generateToken(user._id, user.role),
    });
  } catch (err) {
    next(err);
  }
};

// @desc Request OTP for login (mock - logs to console; wire up Nodemailer/SMS in production)
// @route POST /api/auth/request-otp
exports.requestOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "No account with this email" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    console.log(`📩 OTP for ${email}: ${otp}`); // In production, send via Nodemailer/SMS

    res.json({ message: "OTP sent to registered email" });
  } catch (err) {
    next(err);
  }
};

// @desc Verify OTP and login
// @route POST /api/auth/verify-otp
exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email }).select("+otp +otpExpires");
    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (err) {
    next(err);
  }
};

// @desc Get logged-in user's profile
// @route GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (err) {
    next(err);
  }
};

// @desc Update profile (addresses, favorites, etc.)
// @route PUT /api/auth/me
exports.updateMe = async (req, res, next) => {
  try {
    const updatable = ["name", "phone", "birthday", "anniversary", "favoriteSizes", "favoriteColors", "addresses"];
    updatable.forEach((field) => {
      if (req.body[field] !== undefined) req.user[field] = req.body[field];
    });
    await req.user.save();
    res.json(req.user);
  } catch (err) {
    next(err);
  }
};
