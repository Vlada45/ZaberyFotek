import React, {useState} from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './pages/Home/Home';
import Oprojektu from "./pages/O projektu/Oprojektu";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

function App() {

    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>

            <Router>

                <Navbar toggle={toggle}/>

                <Sidebar isOpen={isOpen} toggle={toggle}/>

                <Routes>

                    <Route path="/" element={<Home/>}/>
                    <Route path="o-projektu" element={<Oprojektu/>}/>

                </Routes>

            </Router>
        </>
    );
}


export default App;
