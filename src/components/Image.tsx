import type React from "react";
import { Image as AntdImage, type ImageProps as AntdImageProps } from "antd";

type ImagesProps = AntdImageProps;

export const Image: React.FC<ImagesProps> = ({ preview = false, ...props }) => {
  return <AntdImage preview={preview} {...props} />;
};
