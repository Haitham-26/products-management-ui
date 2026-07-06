import type { UploadFile } from "antd";
import type { RcFile } from "antd/es/upload/interface";

export async function createUploadFileFromImageUrl(
  url?: string,
): Promise<UploadFile | null> {
  if (!url) return null;

  const res = await fetch(url);
  const blob = await res.blob();

  const file = new File([blob], "image.jpg", { type: blob.type }) as RcFile;

  return {
    uid: crypto.randomUUID(),
    name: "image.jpg",
    status: "done",
    originFileObj: file,
    url,
  };
}
