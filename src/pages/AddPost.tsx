import { Container, PostForm } from "@/components";
import { useEffect } from "react";

function AddPost() {
  useEffect(() => {
    document.title = "Project | AddPost";
  }, []);
  return (
    <Container>
      <PostForm />
    </Container>
  );
}

export default AddPost;
