var passLast = null,
    submitted = false,
    sections,
    curSection = 0,
    infos, curInfo,
    secHtml = $("#sections").html(),
    dossHtml = $("#dossier").html(),
    specHtml = $("#special").html(),
    skillHtml = $("#skills").html(),
    perkHtml = $("#perks").html(),
    invHtml = $("#inventory").html(),
    oocHtml = $("#ooc").html(),
    music = document.getElementById("music");
    
    music.volume = musicVolume/100;

function getHtml(target) {
  var html;
  switch (target) {
    case "#dossier":
      html = dossHtml;
      break;
    case "#special":
      html = specHtml;
      break;
    case "#skills":
      html = skillHtml;
      break;
    case "#perks":
      html = perkHtml;
      break;
    case "#inventory":
      html = invHtml;
      break;
    case "#ooc":
      html = oocHtml;
      break;
    default: 
      html = `
        You took a wrong turn.
        <div class="goBack">Go Back</div>
      `
  }

  return html
}

function chooseSection() {
  $("#acceptPassword .ti-cursor").remove();
  $("#sections").show();
  type("#sections", focusSelection);
}

function focusSelection() {
  sections = $(".section").length;
  curSection = 0;

  $(".section").eq(curSection).addClass("focused");
}

function setInfo(elem) {
  infos = $(`${elem} .info`).length,
  curInfo = 0;

  $(".section").removeClass("focused");
  $(`${elem} .info`).eq(curInfo).addClass("focused");
}

$(document).keydown(function(e) {
  if($(".section").hasClass("focused")) {
    if(e.keyCode == 38 || e.keyCode == 87) {
      if(curSection == 0) {
        // do nothing
      } else {
        --curSection
      }
    } else if (e.keyCode == 40 || e.keyCode == 83) {
      if(curSection == sections - 1) {
        // do nothing
      } else {
        ++curSection
      }
    }

    if(e.keyCode == 32 || e.keyCode == 13) {
      var opens = `#${$(".section.focused").attr("opens")}`;

      $(opens).replaceWith($("<div>", {
        id: $(".section.focused").attr("opens"),
        class: "tab",
        html: getHtml(opens),
        style: `display: block`
      }));
      type(opens, setInfo, opens);
      return null;
    }

    $(".section").removeClass("focused")
    $(".section").eq(curSection).addClass("focused");
  } else if($(".tab").is(":visible")) {
    if(e.keyCode == 38 || e.keyCode == 87) {
      if(curInfo == 0) {
        
      } else {
        --curInfo
      }

      $(".goBack").removeClass("focused");
    } else if (e.keyCode == 40 || e.keyCode == 83) {
      if ($(".tab:visible .info").length == 0) {
        $(".tab:visible .goBack").addClass("focused");
      } else if(curInfo == infos - 1) {
        $(".tab:visible .goBack").addClass("focused");
        ++curInfo
      } else if(curInfo == infos) {
        // do nothing
      } else {
        ++curInfo
      }
    }

    if((e.keyCode == 32 || e.keyCode == 13) && $(".tab:visible .goBack").hasClass("focused")) {
      $(".tab:visible").hide();
      $("#sections").replaceWith( $("<span>", {
          id: "sections",
          html: secHtml
        })
        )

      type("#sections", focusSelection);
      return null;
    }

    $(".tab .info").removeClass("focused")
    $(".tab:visible .info").eq(curInfo).addClass("focused");
    $(".tab:visible #detail").html(`${$(".tab:visible .goBack").hasClass("focused")?"":$(".tab:visible .info").eq(curInfo).attr("detail")}`);
  } else {
    // do nothing
  }
});

function type(element, executable, param) {
  new TypeIt(element,{
    lifeLike: true,
    cursor: true,
    speed: 2,
    cursorSpeed: 1000,
    cursorChar: "_",
    breakLines: true,
    nextStringDelay: 0,
    html: true
  }).exec(async () => {
    if(executable != null) {
      await executable(param);
    } else {
      // do nothing
    }
  }).go();
}

function letsStart() {
  $("#falloutPassword").focus();
  $("#falloutPassword").keydown(function(e){
    var value = $(this).val(),
      val = value.slice(0, value.length - 1),
      last = value.slice(value.length - 1);
    if(e.keyCode == 8) {
      return false;
    }
    if( password.length > 0 ) {
      if (last == passLast) {
        $(this).val(`${value + password[0]}`)
      } else {
        $(this).val(`${val + password[0]}`)
      }
      if(password.length > 1) {
        passLast = password[0];
        password = password.slice(0 - (password.length-1), password.length);
      } else {
        password = ""
        document.getElementById("falloutPassword").disabled = true;
      };
    } else {
      // do nothing
    };
  });

  $("body").keydown(function(e){
    if(e.keyCode == 13 && password.length == 0 && !submitted) {
      submitted = true;
      music.play();
      $("#falloutPassword").css("box-shadow", "none");
      $("#falloutPassword").attr("type", "password");
      $("#intro .ti-cursor").remove();
      $("#acceptPassword").show();
      type("#acceptPassword", chooseSection);
    }
  })
}

$("#musicControl").click(function(){
  if($(this).hasClass("play")) {
    $(this).removeClass("play");
    $(this).addClass("pause");
    music.volume = 0;
  } else {
    $(this).removeClass("pause");
    $(this).addClass("play");
    music.volume = musicVolume/100;
  }
});

type("#intro", letsStart)