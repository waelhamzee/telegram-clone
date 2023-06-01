import React, { useEffect, useState } from "react";

const imageStyle = {
  maxWidth: "100%",
  height: "100%",
  objectFit: "cover",
  borderTopRightRadius: "10px",
  borderTopLeftRadius: "10px",
};

const ProgressiveImg = ({ placeholderSrc, src, ...props }) => {
  const [imgSrc, setImgSrc] = useState(placeholderSrc);
  const customClass = placeholderSrc && imgSrc === placeholderSrc ? "loading" : "loaded";

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
        console.dir(img);
      setImgSrc(src);
    };
  }, [src]);

  return (
    <img
      {...{ src: imgSrc, ...props }}
      alt={props.alt || ""}
      className={`${customClass}`}
      style={imageStyle}
    />
  );
};
export default ProgressiveImg;
