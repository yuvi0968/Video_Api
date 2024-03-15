import { Playlist } from "../models/playlist.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const owner = req.user?._id;

    const playlist = await Playlist.create({
        name,
        description,
        owner
    });

    if (!playlist) {
        throw new ApiError(500, "Failed to create playlist. Please try again.")
    };

    res.status(201).json(
        new ApiResponse(200, playlist, "Playlist created successfully.")
    );

});

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found for particular id.")
    };

    res.status(200).json(
        new ApiResponse(200, playlist, "Playlist has been fetched successfully.")
    )
});

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;
    console.log(name)
    if (!(name || description)) {
        throw new ApiError(404, "Name or Description is required.")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId,
        {
            $set: {
                name: name,
                description: description
            }
        }, { new: true }
    );

    if (!updatedPlaylist) {
        throw new ApiError(404, "Playlist has been not found or update.")
    };

    res.status(201).json(
        new ApiResponse(200, updatedPlaylist, "Playlist has been update successfully.")
    );

});

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    const playlistRemove = await Playlist.findByIdAndDelete(playlistId);

    if (!playlistRemove) {
        throw new ApiError(404, "Playlist not found or unable to delete.");
    };

    res.status(200).json(
        new ApiResponse(204, "Playlist has been delete successfully.")
    );

});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { videoId, playlistId } = req.params;

    const videoInPlaylist = await Playlist.findByIdAndUpdate(playlistId, {
        $push: {
            videos: videoId
        }
    }, { new: true });

    if (!videoInPlaylist) {
        throw new ApiError(400, "Failed to add Video in playlist. Please try again.")
    };

    res.status(200).json(
        new ApiResponse(200, videoInPlaylist, "Video has been added in playlist successfully.")
    );

});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { videoId, playlistId } = req.params;

    const videoOutFromPlaylist = await Playlist.findByIdAndUpdate(playlistId, {
        $pull: {
            videos: videoId
        }
    }, { new: true }
    );
    console.log(videoOutFromPlaylist)
    if (!videoOutFromPlaylist) {
        throw new ApiError(400, "Failed to remove video from playlist. Playlist or video is not present Please try again.")
    };

    res.status(200).json(
        new ApiResponse(200, "Video has been remove from playlist successfully.")
    );

});

const getUserPlaylists = asyncHandler(async (req, res) =>{
    const { userId } = req.params;

    const userPlaylists = await Playlist.find({owner: userId});

    // console.log(userPlaylists );
    
    if (userPlaylists.length == 0) {
        res.status(200).json(new ApiResponse(200, [], "No any Playlist present."))
    };

    res.status(200).json(
        new ApiResponse(200, userPlaylists, "All User Playlist has been fetched successfully.")
    );

});

export {
    createPlaylist,
    getPlaylistById,
    updatePlaylist,
    deletePlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    getUserPlaylists
};

