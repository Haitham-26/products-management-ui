import React, { useState } from "react";
import { Upload } from "antd";
import type { UploadFile, UploadProps } from "antd";
import ImgCrop, { type ImgCropProps } from "antd-img-crop";

type ImageUploadProps = UploadProps & {
  onChange: VoidCallback<UploadFile[]>;
  showAspectSlider?: ImgCropProps["aspectSlider"];
};

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
  showAspectSlider = false,
  ...props
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const localOnChange: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => {
    setFileList(newFileList);
    onChange(newFileList);
  };

  return (
    <ImgCrop aspect={1} aspectSlider={showAspectSlider}>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onChange={localOnChange}
        customRequest={({ onSuccess }) => {
          setTimeout(() => onSuccess?.("ok"), 0);
        }}
        onPreview={async (file) => {
          const src = file.url ?? file.thumbUrl;

          if (!src) {
            return;
          }

          if (src.startsWith("data:")) {
            const blob = await fetch(src).then((res) => res.blob());
            const blobUrl = URL.createObjectURL(blob);

            window.open(blobUrl, "_blank");

            setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
          } else {
            window.open(src, "_blank");
          }
        }}
        {...props}
      />
    </ImgCrop>
  );
};
