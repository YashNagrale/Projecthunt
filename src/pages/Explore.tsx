import { PostCard, SkeletonProjectCard } from "@/components";
import projectService from "@/components/appwrite/projectService";
import type { Models } from "appwrite";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function Explore() {
  const [projects, setProjects] = useState<Models.Document[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await projectService.listProjects();
        setProjects(response.documents);
      } catch (error) {
        console.error("Error :: fetchProjects", error);
        toast.error("Error on fetching projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);
  const skeletonCount = projects?.length || 3;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2 place-items-center">
      {loading &&
        Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonProjectCard key={i} />
        ))}
      {!loading &&
        projects?.map((project) => (
          <PostCard
            key={project.$id}
            $id={project.$id}
            projectTitle={project.title}
            projectDescription={project.description}
            projectLink={project.link}
            likes={project.likesCount || 0}
            comments={project.commentsCount || 0}
            clicks={project.clicksCount || 0}
            postedBy={project.postedBy || "user"}
          />
        ))}
    </div>
  );
}

export default Explore;
