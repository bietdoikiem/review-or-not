import "./App.css";
import {BrowserRouter as Router, Switch, Redirect, Route} from 'react-router-dom'
import { Container } from "@material-ui/core";
import Homepage from "./pages/homepage";
import Product from "./pages/product";
import ProductDetailsPage from "./pages/productDetailsPage";
import { createMuiTheme, makeStyles, ThemeProvider } from "@material-ui/core/styles";

const theme = createMuiTheme({
	typography: {
		fontFamily: ["Athiti"].join(","),
	},
});

function App() {
	return (
		<Router>
			<ThemeProvider theme={theme}>
				<div className="App">
					<header id="head"></header>
					<Container maxWidth="lg">
						<main>
                            <Switch>
                                <Route exact path="/" component={Homepage}/>
                                <Route path="/home" component={Homepage}/>
                                <Route path="/search" component={Product}/>
                                <Route path="/product-detail" component={ProductDetailsPage}/>
                            </Switch>
						</main>
					</Container>
				</div>
			</ThemeProvider>
		</Router>
	);
}

export default App;
