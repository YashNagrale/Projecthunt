import { FeedbackCard, FeedbackFormAlert, LoadingSpinner } from "@/components";
import feedbackService from "@/components/appwrite/feedbackService";
import { useAppSelector } from "@/hooks/useStore";
import type { Models } from "appwrite";
import { useEffect, useState, type JSX } from "react";
import { toast } from "sonner";

function Feedback(): JSX.Element {
  const { status } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState<boolean>(false);
  const [feedbackData, setFeedbackData] = useState<Models.Document[]>([]);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const feedback = await feedbackService.listFeedbacks();
      if (feedback) {
        setFeedbackData(feedback.documents);
      }
    } catch (error) {
      console.log("Error occured :: feedbacks", error);
      toast.error("Error on fetching feedbacks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleRefresh = () => {
      fetchFeedback();
    };

    fetchFeedback();

    window.addEventListener("refresh-feedback", handleRefresh);

    return () => window.removeEventListener("refresh-feedback", handleRefresh);
  }, []);

  return (
    <div>
      <div className="p-2">{status && <FeedbackFormAlert />}</div>
      <div
        className={`min-h-[200px] ${
          feedbackData.length === 0
            ? "h-full flex items-center justify-center"
            : ""
        }`}
      >
        {loading ? (
          <LoadingSpinner fullPage />
        ) : feedbackData?.length === 0 ? (
          <p className="text-center text-muted-foreground py-10 text-4xl font-extrabold">
            No feedback yet.
          </p>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 gap-3 p-3">
            {feedbackData?.map((item) => (
              <FeedbackCard
                key={item.$id}
                feedbackId={item.$id}
                title={item.title}
                userId={item.userId}
                userEmail={item.userEmail}
                userMaskedEmail={item.userMaskedEmail}
                onDelete={fetchFeedback}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Feedback;
