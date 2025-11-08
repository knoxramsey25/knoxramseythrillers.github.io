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
          if(t){
            t.scrollIntoView({behavior:'smooth',block:'start'});
            // visual feedback
            t.classList.add('fg-highlight');
            setTimeout(function(){ t.classList.remove('fg-highlight'); }, 1000);
          }
        });
      }
    });

    // Track progress for each section
    var style = document.createElement('style');
    style.textContent = `
      .fg-highlight{ animation: fg-flash 1s ease-out; }
      @keyframes fg-flash{
        0%{ background: rgba(82,255,168,0.2); }
        100%{ background: transparent; }
      }
      .fg-links a{ position: relative; transition: all 0.2s ease-out; }
      .fg-links a.active::before{
        content: '';
        position: absolute;
        left: -1px;
        top: 0;
        bottom: 0;
        width: 3px;
        background: var(--accent);
        border-radius: 0 2px 2px 0;
        animation: fg-indicator 0.2s ease-out;
      }
      .fg-links a.active{
        background: linear-gradient(90deg,rgba(82,255,168,0.1),transparent);
        color: var(--accent);
        padding-left: 12px;
      }
      @keyframes fg-indicator{
        from{ transform: scaleY(0); }
        to{ transform: scaleY(1); }
      }
    `;
    document.head.appendChild(style);

    // Observe sections with IDs; pick meaningful elements only
    var sections = Array.from(document.querySelectorAll('main.wrap [id], main.wrap section[id], main.wrap figure[id]')).filter(function(el){ return el.id; });
    if(sections.length===0) return;

    // improved intersection observer with more thresholds
    var observer = new IntersectionObserver(function(entries){
      // gather all visible sections
      var visibleSections = new Set();
      entries.forEach(function(en){
        if(en.isIntersecting && en.intersectionRatio > 0.2){
          visibleSections.add(en.target.id);
        }
      });
      
      // update all links
      links.forEach(function(a){
        try{
          var href = a.getAttribute('href') || '';
          var id = href.split('#')[1];
          // match visible sections
          a.classList.toggle('active', id && visibleSections.has(id));
        }catch(e){}
      });
    },{
      root: null,
      rootMargin: '-15% 0px -35% 0px',
      threshold: [0, 0.2, 0.4, 0.6, 0.8, 1.0]  // more granular thresholds
    });

    sections.forEach(function(s){ observer.observe(s); });

    // Enhanced keyboard navigation (j/k + Home/End)
    var currentIndex = 0;
    function visibleIndex(){
      var viewportMid = window.innerHeight / 2;
      var best = -1, bestDist = Infinity;
      sections.forEach(function(s, i){
        var rect = s.getBoundingClientRect();
        var dist = Math.abs(rect.top + rect.height/2 - viewportMid);
        if(dist < bestDist){ bestDist = dist; best = i; }
      });
      return best;
    }

    function gotoIndex(i, align='center'){
      if(i < 0) i = 0;
      if(i >= sections.length) i = sections.length - 1;
      var t = sections[i];
      if(t){
        t.scrollIntoView({behavior:'smooth',block:align});
        // visual feedback
        t.classList.add('fg-highlight');
        setTimeout(function(){ t.classList.remove('fg-highlight'); }, 1000);
      }
    }

    // number key shortcuts (1-9 jump to sections)
    function getShortcutTargets(){
      return sections.slice(0, 9).reduce(function(map, section, i){
        map[(i + 1).toString()] = section;
        return map;
      }, {});
    }

    window.addEventListener('keydown', function(e){
      var active = document.activeElement;
      if(active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) return;
      
      if(e.key === 'j' || e.key === 'J'){
        e.preventDefault();
        currentIndex = visibleIndex();
        gotoIndex(currentIndex + 1);
      } else if(e.key === 'k' || e.key === 'K'){
        e.preventDefault();
        currentIndex = visibleIndex();
        gotoIndex(currentIndex - 1);
      } else if(e.key === 'Home'){
        e.preventDefault();
        gotoIndex(0, 'start');
      } else if(e.key === 'End'){
        e.preventDefault();
        gotoIndex(sections.length - 1, 'end');
      } else if(e.key >= '1' && e.key <= '9'){
        // number keys 1-9 jump to sections
        e.preventDefault();
        var targets = getShortcutTargets();
        var target = targets[e.key];
        if(target) target.scrollIntoView({behavior:'smooth',block:'start'});
      }
    });
  }

  if(inFieldGuide()){
    // Inject global Mermaid palette overrides once for all diagrams (CSS approach)
    (function injectMermaidTheme(){
      if(document.getElementById('fg-mermaid-theme')) return;
      var css = `:root{--mermaid-bg:#0d171c;--mermaid-node-bg:#12313d;--mermaid-border:#52ffa8;--mermaid-text:#e8eef5}`+
        `.mermaid svg{background:var(--mermaid-bg)!important}`+
        `.mermaid .node rect,.mermaid .node polygon{fill:var(--mermaid-node-bg)!important;stroke:var(--mermaid-border)!important}`+
        `.mermaid .cluster rect{fill:var(--mermaid-node-bg)!important;stroke:var(--mermaid-border)!important}`+
        `.mermaid .edgePath path{stroke:var(--mermaid-border)!important}`+
        `.mermaid text, .mermaid span{fill:var(--mermaid-text)!important}`+
        `.mermaid .label foreignObject{color:var(--mermaid-text)!important}`+
        `.mermaid .node > *{transition:fill .25s ease, stroke .25s ease}`;
      var styleTag = document.createElement('style');
      styleTag.id = 'fg-mermaid-theme';
      styleTag.textContent = css;
      document.head.appendChild(styleTag);
    })();
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