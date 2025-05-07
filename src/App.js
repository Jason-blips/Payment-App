import "./App.css";
import About from "./components/About";
import Creative from "./components/Creative";
import Home from "./components/Home";
import Nav from "./components/Nav";
import Educations from "./components/Educations"; // ✅ 添加 Educations 组件的导入
import Work from "./components/Work";

function App() {
  return (
    <>
      <Nav />
      <Home />
      <About />
      <Creative />
      <Educations />
      <Work />
    </>
  );
}

export default App;
