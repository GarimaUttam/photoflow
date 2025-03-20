const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../models/userModel");
const getDataUri = require("../utils/datauri");
const { uploadToCloudinary } = require("../utils/cloudinary");

exports.getProfile = catchAsync(async (req, res, next) => {
  const { id } = req.params;

    const user = await User.findById(id)
        .select(
            "-password -otp -otpExpires -resetPasswordOTP -resetPasswordOTPExpires -passwordConfirm"
        )
        .populate({
            path: "post",
            options: { sort: { createdAt: -1 } },
        }).populate({
            path: "savedPosts",
            options: { sort: { createdAt: -1 } },
        });
    
    if (!user) {
        return next(new AppError("User not found", 404));
    }

    res.status(200).json({
        status: "success",
        data: {
            user,
        },
    });
});

exports.editProfile = catchAsync(async (req, res, next) => {
    const userId = req.user.id;

    const { bio } = req.body;
    const profilePicture = req.file;

    let cloudResponse;

    if (profilePicture) {
        const fileUri = getDataUri(profilePicture);
        cloudResponse = await uploadToCloudinary(fileUri);
    }

    const user = await User.findById(userId).select("-password");

    if (!user) return next(new AppError("User Not Found", 400));

    if (bio) user.bio = bio;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;

    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
        message: "Profile Updated",
        status: "success",
        data: {
            user,
        },
    });
})