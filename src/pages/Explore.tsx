import { PostCard, SkeletonProjectCard } from "@/components";
import commentService from "@/components/appwrite/commentService";
import projectService from "@/components/appwrite/projectService";
import { useAppSelector } from "@/hooks/useStore";
import type { Models } from "appwrite";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function Explore() {
  const [projects, setProjects] = useState<Models.Document[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { userData } = useAppSelector((state) => state.auth);

  useEffect(() => {
    document.title = "ProjectHunt | Explore";

    const fetchProjects = async () => {
      try {
        setLoading(true);

        const response = await projectService.listProjects();

        if (response) {
          const projectsWithComments = await Promise.all(
            response.documents.map(async (project) => {
              const commentRes = await commentService.listComments({
                project$Id: project.$id,
              });
              return {
                ...project,
                commentsCount: commentRes.total,
              };
            })
          );

          setProjects(projectsWithComments);
        }
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
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2 place-items-center min-h-[200px] ${
        projects.length === 0 ? "flex items-center justify-center" : ""
      }`}
    >
      {loading &&
        Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonProjectCard key={i} />
        ))}

      {!loading && projects?.length === 0 && (
        <p className="col-span-full text-muted-foreground py-10 text-center text-4xl font-extrabold">
          No projects yet.
        </p>
      )}

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
            postedBy={
              userData?.$id === project.userid
                ? userData?.name ?? "user"
                : "user"
            }
          />
        ))}
    </div>
  );
}

export default Explore;
