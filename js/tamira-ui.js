(function () {
    'use strict';

    function initTamiraUI() {
        if (!document.body || !document.body.classList.contains('tamira-ui')) {
            return;
        }

        var revealTargets = document.querySelectorAll(
            '#desc-img-text-10 .col-md-6, ' +
            '#desc-text-img-1 .row > div[class*="col-"], ' +
            '#benefits-3col-21 .content-box, ' +
            '#blog-3col-carousel .item, ' +
            '#contact-center-form .col-md-6, ' +
            '#testimonial-2col-2 .content-box, ' +
            '#footer-logo-text-social-2 .col-md, ' +
            '#footer-logo-text-social-2 .col-lg-5'
        );

        for (var i = 0; i < revealTargets.length; i += 1) {
            revealTargets[i].classList.add('tamira-reveal');
            revealTargets[i].style.setProperty('--tamira-delay', (i % 8) * 70 + 'ms');
        }

        if (!('IntersectionObserver' in window)) {
            for (var j = 0; j < revealTargets.length; j += 1) {
                revealTargets[j].classList.add('is-visible');
            }
            return;
        }

        var observer = new IntersectionObserver(function (entries, obs) {
            for (var k = 0; k < entries.length; k += 1) {
                if (entries[k].isIntersecting) {
                    entries[k].target.classList.add('is-visible');
                    obs.unobserve(entries[k].target);
                }
            }
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -40px 0px'
        });

        for (var m = 0; m < revealTargets.length; m += 1) {
            observer.observe(revealTargets[m]);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTamiraUI);
    } else {
        initTamiraUI();
    }
})();
