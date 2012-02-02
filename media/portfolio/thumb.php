
<?php

$color = $_GET["color"];
$text1= $_GET["text1"];
$text2 = $_GET["text2"];
$page = $_GET["page"];

?>

<style type="text/css">

    .infoBase {
        position:absolute;
        top:0px;
        left:0px;
        width:160px;
        height:80px;
        text-decoration: none;
    }

    .infoText1 {

        text-decoration: none;
        top:5px; 
        font-weight:normal;

        color:#ccc;

        letter-spacing:1pt;
        word-spacing:2pt;
        font-size:14px;
        text-align:center;
        font-family:helvetica, sans-serif;
        line-height:2.2;



    }

    .infoText1 a *{

        text-decoration: none;

        top:5px; 
        font-weight:normal;

        color:#ccc;

        letter-spacing:1pt;
        word-spacing:2pt;
        font-size:14px;
        text-align:center;
        font-family:helvetica, sans-serif;
        line-height:2.2;

    }


    .infoText2 {
        position:relative;
        top:-5px;

        text-decoration: none;
        color:#fff;

        letter-spacing:2pt;

        font-size:6px;
        text-align:center;
        font-family:helvetica, sans-serif;

        font-style:italic;


    }



    .infoText2 a *{
        text-decoration: none;
        color:#fff;

        letter-spacing:2pt;

        font-size:6px;
        text-align:center;
        font-family:helvetica, sans-serif;

        font-style:italic;



    }

    A:link { text-decoration: none } ;
    A:active { text-decoration: none };
    A:visited { text-decoration: none };

</style>


 
<div class="infoBase" >
    <div style=" background-color:#<?php echo $color ?>;">
        <a  href="#" >
            <div class="infoText1">
                <?php echo $text1 ?> 
            </div>
            <div class="infoText2">
                <p> <?php echo $text2 ?> </p>
            </div>
        </a>
    </div>
</div>


