import Footer from "components/Footer";
import Header from "components/Header";
import PrivateList from "components/Private/PrivateList";
import { Link } from "react-router-dom";

export default function Private() {
  return (
    <div className="container">
      <Header />
      <main className="main-content">
        <h1>Private Page</h1>
        <Link to={"/private/new"}>글쓰기</Link>
        {/* 카드 형식으로 PublicList 렌더링 */}
        <PrivateList cardStyle={true} />
      </main>
      <Footer />
    </div>
  );
}
