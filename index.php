<?php

    header("Expires: Tue, 03 Jul 2001 06:00:00 GMT");
    header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
    header("Cache-Control: no-store, no-cache, must-revalidate");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");

$layoutThumbs = false;
$layoutName = "normal";
$promoCode = "000000";
$pageAbout = 1;
$pageWork = 5;
$pageBio = 8;
$pageAwards = 10;
$pageReel = 12;
$pagePortfolio = 15;
$pageLinks = 3;

$pageBreakDown = 16;
$pagePress = 46;

$morePages = 0;
$lastPage = 54;

$projectKromath = 38;
$projectKybela = 40;
$projectIdea = 42;
$projectPfizer = 44;

if (isset($_GET["layout"])) {
    $layoutName = $_GET["layout"];
}

if (isset($_GET["thumbs"])) {
    $layoutThumbs = true;
}

if (isset($_GET["code"])) {
    $promoCode = $_GET["code"];
}
?>

<!--
/*
 * Name:jquery.rnd.magazine
 * Version: 1.7.0
 * Hassan Ben Sabbah 2010 Copyright.

Copyright (c) 2010  hassan ben sabbah uriostegui salazar

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*
*/
-->
<!DOCTYPE html>

<html>
    <head>

        <title>Hassan Uriostegui . VFX Warrior.</title>
        <!---->
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <!--
        <meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1.0, maximum-scale=1.0"/>
        -->

        <script type="text/javascript" src="lib/jquery-1.6.2.min.js"></script> 
        <script type="text/javascript" src="lib/jquery.easing.1.3.js"></script> 
        <script type="text/javascript" src="lib/jquery.mousewheel.min.js"></script>
        <script type="text/javascript" src="lib/jquery.ui.touch.js"></script>
        <script type="text/javascript" src="lib/jquery-ui-1.8.16.custom.min.js"></script>
        <script type="text/javascript" src="lib/jquery.transform2d.js"></script>
        <script type="text/javascript" src="lib/jquery.rnd.panel.js"></script>
        <script type="text/javascript" src="lib/jquery.rnd.magazine.js"></script>


        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <link rel="apple-touch-icon" href="iphon_tetris_icon.png"/>
        <link rel="apple-touch-startup-image" href="startup.png" />


        <link href="css/jquery.mCustomScrollbar.css" rel="stylesheet" type="text/css" />
        <link href="css/jquery.rnd.magazine.css" rel="stylesheet" type="text/css" />
        <link rel="stylesheet" href="css/prettyPhoto.css" type="text/css" media="screen" title="prettyPhoto main stylesheet" charset="utf-8" />
        <script src="lib/jquery.prettyPhoto.js" type="text/javascript" charset="utf-8"></script>
		
        <script language="javascript">
            function magazinePageLoadCallback(magazine, content)
            {
                //console.debug("load page "+page.prop('id'))
                /*for(var i=0;i<10;i++){
        page.append("<p>hola "+i+"</p>");
    }*/
                var index = content.data("index");
                content.append("<h2>"+content.prop('id')+" </h2>");


                $("<div>").load('test.html', function(data) {

                });



            };

            function magazinePageUnloadCallback(magazine, content)
            {
                //console.debug("unload page "+page.prop('id'))
                content.empty();
            };

            /**
             * Item html creation helper.
             */

            function magazineDidEnterPage(){

                //$("#navigation").rndPanel('hide');
                $("#thumbsPanel").rndPanel('hide');

            };
            
            
    
            
            function thumbsDidClickPage(magazine, page){
                var index = page.data("index");
                
                console.debug("didClick "+ index);
                var targetPage=<?php echo $lastPage ?>;
                
                switch(index){
                    
                    case 0:
                        targetPage=<?php echo $pageReel ?>;
                        break;
                    case 1:
                        targetPage=<?php echo $projectKromath ?>;
                        break;
                    case 2:
                        targetPage=<?php echo $projectKybela ?>;
                        break;
                    case 3:
                        targetPage=<?php echo $projectIdea ?>;
                        break;
                    case 4:
                        targetPage=<?php echo $projectPfizer ?>;
                        break;
                    }
                    
                    
                    
                    $('#mag').rndMagazine('gotoPage',targetPage);
                }
                
                
                function setup(){


                    $("#mag").rndMagazine({
                        dir:"landscape",
                        width:'100%',
                        height:'99%',
                        pagesPerView:1,
                        pagesTotal:20,
                        pageLoadCallback: magazinePageLoadCallback,
                        pageUnloadCallback: magazinePageUnloadCallback,
                        didEnterPage: magazineDidEnterPage,
                        scroll:'true'
                    });


                    $("#thumbs").rndMagazine({
                        bgcolor:"#000",
                        dir:"landscape",
                        width:'100%',
                        height:150,
                        pagesPerView:7,
                        pagesTotal:20,
                        pageLoadCallback: magazinePageLoadCallback,
                        pageUnloadCallback: magazinePageUnloadCallback,
                        didClickPage:thumbsDidClickPage

                    });
    
    
                    $("#sideBar1").rndMagazine({
                        dir:"landscape",
                        width:'100%',
                        height:'100%',

                        scroll:'true'
                    });

                    $("#navigation").rndPanel({
                        direction:"up",
                        hideOffset:0
                    });

                    $("#thumbsPanel").rndPanel({
                        direction:"down",
                        hideOffset:20,
                        buttonHeight:0

                    });
                }

                jQuery(document).ready(function() {


                    setup();
    
                    var isiPad = navigator.userAgent.match(/iPad/i) != null;
                    var isiPod = navigator.userAgent.match(/iPhone/i) != null;
                    var isiPhone = navigator.userAgent.match(/iPod/i) != null;
   
   
                    function resizeLayout() {
                        //window.location.href = window.location.href;
            
            
                        if( window.lastWidth != $(window).width() ||
                            window.lastHeight != $(window).height()){
                            $('#mag').rndMagazine('setup');
                            $("#thumbs").rndMagazine('setup');
             
                            $("#navigation").rndPanel('setup');
                            $("#thumbsPanel").rndPanel('setup');
           
                            window.lastWidth = $(window).width();
                            window.lastHeight = $(window).height();
                        }
                    };
    
                    var resizeTimer = null;
                    $(window).bind('resize', function() {
                        if (resizeTimer) clearTimeout(resizeTimer);
                        resizeTimer = setTimeout(resizeLayout, 100);
                    });
                    
                    $(window).bind('orientationChanged', function() {
                         $('#mag').rndMagazine('setup');
                            $("#thumbs").rndMagazine('setup');
             
                            $("#navigation").rndPanel('setup');
                            $("#thumbs").rndPanel('setup');
                    });
                    
                    
        
                    window.lastWidth = $(window).width();
                    window.lastHeight = $(window).height();
                        
                    //pretty vimeo
                    
                    $("a[rel^='prettyPhoto']").prettyPhoto({
			animationSpeed: 'normal', /* fast/slow/normal */
			opacity: 0.80, /* Value between 0 and 1 */
			showTitle: true /* true/false */
                    });

                });  
                
         
