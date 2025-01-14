import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import Footer from "components/Footer";
import Header from "components/Header";
import PrivateList from "components/Private/PrivateList";

export default function Private() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialCategory = searchParams.get("category") || "Illustration";
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);

  const categories = ["Illustration", "art photography", "fashion model", "product photo"];

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    navigate(`/private?category=${category}`); // URL 업데이트
  };

  return (
    <div className="container">
      <Header />
      <main className="main-content">
        <div className="content-wrapper" style={{ display: "flex" }}>
          {/* 사이드바 메뉴 */}
          <aside
            className="sidebar"
            style={{
              width: "200px",
              marginRight: "20px",
              borderRight: "1px solid #ddd",
              padding: "10px",
            }}
          >
            <h3>Private Category</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {categories.map((category) => (
                <li
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  style={{
                    cursor: "pointer",
                    padding: "10px 0",
                    borderBottom: "1px solid #eee",
                    backgroundColor: selectedCategory === category ? "#f0f0f0" : "transparent",
                    fontWeight: selectedCategory === category ? "bold" : "normal",
                  }}
                >
                  {category}
                </li>
              ))}
            </ul>
          </aside>

          {/* 콘텐츠 */}
          <div style={{ flex: 1 }}>
            <h1>{selectedCategory}</h1>
            <Link to={`/private/new?category=${selectedCategory}`}>글쓰기</Link>
            <PrivateList cardStyle={true} selectedCategory={selectedCategory} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
