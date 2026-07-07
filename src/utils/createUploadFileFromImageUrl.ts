import type { UploadFile } from "antd";

export default function createUploadFileFromImageUrl(url?: string) {
  if (!url) {
    return null;
  }

  return {
    uid: crypto.randomUUID(),
    name: "image.jpg",
    status: "done",
    url,
  } as UploadFile;
}
