import { Socket } from 'socket.io-client';

export type FakeSOSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

/**
 * Enum representing the possible ordering options for questions.
 * and their display names.
 */
export const orderTypeDisplayName = {
  newest: 'Newest',
  unanswered: 'Unanswered',
  active: 'Active',
  mostViewed: 'Most Viewed',
} as const;

/**
 * Type representing the keys of the orderTypeDisplayName object.
 * This type can be used to restrict values to the defined order types.
 */
export type OrderType = keyof typeof orderTypeDisplayName;

/**
 * Interface representing the follower data for a user, which contains:
 * - uid - The ID of the user being followed
 * - followrs - An array of user IDs who followed the user
 */
export interface FollowData {
  uid: string;
  followers: User[];
}

export interface FollowUpdatePayload {
  uid: string;
  followers: User[];
}

/**
 * Interface representing the possible events that the server can emit to the client.
 */
export interface ServerToClientEvents {
  followUpdate: (user: FollowUpdatePayload) => void;
}

export interface ClientToServerEvents {
  // joinConversation: (conversationId: string) => void;
  // leaveConversation: (conversationId: string) => void;
}

/**
 * Represents a user in the application.
 */
export interface User {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  bio: string;
  picture: string;
  followers: User[];
  following: User[];
  verified: boolean;
  emailNotifications: boolean;
}

export interface EditableUserFields {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  picture: string;
  emailNotifications: boolean;
}

export type ProfileTabs = 'profile' | 'followers' | 'following';
