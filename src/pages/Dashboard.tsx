import { PostCard } from "@/components";

function Dashboard() {
  return (
    <main
      style={{ scrollbarWidth: "none" }}
      className="space-y-6 overflow-scroll"
    >
      <section
        style={{ scrollbarWidth: "none" }}
        className="w-full overflow-y-auto h-[80%] m-0"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 px-2 py-3 place-items-center">
          <PostCard />
          <PostCard />
        </div>
      </section>

      <div className="border mx-1 my-2"></div>

      <section className="px-2 py-3">
        <div className="flex-1 overflow-y-auto rounded-xl border border-border bg-background px-3 py-2 hide-scrollbar">
          <div className="sticky top-0 z-10 bg-background  border-b">
            <div className="flex justify-between items-center pt-1 pb-2">
              <h2 className="text-md font-semibold text-muted-foreground">
                Top Projects
              </h2>
              <span className="text-muted-foreground text-md">3</span>{" "}
              {/* Count dynamically */}
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
              <tr className="border-b border-muted text-sm font-semibold">
                <td className="py-2 text-left truncate max-w-[160px]">
                  long-project-title-example
                </td>
                <td className="py-2 text-center">123</td>
                <td className="py-2 text-center">45</td>
                <td className="py-2 text-center">8</td>
              </tr>
              <tr className="border-b border-muted text-sm font-semibold">
                <td className="py-2 text-left truncate max-w-[160px]">
                  focus-tool
                </td>
                <td className="py-2 text-center">76</td>
                <td className="py-2 text-center">12</td>
                <td className="py-2 text-center">4</td>
              </tr>
              <tr className="text-sm font-semibold">
                <td className="py-2 text-left truncate max-w-[160px]">
                  urlshortener
                </td>
                <td className="py-2 text-center">98</td>
                <td className="py-2 text-center">30</td>
                <td className="py-2 text-center">6</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;
