// jQuery? We don't need no stinkin' jQuery

if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, '');
  };
}

(function(){

  // load up the icon object from whats in the DOM
  var
  x, l, y, t,
  iconElement,
  tags,
  pack,
  el,
  isResult,
  totalResults,
  clipboardTimer,
  icons = {},
  iconElements = document.getElementsByTagName("li"),
  searchInput = document.getElementById("search"),
  iconsUL = document.getElementById("icons"),
  clipboardInfo = document.getElementById("clipboard-info");

  for(x = 0, l = iconElements.length; x < l; x++) {
    iconElement = iconElements[x];
    
    if(iconElement.className.length < 6) {
      continue;
    }

    if(icons[ iconElement.className ]) {
      alert(iconElement.className + " already exists");
      continue;
    }

    iconElement.setAttribute('data-clipboard-text', iconElement.className);

    el = document.createElement("div");
    el.innerHTML = iconElement.className;
    iconElement.appendChild(el);

    tags = iconElement.getAttribute("data-tags");
    pack = iconElement.getAttribute("data-pack");
    icons[ iconElement.className ] = {
      tags: (tags ? tags.split(',') : []),
      pack: (pack ? pack : 'default'),
      el: iconElement,
      show: true,
      clip: new ZeroClipboard(iconElement)
    };
    tags = iconElement.className.split('-');
    for(y = 0; y < tags.length; y++) {
      tags[y] = tags[y].trim().toLowerCase();
      if(tags[y].length > 0 && tags[y] !== "icon") {
        icons[ iconElement.className ].tags.push(tags[y]);
      }
    }
    iconElement.addEventListener("click", iconClick);
  }
  totalResults = icons.length;
  
  function iconClick(e) {
    clipboardInfo.innerHTML = '<strong>' + e.currentTarget.className + '</strong> copied to clipboard';
    clipboardInfo.className = 'show-clipboard';
    clearTimeout(clipboardTimer);
    clipboardTimer = setTimeout(function(){
      clipboardInfo.className = '';
    }, 2500);
  }

  // search
  searchInput.addEventListener("focus", function(){
    iconsUL.className = "search-init";
    this.placeholder = "";
  });
  searchInput.addEventListener("blur", function(){
    iconsUL.className = "";
    this.placeholder = "Search";
    if(totalResults < 1 || this.value.trim() === "") {
      this.value = "";
      showAll();
    }
  });
  function onKeyUp(e) {
    var keyCode = e.which || e.keyCode;
    if(keyCode === 27) {
      this.value = "";
      this.blur();
    } else if(this.value.trim() === "") {
      showAll();
      this.value = "";
      iconsUL.className = "search-init";
    } else {
      iconsUL.className = "search-results";
      searchQuery(this.value);
    }
  }
  searchInput.addEventListener("keyup", onKeyUp);

  function searchQuery(query) {
    if(!query) return;
    
    totalResults = 0;
    
    query = query.trim().toLowerCase();

    var terms = query.split(' ');

    if(terms.length < 1) {
      showAll();
      iconsUL.className = "search-init";
      return;
    }

    iconsUL.className = "search-results";

    // set all to show
    for(x in icons) {
      icons[x].show = true;
    }

    // filter down for each term in the query
    for(t = 0; t < terms.length; t++) {
      for(x in icons) {
        if(!icons[x].show) continue;
        isResult = false;
        for(y = 0; y < icons[x].tags.length; y++) {
          if( icons[x].tags[y].indexOf(terms[t]) > -1 ) {
            isResult = true;
            break;
          }
        }
        if(!isResult) {
          icons[x].show = false;
        }
      }
    }

    // show or hide
    for(x in icons) {
      if(icons[x].show) {
        totalResults++;
        if(icons[x].el.style.display !== "inline-block") {
          icons[x].el.style.display = "inline-block";
        }
      } else {
        if(icons[x].el.style.display !== "none") {
          icons[x].el.style.display = "none";
        }
      }
    }
  }

  function showAll() {
    totalResults = icons.length;
    for(x in icons) {
      icons[x].show = true;
      if(icons[x].el.style.display !== "inline-block") {
        icons[x].el.style.display = "inline-block";
      }
    }
  }

})();