import { ObjectId } from 'mongodb';
import { QueryOptions } from 'mongoose';
import { User, UserListResponse, UserResponse } from '../types';
import UserModel from './users';

/**
 * Saves a new user to the database.
 *
 * @param {User} user - The user to save
 * @returns {Promise<UserResponse>} - The saved user, or an error message if the save failed
 */
export const saveUser = async (user: User): Promise<UserResponse> => {
  try {
    const result = await UserModel.create(user);
    return result;
  } catch (error) {
    return { error: 'Error when saving a user' };
  }
};

/**
 * Fetches and populates a user document based on the user ID.
 *
 * @param {string} uid - The ID of the user to fetch.
 *
 * @returns {Promise<UserResponse>} - Promise that resolves to the populated user,
 *                                    or an error message if the operation fails
 */
export const populateUser = async (uid: string): Promise<UserResponse> => {
  try {
    const result = await UserModel.findOne({ _id: uid }).populate([
      {
        path: 'followers',
        model: UserModel,
      },
      {
        path: 'following',
        model: UserModel,
      },
    ]);

    if (!result) {
      throw new Error(`Failed to fetch and populate a user`);
    }

    return result;
  } catch (error) {
    return { error: `Error when fetching and populating a user: ${(error as Error).message}` };
  }
};

/**
 * Updates the user based on the new data.
 *
 * @param qid The ID of the current user.
 * @param newUserData User data that has been changed.
 * @returns {Promise<UserResponse>} - The edited user, or an error message if the update failed
 */
export const updateUserProfile = async (
  qid: string,
  newUserData: Partial<User>,
): Promise<UserResponse> => {
  try {
    const result = await UserModel.findOneAndUpdate(
      { _id: qid },
      { $set: newUserData },
      { new: true },
    );

    if (result == null) {
      throw new Error('Failed to update user');
    }
    return result;
  } catch (error) {
    return { error: `Error when updating user: ${(error as Error).message}` };
  }
};

/**
 * Adds following to user and follower to followed user.
 *
 * @param currentUser - The current user following target user.
 * @param targetUser - The user being followed.
 * @returns {Promise<UserResponse>} - The new user, or an error message if the update failed
 */
export const addFollowToUser = async (
  currentUserId: string,
  targetUserId: string,
): Promise<UserResponse> => {
  try {
    const isFollowing = await UserModel.exists({ _id: currentUserId, following: targetUserId });

    const followingUser = await UserModel.findOneAndUpdate(
      { _id: currentUserId },
      isFollowing ? { $pull: { following: targetUserId } } : { $push: { following: targetUserId } },
      { new: true },
    );

    if (followingUser == null) {
      throw new Error(`Failed to update user following: ${followingUser}`);
    }

    const followerUser = await UserModel.findOneAndUpdate(
      { _id: targetUserId },
      isFollowing
        ? { $pull: { followers: currentUserId } }
        : { $push: { followers: currentUserId } },
      { new: true },
    );

    if (followerUser == null) {
      throw new Error('Failed to update user following');
    }

    return followerUser;
  } catch (error) {
    return { error: `Error when following: ${(error as Error).message}` };
  }
};

/**
 * Finds users based on search filter.
 *
 * @returns {User[]} - The list of users.
 */
export const findUsers = async (search: string): Promise<User[]> => {
  try {
    const ulist = await UserModel.find({ username: { $regex: `^${search}`, $options: 'i' } });
    return ulist;
  } catch (error) {
    return [];
  }
};

/**
 * Gets a user by their username.
 *
 * @param username The username of the user to fetch.
 * @returns {Promise<UserResponse>} - The user, or an error message if the fetch failed
 */
export const getUserByUsername = async (username: string): Promise<UserResponse> => {
  try {
    const result = await UserModel.findOne({ username });

    if (result === null) {
      throw new Error('User does not exist');
    }

    return result.toObject();
  } catch (error) {
    return { error: 'Error when fetching user' };
  }
};

/**
 * Gets a user by their object id.
 *
 * @param id The id of the user to fetch.
 * @returns {Promise<UserResponse>} - The user, or an error message if the fetch failed
 */
export const getUserById = async (id: string): Promise<UserResponse> => {
  try {
    const result = await UserModel.findOne({ _id: id });

    if (result === null) {
      throw new Error('User does not exist');
    }

    return result.toObject();
  } catch (error) {
    return { error: 'Error when fetching user' };
  }
};

/**
 * Deletes a user by their object id.
 *
 * @param id The id of the user to delete.
 * @returns {Promise<UserResponse>} - The deleted user, or an error message if the fetch failed
 */
export const deleteUserById = async (id: string): Promise<UserResponse> => {
  try {
    const result = await UserModel.findByIdAndDelete(id);

    if (result === null) {
      throw new Error('User does not exist');
    }

    return result.toObject();
  } catch (error) {
    return { error: 'Error when deleting user' };
  }
};

/**
 * Gets a user by their object id.
 *
 * @param id The id of the user to verify.
 * @returns {Promise<UserResponse>} - The user, or an error message if the fetch failed
 */
export const verifyUser = async (id: string): Promise<UserResponse> => {
  try {
    const result = await UserModel.findOneAndUpdate(
      { _id: id },
      { $set: { verified: true } },
      { new: true },
    );

    if (result === null) {
      throw new Error('User does not exist');
    }

    return result.toObject();
  } catch (error) {
    return { error: 'Error when fetching user' };
  }
};

/**
 * Gets a list of users based on the provided usernames.
 *
 * @param usernames The usernames of the users to fetch.
 * @returns {Promise<UserListResponse>} - The list of users, or an error message if the fetch failed
 */
export const getUsersByUsernames = async (usernames: string[]): Promise<UserListResponse> => {
  try {
    const users = await UserModel.find({ username: { $in: usernames } });
    return users.map(user => user.toObject());
  } catch (error) {
    return { error: 'Error when fetching users' };
  }
};
