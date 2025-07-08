import useAsync from "@/hooks/useAsync";
import dummyImg from "../assets/dummy-img.jpg";
import { Badge, Button, Input } from "@/components/ui";
import { ExternalLinkIcon, Heart, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState, type JSX } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, Link } from "react-router-dom";
import projectService from "@/components/appwrite/projectService";
import { LoadingSpinner } from "@/components";
import commentService from "@/components/appwrite/commentService";
import { toast } from "sonner";
import { useTheme } from "@/components/theme-provider";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setLikeState } from "@/features/likeSlice";

type CommentType = {
  title: string;
  project$Id: string;
  userId: string;
};

function Post(): JSX.Element {
  const { id } = useParams();
  const { theme } = useTheme();
  const [projectImg, setProjectImg] = useState(dummyImg);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { status, userData } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

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
      navigate(`/@${userData?.name}`, { replace: true });
    }
  };
  const fetchProject = useCallback(
    async (id: string) => await projectService.getProject({ project$Id: id }),
    []
  );
  const fetchComments = useCallback(
    async (id: string) => await commentService.listComments({ project$Id: id }),
    []
  );

  const {
    data: pageData,
    loading: pageDataLoading,
    execute: pageDataExecute,
  } = useAsync(fetchProject);

  const likeState = useAppSelector(
    (state) =>
      state.like[id as string] ?? {
        count: pageData?.likesCount ?? 0,
        hasLiked: pageData?.likedBy.includes(userData?.$id) ?? false,
      }
  );
  const like = likeState.count;
  const hasLiked = likeState.hasLiked;

  const {
    data: commentData,
    loading: commentDataLoading,
    execute: commentDataExecute,
  } = useAsync(fetchComments);

  useEffect(() => {
    if (id) {
      pageDataExecute(id);
      commentDataExecute(id);
    }
  }, [id, pageDataExecute, commentDataExecute]);

  const { loading: addCommentLoading, execute: addCommentExecute } = useAsync(
    async (commentFormData: CommentType) => {
      const session = await commentService.createComment(commentFormData);
      if (session && id) {
        await commentDataExecute(id);
      }
    }
  );

  const commentInput = document.getElementById("comment") as HTMLInputElement;

  const addComment = async (formData: CommentType) => {
    if (!id) return;
    await addCommentExecute({
      ...formData,
      project$Id: id,
      userId: userData?.$id as string,
    });
    if (commentInput) {
      commentInput.value = "";
    }
  };

  const { loading: deleteCommentLoading, execute: deleteCommentExecute } =
    useAsync(async (commentId: string) => {
      return await commentService.deleteComment({ comment$Id: commentId });
    });

  const deleteComment = async (commentId: string) => {
    if (commentId && id) {
      await deleteCommentExecute(commentId);
      await commentDataExecute(id);
    }
  };

  useEffect(() => {
    document.title = `ProjectHunt | ${pageData ? pageData?.title : "Project"}`;
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
  }, [pageData?.link, pageData]);

  const handleLike = async () => {
    if (!status || !userData) {
      toast.info("Login to like the project");
      return;
    }

    try {
      if (id) {
        await projectService.toogleLike({
          project$Id: id,
          userId: userData.$id,
        });
        const updatedProject = await projectService.getProject({
          project$Id: id,
        });

        dispatch(
          setLikeState({
            projectId: id,
            hasLiked: updatedProject.likedBy.includes(userData.$id),
            count: updatedProject.likesCount,
          })
        );
      }
    } catch (error) {
      toast.error("Failed to update like");
      console.log("Like error", error);
    }
  };

  const isAuthor =
    pageData && userData ? pageData.userid === userData?.$id : false;

  return pageDataLoading ? (
    <LoadingSpinner fullPage />
  ) : (
    <div className="px-2 py-2 space-y-2 h-full flex flex-col justify-between">
      <div>
        <div id="img" className="relative">
          <Badge className="absolute left-2 top-2 text-center font-semibold cursor-default select-none z-10">
            Clicks: {pageData?.clicksCount || 0}
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
                  if (id) deletePost(id);
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
              onClick={handleLike}
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
                Comment: {commentData?.total || 0}
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
              required: "Comment cannot be empty.",
              validate: (value) =>
                value.trim().length > 0 || "Comment must contain valid text.",
              maxLength: {
                value: 250,
                message: "Maximum 250 characters allowed.",
              },
            })}
          />
          <Button
            disabled={!isValid || addCommentLoading}
            type="submit"
            variant="outline"
          >
            Comment {addCommentLoading && <LoadingSpinner />}
          </Button>
        </form>
        {errors.title && (
          <p className="text-red-500 text-sm py-1.5 m-0">
            {errors.title?.message}
          </p>
        )}

        <ul className="space-y-1">
          {commentData?.documents.map((doc) => {
            const comment = doc as unknown as {
              text: string;
              $id: string;
              userid: string;
            };
            const isCommentedAuthor = userData?.$id === comment.userid;

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

                    {isCommentedAuthor &&
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
