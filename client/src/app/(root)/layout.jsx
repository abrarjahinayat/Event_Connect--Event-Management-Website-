import Header from "@/components/common/Header";
import EventConnectChatbot from "@/components/EventConnectChatbot";

export default function MainLayout({ children }) {
  return (
    <main>
        <Header/>
        {children}
        <EventConnectChatbot/>
    </main>
  );
}