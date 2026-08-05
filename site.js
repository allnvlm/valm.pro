/* valm.pro shared runtime. Edit here only.
   Loaded with defer on every page. Every block guards on the elements it needs,
   so the same file is safe on the home page, the privacy notice and the 404. */
(function(){


  // scroll reveal
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window){
    var ro = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('in'); ro.unobserve(e.target); } });
    }, {rootMargin:'0px 0px -12% 0px', threshold:0.08});
    reveals.forEach(function(el){ ro.observe(el); });
  } else { reveals.forEach(function(el){ el.classList.add('in'); }); }

  // nav: transparent over hero, solid on scroll
  var nav = document.getElementById('nav');
  var ticking = false;
  if (nav) {
  function onScroll(){
    if (!ticking){
      window.requestAnimationFrame(function(){
        nav.classList.toggle('nav--solid', window.scrollY > 24);
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
  }

  // ---- Analytics events ----
  // Sent through gtag, so Consent Mode governs them. With consent denied they
  // travel as cookieless pings and set nothing on the device.
  (function(){
    function track(name, params){
      try { if (typeof gtag === 'function') gtag('event', name, params || {}); } catch(e){}
    }
    window.vpTrack = track;

    // 1. How far people actually read. One event name, section as a parameter.
    var SECTIONS = {
      's-patterns':  'patterns',
      's-get':       'what_you_get',
      's-honest':    'honest_part',
      's-start':     'how_it_starts',
      's-record':    'track_record',
      's-questions': 'first_session',
      's-built':     'readiness_teaser',
      's-gl-contact': 'readiness_contact',
      's-close':     'contact'
    };
    if ('IntersectionObserver' in window){
      var seen = {};
      var so = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if (!e.isIntersecting) return;
          var key = e.target.getAttribute('aria-labelledby');
          var name = SECTIONS[key];
          if (!name || seen[name]) return;
          seen[name] = true;
          track('section_view', { section: name });
          so.unobserve(e.target);
        });
      }, { threshold: 0.35 });
      Object.keys(SECTIONS).forEach(function(k){
        var sec = document.querySelector('[aria-labelledby="' + k + '"]');
        if (sec) so.observe(sec);
      });
    }

    // 2. Intent, then the lead itself
    // Buttons only move the reader to the contact section, so they are intent
    document.querySelectorAll('a[href="#contact"]').forEach(function(a){
      a.addEventListener('click', function(){
        track('cta_click', { location: a.classList.contains('nav-cta') ? 'nav' : 'hero' });
      });
    });

    // Choosing an actual route is the lead
    document.querySelectorAll('a[data-route]').forEach(function(a){
      a.addEventListener('click', function(){
        track('generate_lead', {
          method: a.getAttribute('data-route'),
          location: a.closest('.footer') ? 'footer' : 'contact'
        });
      });
    });


    // 3. Consent decisions, so the acceptance rate is known
    ['consent-yes','consent-no'].forEach(function(id){
      var el = document.getElementById(id);
      if (el) el.addEventListener('click', function(){
        track('consent_choice', { choice: id === 'consent-yes' ? 'granted' : 'denied' });
      });
    });
  })();



  // Consent banner
  (function(){
    var el = document.getElementById('consent');
    if (!el) return;
    var stored = null;
    try { stored = localStorage.getItem('vp-consent'); } catch(e){}
    function decide(value){
      try { localStorage.setItem('vp-consent', value); } catch(e){}
      if (value === 'granted' && typeof gtag === 'function'){
        gtag('consent', 'update', { 'analytics_storage': 'granted' });
      }
      el.classList.remove('show');
      setTimeout(function(){ el.hidden = true; }, 420);
    }
    function open(){
      el.hidden = false;
      requestAnimationFrame(function(){
        requestAnimationFrame(function(){ el.classList.add('show'); });
      });
    }
    document.getElementById('consent-yes').addEventListener('click', function(){ decide('granted'); });
    document.getElementById('consent-no').addEventListener('click', function(){ decide('denied'); });

    // Withdrawing consent must be as easy as giving it
    var reopen = document.getElementById('cookie-settings');
    if (reopen){
      var reopenBanner = function(e){
        e.preventDefault();
        try { localStorage.removeItem('vp-consent'); } catch(err){}
        open();
        document.getElementById('consent-no').focus();
      };
      reopen.addEventListener('click', reopenBanner);
      // role="button" promises the space bar works, which anchors do not do on their own
      reopen.addEventListener('keydown', function(e){
        if (e.key === ' ' || e.key === 'Spacebar') reopenBanner(e);
      });
    }

    if (stored === 'granted' || stored === 'denied') return;
    open();
  })();
})();
