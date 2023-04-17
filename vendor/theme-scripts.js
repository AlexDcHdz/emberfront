// middle block plugin(set image in the middle of its parent object)
;(function(window, document, $) {
    var middleblock;
    var prototype = $.fn;
    middleblock = prototype.middleblock = function() {
        var $this = this;
        if ($(this).is(":visible")) {
            $this.bind("set.middleblock", set_middle_block).trigger('set.middleblock');
        }
        return $this;
    };

    function set_middle_block(event, value) {
        var $this = $(this);
        var $middleItem = $this.find(".middle-item");
        if ($middleItem.length < 1) {
            $middleItem = $this.children("img");
        }
        if ($middleItem.length < 1) {
            return;
        }
        var width = $middleItem.width();
        var height = $middleItem.height();
        if ($this.width() <= 1) {
            var parentObj = $this;
            while (parentObj.width() <= 1) {
                parentObj = parentObj.parent();
            }
            $this.css("width", parentObj.width() + "px");
        }
        $this.css("position", "relative");
        $middleItem.css("position", "absolute");

        if ($this.hasClass("middle-block-auto-height")) {
            $this.removeClass("middle-block-auto-height");
            $this.height(0);
        }
        if ($this.height() <= 1) {
            var parentObj = $this;
            while (parentObj.height() <= 1) {
                if (parentObj.css("float") =="left" && parentObj.index() == 0 && parentObj.next().length > 0) {
                    parentObj = parentObj.next();
                } else if (parentObj.css("float") == "left" && parentObj.index() > 0) {
                    parentObj = parentObj.prev();
                } else {
                    parentObj = parentObj.parent();
                }
            }
            $this.css("height", parentObj.outerHeight() + "px");
            $this.addClass("middle-block-auto-height");

            width = $middleItem.width();
            height = $middleItem.height();
            if (height <= 1) {
                height = parentObj.outerHeight();
            }
        }
        $middleItem.css("top", "50%");
        $middleItem.css("margin-top", "-" + (height / 2) + "px");
        if (width >= 1) {
            /*if ($this.width() == width) {
                $this.width(width);
            }*/
            $middleItem.css("left", "50%");
            $middleItem.css("margin-left", "-" + (width / 2) + "px");
        } else {
            $middleItem.css("left", "0");
        }
    }
}(this, document, jQuery));

/* jQuery CounTo plugin */
(function(a){a.fn.countTo=function(g){g=g||{};return a(this).each(function(){function e(a){a=b.formatter.call(h,a,b);f.html(a)}var b=a.extend({},a.fn.countTo.defaults,{from:a(this).data("from"),to:a(this).data("to"),speed:a(this).data("speed"),refreshInterval:a(this).data("refresh-interval"),decimals:a(this).data("decimals")},g),j=Math.ceil(b.speed/b.refreshInterval),l=(b.to-b.from)/j,h=this,f=a(this),k=0,c=b.from,d=f.data("countTo")||{};f.data("countTo",d);d.interval&&clearInterval(d.interval);d.interval=
setInterval(function(){c+=l;k++;e(c);"function"==typeof b.onUpdate&&b.onUpdate.call(h,c);k>=j&&(f.removeData("countTo"),clearInterval(d.interval),c=b.to,"function"==typeof b.onComplete&&b.onComplete.call(h,c))},b.refreshInterval);e(c)})};a.fn.countTo.defaults={from:0,to:0,speed:1E3,refreshInterval:100,decimals:0,formatter:function(a,e){return a.toFixed(e.decimals)},onUpdate:null,onComplete:null}})(jQuery);

if (typeof enableChaser == "undefined") {
    enableChaser = 0 // Enable Chaser menu (open on scroll) ?   1 - Yes / 0 - No
}

/* on stage plugin */
;(function(window, document, $) {
    var onstage;
    var prototype = $.fn;
    onstage = prototype.onstage = function() {
        var scrollTop = jQuery(window).scrollTop();
        var windowHeight = jQuery(window).height();
        var $this = this;
        if ($this.offset().top + $this.height() * 0.9 <= scrollTop + windowHeight && $this.offset().top + $this.height() * 0.9 > scrollTop) {
            return true;
        }
        return false;
    };
}(this, document, jQuery));

/*if(enableChaser == 1) {
    jQuery(window).load(function() {

    });
}*/

/* disable click before loading page */
jQuery("body").on("click", "a.popup-gallery", function(e) {
    e.preventDefault();
    return false;
});

