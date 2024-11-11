// handleUpload.js
import axios from 'axios';
import { decryptMessage } from '../cryptoUtils'


export const handleUpload = async (file) => {
    if (!file) {
        alert('Please select a file first');
        return null;
    }

    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}api/v1/s3/get-presigned-url`, {
            params: {
                fileName: file.name,
                fileType: file.type,
            },
        });

        // Extract the URL
        const url = response.data?.data;
        if (!url) {
            console.error('No URL returned in response data:', response.data);
            return null;
        }

        // Upload the file to S3 using the pre-signed URL

        // const uploadResponse = await axios.put(url, file, {
        //     headers: {
        //         'Content-Type': file.type,
        //     },
        // });
        // if (uploadResponse.status === 200) {
        //     return url; // Ensure this line returns the URL correctly
        // } else {
        //     console.error('File upload failed with status:', uploadResponse.status);
        //     return null;
        // }

        return url;

    } catch (error) {
        console.error('Error uploading file:', error);
        return null;
    }
};



