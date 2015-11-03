$(document).ready(function() {

  var $levels = [1, 2, 3, 4],
    $level = $levels[0],
    $count = 0,
    $first = $("#first"),
    $second = $("#second"),
    $result = $("#result"),
    $change,
    $toFirst,
    $toSecond,
    $toResult,
    $statusTime = 1,
    $resetTimer,
    $timer = 0,
    $buttonOrMouse = 1; //0-button,1-mouse

  var MathGame = {
    assignNumber: function() {
      $change = Math.floor((Math.random() * 4) + 1);

      $toFirst = Math.floor((Math.random() * 10) + ($level === $levels[1] ? 10 : ($level === $levels[2] ? 20 : ($level === $levels[3] ? Math.floor((Math.random() * $count)) : 1))));
      $toSecond = Math.floor((Math.random() * 10) + ($level === $levels[1] ? 10 : ($level === $levels[2] ? 20 : ($level === $levels[3] ? Math.floor((Math.random() * $count)) : 1))));
      $toResult = (($change === 1 || $change === 2) ? ($toFirst + $toSecond) : Math.floor((Math.random() * 5) + ($toFirst + $toSecond + 1)));

      $first.html($toFirst);
      $second.html($toSecond);
      $result.html($toResult);
    },
    onContinue: function() {
      $count++;
      (($count >= 20 && $count < 50) ? $level = $levels[1] : (($count >= 50 && $count < 70) ? $level = $levels[2] : ($count >= 70 ? $level = $levels[3] : $level = $levels[0])))
      $(".main #level").html($level);
      $(".main #counter").html($count);
      $("#time").css("width", +"0").removeClass("medium high");
      clearInterval($resetTimer);
      $timer = 0;
      $resetTimer = setInterval(function() {
        $timer++;
        $("#time").css("width", $timer + "%");
        $(".status").text($timer);
        if ($timer >= 50 && $timer < 75) {
          $("#time").removeClass("high").addClass("medium");
        } else if ($timer >= 75 && $timer < 99) {
          $("#time").removeClass("medium").addClass("high");
        } else if ($timer >= 100) {
          clearInterval($resetTimer);
          $timer = 0;
          $statusTime = 0;
          MathGame.toEnd();
        }
      }, 10);
    },
    toStart: function() {
      $("body").removeClass("start_ON end_ON").addClass("main_ON");
      $statusTime = 1;
      $count = 0;
      $level = $levels[0];
      clearInterval($resetTimer);
      $timer = 0;
    },
    toEnd: function() {
      $("#time").css("width", +"0").removeClass("medium high");
      clearInterval($resetTimer);
      $timer = 0;
      $("body").removeClass("start_ON main_ON").addClass("end_ON");
      $(".field.end").removeClass("level1 level2 level3 level4").addClass("level" + $level);
      $(".end #level").html($level);
      $(".end #counter").html($count);
      $(".main #level").html(1);
      $(".main #counter").html(0);
    }
  }

  $(".button").on("click", function() {
    var $that = $(this);

    if ($that.hasClass("start") || $that.hasClass("replay")) {
      MathGame.assignNumber();
      MathGame.toStart();
    } else if ($that.hasClass("true") && $buttonOrMouse == 0) {
      if ($toResult === ($toFirst + $toSecond) && $statusTime == 1) {
        MathGame.onContinue();
        MathGame.assignNumber();
      } else {
        MathGame.toEnd();
      }
    } else if ($that.hasClass("false") && $buttonOrMouse == 0) {
      if ($toResult !== ($toFirst + $toSecond) && $statusTime == 1) {
        MathGame.onContinue();
        MathGame.assignNumber();
      } else {
        MathGame.toEnd();
      }
    }

    //$(".status").text( $count );

  });

  $("#withButton").on("click", function() { // button is active
    $("body").removeClass("withButton_ON").addClass("withMouse_ON");
    $buttonOrMouse = 1;
  });
  $("#withMouse").on("click", function() { // mouse is active
    $("body").removeClass("withMouse_ON").addClass("withButton_ON");
    $buttonOrMouse = 0;
  });

  $(".field.main").on({
    click: function(e) {
      if ($buttonOrMouse == 1 && $("body").hasClass("main_ON")) {
        e.preventDefault();
        e.stopPropagation();
        if ($toResult === ($toFirst + $toSecond) && $statusTime == 1) {
          MathGame.onContinue();
          MathGame.assignNumber();
        } else {
          MathGame.toEnd();
        }
      }
    },
    contextmenu: function(e) {
      if ($buttonOrMouse == 1 && $("body").hasClass("main_ON")) {
        e.preventDefault();
        e.stopPropagation();
        if ($toResult !== ($toFirst + $toSecond) && $statusTime == 1) {
          MathGame.onContinue();
          MathGame.assignNumber();
        } else {
          MathGame.toEnd();
        }
      }
    }
  });

});