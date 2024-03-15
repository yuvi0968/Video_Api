import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloud } from "../utils/cloudinary.js";

const publishVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    if (!(title && description)) {
        throw new ApiError(400, "Title and Description are must")
    };

    const videoLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    // console.log("VideoPath :: ",videoLocalPath, "----:::ThumbnailPath ",thumbnailLocalPath);

    if (!(videoLocalPath && thumbnailLocalPath)) {
        throw new ApiError(400, "VideoFile and Thumbnail are required")
    };

    const videoCloud = await uploadOnCloud(videoLocalPath);
    const thumbnailCloud = await uploadOnCloud(thumbnailLocalPath);

    if (!videoCloud || videoCloud == null) {
        throw new ApiError(500, "Something went wrong while uploading video on cloud")
    }

    if (!thumbnailCloud || thumbnailCloud == null) {
        throw new ApiError(500, "Something went wrong while uploading thumbnail on cloud")
    }

    // console.log(videoCloud.duration, "----:::----", thumbnailCloud.url)

    const video = await Video.create({
        videoFile: videoCloud?.url,
        thumbnail: thumbnailCloud?.url,
        title: title,
        description: description,
        duration: videoCloud?.duration,
        owner: req.user._id

    });

    if (!video || video == null) {
        throw new ApiError(500, "Something while wrong upoading video")
    }

    res.status(201).json(
        new ApiResponse(200, video, "Video Uploaded Successfully"));

});

const getAllVideos = asyncHandler(async (req, res) => {
    const videos = await Video.find({ owner: req.user._id });

    // console.log(videos,"Fetched ", req.user._id)
    if (!videos) {
        throw new ApiError(404, "Videos not found for specific user")
    }

    res.status(200).json(
        new ApiResponse(200, videos, "Video Fetched Successfully")
    )
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId) {
        throw new ApiError(400, "VideoId is Required")
    };

    // console.log(videoId);

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video does not exits for this specific video id")
    };

    res.status(200).json(
        new ApiResponse(200, video, "Video is fetched successfully")
    );

});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;


    if (!videoId) {
        throw new ApiError(400, "VideoId is Required")
    };

    const updateFields = {}

    if (req.body.title) {
        updateFields.title = req.body.title;
    };

    if (req.body.description) {
        updateFields.description = req.body.description;
    }

    // console.log("Files :: ", req.file)
    if (req.file) {
        let thumbnailPath = req.file?.path;
        let thumbnail = await uploadOnCloud(thumbnailPath);
        updateFields.thumbnail = thumbnail?.url;
        console.log("Updated Url:: ", thumbnail.url)
    };


    const updateVideo = await Video.findByIdAndUpdate(videoId,
        { $set: updateFields },
        { new: true });

    // console.log("Updated Video ---->:: ", updateVideo);

    if (!updateVideo) {
        throw new ApiError(400, "Video has not been update")
    };

    res.status(201).json(
        new ApiResponse(200, updateVideo, "Video updated successfully")
    )



});


const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId) {
        throw new ApiError(401, "VideoId is not present videoId is required")
    };

    const video = await Video.findByIdAndDelete({ _id: videoId });

    if (!video) {
        throw new ApiError(404, "The Video you're trying to delete does not exist")
    }

    res.status(200).json(
        new ApiResponse(200, "Video has been Deleted Successfully..")
    );
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId) {
        throw new ApiError(400, "VideoId is misssing")
    };

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video is not found")
    };

    video.isPublished = !video.isPublished;


    const updatedVideo = await video.save();

    if (!updatedVideo) {
        throw new ApiError(500, "Interanl server error toggle status is not update")
    }

    // console.log("Published Video :: ", video);

    res.status(200).json(
        new ApiResponse(200, updatedVideo, "Video is published successfully")
    );

});

export {
    publishVideo,
    getAllVideos,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
};