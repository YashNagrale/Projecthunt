import dummyImg from "../assets/dummy-img.jpg";
import { Badge, Button } from "@/components/ui";
import { ExternalLinkIcon } from "lucide-react";
import type { JSX } from "react";

function Post(): JSX.Element {
  return (
    <div className="px-2 py-1 space-y-2 h-full">
      <div id="img" className="relative">
        <img
          src={dummyImg}
          className={`rounded-2xl border w-full object-cover h-60`}
          alt="projectImg"
        />
        <div
          id="btnActions"
          className={`absolute p-1 top-1 right-1 shadow-2xl shadow-black flex gap-1`}
        >
          <Button variant={"outline"} className="cursor-pointer font-semibold">
            Edit
          </Button>
          <Button className="bg-red-700 border-2 border-red-600 hover:bg-red-800 hover:border-red-900 cursor-pointer font-semibold">
            Delete
          </Button>
        </div>
        <Badge className="absolute left-2 bottom-2">Clicks: 0</Badge>
        <div className="flex gap-1 absolute right-2 bottom-2  shadow-2xl shadow-black">
          <Button variant={"outline"}>
            Visit <ExternalLinkIcon />{" "}
          </Button>
          <Button variant={"outline"}>
            <p className="text-muted-foreground font-semibold">
              Like: <span className="text-secondary-foreground">0</span>
            </p>
          </Button>
          <Button variant={"outline"}>
            <p className="text-muted-foreground font-semibold">
              Comment: <span className="text-secondary-foreground">0</span>
            </p>
          </Button>
        </div>
      </div>
      <div id="projectData">
        <h1 className="text-primary text-3xl font-bold">Project title</h1>
        <p className="text-md text-muted-foreground">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis
          similique maxime consequatur.
        </p>
      </div>
    </div>
  );
}

export default Post;
