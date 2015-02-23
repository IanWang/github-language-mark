'use strict';

var Dashboard = document.getElementById('dashboard');
var nodes = document.querySelectorAll('.alert .title a:last-child');

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

      var sortable = [];
      
      for(var lang in res) {
        sortable.push({ lang: res[lang] });
      };


    });
  });
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

function insertHTML(index) {
  var mark = createHtml('<span>hi</span>');
  nodes[index].parentNode.appendChild(mark);
}

function trigger() {
  console.log('trigger');
  //getLangs();
  insertHTML(0);
}

if(Dashboard) {
  
	trigger();

	new MutationObserver(trigger).observe(document.querySelector('.news'), {childList: true});
}


