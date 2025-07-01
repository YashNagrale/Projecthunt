import { FeedbackCard, FeedbackFormAlert, LoadingSpinner } from "@/components";
import feedbackService from "@/components/appwrite/feedbackService";
import { useAppSelector } from "@/hooks/useStore";
import type { Models } from "appwrite";
import { useEffect, useState, type JSX } from "react";
import { toast } from "sonner";

function Feedback(): JSX.Element {
  const { status } = useAppSelector((state) => state.auth);
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
      <div className="p-2">{!status && <FeedbackFormAlert />}</div>
      <div className="min-h-[200px]">
        {loading ? (
          <LoadingSpinner fullPage />
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
