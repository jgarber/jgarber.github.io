---
---
if window.location.href.indexOf('#') == -1 # don't scroll if it's a hash
  main = document.getElementById('main')
  if window.pageYOffset? # all browsers, except IE before version 9
    scrollTop = window.pageYOffset
  else  # Internet Explorer < version 9
    scrollTop = document.documentElement.scrollTop
    
  try
    if !(scrollTop > 0)
      window.scrollTo(0, main.offsetTop)
      setTimeout(arguments.callee, 1) # recurse until scrolled
  catch e
    setTimeout(arguments.callee, 1) # recurse if error
