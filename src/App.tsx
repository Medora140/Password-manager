import "./scss/main.scss";
import Navbar from "./components/Navbar";

import Footer from "./components/Footer";
import PasswordManager from "./features/passwords/PasswordManager";
function App() {
  return (
    <>
      <div className="body">
        <Navbar />
        <PasswordManager />
      </div>
      <Footer />
    </>
  );
}

export default App;

