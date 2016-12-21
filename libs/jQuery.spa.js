(function(window, $, undefined){
	'use strict';
	function Spa(options){
		this.$window = $(window);
		this.viewportHeight = $(window).height();
		this.stopEvent = false;
		
		// option
		this.spaType = options.spaType; // scroll 또는 fullpage
		this.$tab = $(options.navSelector); // tab selector
		this.$sections = $(options.sectionSelector); // section wrapper
		this.currentIndex = 0;

		// 초기실행
		this.init();
	}

	Spa.prototype = {
		init : function(){
			// prevent auto scrolling after page refresh
			if ('scrollRestoration' in history) {
			  history.scrollRestoration = 'manual';
			}

			this.addEvents();
			this.activeTab(this.currentIndex);
			
			if ( this.spaType === 'fullpage' ) {
				$('body').addClass('fullpage');	
			}
		},
		getIndexByClick : function(target) {
			return $(target).index();
		},
		getIndexByScroll : function(){
			return Math.round(this.$window.scrollTop() / this.viewportHeight);;
		},
		getIndexByWheel : function(event){
			if ( event.originalEvent.deltaY > 0 && this.currentIndex < this.$tab.length-1 ) {
				this.currentIndex++;
			} else if ( event.originalEvent.deltaY < 0 && this.currentIndex > 0 ) {
				this.currentIndex--;
			}
			return this.currentIndex;
		},
		activeTab : function(index){
			var isActive = this.$tab.eq(index).hasClass('is-active');
			if ( !isActive ) {
				this.$tab.eq(index).addClass('is-active').siblings().removeClass('is-active');
			}
		},
		transformSection : function(index){
			this.$sections.attr('style', 'transform: translate3d(0, ' + -this.viewportHeight * index + 'px, 0)');
		},
		scrollSection : function(index){
			this.stopEvent = true;
			$('html, body').stop().animate({
				'scrollTop' : this.viewportHeight * index
			}, 500, 'swing', function(){
				this.stopEvent = false;
			});
		},
		tabEvent : function(event) {
			event.preventDefault();
			if ( this.currentIndex === this.getIndexByClick(event.target) ) {
				return;
			}
			this.currentIndex = this.getIndexByClick(event.target);
			this.activeTab(this.currentIndex);
			if ( this.spaType === 'fullpage' ) {
				this.transformSection(this.currentIndex);
			} else {
				this.scrollSection(this.currentIndex);
			}
		},
		scrollEvent : function(event) {
			if ( !this.stopEvent ) {
				var scrollValue = this.$window.scrollTop();
				this.currentIndex = this.getIndexByScroll();
				this.activeTab(this.currentIndex);
			}
		},
		wheelEvent : function(event) {
			if ( !this.stopEvent ) {
				this.stopEvent = true;
				this.currentIndex = this.getIndexByWheel(event);
				this.activeTab(this.currentIndex);
				this.transformSection(this.currentIndex);
				
				var _self = this;
				setTimeout(function(){
					_self.stopEvent = false;
				}, 1250);
			}
		},
		addEvents : function(){
			this.$tab.on('click', this.tabEvent.bind(this));
			if ( this.spaType === 'fullpage' ) {
				this.$window.on('wheel', this.wheelEvent.bind(this));
			} else {
				this.$window.on('wheel', this.scrollEvent.bind(this));
			}
		}
	};

	window.Spa = Spa;

})(window, jQuery);