</script>
        </script>


    </head>
    <body bgcolor="#ffffff"> 




        <div class="mainMagazine" id="mag" pagesPreload="2" pagesPerView="1" zoom="false" scroll="false" contentWidth="960" contentHeight="1280">

            <ul id="contents">
                <?
                if ($layoutName == "kromath") {
                    $morePages = 3;
                    echo"   
                       <li id='0' url='media/portfolio/kromath1.html'></li>
                        <li id='0' url='media/portfolio/kromath.php?code=" . $promoCode . "'></li>
                       <li id='0' url='media/portfolio/content.php?index=21&size=full'></li>
                       ";
                }

                if ($layoutName == "maj5") {
                    $morePages = 3;
                    echo"   
                       <li id='0' url='media/portfolio/content.php?index=18&size=full'></li>
                        <li id='0' url='media/portfolio/maj5.html'></li>
                       <li id='0' url='media/portfolio/content.php?index=21&size=full'></li>
                       ";
                }


                $pageBio += $morePages;
                $pageAwards += $morePages;
                $pageAbout += $morePages;
                $pageWork += $morePages;
                $pageReel += $morePages;
                $pagePortfolio += $morePages;
                $pageLinks += $morePages;
                $lastPage += $morePages;


                $projectKromath += $morePages;
                $projectKybela += $morePages;
                $projectIdea += $morePages;
                $projectPfizer += $morePages;


                $pageBreakDown += $morePages;
                $pagePress += $morePages;
                $lastPage += $morePages;
                ?>
                <li id='0' url='media/portfolio/content.php?index=1&size=full'></li>
                <li id='1' url='media/portfolio/presentation.html'></li>
                <li id='2' url='media/portfolio/content.php?index=15&size=full'></li>
                <li id='3' url='media/portfolio/links.html'></li>
                <li id='4' url='media/portfolio/content.php?index=3&size=full'></li>
                <li id='5' url='media/portfolio/content.php?index=4&size=full'></li>
                <li id='6' url='media/portfolio/content.php?index=7&size=full'></li>
                <li id='7' url='media/portfolio/content.php?index=8&size=full'></li>
                <li id='8' url='media/portfolio/content.php?index=13&size=full'></li>
                <li id='9' url='media/portfolio/content.php?index=9&size=full'></li>
                <li id='10' url='media/portfolio/content.php?index=10&size=full'></li>
                <li id='11' url='media/portfolio/content.php?index=11&size=full'></li>
                <li id='12' url='media/portfolio/reel.html'></li>
                <li id='13' url='media/portfolio/content.php?index=6&size=full'></li>
                <li id='14' url='media/portfolio/content.php?index=12&size=full'></li>
                <li id='15' url='media/portfolio/links2.html'></li>


                <li id='16' url='media/portfolio/content.php?index=28&size=full'></li>
                <li id='17' url='media/portfolio/content.php?index=29&size=full'></li>
                <li id='18' url='media/portfolio/content.php?index=30&size=full'></li>
                <li id='19' url='media/portfolio/content.php?index=31&size=full'></li>
                <li id='20' url='media/portfolio/content.php?index=32&size=full'></li>
                <li id='21' url='media/portfolio/content.php?index=33&size=full'></li>
                <li id='22' url='media/portfolio/content.php?index=34&size=full'></li>
                <li id='23' url='media/portfolio/content.php?index=35&size=full'></li>
                <li id='24' url='media/portfolio/content.php?index=36&size=full'></li>
                <li id='25' url='media/portfolio/content.php?index=37&size=full'></li>
                <li id='26' url='media/portfolio/content.php?index=38&size=full'></li>
                <li id='27' url='media/portfolio/content.php?index=39&size=full'></li>
                <li id='28' url='media/portfolio/content.php?index=40&size=full'></li>
                <li id='29' url='media/portfolio/content.php?index=41&size=full'></li>
                <li id='30' url='media/portfolio/content.php?index=42&size=full'></li>
                <li id='31' url='media/portfolio/content.php?index=43&size=full'></li>
                <li id='32' url='media/portfolio/content.php?index=44&size=full'></li>
                <li id='33' url='media/portfolio/content.php?index=45&size=full'></li>
                <li id='34' url='media/portfolio/content.php?index=46&size=full'></li>
                <li id='35' url='media/portfolio/content.php?index=47&size=full'></li>
                <li id='36' url='media/portfolio/content.php?index=48&size=full'></li>
                <li id='37' url='media/portfolio/content.php?index=49&size=full'></li>

                <li id='38' url='media/portfolio/content.php?index=22&size=full'></li>
                <li id='39' url='media/portfolio/linkKromath.html'></li>

                <li id='40' url='media/portfolio/content.php?index=23&size=full'></li>
                <li id='41' url='media/portfolio/linkKybela.html'></li>

                <li id='42' url='media/portfolio/content.php?index=24&size=full'></li>
                <li id='43' url='media/portfolio/linkIdea.html'></li>

                <li id='44' url='media/portfolio/content.php?index=25&size=full'></li>
                <li id='45' url='media/portfolio/linkPfizer.html'></li>

                <li id='46' url='media/portfolio/content.php?index=50&size=full'></li>
                <li id='47' url='media/portfolio/content.php?index=51&size=full'></li>
                <li id='48' url='media/portfolio/content.php?index=52&size=full'></li>
                <li id='49' url='media/portfolio/content.php?index=53&size=full'></li>
                <li id='50' url='media/portfolio/content.php?index=54&size=full'></li>
                <li id='51' url='media/portfolio/content.php?index=55&size=full'></li>


                <li id='52' url='media/portfolio/content.php?index=26&size=full'></li>
                <li id='53' url='media/portfolio/content.php?index=27&size=full'></li>

            </ul>

        </div>


        <div class="thumbsViewerPanel"  id='thumbsPanel'>

            <div class="thumbsViewerPanel"  id='thumbsPanel'>
                <div class="thumbsContent" >
                    <a href="#" onClick="javascript: $('#thumbsPanel').rndPanel('show');"><span>  [ Touch to show : Research & Development ]  hassan.uriostegui@gmail.com  <b><i> < + Drag Pages  + > </b> </i></span></a>

                </div>

                <div class='thumbsViewer' id='thumbs' pagesPreload='4' pagesPerView='7' zoom='false' scroll='false' contentWidth='160' contentHeight='80' >

                    <ul id='contents'>

                        <li id='0' url='media/portfolio/thumb.php?color=300&text1=2012%20Reel&text2=World%20quality%20VFX&page=<?php echo $pageReel ?>'></li>


                        <li id='0' url='media/portfolio/thumb.php?color=020&text1=Kromath&text2=Real%20Time%20Mobile%20Keyer'></li>
                        <li id='0' url='media/portfolio/thumb.php?color=944&text1=Kybela&text2=Virtual%20MakeUP%20Platform'></li>

                        <li id='0' url='media/portfolio/thumb.php?color=002&text1=Comex%20Idea&text2=Mobile%20Software'></li>
                        <li id='0' url='media/portfolio/thumb.php?color=002&text1=Pfizer%20Global&text2=Mobile%20Software'></li>

                        <li id='0' url='media/portfolio/thumb.php?color=000&text1=Shake%20Nuke&text2=Macros%20and%20Gizmos'></li>
                        <li id='0' url='media/portfolio/thumb.php?color=000&text1=MCore&text2=Multicore%20render%20shake'></li>
                        <li id='0' url='media/portfolio/thumb.php?color=003&text1=Letterbones&text2=Kinect%20openSource'></li>         
                        <li id='0' url='media/portfolio/thumb.php?color=200&text1=CineTimeMachine&text2=VFX%20Software'></li>

                        <li id='0' url='media/portfolio/thumb.php?color=002&text1=Virtual%20Decorator&text2=Mobile%20Software'></li>
                        <li id='0' url='media/portfolio/thumb.php?color=000&text1=Open%20raXT&text2=Augmented%20Reality'></li>
                        <li id='0' url='media/portfolio/thumb.php?color=000&text1=cocoaAS&text2=AS3%20Framework'></li>
                        <li id='0' url='media/portfolio/thumb.php?color=000&text1=maJ5&text2=jQuery%20Magzine'></li>

                    </ul>

                </div>
            </div>
        </div>




        <div class="navigationMenu" id="navigation">
            <div class="navigationMenuContent" >
                <a href="#" onClick="javascript:$('#mag').rndMagazine('gotoPage', <?php echo $pageAbout ?> );"><span> About Me     .</span></a>
                <a href="#" onClick="javascript:$('#mag').rndMagazine('gotoPage', <?php echo $pageBio ?> );"><span> Bio    .</span></a>
                <a href="#" onClick="javascript:$('#mag').rndMagazine('gotoPage', <?php echo $pagePress ?> );"><span> Press    .</span></a>
                <a href="#" onClick="javascript:$('#mag').rndMagazine('gotoPage', <?php echo $pageAwards ?> );"><span> Awards    .</span></a>
                <a href="#" onClick="javascript:$('#mag').rndMagazine('gotoPage', <?php echo $pageWork ?>);"><span> What i do    .</span></a>
                
                <a href="http://vimeo.com/35302053&width=700&height=400" rel="prettyPhoto" title="" onClick="javascript:$('#mag').rndMagazine('gotoPage', <?php echo $pageReel ?>);"><span> <b>VFX Reel </b>   .</span></a>
                
                <a href="#" onClick="javascript:$('#mag').rndMagazine('gotoPage', <?php echo $pageBreakDown ?>);"><span> Long-Breakdown    . </span></a>
                <a href="#" onClick="javascript:$('#mag').rndMagazine('gotoPage', <?php echo $pagePortfolio ?>);"><span> Portfolio </span></a>
                <a href="#" onClick="javascript:$('#mag').rndMagazine('gotoPage', <?php echo $pageLinks ?>);javascript: $('#thumbsPanel').rndPanel('show');"><span>[ + More & Contact ]</span></a>
            </div>

        </div>



    </div>


</body>
</html>
