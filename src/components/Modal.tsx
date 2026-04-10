import type React from "react";
import { Modal as AntdModal } from "antd";
import type { ModalProps as AntdModalProps } from "antd";

export type ModalProps = AntdModalProps;

export const Modal: React.FC<ModalProps> = (props) => {
  return <AntdModal footer={null} {...props} />;
};
