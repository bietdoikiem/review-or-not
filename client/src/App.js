import './App.css';
import ReviewCategoryBox from './components/ReviewCategoryBox';
import SentimentGauge from './components/SentimentGauge';
import { Container } from '@material-ui/core';

function App() {
  return (
		<div className="App">
			<h1>This is website for ReviewOrNot</h1>
			<Container size="sm">
				<SentimentGauge score={0.6} duration={1} /> {/* Input score in range [-1, 1], input duration is in second*/}
        <br/>
				<ReviewCategoryBox />
			</Container>
			<br />
			<br />
		</div>
	);
}

export default App;
