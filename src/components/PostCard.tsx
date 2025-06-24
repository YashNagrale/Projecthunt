import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import dummyImg from "../assets/dummy-img.jpg";
import { Badge, Button } from "./ui";
import { ExternalLinkIcon } from "lucide-react";
import { useTheme } from "./theme-provider";

export function PostCard() {
  const { theme } = useTheme();
  return (
    <Card className="w-full max-w-md border-2 rounded-xl mx-auto mt-16 p-0 pb-1 gap-2">
      <CardHeader className="block relative rounded-2xl border-b-2 p-0">
        <Badge
          className="absolute top-1 left-1 shadow-2xl z-10"
          variant={"default"}
        >
          <p className="font-semibold">Clicks: 0</p>
        </Badge>

        <img
          className={`rounded-2xl w-full h-48 object-cover ${
            theme === "dark" ? "invert-0" : "invert-100"
          }`}
          src={dummyImg}
        />
        <Button
          variant={"outline"}
          className="absolute top-1 right-1 rounded-lg shadow-2xl shadow-black"
        >
          View{<ExternalLinkIcon />}
        </Button>
      </CardHeader>

      <CardContent className="px-2 pb-3 space-y-1 border-b-2">
        <CardTitle className="text-xl font-semibold">
          Social media platform
        </CardTitle>

        <CardDescription className="text-md pt-1 overflow-hidden line-clamp-3 h-20">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur
          corrupti, saepe soluta tempora recusandae et maxime distinctio
          officiis. Sit, optio. Dignissimos eius odit sequi. Optio harum a
          possimus molestiae aspernatur.
        </CardDescription>
      </CardContent>

      <CardFooter className="px-1 flex justify-between text-sm">
        <Button className="rounded-full font-semibold" variant={"outline"}>
          <p className="text-muted-foreground">
            Posted by: <span className="text-secondary-foreground">You</span>
          </p>
        </Button>
        <div className="space-x-1">
          <Button className="rounded-full font-semibold" variant={"outline"}>
            <p className="text-muted-foreground">
              Likes: <span className="text-secondary-foreground">0</span>
            </p>
          </Button>
          <Button className="rounded-full font-semibold" variant={"outline"}>
            <p className="text-muted-foreground">
              Comments: <span className="text-secondary-foreground">0</span>
            </p>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
