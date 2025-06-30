type AppwriteConfig = {
  appwriteUrl: string;
  projectId: string;
  databaseId: string;
  commentsCollectionId: string;
  projectCollectionId: string;
  feedbackCollectionId: string;
};

const config: AppwriteConfig = {
  appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
  projectId: String(import.meta.env.VITE_PROJECT_ID),
  databaseId: String(import.meta.env.VITE_DATABASE_ID),
  commentsCollectionId: String(import.meta.env.VITE_COMMENTS_COLLECTION_ID),
  projectCollectionId: String(import.meta.env.VITE_PROJECT_COLLECTION_ID),
  feedbackCollectionId: String(import.meta.env.VITE_FEEDBACK_COLLECTION_ID),
};

export default config;
