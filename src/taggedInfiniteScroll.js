define(['angular', 'underscore'], function(angular, _) {
  "use strict";

  // Allows a container to support infinite scroll
  // Based on: http://binarymuse.github.io/ngInfiniteScroll/
  var module = angular.module('tagged.directives.infiniteScroll', []);

  module.directive('taggedInfiniteScroll', ['$window', '$timeout', function($window, $timeout) {
    var SCROLL_THROTTLE = 50;

    return {
      scope: {
        callback: '&taggedInfiniteScroll',
        distance: '=taggedInfiniteScrollDistance',
        disabled: '=taggedInfiniteScrollDisabled'
      },
      link: function(scope, elem, attrs) {
        var $win = angular.element($window);

        var onScroll = _.throttle(function() {
          // Do nothing if infinite scroll has been disabled
          if (scope.disabled) {
            return;
          }

          var windowHeight = $win.height();
          var elementBottom = elem.offset().top + elem.height();
          var windowBottom = windowHeight + $win.scrollTop();
          var remaining = elementBottom - windowBottom;
          var shouldGetMore = (remaining - parseInt(scope.distance || 0, 10) <= 0);

          if (shouldGetMore) {
            $timeout(scope.callback);
          }
        }, SCROLL_THROTTLE);

        // Check immediately if we need more items upon reenabling.
        scope.$watch('disabled', onScroll);

        $win.bind('scroll', onScroll);

        // Remove window scroll handler when this element is removed.
        scope.$on('$destroy', function() {
          $win.unbind('scroll', onScroll);
        });

        // Check on next event loop to give the browser a moment to paint.
        // Otherwise, the calculations may be off.
        $timeout(onScroll);
      }
    };
  }]);
});
