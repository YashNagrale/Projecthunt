import { Client, Databases, ID, Query } from "appwrite";
import config from "./config";

interface CommentsCredentials {
  title: string;
  project$Id: string;
  comment$Id: string;
}

export class CommentService {
  client = new Client();
  databases: Databases;

  constructor() {
    this.client.setEndpoint(config.appwriteUrl).setProject(config.projectId);
    this.databases = new Databases(this.client);
  }

  async createComment({ title }: Pick<CommentsCredentials, "title">) {
    try {
      return await this.databases.createDocument(
        config.databaseId,
        config.commentsCollectionId,
        ID.unique(),
        { title }
      );
    } catch (error) {
      console.log("Appwrite service :: createComment", error);
      throw error;
    }
  }

  async deleteComment({ comment$Id }: Pick<CommentsCredentials, "comment$Id">) {
    try {
      return await this.databases.deleteDocument(
        config.databaseId,
        config.commentsCollectionId,
        comment$Id
      );
    } catch (error) {
      console.log("Appwrite service :: deleteComment", error);
      throw error;
    }
  }

  async listComments({ project$Id }: Pick<CommentsCredentials, "project$Id">) {
    try {
      return await this.databases.listDocuments(
        config.databaseId,
        config.commentsCollectionId,
        [Query.equal("projectid", project$Id), Query.orderDesc("_createdAt")]
      );
    } catch (error) {
      console.log("Appwrite service :: listComments", error);
      throw error;
    }
  }
}
const commentService = new CommentService();
export default commentService;
