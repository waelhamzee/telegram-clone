let ImageManager = require("../helpers/ImageManager");

module.exports = {
  saveFileAttachments: async function (base64) {
    let filename;
    if (base64) {
      filename = await ImageManager.uploadimagebase64row(base64);
    }
    return filename;
  },

  // saveVoiceAttachments:async function (voiceattachmentsList) {

  //     let voicetachments = [];

  //         for  (let i=0;i<voiceattachmentsList.length;i++ ) {
  //             const item = voiceattachmentsList[i];
  //             if(item.base64){
  //                 const filename = await ImageManager.uploadimagebase64row(item.base64,item.ext)

  //                 if(filename){
  //                     let projectvoices = new projectvoice();
  //                     projectvoices.duration = item.duration;
  //                     projectvoices.filename = filename;

  //                     const newitem = await projectvoices.save();
  //                     voicetachments.push(newitem._id)
  //                 }
  //             }else{
  //                 voicetachments.push(item.id)
  //             }

  //         }
  //         return voicetachments;

  // },

  calulateAttachmentSize(base64item) {
    const base64Length = base64item.length;
    const lastChar = base64item.charAt(base64Length - 1);

    if (lastChar == "=") return base64Length * (3 / 4) - 1;

    return base64Length * (3 / 4) - 2;
  },

   escapeStringRegexp(string) {
    if (typeof string !== 'string') {
      throw new TypeError('Expected a string');
    }
  
    // Escape characters with special meaning either inside or outside character sets.
    // Use a simple backslash escape when it’s always valid, and a `\xnn` escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
    return string
      .replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
      .replace(/-/g, '\\x2d');
  }
  
};
