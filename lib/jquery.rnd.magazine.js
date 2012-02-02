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


(function($) {
    
    
    var defaults = {
        
        bgcolor:"#fff",
        orientation:"landscape",
			
        width:"400",
        height:"200",
        
        magazineWidth:'400',
        magazineHeight:'200',
        	
        pageWidth:"200",
        pageHeight:"200",
			
        pagesTotal:5,
        pagesPerView:2,
        pagesPreload:2,
        scroll:false,
        
        currentView:0,
        
        scrollerWidth:35,
        scrollerHeight:65,
        
        contentWidth:0,
        contentHeight:0,
        
        defaultContents:null,
                
                        
        controls:"#controls",
                        
        speed:600,
        animating:false,
        zoom:false,

                                                     
        didLoadCallback:function(){},
        didChangeNextCallback:function(){},
        didChangePrevCallback:function(){},
        didChangePageCallback:function(){},
        
        pageLoadCallback:function(){},
        pageUnloadCallback:function(){},
        didEnterPage:function(){}
  
        
    };
    
    /*
     *
     * CONSTRUCTOR
     * OBJECT CONTRUCTOR
     * RECEIVES TARGET ELEMENT AND OPTIONS
     *
     */
        
        
    $.rndMagazine =  function(element, o) {
        var self =this;
         
        this.settings    = $.extend({}, defaults, o || {});
        this.settings.visiblePages = new Object();
        this.settings.invisiblePages = new Object();
 
        element=$(element); 
        this.settings.magazine = element;
        
        this.extractPreferences(element);
        this.extractContentsList(element);
        
        element.empty();
 
        this.buildHolders(element);
        this.buildCSSStyles(element);   
        this.buildBindings(element);   
       
        this.settings.visiblePages = new Object();
        this.settings.invisiblePages = new Object();
        
        for(var i=0; i<this.settings.pagesTotal;i++){
            var pagename = this.getPageName(i);
            this.settings.invisiblePages[pagename]=pagename;
           
        }
        
        
        element.magazine.fadeTo(1,0,function(){
            element.magazine.fadeTo(3000,1)
        });
        
        window.setInterval(  function() {
            self.mainLoop();
        }, 50);
        
        this.settings.tweakingPage =0;
        
        window.addEventListener('gesturechange', function(e) {   
            e.preventDefault();          
        });
        
   
        element.dblclick(function(e) {
            //console.debug("double click" +self.settings.tweakingPage);
            self.resetContentZoom(self.settings.tweakingPage);    
                
        });

    
    };
        
    /*
      *
      * CLASS EXTENSION
      * 
      *
      */
     
    var $magazine = $.rndMagazine;

    $magazine.fn = $magazine.prototype = {
        plugin:"rnd.magazine",
        author:"Hassan Ben Sabbah",
        version:"0.0.1"
    };

    $magazine.fn.extend = $magazine.extend = $.extend;
    
    $magazine.fn.extend({
        
        
        setup: function() {
            var self=this;
            var lastpage = this.settings.currentView;
            
            // ////console.debug("lastpage"+lastpage);
           
            
            this.buildCSSStyles(this.settings.magazine);   
         
      
            this.gotoPage(lastpage);
            

        },
        
        extractPreferences: function(element){
            var pagesPerView = element.attr("pagesPerView");
            if(pagesPerView!= undefined){
                this.settings.pagesPerView=pagesPerView;
            }
        
            var scroll = element.attr("scroll");
            if(scroll!= undefined){
            
                if(scroll=="false"){
                    this.settings.scroll=false;
                } else{
                    this.settings.scroll=true;
                }
            
            }
            
            var contentWidth = element.attr("contentWidth");
            if(contentWidth!= undefined){
                this.settings.contentWidth=contentWidth;
            } else {
                this.settings.contentWidth=null;
            }
            
            var contentHeight = element.attr("contentHeight");
            if(contentHeight!= undefined){
                this.settings.contentHeight=contentHeight;
            } else {
                this.settings.contentHeight=null;
            }
            
            var orientation = element.attr("orientation");
            if(orientation!= undefined){
                this.settings.orientation=orientation;
            } 
        
        
            var pagesPreload = element.attr("pagesPreload");
            if(pagesPreload!= undefined){
                this.settings.pagesPreload=pagesPreload;
            } 
            
            
            var zoom = element.attr("zoom");
            if(zoom!= undefined){
                 if(zoom=="true"){
                     this.settings.zoom=true;
                 }
            } 
        
        },
        
        extractContentsList: function(element){
            /*
         *
         * EXTRACT PAGES
         * IF THEY ARE SETTED INSIDE DE STRUCTURE
         *
         */

            var self =this;

            var contents = element.find("#contents")
            var contentSize = contents.children().length;
        
            if(contentSize>0){
                self.settings.pagesTotal = contentSize;
                
                self.settings.defaultContents= new Array();
        
                contents.children().each( function(i,v) {
         
                    var theElement = $(v);
                    var url = theElement.attr("url");
                
                    self.settings.defaultContents.push(url);
                
                });
        
            }
        
 
        },
        
        buildHolders: function(element) {
            
            /*
         *
         * GEOMETRY SETUP
         * BUILD CONTAINERS AND ATTACH CSS STYLES
         *
         */

        
            element.append("<div id='magazine'></div>");
            element.magazine = element.find("#magazine"); //safe reference
           
            element.magazine.append("<div id='magContainer'></div>");
            element.container =  element.magazine.find("#magContainer"); //safe reference
             
            element.container.append("<div id='magList'></div>");
            element.list =  element.container.find("#magList");//safe reference
            
            this.settings.pages = new Array();
            this.settings.pagesContent = new Array();
            this.settings.pagesDraggers = new Array();
            this.settings.pagesContainers  = new Array();
            this.settings.pagesStates  = new Object();
             
            for (i = 0; i < this.settings.pagesTotal; i++) {
            
                element.list.append("<div class='page' id='magPage"+i+"'></div>");
                var page=element.list.find('#magPage'+i);
                
                
                page.append("<div id='contentContainer"+i+"'></div>");
                var contentContainer=page.find('#contentContainer'+i);
                
                contentContainer.append("<div id='content"+i+"'></div>");
                var pageContent=contentContainer.find('#content'+i);

                this.settings.pages.push(page);
                this.settings.pagesContainers.push(contentContainer);
                this.settings.pagesContent.push(pageContent);
                
                if(this.settings.scroll) {
                
                    page.append("<div id='dragger"+i+"''></div>");
                    var pageDragger=element.list.find('#dragger'+i);
                    this.settings.pagesDraggers.push(pageDragger);
                }
         
            }
         
        },
        
        
        buildCSSStyles: function(element) {
            
            var self=this;
              
            if(this.settings.orientation=="portrait"){
                this.settings.containerleft = this.settings.magazine.container.position().top;

                this.settings.minRange = this.settings.containerleft;
                this.settings.maxRange = this.settings.containerleft + this.settings.magazine.container.height();
                
                this.settings.minRange = this.settings.minRange -( this.settings.pagesPreload * this.settings.pageHeight);
                this.settings.maxRange = this.settings.maxRange +( this.settings.pagesPreload * this.settings.pageHeight);
       
            } else{
                this.settings.containerleft = this.settings.magazine.container.position().left;

                this.settings.minRange = this.settings.containerleft;
                this.settings.maxRange = this.settings.containerleft + this.settings.magazine.container.width();
                
                this.settings.minRangeOffset = this.settings.minRange -( this.settings.pageWidth);
                this.settings.maxRangeOffset = this.settings.maxRange +(  this.settings.pageWidth);
            }
         
            
            element.magazine.css({ 
                position:'relative',
                width:this.settings.width , 
                height:this.settings.height,
                visible:'false'
            });
            
            this.settings.magazineWidth = element.magazine.width();
            this.settings.magazineHeight =  element.magazine.height();
            
            this.settings.maxScroll = this.settings.scrollerHeight;
            this.settings.minScroll = -(this.settings.pageHeight-this.settings.scrollerHeight);

            var _rect="rect(0px,"+ this.settings.magazineWidth+"px,"+this.settings.magazineHeight+"px,0px)";
          
            element.container.css({ 
                position:'absolute',
                width:'100%', 
                height:'100%',
                display:'inline-block',
                overflow:'hidden',
                //background:'#FFF',
                 background: this.settings.bgcolor,
                clip:_rect
            });
        
        
            /*
         * GEOMETRY SETUP
         * CALCULATE BLOCK AND CHILDRENS SIZE
         */

        
            //if horizontal
            
            if(this.settings.contentWidth == null ||
                this.settings.contentHeight ==null){
            
                this.settings.pageWidth =  this.settings.magazineWidth/ this.settings.pagesPerView;
                this.settings.pageHeight = this.settings.magazineHeight
                
                this.settings.pageScale=1.0;
                 
                this.settings.contentWidth=this.settings.pageWidth;
                this.settings.contentHeight=this.settings.pageHeight;
                 

            } else{
                
                if(this.settings.orientation=="portrait"){
                    this.settings.aspect = this.settings.contentHeight /this.settings.contentWidth ;
                    this.settings.pageWidth =  this.settings.magazineWidth ;
                    this.settings.pageHeight = this.settings.magazineWidth*this.settings.aspect;
                   
                    this.settings.pageScale=this.settings.pageWidth/this.settings.contentWidth;
                
                    this.settings.pagesPerView= parseInt( ( this.settings.magazineHeight/ this.settings.pageHeight ));
                    this.settings.pagesPerViewCeil= Math.ceil( ( this.settings.magazineHeight/ this.settings.pageHeight ));
          
                } else{
                    this.settings.aspect = this.settings.contentWidth /this.settings.contentHeight ;
                    this.settings.pageWidth =  this.settings.magazineHeight*this.settings.aspect;  
                    this.settings.pageHeight = this.settings.magazineHeight
                    this.settings.pageScale=this.settings.pageWidth/this.settings.contentWidth;
                
                    this.settings.pagesPerView= parseInt( ( this.settings.magazineWidth/ this.settings.pageWidth ));
                    this.settings.pagesPerViewCeil= Math.ceil( ( this.settings.magazineWidth/ this.settings.pageWidth ));
          
                }
                 
                  
                if(this.settings.pagesPerView<1)this.settings.pagesPerView=1;
               
            }
            
                 
            element.list.css({ 

                position:'relative',
                
                width: this.settings.listWidth+'px',
                height: this.settings.listWidt+'px'
         
            });
            
            
            if(this.settings.orientation=="portrait"){
                this.settings.listWidth =   this.settings.magazineWidth;
                this.settings.listHeight = this.settings.magazineHeight * this.settings.pagesTotal;
                 
                var lastPageSize = this.settings.magazineHeight - (  this.settings.pagesPerView*this.settings.pageHeight );
                var complementOffset=0;
             
                if(  this.settings.pagesPerViewCeil >this.settings.pagesPerView ){
                    complementOffset= (lastPageSize)/2;
                ////console.debug("complementOffset "+complementOffset);
                }
                
                this.settings.listOffset = complementOffset;
                
                element.list.css({ 
                    width: (this.settings.listWidth+this.settings.listOffset)+'px'
                });
                
            } else{
        
                this.settings.listWidth =  this.settings.pageWidth * this.settings.pagesTotal;
                this.settings.listHeight = this.settings.magazineHeight;
                
                var lastPageSize = this.settings.magazineWidth - (  this.settings.pagesPerView*this.settings.pageWidth );
                var complementOffset=0;
             
                if(  this.settings.pagesPerViewCeil >this.settings.pagesPerView ){
                    complementOffset= (lastPageSize)/2;
                ////console.debug("complementOffset "+complementOffset);
                }
            
                this.settings.listOffset = complementOffset;
            
                element.list.css({ 
                    height: (this.settings.listHeight+this.settings.listOffset)+'px'
                });
            }
           
             
            
          
       
            
            var _scale ="scale("+this.settings.pageScale+","+this.settings.pageScale+")";
            this.settings.transformScale=1;
            //console.debug("pageScale set "+_scale);
              
            //var _offsetX = ((this.settings.contentWidth -this.settings.pageWidth)/2);
            //var _offsetY = ((this.settings.contentHeight -this.settings.pageHeight)/2);
            
            // var _translate ="translate("+ -_offsetX+","+ -_offsetY+")";     
     
          
            ////console.debug("_scale "+ _scale);
        
            for(var i=0; i <this.settings.pages.length; i++){
                var page = this.settings.pages[i];
                var dragger = this.settings.pagesDraggers[i];
                var content = this.settings.pagesContent[i];
                var contentContainer = this.settings.pagesContainers[i];
                
                
                page.css({
                    position:'absolute',
                    top:'0px',
                    left:'0px',
                    width:this.settings.pageWidth+'px', 
                    height:this.settings.pageHeight+'px',
                    display:'inline-block',
                    //background:'#FFF',
                     background: this.settings.bgcolor,
                    "z-index":0
                   // overflow:'hidden'
                  
                });
                
                
                content.css({
                    position:'fixed',
                    top:'0px',
                    left:'0px',
                    width:'100%', 
                    height:'100%',
                    //background:'#FFF',
                     background: this.settings.bgcolor,
                    "z-index":1
                  
                });
                
                if(this.settings.orientation=="portrait"){
                    
                    var pos =  (this.settings.pageHeight*i)+ this.settings.listOffset;
                
                    page.css({
                        top:pos+'px'
                    });
                } else{
                    
                    var pos =  (this.settings.pageWidth*i)+ this.settings.listOffset;
                
                    page.css({
                        left:pos+'px'
                    });
                }
            
                page.data("index",i);
                
                
                contentContainer.css({
                    position:'relative',     
                    transform:_scale,
                    "-ms-transform":_scale, /* IE 9 */
                    "-moz-transform":_scale, /* Firefox */
                    "-webkit-transform":_scale, /* Safari and Chrome */
                    "-o-transform":_scale, /* Opera */
                    
                    "transform-origin":"0 0",
                    "-ms-transform-origin":"0 0", /* IE 9 */
                    "-webkit-transform-origin":"0 0", /* Safari and Chrome */
                    "-moz-transform-origin":"0 0", /* Firefox */
                    "-o-transform-origin":"0 0" /* Opera */
                });
                
                content.css({
                    position:'relative',
                    width:'100%',
                    height:'auto',
                    //background:'#FFF',
                     background: this.settings.bgcolor,
                    top:'0px'
                 
                
                });
                
                if(this.settings.scroll) {
                    dragger.css({
                        position:'absolute',
                        top:this.settings.maxScroll+'px',
                        right:'0px',
                        //left:this.settings.pageWidth*.95+'px',
                        width:this.settings.scrollerWidth+'px', 
                        height:this.settings.pageHeight+'px',
                        display:'inline-block',
                        background:'#666',
                        
                         "z-index":2
                  
                    });
                }
            
            
            }
         
        },
        
        
        buildBindings: function(element) {
            
            var self=this;
            
            for(var i=0; i <this.settings.pages.length; i++){

                if(this.settings.scroll) {
                    this.bindScroller(i); 
                }
                
                if(this.settings.zoom){
                    this.bindPanZoom(i);
                
                }
  
            }
            
            this.bindContainer(element);     
         
        },
        
        bindPanZoom: function (i){
            
            var self=this;
            var page = this.settings.pages[i];
            
            page.bind('gesturestart', function(e) {
                
                var _page = $(e.target);
                var index = _page.data("index");
               
        
                if(index==undefined){
                    _page=_page.parents(".page");
                    index= _page.data("index");
                }
                
                var _content =self.settings.pagesContent[index];
                 
                
                _content.draggable( );
                _content.draggable( "option", "disabled", false );
                self.settings.magazine.list.draggable( "option", "disabled", true );
              
                _page.data("z-index-normal",page.css("z-index"));
                _page.css("z-index",100);
               
                
                self.settings.gestureStartScale=e.originalEvent.scale;
                self.settings.tweakingPage = index;
            
                e.preventDefault();
                
            });
            
            
            page.bind('gesturechange', function(e) {
                
                var _page = $(e.target);
                var index = _page.data("index");
               
        
                if(index==undefined){
                    _page=_page.parents(".page");
                    index= _page.data("index");
                }
            
                
                
                var _content =self.settings.pagesContent[index];
                var scaleDelta =( e.originalEvent.scale -self.settings.gestureStartScale);
                self.settings.transformScale += scaleDelta*.25;
                if( self.settings.transformScale < .5)  self.settings.transformScale=.5;
                if( self.settings.transformScale > 3)  self.settings.transformScale=3;
                
            /*
                _content.stop().animate({
                    "transform":"scale("+ self.settings.transformScale +")"
                    
                },200);*/
                
                _content.css(
                    "transform","scale("+ self.settings.transformScale +")");
                    
                
                
                
                e.preventDefault();
                
            });
            
            
            page.bind('gestureend', function(e) {
                
              
                
                var _page = $(e.target);
                var index = _page.data("index");
               
        
                if(index==undefined){
                    _page=_page.parents(".page");
                    index= _page.data("index");
                }
              
                //console.debug("gestureend" +index)
                e.preventDefault();
                
                if(self.settings.transformScale<1){
                     self.resetContentZoom(index);
                }
                
            });
            
            
            page.dblclick(function(e) {
                
                   
                var _page = $(e.target);
                var index = _page.data("index");
               
        
                if(index==undefined){
                    _page=_page.parents(".page");
                    index= _page.data("index");
                }
                
               self.resetContentZoom(index);
               
                
            });
            
        },
        
        resetContentZoom:function(i){
             var _page=this.settings.pages[i];
             var _content =this.settings.pagesContent[i];
              
               
                _page.css("z-index",0);
                
                //console.debug("transformScale" +this.settings.transformScale);
                //console.debug("pageScale" +this.settings.pageScale);
                
                this.settings.transformScale =1;

                _content.stop().animate({
                    "transform":"scale("+ 1 +")",
                    left:"0px",
                    top:"0px"
                    
                },1000);
                
                _content.draggable( "option", "disabled", true );
                this.settings.magazine.list.draggable( "option", "disabled", false );
        },
        
        
        
       
        bindScroller: function( i){
            
            var self=this;
            var dragger = this.settings.pagesDraggers[i];
            var page = this.settings.pages[i];
             
            dragger.draggable({ 
          
                axis: "y",
                distance: 5,
                    
                stop: function(e,ui){
                    var _dragger = $('#'+e.target.id);
                    var top=_dragger.position().top
                        
                    ////console.debug("top "+top)
                    ////console.debug("self.settings.maxScroll "+self.settings.maxScroll)
                    if( top< self.settings.minScroll){
                        _dragger.animate({
                            top:self.settings.minScroll
                        },100);
                            
                    //_dragger.css("top", self.settings.minScroll);
                    }
                        
                    if(top > self.settings.maxScroll){
                        _dragger.animate({
                            
                            top:self.settings.maxScroll
                        },100);
                            
                    //_dragger.css("top", self.settings.maxScroll);
                    }
                }

            });
               
        
            page.bind("mousewheel", function(event, delta) {
                    
                var _page = $('#'+event.target.id);
                var index = _page.data("index");
                
                if(index==undefined){
                    _page=_page.parents(".page");
                    index= _page.data("index");
                    
                }
                var _dragger = self.settings.pagesDraggers[index];
                        
                ////console.debug("id="+_page.prop("id"));
                ////console.debug("index="+index);
                    
                var vel = Math.abs(delta*10);
                        
                ////console.debug(_dragger.prop('id'));
                        
                var newPos=dragger.position().top-(delta*vel);
                ////console.debug("newPos"+newPos);
                        
                var top = _dragger.position().top-(delta*vel);
                        
                if( top< self.settings.minScroll){
                            
                    top=self.settings.minScroll;
                            
                            
                //_dragger.css("top", self.settings.minScroll);
                }
                        
                if(top > self.settings.maxScroll){
                            
                    top=self.settings.maxScroll;
                //_dragger.css("top", self.settings.maxScroll);
                }
                        
                _dragger.css("top", top);
            });
            
             
        },
        
        bindContainer: function(element){
            
            
            var self=this;
            
            element.list.mouseover( function (e){
                 
                var _page = $('#'+e.target.id);
                self.callback('didEnterPage',_page);
                
            });
            
            var cancelFollow = false;  
            
            
          
            
            
            element.list.click( function (e){
                //e.stopPropagation(); 
                if (cancelFollow) 
                {  
                    
                    cancelFollow = false; 
                    return false;  
                    
                }  
                    
                var _target = $(e.target);
                var _page=_target.parents(".page");
                self.callback('didClickPage',_page);
                return true;  
                
            });
            
            
            element.list.draggable({ 
               
                axis: "x",
                distance: 20,
                //helper:'original',

                start: function(event, ui){
               
                    element.list.stop();
                    self.settings.moving=true;
                },
                stop: function(event, ui){
                    cancelFollow = true;
                    element.list.stop();
                    self.settings.moving=false;
                    self.settings.animating=false;
                    self.settings.lastContainerPos = element.list.position().left;
                }
          

            });
            
            if(this.settings.orientation=="portrait"){
                element.list.draggable("option","axis","y");
            } else {
                element.list.draggable("option","axis","x");
            }
            
            
            
          
            
        },
        
                    
        /*
         *NAVIGATION
         *
         */
        
        gotoPage: function(index){
            ////console.debug('gotoPage '+index);
            this.settings.currentView=index;
            
            this.gotoCurrentView();
        },
        
        gotoCurrentView: function (){
            var self=this;
            // ////console.debug('gotoCurrentView '+this.settings.currentView);
                 
                      
            if( this.settings.currentView<0){
                this.settings.currentView=0;
            }
              
            if( this.settings.currentView> (this.settings.pagesTotal-this.settings.pagesPerView)){
                this.settings.currentView=(this.settings.pagesTotal-this.settings.pagesPerView);
            }
             
             
            if(this.settings.orientation=="portrait"){
                var newPos =  this.settings.currentView * -this.settings.pageHeight;
            }else{
                var newPos =  this.settings.currentView * -this.settings.pageWidth;
            }
                 
            if(this.settings.lastContainerPos!=newPos && !this.settings.moving) {
                
                self.settings.animating=true;
                self.settings.moving=true;
                
                var props= new Object();
                 
                if(this.settings.orientation=="portrait"){
                    props.top=newPos;
                } else{
                    props.left=newPos;
                }
                
                this.settings.magazine.list.stop().animate(props,500,'easeOutCirc',function(){
                    self.settings.moving=false;
                    self.settings.animating=false;
                });
            }
            this.settings.lastContainerPos=newPos;
        //}
        },
        
               
        
        
        /*
         *RENDER LOOP
         *
         */
        
        mainLoop: function(){
            
            /*
            function matrixToArray(matrix) {
                var contents = matrix.substr(7);
                contents = contents.substr(0, contents.length - 1);

                return contents.split(', ');
            }*/

            //this.settings.magazine.list.css("-moz-transform","translate(-100px, 0px)");

            // ////console.debug("tick-tack aca:" +  matrixToArray(this.settings.magazine.list.css('-moz-transform'))  );
            // ////console.debug("tick-tack aca:" +  this.settings.magazine.list.position().left );
            
            
            if(!this.settings.moving){
                if(this.settings.orientation=="portrait"){
                    this.settings.listleft = this.settings.magazine.list.position().top;
                } else{
                    this.settings.listleft = this.settings.magazine.list.position().left;
                }
                
                if(  this.settings.listleft != this.settings.old_listleft){
                    
                
                    var first = Math.floor(( this.settings.listleft *-1)/this.settings.pageWidth);
                    var last = first + this.settings.pagesPerView;
          
                    // //console.debug("1clipping first "+first + " last "+last);
                    first=first - parseInt(this.settings.pagesPreload);
                    last=last + parseInt(this.settings.pagesPreload);
            
                    // //console.debug("2clipping first "+first + " last "+last);
                    first=first - 1;
                    last=last + 1;
            
            
                
                    if(first < 0) {
                        first=0;
                    }
                    if(last > this.settings.pages.length) {
                        last=this.settings.pages.length;
                    }
                    //console.debug("3clipping first "+first + " last "+last);
             
             
                    for(var i=first; i <last; i++){
                    
                        if(this.renderVisibility(i) && this.settings.scroll){
                            this.renderScrolling(i);
                        }
          
                    }
                    
                    if(!this.settings.moving && !this.settings.animating){
                        this.renderInertia();
 
                    }
                
                
                }
                this.settings.old_listleft = this.settings.listleft;
                
            }
            
        },
        
        getPageName:function(i){
            return "page"+i;  
        },
        
        
        renderVisibility: function(i){
                    
                    
            var containerleft = this.settings.containerleft;
            var listleft =  this.settings.listleft;
                
            var minRange = this.settings.minRange;
            var maxRange = this.settings.maxRange;
            
            var minRangeOffset = this.settings.minRangeOffset;
            var maxRangeOffset = this.settings.maxRangeOffset;
               
     
            var page = this.settings.pages[i];
            var pageContent = this.settings.pagesContent[i];
                    
            var pagename = this.getPageName(i);
            
            if(this.settings.orientation == "portrait"){
                
                var pageleft = i *this.settings.pageHeight;
             
                var absLeft = listleft +pageleft;
                var absRight = absLeft +this.settings.pageHeight;
                
            } else{
              
                
                var pageleft = i *this.settings.pageWidth;
             
                var absLeft = listleft +pageleft;
                var absRight = absLeft +this.settings.pageWidth;
            }
         
                    
            var visible =false;
                    
            if(absLeft > minRange &&
                absLeft < maxRange ) {
                visible =true;
            }
                     
                     
            if(absRight > minRange &&
                absRight < maxRange ) {
                visible =true;
            }
            
            
            var visibleOffset =false;
            
            if(absLeft > minRangeOffset &&
                absLeft < maxRangeOffset ) {
                visibleOffset =true;
            }
                       
            if(absRight > minRangeOffset &&
                absRight < maxRangeOffset ) {
                visibleOffset =true;
            }
            
                 
          
            
            if(visible){
                if( this.settings.visiblePages[pagename] == null){
                    // ADD TO VISIBLE PAGES
                    //////console.debug("page visible:" +  page.prop('id')  );
                  
                          
                    this.loadPage(i,"visible");  
                }
                
                this.loadPagesNear(i);       
            } 
            
            if(!visibleOffset){
                if( this.settings.invisiblePages[pagename] == null){
               
                             
                    // REMOVER CONTENIDO PARA LA  CELDA
                    this.unloadPage(i); 
                }
                         
            }
            
           
            return visible;
        },
        
        renderScrolling: function(i){
           
            if( this.settings.draggersPos==null){
                this.settings.draggersPos=new Array();
            }
            var dragger = this.settings.pagesDraggers[i];
            var content = this.settings.pagesContent[i];
                    
            var contentTop =content.position().top;
            var draggerTop = (dragger.position().top -  this.settings.maxScroll ) ;
                    
            var percent =draggerTop/ (Math.abs( this.settings.minScroll )  +this.settings.maxScroll) ;
            var newHeight = content.height();
                    
            var maxDisp = newHeight-this.settings.pageHeight;
            var disp =maxDisp*percent;
            // ////console.debug("------" );
            //   ////console.debug("i:" +  i );
                        
            //if(i==0){
            ///////console.debug("percent:" +  percent );
            /// ////console.debug("self.settings.minScroll:" +  self.settings.minScroll );
            // ////console.debug("self.settings.minScroll:" +  self.settings.maxScroll );
            // ////console.debug("maxDisp:" +  maxDisp );
            // ////console.debug("disp:" +  disp );
            //}
            
            
            if(disp!=this.settings.draggersPos[i]){
                content.animate({
            
                    top: disp
               
                },180,'easeOutCirc');
            }
            
            this.settings.draggersPos[i] = disp;
                
            
            
        },
        
        renderInertia: function(){
            
            
            if(!this.settings.animating ){     
            
                var listleft = this.settings.listleft+1;   
            
                var doSomething=false;
               
                if(this.settings.orientation =="portrait") {
                    var blockSize= this.settings.pageHeight;
                } else{
                   
                    var blockSize= this.settings.pageWidth;
                }
               
                if( listleft < this.settings.old_listleft){
                    doSomething=true;
                    this.settings.currentView = (Math.floor( (listleft/blockSize) ));  
                } else if(listleft > this.settings.old_listleft){
                    doSomething=true;
                    this.settings.currentView = (Math.round( (listleft/blockSize)+0.455));
                }
            
            
              
                if(doSomething){
                    this.settings.animating=true;
                    this.settings.currentView=this.settings.currentView*-1;
            
                    ////console.debug("inertia calls to "+this.settings.currentView);
                
                    this.gotoCurrentView();
                }
            }
            
            
        },
        
        /*
         *HELPERS
         *
         */
        loadPage:function(i,state){
            var pageContent = this.settings.pagesContent[i];
            var page =this.settings.pages[i];
            
            var pagename = this.getPageName(i);
            //page.data("state",state); 
            this.settings.pagesStates[pagename] = state;
            
            if(this.settings.visiblePages[pagename]==null){
                
                this.settings.visiblePages[pagename] = pagename;
                this.settings.invisiblePages[pagename] =null;
                    
                var self=this;
                page.fadeTo(1,0);
                         
            
                //CARGAR CONTENIDO ASIGNADO
                if(this.settings.defaultContents!=null){
               
                
                    var timeoutID = window.setTimeout(function(){
          
                        if (timeoutID) clearTimeout(timeoutID);
                        var url = self.settings.defaultContents[i];
                        pageContent.load(url,function(){
                            page.fadeTo(2000,2); 
   
                        }) 
                   
                    });
                
                } else{
                        
                    // PEDIR CONTENIDO PARA LA NUEVA CELDA
                
             
                    var timeoutID = window.setTimeout(function(){
          
                        if (timeoutID) clearTimeout(timeoutID);
                        self.callback('pageLoadCallback',pageContent);   
                    }, 2000);
                    
                
                }
            }
            
        },
        
        loadPagesNear:function(offset){
            
            for(var i=1; i<=this.settings.pagesPreload;i++){
                
                var index= offset+i;
                
                var unloaded = this.settings.invisiblePages[this.getPageName(index)];
                var loaded = this.settings.visiblePages[this.getPageName(index)];
                
                ////console.debug("aca buscando >" + index + "=" + unloaded);
                
                if(unloaded!=null && loaded==null){
                    ////console.debug("aca preloading >" + index);
                    this.loadPage(index,"preload");
                    
                }
            }
            
            for(var i=1; i<=this.settings.pagesPreload;i++){
                
                var index= offset-i;
                
                var unloaded = this.settings.invisiblePages[this.getPageName(index)];
                var loaded = this.settings.visiblePages[this.getPageName(index)];
               
                ////console.debug("aca buscando <" + index + "=" + unloaded);
                
                if(unloaded!=null && loaded==null){
                    ////console.debug("aca preloading <" + index);
                    this.loadPage(index,"preload");
                }
            }
            
        },
        
        unloadPage:function(i){
            var pageContent = this.settings.pagesContent[i];
            var page =this.settings.pages[i];
            var pagename=this.getPageName(i);
            
            // var state = page.data("state");
            
            var state = this.settings.pagesStates[pagename];
            
            if(state =="visible"){
                
                ////console.debug("aca unloading  "+i+" state "+state);
                
                // ADD TO INVISIBLE PAGES
                ////////console.debug("page invisible:" +  page.prop('id')  );
                this.settings.invisiblePages[pagename] = pagename;
                           
                // REMOVE FROM VISIBLE PAGES
                this.settings.visiblePages[pagename] =null;
                     
                     
                //CARGAR CONTENIDO ASIGNADO
                if(this.settings.defaultContents!=null){
                    pageContent.empty();
                } else{
                    // PEDIR CONTENIDO PARA LA NUEVA CELDA
                    this.callback('pageUnloadCallback',pageContent);
                }
            
            }
            
        },
        
        
        callback: function(cb, object) {
            
            if (this.settings[cb] == null/* || (typeof this.settings[cb] != 'object' )*/) {
                return;
            }

            var callback = this.settings[cb];

            if (!$.isFunction(callback)) {
                return;
            }

            var self = this;

            if (object === undefined) {
                callback(self);
            } else{
                callback(self,object);
            }
        }

        
    });

    $.fn.rndMagazine = function(o) {
        if (typeof o == 'string') {
            var instance = $(this).data('rndMagazine'), args = Array.prototype.slice.call(arguments, 1);
            return instance[o].apply(instance, args);
        } else {
            return this.each(function() {
                var instance = $(this).data('rndMagazine');
                if (instance) {
                    if (o) {
                    // $.extend(instance.options, o);
                    }
                    instance.reload();
                } else {
                    $(this).data('rndMagazine', new $magazine(this, o));
                }
            });
        }
    };

})(jQuery);