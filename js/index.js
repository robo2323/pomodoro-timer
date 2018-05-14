/* jshint browser: true */
'use strict';

function main() {
  var timerDisplay = document.getElementById('timer'),
    innerCircle = document.getElementById('inner-circle'),
    timerText = document.getElementById('timer'),
    line = document.getElementById('line'),
    start = document.getElementById('start'),
    times = {
      sessionMinutes: 25,
      breakMinutes: 5
    },
    minutes = times.sessionMinutes,
    seconds = minutes * 60,
    squareNumber = 0,
    onBreak = false,
    padding = '',
    startFlag = true,
    paused = false,
    radiusOuter,
    radiusInner,
    circumferenceOuter,
    circumferenceInner,
    interval;

  //sets initial and on window resise svg/circle attributes/sizing
  function resize() {
    radiusOuter = document.getElementById('timer-container').offsetWidth * 0.45;
    radiusInner = document.getElementById('timer-container').offsetWidth * 0.38;

    circumferenceOuter = radiusOuter * 2 * Math.PI;
    circumferenceInner = radiusInner * 2 * Math.PI;

    document.getElementById('circle-outer').setAttribute('r', radiusOuter + '');
    document.getElementById('circle-inner').setAttribute('r', radiusInner + '');

    document.getElementById('svg-outer').style.strokeDasharray = '' + circumferenceOuter;
    document.getElementById('svg-outer').style.strokeDashoffset = '' + circumferenceOuter;

    document.getElementById('svg-inner').style.strokeDasharray = '' + circumferenceInner;
    document.getElementById('svg-inner').style.strokeDashoffset = '' + circumferenceInner / 2;
    startFlag = true;
  }
  resize();

  //used to animate inner(seconds) circle
  function getStrokeDashOffset(elementId) {
    return Number(document.getElementById('' + elementId).style.strokeDashoffset);
  }

  //click listeners and logic for the plus/minus buttons
  (function clickListeners(state) {
    let valueChange;

    function clickHandler(valKey, val, elementId) {
      if (times[valKey] >= 1) {
        times[valKey] += val;

        if (times[valKey] === 0) {
          times[valKey] = 1;
        }
        document.getElementById(elementId).innerText = times[valKey];
        if (valKey == 'sessionMinutes') {
          timerDisplay.innerHTML = times[valKey] + ':' + padding + '00';
        }
      }
    }

    function mouseDownHandler(valKey, val, elementId) {
      valueChange = setInterval(function() {
        if (times[valKey] >= 1) {
          times[valKey] += val;
          if (times[valKey] === 0) {
            times[valKey] = 1;
          }
          document.getElementById(elementId).innerText = times[valKey];
          if (valKey == 'sessionMinutes') {
            timerDisplay.innerHTML = times[valKey] + ':' + padding + '00';
          }
        }
      }, 100);
    }

    document.getElementById('minus-session').addEventListener('click', function() {
      clickHandler('sessionMinutes', -1, 'session-time-disp');
    });

    document.getElementById('minus-session').addEventListener('mousedown', function() {
      mouseDownHandler('sessionMinutes', -1, 'session-time-disp');
    });

    document.getElementById('plus-session').addEventListener('click', function() {
      clickHandler('sessionMinutes', 1, 'session-time-disp');
    });

    document.getElementById('plus-session').addEventListener('mousedown', function() {
      mouseDownHandler('sessionMinutes', 1, 'session-time-disp');
    });

    document.getElementById('minus-break').addEventListener('click', function() {
      clickHandler('breakMinutes', -1, 'break-time-disp');
    });

    document.getElementById('minus-break').addEventListener('mousedown', function() {
      mouseDownHandler('breakMinutes', -1, 'break-time-disp');
    });

    document.getElementById('plus-break').addEventListener('click', function() {
      clickHandler('breakMinutes', 1, 'break-time-disp');
    });

    document.getElementById('plus-break').addEventListener('mousedown', function() {
      mouseDownHandler('breakMinutes', 1, 'break-time-disp');
    });

    document.getElementById('plus-break').addEventListener('mouseup', intervalClear);

    document.getElementById('plus-break').addEventListener('mouseleave', intervalClear);

    document.getElementById('minus-break').addEventListener('mouseup', intervalClear);

    document.getElementById('minus-break').addEventListener('mouseleave', intervalClear);

    document.getElementById('plus-session').addEventListener('mouseup', intervalClear);

    document.getElementById('plus-session').addEventListener('mouseleave', intervalClear);

    document.getElementById('minus-session').addEventListener('mouseup', intervalClear);

    document.getElementById('minus-session').addEventListener('mouseleave', intervalClear);

    function intervalClear() {
      clearInterval(valueChange);
    }
  })(); //end click listeners

  //swaps start button for control buttons when timer is running
  function toggleControlButtons() {
    let buttons = document.getElementsByClassName('control-button');

    for (var i = 0; i < buttons.length; i++) {
      if (buttons[i].classList.contains('hide-button')) {
        if (i === 0) {
          document.getElementById('start-timer').classList.add('hide-button');
        }

        buttons[i].classList.remove('hide-button');
      } else if (!buttons[i].classList.contains('hide-button')) {
        if (i === 0) {
          document.getElementById('start-timer').classList.remove('hide-button');
        }
        buttons[i].classList.add('hide-button');
      }
    }
  }

  //swaps timer settings for info display when timer is running
  function toggleTop() {
    if (document.getElementById('top-label').classList.contains('hide-label')) {
      document.getElementById('set-timer').classList.add('hide-label');

      document.getElementById('top-label').classList.remove('hide-label');
    } else {
      document.getElementById('set-timer').classList.remove('hide-label');

      document.getElementById('top-label').classList.add('hide-label');
    }
  }

  //swaps labels (top and inside timer) when switching between a session and a break
  function toggleLabels() {
    if (!onBreak) {
      document.getElementById('top-label').innerText = times.breakMinutes + ' minute break coming up';
      document.getElementById('label').innerText = 'Session';
    } else {
      document.getElementById('top-label').innerText = times.sessionMinutes + ' minute session coming up';
      document.getElementById('label').innerText = 'Break';
    }
  }

  //used to restart the outer circles animation when switching between break or session
  function resetOuterAnimation() {
    document.getElementById('svg-outer').classList.remove('animate-outer');
    setTimeout(function() {
      document.getElementById('svg-outer').style.strokeDashoffset = '' + circumferenceOuter;
      document.getElementById('svg-outer').style.animationDuration = '' + seconds + 's';
      document.getElementById('svg-outer').style.animationTimingFunction = 'linear';
      document.getElementById('svg-outer').classList.add('animate-outer');
    }, 1);
  }

  //starts a break
  function setBreak() {
    minutes = times.breakMinutes;
    seconds = minutes * 60;
    onBreak = true;
    document.body.style.background = '#34BB62';
    document.getElementById('break-timer').innerText = 'Start session';
    toggleLabels();
    resetOuterAnimation();
  }

  //starts a session
  function setSession() {
    minutes = times.sessionMinutes;
    seconds = minutes * 60;
    onBreak = false;

    document.body.style.background = 'tomato';
    document.getElementById('break-timer').innerText = 'Start break';

    toggleLabels();
    resetOuterAnimation();
  }

  //initialises a session and starts timer on clicking start
  function startTimer() {
    minutes = times.sessionMinutes;
    seconds = minutes * 60;
    document.getElementById('top-label').innerText = times.breakMinutes + ' minute break coming up';
    document.getElementById('label').innerText = 'Session';
    toggleTop();
    document.body.style.background = 'tomato';
    toggleControlButtons();
    interval = setInterval(timer, 1000);
  }

  //timer loop
  function timer() {
    //if it is the start of a new session starts the outer circle's animation
    if (startFlag) {
      document.getElementById('svg-outer').style.animationDuration = '' + seconds + 's';
      document.getElementById('svg-outer').style.animationTimingFunction = 'linear';
      document.getElementById('svg-outer').classList.add('animate-outer');

      startFlag = false;
    }

    if (!paused) {
      //logic for inner/seconds circle animation
      if (getStrokeDashOffset('svg-inner') > 0) {
        document.getElementById('svg-inner').style.strokeDashoffset = '' + circumferenceInner / 1.85 * -1;
      } else if (getStrokeDashOffset('svg-inner') < 0) {
        document.getElementById('svg-inner').style.strokeDashoffset = '' + circumferenceInner / 1.85;
      }

      minutes = Math.floor(seconds / 60);

      //sets padding if needed and updates timer display in middle of circle
      if (seconds % 60 < 10) {
        padding = '0';
      } else {
        padding = '';
      }

      timerDisplay.innerHTML = minutes + ':' + padding + seconds % 60;

      //if end of session or break, switch
      if (minutes === 0 && seconds === 0 && !onBreak) {
        setBreak();
      } else if (minutes === 0 && seconds === 0 && onBreak) {
        setSession();
      }

      //update minutes after 60 seconds
      if (seconds % 60 === 0) {
        minutes--;
      }

      //update seconds (once per interval cycle/1000ms)
      seconds -= 1;
    }
  }

  //click listeners and logic for timer control buttons
  document.getElementById('start-timer').onclick = startTimer;

  document.getElementById('pause-timer').onclick = function() {
    if (!paused) {
      document.getElementById('svg-outer').style.animationPlayState = 'paused';
      paused = true;
      this.innerText = 'Play';
      document.getElementById('label').innerText = 'Paused';
    } else {
      document.getElementById('svg-outer').style.animationPlayState = 'running';
      paused = false;
      this.innerText = 'Pause';
      toggleLabels();
    }
  };

  document.getElementById('break-timer').onclick = function() {
    if (!onBreak) {
      this.innerText = 'Start Session';

      setBreak();
    } else {
      this.innerText = 'Start break';
      setSession();
    }
  };

  //reset timer to set a new session
  document.getElementById('reset-timer').onclick = function() {
    clearInterval(interval);
    document.getElementById('svg-outer').classList.remove('animate-outer');
    document.body.style.background = '#34BB62';
    minutes = times.sessionMinutes;
    seconds = minutes * 60;
    document.getElementById('svg-outer').style.animationPlayState = 'running';
    paused = false;
    document.getElementById('pause-timer').innerText = 'Pause';
    document.getElementById('break-timer').innerText = 'Start Break';

    if (seconds % 60 < 10) {
      padding = '0';
    } else {
      padding = '';
    }

    timerDisplay.innerHTML = minutes + ':' + padding + seconds % 60;
    padding = '';
    document.getElementById('label').innerText = 'Session';
    onBreak = false;

    toggleLabels();

    toggleTop();
    toggleControlButtons();
    resize();
  };

  window.onresize = resize;
}

document.addEventListener('DOMContentLoaded', function() {
  main();
});
