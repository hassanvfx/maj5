<?php

$code = "000000";


if( isset($_GET["code"] )){
     $code = $_GET["code"];
}


?>

<style type="text/css">

.backPage{

position:absolute;
top:0px;
left:0px;
z-index:1;
}
.centeredCode{

position:absolute;
width:100%;
top:290px;
left:0px;
z-index:1;
}

</style>

<div class="backPage">

<img src='media/portfolio/web/curriweb17.jpg' border="0" usemap="#Map"/>
<map name="Map" id="Map">
  <area shape="rect" coords="44,205,437,471" href="http://vimeo.com/35301989" target="_new" />
</map>
</div>
<div class="centeredCode">
<h1>
<center>
<?php


echo $code


?>
</center>    
</h1>
</div>
