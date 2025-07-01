import { Container, PostForm } from "@/components";
import { useEffect } from "react";

function AddPost() {
  useEffect(() => {
    document.title = "Project | AddPost";
  }, []);
  return (
    <Container className="h-full p-0">
      <PostForm />
    </Container>
  );
}

export default AddPost;
