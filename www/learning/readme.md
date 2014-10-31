http://forum.ionicframework.com/t/html5-video-tag-style-messed-in-ionic-css/3254/7
http://forum.ionicframework.com/t/new-tutorial-swipeable-user-intro-tutorial/278

jfrench
jfrenchFeb 17
The solution I came up with to solve this problem is this:

I have a ionic-custom.scss file that looks like this:

// Colors
// -------------------------------

$light:                 #fff !default;
$stable:                #f8f8f8 !default;
$positive:              #4ea4be !default; //#4a87ee;
$calm:                  #40A7CF !default; //#43cee6;
$balanced:              #a2c57a !default; //#66cc33
$energized:             #f0b840 !default;
$assertive:             #ef4e3a !default;
$royal:                 #8a6de9 !default;
$dark:                  #444 !default;

@import "../../bower_components/ionic/scss/ionic.scss";
As you see here, I've customized the positive, calm, and balanced colors. Then at the bottom I import the ionic.scss file. Since I have already defined values using !default my values now override the Ionic values. So I just compile my ionic-custom.scss file with Compass during my build and import the resulting css. For clarity, my index.html looks something like this:

<head>
  <!--Import my custom Ionic css -->
  <link rel="stylesheet" href='css/ionic-custom.css />

  <!-- Now this file is no longer needed! --> 
  <!-- <link rel="stylesheet" href="assests/vendor/ionic/css/ionic.css" /> -->
</head>
Now I can simply upgrade ionic every time a new release comes out and I don't have to change anything!

http://ionicframework.com/tutorials/customizing-ionic-with-sass/
http://ionicframework.com/tutorials/fullscreen-apps/