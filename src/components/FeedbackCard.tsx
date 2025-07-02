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
  userId: string;
  title: string;
  userEmail: string;
  userMaskedEmail: string;
  feedbackId: string;
  onDelete: () => void;
};

function FeedbackCard({
  userId,
  title = "Card Title",
  userEmail = "user@email.com",
  userMaskedEmail = "usermaskedemail.com",
  feedbackId,
  onDelete,
}: FeedbackCardProps) {
  const { status, userData } = useAppSelector((state) => state.auth);
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const isAuthor = status && userData ? userData?.$id === userId : false;

  const handleDelete = async () => {
    try {
      setIsDeleteLoading(true);
      await feedbackService.deleteFeedback({ feedbackId });
      onDelete?.();
    } catch (error) {
      console.log("Error occured :: handleDelete", error);
      toast.error("Delete failed");
    } finally {
      setIsDeleteLoading(false);
    }
  };

  return (
    <Card className="block w-full py-4 break-inside-avoid mb-3">
      <CardHeader className="px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="select-none w-8 h-8 rounded-full bg-foreground text-secondary flex items-center justify-center text-lg font-bold">
            {userData?.name.charAt(0).toUpperCase() || "U"}
          </div>
          <CardDescription className="font-semibold break-words max-w-52 leading-none">
            {isAuthor ? userEmail : userMaskedEmail}
          </CardDescription>
        </div>

        {isAuthor &&
          (isDeleteLoading ? (
            <LoadingSpinner size={20} />
          ) : (
            <Trash2
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700 w-5 h-5 cursor-pointer"
            />
          ))}
      </CardHeader>

      <CardContent className="px-4 pt-3 text-sm font-semibold text-muted-foreground">
        <p>{title}</p>
      </CardContent>
    </Card>
  );
}

export default FeedbackCard;
