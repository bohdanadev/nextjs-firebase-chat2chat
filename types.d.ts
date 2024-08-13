import { FieldValue } from "firebase/firestore";

export interface IAuth {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IUser {
  id?: string;
  avatarUrl: string;
  name: string;
  email: string;
}

interface IUsersData {
  [key: string]: IUser;
}

export interface IChatRoom {
  id?: string;
  users: string![];
  usersData: IUsersData;
  timestamp: Date;
  lastMessage: string;
  myData?: IUser;
  otherData?: IUser;
}

export interface IMessage {
  id?: string;
  sender: Pick<IUser, "id">;
  avatarUrl: Pick<IUser, "avatarUrl">;
  image?: string;
  content?: string;
  time: Date;
}
