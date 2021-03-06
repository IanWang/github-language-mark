'use strict';

var Dashboard = document.getElementById('dashboard');
var nodes;

function getNodes() {
  nodes = document.querySelectorAll('.alert .title a:last-child');
}

function httpGet(url, cb) {

  var xhr = new XMLHttpRequest();

  xhr.open("GET", url, true);
  xhr.onload = function(e) {
    if(xhr.readyState === 4 && xhr.status === 200) {
      cb(xhr.responseText);  
    }
  };
  xhr.send(null);
}

function fetchApi(repo, cb) {
  var url = 'https://api.github.com/repos/' + repo + '/languages';
  httpGet(url, function(res) {
    cb(res);
  });
}

function getLangs() {

  var repos = [].map.call(nodes, function(node) {
    return node.text;
  });

  repos.forEach(function(ele, index) {

    fetchApi(ele, function(res) {

      var data = JSON.parse(res);
      var langs = Object.keys(data).sort(function(a, b) {
        return -(data[a] - data[b]);
      });

      if(langs[0]) insertHTML(langs[0], index);

    });
  });
}

function insertHTML(lang, index) {
  var mockup = '<span style="background: rgb(231, 231, 231);margin: 0 0.5em;font-size: 12px;padding: 2px 5px;border-radius: 5px;">' + lang + '</span>';
  var mark = createHtml(mockup);
  var parentNode = nodes[index].parentNode;

  parentNode.hasAttribute('lang') ? 
    parentNode.setAttribute('lang', lang) :
    parentNode.appendChild(mark);

}

function createHtml(str) {
  var frag = document.createDocumentFragment();
  var temp = document.createElement('span');

  temp.innerHTML = str;

  while (temp.firstChild) {
    frag.appendChild(temp.firstChild);
  }

  return frag;
}

function trigger() {
  getNodes();
  getLangs();
}

if(Dashboard) {
  trigger();
  new MutationObserver(trigger).observe(
    document.querySelector('.news'), {childList: true}
  );
}


