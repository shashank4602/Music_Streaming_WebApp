import './output.css';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginComponent from './routes/Login';
import SignupComponent from './routes/Signup';
import Home from './routes/Home';
import LoggedInHome from './routes/LoggedInHome';
import UploadSong from './routes/UploadSong';
import MyMusic from './routes/MyMusic';
import { useCookies } from "react-cookie";
import songContext from './context/songContext';
import { useState } from 'react';
import SearchPage from './routes/SearchPage';

function App() {

  const [currentSong, setCurrentSong] = useState(null);
  const [soundPlayed, setSoundPlayed] = useState(null);
  const [isPaused, setIsPaused] = useState(true);
  const [cookie, setCookie] = useCookies(["token"]);
  console.log(cookie.token);

  return (
    <div className="w-screen h-screen font-poppins">
      <BrowserRouter>
        {
          cookie.token ? (
            <songContext.Provider
              value={{
                currentSong,
                setCurrentSong,
                soundPlayed,
                setSoundPlayed,
                isPaused,
                setIsPaused,
              }}
            >
              <Routes>
                <Route path="/" element={<h1>hello</h1>} />
                <Route
                  path="/home"
                  element={<LoggedInHome />}
                />
                <Route
                  path="/myMusic"
                  element={<MyMusic />}
                />
                <Route
                  path="/uploadSong"
                  element={<UploadSong />}
                />
                <Route
                  path="/search"
                  element={<SearchPage />}
                />
                <Route path="*" element={<Navigate to="/home" />} />
              </Routes>
            </songContext.Provider>
          ) : (
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<LoginComponent />} />
              <Route path="/signup" element={<SignupComponent />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          )
        }
      </BrowserRouter>
    </div>
  );
}


export default App;