// if (document.documentElement.clientHeight < 680 && document.documentElement.clientWidth >1270 ) { 
//         // alert("Adjusting Scale for 1280 x 680");
// document.querySelector("meta[name=viewport]").setAttribute(
//         'content', 
//         'width=device-width, initial-scale=0.75, maximum-scale=0.75, user-scalable=0');
        
// }

// function toggleMusic() 
// {
//   var audioElement = document.getElementById('music');
//   if (audioElement.paused) {
      
//       audioElement.play();
//   } else {
//       audioElement.pause();
//   }
// }

// function addElements() {

//     var audioElement = document.createElement('audio');
//     audioElement.autoplay = false;
//     audioElement.loop = true;
//     audioElement.id = 'music';

//     // Create a new source element
//     var sourceElement = document.createElement('source');
//     sourceElement.src = 'images/audio.mp3';
//     sourceElement.type = 'audio/mp3';

//     // Add the source element to the audio element
//     audioElement.appendChild(sourceElement);

//     // Add a fallback message for browsers that do not support the audio element
//     var fallbackText = document.createTextNode('Your browser does not support the audio element.');
//     audioElement.appendChild(fallbackText);

//     // Append the audio element to the document body
 

//     // Create a new div element
//     var divContainer = document.createElement('div');
//     divContainer.id = 'playbtn-container';
//     divContainer.className = 'd-flex justify-content-end';

//     // Create a new button element
//     var playBtn = document.createElement('button');
//     playBtn.id = 'playbtn';
//     playBtn.className = 'btn btn-outline-secondary p-0 rounded-circle d-inline-block';
//     playBtn.title = 'Play/Pause Music';
//     playBtn.addEventListener('click', toggleMusic);

//     // Create a new i (icon) element
//     var iconElement = document.createElement('i');
//     iconElement.className = 'fa-solid fa-music';

//     // Append the icon element to the button
//     playBtn.appendChild(iconElement);

//     // Append the button to the div container
//     divContainer.appendChild(playBtn);

//     // Append the div container to the document body
//     // document.querySelector('body :last-child');
//     // var lastChildOfBody = document.querySelector('body :last-child');
//     document.body.appendChild(divContainer);
//     document.body.appendChild(audioElement);

//   }
  
//   // Call the function to add elements when the page loads
//   window.onload = addElements;

//   playBtn.addEventListener('click', toggleMusic);
function toggleMusic() {
  var audioElement = document.getElementById('music');
  if (audioElement.paused) {
      audioElement.play();
  } else {
      audioElement.pause();
  }
}

function addElements() {
  var audioElement = document.createElement('audio');
  audioElement.autoplay = false;
  audioElement.loop = true;
  audioElement.id = 'music';

  // Create a new source element
  var sourceElement = document.createElement('source');
  sourceElement.src = 'images/audio.mp3';
  sourceElement.type = 'audio/mp3';

  // Add the source element to the audio element
  audioElement.appendChild(sourceElement);

  // Add a fallback message for browsers that do not support the audio element
  var fallbackText = document.createTextNode('Your browser does not support the audio element.');
  audioElement.appendChild(fallbackText);

  // Append the audio element to the document body
  document.body.appendChild(audioElement);

  // Create a new div element for the play button
  var playBtnContainer = document.createElement('div');
  playBtnContainer.id = 'playbtn-container';
  playBtnContainer.style.position = 'fixed';
  playBtnContainer.style.bottom = '0';
  playBtnContainer.style.right = '0';
  playBtnContainer.style.padding = '15px';

  // Create a new button element
  var playBtn = document.createElement('button');
  playBtn.id = 'playbtn';
  playBtn.className = 'btn btn-outline-secondary p-0 rounded-circle';
  playBtn.title = 'Play/Pause Music';
  playBtn.addEventListener('click', toggleMusic);

  // Create a new i (icon) element
  var iconElement = document.createElement('i');
  iconElement.className = 'fa-solid fa-music';

  // Append the icon element to the button
  playBtn.appendChild(iconElement);

  // Append the button to the div container
  playBtnContainer.appendChild(playBtn);

  // Append the div container to the document body
  document.body.appendChild(playBtnContainer);
}

// Call the function to add elements when the page loads
window.onload = addElements;
