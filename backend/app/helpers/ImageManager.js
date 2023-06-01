const sharp = require('sharp');
let fs = require("fs");
const { v4: uuidv4 } = require('uuid');


module.exports =  {

    uploadimagebase64row: async function (filename, encoded,ext = "", type="") {

        let uuid = uuidv4()
        if (type==="image") this.uploadimagebase64rowresized(encoded, uuid.concat("x"), ext)

        encoded = encoded.split("base64,")[1];
        let fileextension = encoded.substring(encoded.indexOf('/') + 1, encoded.indexOf(';base64'));
        if(ext && ext.length>1){
            fileextension = ext;
        }else{
            encoded = encoded.split(',')[1];
        }
        try
        {

            if (!filename) {
                 filename = uuid+"."+fileextension;
            }
            let filepath = _config("app.local_upload_path")+filename.trim();
            await fs.writeFile(filepath, encoded, 'base64', function(error) {
                console.log(error);
                if (error) return false;
            });

            console.log("saving...",filename)
            return filename;
        }
        catch(error)
        {
            console.log("uploadimagebase64 false")
            return false;
        }
    },

    uploadimagebase64rowresized : function(base64Image, uuid, ext, filename) {
    let parts = base64Image.split(';');
    let mimType = parts[0].split(':')[1];
    let imageData = parts[1].split(',')[1];

    var img = new Buffer(imageData, 'base64');
    sharp(img)
        .resize(5, 8)
        .toBuffer()
        .then(resizedImageBuffer => {
            let resizedImageData = resizedImageBuffer.toString('base64');
            let encoded = `data:${mimType};base64,${resizedImageData}`;
            encoded = encoded.split("base64,")[1];
            let fileextension = encoded.substring(encoded.indexOf('/') + 1, encoded.indexOf(';base64'));
            if(ext && ext.length>1){
                fileextension = ext;
            }else{
                encoded = encoded.split(',')[1];
            }
            try
            {

            if (!filename) {
                 filename = uuid+"."+fileextension;
            }
            let filepath = _config("app.local_upload_path")+filename.trim();
             fs.writeFile(filepath, encoded, 'base64', function(error) {
                console.log(error);
                if (error) return false;
            });

            console.log("saving...",filename)
            return filename;
        }
        catch(error)
        {
            console.log(error);
            console.log("uploadimagebase64 false")
            return false;
        }
        })
        .catch(error => {
            // error handeling
            console.log(error);
        })
    }
};
