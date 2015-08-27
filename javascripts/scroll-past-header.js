(function() {
  var e, main, scrollTop;

  if (window.location.href.indexOf('#') === -1) {
    main = document.getElementById('main');
    if (window.pageYOffset != null) {
      scrollTop = window.pageYOffset;
    } else {
      scrollTop = document.documentElement.scrollTop;
    }
    try {
      if (!(scrollTop > 0)) {
        window.scrollTo(0, main.offsetTop);
        setTimeout(arguments.callee, 1);
      }
    } catch (_error) {
      e = _error;
      setTimeout(arguments.callee, 1);
    }
  }

}).call(this);