function changeTraveloElementUI() {
    // change UI of select box
    jQuery(".selector select").each(function() {
        var obj = jQuery(this);
        if (obj.parent().children(".custom-select").length < 1) {
            obj.after("<span class='custom-select'>" + obj.children("option:selected").html() + "</span>");

            if (obj.hasClass("white-bg")) {
                obj.next("span.custom-select").addClass("white-bg");
            }
            if (obj.hasClass("full-width")) {
                //obj.removeClass("full-width");
                //obj.css("width", obj.parent().width() + "px");
                //obj.next("span.custom-select").css("width", obj.parent().width() + "px");
                obj.next("span.custom-select").addClass("full-width");
            }
        }
    });
    jQuery("body").on("change", ".selector select", function() {
        if (jQuery(this).next("span.custom-select").length > 0) {
            jQuery(this).next("span.custom-select").text(jQuery(this).children("option:selected").text());
        }
    });

    jQuery("body").on("keydown", ".selector select", function() {
        if (jQuery(this).next("span.custom-select").length > 0) {
            jQuery(this).next("span.custom-select").text(jQuery(this).children("option:selected").text());
        }
    });

    // change UI of file input
    jQuery(".fileinput input[type=file]").each(function() {
        var obj = jQuery(this);
        if (obj.parent().children(".custom-fileinput").length < 1) {
            obj.after('<input type="text" class="custom-fileinput" />');
            if (typeof obj.data("placeholder") != "undefined") {
                obj.next(".custom-fileinput").attr("placeholder", obj.data("placeholder"));
            }
            if (typeof obj.prop("class") != "undefined") {
                obj.next(".custom-fileinput").addClass(obj.prop("class"));
            }
            obj.parent().css("line-height", obj.outerHeight() + "px");
        }
    });

    jQuery(".fileinput input[type=file]").on("change", function() {
        var fileName = this.value;
        var slashIndex = fileName.lastIndexOf("\\");
        if (slashIndex == -1) {
            slashIndex = fileName.lastIndexOf("/");
        }
        if (slashIndex != -1) {
            fileName = fileName.substring(slashIndex + 1);
        }
        jQuery(this).next(".custom-fileinput").val(fileName);
    });
    // checkbox
    jQuery(".checkbox input[type='checkbox'], .radio input[type='radio']").each(function() {
        if (jQuery(this).is(":checked")) {
            jQuery(this).closest(".checkbox").addClass("checked");
            jQuery(this).closest(".radio").addClass("checked");
        }
    });
    jQuery(".checkbox input[type='checkbox']").bind("change", function() {
        if (jQuery(this).is(":checked")) {
            jQuery(this).closest(".checkbox").addClass("checked");
        } else {
            jQuery(this).closest(".checkbox").removeClass("checked");
        }
    });
    //radio
    jQuery(".radio input[type='radio']").bind("change", function(event, ui) {
        if (jQuery(this).is(":checked")) {
            var name = jQuery(this).prop("name");
            if (typeof name != "undefined") {
                jQuery(".radio input[name='" + name + "']").closest('.radio').removeClass("checked");
            }
            jQuery(this).closest(".radio").addClass("checked");
        }
    });

    // datepicker
    // jQuery('.datepicker-wrap input').datepicker({
    //     showOn: 'button',
    //     buttonImage: 'images/icon/blank.png',
    //     buttonText: '',
    //     buttonImageOnly: true,
    //     #<{(|showOtherMonths: true,|)}>#
    //     minDate: 0,
    //     dayNamesMin: ["D", "L", "M", "M", "J", "V", "S"],
    //     beforeShow: function(input, inst) {
    //         var themeClass = jQuery(input).parent().attr("class").replace("datepicker-wrap", "");
    //         jQuery('#ui-datepicker-div').attr("class", "");
    //         jQuery('#ui-datepicker-div').addClass("ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all");
    //         jQuery('#ui-datepicker-div').addClass(themeClass);
    //     }
    // });

    // placeholder for ie8, 9
    try {
        jQuery('input, textarea').placeholder();
    } catch (e) {}
}

jQuery(document).ready(function() {
    changeTraveloElementUI();
});

/* display photo gallery */
function displayPhotoGallery($item) {
    if (!jQuery.fn.flexslider || $item.length < 1 || $item.is(":hidden")) {
        return;
    }
    var dataAnimation = $item.data("animation");
    var dataSync = $item.data("sync");
    if (typeof dataAnimation == "undefined") {
        dataAnimation = "slide";
    }
    var dataFixPos = $item.data("fix-control-nav-pos");

    $item.flexslider({
        animation: dataAnimation,
        controlNav: true,
        animationLoop: true,
        slideshow: true,
        pauseOnHover: true,
        sync: dataSync,
        start: function(slider) {
            if (typeof dataFixPos != "undefined" && dataFixPos == "1") {
                var height = jQuery(slider).find(".slides img").height();
                jQuery(slider).find(".flex-control-nav").css("top", (height - 44) + "px");
            }
        },
    });
}

