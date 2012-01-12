/*
  Kwicks for jQuery (version 1.5.1)
  Copyright (c) 2008 Jeremy Martin
  http://www.jeremymartin.name/projects.php?project=kwicks
  
  Modified heavily by Jason Garber to adjust spacing, not width 
  of other elements
  
  Licensed under the MIT license:
    http://www.opensource.org/licenses/mit-license.php

  Any and all use of this script must be accompanied by this copyright/license notice in its present form.
*/

(function($){
  $.fn.kwicks = function(options) {
    var defaults = {
      sticky: false,
      defaultKwick: 0,
      event: 'mouseenter',
      duration: 500,
      spacing: 5, // spacing when expanded; normal spacing is calculated
      min: 48
    };
    var o = $.extend(defaults, options);
    var Width = 'width';
    var Left = 'left';
    
    return this.each(function() {
      var container = $(this);
      var kwicks = container.children();
      kwicks.find('.pane-mask').width('auto');
      var normWidth = o.min; //kwicks.eq(0).css(Width).replace(/px/,'');
      // FIXME: normWidth no longer applies; now both min and max and figure out the container from that
      // var normSpacing = kwicks.eq(0).css('margin-right').replace(/px/,'');
      var normSpacing = (container.width() - (kwicks.size() * normWidth)) / (kwicks.size() - 1);

      // set width of container ul
      var restingWidth = (o.min * kwicks.size()) + (normSpacing * (kwicks.size() - 1));
      o.max = restingWidth - (o.min * (kwicks.size() - 1)) - (o.spacing * (kwicks.size() - 1))
      container.css({
        width : restingWidth, //(o.min * (kwicks.size() - 1)) + o.max + (o.spacing * (kwicks.size() - 1)) + 'px',
        height : kwicks.eq(0).css('height')
      });       

      // pre calculate left values for all kwicks but the first and last
      // i = index of currently hovered kwick, j = index of kwick we're calculating
      var preCalcLefts = []; // preCalcLefts = pre-calculated Lefts
      for(i = 0; i < kwicks.size(); i++) {
        preCalcLefts[i] = [];
        // don't need to calculate values for first or last kwick
        for(j = 1; j < kwicks.size() - 1; j++) {
          if(i == j) {
            preCalcLefts[i][j] = j * o.min + (j * o.spacing);
          } else {
            preCalcLefts[i][j] = (j <= i ? (j * o.min) : (j-1) * o.min + o.max) + (j * o.spacing);
          }
        }
      }
      
      // loop through all kwick elements
      kwicks.each(function(i) {
        var kwick = $(this);
        // set initial width and left values
        // set first kwick
        if(i === 0) {
          kwick.css(Left, '0px');
        } 
        // set last kwick
        else if(i == kwicks.size() - 1) {
          kwick.css('right', '0px');
        }
        // set all other kwicks
        else {
          if(o.sticky) {
            kwick.css(Left, preCalcLefts[o.defaultKwick][i]);
          } else {
            kwick.css(Left, (i * normWidth) + (i * normSpacing));
          }
        }
        // correct size in sticky mode
        if(o.sticky) {
          if(o.defaultKwick == i) {
            kwick.css(Width, o.max + 'px');
            kwick.addClass('active');
          } else {
            kwick.css(Width, o.min + 'px');
          }
        }
        kwick.css({
          margin: 0,
          position: 'absolute'
        });
        
        kwick.bind(o.event, function() {
          // calculate previous width and left values
          var prevWidths = []; // prevWidths = previous Widths
          var prevLefts = []; // prevLefts = previous Lefts
          var prevOpacities = [];
          var prevHeights = [];
          for(j = 0; j < kwicks.size(); j++) {
            prevWidths[j] = kwicks.eq(j).css(Width).replace(/px/, '');
            prevLefts[j] = kwicks.eq(j).css(Left).replace(/px/, '');
            prevOpacities[j] = kwicks.eq(j).css('opacity');
            prevHeights[j] = kwicks.eq(j).find('.pane-mask').css('height').replace(/px/, '');
          }
          var aniObj = {};
          aniObj[Width] = o.max;
          var maxDif = o.max - prevWidths[i];
          var prevWidthsMaxDifRatio = prevWidths[i]/maxDif;
          kwicks.not(kwick).stop().removeClass('active');
          var paneMask = kwick.find('.pane-mask');
          kwick.addClass('active').animate(aniObj, {
            step: function(now) {
              // calculate animation completeness as percentage
              var percentage = maxDif != 0 ? now/maxDif - prevWidthsMaxDifRatio : 1;
              paneMask.height(paneMask.find('.innertext').height() * percentage);
              // adjust other elements based on percentage
              kwicks.each(function(j) {
                kwicks.eq(i).css('opacity', 0.36 * percentage + 0.5);
                if(j != i) {
                  kwicks.eq(j).css('opacity', prevOpacities[j] - ((prevOpacities[j] - 0.5) * percentage));
                  kwicks.eq(j).css(Width, prevWidths[j] - ((prevWidths[j] - o.min) * percentage) + 'px');
                  kwicks.eq(j).find('.pane-mask').css('height', prevHeights[j] - (prevHeights[j] * percentage) + 'px')
                }
                if(j > 0 && j < kwicks.size() - 1) { // if not the first or last kwick
                  kwicks.eq(j).css(Left, prevLefts[j] - ((prevLefts[j] - preCalcLefts[i][j]) * percentage) + 'px');
                }
              });
            },
            duration: o.duration,
            easing: o.easing
          });
          return false;
        });
      });
      if(!o.sticky) {
        container.bind("mouseleave", function() {
          var prevWidths = [];
          var prevLefts = [];
          var prevOpacities = [];
          var prevHeights = [];
          var activeKwick = kwicks.filter(".active");
          kwicks.removeClass('active').stop();
          for(i = 0; i < kwicks.size(); i++) {
            prevWidths[i] = kwicks.eq(i).css(Width).replace(/px/, '');
            prevLefts[i] = kwicks.eq(i).css(Left).replace(/px/, '');
            prevOpacities[i] = kwicks.eq(i).css('opacity');
            prevHeights[i] = kwicks.eq(i).find('.pane-mask').css('height').replace(/px/, '');
          }
          var aniObj = {};
          var currOpacity;
          aniObj[Width] = normWidth;
          var normDif = activeKwick.width() - normWidth;
          activeKwick.animate(aniObj, {
            step: function(now) {
              var percentage = normDif != 0 ? (normDif - (now - normWidth))/normDif : 1;
              for(i = 0; i < kwicks.size(); i++) {
                currOpacity = prevOpacities[i] - ((prevOpacities[i] - 0.5) * percentage);
                kwicks.eq(i).css('opacity', currOpacity);
                kwicks.eq(i).css(Width, prevWidths[i] - ((prevWidths[i] - normWidth) * percentage) + 'px');
                kwicks.eq(i).find('.pane-mask').css('height', prevHeights[i] - (prevHeights[i] * percentage) + 'px')
                if(i < kwicks.size() - 1) {
                  kwicks.eq(i).css(Left, prevLefts[i] - ((prevLefts[i] - ((i * normWidth) + (i * normSpacing))) * percentage) + 'px');
                }
              }
            },
            duration: o.duration,
            easing: o.easing
          });
          return false;
        });
      }
    });
  };
})(jQuery);