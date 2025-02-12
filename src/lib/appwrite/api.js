import { INewPost, INewUser, IUpdatePost } from "@/types/index.js";
import { ID, Query } from "appwrite";
import { account, avatars, databases, appwriteConfig, storage } from "./config";

export async function createUserAccount(user) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );
    if (!newAccount) {
      throw Error;
    }
    const avatarUrl = avatars.getInitials(user.name);
    const newUser = await saveUserToDb({
      accountId: newAccount?.$id,
      name: newAccount?.name,
      email: newAccount?.email,
      username: user?.username,
      imageUrl: avatarUrl,
    });
    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}
export async function saveUserToDb(user) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      user
    );
    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}
export async function signinAccount(user) {
  try {
    const session = await account.createEmailSession(user.email, user.password);
    return session;
  } catch (error) {
    console.log(error);
    return error;
  }
}
export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) {
      throw Error;
    }
    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("accountId", currentAccount?.$id)]
    );
    if (!currentUser) {
      throw Error;
    }
    return currentUser.documents?.[0];
  } catch (error) {
    console.log(error);
    return error;
  }
}
export async function getUserById(userId) {
  try {
    const currentAccount = await account.get();
    if (!userId) {
      throw Error;
    }
    const userById = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("accountId", userId || currentAccount?.$id)]
    );

    if (!userById) {
      throw Error;
    }
    return userById.documents?.[0];
  } catch (error) {
    console.log(error);
    return error;
  }
}
export async function signOut() {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    console.log(error);
    return error;
  }
}
export async function createPost(post) {
  try {
    const uploadedFile = await uploadFile(post.file[0]);
    if (!uploadedFile) {
      throw Error;
    }
    const fileUrl = getFilePreview(uploadedFile?.$id);
    if (!fileUrl) {
      deleteFile(uploadedFile?.$id);
      throw Error;
    }
    const tags = post?.tags?.replace(/ /g, "").split(",") || [];
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      ID.unique(),
      {
        creator: [post?.userId],
        caption: post?.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile?.$id,
        location: post?.location,
        tags: tags,
      }
    );
    if (!newPost) {
      await deleteFile(uploadedFile?.$id);
      throw Error;
    }
    return newPost;
  } catch (error) {
    console.log(error);
    return error;
  }
}
export async function uploadFile(file) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );
    return uploadedFile;
  } catch (error) {
    console.log(error);
    return error;
  }
}
export function getFilePreview(fileId) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      "top",
      100
    );
    return fileUrl;
  } catch (error) {
    console.log(error);
    return error;
  }
}
export async function deleteFile(fileId) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);
  } catch (error) {
    console.log(error);
    return error;
  }
}
export async function getRecentPosts() {
  const posts = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postsCollectionId,
    [Query.orderDesc("$createdAt"), Query.limit(20)]
  );
  if (!posts) {
    throw Error;
  }
  return posts;
}
export async function likePost(postId, likesArray) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId,
      {
        likes: likesArray,
      }
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}
export async function savePost(userId, postId) {
  try {
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: [userId],
        post: [postId],
      }
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}
export async function deleteSavedPost(savedRecordId) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    );

    if (!statusCode) throw Error;

    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}
export async function getPostById(postId) {
  if (!postId) throw Error;

  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}
export async function updatePost(post) {
  const hasFileToUpdate = post.file.length > 0;

  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    //  Update post
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      post.postId,
      {
        caption: post?.caption,
        imageUrl: image?.imageUrl,
        imageId: image?.imageId,
        location: post?.location,
        tags: tags,
      }
    );

    // Failed to update
    if (!updatedPost) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }

      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (hasFileToUpdate) {
      await deleteFile(post.imageId);
    }

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}
export async function deletePost(postId, imageId) {
  if (!postId || !imageId) return;

  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId
    );

    if (!statusCode) throw Error;

    await deleteFile(imageId);

    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}
export async function getUserPosts(userId) {
  if (!userId) return;

  try {
    const post = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}
export async function getInfinitePosts({ pageParam }) {
  const queries = [Query.orderDesc("$updatedAt"), Query.limit(9)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      queries
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}
export async function searchPosts(searchTerm) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      [Query.search("caption", searchTerm)]
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}
export async function getAllUsers(searchTerm) {
  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      searchTerm
        ? [Query.search("name", searchTerm)]
        : [Query.orderDesc("$createdAt")]
    );
    if (!users) throw Error;

    return users;
  } catch (error) {
    console.log(error);
  }
}
