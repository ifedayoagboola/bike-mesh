import { router } from "expo-router";
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
} from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.cofounders.bikemesh",
  projectId: "6628507b9573ffc6e4ff",
  databaseId: "66286021e7b1eca1d0b4",
  userCollectionId: "6628607a9d684b07352e",
  bikeCollectionId: "662860c0099b53000b46",
  storageId: "6628e29c59d853a103ba",
};

// Init your react-native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectId) // Your project ID
  .setPlatform(config.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// export const { isLoading, isLoggedIn, setIsLoggedIn } = useGlobalContext();

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    if (!newAccount) throw Error;
    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );
    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
export const getCurrentUser = async () => {
  const currentAccount = await account.get();
  if (!currentAccount) throw Error;
  try {
    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentAccount) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
export const logout = async () => {
  try {
    // Delete all sessions for the current user
    await account.deleteSessions();
    return true;
  } catch (error) {
    console.log("Logout error:", error);
    // Even if logout fails, we should still return success to clear local state
    return true;
  }
};
