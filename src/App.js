import { Container } from "react-bootstrap";
import { BrowserRouter as Router,Routes, Route } from "react-router-dom";
import Auditories from "./Auditories";
import Auditory from "./Auditory";
import { NewItem } from "./ItemForm";
import { ItemsList } from "./ItemsList";
import MyNavbar from "./MyNavbar";
import { Welcome } from "./Welcome";

function App() {
  return (
    <Router>
      <div className="App">
        <MyNavbar />
        <Container>
          <Routes>
            <Route path="/auditory/all" element={<Auditories />} />
            <Route path="/auditory/:id/details" element={<Auditory />} />
            <Route path="/auditory/new" element={<Auditory isNew={true}/>} />
            <Route path="/item/new" element={<NewItem isNew={true}/>} />
            <Route path="/item/all" element={<ItemsList/>} />

            <Route path="/" element={<Welcome />} />

          </Routes>
        </Container>

      </div>
    </Router>
  );
}

export default App;
