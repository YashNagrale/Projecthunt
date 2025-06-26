import dummyImg from "../assets/dummy-img.jpg";
import { Badge, Button, Input } from "@/components/ui";
import { ExternalLinkIcon, Trash2 } from "lucide-react";
import type { JSX } from "react";

function Post(): JSX.Element {
  return (
    <div className="px-2 py-2 space-y-2 h-full flex flex-col justify-between">
      <div>
        <div id="img" className="relative">
          <img
            src={dummyImg}
            className={`rounded-2xl border w-full object-cover h-60`}
            alt="projectImg"
          />
          <div
            id="btnActions"
            className={`absolute p-1 top-1 right-1 flex gap-1`}
          >
            <Button
              variant={"outline"}
              className="cursor-pointer font-semibold backdrop-blur-2xl"
            >
              Edit
            </Button>
            <Button className="bg-red-800 hover:bg-red-900 cursor-pointer font-semibold backdrop-blur-2xl">
              Delete
            </Button>
          </div>
          <Badge className="absolute left-2 top-2 text-center font-semibold">
            Clicks: 0
          </Badge>
          <div className="flex gap-1 absolute right-2 bottom-2  shadow-2xl shadow-black">
            <Button
              variant={"outline"}
              className="backdrop-blur-2xl font-semibold"
            >
              Visit <ExternalLinkIcon />{" "}
            </Button>
            <Button
              variant={"outline"}
              className="backdrop-blur-2xl font-semibold"
            >
              Like: 0
            </Button>
            <a href="#comment">
              <Button
                variant={"outline"}
                className="backdrop-blur-2xl font-semibold"
              >
                Comment: 0
              </Button>
            </a>
          </div>
        </div>
        <div id="projectData" className="py-1">
          <h1 className="text-primary text-3xl font-bold">Project title</h1>
          <p className="text-md text-muted-foreground">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis
            similique maxime consequatur. Lorem ipsum dolor sit amet consectetur
            adipisicing elit.
          </p>
        </div>
      </div>

      <div id="comment" className="border-2 rounded-xl px-2 py-3 space-y-3">
        <div className="flex gap-2">
          <Input
            id="commentInput"
            type="text"
            placeholder="Enter comment"
            className="flex-1"
          />
          <Button variant="outline">Comment</Button>
        </div>

        <ul className="space-y-1">
          <li className="border-b px-1 py-2 flex justify-between items-center">
            <p className=" text-sm text-muted-foreground">
              Lorem ipsum dolor sit amet consectetur adipisicing.
            </p>
            <Trash2 className="text-red-600 w-5 font-bold" />
          </li>
          <li className="border-b px-1 py-2 flex justify-between items-center">
            <p className=" text-sm text-muted-foreground">
              Lorem ipsum dolor, sit amet consectetur adipisicing.
            </p>
            <Trash2 className="text-red-600 w-5 font-bold" />
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Post;
