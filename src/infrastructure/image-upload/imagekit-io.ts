import { ImageUploadPort } from "@/core/application/ports/image-upload";
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
} from "@imagekit/next";
import { getUploadAuthParams } from "@imagekit/next/server";
import ImageKit from "imagekit";
import { errAsync, okAsync, Result, ResultAsync } from "neverthrow";

const imageKit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY as string,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL!,
});

export class ImageKitImageUploadService implements ImageUploadPort {
  async upload(props: {
    file: File;
    onProgress?: (event: ProgressEvent) => void;
  }): Promise<
    Result<{ fileId: string; fileName: string; fileUrl: string }, string>
  > {
    const authResult = await ResultAsync.fromThrowable(async () => {
      return getUploadAuthParams({
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY as string,
      });
    })();

    if (authResult.isErr()) {
      return errAsync((authResult.error as Error).message);
    }

    const uploadResponse = await ResultAsync.fromThrowable(async () => {
      const arrayBuffer = await props.file.arrayBuffer();
      return imageKit.upload({
        file: Buffer.from(arrayBuffer),
        fileName: props.file.name, // Optionally set a custom file name
      });
    })().mapErr((error) => {
      if (error instanceof ImageKitAbortError) {
        return error.message;
      } else if (error instanceof ImageKitInvalidRequestError) {
        return error.message;
      } else if (error instanceof ImageKitUploadNetworkError) {
        return error.message;
      } else if (error instanceof ImageKitServerError) {
        return error.message;
      } else {
        return (error as Error).message;
      }
    });

    if (uploadResponse.isErr()) return errAsync(uploadResponse.error);
    return okAsync({
      fileId: uploadResponse.value.fileId!,
      fileName: uploadResponse.value.filePath ?? props.file.name,
      fileUrl: imageKit.url({
        path: uploadResponse.value.filePath,
        transformation: [
          {
            format: ".webp",
          },
        ],
      }),
    });
  }
}
