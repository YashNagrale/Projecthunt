import config from "./config";
import { Account, Client, ID } from "appwrite";

interface AccountCredentials {
  name: string;
  email: string;
  password: string;
}

export class Auth {
  client = new Client();
  account: Account;

  constructor() {
    this.client.setProject(config.projectId);
    this.account = new Account(this.client);
  }

  async createAccount({ email, password, name }: AccountCredentials) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );
      if (userAccount) {
        return this.login({ email, password });
      } else {
        return userAccount;
      }
    } catch (error) {
      console.log("Appwrite service :: createAccount", error);
      throw error;
    }
  }

  async login({ email, password }: Omit<AccountCredentials, "name">) {
    try {
      return this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.log("Appwrite service :: login", error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      console.log("Appwrite service :: getCurrentUser", error);
      throw error;
    }
  }

  async logout() {
    try {
      return await this.account.deleteSessions();
    } catch (error) {
      console.log("Appwrite service :: logout", error);
      throw error;
    }
  }
}

const authService = new Auth();
export default authService;
