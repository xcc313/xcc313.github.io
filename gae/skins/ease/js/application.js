/*
 * Copyright (c) 2013, Personal
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// NOTICE!! DO NOT USE ANY OF THIS JAVASCRIPT
// IT'S ALL JUST JUNK FOR OUR DOCS!
// ++++++++++++++++++++++++++++++++++++++++++

/*!
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Creative Commons Attribution 3.0 Unported License. For
 * details, see http://creativecommons.org/licenses/by/3.0/.
 */


!function ($) {

  $(function(){

    // IE10 viewport hack for Surface/desktop Windows 8 bug
    //
    // See Getting Started docs for more information
    if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
      var msViewportStyle = document.createElement("style");
      msViewportStyle.appendChild(
        document.createTextNode(
          "@-ms-viewport{width:auto!important}"
        )
      );
      document.getElementsByTagName("head")[0].
        appendChild(msViewportStyle);
    }


    var $window = $(window)
    var $body   = $(document.body)

    var navHeight = $('.navbar').outerHeight(true) + 10

    $body.scrollspy({
      target: '.bs-sidebar',
      offset: navHeight
    })

    $window.on('load', function () {
      $body.scrollspy('refresh')
    })

    $('.bs-docs-container [href=#]').click(function (e) {
      e.preventDefault()
    })

    // back to top
    setTimeout(function () {
      var $sideBar = $('.bs-sidebar')

      $sideBar.affix({
        offset: {
          top: function () {
            var offsetTop      = $sideBar.offset().top
            var sideBarMargin  = parseInt($sideBar.children(0).css('margin-top'), 10)
            var navOuterHeight = $('.bs-docs-nav').height()

            return (this.top = offsetTop - navOuterHeight - sideBarMargin)
          }
        , bottom: function () {
            return (this.bottom = $('.bs-footer').outerHeight(true))
          }
        }
      })
    }, 100)

    setTimeout(function () {
      $('.bs-top').affix()
    }, 100)

    // tooltip demo
    $('.tooltip-demo').tooltip({
      selector: "[data-toggle=tooltip]",
      container: "body"
    })

    $('.tooltip-test').tooltip()
    $('.popover-test').popover()

    $('.bs-docs-navbar').tooltip({
      selector: "a[data-toggle=tooltip]",
      container: ".bs-docs-navbar .nav"
    })

    // popover demo
    $("[data-toggle=popover]")
      .popover()

    // button state demo
    $('#fat-btn')
      .click(function () {
        var btn = $(this)
        btn.button('loading')
        setTimeout(function () {
          btn.button('reset')
        }, 3000)
      })
    //init timeline  
     var height =400;
    $(".time-line").height(height);
    $("#timeline").height(height);
    $("#timeline").width('99%');
    
    if ($.browser.msie && parseInt($.browser.version) < 8) {
        return;
    }
    var timeline = new VMM.Timeline();
    timeline.init();

})

}(window.jQuery)