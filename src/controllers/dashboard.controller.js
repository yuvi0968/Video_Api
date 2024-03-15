import { Like } from "../models/like.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Video } from "../models/video.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelVideos = asyncHandler(async (req, res) => {
    const _id = req.user._id;
    // console.log(_id, "_id")
    const channelVideos = await Video.find({ owner: _id });
    // console.log(channelVideos, "Videos-Channel")

    if (channelVideos.length == 0) {
        return res.status(404).json(new ApiResponse(404, [], "No Any video uploaded by channel or user."))
    } else {
        return res.status(200).json(
            new ApiResponse(200, channelVideos, "Channel video has been fetched successfully.")
        );
    }

});

const getChannelStats = asyncHandler(async (req, res) => {
    //Find total subscribers
    const ownerId = req?.user?._id;
    const totalSubscribers = await Subscription.countDocuments({ channel: ownerId });

    //Find Total Videos of Channel
    const totalVideos = await Video.countDocuments({ owner: ownerId });

    //Find total likes on video
    const totalLikes = await Like.countDocuments({
        video: {
            $in: (
                await Video.find({ owner: ownerId })
            ).map(video => video._id)
        }
    });

    //Find total video view 
    const totalVideoViews = await Video.aggregate([
        { $match: { owner: ownerId } },
        { $group: { _id: null, totalViews: { $sum: "$views" } } }
    ]);

    const channelStats = {
        totalVideoViews: totalVideoViews.length > 0 ? totalVideoViews?.[0]?.totalViews : 0,
        totalSubscribers,
        totalLikes,
        totalVideos
    };

    return res.status(200).json(
        new ApiResponse(200, channelStats, "Channel Stats fetched successfully.")
    );


});


export {
    getChannelVideos,
    getChannelStats
}