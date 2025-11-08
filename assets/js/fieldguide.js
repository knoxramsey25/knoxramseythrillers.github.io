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

    function renderMatches(items){
      if(!items || items.length===0){ results.innerHTML='<div class="muted">No results</div>'; return; }
      results.innerHTML = items.slice(0,8).map(function(m){ var it = m.item||m; return '<div style="margin-bottom:8px"><a href="'+it.url+'">'+it.title+'</a><div class="muted" style="font-size:0.9rem">'+(it.excerpt||'')+'</div></div>'; }).join('');
    }

    // attempt to use Fuse.js for fuzzy search; fall back to simple substring search
    function loadFuse(){
      if(window.Fuse) return Promise.resolve(window.Fuse);
      return new Promise(function(resolve,reject){
        var s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/fuse.js@6.6.2/dist/fuse.min.js';
        s.async = true;
        s.onload = function(){ resolve(window.Fuse); };
        s.onerror = function(e){ reject(e); };
        document.head.appendChild(s);
      });
    }

    loadFuse().then(function(FuseLib){
      var fuse = new FuseLib(index, { keys:['title','excerpt'], includeScore:true, threshold:0.4, ignoreLocation:true });
      input.addEventListener('input', function(){
        var q = input.value.trim();
        if(!q){ results.innerHTML=''; return; }
        var out = fuse.search(q);
        renderMatches(out);
      });
    }).catch(function(){
      // fallback: simple substring search
      input.addEventListener('input', function(){
        var q = input.value.trim().toLowerCase();
        if(!q){ results.innerHTML=''; return; }
        var matches = index.filter(function(item){ return (item.title||'').toLowerCase().indexOf(q)!==-1 || (item.excerpt||'').toLowerCase().indexOf(q)!==-1; });
        renderMatches(matches.map(function(m){ return {item:m}; }));
      });
    });
  }

  function enableScrollSpy(){
    // consider links in the injected sidebar or authored page sidebar
    var links = Array.from(document.querySelectorAll('.fg-links a, .sidebar a'));
    if(links.length===0) return;

    // smooth scroll for in-page anchors
    links.forEach(function(a){
      if(a.hash){
        a.addEventListener('click', function(e){
          e.preventDefault();
          var t = document.querySelector(a.hash);
          if(t) t.scrollIntoView({behavior:'smooth',block:'start'});
        });
      }
    });

    // Observe sections with IDs; pick meaningful elements only
    var sections = Array.from(document.querySelectorAll('main.wrap [id], main.wrap section[id], main.wrap figure[id]')).filter(function(el){ return el.id; });
    if(sections.length===0) return;

    // intersection observer: multiple thresholds for stable detection
    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){
          var id = en.target.id;
          links.forEach(function(a){
            try{
              var href = a.getAttribute('href') || '';
              // match anchors or page+anchor
              var active = href.endsWith('#'+id) || href.indexOf('#'+id) !== -1;
              a.classList.toggle('active', active);
            }catch(e){}
          });
        }
      });
    },{root:null,rootMargin:'-10% 0px -50% 0px',threshold:[0.01,0.25,0.5]});

    sections.forEach(function(s){ observer.observe(s); });

    // keyboard navigation (j = next, k = previous) — ignore when typing in inputs
    var currentIndex = 0;
    function visibleIndex(){
      var viewportTop = window.scrollY || window.pageYOffset;
      var best = -1; var bestDist = Infinity;
      sections.forEach(function(s, i){
        var rect = s.getBoundingClientRect();
        var dist = Math.abs(rect.top);
        if(dist < bestDist){ bestDist = dist; best = i; }
      });
      return best;
    }

    function gotoIndex(i){
      if(i < 0) i = 0;
      if(i >= sections.length) i = sections.length - 1;
      var t = sections[i];
      if(t) t.scrollIntoView({behavior:'smooth',block:'start'});
    }

    window.addEventListener('keydown', function(e){
      var active = document.activeElement;
      if(active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) return;
      if(e.key === 'j' || e.key === 'J'){
        e.preventDefault(); currentIndex = visibleIndex(); gotoIndex(currentIndex + 1);
      } else if(e.key === 'k' || e.key === 'K'){
        e.preventDefault(); currentIndex = visibleIndex(); gotoIndex(currentIndex - 1);
      }
    });
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