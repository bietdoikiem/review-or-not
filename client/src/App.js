import "./App.css";
import { Container } from "@material-ui/core";
import Homepage from "./components/homepage";
import Product from './components/product'
import ProductDetailsPage from './pages/productDetailsPage'

function App() {
  return (
    <div className="App">
      <Container maxWidth="md">
        <header>
          
        </header>
        <main>
          <ProductDetailsPage/>
        </main>
      </Container>
    </div>
  );
}

export default App;
