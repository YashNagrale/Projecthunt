import { PostForm } from "@/components";
import projectService from "@/components/appwrite/projectService";
import { useAppSelector } from "@/hooks/useStore";
import type { Models } from "appwrite";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditPost() {
  const { userData } = useAppSelector((state) => state.auth);
  const { projectId } = useParams();
  const [post, setPost] = useState<Models.Document | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Project | EditPost";

    if (projectId) {
      projectService.getProject({ project$Id: projectId }).then((post) => {
        if (post) {
          setPost({ ...post });
        } else {
          navigate(`/@${userData?.name}`, { replace: true });
        }
      });
    }
  }, [navigate, projectId, userData]);

  return post ? (
    <PostForm
      post={{
        title: post?.title,
        description: post?.description,
        link: post?.link,
        // TODO: maybe cause error try changing with project$Id
        project$Id: post?.$id as string,
      }}
    />
  ) : null;
}

export default EditPost;
