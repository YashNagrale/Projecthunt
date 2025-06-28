import { Client, Databases, ID, Query } from "appwrite";
import config from "./config";

export interface commentsCredentials {
  title: string;
  project$Id: string;
}

export class CommentService {
  client = new Client();
  databases: Databases;

  constructor() {
    this.client.setEndpoint(config.appwriteUrl).setProject(config.projectId);
    this.databases = new Databases(this.client);
  }

  async createComment({ title }: Pick<commentsCredentials, "title">) {
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

  async deleteComment({ project$Id }: Pick<commentsCredentials, "project$Id">) {
    try {
      return await this.databases.deleteDocument(
        config.databaseId,
        config.commentsCollectionId,
        project$Id
      );
    } catch (error) {
      console.log("Appwrite service :: deleteComment", error);
      throw error;
    }
  }

  async listComments() {
    try {
      return await this.databases.listDocuments(
        config.databaseId,
        config.commentsCollectionId,
        [Query.orderDesc("_createdAt")]
      );
    } catch (error) {
      console.log("Appwrite service :: listComments", error);
      throw error;
    }
  }
}
const commentService = new CommentService();
export default commentService;
