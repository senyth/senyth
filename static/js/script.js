(function () {
	var root = document.documentElement;
	var STORAGE_KEY = 'theme';
	var COLORS = { light: '#F4F1E8', dark: '#0F1A17' };
	root.classList.add('js');

	function currentTheme() {
		return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
	}

	function applyTheme(theme) {
		var dark = theme === 'dark';
		if (dark) {
			root.setAttribute('data-theme', 'dark');
		} else {
			root.removeAttribute('data-theme');
		}
		
		var toggle = document.querySelector('.theme-toggle');
		if (toggle) {
			toggle.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
		}
		
		var meta = document.querySelector('meta[name="theme-color"]');
		if (meta) 
			meta.setAttribute('content', dark ? COLORS.dark : COLORS.light);
	}

	var media = window.matchMedia('(prefers-color-scheme: dark)');
	var saved = null;
	try { 
		saved = localStorage.getItem(STORAGE_KEY); 
	} catch (e) {}

	function hasChoice() {
		return saved === 'dark' || saved === 'light'; 
	}
	function initialTheme() { 
		return hasChoice() ? saved : (media.matches ? 'dark' : 'light'); 
	}

	if (initialTheme() === 'dark') 
		root.setAttribute('data-theme', 'dark');

	document.addEventListener('DOMContentLoaded', function () {
		applyTheme(currentTheme());

		document.querySelector('.theme-toggle').addEventListener('click', function () {
			var next = currentTheme() === 'dark' ? 'light' : 'dark';
			applyTheme(next);
			saved = next;
			try { 
				localStorage.setItem(STORAGE_KEY, next); 
			} catch (e) {}
		});

		media.addEventListener('change', function (e) {
			if (!hasChoice()) 
				applyTheme(e.matches ? 'dark' : 'light');
		});

		var menuBtn = document.querySelector('.menu-toggle');
		var nav = document.getElementById('site-nav');
		var desktop = window.matchMedia('(min-width: 48rem)');

		function setMenu(open) {
			nav.classList.toggle('is-open', open);
			menuBtn.setAttribute('aria-expanded', String(open));
			menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
		}

		menuBtn.addEventListener('click', function () {
			setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
		});
		
		nav.addEventListener('click', function (e) {
			if (e.target.closest('a')) 
				setMenu(false);
		});
		
		document.addEventListener('click', function (e) {
			if (!e.target.closest('.site-header')) 
				setMenu(false);
		});
		
		document.addEventListener('keydown', function (e) {
			if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
				setMenu(false);
				menuBtn.focus();
			}
		});
		
		desktop.addEventListener('change', function () { 
			setMenu(false); 
		});

		var toTop = document.querySelector('.to-top');
		
		function onScroll() {
			toTop.classList.toggle('visible', window.scrollY > 400);
		}
		
		window.addEventListener('scroll', onScroll, {
			passive: true 
		});
		onScroll();
		
		toTop.addEventListener('click', function () {
			window.scrollTo({ top: 0 });
		});

		var links = document.querySelectorAll('.nav a');
		if ('IntersectionObserver' in window) {
			var observer = new IntersectionObserver(function (entries) {
				entries.forEach(function (entry) {
					if (!entry.isIntersecting) return;
					links.forEach(function (link) {
						link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
					});
				});
			}, { rootMargin: '-40% 0px -55% 0px' });

			document.querySelectorAll('main section[id]').forEach(function (section) {
				observer.observe(section);
			});
		}

		document.querySelectorAll('img.icon').forEach(function (img) {
			function hide() { 
				img.classList.add('is-missing'); 
			}
			img.addEventListener('error', hide);
			if (img.complete && img.naturalWidth === 0) 
				hide();
		});

		var year = document.getElementById('year');
		if (year) year.textContent = new Date().getFullYear();
	});
})();
  