'use strict';

mediaApp.controller('MainCtrl', function($scope, $ionicSideMenuDelegate,SettingsService) {
    SettingsService.set('maxResults',"50");

    // Menu button
    $scope.leftButtons = [{
        type: 'button-icon button-clear ion-navicon',
        tap: function(e) {
            $ionicSideMenuDelegate.toggleLeft($scope.$$childHead);
        }
    }];

    ionic.Platform.ready(function(){
        console.log("Cordova is ready");
        // Add device specific stuff here
    });

    $scope.singers = ['img/shakira.jpg','img/justin.jpg','img/selena.jpg','img/adam.jpg'];
    var moreImgs = ['img/ariana.jpg', 'img/ed.jpg', 'img/harry.jpg',
        'img/alicia.jpg', 'img/jennifer.jpg','img/blake.jpg', 'img/pink.jpg','img/bruno.jpg','img/christina.jpg','img/jason.jpg',
        'img/pitbull.jpg','img/katy.jpg','img/iggy.jpg'];

    $scope.add = function add(name) {
        if (moreImgs.length>0)
            $scope.singers.push(moreImgs.pop());
        else {
            moreImgs.push($scope.singers.splice(0,1)[0]);
        }
    }

    $scope.remove = function remove() {
        var num = ~~(Math.random() * $scope.singers.length);
        moreImgs.push($scope.singers[num]);
        $scope.singers.splice(num,1)[0];
    };

    if ($scope.sideMenuController !=null)
        $scope.sideMenuController.toggleLeft();

})

mediaApp.controller('HomeCtrl', function ($scope) {
    if ($scope.sideMenuController.isOpen())
        $scope.sideMenuController.toggleLeft();
    
})

mediaApp.controller('AboutCtrl', function ($scope) {
    $scope.navTitle = "About Laffportal";
    if ($scope.sideMenuController.isOpen())
        $scope.sideMenuController.toggleLeft();

    $scope.rightButtons =  [{
        type: 'button-icon button-clear ion-email',
        tap: function(e) {
            if (window.plugins && window.plugins.emailComposer ) {
                window.plugins.emailComposer.showEmailComposerWithCallback(console.log("Email callback " + e), "Want to know more about Media Explorer...", "Please send me more details.", "hollyschinsky@gmail.com", null, null, false, null, null);
            }
            else {
                location.href = 'mailto:?subject=Question about media explorer&body=';
            }
        }
    }];
    $scope.linkTo = function(link){
        console.log("Link to " + link);
        var ref = window.open(link, '_blank', 'location=yes');
    }


})


mediaApp.controller('SettingsCtrl', function ($scope,SettingsService,$window) {
        $scope.navTitle = "Settings";
        $scope.volume = "20";
        $scope.audio = "on";
        $scope.video = "on";
        $scope.maxResults = SettingsService.get('maxResults');

        $scope.leftButtons = [{
            type: 'button-icon button-clear ion-ios7-arrow-back',
            tap: function(e) {
                $window.history.back();
            }
        }];
        if ($scope.sideMenuController.isOpen())
            $scope.sideMenuController.toggleLeft();

        $scope.toggleList = [
            { text: "Audio Mode", checked: true },
            { text: "Video Mode", checked: true }
        ];

        $scope.changeNumResults = function() {
            console.log("Results set to " + this.maxResults)
            $scope.maxResults = this.maxResults;
            SettingsService.set('maxResults',this.maxResults);
        };
})

