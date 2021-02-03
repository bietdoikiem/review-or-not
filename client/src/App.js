import './App.css';
import ReviewCategoryBox from './components/ReviewCategoryBox';
import SentimentGauge from './components/SentimentGauge';

function App() {
  return (
    <div className="App">
      <h1>This is website for ReviewOrNot</h1>
      <SentimentGauge score={-0.5} duration={1}/>
      <ReviewCategoryBox/>
      <br/>
      <br/>
    </div>
  );
}

export default App;
