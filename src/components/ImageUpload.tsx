import React, { useState } from "react";
import { Upload } from "antd";
import type { UploadFile, UploadProps } from "antd";
import ImgCrop from "antd-img-crop";

type ImageUploadProps = UploadProps & {
  onChange: VoidCallback<UploadFile[]>;
};

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
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
    <ImgCrop aspect={1}>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onChange={localOnChange}
        {...props}
      />
    </ImgCrop>
  );
};
