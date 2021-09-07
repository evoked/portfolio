import {Main0} from './components/Main0.js'
// import  from 'components/Main1.js'
import {Header} from './components/Header.js'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {Button} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  const [data, setData] = useState({})
  useEffect(() => {
      axios.get('http://localhost:4002/api/details')
      .then(res => setData(res))
      .catch(rej => console.log(rej))
  }, [])
  return ( 
    <div className="App">
      <Header />
      <Button>Blah</Button>
      <Main0 props={data}/>
      {/* <Footer /> */}
    </div>
  );
}

export default App;
