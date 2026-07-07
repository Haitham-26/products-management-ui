import type { UploadFile } from "antd";

export async function createUploadFileFromImageUrl(
  url?: string,
): Promise<UploadFile | null> {
  if (!url) {
    return null;
  }

  return {
    uid: crypto.randomUUID(),
    name: "image.jpg",
    status: "done",
    url,
  };
}
