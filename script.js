

$(function(){

  var buildingGroups = $("#buildings_resources #buildings g");
  var buildingWidths = [35,17,20,17,23,48,59,108,73];
  var $stage = $("#scene");
  
  var stageWidth = $('body').width();
  var stageHeight = $('body').height();
  var $mask1 = null;
  $("#stage").css({
    'width': "100%",
    'height': "100%"
  })
  
  console.log("Rendering Scene", stageWidth, stageHeight);
 
  
  var scene1 = function(){
    console.log('Starting scene 1');
    var $scene1 = $("#scene1");
    $mask1 = $("#buildings_resources #mask1").clone();
    $mask1.appendTo("#scene1-clip");
    var lastBuildingIndex = 0;
    var elementIndex = 0;
    var nextXPos = 0;
    
    //reposition and resize mask to fill entire screen
    maskXPos = Math.round(stageWidth/2) - Math.round($mask1[0].getBoundingClientRect().width/2);
    maskYPos = Math.round(stageHeight/2) - Math.round($mask1[0].getBoundingClientRect().height/2);
    scale = Math.max(stageWidth,stageHeight) / ($mask1[0].getBoundingClientRect().width/2);

    $mask1.css({
      'transform-origin': 'center center',
      'transform': 'translate('+maskXPos+'px, '+maskYPos+'px) scale('+scale+')'
    }).data('xPos', maskXPos).data('yPos', maskYPos);

    while(nextXPos < stageWidth){
      while(lastBuildingIndex == elementIndex){
        elementIndex = Math.floor(Math.random() * (buildingGroups.size() - 1) );
      }

      var buildingElement = $(buildingGroups[elementIndex]).clone();

      translateY = stageHeight - 220;
      translateX = nextXPos;
      nextXPos += buildingWidths[elementIndex];

      buildingElement.appendTo($scene1);
      buildingElement.css({
        'transform': 'translate('+translateX+'px,'+stageHeight+'px)'
      });

      buildingElement.attr('class','animated');
      buildingElement.data('xPos', translateX);
      buildingElement.data('yPos', translateY);

      buildingElement.css({
        'transform-origin': 'center bottom',
        'transform': 'translate('+translateX+'px,'+stageHeight+'px) scale(0.2)'
      });

      lastBuildingIndex = elementIndex;
    }

    $scene1.find('g').each(function(i, element){
      setTimeout(function(){
        $(element).css({
          'transform': 'translate('+$(element).data('xPos')+'px,'+$(element).data('yPos')+'px) scale(1)'
        });
      }, Math.round(Math.random() * i)*100);
    });

    setTimeout(scene2, ($scene1.find('g').size() + 5) * 65);
    
    
  }
  
  var scene2 = function(){
    console.log('Starting scene 2');
    
    $mask = $("#scene1-clip #mask1");
    $mask.attr('class', 'animated');
    xPos = $mask.data('xPos');
    yPos = $mask.data('yPos');
    
    $mask.css({
      'transition': 'all 1s',
      'transform': 'translate('+xPos+'px, '+yPos+'px) scale(1)'
    });
    
    setTimeout(scene3, 400);
    setTimeout(scene4, 400);

  }
  
  var scene3 = function(nextScene){
    console.log('Starting scene 3');
    
    //hide the blocks from scene1
    $("#scene1").find('g').each(function(i, element){
      setTimeout(function(){
        $(element).css({
          'transform': 'translate('+$(element).data('xPos')+'px,'+stageHeight+'px) scale(1)'
        });
      },100);
    });
    
    
    
    $scene3 = $("#scene3");
    $logoOutlines = $("#logo_x5F_outerline").clone();

    $logoOutlines.appendTo($scene3);
    
    $mask = $("#scene1-clip #mask1");
    $mask.attr('class', 'animated');
    xPos = $mask.data('xPos');
    yPos = $mask.data('yPos');
    
    $logoOutlines.css({
      'transform': 'translate('+xPos+'px, '+yPos+'px) scale(1)'
    });
    
    $logoOutlines.find('path').each(function(i, element){
      _animatePath(element, i%2 == 0 ? 1 : -1);
    });
    
    //setTimeout(scene4, 10);
  }
  
  var scene4 = function(){
    console.log('Starting scene 4');
    
    $scene4 = $("#scene4");
    
    var $logoInnerLines = $("#inner_x5F_logo").clone();

    $logoInnerLines.appendTo($scene4);
    $logoInnerLines.attr('stroke-width', 1);
    
    $mask = $("#scene1-clip #mask1");
    xPos = $mask.data('xPos');
    yPos = $mask.data('yPos');

    $logoInnerLines.css({
      'transform': 'translate('+xPos+'px, '+yPos+'px) scale(1)',
      'fill': 'white',
      'transition': 'fill 2s ease'
    });
    
    setTimeout(function(){
      $logoInnerLines.css({
        'fill':'#5e5e5e'
      });
    }, 1000);
    
    $scene4_mask = $logoInnerLines.clone();
    $scene4_mask.appendTo('#scene4-clip');
    
    _animatePath($logoInnerLines[0], 1, 1000/60, 0.5, 50);
    
    setTimeout(scene5, 2000);
  }
  
  var scene5 = function(){
    console.log('Starting scene 5');
    var preContent = $("#content").text().split("\n");
    
    var curentLine = 0;
    var columnNumber = 0;

    var curentParagraphLine = $("<p></p>");
    
    curentParagraphLine.appendTo('#typewriter');
    curentParagraphLine.show();
    
    var typeIn = function(){
      while(columnNumber <= preContent[curentLine].length) {
        curentParagraphLine.html(
          preContent[curentLine].slice(0,columnNumber) 
        );
        columnNumber++;
        
        curentParagraphLine.html(
          curentParagraphLine.html().replace('MyGov Dev', '<a href="http://mygov.ro" target="_blank">MyGov Dev</a>')
        );
        curentParagraphLine.html(
          curentParagraphLine.html().replace('contact@mygov.ro', '<a href="mailto:contact@mygov.ro">contact@mygov.ro</a>')
        );
        
        
        setTimeout(typeIn, 10);
        return;
      }

      curentLine++;
      columnNumber = 0;
      curentParagraphLine = $("<p></p>");
      curentParagraphLine.appendTo('#typewriter');
      if(curentLine<preContent.length) {
        setTimeout(typeIn, Math.round(Math.random()*500));
      
        $("#stage").animate({
          'margin-top': - $('#typewriter').height()/2
        }, 500);
      }
    }
    
    

      typeIn();

    
  }
  
  scene1();
  
  var _animatePath = function(path, direction, speed, percentage, start_proc){
    var pathLength = path.getTotalLength();
    path.style.strokeDasharray = pathLength + ' ' + pathLength; 
    path.style.strokeDashoffset = pathLength;
    var animateablePath = path;
    var speed = speed || 1000/60;
    var percentage = percentage || 1;
    var start_proc = start_proc || 0;
    
    $(animateablePath).data('percent', start_proc);
    
    var interval = setInterval(function(){

      animateablePath.style.strokeDashoffset = pathLength +  pathLength/100*$(animateablePath).data('percent')*direction;
      
      $(animateablePath).data('percent', $(animateablePath).data('percent') + percentage);
      if($(animateablePath).data('percent') > 100) {
        clearInterval(interval);
      }
    }, speed);
  }
  
  
});




