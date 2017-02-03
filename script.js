
function _navigation( navWrapper, sectionWrapper, titleWrapper){

	var sections = [];

		$(sectionWrapper).not('#home').each( function(){
			var itemName = $(this).find(titleWrapper).text();
			var itemID = $(this).attr('id');
			sections.push('<li><a href="#' + itemID + '">' + itemName + '</a></li>');
		});

		$(navWrapper).prepend(sections);
}

function extending( tab ){
	tab.addClass('visible');
}

function color( value ){
	var prototype;

	if( prototype = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(value) ){
		this.red = parseInt(prototype[1], 16);
		this.green = parseInt(prototype[2], 16);
		this.blue = parseInt(prototype[3], 16);

		this.toRGB = function(){
			return 'rgb(' + this.red + ', ' + this.green + ', ' + this.blue + ')';
		}
	}

	if( prototype = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(value) ){
		this.red = parseInt(prototype[1],10);
		this.green = parseInt(prototype[2],10);
		this.blue = parseInt(prototype[3],10);

		this.toHEX = function(){
			return '#' + ('0' + this.red.toString(16)).slice(-2) + ('0' + this.green.toString(16)).slice(-2) + ('0' + this.blue.toString(16)).slice(-2);
		}
	}
}

function gradientTitles( tab, element ){
	// get all tab elements
	var $elements = [];
	$(tab.selector +' '+ element.selector).each( function() {
		$elements.push( $(this) );
	});

	var n = $elements.length;

	// start and end colors
	var startC = new color('#C96874');
	var endC = new color('#f78f57');

	//generating new n colurs
	if( n > 1){
        for( var i = 0; i < n; i++){
    		red = Math.round(i * (endC.red - startC.red) / (n - 1) + startC.red);
    		green = Math.round(i * (endC.green - startC.green) / (n - 1) + startC.green);
    		blue = Math.round(i * (endC.blue - startC.blue) / (n - 1) + startC.blue);

    		var currentC = new color('rgb(' +red+ ',' +green+ ',' +blue+ ')');
    		hex = currentC.toHEX();
    		$elements[i].css('color', hex);
    	}
    } else {
        $elements[0].css('color', startC);
    }
}

var section = 'section',
	title = 'h2.title',
	sidebar = '#aside',
	navigation = '#nav',
    viewport = '#viewport',
    scrollBtn = '#scrollTop',
    homeBtn = '#homeLink';


jQuery(function($){

	if( $(section).length > 0 ){

		_navigation( navigation, section, title );

		//extending main block once starting from non-home page
        var hash = window.location.hash;
		if( $(hash).length > 0 && hash != '#home'){
			$('#home').removeClass('visible');
			$(sidebar).addClass('condensed');
			extending( $(hash) );

			$('.info-items li a[href=' + hash + ']').addClass('active');
            $(homeBtn).addClass('visible');
		}

        $(section).each( function() {
            var uniqueName = $(this).attr('id');
            gradientTitles( $('#' + uniqueName) , $('.title'))
        });

		$(sidebar).find('a[href^="#"]').on( 'click', function(e) {
			$this = $(this);

            e.preventDefault();
			sectionID = $this.attr("href");
			window.location.hash = sectionID;

			// reset previous active tab
			$(navigation).find('a').removeClass('active');
			$(section).removeClass('visible');

			if( sectionID != "#home" ) {
				$(sidebar).switchClass('', 'condensed', 300, 'linear', function() {
					extending( $(sectionID) );
				});

				$this.addClass('active');
                $(homeBtn).addClass('visible');
                // prevent jumping to #id
    			if( window.innerWidth <= 600) {
                    $(viewport).animate({
                        scrollTop: $(sectionID).offset().top
                    }, 500);
                }
			}
			else{
				$(sidebar).switchClass('condensed','',300,'linear', function() {
					$('#home').addClass('visible');
                    $(homeBtn).removeClass('visible');
				});
			}

		});

        $(scrollBtn).on('click', function(e){
            e.preventDefault();

            $(viewport).animate({
                scrollTop: 0
            }, 500);
        });
    }

    $(viewport).scroll(function(){
        if( $(viewport).scrollTop() > window.innerHeight/8) {
            $(scrollBtn).show(500);
        } else {
            $(scrollBtn).hide(500);
        }

    });

    //---------- isotope
    if( $('.gallery').length > 0 ){
        var $grid = $('.gallery').isotope({
            itemSelector: '.gallery-item',
            masonry: {
              percentPosition: true,
              columnWidth: 1
            }
        });

        $grid.imagesLoaded().progress( function() {
          $grid.isotope('layout');
        });
    }
});
