import { PostForm } from "@/components";
import { useEffect } from "react";

function AddPost() {
  useEffect(() => {
    document.title = "Project | AddPost";
  }, []);
  return (
    <div>
      <PostForm />
    </div>
  );
}

export default AddPost;
