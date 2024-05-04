function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      // Wyszukaj ciasteczko o nazwie 'csrftoken'
      if (cookie.substring(0, 10) === 'csrftoken=') {
        cookieValue = decodeURIComponent(cookie.substring(10));
        break;
      }
    }
  }
  return cookieValue;
}
var csrftoken = getCookie('csrftoken');


document.addEventListener('DOMContentLoaded', function () {

  fetch('api/get_user/', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken
    }
  })
    .then(response => response.json())
    .then(data => {
      if (data.name) {
        alert("Zalogowano jako: " + data.name);
      } else {
        var name = prompt("Wprowadź swóją nazwę:");
        if (name !== null) {
          fetch('api/create_user/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify({ "name": name })
          })
          .then(response => response.json())
          .then(data => {
            if (data.name !== null) {
              window.location.reload();
            } else {
              alert("Nie podano nazwy, spróbój ponownie");
              window.location.reload();
            }
          }).catch(error => {
            console.error('Wystąpił błąd:', error);
          });
        } else {
          alert("Anulowano");
        }
      }
    }).catch(error => {
      console.error('Wystąpił błąd:', error);
    });



  // Selects the first element with the class '.confetti-button' as the target button.
  const confetti_button = document.querySelector('.confetti_button');  // You can change the class, just make sure it is defined in the module also.  
  const logout_button = document.querySelector('.logout_button');
  const counter = document.querySelector('.counter');

  let counterValue = 0;

  // Adds an event listener for the 'click' event on the targeted button.
  confetti_button.addEventListener('click', function (event) {
    // Retrieves the position and size of the button to calculate where the confetti should appear.
    const rect = confetti_button.getBoundingClientRect();

    // Calculates the horizontal (x) center of the button.
    const x = (rect.left + rect.right) / 2;

    // Calculates the vertical (y) center of the button.
    const y = (rect.top + rect.bottom) / 2;

    // Configures the settings for the confetti effect.
    const confettiSettings = {
      particleCount: 100, // Defines the number of confetti particles.
      spread: 70,         // Sets the spread angle of the confetti.
      // Specifies the origin point for the confetti effect based on the button's location.
      origin: { x: x / window.innerWidth, y: y / window.innerHeight }
    };

    // Triggers the confetti effect with the defined settings when the button is clicked.
    confetti(confettiSettings);

    counterValue++

    if (counterValue === 10) {
      const video = document.querySelector('.rickroll');
      video.style.visibility = "visible";
      video.loop = true;
      video.play()
    }

    $.ajax({
      url: "api/click/",
      type: 'POST',
      headers: { "X-CSRFToken": csrftoken },
      data: { "click": 1 },

      success: function (response) {
        
      },
      error: function (xhr, status, error) {
        console.error(error, status);
      }
    });

    counter.textContent = counterValue
  });

  logout_button.addEventListener('click', function (event) {
    fetch('api/logout/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
      }
    })
    .then(response => {
      if (response.status == 200) {
        alert("Wylogowano");
        window.location.reload();
      } else {
        alert("Nie znaleziono Użytkownika");
        window.location.reload();
      }
    }).catch(error => {
      console.error('Wystąpił błąd:', error);
    });
  });
});