/* display image carousel */
function displayImageCarousel($item) {
    if (!jQuery.fn.flexslider || $item.length < 1 || $item.is(":hidden")) {
        return;
    }
    var dataAnimation = $item.data("animation");
    var dataItemWidth = $item.data("item-width");
    var dataItemMargin = $item.data("item-margin");
    var dataSync = $item.data("sync");
    if (typeof dataAnimation == "undefined") {
        dataAnimation = "slide";
    }
    if (typeof dataItemWidth == "undefined") {
        dataItemWidth = 70;
    }
    if (typeof dataItemMargin == "undefined") {
        dataItemMargin = 10;
    }
    dataItemWidth = parseInt(dataItemWidth, 10);
    dataItemMargin = parseInt(dataItemMargin, 10);

    var dataAnimationLoop = true;
    var dataSlideshow = false;
    if (typeof dataSync == "undefined") {
        dataSync = "";
        //dataAnimationLoop = true;
        dataSlideshow = true;
    }
    $item.flexslider({
        animation: dataAnimation,
        controlNav: true,
        animationLoop: dataAnimationLoop,
        slideshow: dataSlideshow,
        itemWidth: dataItemWidth,
        itemMargin: dataItemMargin,
        minItems: 2,
        pauseOnHover: true,
        asNavFor: dataSync,
        start: function(slider) {
            if (dataSync != "") {
                jQuery(slider).find(".slides > li").height(dataItemWidth);
                jQuery(slider).find(".slides > li > img").each(function() {
                    if(jQuery(this).width() < 1) {
                        jQuery(this).load(function() {
                            jQuery(this).parent().middleblock();
                        });
                    } else {
                        jQuery(this).parent().middleblock();
                    }
                });
            } else {
                jQuery(slider).find(".middle-block img, .middle-block .middle-item").each(function() {
                    if(jQuery(this).width() < 1) {
                        jQuery(this).load(function() {
                            jQuery(this).closest(".middle-block").middleblock();
                        });
                    } else {
                        jQuery(this).closest(".middle-block").middleblock();
                    }
                });
            }
        },
        after: function(slider) {
            if (slider.currentItem == 0) {
                target = 0;
                if (slider.transitions) {
                    target = (slider.vars.direction === "vertical") ? "translate3d(0," + target + ",0)" : "translate3d(" + target + ",0,0)";
                    slider.container.css("-" + slider.pfx + "-transition-duration", "0s");
                    slider.container.css("transition-duration", "0s");
                }
                slider.args[slider.prop] = target;
                slider.container.css(slider.args);
                slider.container.css('transform',target);
            }
        }

    });
}

