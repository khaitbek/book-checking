"use client";

import { ImageUploadWidget } from "@/components/widgets/image-upload";
import { User } from "@/core/domain/entities/user";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { mutate } from "../api/mutation";
import { useStore } from "../model/store";

type Props = {
  author: Pick<User, "id" | "name">;
};

export function Form(props: Props) {
  const store = useStore();
  const router = useRouter();
  const mutation = useMutation({
    mutationKey: ["upload-author-image", props.author.id],
    mutationFn: async ({ file }: { file: File }) => {
      const loader = toast.loading("Uploading...", {
        id: `upload-author-image-${props.author.id}`,
        richColors: true
      });
      const result = await mutate({
        authorId: props.author.id,
        file,
      });
      if (result.success === false) {
        return toast.error(result.error);
      }
      toast.success("Successfully updated!");
      store.close();
      router.refresh();
      toast.dismiss(loader);
    },
    onSettled() {
      toast.dismiss(`upload-author-image-${props.author.id}`);
    },
    onError(error, variables, onMutateResult, context) {
      toast.error(error.message);
    },
  });

  return (
    <section>
      <ImageUploadWidget
        onImageCropped={(image) => {
          const file = new File(
            [image],
            `${props.author.name.toLowerCase()}-cover`,
            {
              type: image.type,
              lastModified: new Date().getTime(),
            },
          );
          mutation.mutate({
            file,
          });
        }}
      />
    </section>
  );
}
