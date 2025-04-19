class WeatherWidjet {
  constructor(latitude, longitude){
    this._latitude = latitude;
    this._longitude = longitude;
    this._apiKey = 'c0bd5492cadf7707bfc4a4d4d711b66d'; /*
  Внимание: этот ключ используется только в учебных целях.
  Для продакшн-проектов — вынесите ключ в .env файл или на сервер.
*/
    this.apiQuery = `https://api.openweathermap.org/data/2.5/weather?lat=${ this._latitude}&lon=${this._longitude}&appid=${this._apiKey}&units=metric&lang=ru`;
   console.log(this.apiQuery);
    this.widgetHtml = `
     <div id="weather-widget">
    <div id="container-animation">
      <div id="btn">
        <button id="close-btn">×</button>
      </div>     
      <h3 id="city-name"></h3>
      <div id="icon-container">
        <img src="" id="icon">
      </div>
      <div id="info">
        <p id="celcius"></p>
        <p id="sky"></p>
        <p id="wind"></p>
        <p id="feels-like"></p>
      </div>
    </div>
    <button id='show-weather' style="display: none;"> 🌤️</button>
    </div>
`;
    this.injectStyles();
    this.initWidget();
    this.getPromise();

  }

  injectStyles() {
    const styleId = 'weather-widget-styles';
    if (document.getElementById(styleId)) return;
  
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      :root {
  --primary: #4361ee;
  --secondary: #3f37c9;
  --accent: #4895ef;
  --light: #f8f9fa;
  --dark: #212529;
  --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
h3{
text-align: center;
}
#container-animation {
 position: fixed;  
  bottom: 20px;     
  right: 20px;      
  z-index: 1000; 
box-sizing: border-box;
background: white;
border-radius: 20px;
padding: 20px;
width: 200px;
height: 375px;
max-width: 320px;
text-align: center;
border: 2px solid #d0d0d0;
box-shadow: 
  0 4px 6px rgba(67, 97, 238, 0.1), 
  inset 0 1px 2px rgba(0, 0, 0, 0.1); 
transition: all 0.3s ease;
overflow: hidden;
}
#weather-widget::before {
height: 5px; /* Уменьшаем высоту */
top: 2px; /* Смещаем вниз, чтобы не перекрывать границу */
left: 2px;
width: calc(100% - 4px); /* Учитываем границу */
}
#container-animation:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}
#city-name {
  color: var(--dark);
  font-size: 24px;
  font-weight: 600;
  margin-top: 0;
  margin: 0;
  position: relative;
}
#icon {
  width: 100px;
  height: 100px;

  filter: drop-shadow(0 4px 8px rgba(67, 97, 238, 0.3));
  /* animation: float 3s ease-in-out infinite; */
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

#celcius {
  font-size: 48px;
  margin-top: 0;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 10px ;
  position: relative;
  text-align: center;
}

#celcius::after {
  font-size: 24px;
  position: absolute;
  top: 5px;
  right: -20px;
}

#sky, #wind, #feels-like {
  color: var(--dark);
  font-size: 16px;
  margin: 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
#icon-container{
display: flex;
justify-content: center;
}
#sky::before, #wind::before, #feels-like::before {
  margin-right: 8px;
  font-size: 18px;
}

#sky::before {
  content: '☁️';
}

#wind::before {
  content: '🌬️';
}

#feels-like::before {
  content: '🌡️';
}

.weather-details {
  background: rgba(248, 249, 250, 0.7);
  border-radius: 15px;
  padding: 15px;
  margin-top: 20px;
  backdrop-filter: blur(5px);
}
#btn{
display: flex;
justify-content: space-between;
}
#show-weather{
border-radius: 18px;
}
#show-weather{
position: fixed;
bottom: 20px;
right: 20px;
padding: 10px 15px;
background: var(--primary);
color: white;
border: none;
border-radius: 50px;
cursor: pointer;
box-shadow: 0 2px 10px rgba(0,0,0,0.2);
transition: all 0.3s ease;
z-index: 100;

} 
#container-animation {
transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

#container-animation.hidden {
opacity: 0;
transform: translateY(20px) scale(0.95);
pointer-events: none;
height: 0;
overflow: hidden;
padding-top: 0;
padding-bottom: 0;
margin: 0;
}
    `;
    document.head.appendChild(style);
  }
  initWidget() {
    document.body.insertAdjacentHTML('beforeend', this.widgetHtml);
    this.closeBtn = document.getElementById('close-btn');
    this.showBtn = document.getElementById('show-weather');
    this.containerId = document.getElementById('container-animation');
    this.showBtn.addEventListener('click', () => this.showWindow());
    this.closeBtn.addEventListener('click', () => this.closeWindow());
    return this;
  }
  getPromise() {
    fetch(this.apiQuery)
      .then(response => response.json())
      .then(data => this.printData(data))
      .catch(error => console.error('Ошибка получения погоды. Причина:' + error));
  }
  printData(data){
    const cityName = document.getElementById('city-name');
    const icon = document.getElementById('icon');
    const degrees = document.getElementById('celcius');
    const skyState = document.getElementById('sky');
    const windState = document.getElementById('wind');
    const tempFeel = document.getElementById('feels-like');

    cityName.textContent = `${data.name}`;
    icon.setAttribute('src','https://openweathermap.org/img/wn/' + `${data.weather[0].icon}` + '@2x.png')
    degrees.textContent = Math.round(`${data.main.temp}`) + '°C';
    skyState.textContent =  `${data.weather[0].description}`.charAt(0).toUpperCase()+`${data.weather[0].description}`.slice(1);
    windState.textContent = 'Ветер ' + Math.round(`${data.wind.speed}` )  + 'м/с';
    tempFeel.textContent = 'Ощущается как ' + Math.round(`${data.main.feels_like}`) + '°C';

    this.showWindow();
    return this;
  }

  closeWindow(){
    let containerId = document.getElementById('container-animation');
    this.showBtn.style.display = 'block';
    this.containerId.classList.add('hidden');

  setTimeout(() => {
    containerId.style.display = 'none';
  }, 300);
  }

  showWindow(){
    this.showBtn.style.display = 'none';
    this.containerId.style.display = 'block';
  setTimeout(() => {
    this.containerId.classList.remove('hidden');
  }, 10);
  }
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
        // Успешно получили координаты
        const { latitude, longitude } = position.coords;
        const weatherWidget = new WeatherWidjet(latitude, longitude);
    },
    (error) => {
        // Ошибка (пользователь отказал или геолокация недоступна)
        console.error("Ошибка геолокации:", error.message);
        // Можно показать погоду для города по умолчанию (например, Москва)
       const weatherWidget = new WeatherWidjet('53.9', '27.5667'); 
    }
);
 /*  document.addEventListener('DOMContentLoaded', () => {
    const weatherWidget = new WeatherWidjet(625144); // 625144 - ID Минска
    //weatherWidget.initWidget(); // this or that ||||
  }); 
 */
