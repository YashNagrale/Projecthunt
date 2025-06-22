import React, { useState } from "react";
import PostPreview from "./PostPreview";
import { Button, Input, Textarea } from "../ui";
import { FormProvider, useForm } from "react-hook-form";
import useAsync from "@/hooks/useAsync";
import projectService from "../appwrite/projectService";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "@/components";
import { useAppSelector } from "@/hooks/useStore";

type FormInput = {
  title: string;
  link: string;
  description: string;
  project$Id: string;
  userId?: string;
  $id: string;
};

type PostFormProps = {
  post: FormInput;
};

function PostForm({ post }: PostFormProps): React.JSX.Element {
  const { userData } = useAppSelector((state) => state.auth);
  const [isCancelDisabled, setIsCancelDisabled] = useState<boolean>(false);
  const navigate = useNavigate();

  const methods = useForm<FormInput>({
    mode: "onChange",
    delayError: 800,
    defaultValues: {
      title: post?.title || "",
      link: post?.link || "",
      description: post?.description || "",
      project$Id: post?.$id,
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isDirty },
  } = methods;

  const rawLink = watch("link");

  const getPreviewLink = (link: string): string => {
    const trimmed = link.trim();
    const isValid =
      /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/.test(trimmed);
    if (!isValid) return "";

    return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
  };

  const validLink = getPreviewLink(rawLink);

  const { loading, execute } = useAsync(async (postData: FormInput) => {
    let dbPost;
    if (post) {
      dbPost = await projectService.updateProject(postData);
    } else {
      dbPost = await projectService.createProject({
        ...postData,
        userId: (userData as { $id: string })?.$id,
      });
    }
    if (dbPost) {
      navigate(`/post/${dbPost.$id}`);
    }
  });
  const createPost = async (postData: FormInput) => {
    setIsCancelDisabled(true);
    try {
      await execute(postData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsCancelDisabled(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="md:flex-row flex flex-col flex-1 w-full gap-2 p-2 h-full">
        <div
          style={{ scrollbarWidth: "none" }}
          className="border-2 overflow-x-hidden overflow-y-scroll w-full p-2 rounded-xl flex-1 "
        >
          <form
            onSubmit={handleSubmit(createPost)}
            className="py-1  flex flex-col gap-y-3 h-full"
          >
            <div className=" flex flex-col gap-y-2">
              <label
                htmlFor="titleInput"
                className="font-lg text-muted-foreground font-semibold"
              >
                Project title:
              </label>
              <Input
                type="text"
                id="titleInput"
                placeholder="Enter here..."
                {...register("title", {
                  required: true,
                  minLength: {
                    value: 3,
                    message: "minimum 3 characters are required.",
                  },
                })}
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title?.message}</p>
              )}
            </div>
            <div className=" flex flex-col gap-y-2">
              <label
                htmlFor="linkInput"
                className="font-lg text-muted-foreground font-semibold"
              >
                Project link:
              </label>
              <Input
                id="linkInput"
                placeholder="Enter here..."
                {...register("link", {
                  required: true,
                  validate: (value) => {
                    const trimmed = value.trim();
                    const isValid =
                      /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/.test(
                        trimmed
                      );
                    return (
                      isValid ||
                      "Enter a valid link (e.g., example.com or https://example.com)"
                    );
                  },
                })}
              />
              {errors.link && (
                <p className="text-red-500 text-sm">{errors.link?.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-y-2 h-full">
              <label
                htmlFor="descriptionInput"
                className="font-lg text-muted-foreground font-semibold"
              >
                Project description:
              </label>
              <Textarea
                id="descriptionInput"
                placeholder="Enter here..."
                className="grow resize-y"
                {...register("description", {
                  required: true,
                  minLength: {
                    value: 10,
                    message: "Minimum 10 characters required.",
                  },
                  maxLength: {
                    value: 1000,
                    message: "Maximum 1000 characters allowed.",
                  },
                })}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description?.message}
                </p>
              )}
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button
                disabled={isCancelDisabled}
                variant="outline"
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                disabled={!isDirty || !isValid}
                className={`cursor-pointer ${
                  !isValid ? "opacity-50 cursor-not-allowed" : ""
                }`}
                type="submit"
              >
                {post ? "Update" : "Post"} {loading ? <LoadingSpinner /> : ""}
              </Button>
            </div>
          </form>
        </div>
        <PostPreview previewLink={validLink} />
      </div>
    </FormProvider>
  );
}

export default PostForm;
