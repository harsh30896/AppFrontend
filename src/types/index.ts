// User types
export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  lastSeen?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  bio?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  location?: string;
  website?: string;
  isVerified: boolean;
  notificationSettings: NotificationSettings;
}

// Auth types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
  expiresIn: number;
}

// Chat types
export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  messageType: 'TEXT' | 'IMAGE' | 'FILE' | 'AUDIO' | 'VIDEO';
  timestamp: string;
  isRead: boolean;
  isEdited: boolean;
  editedAt?: string;
  replyTo?: string;
  reactions?: MessageReaction[];
  attachments?: Attachment[];
}

export interface MessageReaction {
  id: string;
  messageId: string;
  userId: string;
  emoji: string;
  timestamp: string;
}

export interface Attachment {
  id: string;
  type: 'image' | 'file' | 'audio' | 'video';
  url: string;
  name: string;
  size: number;
  mimeType: string;
}

export interface Conversation {
  id: string;
  name?: string;
  type: 'direct' | 'group';
  participants: string[];
  lastMessage?: ChatMessage;
  lastActivity: string;
  isArchived: boolean;
  isMuted: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
  description?: string;
  createdBy?: string;
}

export interface Group extends Conversation {
  type: 'group';
  name: string;
  description?: string;
  avatar?: string;
  createdBy: string;
  admins: string[];
  members: string[];
  settings: GroupSettings;
}

export interface GroupSettings {
  allowMemberInvites: boolean;
  allowMemberMessages: boolean;
  allowMemberMedia: boolean;
  allowMemberPolls: boolean;
  requireAdminApproval: boolean;
}

// Notification types
export interface NotificationSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  messageNotifications: boolean;
  groupNotifications: boolean;
  callNotifications: boolean;
  mentionNotifications: boolean;
  reactionNotifications: boolean;
}

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  type: 'message' | 'call' | 'mention' | 'reaction' | 'group_invite';
  timestamp: string;
  isRead: boolean;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Chat: { conversationId: string; conversationName?: string };
  Profile: { userId?: string };
  Settings: undefined;
  CreateGroup: undefined;
  GroupSettings: { groupId: string };
  Search: undefined;
  Notifications: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Chats: undefined;
  Groups: undefined;
  Contacts: undefined;
  Profile: undefined;
};

// Component props types
export interface BaseComponentProps {
  style?: any;
  testID?: string;
}

export interface ButtonProps extends BaseComponentProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
}

export interface InputProps extends BaseComponentProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
}

export interface MessageBubbleProps extends BaseComponentProps {
  message: ChatMessage;
  isOwn: boolean;
  showAvatar?: boolean;
  showTime?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  onReaction?: (emoji: string) => void;
}

export interface ConversationItemProps extends BaseComponentProps {
  conversation: Conversation;
  onPress: () => void;
  onLongPress?: () => void;
  onAvatarPress?: () => void;
}

// State types
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface ChatState {
  conversations: Conversation[];
  messages: Record<string, ChatMessage[]>;
  activeConversation: string | null;
  loading: boolean;
  error: string | null;
  typingUsers: Record<string, string[]>;
}

export interface AppState {
  theme: 'light' | 'dark';
  language: string;
  notifications: PushNotification[];
  isOnline: boolean;
  lastSyncTime: string | null;
}
