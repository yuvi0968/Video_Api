import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloud = async (localFilePath) => {
    try {
        if (!localFilePath) return 'Could not find File Path'
        //Upload the File on CLoudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });

        //File has been uploaded Successfully
        console.log("File is uploaded on cloudinary :: ", response.url);
        fs.unlink(localFilePath, (err) => {
            if (err) {
                console.log("Error Deleting local file ", err)
            } else {
                console.log("After Uploading on cloud Local File Deleted successfully")
            }
        });
        return response;

    } catch (error) {
        fs.unlink(localFilePath, (err) => {
            if (err) {
                console.log("Error Deleting local file ", err)
            } else {
                console.log("Local File Deleted successfully")
            }
        }) //remove local saved temporary file as the upload operation is failed
        console.error('Error uploading file on cloud:', error);

        return null;
    }
};

export { uploadOnCloud } 