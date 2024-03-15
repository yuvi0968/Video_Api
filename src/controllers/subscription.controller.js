import { Subscription } from "../models/subscription.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const subscriberId = req.user?._id;

    const isSubscribed = await Subscription.findOne({
        subscriber: subscriberId,
        channel: channelId
    });

    // console.log(isSubscribed)
    if (isSubscribed) {

        const unsubscribed = await Subscription.findByIdAndDelete(isSubscribed?._id);

        return res.status(200).json(
            new ApiResponse(200, "Channel unsubscribed successfully")
        )

    }
    else {

        const subscription = await Subscription.create({
            subscriber: subscriberId,
            channel: channelId
        });

        if (!subscription) {
            throw new ApiError(500, "Something went wrong while subscription")
        };

        return res.status(201).json(
            new ApiResponse(200, "Channel Subscribed Successfully"))
    }

});

const getChannelSubscribers = asyncHandler(async (req, res) =>{
   const {channelId} = req.params;
   
   const allSubscribers = await Subscription.find({channel:channelId});
//    const allSubscribersCount = await Subscription.countDocuments({})

// console.log(allSubscribers)
if (allSubscribers.length ==0) {
    res.status(404).json(
        new ApiResponse(404, [], "No any subscriber for this channel")
    )
}
   return res.status(200).json(
    new ApiResponse(200, allSubscribers, "All Channel Subscribers are fetched")
   )

});

const getSubscribedChannels = asyncHandler(async (req, res) =>{
    const { subscriberId } = req.params;
    
    const channelSubscribed = await Subscription.find({subscriber: subscriberId});

    if (channelSubscribed.length ==0) {
        res.status(404).json(
            new ApiResponse(404, [], "No any channel subscribed by this user")
        )
    }
    return res.status(200).json(
        new ApiResponse(200, channelSubscribed, "All Subscribed Channels are fetched")
    )
})

export {
    toggleSubscription,
    getChannelSubscribers,
    getSubscribedChannels
};

