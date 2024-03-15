import { Like } from "../models/like.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req?.user?._id;

    const likedVideo = await Like.findOne({ video: videoId, likedBy: userId });
    console.log("Liked Video:: ", likedVideo);

    if (likedVideo) {
        const toggleLike = await Like.findByIdAndDelete(likedVideo?._id, { new: true });
        console.log(toggleLike, "After Exit Like Video")

        res.status(200).json(
            new ApiResponse(204, "Video has been unliked successfully")
        )
    } else {
        const newLikeVideo = await Like.create({
            video: videoId,
            likedBy: userId
        });

        if (!newLikeVideo) {
            throw new ApiError(500, "Failed to like the video. Please try again.")
        }

        res.status(201).json(
            new ApiResponse(200, "Video is liked successfully.")
        )
    }

});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user?._id;

    const likedComment = await Like.findOne({ comment: commentId, likedBy: userId });
    console.log(likedComment)

    if (likedComment) {
        const toggleLikeComment = await Like.findByIdAndDelete(likedComment?._id, { new: true });

        if (!toggleLikeComment) {
            throw new ApiError(500, "Failed to unlike the comment. Please try again.")
        };

        res.status(200).json(
            new ApiResponse(204, "Comment is unliked successfully.")
        );

    } else {
        const newLikeforComment = await Like.create({
            comment: commentId,
            likedBy: userId
        });

        if (!newLikeforComment) {
            throw new ApiError(500, "Failed to like the comment. Please try again.")
        };

        res.status(201).json(
            new ApiResponse(200, "Comment is liked successfully.")
        );

    }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const userId = req?.user?._id;

    const likedTweet = await Like.findOne({ tweet: tweetId, likedBy: userId });
    console.log("TweetLiked ", likedTweet)
    if (likedTweet) {
        const removeTweetLike = await Like.findByIdAndDelete(likedTweet?._id, { new: true });
        if (!removeTweetLike) {
            throw new ApiResponse(500, "Failed to unlike tweet. Please try again.")
        };

        res.status(200).json(
            new ApiResponse(204, "Tweet is unliked successfully.")
        );

    } else {
        const createTweetLike = await Like.create({
            tweet: tweetId,
            likedBy: userId
        });

        if (!createTweetLike) {
            throw new ApiError(500, "Failed to like the tweet. Please try again.")
        };

        res.status(200).json(
            new ApiResponse(200, "Tweet is liked successfully.")
        );

    }
});

const getLikedVideos = asyncHandler(async (req, res) => {

    const likedVideos = await Like.find({likedBy: req.user?._id, video: { $exists: true } }).populate("video");
    // console.log(likedVideos);
    
    if (!likedVideos) {
        new ApiResponse(404, [], "No any liked videos present.")
    };

    res.status(200).json(
        new ApiResponse(200, likedVideos, "All Liked videos fetching successfully.")
    );

})

export {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
};
