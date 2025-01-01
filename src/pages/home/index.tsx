import Footer from "components/Footer";
import Header from "components/Header";
import PublicList from "components/Public/PublicList";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container">
      <Header />
      <main className="main-content">
        <h1>Public Page</h1>
        <Link to={"/public/new"}>글쓰기</Link>
        {/* 카드 형식으로 PublicList 렌더링 */}
        <PublicList cardStyle={true} />
      </main>
      <Footer />
    </div>
  );
}
