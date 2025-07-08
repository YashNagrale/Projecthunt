import React, { useState } from "react";
import PostPreview from "./PostPreview";
import { Button, Input, Textarea } from "../ui";
import { FormProvider, useForm } from "react-hook-form";
import useAsync from "@/hooks/useAsync";
import projectService from "../appwrite/projectService";
import { Link, useNavigate } from "react-router-dom";
import { LoadingSpinner } from "@/components";
import { useAppSelector } from "@/hooks/useStore";
import { useTheme } from "../theme-provider";

type FormValues = {
  title: string;
  link: string;
  description: string;
  project$Id: string;
};

type PostFormProps = {
  post?: FormValues;
};

function PostForm({ post }: PostFormProps): React.JSX.Element {
  const { userData } = useAppSelector((state) => state.auth);
  const { theme } = useTheme();
  const [isCancelDisabled, setIsCancelDisabled] = useState<boolean>(false);
  const navigate = useNavigate();

  const methods = useForm<FormValues>({
    mode: "onChange",
    delayError: 700,
    defaultValues: {
      title: post?.title || "",
      link: post?.link || "",
      description: post?.description || "",
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

  const { loading, execute } = useAsync(async (postData: FormValues) => {
    let dbPost;
    if (post) {
      dbPost = await projectService.updateProject(
        { ...postData },
        post.project$Id
      );
    } else {
      dbPost = await projectService.createProject({
        ...postData,
        userId: userData?.$id as string,
        postedBy: userData?.name,
      });
    }
    if (dbPost) {
      navigate(`/post/${dbPost.$id}`, { replace: true });
    }
  });
  const createPost = async (postData: FormValues) => {
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
            <div className="flex flex-col gap-y-2">
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
                  required: "Title is required",
                  validate: (value) =>
                    value.trim().length >= 5 ||
                    "Minimum 5 non-space characters required",
                  maxLength: {
                    value: 100,
                    message: "Maximum 100 characters allowed.",
                  },
                })}
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title?.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-y-2">
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
                  required: "Description is required",
                  validate: (value) =>
                    value.trim().length >= 10 ||
                    "Minimum 10 non-space characters required",
                  maxLength: {
                    value: 500,
                    message: "Maximum 500 characters allowed.",
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
              <Link to={`/@${userData?.name}`}>
                <Button
                  disabled={isCancelDisabled}
                  variant="outline"
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                disabled={!isDirty || !isValid}
                className={`cursor-pointer ${
                  !isValid ? "opacity-50 cursor-not-allowed" : ""
                }`}
                type="submit"
              >
                {post ? "Update" : "Post"}{" "}
                {loading ? (
                  <LoadingSpinner
                    classes={`${theme === "light" ? "text-white" : ""}`}
                  />
                ) : (
                  ""
                )}
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
