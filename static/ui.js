'use strict';

function t(user) {
	console.log(JSON.stringify(user, null, '  '));
	if ( user.status == 'busy')
	return ['alert','alert-danger'];

	return ['alert','alert-success'];
}

let m = angular.module('boops', ['ngAnimate']);

var favicon=new Favico({ animation:'slide' });

let prev = null;

m.controller('ctrl', function($http, $scope) {
	$scope.style = () => ['alert', 'alert-info'];
  $scope.scrolls = () => {
    let names = document.getElementsByClassName("name");
    if (names.length == 0) {
      return false;
    }
    let rect = names[names.length-1].getBoundingClientRect();
    let bottom = rect.bottom;
    if (bottom > window.innerHeight + 20) {
      return true;
    }
    return false;
  }
	$scope.s = (s) => JSON.stringify(s, null, '    ');
	$scope.d = (d) => moment(d).fromNow();
	let update = () => {
		$http({
			method: 'GET',
			url: '/issues'
		}).then(({data}) => {
			$scope.issues = data;
			if (data.length !== prev) {
				prev = data.length;
				favicon.badge(data.length);
				if (data.length) {
					document.title = data.length + ' boops';
				} else {
					document.title = 'no boops';
				}
			}
			setTimeout(update, 1000);
		}).catch(() => {
			setTimeout(update, 1000);
		});
	};
	
	update();

  });

 m.animation('.slide', [function() {
  return {
    // make note that other events (like addClass/removeClass)
    // have different function input parameters
    enter: function(element, doneFn) {
      jQuery(element).fadeIn(1000, doneFn);
    },

    move: function(element, doneFn) {
      jQuery(element).fadeIn(1000, doneFn);
    },

    leave: function(element, doneFn) {
      jQuery(element).fadeOut(1000, doneFn);
    }
  }
}]);