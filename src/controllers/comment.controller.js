import { Comment } from "../models/comment.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) =>{
    const { videoId } = req.params;


});

const addComment = asyncHandler(async (req, res) =>{
    const { videoId } = req.params;
    req.body.video = videoId;
    req.body.owner = req.user._id;

    if (!req.body.content) {
        throw new ApiError(404, "Comment Content is required..")
    }

    const comment = await Comment.create(req.body);

    if (!comment) {
        throw new ApiError(500, "Failed to create comment : Internal Server Error")
    };

    res.status(201).json(
        new ApiResponse(200, comment, "Comment Created successfully..")
    );
});

const updateComment = asyncHandler(async (req, res) =>{
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content) {
        throw new ApiError(404, "Comment content is required for updation")
    }

    const updatedComment = await Comment.findByIdAndUpdate(commentId,
        {
            $set:{
                content
            }
        },
        {new:true});
    
    if (!updatedComment) {
        throw new ApiError(404, "Comment not found or unable to update")
    };

    res.status(200).json(
        new ApiResponse(200, updatedComment, "Comment updated successfully...")
    );

});

const deleteComment = asyncHandler(async (req, res) =>{
    const { commentId } = req.params;

    const comment = await Comment.findByIdAndDelete(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found or unable to delete");
    };

    res.status(200).json(
        new ApiResponse(204, "Comment deleted successfully")
    )
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}