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
 
        direction:"up",
        speed:1000,
        buttonWidth:100,
        buttonHeight:10,
        isVisible:true,
        animating:false,
        hideOffset:0.0,
        didLoadCallback:function(){}
        
    };
    
    /*
     *
     * CONSTRUCTOR
     * OBJECT CONTRUCTOR
     * RECEIVES TARGET ELEMENT AND OPTIONS
     *
     */
        
        
    $.rndPanel =  function(element, o) {
        
        this.settings    = $.extend({}, defaults, o || {});
        
        this.panelBlock = null;
        this.panelContainer = null;
        
        element=$(element);
        this.settings.elementName = element.prop('id');
        this.settings.panel=element;
       
        
        this.settings.originalWidth = this.settings.panel.width();
        this.settings.originalHeight = this.settings.panel.height();
           
        //console.debug( this.settings.elementName);
        
        this.buildHolders(element);
        this.buildLayout(element);
        this.buildBindings(element);
              
 
            
    };
        
    /*
 *
 * CLASS EXTENSION
 * 
 *
 */
     
    var $panel = $.rndPanel;

    $panel.fn = $panel.prototype = {
        plugin:"rnd.magazine",
        author:"Hassan Ben Sabbah",
        version:"0.0.1"
    };

    $panel.fn.extend = $panel.extend = $.extend;
    
    $panel.fn.extend({
        
        setup: function() {
            //console.debug("layout panel");
            this.buildLayout(this.settings.panel);
            this.show();
        },
        
           
        buildHolders: function(element){
                
          
            element.children().wrapAll('<div id="panelMobileContent"></div>')
            this.panelMobileContent = element.find('#panelMobileContent');
            
            
            this.panelMobileContent.wrapAll('<div id="panelMobile"></div>')
            this.panelMobile = element.find('#panelMobile');
            
            this.panelMobile.wrapAll('<div id="panelContainer"></div>')
            this.panelContainer = element.find('#panelContainer');
       
            
            this.panelMobile.append('<div id="button-'+this.settings.elementName+'"></div>');
            this.panelMobile.button =this.panelMobile.find('#button-'+this.settings.elementName);
            
 
        },
        
        buildLayout: function(element){
          
            //horizontal
            this.settings.panel.height(  this.settings.originalHeight+this.settings.buttonHeight+"px");
             
                
            this.panelContainer.css({
                position:'absolute',
                width:'100%', 
                height:'100%',
                display:'inline-block',
                overflow:'hidden'
              
          
            });
            
           
            
            
            this.settings.width = this.panelContainer.width();
            this.settings.height = this.panelContainer.height();
            this.settings.left = this.panelContainer.position().left;
            this.settings.top = this.panelContainer.position().top;
            this.settings.bottom = parseInt(this.panelContainer.css('bottom'));
            var buttonleft=(this.settings.width -  this.settings.buttonWidth)/2;
            
            //horizontal
            this.panelMobile.css({ 

                position:'relative',
         
                width: this.settings.width+'px',
                height: this.settings.height+'px'
               // background:'#ff0'
            
            });
            
           
            
            //console.debug(" this.panelContainer width"+ this.panelContainer.width());
             
            this.panelMobile.button.css({
                margin:'0px',
                padding:'0px',
                position:'absolute',
                width:this.settings.buttonWidth+'px',
                height:this.settings.buttonHeight+'px',
                background:'#b00' ,
                left:buttonleft+'px',
                "-moz-box-shadow": "10px 0px 5px #000",
                "-webkit-box-shadow": "10px 0px 5px #000",
                "box-shadow": "10px 0px 5px #000"
                        
            });
            
    
            
          
            if(this.settings.direction == "up"){
           
                this.panelMobileContent.css({ 

                    position:'absolute',
                    width:'100%',
                    height:this.settings.originalHeight,
                    top:'0px'
                    //background:'#0f0'
            
                });
                
                this.panelMobile.button.css({
                    bottom:'0px'          
                });
            }
        
            if(this.settings.direction == "down"){
                this.panelMobileContent.css({ 

                    position:'absolute',
                    width:'100%',
                    height:this.settings.originalHeight,
                    bottom:'0px'
                    //background:'#0f0'
            
                });

                this.panelMobile.button.css({
                    top:'0px'            
                });
                
                
            }
            
            this.settings.hidePos = (-1 * this.settings.originalHeight ) + this.settings.hideOffset;
            this.settings.showPos = 0;
                
            this.settings.hideSize = this.settings.originalHeight+this.settings.buttonHeight;
            this.settings.showSize = this.settings.originalHeight+this.settings.buttonHeight;
            
            if(this.settings.direction == "up"){
                this.settings.hideSize =this.settings.buttonHeight + this.settings.hideOffset;
            } else{
                this.settings.hideSize =this.settings.buttonHeight + this.settings.hideOffset;
               // this.settings.hidePos = 0;
            }
        
        },
        
        buildBindings: function (element){
              
            this.panelMobile.button.click( function() {
                togglePanel()
            } );
        
            var self= this;
        
            var togglePanel = function (){ 
            
                if( self.settings.isVisible ){
                
                    self.hide();
                        
  
                } else{

                    self.show();
            
                
                }
            }
        },
        
        hide: function(){
            //console.debug("hidePanel");
            if( this.settings.isVisible ){
                this.hideNow();
            }
        },
        
        show: function(){
            //console.debug("showPanel");
            if( !this.settings.isVisible ){
                this.showNow();
            }
        },
        
        
        hideNow: function(){
            //console.debug("hideNow");
            var self=this;
            var newPos=this.settings.hidePos;
              
            if(self.settings.direction == "down"){
                    
                if( !self.settings.animating) {
                    self.settings.animating=true;
                        
                    self.panelMobile.animate({
                        bottom:newPos+'px'
                    },self.settings.speed,function(){
                       
                        self.settings.panel.height(self.settings.hideSize);
                        self.panelMobile.css("bottom","0px");
                        self.settings.isVisible=false;
                        self.settings.animating=false;
                        
                    }
                    );
                }
            }
                 
            if(self.settings.direction == "up"){
                    
                if( !self.settings.animating) {
                    self.settings.animating=true;
                    self.panelMobile.animate({
                        top:newPos+'px'
                    },self.settings.speed,function(){
                        
                        self.settings.panel.height(self.settings.hideSize);
                        self.settings.isVisible=false;
                        self.settings.animating=false;
                    }
                    );
                }
            }
        },
        
        showNow: function(){
            //console.debug("showNow");
            var self=this;
            self.settings.panel.height(self.settings.showSize);
            
            if(self.settings.direction == "up"){
                    
                if( !self.settings.animating) {
                    self.settings.animating=true;
                    self.panelMobile.animate({
                        top:self.settings.showPos
                    },self.settings.speed,function(){
                        
                        self.settings.panel.height(self.settings.showSize);
                        self.settings.isVisible=true;
                        self.settings.animating=false;
                    }
                    );
                }
            }
                
            if(self.settings.direction == "down"){
                    
                             
                self.panelMobile.css("bottom",this.settings.hidePos + "px");   
                if( !self.settings.animating) {
                    self.settings.animating=true;
                    self.panelMobile.animate({
                        bottom:self.settings.showPos
                    },self.settings.speed,function(){
                        
                        self.settings.panel.height(self.settings.showSize);
                         self.settings.isVisible=true;
                        self.settings.animating=false;
                    }
                    );
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

    $.fn.rndPanel = function(o) {
        if (typeof o == 'string') {
            var instance = $(this).data('rndPanel'), args = Array.prototype.slice.call(arguments, 1);
            return instance[o].apply(instance, args);
        } else {
            return this.each(function() {
                var instance = $(this).data('rndPanel');
                if (instance) {
                    if (o) {
                    // $.extend(instance.options, o);
                    }
                    instance.reload();
                } else {
                    $(this).data('rndPanel', new $panel(this, o));
                }
            });
        }
    };

})(jQuery);