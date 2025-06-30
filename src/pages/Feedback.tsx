import { FeedbackCard, LoadingSpinner } from "@/components";
import feedbackService from "@/components/appwrite/feedbackService";
import type { Models } from "appwrite";
import { useEffect, useState, type JSX } from "react";
import { toast } from "sonner";

function Feedback(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);
  const [feedbackData, setFeedbackData] = useState<Models.Document[] | null>(
    null
  );

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
    fetchFeedback();
  }, []);
  return (
    <div>
      {loading ? (
        <LoadingSpinner fullPage />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
  );
}

export default Feedback;
