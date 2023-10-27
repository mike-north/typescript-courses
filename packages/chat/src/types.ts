/**
 * A user participating in a chat
 */
export interface IUser {
    id: number;
    username: string;
    name: string;
    iconUrl: string;
  }
   
  /**
   * A chat message
   */
  export interface IMessage {
    id: number;
    teamId: string;
    channelId: string;
    userId: string;
    createdAt: string;
    user: IUser;
    body: string;
  }
   
  /**
   * A team, containing one or more chat channels
   */
  export interface ITeam {
    iconUrl: string;
    name: string;
    id: string;
    channels: IChannel[];
  }
   
  /**
   * A chat channel, containing many chat messages
   */
  export interface IChannel {
    teamId: string;
    name: string;
    description: string;
    id: string;
    messages: IMessage[];
  }