import { LoadingSpinner, PostCard, SkeletonProjectCard } from "@/components";
import commentService from "@/components/appwrite/commentService";
import projectService from "@/components/appwrite/projectService";
import { setLikes } from "@/features/likeSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { type Models } from "appwrite";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function Dashboard() {
  const { status, userData } = useAppSelector((state) => state.auth);
  const [projects, setProjects] = useState<Models.Document[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  type LikeState = {
    [projectId: string]: {
      count: number;
      hasLiked: boolean;
    };
  };
  useEffect(() => {
    document.title = "Project | Dashboard";

    const fetchUserProjects = async () => {
      if (!status || !userData) return;

      try {
        setLoading(true);

        const projectsRes = await projectService.listUserProjects(userData.$id);

        const projectsWithComments = await Promise.all(
          projectsRes.documents.map(async (project) => {
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

        const likeState: LikeState = {};
        projectsRes.documents.forEach((project) => {
          likeState[project.$id] = {
            hasLiked: project.likedBy.includes(userData.$id),
            count: project.likesCount,
          };
        });

        dispatch(setLikes(likeState));
      } catch (error) {
        toast.error("Something went wrong");
        console.log("Error :: fetching user projects", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProjects();
  }, [userData, status, dispatch]);

  const skeletonCount = projects?.length || 2;
  return (
    <main
      style={{ scrollbarWidth: "none" }}
      className={`space-y-6 overflow-scroll h-full`}
    >
      <section
        style={{ scrollbarWidth: "none" }}
        className={`w-full overflow-y-auto h-[80%] m-0`}
      >
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 px-2 py-3 place-items-center`}
        >
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
                postedBy={project.postedBy}
              />
            ))}
          {!loading && projects?.length === 0 && (
            <p className="text-muted-foreground py-10 px-1 col-span-full text-center text-4xl font-extrabold">
              {userData?.name
                ? `Welcome, ${userData.name
                    .charAt(0)
                    .toUpperCase()}${userData.name.slice(1)}!`
                : "Welcome!"}
              <br />
              You don’t have any project
            </p>
          )}
        </div>
      </section>

      <div className="border mx-1 my-2"></div>

      <section className="px-2 py-3">
        <div className="flex-1 overflow-y-auto rounded-xl border border-border bg-background px-3 py-2 hide-scrollbar">
          <div className="sticky top-0 z-10 bg-background  border-b">
            <div className="flex justify-between items-center pt-1 pb-2">
              <h2 className="text-md font-semibold text-muted-foreground">
                Total Projects
              </h2>
              <span className="text-muted-foreground text-md px-1">
                {projects?.length}
              </span>
            </div>
          </div>

          <table className="w-full table-fixed">
            <thead>
              <tr className="border-b border-muted text-muted-foreground text-sm">
                <th className="text-left py-2 w-1/3">Project</th>
                <th className="text-center py-2 w-1/6">Clicks</th>
                <th className="text-center py-2 w-1/6">Likes</th>
                <th className="text-center py-2 w-1/6">Comments</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4}>
                    <div className="flex justify-center items-center pt-6 pb-4">
                      <LoadingSpinner size={20} />
                    </div>
                  </td>
                </tr>
              ) : projects?.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center pt-6 pb-4 font-semibold text-muted-foreground"
                  >
                    You haven’t added any projects yet.
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr
                    key={project.$id}
                    className="border-b border-muted text-sm font-semibold"
                  >
                    <td className="py-2 text-left truncate max-w-[160px]">
                      {project?.title}
                    </td>
                    <td className="py-2 text-center">
                      {project.clicksCount || 0}
                    </td>
                    <td className="py-2 text-center">
                      {project.likesCount || 0}
                    </td>
                    <td className="py-2 text-center">
                      {project.commentsCount || 0}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;