jQuery(window).load(function() {

    // back to top
    jQuery("body").on("click", "#back-to-top", function(e) {
        e.preventDefault();
        jQuery("html,body").animate({scrollTop: 0}, 1000);
    });

    // Mobile search
    if (jQuery('#mobile-search-tabs').length > 0) {
        var mobile_search_tabs_slider = jQuery('#mobile-search-tabs').bxSlider({
            mode: 'fade',
            infiniteLoop: false,
            hideControlOnEnd: true,
            touchEnabled: true,
            pager: false,
            onSlideAfter: function($slideElement, oldIndex, newIndex) {
                jQuery('a[href="' + jQuery($slideElement).children("a").attr("href") + '"]').tab('show');
            }
        });
    }

    // Mobile menu
    jQuery(".mobile-menu ul.menu > li.menu-item-has-children").each(function(index) {
        var menuItemId = "mobile-menu-submenu-item-" + index;
        jQuery('<button class="dropdown-toggle collapsed" data-toggle="collapse" data-target="#' + menuItemId + '"></button>').insertAfter(jQuery(this).children("a"));
        /*jQuery(this).children(".dropdown-toggle").click(function(e) {
            if (jQuery(this).hasClass("collapsed")) {
                jQuery(this).parent().addClass("open");
            } else {
                jQuery(this).parent().removeClass("open");
            }
        });*/
        jQuery(this).children("ul").prop("id", menuItemId);
        jQuery(this).children("ul").addClass("collapse");

        jQuery("#" + menuItemId).on("show.bs.collapse", function() {
            jQuery(this).parent().addClass("open");
        });
        jQuery("#" + menuItemId).on("hidden.bs.collapse", function() {
            jQuery(this).parent().removeClass("open");
        });
    });

    // middle block
    jQuery(".middle-block").middleblock();

    // third level menu position to left
    function fixPositionSubmenu() {
        jQuery("#main-menu .menu li.menu-item-has-children > ul, .ribbon ul.menu.mini").each(function(e) {
            if (jQuery(this).closest(".megamenu").length > 0) {
                return;
            }
            var leftPos = jQuery(this).parent().offset().left + jQuery(this).parent().width();
            if (leftPos + jQuery(this).width() > jQuery("body").width()) {
                jQuery(this).addClass("left");
            } else {
                jQuery(this).removeClass("left");
            }
        });
    }
    fixPositionSubmenu();

    // chaser
    if (enableChaser == 1 && jQuery('#content').length > 0 && jQuery('#main-menu ul.menu').length > 0) {
        var forchBottom;
        var chaser = jQuery('#main-menu ul.menu').clone().hide().appendTo(document.body).wrap("<div class='chaser hidden-mobile'><div class='container'></div></div>");
        jQuery('<h1 class="logo navbar-brand"><a title="Travelo - home" href="/"><img alt="" src="images/logo.png"></a></h1>').insertBefore('.chaser .menu');
        var forch = jQuery('#content').first();
        forchBottom = forch.offset().top + 2;
        jQuery(window).on('scroll', function () {
            var top = jQuery(document).scrollTop();
            if (jQuery(".chaser").is(":hidden") && top > forchBottom) {
                jQuery(".chaser").slideDown(300);
                //chaser.fadeIn(300, shown);
            } else if (jQuery(".chaser").is(":visible") && top < forchBottom) {
                jQuery(".chaser").slideUp(200);
                //chaser.fadeOut(200, hidden);
            }
        });
        jQuery(window).on('resize', function () {
            var top = jQuery(document).scrollTop();
            if (jQuery(".chaser").is(":hidden") && top > forchBottom) {
                jQuery(".chaser").slideDown(300);
            } else if (jQuery(".chaser").is(":visible") && top < forchBottom) {
                jQuery(".chaser").slideUp(200);
            }
        });

        jQuery(".chaser").css("visibility", "hidden");
        chaser.show();
        fixPositionMegaMenu(".chaser");
        jQuery(".chaser .megamenu-menu").removeClass("light");
        //chaser.hide();
        jQuery(".chaser").hide();
        jQuery(".chaser").css("visibility", "visible");
    }

    // accordion & toggles
    jQuery(".toggle-container .panel-collapse").each(function() {
        if (!jQuery(this).hasClass("in")) {
            jQuery(this).closest(".panel").find("[data-toggle=collapse]").addClass("collapsed");
        }
    });

    jQuery(".toggle-container.with-image").each(function() {
        var type = "";
        var duration = "1s";
        if (typeof jQuery(this).data("image-animation-type") != "undefined") {
            type = jQuery(this).data("image-animation-type");
        }
        if (typeof jQuery(this).data("image-animation-duration") != "undefined") {
            duration = jQuery(this).data("image-animation-duration");
        }
        var imageHtml = '<div class="image-container';
        if (type != "") {
            imageHtml += ' animated" data-animation-type="' + type + '" data-animation-duration="' + duration;
        }
        imageHtml += '"><img src="" alt="" /></div>';
        jQuery(this).prepend(imageHtml);
        if (jQuery(this).find(".panel-collapse.in").length > 0) {
            var activeImg = jQuery(this).find(".panel-collapse.in").parent().children("img");
            var src = activeImg.attr("src");
            var width = activeImg.attr("width");
            var height = activeImg.attr("height");
            var alt = activeImg.attr("alt");

            var imgObj = jQuery(this).find(".image-container img");
            imgObj.attr("src", src);
            if (typeof width != "undefined") {
                imgObj.attr("width", width);
            }
            if (typeof height != "undefined") {
                imgObj.attr("height", height);
            }
            if (typeof alt != "undefined") {
                imgObj.attr("alt", alt);
            }
            jQuery(this).children(".image-container").show();
        }
    });

    jQuery('.toggle-container.with-image').on('show.bs.collapse', function (e) {
        var activeImg = jQuery(e.target).parent().children("img");
        if (activeImg.length > 0) {
            var src = activeImg.attr("src");
            var width = activeImg.attr("width");
            var height = activeImg.attr("height");
            var alt = activeImg.attr("alt");

            var imgObj = jQuery(this).find(".image-container img");
            imgObj.attr("src", src);
            if (typeof width != "undefined") {
                imgObj.attr("width", width);
            }
            if (typeof height != "undefined") {
                imgObj.attr("height", height);
            }
            if (typeof alt != "undefined") {
                imgObj.attr("alt", alt);
            }

            imgObj.parent().css("visibility", "hidden");
            imgObj.parent().removeClass(imgObj.parent().data("animation-type"));
            setTimeout(function() {
                imgObj.parent().addClass(imgObj.parent().data("animation-type"));
                imgObj.parent().css("visibility", "visible");
            }, 10);
        }
    });

    jQuery('.toggle-container.with-image').on('shown.bs.collapse', function (e) {
        //e.target
    });

    // alert, info box
    jQuery("body").on("click", ".alert > .close, .info-box > .close", function() {
        jQuery(this).parent().fadeOut(300);
    });

    // // tooltip
    // jQuery("[data-toggle=tooltip]").tooltip();

    // testimonials
    function fixTestimonialHeight(slider) {
        var maxHeight = 0;
        jQuery(slider).find(".slides > li").each(function() {
            jQuery(this).css("height", "auto");
            if (jQuery(this).height() > maxHeight) {
                maxHeight = jQuery(this).height();
            }
        });
        jQuery(slider).find(".slides > li").height(maxHeight);
    }
    function displayTestimonials() {
        try {
            if (jQuery('.testimonial.style1').length > 0 && jQuery('.testimonial.style1').is(":visible")) {
                jQuery('.testimonial.style1').flexslider({
                    namespace: "testimonial-",
                    animation: "slide",
                    controlNav: true,
                    animationLoop: false,
                    directionNav: false,
                    slideshow: false,
                    start: fixTestimonialHeight
                });
            }
        } catch (e) {}
        try {
            if (jQuery('.testimonial.style2').length > 0 && jQuery('.testimonial.style2').is(":visible")) {
                jQuery('.testimonial.style2').flexslider({
                    namespace: "testimonial-",
                    animation: "slide",
                    controlNav: false,
                    animationLoop: false,
                    directionNav: true,
                    slideshow: false,
                    start: fixTestimonialHeight
                });
            }
        } catch (e) {}
        try {
            if (jQuery('.testimonial.style3').length > 0 && jQuery('.testimonial.style3').is(":visible")) {
                jQuery('.testimonial.style3').flexslider({
                    namespace: "testimonial-",
                    controlNav: false,
                    animationLoop: false,
                    directionNav: true,
                    slideshow: false,
                    start: fixTestimonialHeight
                });
            }
        } catch (e) {}
    }
    displayTestimonials();

    /* photo gallery and slideshow */
    // photo gallery with thumbnail
    jQuery('.image-carousel').each(function() {
        displayImageCarousel(jQuery(this));
    });
    jQuery('.photo-gallery').each(function() {
        displayPhotoGallery(jQuery(this));
    });

    jQuery('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var contentId = jQuery(e.target).attr("href");
        if (jQuery(contentId).find(".image-carousel").length > 0) {
            displayImageCarousel(jQuery(contentId).find(".image-carousel"));
        }
        if (jQuery(contentId).find(".photo-gallery").length > 0) {
            displayPhotoGallery(jQuery(contentId).find(".photo-gallery"));
        }
        if (jQuery(contentId).find(".testimonial").length > 0) {
            displayTestimonials();
        }
        jQuery(contentId).find(".middle-block").middleblock();
    });

    // popup
    jQuery(document).bind('keydown', function (e) {
        var key = e.keyCode;
        if (jQuery(".opacity-overlay:visible").length > 0 && key === 27) {
            e.preventDefault();
            jQuery(".opacity-overlay").fadeOut();
        }
    });

    jQuery(document).on("click", ".opacity-overlay", function(e) {
        if (!jQuery(e.target).is(".opacity-overlay .popup-content *")) {
            jQuery(".opacity-overlay").fadeOut();
        }
    });

    jQuery("body").on("click", "a.popup-gallery", function(e) {
        e.preventDefault();
        if (jQuery("#soap-gallery-popup").length < 1) {
            jQuery("<div class='opacity-overlay' id='soap-gallery-popup'><div class='container'><div class='popup-wrapper'><i class='fa fa-spinner fa-spin spinner'></i><div class='col-xs-12 col-sm-9 popup-content'></div></div></div></div>").appendTo("body");
        }
        jQuery("#soap-gallery-popup .popup-content").html('');
        jQuery("#soap-gallery-popup .popup-content").height('auto').css("visibility", "hidden");
        jQuery("#soap-gallery-popup").fadeIn();
        jQuery("#soap-gallery-popup .spinner").show();
        var obj = jQuery(this);
        jQuery.ajax({
            url: obj.attr("href"),
            type: 'post',
            dataType: 'html',
            success: function(html) {
                jQuery("#soap-gallery-popup .popup-content").html(html);
                if (jQuery('#soap-gallery-popup .image-carousel').length > 0) {
                    displayImageCarousel(jQuery('#soap-gallery-popup .image-carousel'));
                }
                if (jQuery('#soap-gallery-popup .photo-gallery').length > 0) {
                    displayPhotoGallery(jQuery('#soap-gallery-popup .photo-gallery'));
                    setTimeout(function() {
                        jQuery("#soap-gallery-popup .popup-content").css("visibility", "visible");
                        jQuery("#soap-gallery-popup .spinner").hide();
                    }, 100);
                }
            }
        });
    });

    jQuery("body").on("click", ".popup-map", function(e) {
        var lngltd = jQuery(this).data("box");
        if (typeof lngltd != "undefined") {
            e.preventDefault();
            if (jQuery("#soap-map-popup").length < 1) {
                jQuery("<div class='opacity-overlay' id='soap-map-popup'><div class='container'><div class='popup-wrapper'><i class='fa fa-spinner fa-spin spinner'></i><div class='col-xs-12 col-sm-9 popup-content'></div></div></div></div>").appendTo("body");
            }
            jQuery("#soap-map-popup").fadeIn();
            jQuery("#soap-map-popup .spinner").show();

            lngltd = lngltd.split(",");
            var contentWidth = jQuery("#soap-map-popup .popup-content").width()

            jQuery("#soap-map-popup .popup-content").gmap3({
                clear: {
                    name: "marker",
                    last: true
                }
            });
            jQuery("#soap-map-popup .popup-content").height(contentWidth * 0.5).gmap3({
                map: {
                    options: {
                        center: lngltd,
                        zoom: 12
                    }
                },
                marker: {
                    values: [
                        {latLng: lngltd}

                    ],
                    options: {
                        draggable: false
                    },
                }
            });
        }
    });

    jQuery("body").on("click", ".soap-popupbox", function(e) {
        e.preventDefault();
        var sourceId = jQuery(this).attr("href");
        if (typeof sourceId == "undefined") {
            sourceId = jQuery(this).data("target");
        }
        if (typeof sourceId == "undefined") {
            return;
        }
        if (jQuery(sourceId).length < 1) {
            return;
        }
        if (jQuery("#soap-popupbox").length < 1) {
            jQuery("<div class='opacity-overlay' id='soap-popupbox' tabindex='-1'><div class='container'><div class='popup-wrapper'><div class='popup-content'></div></div></div></div>").appendTo("body");
        }
        jQuery("#soap-popupbox .popup-content").children().hide();
        if (jQuery("#soap-popupbox .popup-content").children(sourceId).length == 0) {
            jQuery(sourceId).appendTo(jQuery("#soap-popupbox .popup-content"));
        }
        jQuery(sourceId).show();
        jQuery("#soap-popupbox").fadeIn(function() {
            jQuery(sourceId).find(".input-text").eq(0).focus();
        });
    });

    // style changer
    jQuery(".style-changer .design-skins a").click(function(e) {
        e.preventDefault();
        jQuery(this).closest("ul").children("li").removeClass("active");
        jQuery(this).parent().addClass("active");
    });
    jQuery("#style-changer .style-toggle").click(function(e) {
        e.preventDefault();
        if (jQuery(this).hasClass("open")) {
            jQuery("#style-changer").css("left", "0");
            jQuery(this).removeClass("open");
            jQuery(this).addClass("close");
        } else {
            jQuery("#style-changer").css("left", "-275px");
            jQuery(this).removeClass("close");
            jQuery(this).addClass("open");
        }
    });

    // filters option
    jQuery(".filters-container .filters-option a").click(function(e) {
        e.preventDefault();
        if (jQuery(this).parent().hasClass("active")) {
            jQuery(this).parent().removeClass("active");
        } else {
            jQuery(this).parent().addClass("active");
        }
    });

    // sort of trip
    jQuery(".sort-trip a").click(function(e) {
        e.preventDefault();
        jQuery(this).parent().parent().children().removeClass("active");
        jQuery(this).parent().addClass("active");
    });

    // redirect to the location
    jQuery(".location-reload").click(function(e) {
        e.preventDefault();
        var url = jQuery(this).prop("href").split("#")[0];
        if (window.location.href.indexOf(url) != -1) {
            var hash = jQuery(this).prop("href").split("#")[1];
            if (typeof hash != "undefined" && hash != "" && jQuery("a[href='#" + hash + "']").length > 0) {
                jQuery("a[href='#" + hash + "']").tab('show');
            }
        } else {
            window.location.href = jQuery(this).prop("href");
        }
    });

    // promo box
    function fixPromoBoxHeight() {
        jQuery(".promo-box").each(function() {
            if (jQuery(this).find(".content-section").css("float") == "right") {
                var maxHeight = jQuery(this).find(".image-container > img").height();
                jQuery(this).find(".content-section .table-wrapper").css("height", "auto");
                var calcPaddingTop = jQuery(".content-section").css("padding-top");
                var calcPaddingBottom = jQuery(".content-section").css("padding-bottom");
                var calcPadding = 0;
                try {
                    calcPadding = parseInt(calcPaddingTop, 10) + parseInt(calcPaddingBottom, 10);
                } catch (e) {  }
                var contentHeight = jQuery(this).find(".content-section >.table-wrapper").length > 0 ? jQuery(this).find(".content-section > .table-wrapper").height() + calcPadding : jQuery(this).find(".content-section").innerHeight();
                if (maxHeight < contentHeight) {
                    maxHeight = contentHeight;
                } else {
                    maxHeight += 15;
                }
                jQuery(this).find(".image-container").height(maxHeight);
                jQuery(this).find(".content-section").innerHeight(maxHeight);
                jQuery(this).find(".content-section .table-wrapper").css("height", "100%");
                jQuery(this).find(".image-container").css("margin-left", "-5%");
                jQuery(this).find(".image-container").css("position", "relative");
                jQuery(this).find(".image-container > img").css("position", "absolute");
                jQuery(this).find(".image-container > img").css("bottom", "0");
                jQuery(this).find(".image-container > img").css("left", "0");
            } else {
                jQuery(this).find(".image-container").css("height", "auto");
                jQuery(this).find(".image-container").css("margin", "0");
                jQuery(this).find(".content-section").css("height", "auto");
                jQuery(this).find(".image-container > img").css("position", "static");
            }
            if (!jQuery(this).find(".image-container > img").hasClass("animated")) {
                jQuery(this).find(".image-container > img").css("visibility", "visible");
            }
        });
    }
    fixPromoBoxHeight();

    // fit video
    if (jQuery.fn.fitVids) {
        jQuery('.full-video').fitVids();
    }

    // go back
    jQuery(".go-back").click(function(e) {
        e.preventDefault();
        window.history.go(-1);
    });

    // activate tab
    if (window.location.hash != "" && jQuery('a[href="' + window.location.hash + '"]').length > 0) {
        setTimeout(function() {
            jQuery('a[href="' + window.location.hash + '"]').tab('show');
        }, 100);
    }

    // parallax
    if(jQuery(".parallax").length > 0) {
        jQuery.stellar({
            responsive: true,
            horizontalScrolling: false
        });
    }

    if(jQuery().waypoint) {
        // animation effect
        jQuery('.animated').waypoint(function() {
            var type = jQuery(this).data("animation-type");
            if (typeof type == "undefined" || type == false) {
                type = "fadeIn";
            }
            jQuery(this).addClass(type);

            var duration = jQuery(this).data("animation-duration");
            if (typeof duration == "undefined" || duration == false) {
                duration = "1";
            }
            jQuery(this).css("animation-duration", duration + "s");

            var delay = jQuery(this).data("animation-delay");
            if (typeof delay != "undefined" && delay != false) {
                jQuery(this).css("animation-delay", delay + "s");
            }

            jQuery(this).css("visibility", "visible");

            setTimeout(function() { jQuery.waypoints('refresh'); }, 1000);
        }, {
            triggerOnce: true,
            offset: 'bottom-in-view'
        });

        // display counter
        jQuery('.counters-box').waypoint(function() {
            jQuery('.display-counter').each(function() {
                var value = jQuery(this).data('value');
                jQuery(this).countTo({from: 0, to: value, speed: 3000, refreshInterval: 10});
            });
            setTimeout(function() { jQuery.waypoints('refresh'); }, 1000);
        }, {
            triggerOnce: true,
            offset: '100%'
        });
    }

    // mobile top nav(language and currency)
    jQuery("body").on("click", function(e) {
        var target = jQuery(e.target);
        if (!target.is(".mobile-topnav .ribbon.opened *")) {
            jQuery(".mobile-topnav .ribbon.opened > .menu").toggle();
            jQuery(".mobile-topnav .ribbon.opened").removeClass("opened");
        }
    });
    jQuery(".mobile-topnav .ribbon > a").on("click", function(e) {
        e.preventDefault();
        if (jQuery(".mobile-topnav .ribbon.opened").length > 0 && !jQuery(this).parent().hasClass("opened")) {
            jQuery(".mobile-topnav .ribbon.opened > .menu").toggle();
            jQuery(".mobile-topnav .ribbon.opened").removeClass("opened");
        }
        jQuery(this).parent().toggleClass("opened");
        jQuery(this).parent().children(".menu").toggle(200);
        if (jQuery(this).parent().hasClass("opened") && jQuery(this).parent().children(".menu").offset().left + jQuery(this).parent().children(".menu").width() > jQuery("body").width()) {
            var offsetX = jQuery(this).parent().children(".menu").offset().left + jQuery(this).parent().children(".menu").width() - jQuery("body").width();
            offsetX = jQuery(this).parent().children(".menu").position().left - offsetX - 1;
            jQuery(this).parent().children(".menu").css("left", offsetX + "px");
        } else {
            jQuery(this).parent().children(".menu").css("left", "0");
        }
    });

    // fix position in resize
    jQuery(window).resize(function() {
        jQuery(".middle-block").middleblock();
        fixPositionMegaMenu();
        fixPositionSubmenu();
        fixPromoBoxHeight();
        fixTestimonialHeight('.testimonial');
        // fix slider position of gallery slideshow style2
        if (jQuery(".photo-gallery.style2").length > 0) {
            jQuery(".photo-gallery.style2").each(function() {
                var height = jQuery(this).find(".slides img").height();
                jQuery(this).find(".flex-control-nav").css("top", (height - 44) + "px");
            });
        }
    });
});

