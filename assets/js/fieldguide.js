// Inject shared fieldguide sidebar, enable simple search and scrollspy
(function(){
  function inFieldGuide(){ return location.pathname.startsWith('/fieldguide'); }

  function insertSidebar(html){
    // If page already has a .sidebar element (like biology), do nothing
    if(document.querySelector('.sidebar') || document.getElementById('fg-sidebar-root')) return;
    var container = document.querySelector('main.wrap') || document.body;
    var layout = document.createElement('div');
    layout.className = 'layout';
    // create sidebar wrapper
    var aside = document.createElement('aside');
    aside.className = 'sidebar';
    aside.setAttribute('aria-label','Field guide navigation');
    aside.innerHTML = html;
    // move existing main content into a section
    var content = document.createElement('section');
    // move children of container into content
    while(container.firstChild){ content.appendChild(container.firstChild); }
    layout.appendChild(aside);
    layout.appendChild(content);
    container.appendChild(layout);
  }

  function fetchSidebar(){
    return fetch('/fieldguide/_sidebar.html').then(function(r){ if(!r.ok) throw r; return r.text(); });
  }

  function fetchIndex(){
    return fetch('/fieldguide/index.json').then(function(r){ if(!r.ok) throw r; return r.json(); }).catch(function(){ return []; });
  }

  function setupSearch(index){
    var input = document.getElementById('fg-search-input');
    var results = document.getElementById('fg-search-results');
    if(!input) return;
    var last = null;
    input.addEventListener('input', function(){
      var q = input.value.trim().toLowerCase();
      if(!q){ results.innerHTML=''; return; }
      var matches = index.filter(function(item){ return (item.title||'').toLowerCase().indexOf(q)!==-1 || (item.excerpt||'').toLowerCase().indexOf(q)!==-1; });
      if(matches.length===0){ results.innerHTML='<div class="muted">No results</div>'; return; }
      results.innerHTML = matches.slice(0,8).map(function(m){ return '<div style="margin-bottom:8px"><a href="'+m.url+'">'+m.title+'</a><div class="muted" style="font-size:0.9rem">'+(m.excerpt||'')+'</div></div>'; }).join('');
    });
  }

  function enableScrollSpy(){
    var links = Array.from(document.querySelectorAll('.fg-links a'));
    if(links.length===0) return;
    // smooth scroll for in-page anchors
    links.forEach(function(a){ if(a.hash){ a.addEventListener('click', function(e){ e.preventDefault(); var t=document.querySelector(a.hash); if(t) t.scrollIntoView({behavior:'smooth',block:'start'}); }); } });
    var sections = Array.from(document.querySelectorAll('section[id], figure[id], [id]')).filter(function(el){ return el.id; });
    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if(en.isIntersecting){ var id = en.target.id; links.forEach(function(a){ a.classList.toggle('active', a.getAttribute('href') && a.getAttribute('href').endsWith('#'+id)); }); } });
    },{root:null,rootMargin:'-20% 0px -60% 0px',threshold:0});
    sections.forEach(function(s){ observer.observe(s); });
  }

  if(inFieldGuide()){
    fetchSidebar().then(function(html){
      insertSidebar(html);
      return fetchIndex();
    }).then(function(index){
      setupSearch(index);
      enableScrollSpy();
    }).catch(function(err){
      // silent failure; don't break site
      console.warn('Fieldguide loader error', err);
    });
  }
})();
