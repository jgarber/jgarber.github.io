(function() {
  var main, scrollTop;
  var __hasProp = Object.prototype.hasOwnProperty, __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (__hasProp.call(this, i) && this[i] === item) return i; } return -1; };

  main = document.getElementById('main');

  if (window.location.href.indexOf('#') === -1) {
    if (__indexOf.call(window, 'pageXOffset') >= 0) {
      scrollTop = window.pageYOffset;
    } else {
      scrollTop = document.documentElement.scrollTop;
    }
    try {
      if (!(scrollTop > 0)) {
        window.scrollTo(0, main.offsetTop);
        setTimeout(arguments.callee, 1);
      }
    } catch (e) {
      setTimeout(arguments.callee, 1);
    }
  }

}).call(this);
