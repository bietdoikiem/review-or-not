import "./App.css";
import { Container } from "@material-ui/core";
import Homepage from "./components/homepage";
import Product from './components/product'
import ProductDetailsPage from './pages/productDetailsPage'
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";

const theme = createMuiTheme({
  typography: {
    fontFamily: ["Athiti"].join(","),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
    <div className="App">
      <header id="head">
          
      </header>
      <Container maxWidth="lg">
        <main>
          {/* <Homepage /> */}
          <ProductDetailsPage />
        </main>
      </Container>
    </div>
    </ThemeProvider>
  );
}

export default App;
