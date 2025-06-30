import { Client, Databases, ID } from "appwrite";
import config from "./config";

type FeedbackServiceCredentials = {
  title: string;
  userId: string;
  userEmail: string;
  feedbackId: string;
};

export class FeedbackService {
  client = new Client();
  databases: Databases;

  constructor() {
    this.client.setEndpoint(config.appwriteUrl).setProject(config.projectId);

    this.databases = new Databases(this.client);
  }

  async createFeedback({
    title,
    userId,
    userEmail,
  }: FeedbackServiceCredentials) {
    try {
      return this.databases.createDocument(
        config.databaseId,
        config.feedbackCollectionId,
        ID.unique(),
        { title, userId, userEmail }
      );
    } catch (error) {
      console.log("Appwrite service :: createFeedback", error);
      throw error;
    }
  }

  async deleteFeedback({
    feedbackId,
  }: Pick<FeedbackServiceCredentials, "feedbackId">) {
    try {
      return this.databases.deleteDocument(
        config.databaseId,
        config.feedbackCollectionId,
        feedbackId
      );
    } catch (error) {
      console.log("Appwrite service :: deleteFeedback", error);
      throw error;
    }
  }
}

const feedbackService = new FeedbackService();
export default feedbackService;
