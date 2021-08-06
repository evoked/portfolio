import {Main0} from './components/Main0.js'
// import  from 'components/Main1.js'
import {Footer} from './components/Footer.js'
import React, { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [data, setData] = useState({})
  useEffect(() => {
      axios.get('http://localhost:3005/api/details')
      .then(res => setData(res))
      .catch(rej => console.log(rej))
  }, [])
  return ( 
    <div className="App">
      {/* <Header /> */}
      <Main0 props={data}/>
      <Footer />
    </div>
  );
}

export default App;
