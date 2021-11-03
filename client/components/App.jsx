import React from 'react';
import axios from 'axios'

function callApi(e) {
  e.preventDefault();
  const postBody = {};
  for (let i = 0; i < e.target.length; i += 1) {
    postBody[e.target[i].name] = e.target[i].value
  }
  axios.post('/api', postBody).then(data => console.log(data))
  // axios.get('/api').then(data => console.log(data))
}

class App extends React.Component {
  render() {
    return (<div>
      <h1>🥸</h1>
      <form onSubmit={callApi}>
        <h3>Walmart username</h3>
        <input name="email" placeholder="Enter Walmart username here" width="300px"/><br />
        <h3>Walmart password</h3>
        <input name="password" type="password" placeholder="Enter Walmart password here" /><br />
        <h3>Walmart URL</h3>
        <input name="url" placeholder="Enter URL for Playstation model here"/><br />
        <h3>CVV</h3>
        <input name="cvvVal" placeholder="Enter CVV here" /><br />
        <button type="submit">Start bot</button>
      </form>
      </div>);
  }
}

export default App;
