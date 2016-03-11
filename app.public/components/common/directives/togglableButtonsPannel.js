//app.directive('togglableButtonsPanel', function () {
//  return {
//    link: function (scope, element, attrs) {
//      element.on('click', function (event) {
//        angular.element(event.currentTarget).find('li').removeClass('active');
//        angular.element(event.target).parent().addClass('active');
//
//        scope.$on('$destroy', function () {
//          element.addClass('active');
//        })
//      });
//
//    }
//  };
//});
//
