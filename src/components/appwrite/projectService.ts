import { Client, Databases, ID } from "appwrite";
import config from "./config";

interface ProjectCredentials {
  title: string;
  description: string;
  link: string;
  userId: string;
  project$Id: string;
  likesCount?: number;
  likedBy: string[];
  clicksCount?: number;
  clickedBy?: string[];
}
export class ProjectService {
  client = new Client();
  databases: Databases;

  constructor() {
    this.client.setEndpoint(config.appwriteUrl).setProject(config.projectId);
    this.databases = new Databases(this.client);
  }

  async createProject({
    title,
    description,
    link,
    userId,
  }: Omit<ProjectCredentials, "project$Id">) {
    try {
      return await this.databases.createDocument(
        config.databaseId,
        config.projectCollectionId,
        ID.unique(),
        {
          title,
          description,
          link,
          userId,
          likesCount: 0,
          likedBy: [],
          clicksCount: 0,
          clickedBy: [],
        }
      );
    } catch (error) {
      console.log("Appwrite service :: createProject", error);
      throw error;
    }
  }

  async updateProject({
    title,
    description,
    link,
    project$Id,
  }: Omit<ProjectCredentials, "userId">) {
    try {
      return await this.databases.updateDocument(
        config.databaseId,
        config.projectCollectionId,
        project$Id,
        { title, description, link }
      );
    } catch (error) {
      console.log("Appwrite service :: updateProject", error);
      throw error;
    }
  }

  async deleteProject({ project$Id }: Pick<ProjectCredentials, "project$Id">) {
    try {
      return await this.databases.deleteDocument(
        config.databaseId,
        config.projectCollectionId,
        project$Id
      );
    } catch (error) {
      console.log("Appwrite service :: deleteProject", error);
      throw error;
    }
  }

  async toogleLike({
    project$Id,
    userId,
  }: Pick<ProjectCredentials, "project$Id" | "userId">) {
    try {
      const project = await this.databases.getDocument(
        config.databaseId,
        config.projectCollectionId,
        project$Id
      );

      let likesCount: number = project.likesCount || 0;
      let likedBy: string[] = project.likedBy || [];

      if (likedBy.includes(userId)) {
        likedBy = likedBy.filter((id) => id !== userId);
        likesCount = Math.max(likesCount - 1, 0);
      } else {
        likedBy.push(userId);
        likesCount += 1;
      }

      return await this.databases.updateDocument(
        config.databaseId,
        config.projectCollectionId,
        project$Id,
        { likesCount, likedBy }
      );
    } catch (error) {
      console.log("Appwrite service :: toogleLike", error);
      throw error;
    }
  }

  async projectClicks({
    project$Id,
    userId,
  }: Pick<ProjectCredentials, "project$Id" | "userId">) {
    try {
      const project = await this.databases.getDocument(
        config.databaseId,
        config.projectCollectionId,
        project$Id
      );

      let clicksCount: number = project.clicksCount || 0;
      //TODO: is this works with const
      const clickedBy: string[] = project.clickedBy || [];

      if (!clickedBy.includes(userId)) {
        clickedBy.push(userId);
        clicksCount += 1;
      }

      return await this.databases.updateDocument(
        config.databaseId,
        config.projectCollectionId,
        project$Id,
        { clicksCount, clickedBy }
      );
    } catch (error) {
      console.log("Appwrite service :: projectClicks", error);
      throw error;
    }
  }

  async getProject({ project$Id }: Pick<ProjectCredentials, "project$Id">) {
    try {
      return await this.databases.getDocument(
        config.databaseId,
        config.projectCollectionId,
        project$Id
      );
    } catch (error) {
      console.log("Appwrite service :: getProject", error);
      throw error;
    }
  }

  async listProjects() {
    try {
      return await this.databases.listDocuments(
        config.databaseId,
        config.projectCollectionId
      );
    } catch (error) {
      console.log("Appwrite service :: listProjects", error);
      throw error;
    }
  }
}

const projectService = new ProjectService();
export default projectService;
