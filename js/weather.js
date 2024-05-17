let forcast_url = "https://api.openweathermap.org/data/2.5/forecast?q=london&units=metric&appid=903507f17d707fecd352d38301efba77"
let unit = 'deg';
let opt = 'weather';
function getWeatherData(flg = 'w'){
    
    if(flg == 'w'){
        opt = 'weather'
    }else{
        opt = 'forcaste'
    }
    goBack('data');

    let location = $("#LOC").val();
    let weathr_url = "";
    if(opt=="weather"){
        if(location){
            weathr_url = "https://api.openweathermap.org/data/2.5/weather?q="+location+"&APPID=903507f17d707fecd352d38301efba77";
        }else{
            weathr_url = "https://api.openweathermap.org/data/2.5/weather?lat=51.5072178&lon=-0.1275862&APPID=903507f17d707fecd352d38301efba77";
        }
        $(".cancel-btn-forcaste").hide();
    }else{
        if(location){
            weathr_url = "https://api.openweathermap.org/data/2.5/forecast?q="+location+"&APPID=903507f17d707fecd352d38301efba77";
        }else{
            weathr_url = "https://api.openweathermap.org/data/2.5/forecast?lat=51.5072178&lon=-0.1275862&APPID=903507f17d707fecd352d38301efba77";
        }
        $(".cancel-btn-forcaste").show();
    }
    $.get(weathr_url, function (data, status) {
        console.log(data);
        if(opt == "weather")
            displayWeather(data);
        else{
            displayForcast(data);
        }
    });
}
function getDateInfo(d){
    let date = new Date(d);
    let year = date.getFullYear();
    let mn = Number(date.getMonth()+1)<10?'0'+Number(date.getMonth()+1):Number(date.getMonth()+1);
    let day = date.getDate()<10?'0'+date.getDate():date.getDate();

    return day+'/'+mn+'/'+year;
}
function getUniqueListBy(arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()]
}
function displayForcast(d){
    let data = d.list;
    $(".loc-name").html(d.city.name+'('+d.city.country+')'); 
    let html = '';
    data.forEach((item)=>{
        item.date = new Date(new Date(item.dt_txt).getFullYear()+'/'+Number(new Date(item.dt_txt).getMonth()+1)+'/'+new Date(item.dt_txt).getDate()).getTime();
    })
    data = getUniqueListBy(data, 'date')
    console.log(data);
    for(let i = 0; i<data.length;i++){
        html+= `<div class="daywise">
        <div class="date-info"><span>${getDateInfo(data[i]["dt_txt"])}</span></div>
        <div class="temperatures"><div class="temp-grid"><span><i class="fa fa-thermometer-half text-warning my-2"></i>Temp :<span class="cur-temp">${getCalculatedTemp(data[i]["main"]["temp"])}</span></span></div>
        <div class="temp-grid"><span><i class="fa fa-thermometer-half"></i>Feels Like :<span class="feels-temp">${getCalculatedTemp(data[i]["main"]["feels_like"])}</span></span></div> 
        <div class ="temp-grid">
                        <span><i class="fa fa-thermometer-half text-warning my-2"></i>Min : <span class="temp-min">${getCalculatedTemp(data[i]["main"]["temp_min"])}</span></span>
                    </div>
        <div class="temp-grid"><span><i class="fa fa-thermometer-full"></i>Max :<span class="temp-max">${getCalculatedTemp(data[i]["main"]["temp_max"])}</span></span></div>
        <div class="temp-grid"><span><img src=${'https://openweathermap.org/img/wn/'+data[i].weather[0].icon+'@2x.png'} class="main-icon"><span class="main-text">${data[i].weather[0].main}</span></span></div>
        <div class="temp-grid"><span><i class="fa fa-code"></i>Wind :<span class="pre-wind">${Number(data[i].wind.speed) +'m/s'}</span></span></div>
        <div class="temp-grid"><span><i class="fa fa-percent text-warning my-2"></i>Humidity :<span class="hum-temp">${Number(data[i].main.humidity) +'%'}</span></span></div>
        <div class="temp-grid"><span><i class="fa fa-compress"></i>Pressure :<span class="pre-temp">${Number(data[i].main.pressure) +'hpa'}</span></span></div>
        <div class="temp-grid"><span><i class="fa fa-solid fa-cloud"></i>Clouds :<span class="pre-cloud">${Number(data[i].clouds.all) +'%'}</span></span></div>
        <div class="temp-grid" style="visibility:hidden"><span><i class="fa fa-solid fa-cloud"></i>Clouds :<span class="pre-cloud"></span></span></div>
        </div></div></div>`    
    }
    //'<div class="temp-grid"><span><i class="fa fa-solid fa-cloud"></i>Clouds :<span class="pre-cloud"></span></span></div><div class="temp-grid" style="visibility:hidden"><span><i class="fa fa-solid fa-cloud"></i>Clouds :<span class="pre-cloud"></span></span></div><div class="temp-grid"><span><i class="fa fa-solid fa-sun"></i>Sun Rise :<span class="sunrise"></span></span></div><div class="temp-grid"><span><i class="fa fa-regular fa-moon"></i>Sun Set :<span class="sunset"></span></span></div>';
    
    $(".forcaste").html(html);
}
getWeatherData()
function displayWeather(d){
    $(".loc-name").html(d.name+'('+d.sys.country+')')
    $(".cur-temp").html(getCalculatedTemp(d.main.temp));
    $(".feels-temp").html(getCalculatedTemp(d.main.feels_like));
    $(".hum-temp").html(Number(d.main.humidity) +'%');
    $(".temp-min").html(getCalculatedTemp(d.main.temp_min));
    $(".temp-max").html(getCalculatedTemp(d.main.temp_max));
    
    $(".pre-temp").html(Number(d.main.pressure) +'hpa');

    $(".main-icon").attr("src", 'https://openweathermap.org/img/wn/'+d.weather[0].icon+'@2x.png');
    $(".main-text").html(d.weather[0].main)
    $(".pre-wind").html(Number(d.wind.speed) +'m/s');
    $(".pre-cloud").html(Number(d.clouds.all) +'%');
    $(".sunrise").html(getSunRisenSet(d.sys.sunrise));
    $(".sunset").html(getSunRisenSet(d.sys.sunset));
    
}

function getSunRisenSet(d){
    let unix = d
    let date = new Date(unix*1000);
    console.log(date);
    let hr = date.getHours()<10?'0'+date.getHours():date.getHours();
    let min = date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes();
    return hr+':'+min;
    
}
function getCalculatedTemp(temp){
    if(unit == 'deg'){
        return Math.round((temp - 273.15) * 100) / 100 + 'deg'
    }
}

function goBack(f){
    if(f=='back'){
        $(".weather-wrapper").hide();
        $('.forcaste').hide();
        $('.location').show();
        $(".cancel-btn-forcaste").hide();
    }else{
        
        $('.location').hide();
        
        if(opt=='weather')
            $(".weather-wrapper").show();
        else{
            $('.forcaste').show();
            $(".cancel-btn-forcaste").show();
        }
    }
    
}