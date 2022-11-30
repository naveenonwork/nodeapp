
const router = require('express').Router();
const searchRoutes = require('./search');
const express = require('express');
var store = require('store')
router.use('/search', searchRoutes);
storedCityData=store.get('citySearched') 
var dateFormat = new Date();
var currdate=dateFormat.getDate()+"/"+dateFormat.getMonth()+ "/"+dateFormat.getFullYear()

var city='';
var temp='';
var humidity='';
var wind=''; 
var weatherIcon='02d';
var fiveDayData=[]

for(i=1;i<6;i++){
  dt=(dateFormat.getDate()+1)+"/"+dateFormat.getMonth()+ "/"+dateFormat.getFullYear()

  emptyItem={
    dt:dt,
    main: {
      temp:'',
      humidity: '' 
    },
    wind: { speed:''  },
    weatherIcon: '04d'
  }
  fiveDayData.push(emptyItem)
}

   
var helpers= {
  dashboardTitle() { return 'Weather Dashboard'; },
  searchTitle() { return 'Search For a City'; },
  searchButtonTitle() { return 'Search'; },
  tempratureTitle() { return 'Temp: '; },
  windTitle() { return 'Wind: '; },
  humidityTitle() { return 'Humadity:'; },
  forcastTitle() { return '5 Day Forcast:'; }, 
  getDate(day) { dateFormat= new Date() ; return currdate=(dateFormat.getDate()+day)+"/"+dateFormat.getMonth()+ "/"+dateFormat.getFullYear() }
};
router.get('/', (req, res) => {

  storedCityData=store.get('citySearched') 

    if(storedCityData==undefined || storedCityData=='' )
    {
            // in this case do nothing
    }else{
      storedCityData.forEach(function(item ){
        city=item.name; //it will set last searched city
      })
      citykey=city.replace(' ','_');
      data=store.get(citykey) 
      first_item= data.list[0];
        temp=first_item.main.temp;
        humidity=first_item.main.humidity;
        wind=first_item.wind.speed; 
        weatherIcon=first_item.weather[0].icon; 
        dateFormat = new Date(first_item.dt * 1000);
        var prevDateString='';
        var listIgnoreItem=0;
        fiveDayData=[];
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
  res.render('main', {
    layout : 'index',
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
});

module.exports = router;