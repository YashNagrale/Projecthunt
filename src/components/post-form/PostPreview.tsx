import React, { useEffect, useState } from "react";
import dummyImg from "../../assets/dummy-img.jpg";
import { useTheme } from "../theme-provider";
import { Button, Input } from "../ui";
import { LucideExternalLink } from "lucide-react";
import { useFormContext } from "react-hook-form";
import LoadingSpinner from "../LoadingSpinner";

type PostPreviewProps = {
  previewLink: string;
};
function PostPreview({ previewLink }: PostPreviewProps): React.JSX.Element {
  const { theme } = useTheme();
  const { watch } = useFormContext();
  const projectTitle: string = watch("title");
  const projectLink: string = watch("link");
  const projectDescription: string = watch("description");
  const [projectImg, setProjectImg] = useState(dummyImg);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!previewLink) return;

    const url = `https://api.screenshotone.com/take?url=${previewLink}`;
    setProjectImg(url);
    setIsImageLoading(true);

    setHasError(false);
  }, [previewLink]);

  return (
    <div
      style={{ scrollbarWidth: "none" }}
      className="border-2 overflow-x-hidden overflow-y-scroll w-full p-2 rounded-xl flex flex-col flex-1 gap-2 "
    >
      <div id="imgPreview" className="border-2 rounded-xl relative">
        {isImageLoading && (
          <LoadingSpinner classes="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        )}
        <img
          className={`rounded-xl w-full h-52 object-cover ${
            hasError || projectImg === dummyImg
              ? theme === "dark"
                ? "invert-0"
                : "invert-100"
              : ""
          } ${isImageLoading ? "opacity-50" : ""}`}
          src={projectImg}
          onLoad={() => {
            setIsImageLoading(false);
          }}
          onError={() => {
            setProjectImg(dummyImg);
            setHasError(true);
            setIsImageLoading(false);
          }}
        />
      </div>
      <div id="titlePreview" className="text-xl font-bold">
        <p>Title: {projectTitle || `Your project title here`}</p>
      </div>
      <div id="linkPreview" className="flex gap-x-2">
        <Input
          className="border-2"
          value={projectLink || "https://example.com"}
          readOnly
        />
        <Button variant={"outline"} className="font-semibold">
          Visit now {<LucideExternalLink />}
        </Button>
      </div>
      <div id="descriptionPreview" className="text-muted-foreground">
        <p>
          <b className="text-foreground">Description:</b>{" "}
          {projectDescription ||
            `This is a preview of your project description. Describe what your project does, its main features, and what makes it useful or interesting. Keep it clear and informative for anyone checking it out.`}
        </p>
      </div>
    </div>
  );
}

export default PostPreview;
