import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
    //Create Tweet
    const { content } = req.body;
    const { _id } = req.user;
    console.log("Requested User :::---->", content, _id);

    if (!content) {
        throw new ApiError(400, "Content is must and required..!!")
    }

    const isTweet = await Tweet.create({
        content,
        owner: _id
    });

    if (!isTweet) {
        throw new ApiError(500, "Something went wrong while creating tweet")
    }

    return res.status(201).json(
        new ApiResponse(200, isTweet, "Tweet Created Successfully")
    );

});

const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        throw new ApiError(400, "UserId is missing..!!")
    }

// if (userId==req.user._id) {  //Todo doubut clearing
//     console.log("Both Id is some and True")
// } 

    const tweets = await Tweet.find({ owner: userId });
    console.log("Tweet Details::", tweets, userId)
    if (tweets.length==0) {
        throw new ApiError(404, "Tweets is not found for specified User")
    }

    return res.status(200).json(
        new ApiResponse(200, tweets, "User Tweets fetched successfully...")
    )

});

const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { content } = req.body;

    if (!tweetId || !content) {
        throw new ApiError(400, "Field Is required")
    }

    let validObj = new mongoose.Types.ObjectId(tweetId);

    const updatedTweet = await Tweet.findByIdAndUpdate({_id:tweetId},
        {
            $set: {
                content
            }
        },
        { new: true }
    )

    console.log("Updated Code :: ", updatedTweet)

    return res.status(200)
        .json(
            new ApiResponse(201, updatedTweet, "Tweet is updated successfully"));

});

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!tweetId) {
        throw new ApiError(400, "TweetId is missing...")
    }

    const removeTweet = await Tweet.findByIdAndDelete({_id:tweetId});

    if (!removeTweet) {
        throw new ApiError(404, "The tweet you're trying to delete does not exist")
    }

    console.log(removeTweet);
    return res.status(200).json(
        new ApiResponse(200, "Tweet has been deleted successfully")
    )
});

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}

