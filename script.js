// Fucntion to properly foromat the time as hh:mm:ss
function formatTime(time) {
  if (time < 10 && time.length != 2) {
    return '0' + time;
  }
  return time;
}

//Function to display the date, day, year, etc
(function () {
  const currentDate = document.getElementById('date');
  //console.log(currentDate);
  const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',]
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  var date = new Date();
  var supTagData = function () {
    var d = date.getDate();
    if (d == 1)
      return 'st';
    else if (d == 2)
      return 'nd';
    else
      return 'th';
  }
  var text = dayName[date.getDay()] + ', ' + months[date.getMonth()] + ' ' + date.getDate() + `<sup>${supTagData()}</sup>` + ', ' + date.getFullYear();
  currentDate.innerHTML = text;
})()



// audio for alarm ring
const audio = new Audio('alarm.mp3');
var isPlaying = false; //flag for alarm
audio.loop = true;

let alarmList = []; //Array to contain alarms list

const upcomingAlarmsDisp = document.querySelector('h3'); //Upcoming Alarms List Header

const upcomingAlarmList = document.getElementById('Alarms-List'); //element containing the Upcoming Alarms List

const addAlarm = document.querySelector('.alarm-setting-form'); //div containing the form for R/W operations on alarms list


//function custom() containing operations to test the project by devs 
document.addEventListener('keydown', custom);
function custom(e) {
  //console.log(e.keyCode);
  if (e.keyCode == '80') {//p
    ///showNotificationAlert('test ring');
    playAlarm('     TEST');
  }
  //pressing key 'a' displays the alarms array in console
  else if (e.keyCode == '65') {//a
    console.log(alarmList);
  }
  //press x to populate alarms Array
  else if (e.keyCode == '88' || e.keyCode == '120') {
    var Time = clock().time;
    //console.log(Time);
    var newTime = Time.h + ':' + Time.m + ':' + '00';
    j = 20;
    while (j < 60) {
      alarmList.push(newTime);
      addNewAlarm(newTime);
      newTime = Time.h + ':' + j + ':' + '00';
      j += 2;
    }
  }
  else if (e.keyCode == 67) {
    alarmList = [];
    upcomingAlarmList.innerHTML = '';
  }
}


//function to calculate when to trigger the alarm
function checkAlarmActivation() {
  //console.log(isPlaying);
  if (!isPlaying) {
    var currentTime = formatTime(clock().time.h) + ":" + formatTime(clock().time.m);
    //console.log(currentTime);
    //manipulating the flag to prevent multiple triggers.REASONING:- The flag is set to 'false' by default. If we change the flag state at stopAlarm button the alarm will be trigerred again when checkAlarmActivation executes at 1s intervals.
    if (alarmList.includes(currentTime)) {
      playAlarm(currentTime);
      isPlaying = true;
      setInterval(() => {
        isPlaying = false;
      }, 59000);///therefore hhe flag state will be true (preventing alarm) for 60s and then it will revert to default/false.
    }
  }
}

setInterval(checkAlarmActivation, 1000);
//Function to play alarm 
function playAlarm(currentTime) {
  if (!isPlaying) {
    console.log('alarm activated', currentTime);
    showNotificationAlert('Alarm Playing! The Time is: ' + currentTime);
    audio.play();
    return;
  }
}

// function to stop the currently playing alarm
function stopAlarm() {
  //function to clear the alert-display
  function clrDisp() {
    var notBox = document.getElementById('notification-box-alert');
    notBox.innerText = '';
    notBox.style.padding = '0px';
  }
  clrDisp();
  console.log('alarm deactivated');
  showNotification('Alarm Stopped')
  audio.pause();
  return;
}

// delete button event handling
upcomingAlarmList.addEventListener('click', e => {
  if (e.target.classList.contains("deleteAlarm")) {
    e.target.parentElement.remove();
  }
});

// deletes the alarm from DOM alarmList when "Delete Alarm" is clicked
remove = (value) => {
  let newList = alarmList.filter((time) => time != value);
  alarmList.length = 0; // Clear contents
  alarmList.push.apply(alarmList, newList);
  showNotification('Alarm Deleted');
}

// Adds newAlarm to the upcoming-alarms-list as a new list item in DOM
function addNewAlarm(newAlarm) {
  const text =
    `<li class = "a-list">        
        <span class="time">${newAlarm}</span>
        <button class="deleteAlarm" onclick = "remove(this.value)" value=${newAlarm}>Delete Alarm</button>       
    </li>`;
  upcomingAlarmList.innerHTML += text;
  showNotification('Alarm Added');
};

