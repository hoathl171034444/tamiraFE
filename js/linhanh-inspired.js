/* global $ */
(function () {
  function initGSAP() {
    if (typeof window.gsap === 'undefined') return;
    if (typeof window.ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    gsap.from('.la-anim-title', { y: 18, opacity: 0, duration: 0.9, ease: 'power3.out' });
    gsap.from('.la-anim-subtitle', { y: 14, opacity: 0, duration: 0.9, delay: 0.1, ease: 'power3.out' });

    // Subtle parallax on hero slides
    if (typeof window.ScrollTrigger !== 'undefined') {
      gsap.to('.la-home-hero-slide', {
        scale: 1.08,
        y: 28,
        ease: 'none',
        scrollTrigger: {
          trigger: '.la-home-hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }
  }

  function initLazyBlurUp() {
    var imgs = document.querySelectorAll('img.la-blur-up');
    imgs.forEach(function (img) {
      if (img.complete) {
        img.classList.add('is-loaded');
        return;
      }
      img.addEventListener('load', function () {
        img.classList.add('is-loaded');
      });
    });
  }

  function initLightbox() {
    var lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    var imgEl = lightbox.querySelector('.la-lightbox-img');
    var closeBtn = lightbox.querySelector('[data-lightbox-close]');

    function open(src) {
      if (!src) return;
      imgEl.src = src;
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
    }

    function close() {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      imgEl.src = '';
    }

    document.querySelectorAll('[data-lightbox]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        open(a.getAttribute('href'));
      });
    });

    document.querySelectorAll('.la-results-grid img').forEach(function (img) {
      img.addEventListener('click', function () {
        open(img.getAttribute('src'));
      });
    });

    closeBtn && closeBtn.addEventListener('click', close);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  function initBookingWizard() {
    var root = document.querySelector('.la-booking');
    if (!root) return;

    var state = { step: 1, service: '', date: '', time: '' };
    var panels = root.querySelectorAll('.la-booking-panel');
    var steps = root.querySelectorAll('.la-step');

    var summaryService = root.querySelector('[data-summary-service]');
    var summaryDate = root.querySelector('[data-summary-date]');
    var summaryTime = root.querySelector('[data-summary-time]');

    var inputService = root.querySelector('[data-booking-service]');
    var inputDate = root.querySelector('[data-booking-date]');
    var inputTime = root.querySelector('[data-booking-time]');

    function setStep(n) {
      state.step = n;
      panels.forEach(function (p) { p.classList.toggle('active', String(n) === p.getAttribute('data-step')); });
      steps.forEach(function (s) { s.classList.toggle('active', String(n) === s.getAttribute('data-step-indicator')); });
      updateSummary();
    }

    function updateSummary() {
      if (summaryService) summaryService.textContent = state.service || '—';
      if (summaryDate) summaryDate.textContent = state.date || '—';
      if (summaryTime) summaryTime.textContent = state.time || '—';
      if (inputService) inputService.value = state.service || '';
      if (inputDate) inputDate.value = state.date || '';
      if (inputTime) inputTime.value = state.time || '';
    }

    // Choices
    root.querySelectorAll('.la-choice').forEach(function (btn) {
      btn.addEventListener('click', function () {
        root.querySelectorAll('.la-choice').forEach(function (b) { b.classList.remove('selected'); });
        btn.classList.add('selected');
        state.service = btn.getAttribute('data-choice') || btn.textContent.trim();
        updateSummary();
      });
    });

    // Slots
    root.querySelectorAll('.la-slot').forEach(function (btn) {
      btn.addEventListener('click', function () {
        root.querySelectorAll('.la-slot').forEach(function (b) { b.classList.remove('selected'); });
        btn.classList.add('selected');
        state.time = btn.getAttribute('data-slot') || btn.textContent.trim();
        updateSummary();
      });
    });

    // Calendar (simple month)
    var now = new Date();
    var view = { y: now.getFullYear(), m: now.getMonth() };
    var title = root.querySelector('[data-cal-title]');
    var grid = root.querySelector('[data-cal-grid]');

    function renderCalendar() {
      if (!grid) return;
      grid.innerHTML = '';
      var first = new Date(view.y, view.m, 1);
      var startDay = first.getDay(); // 0 Sun
      var daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
      var monthNames = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'];
      if (title) title.textContent = monthNames[view.m] + ' ' + view.y;

      for (var i = 0; i < startDay; i++) {
        var empty = document.createElement('button');
        empty.type = 'button';
        empty.className = 'la-day muted';
        empty.textContent = '';
        empty.disabled = true;
        grid.appendChild(empty);
      }
      for (var d = 1; d <= daysInMonth; d++) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'la-day';
        btn.textContent = String(d);
        (function (day) {
          btn.addEventListener('click', function () {
            grid.querySelectorAll('.la-day').forEach(function (x) { x.classList.remove('selected'); });
            btn.classList.add('selected');
            var mm = String(view.m + 1).padStart(2, '0');
            var dd = String(day).padStart(2, '0');
            state.date = dd + '/' + mm + '/' + view.y;
            updateSummary();
          });
        })(d);
        grid.appendChild(btn);
      }
    }

    var prev = root.querySelector('[data-cal-prev]');
    var next = root.querySelector('[data-cal-next]');
    prev && prev.addEventListener('click', function () {
      view.m -= 1;
      if (view.m < 0) { view.m = 11; view.y -= 1; }
      renderCalendar();
    });
    next && next.addEventListener('click', function () {
      view.m += 1;
      if (view.m > 11) { view.m = 0; view.y += 1; }
      renderCalendar();
    });
    renderCalendar();

    // Next/Prev
    root.querySelectorAll('[data-next-step]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (state.step === 1 && !state.service) return;
        if (state.step === 2 && !state.date) return;
        if (state.step === 3 && !state.time) return;
        setStep(Math.min(4, state.step + 1));
      });
    });
    root.querySelectorAll('[data-prev-step]').forEach(function (b) {
      b.addEventListener('click', function () {
        setStep(Math.max(1, state.step - 1));
      });
    });

    setStep(1);
  }
  function initAOS() {
    if (typeof AOS === 'undefined') return;
    AOS.init({
      duration: 800,
      easing: 'ease-out-quart',
      once: true,
      offset: 60
    });
  }

  function initPromoCountdown() {
    var countdowns = document.querySelectorAll('[data-countdown]');
    if (!countdowns.length) return;

    countdowns.forEach(function (countdown) {
      var loopDaysAttr = countdown.getAttribute('data-loop-days');
      var loopDays = loopDaysAttr ? parseInt(loopDaysAttr, 10) : 0;
      var loopStartAttr = countdown.getAttribute('data-loop-start');
      var loopStart = loopStartAttr ? new Date(loopStartAttr).getTime() : Date.now();
      var useLoop = Number.isFinite(loopDays) && loopDays > 0;

      var deadlineAttr = countdown.getAttribute('data-deadline');
      var deadline = deadlineAttr ? new Date(deadlineAttr).getTime() : NaN;

      if (!useLoop && Number.isNaN(deadline)) return;
      if (useLoop && Number.isNaN(loopStart)) loopStart = Date.now();

      var dayEl = countdown.querySelector('[data-time-days]');
      var hourEl = countdown.querySelector('[data-time-hours]');
      var minuteEl = countdown.querySelector('[data-time-minutes]');
      var secondEl = countdown.querySelector('[data-time-seconds]');
      var timer = null;

      function setTime() {
        var diff;
        if (useLoop) {
          var cycleMs = loopDays * 86400000;
          var elapsed = Date.now() - loopStart;
          var mod = ((elapsed % cycleMs) + cycleMs) % cycleMs;
          diff = cycleMs - mod;
        } else {
          diff = Math.max(0, deadline - Date.now());
        }
        var days = Math.floor(diff / 86400000);
        var hours = Math.floor((diff % 86400000) / 3600000);
        var minutes = Math.floor((diff % 3600000) / 60000);
        var seconds = Math.floor((diff % 60000) / 1000);

        if (dayEl) dayEl.textContent = String(days).padStart(2, '0');
        if (hourEl) hourEl.textContent = String(hours).padStart(2, '0');
        if (minuteEl) minuteEl.textContent = String(minutes).padStart(2, '0');
        if (secondEl) secondEl.textContent = String(seconds).padStart(2, '0');

        if (!useLoop && diff <= 0 && timer) {
          clearInterval(timer);
        }
      }

      setTime();
      timer = window.setInterval(setTime, 1000);
    });
  }

  function getRelativeCarouselIndex(event) {
    if (!event || !event.item) return 0;
    var total = event.item.count || 1;
    if (event.relatedTarget && typeof event.relatedTarget.relative === 'function') {
      return event.relatedTarget.relative(event.item.index);
    }
    return ((event.item.index || 0) % total + total) % total;
  }

  function initCarousels() {
    if (!$.fn.owlCarousel) return;

    $('.la-home-hero-carousel').owlCarousel({
      items: 1,
      loop: true,
      margin: 0,
      nav: false,
      dots: false,
      autoplay: true,
      autoplayTimeout: 2000,
      autoplayHoverPause: false,
      animateOut: 'fadeOut',
      smartSpeed: 600
    });

    $('.la-promo-hero-carousel').owlCarousel({
      items: 1,
      loop: true,
      margin: 0,
      nav: false,
      dots: true,
      autoplay: true,
      autoplayTimeout: 4200,
      autoplayHoverPause: true,
      smartSpeed: 700
    });

    $('.la-promo-carousel').owlCarousel({
      loop: true,
      margin: 14,
      nav: false,
      dots: true,
      autoplay: true,
      autoplayTimeout: 3600,
      autoplayHoverPause: true,
      smartSpeed: 700,
      responsive: {
        0: { items: 1 },
        768: { items: 2 },
        1200: { items: 3 }
      }
    });

    var $services = $('.la-services-carousel');
    if ($services.length) {
      var $progressFill = $('[data-services-progress]');
      var $serviceCatButtons = $('[data-service-cats] [data-service-target]');

      function updateServicesProgress(event) {
        if (!$progressFill.length || !event || !event.item) return;
        var total = event.item.count || 1;
        var relIndex = getRelativeCarouselIndex(event);

        var percent = ((relIndex + 1) / total) * 100;
        $progressFill.css('width', percent + '%');
      }

      function updateActiveServiceCategory(event) {
        if (!$serviceCatButtons.length) return;
        var relIndex = getRelativeCarouselIndex(event);
        var $selected = $serviceCatButtons.eq(0);

        $serviceCatButtons.each(function () {
          var target = parseInt($(this).attr('data-service-target'), 10);
          if (!Number.isNaN(target) && relIndex >= target) {
            $selected = $(this);
          }
        });

        $serviceCatButtons.removeClass('active');
        $selected.addClass('active');
      }

      function applyServiceCoverflowDepth(event) {
        var owl = (event && event.relatedTarget) ? event.relatedTarget : $services.data('owl.carousel');
        if (!owl || typeof owl.relative !== 'function') return;

        var total = (owl._items && owl._items.length) || $services.find('.owl-item:not(.cloned)').length || 1;
        var currentRelative = owl.relative(owl.current());

        $services.find('.owl-item').removeClass('is-left is-right is-far-left is-far-right');
        $services.find('.owl-item').each(function () {
          var $item = $(this);
          var itemRelative = owl.relative($item.index());
          var diff = itemRelative - currentRelative;

          if (diff > total / 2) diff -= total;
          if (diff < -total / 2) diff += total;

          if (diff === -1) {
            $item.addClass('is-left');
          } else if (diff === 1) {
            $item.addClass('is-right');
          } else if (diff === -2) {
            $item.addClass('is-far-left');
          } else if (diff === 2) {
            $item.addClass('is-far-right');
          }
        });

        $services.find('.owl-item .la-service-card').attr('aria-hidden', 'true');
        $services.find('.owl-item.center .la-service-card').attr('aria-hidden', 'false');
      }

      $services.on('initialized.owl.carousel changed.owl.carousel translated.owl.carousel', function (event) {
        updateServicesProgress(event);
        updateActiveServiceCategory(event);
        applyServiceCoverflowDepth(event);
      }).owlCarousel({
        loop: true,
        center: true,
        margin: 20,
        nav: true,
        dots: true,
        mouseDrag: true,
        touchDrag: true,
        pullDrag: true,
        autoplay: true,
        autoplayTimeout: 5600,
        autoplayHoverPause: true,
        smartSpeed: 760,
        navSpeed: 740,
        dotsSpeed: 740,
        navText: [
          '<span aria-hidden="true">&#8592;</span>',
          '<span aria-hidden="true">&#8594;</span>'
        ],
        responsive: {
          0: { items: 1, center: true, stagePadding: 24, margin: 14 },
          576: { items: 1, center: true, stagePadding: 42, margin: 16 },
          768: { items: 2, center: true, stagePadding: 50, margin: 18 },
          1200: { items: 3, center: true, stagePadding: 32, margin: 20 }
        }
      });

      $serviceCatButtons.on('click', function () {
        var target = parseInt($(this).attr('data-service-target'), 10);
        if (Number.isNaN(target)) return;
        $services.trigger('to.owl.carousel', [target, 760, true]);
        $serviceCatButtons.removeClass('active');
        $(this).addClass('active');
      });

      $services.on('click', '.owl-item:not(.center) .la-service-card', function (e) {
        var owl = $services.data('owl.carousel');
        if (!owl || typeof owl.relative !== 'function') return;

        if ($(e.target).closest('a').length) {
          e.preventDefault();
        }

        var relativeIndex = owl.relative($(this).closest('.owl-item').index());
        $services.trigger('to.owl.carousel', [relativeIndex, 760, true]);
      });
    }

    $('.la-results-carousel').owlCarousel({
      items: 1,
      loop: true,
      margin: 14,
      nav: false,
      dots: true,
      autoplay: true,
      autoplayTimeout: 4200,
      autoplayHoverPause: true,
      responsive: {
        768: { items: 2 },
        1200: { items: 3 }
      }
    });

    $('.la-testi-carousel').owlCarousel({
      items: 1,
      loop: true,
      margin: 14,
      nav: false,
      dots: true,
      autoplay: true,
      autoplayTimeout: 5200,
      autoplayHoverPause: true,
      responsive: {
        768: { items: 2 },
        1200: { items: 3 }
      }
    });
  }

  function initResultCompare() {
    var root = document.querySelector('[data-result-compare]');
    if (!root) return;

    var range = root.querySelector('[data-compare-range]');
    var after = root.querySelector('[data-compare-after]');
    var divider = root.querySelector('[data-compare-handle]');
    if (!range || !after || !divider) return;

    function render(value) {
      var percent = Math.max(0, Math.min(100, Number(value) || 0));
      after.style.width = percent + '%';
      divider.style.left = percent + '%';
    }

    render(range.value);
    range.addEventListener('input', function (e) {
      render(e.target.value);
    });
  }

  function initMagicServiceSlider() {
    var roots = Array.prototype.slice.call(document.querySelectorAll('[data-magic-slider]'));
    if (!roots.length) return;

    roots.forEach(function (root) {
      var items = Array.prototype.slice.call(root.querySelectorAll('[data-magic-item]'));
      if (!items.length) return;

      var tagEl = root.querySelector('[data-magic-tag]');
      var titleEl = root.querySelector('[data-magic-title]');
      var descEl = root.querySelector('[data-magic-desc]');
      var priceEl = root.querySelector('[data-magic-price]');
      var offerEl = root.querySelector('[data-magic-offer]');
      var ctaEl = root.querySelector('[data-magic-cta]');
      var bgCurrent = root.querySelector('[data-magic-bg-current]');
      var bgNext = root.querySelector('[data-magic-bg-next]');
      var prevBtn = root.querySelector('[data-magic-prev]');
      var nextBtn = root.querySelector('[data-magic-next]');

      var currentIndex = Math.max(0, items.findIndex(function (item) {
        return item.classList.contains('active');
      }));
      var autoplayDelay = 5800;
      var autoplayTimer = null;
      var switchTimer = null;
      var startX = null;

      function normalizedIndex(index) {
        var total = items.length;
        return ((index % total) + total) % total;
      }

      function setText(target, value) {
        if (!target) return;
        target.textContent = value || '';
      }

      function updateThumbState() {
        var total = items.length;
        items.forEach(function (item, index) {
          item.classList.remove('active', 'is-prev', 'is-next', 'is-far');
          if (index === currentIndex) {
            item.classList.add('active');
            return;
          }
          if (index === normalizedIndex(currentIndex - 1)) {
            item.classList.add('is-prev');
            return;
          }
          if (index === normalizedIndex(currentIndex + 1)) {
            item.classList.add('is-next');
            return;
          }
          if (total > 3) {
            item.classList.add('is-far');
          }
        });
      }

      function switchBackground(url) {
        if (!bgCurrent || !bgNext || !url) return;
        if (bgCurrent.getAttribute('data-image') === url && !root.classList.contains('is-switching')) return;

        bgNext.style.backgroundImage = 'url("' + url + '")';
        root.classList.add('is-switching');

        if (switchTimer) {
          window.clearTimeout(switchTimer);
        }

        switchTimer = window.setTimeout(function () {
          bgCurrent.style.backgroundImage = 'url("' + url + '")';
          bgCurrent.setAttribute('data-image', url);
          root.classList.remove('is-switching');
        }, 520);
      }

      function render(index) {
        currentIndex = normalizedIndex(index);
        var active = items[currentIndex];
        if (!active) return;

        var data = active.dataset;
        setText(tagEl, data.tag || 'Featured');
        setText(titleEl, data.title || 'Nội dung nổi bật');
        setText(descEl, data.desc || '');
        setText(priceEl, data.price || '');
        setText(offerEl, data.offer || '');

        if (ctaEl) {
          ctaEl.setAttribute('href', data.link || '#booking');
        }

        switchBackground(data.image || '');
        updateThumbState();
      }

      function toNext() {
        render(currentIndex + 1);
      }

      function toPrev() {
        render(currentIndex - 1);
      }

      function stopAutoplay() {
        if (!autoplayTimer) return;
        window.clearInterval(autoplayTimer);
        autoplayTimer = null;
      }

      function startAutoplay() {
        stopAutoplay();
        autoplayTimer = window.setInterval(toNext, autoplayDelay);
      }

      items.forEach(function (item, index) {
        item.addEventListener('click', function () {
          render(index);
          startAutoplay();
        });
      });

      prevBtn && prevBtn.addEventListener('click', function () {
        toPrev();
        startAutoplay();
      });

      nextBtn && nextBtn.addEventListener('click', function () {
        toNext();
        startAutoplay();
      });

      root.addEventListener('mouseenter', stopAutoplay);
      root.addEventListener('mouseleave', startAutoplay);
      root.addEventListener('focusin', stopAutoplay);
      root.addEventListener('focusout', startAutoplay);

      root.addEventListener('pointerdown', function (event) {
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        startX = event.clientX;
      });

      root.addEventListener('pointerup', function (event) {
        if (startX === null) return;
        var deltaX = event.clientX - startX;
        startX = null;
        if (Math.abs(deltaX) < 42) return;
        if (deltaX < 0) {
          toNext();
        } else {
          toPrev();
        }
        startAutoplay();
      });

      root.addEventListener('pointercancel', function () {
        startX = null;
      });

      document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
          stopAutoplay();
        } else {
          startAutoplay();
        }
      });

      render(currentIndex);
      startAutoplay();
    });
  }

  function initServiceParallax() {
    var wraps = Array.prototype.slice.call(document.querySelectorAll('[data-service-parallax]'));
    if (!wraps.length) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var ticking = false;

    function updateParallax() {
      var viewport = window.innerHeight || document.documentElement.clientHeight;
      wraps.forEach(function (wrap) {
        var rect = wrap.getBoundingClientRect();
        var distanceFromCenter = (viewport * 0.5) - (rect.top + rect.height * 0.5);
        var offset = Math.max(-24, Math.min(24, distanceFromCenter * 0.08));
        wrap.style.setProperty('--la-service-parallax', offset.toFixed(2) + 'px');
      });
      ticking = false;
    }

    function requestUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateParallax);
    }

    updateParallax();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
  }

  function initBranchTabs() {
    var $tabs = $('.la-tab');
    if (!$tabs.length) return;

    $tabs.on('click', function () {
      var $btn = $(this);
      var branch = $btn.data('branch');

      $tabs.removeClass('active');
      $btn.addClass('active');

      $('[data-branch-item]').addClass('d-none');
      $('[data-branch-item="' + branch + '"]').removeClass('d-none');
    });
  }

  function initSmoothNavCloseOnClick() {
    $('#laNav a.nav-link').on('click', function () {
      var $nav = $('#laNav');
      if ($nav.hasClass('show')) {
        $nav.collapse('hide');
      }
    });
  }

  function initMobileNavFallback() {
    var toggler = document.querySelector('.la-nav .navbar-toggler');
    var collapse = document.getElementById('laNav');
    var nav = document.querySelector('.la-nav');
    if (!toggler || !collapse) return;

    toggler.addEventListener('click', function () {
      var hasBootstrapCollapse = !!(window.jQuery && window.jQuery.fn && window.jQuery.fn.collapse);
      if (hasBootstrapCollapse) return;

      var isOpen = collapse.classList.toggle('show');
      toggler.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (nav) {
        nav.classList.toggle('is-menu-open', isOpen);
      }
    });
  }

  function initFloatingNavbar() {
    var nav = document.querySelector('.la-nav');
    if (!nav) return;

    var scrollThreshold = 26;
    var scrollHost = document.getElementById('wrap');
    var ticking = false;

    function getScrollTop() {
      var hostY = scrollHost ? (scrollHost.scrollTop || 0) : 0;
      var windowY = window.pageYOffset || document.documentElement.scrollTop || 0;
      return Math.max(hostY, windowY);
    }

    function syncNavState() {
      var y = getScrollTop();
      nav.classList.toggle('is-scrolled', y > scrollThreshold);
      ticking = false;
    }

    function requestSync() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(syncNavState);
    }

    syncNavState();
    if (scrollHost) {
      scrollHost.addEventListener('scroll', requestSync, { passive: true });
    }
    window.addEventListener('scroll', requestSync, { passive: true });
    window.addEventListener('resize', requestSync);

    var $collapse = $('#laNav');
    if ($collapse.length) {
      $collapse.on('show.bs.collapse', function () {
        nav.classList.add('is-menu-open');
      });
      $collapse.on('hide.bs.collapse hidden.bs.collapse', function () {
        nav.classList.remove('is-menu-open');
      });
    }
  }

  function initDropdownHoverDesktop() {
    // Optional: nicer UX similar to many beauty landing pages
    var mq = window.matchMedia('(min-width: 992px)');
    if (!mq.matches) return;
    $('.navbar .dropdown').on('mouseenter', function () {
      $(this).addClass('show');
      $(this).find('.dropdown-toggle').attr('aria-expanded', 'true');
      $(this).find('.dropdown-menu').addClass('show');
    });
    $('.navbar .dropdown').on('mouseleave', function () {
      $(this).removeClass('show');
      $(this).find('.dropdown-toggle').attr('aria-expanded', 'false');
      $(this).find('.dropdown-menu').removeClass('show');
    });
  }

  function initFakeSubmit() {
    // Workspace already posts to scripts/request.php; keep behavior.
    // Add light UX improvement if endpoint isn't configured.
    $('#leadForm, #leadFormHero').on('submit', function (e) {
      var $form = $(this);
      var hasAction = ($form.attr('action') || '').trim().length > 0;
      if (!hasAction) {
        e.preventDefault();
        alert('Đã nhận thông tin (demo). Bạn cấu hình endpoint ở scripts/request.php');
      }
    });
  }

  $(function () {
    initAOS();
    initPromoCountdown();
    initCarousels();
    initMagicServiceSlider();
    initResultCompare();
    initServiceParallax();
    initBranchTabs();
    initSmoothNavCloseOnClick();
    initMobileNavFallback();
    initFloatingNavbar();
    initDropdownHoverDesktop();
    initFakeSubmit();
    initGSAP();
    initLazyBlurUp();
    initLightbox();
    initBookingWizard();
  });
})();

