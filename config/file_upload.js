
const axios = require("axios");
const fs = require("fs");


const handleFileUpload = async (file) => {
    const fileStream = fs.createReadStream(file.path);
    const uniqueFilename = `${file.filename}`;
    const response = await axios.put(
        //url
        //stream
        //headers
        `https://storage.bunnycdn.com/oncestart/${uniqueFilename}`,
        file.buffer,
        {
            headers: {
                AccessKey: "85ef72b7-f1ed-4057-a2dfc4257db6-2c59-40cf",
            },
        }
    );

    if (response.data) {
        return `https://onceStart.b-cdn.net/${uniqueFilename}`;
    } else {
        return false;
    }
};

module.exports = handleFileUpload