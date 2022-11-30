
const router = require('express').Router();
const { Console } = require('console');
const fetch = require('node-fetch');
var store = require('store')

require('dotenv').config()

var helpers= {
    dashboardTitle() { return 'Weather Dashboard'; },
    searchTitle() { return 'Search For a City'; },
    searchButtonTitle() { return 'Search'; },
    tempratureTitle() { return 'Temp: '; },
    windTitle() { return 'Wind: '; },
    humidityTitle() { return 'Humadity:'; },
    forcastTitle() { return '5-Day Forcast:'; }
  };
const api_key=process.env.API_KEY
   router.post('/:city', (req, res) => {
    city= req.params.city
 
        getCity(city,api_key, res)
   
    
     
 });

 async function getCity(city,api_key,res) {
    citykey=city.replace(' ','_');
    url='https://api.openweathermap.org/data/2.5/forecast?q='+city+'&appid='+api_key+'&units=imperial'
   
    storedData=store.get(citykey) 
    
    var data ;
    if(storedData==undefined || storedData=='' ){
        
        response = await fetch(url,{
        method: 'GET',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' }
        }) 
          data = await response.json();    
    }else{
          data = storedData;
          //console.log('Local Storage'   ,citykey)
    }

     
    
    var temp='';
    var humidity='';
    var wind=''; 
    var weatherIcon='02d';
    var fiveDayData=[];
    var dateFormat = new Date();
    var currdate=dateFormat.getDate()+"/"+dateFormat.getMonth()+ "/"+dateFormat.getFullYear()

    if(data.cod==200){
        
        storedCityData=store.get('citySearched') 
    
        if(storedCityData==undefined || storedCityData=='' )
        {
            storedCityData=[]
            storedCityData.push({'name':city})
            store.set('citySearched' ,storedCityData) ;
        }else{
            
            cityExistsInLocalStorage=false;
            storedCityData.forEach(function(item ){
                if(item.name==city){
                    cityExistsInLocalStorage=true;
                }
            })
            if(cityExistsInLocalStorage==false){
               storedCityData.push({'name':city})  
               store.set('citySearched' ,storedCityData) ; 

            }
            
        }
        //console.log(storedCityData)  
        store.set(citykey, data)
        first_item= data.list[0];
        temp=first_item.main.temp;
        humidity=first_item.main.humidity;
        wind=first_item.wind.speed; 
        weatherIcon=first_item.weather[0].icon; 
        dateFormat = new Date(first_item.dt * 1000);
        currdate=dateFormat.getDate()+"/"+dateFormat.getMonth()+ "/"+dateFormat.getFullYear()
        var prevDateString='';
        var listIgnoreItem=0;
        data.list.forEach(function(item ){
            var dateFormat = new Date(item.dt * 1000);
            currDateString=dateFormat.getDate()+"/"+dateFormat.getMonth()+ "/"+dateFormat.getFullYear()
                //ignore First Item Completely because It has been displayed on Top
                if((currDateString!=prevDateString) && (currdate!=currDateString)){
                    item.dt=currDateString;
                    item.weatherIcon=item.weather[0].icon;
                    fiveDayData.push(item)
                    prevDateString=currDateString;
                }
        })
    }
     
   // res.send(data);
    res.render('main', {
        layout : 'search',
        pageTitle: 'Weather Forcast',
        'prevSearched':storedCityData,
        'data':fiveDayData,
        'city':city,
        'currdate':currdate,
        'temprature':temp,
        'humidity':humidity,
        'weatherIcon':weatherIcon,
        'wind':wind,
        helpers:helpers
    });    
} 

module.exports = router;
