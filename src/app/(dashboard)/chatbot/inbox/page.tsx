import { redirect } from "next/navigation";

// Inbox & Leads was removed (its follow-up tools only ran on demo data): old links open Chat Visitors.
// ReassignEnquiryModal stays in this folder for INBOX_TEAMS, used by Reports and Notification Settings.
export default function ChatbotInboxPage() {
  redirect("/chatbot/visitors");
}
