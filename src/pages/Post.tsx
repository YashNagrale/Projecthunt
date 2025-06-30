import useAsync from "@/hooks/useAsync";
import dummyImg from "../assets/dummy-img.jpg";
import { Badge, Button, Input } from "@/components/ui";
import { ExternalLinkIcon, Heart, Trash2 } from "lucide-react";
import { useEffect, useState, type JSX } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, Link } from "react-router-dom";
import projectService from "@/components/appwrite/projectService";
import { LoadingSpinner } from "@/components";
import commentService from "@/components/appwrite/commentService";
import { toast } from "sonner";
import { useTheme } from "@/components/theme-provider";
import { useAppSelector } from "@/hooks/useStore";

type CommentType = {
  title: string;
};

function Post(): JSX.Element {
  const { project$Id } = useParams();
  const { theme } = useTheme();
  const [projectImg, setProjectImg] = useState(dummyImg);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [like, setLike] = useState(0);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const { userData } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CommentType>({
    mode: "onChange",
    delayError: 600,
  });

  const { loading: deletePostLoading, execute: deletePostExecute } = useAsync(
    async (projectId: string) => {
      return await projectService.deleteProject({ project$Id: projectId });
    }
  );
  const deletePost = async (projectId: string) => {
    if (projectId) {
      await deletePostExecute(projectId);
      navigate(`/@${userData?.name}`);
    }
  };

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

  useEffect(() => {
    if (!pageData?.link) return;

    const url = `https://api.screenshotone.com/take?url=${pageData?.link}`;
    setIsImageLoading(true);
    setHasError(false);

    const img = new Image();
    img.onload = () => {
      setProjectImg(url);
      setIsImageLoading(false);
    };
    img.onerror = () => {
      setProjectImg(dummyImg);
      setHasError(true);
      setIsImageLoading(false);
      toast.error("Error on getting image");
    };

    img.src = url;
  }, [pageData?.link]);

  useEffect(() => {
    if (pageData && userData) {
      setLike(pageData.likes.length);
      setHasLiked(pageData.likedBy.includes(userData.$id));
    }
  }, [pageData, userData]);

  const handleLike = async (projectId: string, userId: string) => {
    try {
      if (!projectId) return;

      setHasLiked((prev) => !prev);
      setLike((prev) => (hasLiked ? prev - 1 : prev + 1));

      await projectService.toogleLike({
        project$Id: projectId,
        userId,
      });
    } catch (error) {
      setHasLiked((prev) => !prev);
      setLike((prev) => (hasLiked ? prev + 1 : Math.max(prev - 1, 0)));
      console.log("Like error :: handleLike", error);
    }
  };

  const isAuthor =
    pageData && userData ? pageData.userId === userData?.$id : false;

  return pageDataLoading ? (
    <LoadingSpinner fullPage />
  ) : (
    <div className="px-2 py-2 space-y-2 h-full flex flex-col justify-between">
      <div>
        <div id="img" className="relative">
          <Badge className="absolute left-2 top-2 text-center font-semibold cursor-default select-none z-10">
            Clicks: {pageData?.clicks || 0}
          </Badge>

          {isImageLoading && (
            <LoadingSpinner classes="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10" />
          )}
          <img
            className={`rounded-2xl border w-full object-cover h-64 ${
              hasError || projectImg === dummyImg
                ? theme === "dark"
                  ? "invert-0"
                  : "invert-100"
                : ""
            } ${isImageLoading ? "opacity-60" : ""}`}
            src={projectImg}
          />

          {isAuthor && (
            <div
              id="btnActions"
              className={`absolute p-1 top-1 right-1 flex gap-1`}
            >
              <Link to={`/edit-post/${pageData?.$id}`}>
                <Button
                  variant={"secondary"}
                  className="cursor-pointer font-semibold border"
                >
                  Edit
                </Button>
              </Link>
              <Button
                disabled={deletePostLoading}
                onClick={() => {
                  if (project$Id) deletePost(project$Id);
                }}
                className="bg-red-800 hover:bg-red-900 cursor-pointer font-semibold"
              >
                {deletePostLoading ? (
                  <>
                    Delete <LoadingSpinner />
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          )}

          <div className="flex gap-1 absolute right-2 bottom-2">
            <a href={pageData?.link} target="_blank" rel="noopener noreferrer">
              <Button variant={"secondary"} className=" font-semibold border">
                Visit <ExternalLinkIcon />{" "}
              </Button>
            </a>
            <Button
              id="likeBtn"
              onClick={() => {
                if (project$Id && userData?.$id) {
                  handleLike(project$Id, userData?.$id);
                }
              }}
              variant={"secondary"}
              className="font-semibold border"
            >
              <span>Like</span>
              <Heart
                fill={`${hasLiked ? "red" : "var(--secondary)"}`}
                color={`${hasLiked ? "red" : "white"}`}
              />
              <span>:</span> {like}
            </Button>
            <a href="#comment">
              <Button
                variant={"secondary"}
                className="backdrop-blur-2xl font-semibold border"
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
        <form onSubmit={handleSubmit(addComment)} className="flex gap-2 m-0">
          <Input
            id="comment"
            type="title"
            placeholder="Leave a comment..."
            className="flex text-sm"
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
            // TODO: Fix needed on disabled action maybe required: true needed
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

                    {isAuthor &&
                      (deleteCommentLoading ? (
                        <LoadingSpinner size={20} />
                      ) : (
                        <Trash2
                          onClick={() => deleteComment(comment.$id)}
                          className="text-red-600 hover:text-red-700 w-5 font-bold"
                        />
                      ))}
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