//adds the new alarm to the alarm-list Array
addAlarm.addEventListener('submit', event => {

  event.preventDefault();// prevents default behaviour

  let hour = formatTime(addAlarm.hour.value);
  if (hour === '0') {
    hour = '00'
  }
  let minute = formatTime(addAlarm.minute.value);
  if (minute === '0') {
    minute = '00'
  }

  //Not using sesconds paarameter to prevent alarm miss and reduce proccessing consumption
  /*   let second = formatTime(addAlarm.second.value);
    if (second === '0') {
      second = '00'
    } */

  const newAlarm = `${hour}:${minute}`

  // adds newAlarm to alarmList 
  if (isNaN(newAlarm)) {

    if (!alarmList.includes(newAlarm)) {
      alarmList.push(newAlarm);
      addNewAlarm(newAlarm);
      addAlarm.reset();
    } else {
      showNotification('You have already set alarm for this time: ' + newAlarm);
    }
  } else {
    showNotification("Please enter valid time");
  }
})

//function to display Upcoming Alarms header only when alarms exist
function alarmDisp() {
  if (alarmList.length == 0)
    upcomingAlarmsDisp.style.display = 'none';
  else
    upcomingAlarmsDisp.style.display = '';
}
alarmDisp();

//function to ddispplay and update the ''small-clock' time for sm-md screen-size
function smallClock() {
  var getTime = clock();
  //format the time using formatTime()
  //console.log(getTime.time)
  var h = formatTime(getTime.time.h);
  var m = formatTime(getTime.time.m);
  var s = formatTime(getTime.time.s);
 // console.log(getTime.time);
  //console.log(h,m,s);
  var li = `${h}<span id='clock-sep'> : </span>${m}<span id='clock-sep'> : </span>${s}`;
  document.getElementById('small-clock').innerHTML = li;
}
setInterval(smallClock, 500); //updates the time in every 900ms

//fucntion to show notification instead of windows.alert()
function showNotificationAlert(msg) {
  var notBox = document.getElementById('notification-box-alert');
  notBox.style.padding = '5px 15px';
  notBox.innerText = msg;
}

function showNotification(msg) {
  var notBox = document.getElementById('notification-box');
  notBox.style.padding = '5px 15px';
  notBox.innerText = msg;
  setTimeout(function clearText() {
    notBox.innerText = '';
    notBox.style.padding = '0px';
  }, 3000);
}


//CLOCK FUNCTIONING MODULE

var clock = function () {

  var hoursContainer = document.querySelector('.hours')
  var minutesContainer = document.querySelector('.minutes')
  var secondsContainer = document.querySelector('.seconds')
  var tickElements = Array.from(document.querySelectorAll('.tick'))

  var last = new Date(0)
  last.setUTCHours(-1)
  var tickState = true

  var updateTime = function () {
    var now = new Date
    var lastHours = last.getHours().toString()

    var nowHours = now.getHours().toString()
    if (lastHours !== nowHours) {
      updateContainer(hoursContainer, nowHours)
    }

    var lastMinutes = last.getMinutes().toString()
    var nowMinutes = now.getMinutes().toString()
    if (lastMinutes !== nowMinutes) {
      updateContainer(minutesContainer, nowMinutes)
    }

    var lastSeconds = last.getSeconds().toString()
    var nowSeconds = now.getSeconds().toString()
    if (lastSeconds !== nowSeconds) {
      //tick()
      updateContainer(secondsContainer, nowSeconds)
    }
    //  i++;  //time updates every 100ms, check for alarm every 1000ms using 'i'
    last = now
    //  if(i==10){
    var currentTime = nowHours + ':' + nowMinutes + ':' + nowSeconds; //full time format, i.e., hh:mm:ss (Only for Display)
    var currentTime2 = nowHours + ':' + nowMinutes; // condensed time format, i.e., hh:mm (for inernal data processing)
    //    console.log(currentTime)
    //    console.log(alarmList[0]==currentTime);


    return { //returns an object containing current time for external access
      't': currentTime,
      'h': nowHours,
      'm': nowMinutes,
      's': nowSeconds,
    }
  }

  function tick() {
    tickElements.forEach(t => t.classList.toggle('tick-hidden'))
  }

  function updateContainer(container, newTime) {

    var time = newTime.split('')
    if (time.length === 1) {
      time.unshift('0')
    }
    var first = container.firstElementChild
    if (first.lastElementChild.textContent !== time[0]) {
      updateNumber(first, time[0])
    }
    var last = container.lastElementChild
    if (last.lastElementChild.textContent !== time[1]) {
      updateNumber(last, time[1])
    }
  }

  function updateNumber(element, number) {
    var second = element.lastElementChild.cloneNode(true)
    second.textContent = number

    element.appendChild(second)
    element.classList.add('move')

    setTimeout(function () {
      element.classList.remove('move')
    }, 990)
    setTimeout(function () {
      element.removeChild(element.firstElementChild)
    }, 990)
  }
  setInterval(updateTime, 500)

  return {
    'time': updateTime(),  //returns currentTime object from updateTime() to external block
  }
}
setInterval(clock, 1000);