//
// Clinic Photo Gallery
// - Stop Autoplay
// --------------------------------------------------
$('#clinicPhotoGallery').carousel({
    interval: false
}) 



// Show/Hide Thumbnail Gallery
// ---------------------------------------
$(document).ready(function(){
  // Show Thumbnail Gallery on Click
  $("#showThumbnailGallery").click(function(){
    $(".thumbnails-carousel").removeClass("hide");
    $("#showThumbnailGallery").addClass("hide");
    $("#hideThumbnailGallery").removeClass("hide");
  });
  // Hide Thumbnail Gallery on Click
  $("#hideThumbnailGallery").click(function(){
    $(".thumbnails-carousel").addClass("hide");
    $("#showThumbnailGallery").removeClass("hide");
    $("#hideThumbnailGallery").addClass("hide");
  });
});


// Photo Gallery Thumbnail
// thumbnails.carousel.js jQuery plugin
// ---------------------------------------
;(function(window, $, undefined) {

  var conf = {
    center: true,
    backgroundControl: false
  };

  var cache = {
    $carouselContainer: $('.thumbnails-carousel').parent(),
    $thumbnailsLi: $('.thumbnails-carousel li'),
    $controls: $('.thumbnails-carousel').parent().find('.carousel-control')
  };

  function init() {
    cache.$carouselContainer.find('ol.carousel-indicators').addClass('indicators-fix');
    cache.$thumbnailsLi.first().addClass('active-thumbnail');

    if(!conf.backgroundControl) {
      cache.$carouselContainer.find('.carousel-control').addClass('controls-background-reset');
    }
    else {
      cache.$controls.height(cache.$carouselContainer.find('.carousel-inner').height());
    }

    if(conf.center) {
      cache.$thumbnailsLi.wrapAll("<div class='center clearfix'></div>");
    }
  }

  function refreshOpacities(domEl) {
    cache.$thumbnailsLi.removeClass('active-thumbnail');
    cache.$thumbnailsLi.eq($(domEl).index()).addClass('active-thumbnail');
  } 

  function bindUiActions() {
    cache.$carouselContainer.on('slide.bs.carousel', function(e) {
        refreshOpacities(e.relatedTarget);
    });

    cache.$thumbnailsLi.click(function(){
      cache.$carouselContainer.carousel($(this).index());
    });
  }

  $.fn.thumbnailsCarousel = function(options) {
    conf = $.extend(conf, options);

    init();
    bindUiActions();

    return this;
  }

})(window, jQuery);

$('.thumbnails-carousel').thumbnailsCarousel();


$('.cookiesbutton').click(function(){
   $('.cookies').fadeOut(500);
}); 







// Increments the delay on each item.
$('.rolldown-list li').each(function () {
  var delay = ($(this).index() / 4) + 's';
  $(this).css({
    webkitAnimationDelay: delay,
    mozAnimationDelay: delay,
    animationDelay: delay
  });
});

$('#btnReload').click(function () {
  $('#myList').removeClass('rolldown-list');
  setTimeout(function () {
    $('#myList').addClass('rolldown-list');
  }, 1);
});



/* Demo purposes only */
$(".hover").mouseleave(
  function() {
    $(this).removeClass("hover");
  }
);





$(function() {
  $('.pop-up').hide();
  $('.pop-up').fadeIn(1000);
  
      $('.close-button').click(function (e) { 

      $('.pop-up').fadeOut(700);
      $('#overlay').removeClass('blur-in');
      $('#overlay').addClass('blur-out');
      e.stopPropagation();
        
    });
 });







