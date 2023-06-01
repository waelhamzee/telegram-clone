import React from 'react'
import ImageUploading from "react-images-uploading";
import { useAppContext } from '../context/AppContext';
import {RiGalleryLine} from 'react-icons/ri'
import {AiOutlineFile} from 'react-icons/ai'
import { toggleDiv } from '../helpers/AnimationHelpers';

const ImageFileUpload = ({file, label, images, onChange, setFiles}) => {

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        resolve(fileReader.result);
      }
      fileReader.onerror = (error) => {
        reject(error);
      }
    })
  }

  const  handleFileRead = async (event) => {
    console.log(event);
    const file = event.target.files[0]
    const base64 = await convertBase64(file)

    let files = [{
      data_url : base64,
      file : file
    }]


    setFiles(files)
  }


    return (
      <div>
      {!file? (
        <ImageUploading
                value={images}
                onChange={onChange}
                dataURLKey="data_url"
                acceptType={file? ['jpg'] : ['jpg', 'gif', 'png', 'jpeg']}
              >
                {({ imageList, onImageUpload, isDragging, dragProps }) => (
                  // write your building UI
                  <div className="upload__image-wrapper">
                      <button
                      style={isDragging ? { color: "red" } : undefined}
                      onClick={() => {
                        onImageUpload()
                        toggleDiv(
                          "attachment-content",
                          "show",
                          "hide-animation"
                        )
                      }}
                      {...dragProps}
                      className="attachment-content-container"
                    >
                      <RiGalleryLine/> 
                      <p>{label}</p>
                    </button>
                  </div>
                )}
              </ImageUploading>
      ) : (
        <label htmlFor='file-upload' style={{display:'flex', padding:'.4rem', gap:'1rem', alignItems:'center'}}>
                       <input type='file' id='file-upload' style={{display:'none'}} onChange={(e) => handleFileRead(e)} onClick={() => toggleDiv("attachment-content","show","hide-animation")}/>
                        <AiOutlineFile/>
                        <p style={{color: '#707579cc'}}>{label}</p>
                     </label>
      )}
       </div>
    )
}

export default ImageFileUpload