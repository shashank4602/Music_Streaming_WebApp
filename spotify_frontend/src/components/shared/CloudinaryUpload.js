import { openUploadWidget } from "../../utils/CloudinaryService";
import { cloudinary_upload_preset } from "../../config";

const CloudinaryUpload = ({ setUrl, setName }) => {
    const uploadImageWidget = () => {
        let myUploadWidget = openUploadWidget(
            {
                cloudName: "djnajyew1",
                uploadPreset: cloudinary_upload_preset,
                //songs can be uploaded from local system
                sources: ["local"],
            },
            function (error, result) {
                if (!error && result.event === "success") {
                    // console.log(result.info.secure_url);
                    setUrl(result.info.secure_url);
                    setName(result.info.original_filename);
                    console.log(result.info);
                } else {
                    if (error) {
                        console.log(error);
                    }
                }
            }
        );
        myUploadWidget.open();
    };

    return (
        <button
            className="bg-white text-black rounded-full p-4 font-semibold" onClick={uploadImageWidget}>
            Select Track
        </button>
    );
};

export default CloudinaryUpload;