mediaApp.controller('SearchCtrl', function ($scope,MediaService,$ionicModal,$location,$ionicSideMenuDelegate,$sce,SettingsService) {
        $scope.navTitle = "Laffportal Search";

        $scope.rightButtons =  [{
            type: 'button-icon button-clear ion-more',
            tap: function(e) {
                $scope.openSortModal();
            }
        }];
        $scope.request = {};
        $scope.showFlag = false;
        $scope.mediaTypes = {};
        $scope.mediaTypes.type = 'all';
        $scope.sortBy = "artistName";
        $scope.filterTerm = "";
        $scope.myitem={"previewUrl":"http://vimeo.com/96773196","kind":"vimeo","trackName":"just another comedy vid","artistName":"i go die"};
//<iframe src="//player.vimeo.com/video/96773196" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe> <p><a href="http://vimeo.com/96773196">Basketmouth's Girlfriend Exposed</a> from <a href="http://vimeo.com/laffportal">Laffportal Inc</a> on <a href="https://vimeo.com">Vimeo</a>.</p>
        if ($scope.sideMenuController.isOpen())
            $scope.sideMenuController.toggleLeft();

        var doSearch = ionic.debounce(function(query) {
            var type = $scope.mediaTypes.type;
            if (type=="all")  type="";
            if (query!=null) {
                // Pass in the query string, the media type and the # of results to return (from SettingsService)
                MediaService.search(query,type,SettingsService.get('maxResults')).then(function(resp) {
                    $scope.mediaResults = resp;
                    console.log("Result Count " + $scope.mediaResults.resultCount);
                    $scope.mediaResults = resp;

                    if ($scope.mediaResults.resultCount == 0)
                        $scope.infoTxt = 'No matching results found';

                });
            }
        }, 500);


        $scope.search = function() {
            $scope.infoTxt = null;
            doSearch($scope.request.query);
        }

        $scope.checkMedia = function(item) {
            console.log("URL " + item.previewUrl + " " + item.kind);
            if (item.kind==='song' || item.kind==='music-video' || item.kind==='vimeo') {
                $scope.openPlayModal(item);
                $scope.infoTxt = null;
            }
            else $scope.infoTxt = 'No suitable player available for the selected media type.'

        };

        $ionicModal.fromTemplateUrl('views/playModal.html', function(modal) {
            $scope.playModal = modal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        });

        $scope.openPlayModal = function(item) {
            $scope.url = item.previewUrl;
            $scope.url="http://vimeo.com/96773196";
            var valu=$sce.trustAsResourceUrl($scope.url);
            $scope.url=valu;
            $scope.kind=item.kind;
            if  (item.trackName != null) $scope.title = item.trackName
            else $scope.title = item.collectionName;

            $scope.kind = item.kind;
            $scope.artist = item.artistName;
            $scope.playModal.show();
        }

        $scope.closePlayModal = function() {
            $scope.playModal.hide();
        }

        $ionicModal.fromTemplateUrl('views/sortModal.html', function(sortModal) {
            $scope.sortModal = sortModal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        });

        $scope.openSortModal = function() {
            $scope.sortModal.show();
        }

        $scope.closeSortModal = function() {
            $scope.sortModal.hide();
        }

        $scope.saveSort = function() {
            console.log("This filter " + this.filterTerm + " query " + $scope.request.query + " sort " + this.sortBy);
            $scope.filterTerm = this.filterTerm;
            $scope.sortBy = this.sortBy;
            $scope.sortModal.hide();
        }
        //accordion stuff
  $scope.groups = [];
  $scope.groups[0]={name:"COMEDIANS",items:[{"name":"Basketmouth"},{"name":"IgoDie"},{"name":"Gordon"},{"name":"Bovi"}]};
  $scope.groups[1]={name:"ARTICLES",items:[{"name":"Wande Cole quits Mavin"},{"name":"Tiwa in London"},{"name":"Dbanj in good music"}]};
  $scope.groups[2]={name:"PHOTO ALBUMS",items:[{"name":"Party Tins","pic":"party1"},{"name":"Comedians having fun","pic":"party2"},{"name":"Birthday Pics","pic":"party3"}]};
  $scope.groups[3]={name:"TRENDING VIDEOS",items:[{"name":"Bovi night 2014","vid":"78892086"},{"name":"Naija boy","vid":"86522523"},{"name":"Experredit","vid":"86000997"}]};
  /*
  for (var i=0; i<10; i++) {
    $scope.groups[i] = {
      name: i,
      items: []
    };
    for (var j=0; j<3; j++) {
      $scope.groups[i].items.push(i + '-' + j);
    }
  }
  */
  /*
   * if given group is the selected group, deselect it
   * else, select the given group
   */
  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };        
})

mediaApp.controller('GalleryCtrl', function($scope, $firebase) {
  var ref = new Firebase('https://funinph.firebaseio.com/photos');// create an AngularFire reference to the data
  
  var sync = $firebase(ref);
  
  // download the data into a local object
  $scope.photos = sync.$asArray();
});


