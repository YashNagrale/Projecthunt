import React from "react";
import dummyImg from "../../assets/dummy-img.jpg";
import { useTheme } from "../theme-provider";
import { Button, Input } from "../ui";
import { LucideExternalLink } from "lucide-react";
import { useFormContext } from "react-hook-form";
function PostPreview(): React.JSX.Element {
  const { theme } = useTheme();
  const { watch } = useFormContext();
  const projectTitle = watch("title");
  const projectLink = watch("link");
  const projectDescription = watch("description");

  return (
    <div
      style={{ scrollbarWidth: "none" }}
      className="border-2 overflow-x-hidden overflow-y-scroll w-full p-2 rounded-xl flex flex-col flex-1 gap-2 "
    >
      <div id="imgPreview" className="border-2 rounded-xl">
        <img
          className={`rounded-xl w-full h-52 object-cover ${
            theme === "dark" ? "invert-0" : "invert-100"
          }`}
          src={dummyImg}
          alt="imgpreview"
        />
      </div>
      <div id="titlePreview" className="text-xl font-bold">
        <p>Title: {projectTitle || `My First Project`}</p>
      </div>
      <div id="linkPreview" className="flex gap-x-2">
        <Input
          className="border-2"
          value={projectLink || "https://myproject.com"}
          disabled
        />
        <Button variant={"outline"} className="font-semibold">
          Visit now {<LucideExternalLink />}
        </Button>
      </div>
      <div id="descriptionPreview" className="text-muted-foreground">
        <p>
          <b className="text-foreground">Description:</b>{" "}
          {projectDescription ||
            `My First Project is a beginner-friendly
          web application built to explore and learn modern development
          practices. It comes with a clean layout, responsive design, and simple
          features that demonstrate core concepts. It's perfect for showcasing
          your first steps into full stack development.`}
        </p>
      </div>
    </div>
  );
}

export default PostPreview;