// mega menu
var megamenu_items_per_column = 6;
function fixPositionMegaMenu(parentObj) {
    if (typeof parentObj == "undefined") {
        parentObj = "";
    } else {
        parentObj += " ";
    }
    jQuery(parentObj + ".megamenu-menu").each(function() {
        var paddingLeftStr = jQuery(this).closest(".container").css("padding-left");
        var paddingLeft = parseInt(paddingLeftStr, 10);
        var offsetX = jQuery(this).offset().left - jQuery(this).closest(".container").offset().left - paddingLeft;
        if (offsetX == 0) { return; }
        jQuery(this).children(".megamenu-wrapper").css("left", "-" + offsetX + "px");
        jQuery(this).children(".megamenu-wrapper").css("width", jQuery(this).closest(".container").width() + "px");
        if (typeof jQuery(this).children(".megamenu-wrapper").data("items-per-column") != "undefined") {
            megamenu_items_per_column = parseInt(jQuery(this).children(".megamenu-wrapper").data("items-per-column"), 10);
        }
        //jQuery(this).children(".megamenu-wrapper").show();
        var columns_arr = new Array();
        var sum_columns = 0;
        jQuery(this).find(".megamenu > li").each(function() {
            var each_columns = Math.ceil(jQuery(this).find("li > a").length / megamenu_items_per_column);
            if (each_columns == 0) {
                each_columns = 1;
            }
            columns_arr.push(each_columns);
            sum_columns += each_columns;
        });
        jQuery(this).find(".megamenu > li").each(function(index) {
            jQuery(this).css("width", (columns_arr[index] / sum_columns * 100) + "%");
            jQuery(this).addClass("megamenu-columns-" + columns_arr[index]);
        });

        jQuery(this).find(".megamenu > li.menu-item-has-children").each(function(index) {
            if (jQuery(this).children(".sub-menu").length < 1) {
                jQuery(this).append("<ul class='sub-menu'></ul>");
                for (var j = 0; j < columns_arr[index]; j++) {
                    jQuery(this).children(".sub-menu").append("<li><ul></ul></li>")
                }
                var lastIndex = jQuery(this).children("ul").eq(0).children("li").length - 1;
                jQuery(this).children("ul").eq(0).children("li").each(function(i) {
                    var parentIndex = Math.floor(i / megamenu_items_per_column);
                    jQuery(this).closest("li.menu-item-has-children").children(".sub-menu").children("li").eq(parentIndex).children("ul").append(jQuery(this).clone());
                    if (i == lastIndex) {
                        jQuery(this).closest(".menu-item-has-children").children("ul").eq(0).remove();
                    }
                });
            }
        });
        jQuery(this).children(".megamenu-wrapper").show();
    });
}
fixPositionMegaMenu();

