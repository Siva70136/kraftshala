import { useState } from "react";
import { ThreeDots } from 'react-loader-spinner';
import { CiTempHigh } from "react-icons/ci";
import { WiHumidity } from "react-icons/wi";
import { GiWindSlap } from "react-icons/gi";
import { FaCloudMoonRain } from "react-icons/fa";

import './index.css';

const Home = () => {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState([]);
    const [loader, setLoader] = useState(false);
    const [error, setError] = useState('');
    const [theme,setTheme]=useState("light");
    const key = process.env.REACT_APP_API_KEY;

    const getLattitude = async (e) => {
        e.preventDefault();
        
        setLoader(true);
        var cities = city.split(',');
        //console.log(key);
        var i = 0;
        try {
           
            while (i < cities.length) {
                const url = `https://api.openweathermap.org/data/2.5/weather?q=${cities[i]}&appid=${key}&units=metric`;
                const response = await fetch(url);
                const data = await response.json();
                console.log(data);
                if (data.cod !== '404') {
                    const timestamp = data.dt;
                    const date = new Date(timestamp * 1000);
                    const month = date.toLocaleString('default', { month: 'long' });
                    const day = date.getDate();
                    const year = date.getFullYear();
                    const hours = date.getHours();
                    const minutes = date.getMinutes();
                    const formattedHours = hours < 10 ? '0' + hours : hours;
                    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
                    const item = {
                        "Name": data.name,
                        "Temp": `${Math.round(data.main.temp)}°C`,
                        "Desc": data.weather[0].description,
                        "WindSpeed": data.wind.speed,
                        "Humidity": data.main.humidity,
                        "Date": `${month} | ${day} | ${year} | ${formattedHours}:${formattedMinutes}`

                    }
                    //console.log(item);
                    setWeather(prevWeather => [...prevWeather, item]);
                    setError(' ');
                    
                }
                else{
                    setError(data.message);
                    
                }
                setCity('');
                i++;
                setLoader(false);
            }

        }
        catch (e) {
            setError("Connection Failed");
        }
    }

    const onTheme=()=>{
        //console.log(theme !=="light");
        if(theme ==="light"){
            setTheme("dark");
        }
        else{
            setTheme("light");
        }
    }

    return (
        <div className="main-container">
            <div className={`app-container ${theme}`}>
                <form className="">
                    <div className="">
                        <p className="head">Location</p>
                        <input type="text" placeholder="Enter City Names using comma separated" className="input-field" value={city} onChange={e => { setCity(e.target.value) }} />
                    </div>
                    <p className="error">{error}</p>
                    <button type="button" className="theme" onClick={onTheme}>{theme==="light"?"Dark":"Light"}</button>
                    <button className="" onClick={e => { getLattitude(e) }}>Enter</button>
                </form>
            </div>
            <div className="cards-container">
                {loader && (
                    <div className="loader-container" data-testid="loader">
                        <ThreeDots color="rgb(35, 195, 248)" height="50" width="50" />
                    </div>
                )}
            </div>
            <div className="cards-container">
                {weather.length !== 0 && (
                    weather.map((each, index) => {
                        return (
                            <div key={index} className="card">
                                <div className="top-section">
                                    <p className="top-text">{each.Temp}</p>
                                    <p className="top-text">{each.Desc}</p>
                                </div>
                                <FaCloudMoonRain className="cloud" />
                                <div className="middle-section">
                                    <p className="middle-text name">{each.Name}</p>
                                    <p className="middle-text">{each.Date}</p>
                                </div>
                                <div className="inner-card-container">
                                    <div className="inner-card">
                                        <CiTempHigh className="icon" />
                                        <p className="inner-card-text">{each.Temp}</p>
                                    </div>
                                    <div className="inner-card">
                                        <WiHumidity className="icon" />
                                        <p className="inner-card-text">{each.Humidity}%</p>
                                    </div>
                                    <div className="inner-card">
                                        <GiWindSlap className="icon" />
                                        <p className="inner-card-text">{each.WindSpeed}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}

export default Home;