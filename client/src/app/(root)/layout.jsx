import Header from "@/components/common/Header";

export default function MainLayout({ children }) {
  return (
    <main>
        <Header/>
        {children}
    </main>
  );
}