import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "./ui";
import type { JSX } from "react";

export default function SkeletonProjectCard(): JSX.Element {
  return (
    <Card className="w-full sm:max-w-md border-2 rounded-2xl p-0 pb-1 gap-2">
      <CardHeader className="p-0 relative rounded-2xl h-44">
        <Skeleton className="w-full h-44 rounded-2xl" />
      </CardHeader>
      <CardContent className="px-2 pb-3 space-y-2">
        <Skeleton className="h-5 w-3/4 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-5/6 rounded" />
      </CardContent>
      <CardFooter className="px-2 flex justify-between">
        <Skeleton className="h-8 w-24 rounded-full" />
        <div className="space-x-2 flex">
          <Skeleton className="h-8 w-16 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      </CardFooter>
    </Card>
  );
}
