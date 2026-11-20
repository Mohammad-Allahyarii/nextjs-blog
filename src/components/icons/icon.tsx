import type { ComponentType } from "react";
import ArticleIcon from "./article-icon";
import AutoStoriesIcon from "./auto-stories-icon";
import BookmarkIcon from "./bookmark-icon";
import ChatBubbleIcon from "./chat-bubble-icon";
import CloseIcon from "./close-icon";
import DashboardIcon from "./dashboard-icon";
import EditDocumentIcon from "./edit-document-icon";
import EditNoteIcon from "./edit-note-icon";
import EditSquareIcon from "./edit-square-icon";
import ForumIcon from "./forum-icon";
import GroupIcon from "./group-icon";
import InsightsIcon from "./insights-icon";
import LibraryBooksIcon from "./library-books-icon";
import LogoutIcon from "./logout-icon";
import MenuIcon from "./menu-icon";
import NotificationsIcon from "./notifications-icon";
import RuleIcon from "./rule-icon";
import SearchIcon from "./search-icon";
import SettingsIcon from "./settings-icon";
import type { IconProps } from "./icon.types";

export type IconName =
  | "article"
  | "auto_stories"
  | "bookmark"
  | "chat_bubble"
  | "close"
  | "dashboard"
  | "edit_document"
  | "edit_note"
  | "edit_square"
  | "forum"
  | "group"
  | "insights"
  | "library_books"
  | "logout"
  | "menu"
  | "notifications"
  | "rule"
  | "search"
  | "settings";

const icons: Record<IconName, ComponentType<IconProps>> = {
  article: ArticleIcon,
  auto_stories: AutoStoriesIcon,
  bookmark: BookmarkIcon,
  chat_bubble: ChatBubbleIcon,
  close: CloseIcon,
  dashboard: DashboardIcon,
  edit_document: EditDocumentIcon,
  edit_note: EditNoteIcon,
  edit_square: EditSquareIcon,
  forum: ForumIcon,
  group: GroupIcon,
  insights: InsightsIcon,
  library_books: LibraryBooksIcon,
  logout: LogoutIcon,
  menu: MenuIcon,
  notifications: NotificationsIcon,
  rule: RuleIcon,
  search: SearchIcon,
  settings: SettingsIcon,
};

type IconPropsWithName = IconProps & {
  name: IconName;
};

export default function Icon({ name, className }: IconPropsWithName) {
  const Glyph = icons[name];

  return <Glyph className={className} />;
}
