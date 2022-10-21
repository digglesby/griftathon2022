import * as admin from 'firebase-admin';

export type GroupMember = {
  uid: string,
  location: admin.firestore.GeoPoint,
  lastUpdated: number,
  active: boolean,
  geohash: string,
  lastNotificationTime?: number,
  lastNotificationLocations?: {
      [key: string]: admin.firestore.GeoPoint
  }
}

export type Group = {
  createdBy: string,
  timeCreated: number,
  members: {
    [key: string]: GroupMember
  }
}

export type UserData = {
  firstLogin: boolean,
  lastLogin: number,
  displayName: string,
  profilePicToken: string,
  providerId: string,
  phoneNumber?: string,
  email?: string,
  currentGroup?: string,
  pushToken?: string
}

//Push token
//Display name
//Last Login

export type Chat = {
  geohash: string,
  position: admin.firestore.GeoPoint,
  createdAt: number,
  lastMessageTime: number,
  firstMessage: {
    userId: string,
    text: string,
    imageToken?: string
  }
}

export enum CHAT_ROOM_TYPE {
  MAP_CHAT = "MAP_CHAT",
  BUDDY_GROUP = "BUDDY_GROUP"
}

export type Message = {
  userId: string,
  text: string,
  imageToken?: string,
  chatRoomId: string,
  chatRoomType: CHAT_ROOM_TYPE,
  timeSent: number
}

export enum IMAGE_TOKEN_STATE {
  WAITING_FOR_IMAGE = "WAITING_FOR_IMAGE",
  IMAGE_PROCESSING = "IMAGE_PROCESSING",
  IMAGE_PROCESSED = "IMAGE_PROCESSED"
}

export type ImageToken = {
  requestedBy: string,
  timeRequested: number,
  expires: number,
  state: IMAGE_TOKEN_STATE,
  mimeType: string,
  version: string,
  processedImages?: {
    [key: string]: {
      size: [number, number],
      url: string
    }
  },
  imageContent?: {}
  aspectRatio?: number
}