import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { useAppSelector } from "@/hooks/useStore";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import feedbackService from "./appwrite/feedbackService";
import LoadingSpinner from "./LoadingSpinner";

type FeedbackCardProps = {
  title: string;
  userEmail: string;
  userMaskedEmail: string;
  feedbackId: string;
};

function FeedbackCard({
  title = "Card Title",
  userEmail = "user@email.com",
  userMaskedEmail = "usermaskedemail.com",
  feedbackId,
}: FeedbackCardProps) {
  const { status, userData } = useAppSelector((state) => state.auth);
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const isAuthor = status && userData ? userData?.email === userEmail : false;

  const handleDelete = async () => {
    try {
      setIsDeleteLoading(true);
      return await feedbackService.deleteFeedback({ feedbackId });
    } catch (error) {
      console.log("Error occured :: handleDelete");
      toast.error(error as string);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  return (
    <Card className="block max-w-80 py-4">
      <CardHeader className="px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-foreground text-secondary flex items-center justify-center text-lg font-bold">
            Y
          </div>
          <CardDescription className="font-semibold break-words max-w-52 leading-none">
            {isAuthor ? userEmail : userMaskedEmail}
          </CardDescription>
        </div>

        {isAuthor &&
          (isDeleteLoading ? (
            <LoadingSpinner />
          ) : (
            <Trash2
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700 w-5 h-5 cursor-pointer"
            />
          ))}
      </CardHeader>

      <CardContent className="px-4 pt-3 text-md font-semibold text-muted-foreground">
        <p>{title}</p>
      </CardContent>
    </Card>
  );
}

export default FeedbackCard;
