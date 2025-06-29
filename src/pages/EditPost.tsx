import { PostForm } from "@/components";
import projectService from "@/components/appwrite/projectService";
import { useAppSelector } from "@/hooks/useStore";
import type { Models } from "appwrite";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditPost() {
  const { userData } = useAppSelector((state) => state.auth);
  const { project$Id } = useParams();
  const [post, setPost] = useState<Models.Document | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (project$Id) {
      projectService.getProject({ project$Id }).then((post) => {
        if (post) {
          setPost({ ...post });
        } else {
          navigate(`/@${userData?.name}`);
        }
      });
    }
  }, [navigate, project$Id, userData]);

  return (
    <PostForm
      post={{
        title: post?.title,
        description: post?.description,
        link: post?.link,
        // TODO: maybe cause error try changing project$Id or put post.$id
        project$Id: post?.$id as string,
      }}
    />
  );
}

export default EditPost;
