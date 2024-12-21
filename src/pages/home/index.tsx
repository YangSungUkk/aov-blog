import Footer from "components/Footer";
import Header from "components/Header";

export default function Home() {
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(`프롬프트가 복사되었습니다.\n\n${text}`);
    });
  };
  
  return (
    <div className="container">
      <Header />
      <main className="main-content">
      <h1>Public Page</h1>
        <div className="grid">
          <div className="card">
            <div className="image-container">
              <img src="/img/sample_1.png" alt="sample_1" />
              <button
                className="copy-button"
                onClick={() => handleCopy("Est placerat in egestas erat")}
              >
                Copy
              </button>
            </div>
            <h3>Est placerat in egestas erat</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
          <div className="card">
            <div className="image-container">
              <img src="/img/sample_2.png" alt="sample_2" />
              <button
                className="copy-button"
                onClick={() => handleCopy("Elit at imperdiet")}
              >
                Copy
              </button>
            </div>
            <h3>Elit at imperdiet</h3>
            <p>
              Fusce dapibus tellus ac cursus commodo, tortor mauris condimentum.
            </p>
          </div>
          <div className="card">
            <div className="image-container">
              <img src="/img/sample_1.png" alt="sample_1" />
              <button
                className="copy-button"
                onClick={() => handleCopy("nullam ac tortor")}
              >
                Copy
              </button>
            </div>
            <h3>nullam ac tortor</h3>
            <p>Donec ullamcorper nulla non metus auctor fringilla.</p>
          </div>
          <div className="card">
            <div className="image-container">
              <img src="/img/sample_2.png" alt="sample_2" />
              <button
                className="copy-button"
                onClick={() => handleCopy("Eros donec")}
              >
                Copy
              </button>
            </div>
            <h3>Eros donec</h3>
            <p>Cras mattis consectetur purus sit amet fermentum.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
