var von="fa-solid fa-volume-high";
var voff="fa-solid fa-volume-xmark";

function toggleMusic() 
{
  var audioElement = document.getElementById('music');
  if (audioElement.paused) {
      playicon.className=voff;
      audioElement.play();
  } else {
    playicon.className=von;
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
 

    // Create a new div element
    var divContainer = document.createElement('div');
    divContainer.id = 'playbtn-container';
    divContainer.className = 'd-flex justify-content-end';
    divContainer.style.zIndex = "2";

    // Create a new button element
    var playBtn = document.createElement('button');
    playBtn.id = 'playbtn';
    playBtn.className = 'btn btn-lg btn-outline-secondary p-0 border-none rounded-circle d-inline-block d-flex justify-content-center align-items-center';
    playBtn.title = 'Play/Pause Music';
    playBtn.addEventListener('click', toggleMusic);
    playBtn.style.zIndex = "3";

    // Create a new i (icon) element
    var iconElement = document.createElement('i');
    iconElement.id="playicon";
    iconElement.className = 'fa-solid fa-volume-high';

    // Append the icon element to the button
    playBtn.appendChild(iconElement);

    // Append the button to the div container
    divContainer.appendChild(audioElement);
    divContainer.appendChild(playBtn);

    // Append the div container to the document body
    // document.querySelector('body :last-child');
    // var lastChildOfBody = document.querySelector('body :last-child');
      var header = document.querySelector('#head1');
      header.appendChild(divContainer)

  }
  
  // Call the function to add elements when the page loads
  window.onload = addElements;
