import bodyParser from "body-parser";
import express  from "express";
import axios from "axios";
const port=3000;
const app=express();
const icon_url="https://openweathermap.org/img/wn/";
const url="https://api.openweathermap.org/data/2.5/weather?q=";
const api="&appid=59311517dc77a34c680dcbab721fcc2e";
const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
function getdate(){
    const date=new Date();
    const day=date.getDate().toString();
    const month=date.getMonth()+1;
    const year=date.getFullYear().toString();
    const fulldate=day+"/"+month+"/"+year;
    const weekday=days[date.getDay()]; 
    const hour=date.getHours();
    var ampm = date.getHours( ) >= 12 ? ' PM' : ' AM';
    const min=date.getMinutes();
    const fulltime=hour+":"+min;
    var arr=[];
    arr.push(weekday);
    arr.push(fulldate);
    arr.push(fulltime);
    return arr;
}

app.get("/",(req,res)=>{
    var arr=getdate();
    res.render("../index.ejs",{weekday:arr[0],full_date:arr[1],full_time:arr[2]});
});
app.post("/",async(req,res)=>{
   try{
    var arr=getdate();
    console.log(req.body);
    const data=req.body["country"];
    const _URL=url+data+api;
    const result=await axios.get(_URL);
    const weather_key=Object.keys(result.data.weather[0]);
    const weather_value=Object.values(result.data.weather[0]);
    const main_key=Object.keys(result.data.main);
    const main_value=Object.values(result.data.main);
    const wind_key=Object.keys(result.data.wind);
    const wind_value=Object.values(result.data.wind);
    const Icon=icon_url+weather_value[3]+"@2x.png";
    console.log(result.data);
    res.render("../index.ejs",{wt_value:weather_value,m_value:main_value,w_value:wind_value,
        weekday:arr[0],full_date:arr[1],full_time:arr[2],url:Icon});
    }
   catch(error){
    res.render("../index.ejs",{data:error.message});
   }
});
app.listen(port,()=>{
    console.log("You are listing to port number"+port);
})