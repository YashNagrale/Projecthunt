import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import dummyImg from "../assets/dummy-img.jpg";
import { Badge, Button } from "./ui";
import { ExternalLinkIcon, Heart } from "lucide-react";
import { useTheme } from "./theme-provider";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import projectService from "./appwrite/projectService";
import useAsync from "@/hooks/useAsync";
import { toggleLike } from "@/features/likeSlice";

interface PostCardData {
  $id: string;
  clicks: number;
  comments: number;
  likes: number;
  projectTitle: string;
  projectDescription: string;
  postedBy: string;
  projectLink: string;
}

export function PostCard({
  $id,
  clicks = 0,
  comments = 0,
  likes = 0,
  postedBy = "user",
  projectDescription = "Project description",
  projectTitle = "Project title",
  projectLink = "",
}: PostCardData) {
  const { theme } = useTheme();
  const { status, userData } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [projectImg, setProjectImg] = useState(dummyImg);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const dispatch = useAppDispatch();
  const likeState = useAppSelector((state) => state.like[$id] || {});
  const hasLiked = likeState.hasLiked || false;
  const like = likeState.count || 0;

  useEffect(() => {
    if (!projectLink) return;

    const url = `https://api.screenshotone.com/take?url=${projectLink}`;
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
  }, [projectLink, likes]);

  const handleLike = async () => {
    if (!status || !userData) {
      toast.info("Login to like the project");
      return;
    }

    dispatch(toggleLike({ projectId: $id }));

    try {
      await projectService.toogleLike({
        project$Id: $id,
        userId: userData.$id,
      });
    } catch (error) {
      toast.error("Failed to update like");
      console.log("Like error", error);
    }
  };

  const { execute: handleClickExecute } = useAsync(
    async ([projectId, userId]: [string, string]) => {
      return await projectService.projectClicks({
        project$Id: projectId,
        userId,
      });
    }
  );
  const handleClick = async (projectId: string, userId: string) => {
    if (!status || !userData) return;
    if (projectId && userId) {
      await handleClickExecute([projectId, userId]);
    }
  };

  return (
    <Card
      onClick={() => {
        const selectedText = window.getSelection?.()?.toString();
        if (selectedText) return;
        if (status && userData) {
          handleClick($id, userData?.$id);
          navigate(`/post/${$id}`);
        } else {
          toast.info("Login to view the post");
        }
      }}
      className="w-full h-min sm:max-w-md border-2 rounded-2xl p-0 pb-1 gap-2"
    >
      <CardHeader className="block relative rounded-2xl border-b-2 p-0">
        <Badge
          onClick={(e) => e.stopPropagation()}
          className="absolute cursor-default select-none top-1 left-1 shadow-2xl z-10"
          variant={"default"}
        >
          <p className="font-semibold">Clicks: {clicks}</p>
        </Badge>

        {isImageLoading && (
          <LoadingSpinner classes="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10" />
        )}
        <img
          className={`rounded-2xl w-full object-cover h-44 ${
            hasError || projectImg === dummyImg
              ? theme === "dark"
                ? "invert-0"
                : "invert-100"
              : ""
          } ${isImageLoading ? "opacity-60" : ""}`}
          src={projectImg}
        />

        <a href={projectLink} target="_blank" rel="noopener noreferrer">
          <Button
            variant={"secondary"}
            className={`absolute top-1 right-1 rounded-lg shadow-2xl shadow-black h-8 border`}
            onClick={(e) => e.stopPropagation()}
          >
            View{<ExternalLinkIcon />}
          </Button>
        </a>
      </CardHeader>

      <CardContent className="px-2 pb-3 space-y-1 border-b-2">
        <CardTitle className="text-xl text-primary font-semibold m-0">
          {projectTitle}
        </CardTitle>

        <CardDescription className="text-md overflow-hidden line-clamp-3 h-full max-h-[4.3rem]">
          {projectDescription}
        </CardDescription>
      </CardContent>

      <CardFooter className="px-1 flex justify-between">
        <Button
          onClick={(e) => e.stopPropagation()}
          className="rounded-full font-semibold"
          variant={"outline"}
        >
          <p className="text-muted-foreground">
            Post by:{" "}
            <span className="text-secondary-foreground">@{postedBy}</span>
          </p>
        </Button>
        <div className="space-x-1">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleLike();
            }}
            className="rounded-full font-semibold"
            variant={"outline"}
          >
            <p className="text-muted-foreground flex items-center justify-center gap-1">
              <span>Like</span>
              <Heart
                fill={`${hasLiked ? "red" : "var(--secondary)"}`}
                color={`${hasLiked ? "red" : "white"}`}
              />
              <span>:</span>
              <span className="text-secondary-foreground">{like}</span>
            </p>
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              if (status && userData) {
                handleClick($id, userData.$id);
                navigate(`/post/${$id}`);
              } else {
                toast.info("Login to comment on the post");
              }
            }}
            className="rounded-full font-semibold"
            variant={"outline"}
          >
            <p className="text-muted-foreground">
              Comments:{" "}
              <span className="text-secondary-foreground">{comments}</span>
            </p>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
