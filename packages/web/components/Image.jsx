import React from "react";

function ImageTag({ src, width, height, alt, className, style, ...props }) {
  return (
    <img
      src={src}
      className={className}
      alt={alt}
      width={width}
      height={height}
      style={style}
      crossOrigin={"anonymous"}
      loading="lazy"
      {...props}
    />
  );
}

export default ImageTag;