// menu position to top
jQuery("#footer #main-menu .menu >  li.menu-item-has-children").each(function(e) {
    var height = jQuery(this).children("ul, .megamenu-wrapper").height();
    jQuery(this).children("ul, .megamenu-wrapper").css("top", "-" + height + "px");
});

// login box
jQuery("body").on("click", ".travelo-signup-box .signup-email", function(e) {
    e.preventDefault();
    jQuery(this).closest(".travelo-signup-box").find(".simple-signup").hide();
    jQuery(this).closest(".travelo-signup-box").find(".email-signup").show();
    jQuery(this).closest(".travelo-signup-box").find(".email-signup").find(".input-text").eq(0).focus();
});

// THIS SCRIPT DETECTS THE ACTIVE ELEMENT AND ADDS ACTIVE CLASS (This should be removed in the php version.)
jQuery(document).ready(function(){
    var pathname = window.location.pathname,
        page = pathname.split(/[/ ]+/).pop(),
        menuItems = jQuery('#main-menu a, #mobile-primary-menu a');
    menuItems.each(function(){
        var mi = jQuery(this),
            miHrefs = mi.attr("href"),
            miParents = mi.parents('li');
        if(page == miHrefs) {
            miParents.addClass("active").siblings().removeClass('active');
        }
    });
});
