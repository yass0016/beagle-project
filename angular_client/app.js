var beagle = angular.module("beagle", ["beagle.services"]);

beagle.controller("mainController", function($scope, $http, socket) {
  $scope.list = [];

  function getList() {
    $http.get("http://sayadev.com:2000/list").then(
      function(response) {
        $scope.list = response.data;
      },
      function(error) {
        console.log(error);
      }
    );
  }

  $scope.delete = function(id) {
    $http.delete("http://sayadev.com:2000/list/" + id).then(
      function(response) {
        console.log(response);
      },
      function(error) {
        console.log(error);
      }
    );
  };

  socket.on("created", function(item) {
    $scope.list.push(item);
  });

  socket.on("removed", function(id) {
    $scope.list = $scope.list.filter(function(list) {
      return list._id !== id;
    });
  });

  getList();
});
