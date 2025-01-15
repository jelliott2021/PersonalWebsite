import { Request } from 'express';
import { ObjectId } from 'mongodb';
import { Server } from 'socket.io';

export type FakeSOSocket = Server<ClientToServerEvents, ServerToClientEvents>;

/**
 * Interface representing a User document, which contains:
 * - _id - The unique identifier for the user. Optional field.
 * - username - The username of the user.
 * - firstName - The first name of the user.
 * - lastName - The last name of the user.
 * - email - The email address of the user.
 * - password - The password of the user.
 * - bio - A string description of the user.
 * - picture - A string URL of the user's profile picture.
 * - comments - An array of references to `Comment` documents associated with the user.
 * - questions - An array of references to `Question` documents associated with the user.
 * - answers - An array of references to `Answer` documents associated with the user.
 * - followers - An array of references to `User` documents that are following the user.
 * - following - An array of references to `User` documents that the user is following.
 * - notifications - An array of references to `Notification` documents associated with the user.
 */
export interface User {
  _id?: ObjectId;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  bio: string;
  picture: string;
  followers: User[] | ObjectId[];
  following: User[] | ObjectId[];
  verified: boolean;
  emailNotifications: boolean;
}

/**
 * Interface for the request body when adding a new user.
 * - body - The user being added
 */
export interface AddUserRequest extends Request {
  body: User;
}

/**
 * Interface extending the request body when editing a user, which contains:
 * - uid - The unique identifier of the user being edited
 * - newUserData - The new user fields that has been edited
 */
export interface EditUserRequest extends Request {
  body: {
    uid: string,
    newUserData: Partial<User>,
  }
}

export interface GetUserRequest extends Request {
  params: {
    uid: string;
  };
}

export interface AddFollowToUserRequest extends Request {
  body: {
    currentUserId: string;
    targetUserId: string;
  };
}

export interface GetUsersRequest extends Request {
  query: {
    search: string;
  }
}

export interface VerificationRequest extends Request {
  query: {
    code: string;
  }
}

export interface ResendCodeRequest extends Request {
  query: {
    email: string;
  }
}

/**
 * Type representing the possible responses for a User-related operation involving a list of users.
 */
export type UserListResponse = User[] | { error: string };

/**
 * Type representing the possible responses for a User-related operation.
 */
export type UserResponse = User | { error: string };

export interface FollowUpdatePayload {
  uid: string;
  followers: User[];
}

/**
 * Interface representing the possible events that the server can emit to the client.
 */
export interface ServerToClientEvents {
  userUpdate: (user: UserResponse) => void;
  followUpdate: (user: FollowUpdatePayload) => void;
}

export interface ClientToServerEvents {
  // joinConversation: (conversationId: string) => void;
  // leaveConversation: (conversationId: string) => void;
}

/**
 * Interface representing the payload for a login request, which contains:
 * - username - The username of the user.
 * - password - The password of the user.
 */
export interface LoginRequest extends Request {
  body: {
    username: string;
    password: string;
  };
}