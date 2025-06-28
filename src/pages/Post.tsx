import useAsync from "@/hooks/useAsync";
import dummyImg from "../assets/dummy-img.jpg";
import { Badge, Button, Input } from "@/components/ui";
import { ExternalLinkIcon, Trash2 } from "lucide-react";
import { useEffect, type JSX } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import projectService from "@/components/appwrite/projectService";
import { LoadingSpinner } from "@/components";
import commentService from "@/components/appwrite/commentService";

type CommentType = {
  title: string;
};

function Post(): JSX.Element {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CommentType>({
    mode: "onChange",
    delayError: 600,
  });

  const { project$Id } = useParams();

  const {
    data: pageData,
    loading: pageDataLoading,
    execute: pageDataExecute,
  } = useAsync(async (id: string) => {
    const project = await projectService.getProject({ project$Id: id });
    return project;
  });

  const {
    data: commentData,
    loading: commentDataLoading,
    execute: commentDataExecute,
  } = useAsync(async (id: string) => {
    return await commentService.listComments({ project$Id: id });
  });

  useEffect(() => {
    if (project$Id) {
      pageDataExecute(project$Id);
      commentDataExecute(project$Id);
    }
  }, [project$Id, navigate, pageDataExecute, commentDataExecute]);

  const { loading: addCommentLoading, execute: addCommentExecute } = useAsync(
    async (commentFormData: CommentType) => {
      const session = await commentService.createComment(commentFormData);
      if (session && project$Id) {
        await commentDataExecute(project$Id);
      }
    }
  );

  const commentInput = document.getElementById("comment") as HTMLInputElement;

  const addComment = async (formData: CommentType) => {
    await addCommentExecute(formData);
    if (commentInput) {
      commentInput.value = "";
    }
  };

  const { loading: deleteCommentLoading, execute: deleteCommentExecute } =
    useAsync(async (commentId: string) => {
      return await commentService.deleteComment({ comment$Id: commentId });
    });

  const deleteComment = async (commentId: string) => {
    if (commentId) {
      await deleteCommentExecute(commentId);
    }
  };

  // TODO: Delete post, toogle like, image, navigation remaining

  return pageDataLoading ? (
    <LoadingSpinner fullPage />
  ) : (
    <div className="px-2 py-2 space-y-2 h-full flex flex-col justify-between">
      <div>
        <div id="img" className="relative">
          <Badge className="absolute left-2 top-2 text-center font-semibold cursor-default select-none">
            Clicks: {pageData?.clicks || 0}
          </Badge>
          <img
            src={dummyImg}
            className={`rounded-2xl border w-full object-cover h-60`}
            alt="projectImg"
          />
          <div
            id="btnActions"
            className={`absolute p-1 top-1 right-1 flex gap-1`}
          >
            <Button
              variant={"outline"}
              className="cursor-pointer font-semibold backdrop-blur-2xl"
            >
              Edit
            </Button>
            <Button className="bg-red-800 hover:bg-red-900 cursor-pointer font-semibold backdrop-blur-2xl">
              Delete
            </Button>
          </div>
          <div className="flex gap-1 absolute right-2 bottom-2">
            <Button
              variant={"outline"}
              className="backdrop-blur-2xl font-semibold"
            >
              Visit <ExternalLinkIcon />{" "}
            </Button>
            <Button
              variant={"outline"}
              className="backdrop-blur-2xl font-semibold"
            >
              Like: {pageData?.likes.length || 0}
            </Button>
            <a href="#comment">
              <Button
                variant={"outline"}
                className="backdrop-blur-2xl font-semibold"
              >
                Comment: {pageData?.comments.length || 0}
              </Button>
            </a>
          </div>
        </div>
        <div id="projectData" className="py-1">
          <h1 className="text-primary text-3xl font-bold">
            {pageData?.title || "Project title"}
          </h1>
          <p className="text-md text-muted-foreground">
            {pageData?.description ||
              `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis
            similique maxime consequatur. Lorem ipsum dolor sit amet consectetur
            adipisicing elit.`}
          </p>
        </div>
      </div>

      <div className="border-2 rounded-xl px-2 py-2 space-y-3">
        <form onClick={handleSubmit(addComment)} className="flex gap-2 m-0">
          <Input
            id="comment"
            type="title"
            placeholder="Leave a comment..."
            className="flex"
            {...register("title", {
              minLength: {
                value: 1,
                message: "Minimum 1 characters are required.",
              },
              maxLength: {
                value: 250,
                message: "Maximum 250 characters are required.",
              },
            })}
          />
          <Button
            // TODO: Fix needed on disabled action
            disabled={!isValid || addCommentLoading}
            type="submit"
            variant="outline"
          >
            Comment
          </Button>
        </form>
        {errors.title && (
          <p className="text-red-500 text-sm py-1.5 m-0">
            {errors.title?.message}
          </p>
        )}

        <ul className="space-y-1">
          {commentData?.documents.map((doc) => {
            const comment = doc as unknown as { text: string; $id: string };
            return (
              <li
                key={comment.$id}
                className="border-b px-1 py-2 flex justify-between items-center"
              >
                {commentDataLoading ? (
                  <LoadingSpinner classes="m-auto" size={25} />
                ) : (
                  <>
                    <p className=" text-sm text-muted-foreground">
                      {comment?.text}
                    </p>
                    {deleteCommentLoading ? (
                      <LoadingSpinner size={20} />
                    ) : (
                      <Trash2
                        onClick={() => deleteComment(comment.$id)}
                        className="text-red-600 hover:text-red-700 w-5 font-bold"
                      />
                    )}
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default Post;
