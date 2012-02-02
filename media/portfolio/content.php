
<?php

$index = 0;
$size ="full";

if(isset($_GET["index"])){
    $index=$_GET["index"];
}

if(isset($_GET["size"])){
    $size=$_GET["size"];
}

$about=array(0,1,2,3,4);
$portfolio=array(5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,2,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47);
$contact=array(48);


$indexPad=str_pad($index,2,"0",STR_PAD_LEFT);

if($size=="full"){
    echo "<img src='media/portfolio/web/curriweb".$index.".jpg'/>";
} else{
    echo "<img src='media/portfolio/web/curriweb".$index.".jpg'/>";
}

?>
<!--
  <iframe  class="youtube-player" type="text/html" width="640" height="385" src="http://www.youtube.com/embed/oRvVBwED4kI" frameborder="0">
                    </iframe>
-->
  