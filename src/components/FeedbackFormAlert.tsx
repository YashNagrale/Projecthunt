import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label, Textarea } from "./ui";
import { useAppSelector } from "@/hooks/useStore";
import { useForm } from "react-hook-form";
import useAsync from "@/hooks/useAsync";
import feedbackService from "./appwrite/feedbackService";
import LoadingSpinner from "./LoadingSpinner";

type FormPropType = {
  title: string;
  userId: string;
  userEmail: string;
  userMaskedEmail: string;
};

export function FeedbackFormAlert() {
  const { status, userData } = useAppSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormPropType>({
    mode: "onChange",
    delayError: 700,
  });

  const { loading, execute } = useAsync(async (feedbackData: FormPropType) => {
    return await feedbackService.createFeedback(feedbackData);
  });

  const submitFeedback = async (formData: FormPropType) => {
    if (userData?.$id && userData?.email) {
      const maskedEmail =
        userData.email.slice(0, 2) + "***@" + userData.email.split("@")[1];
      await execute({
        ...formData,
        userId: userData?.$id,
        userEmail: userData?.email,
        userMaskedEmail: maskedEmail,
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button disabled={!status} variant="outline">
          Submit Feedback
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-h-[90vh]">
        <AlertDialogHeader className="gap-0">
          <AlertDialogTitle>We’d Love to Hear From You</AlertDialogTitle>
          <AlertDialogDescription>
            Share your thoughts or suggestions.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit(submitFeedback)}>
          <div>
            <Label className="py-3" htmlFor="feedback">
              Your Feedback
            </Label>
            <Textarea
              className="h-80 resize-none"
              id="feedback"
              placeholder="Type your feedback here..."
              {...register("title", {
                required: true,
                minLength: {
                  value: 3,
                  message: "Minimum 3 characters required.",
                },
              })}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title?.message}</p>
            )}
          </div>

          <AlertDialogFooter className="py-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button disabled={!isValid} type="submit">
              Submit {loading && <LoadingSpinner />}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
