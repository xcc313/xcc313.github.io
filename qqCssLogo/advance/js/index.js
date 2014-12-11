/**
 * == QQ Logo Period Animation =========================================================================
 * Copyright (c) 2012 Tencent AlloyTeam, All rights reserved.
 * http://www.AlloyTeam.com/
 * Code licensed under the BSD License:
 * http://www.AlloyTeam.com/license.txt
 * 
 * @version 1.0
 * @author  AishenHu(<a href="mailto:hit.huzhichao@gmail.com">hit.huzhichao@gmail.com</a>)
 * @description: QQ Logo Period Animation
 * -------------------------------------------------------------- 2012.10.25 ----------------------------
 */

/**
 * ������
 * @return
 */
;Jx().$package("qqlogo.util", function(J){
    var $A = J.array,
        $D = J.dom,
        $E = J.event,
        $C = J.console;

    var isArray = function(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }
    /**
     * ������������ִ��һ�����еĶ�����֧��ʱ���ӳ�
     * ���Զ���Ļص�����
     * @type {Object}
     */
    var animationChain = {
        cur: 0,
        animations : [],
        /**
         * ʹ��'#qq' div����webkitAnimationEnd�¼�ͳһ��������
         */
        init: function(){
            this.cur = 0;
            this.controller = $D.id('qq');
            var handler = function(){
                console.log('qq ', animationChain.cur);
                var ani = animationChain.animations[animationChain.cur];
                console.log(ani);
                if(ani){
                    ani.callback && ani.callback();
                    animationChain.cur ++;
                    animationChain.next();  
                }
                              
            }
            $E.on(this.controller, 'webkitAnimationEnd', handler);
            $E.on(this.controller, 'animationend', handler);
            $E.on(document.body, 'keyup', this.onKeyUp);
            $E.on(document.body, 'keypress', this.onKeyPress);
            $E.on(document.body, 'keydown', this.onDown);
        },
        add : function(element, aniName, delay, callback){
            delay = delay || 0;
            var _this = this;
            var ani = {
                element: element,
                aniName: aniName,
                delay : delay,
                id: this.animations.length,
                callback: callback
            }
            this.animations.push(ani);
            return animationChain;  //����animationChain������ʽ��Ӵ���
        },

        /**
         * ִ�ж�������
         * ���Ƴ������б���ÿ��Ԫ�ص�transition��transition��animation��ͬ
         * ����ʱ����ʱ����bug
         */
        start: function(){
            console.log(this.animations);
            J.console.warn('animation start: total ' + this.animations.length);
            $A.forEach(this.animations, function(item){
                item.element.el.style.webkitTransition = 'none';
                item.element.el.style.mozTransition = 'none';
            });
            this.next(0);
        },

        /**
         * ִ����һ��Ԫ��Ԥ����Ķ���
         * ���ӳٽ��д���
         */
        next: function(id){   
            var cur = id || this.cur;
            if(cur < this.animations.length){        
                var ani = this.animations[cur];
                if(ani.delay == 0){
                    ani.element.start(ani.aniName);
                    J.console.log('run animation ' + this.cur);
                }else{
                    var _this = this;
                    setTimeout(function(){
                        ani.element.start(ani.aniName);
                        J.console.log('run animation ' + _this.cur);
                    }, ani.delay);
                } 
            }
        },

        /**
         * ���ö����б�����
         */
        reset : function(){
            this.animations = [];
            this.cur = 0;
        },

        stop: function(){
            var ani = this.animations[this.cur];
            ani.element.el.style.webkitAnimationPlayState = 'paused';
            ani.element.el.style.mozAnimationPlayState = 'paused';
            ani.element.el.style.animationplaystate = 'paused';
            J.console.error('stop animation');
        },

        resume: function(){
            var ani = this.animations[this.cur];
            ani.element.el.style.webkitAnimationPlayState = 'running';
            ani.element.el.style.MozAnimationPlayState = 'running';
            ani.element.el.style.animationPlayState = 'running';
            J.console.warn('resume animation');
        },

        back: function(msg){
            var ani = this.animations[this.cur];
            if(this.cur > 0){
                this.cur --;
            }
            ani.element.back(ani.aniName);
            //recover the container
            ani.callback && ani.callback(true);
            var _this = this;
            setTimeout(function(){
                _this.next(_this.cur);
            }, 200);
            qqlogo.period.PeriodInfo.show('');
            J.console.warn('back one animation, current animation index: '+ this.cur);
        },

        restart: function(){
            while(this.cur >= 0){
                var ani = this.animations[this.cur];
                ani && ani.element.back(ani.aniName);
                this.cur --;
            }
            this.cur = 0;
            this.next(0);
            qqlogo.period.PeriodInfo.show('');
            qqlogo.period.Hello.hide();
            qqlogo.period.resetContainer();
            J.console.error('restart');
        },

        onKeyPress: function(event){
            var code = event.keyCode;
            //console.log(code);
            if(event.keyCode == 32){
                event.preventDefault();
            }
        },

        /**
         * ���Ź��̿���
         */
        onKeyUp: function(event){
            var code = event.keyCode;
            console.log('code:',code);
            switch(code){
                case 82: { //R
                    qqlogo.period.Eye.removeBlink();
                    animationChain.restart();
                    event.preventDefault();
                }
                case 37: { //left
                    animationChain.back();
                    event.preventDefault();
                    break;
                }
                case 38: { // right
                    event.preventDefault();
                    break;
                }
                case 32: { //space
                    var ani = animationChain.animations[animationChain.cur];
                    var isStop = (ani.element.el.style.webkitAnimationPlayState == 'paused')  || (ani.element.el.style.mozAnimationPlayState == 'paused');
                    if(isStop){
                        animationChain.resume();
                    }else{
                        animationChain.stop();
                    }
                    event.preventDefault();
                    break;
                }
            }
        },

        onKeyDown: function(event){
            var code = event.keyCode;
            if(event.keyCode == 32){
                event.preventDefault();
            }
        },
    }

    // var qqconsole = {
    //     init: function(){
    //         this.element = $D.id('console');
    //         this.state = 0;
    //         var _this = this;
    //         $E.on(document, 'keyup', function(event){
    //             if(event.keyCode == 67){ //C
    //                 _this.toggle();
    //             }
    //         });
    //     },
    //     show: function(){
    //         this.state = 1;
    //         this.element.style.right = '-15px';
    //     },
    //     hide: function(){
    //         this.state = 0;
    //         this.element.style.right = '-500px';
    //     },
    //     toggle: function(){
    //         if(this.state == 1){
    //             this.hide();
    //         }else{
    //             this.show();
    //         }
    //     },
    //     log: function(info){
    //         this.element.innerHTML += '<p>'+info+'</p>';
    //         this.element.scrollTop = 100000;
    //     }
    // }
    //qqconsole.init();
    //animationChain.init();
    this.isArray = isArray;
    this.animationChain = animationChain;
    //this.console = console;
});

Jx().$package("qqlogo.period",function(J) {
    var $D = J.dom,
    	$  = $D.mini,
        $E = J.event,
        $A = J.array,
        $U = qqlogo.util,
        isPeriod = false;

    /**
     * �ֽ⶯�������е���Ļ��ʾ
     * @type {Object}
     */
    var PeriodInfo = {
        init : function(){
            this.el = $('.periodInfo')[0];

            /**
             * ʹ��FlipContainer(@CSS3Module)������Ϣ��ʾ
             */
            var _this = this;
            (function($){
                $('.periodInfo .container').flip({
                    flipfront: $('.front.flipInfo'),
                    flipbackface: $('.back.flipInfo'),
                    duration: .5,
                    timefunction:'linear',
                    perspective:'800px',
                    perspectiveOrigin:'50% 50%',
                    border: 'none',
                    'box-shadow': 'none',
                    dir: 'x',
                    flipGoEnd: function(event){
                        console.log(this, 'Now, it\'s backface.');
                    },
                    flipBackEnd: function(event){
                        console.log(this, 'Now, we are back!');
                    }
                });
            })(jQuery);
        },

        show : function(text){
            text = text || 'Preparing'
            this.changeText(text);
            $D.addClass(this.el, 'period');
        }, 

        hide : function(){
            $D.removeClass(this.el, 'period');
        },

        changeText: function(text){
            (function($){
                var front = $('.front.flipInfo');
                var back = $('.back.flipInfo');
                var flip = $('.container'); 
                if(flip.getFlipState() == true){
                    front.html(text);
                }else{
                    back.html(text);
                }
                flip.flipToggle();
            })(jQuery);
        }
    }

    /**
     * ������
     */
    var Hello = {
        init: function(){
            this.el = $('.hello')[0];
            $E.on(this.el, 'click', this.onClick);
        },

        show: function(text){
            var text = text || "Hello, World! I'm from TAT!";
            this.changeText(text);
            $D.addClass(this.el, 'period');
        },

        changeText: function(text){
            this.el.innerHTML = text;
        }, 

        hide : function(){
            $D.removeClass(this.el, 'period');
        },

        onClick: function(event){
            window.location.reload();
        }
    }

    /**
     * qq logo �ĸ������ģ��(module)
     */
    var head, 
        body, 
        hand, 
        foot, 
        leftEye, 
        rightEye, 
        mouthTop,
        mouthBottom,
        lips,
        fix,
        inner,
        outter,
        leftHandTop,
        leftHandBottom,
        rightHandTop,
        rightHandBottom,
        scarf,
        scarfEnd,
        scarfShadow,
        scarfShadowRight,
        scarfEndShadow,
        leftToe,
        rightToe,
        leftFootTop,
        leftFootBottom,
        rightFootTop,
        rightFootBottom,

        mLeftHandTopContainer,
        mLeftHandBottomContainer,
        mRightHandTopContainer,
        mRightHandBottomContainer;

    /**
     * module container
     * ���ڶ�λ��Ԫ���и�
     */
    var mouthTopContainer,
        mouthBottomContainer,
        lipsContainer,
        leftHandTopContainer,
        leftHandBottomContainer,
        rightHandTopContainer,
        rightHandBottomContainer,
        leftFootTopWrapper,
        leftFootBottomWrapper,
        rightFootTopWrapper,
        rightFootBottomWrapper;

    /**
     * ��module����ͳһ�Ĺ���
     * @type {Object}
     */
    var Modules = {
        modules: [],
        baseLeft: 0,
        baseRight: 0,
        init : function(){

        },

        addModule:function(module){
            this.modules.push(module);
            return this;
        },

        /**
         * ����ģʽ�л�
         * @param  {Boolean} isRemove true��ʾ���붯��ģʽ��false��ʾ�˳�
         * @return 
         */
        period: function(isRemove){
            var _this = this;
            $A.forEach(this.modules, function(item){
                item.period(isRemove);
            })
        },

        /**
         * ��ȡ�Ѿ����뵽����ģʽ��module�ĸ���
         * @return {[number]}
         */
        getPeriodCount: function(){
            var count = 0;
            $A.forEach(this.modules, function(item){
                if(this.state == 1){
                    count ++ ;
                }
            });
            return count;
        }, 

        reset : function(){
            this.modules = [];
        }
    }

    /**
     * ͨ��moduleͳһ��������
     * @param  {dom element} el   �������domԪ��
     * @param  {number} left position left
     * @param  {number} top  position top
     * @return 
     */
    function module(el ,left, top){
        this.left = left || 0;
        this.top = top || 0;
        this.el = el;
        this.state = 0;  //state 0 stands for no period

        this.updatePosition = function(left, top){
            this.el.style.left = left + 'px';
            this.el.style.top = top + 'px';
        }

        this.period = function(isRemove){
            isRemove = isRemove || false;
            _periodItem(this.el, isRemove);
            if(isRemove){
                this.state = 1;
            }
        }

        this.start = function(aniStep){
            $D.addClass(this.el, aniStep);
        }

        this.back = function(aniStep){
            $D.removeClass(this.el, aniStep);
        }
    }

    this.resetContainer = function(){
        mouthBottomContainer.style.overflow = 'visible';
        mouthTopContainer.style.overflow = 'visible';
        rightHandTopContainer.style.overflow = "visible";
        rightHandBottomContainer.style.overflow = "visible";
        leftFootTopWrapper.style.overflow = "visible";
        leftFootBottomWrapper.style.overflow = "visible";
        rightFootTopWrapper.style.overflow = "visible";
        rightFootBottomWrapper.style.overflow = "visible";
    }

    /**
     * ��ʼ��Stage
     * 1�����������л�
     * 2������������ʼ��������overflowΪvisible
     * 3����ʼ��module��Modules
     * @return {[type]} [description]
     */
    var initPeriodStage = function(){
        PeriodInfo.show('˫����ʼ����, :)')
        _periodItem($('body'));
        _periodItem($('header'));
        _periodItem($('.copyright'));

        mouthTopContainer = $(".mouthTopContainer")[0];
        mouthBottomContainer = $(".mouthBottomContainer")[0];
        lipsContainer = $('.lipsContainer')[0];
        leftHandTopContainer = $('.leftHandTopContainer')[0];
        leftHandBottomContainer = $('.leftHandBottomContainer')[0];
        rightHandTopContainer = $('.rightHandTopContainer')[0];
        rightHandBottomContainer = $('.rightHandBottomContainer')[0];
        leftFootTopWrapper = $('.leftFootTopWrapper')[0];
        leftFootBottomWrapper = $('.leftFootBottomWrapper')[0];
        rightFootTopWrapper = $('.rightFootTopWrapper')[0];
        rightFootBottomWrapper = $('.rightFootBottomWrapper')[0];


        mouthTopContainer.style.overflow = "visible";
        mouthBottomContainer.style.overflow = "visible";
        lipsContainer.style.overflow = "visible";
        leftHandTopContainer.style.overflow = "visible";
        leftHandBottomContainer.style.overflow = "visible";
        rightHandTopContainer.style.overflow = "visible";
        rightHandBottomContainer.style.overflow = "visible";
        leftFootTopWrapper.style.overflow = "visible";
        leftFootBottomWrapper.style.overflow = "visible";
        rightFootTopWrapper.style.overflow = "visible";
        rightFootBottomWrapper.style.overflow = "visible";

        head = new module($D.id('head'));
        body = new module($D.id('body'));
        hand = new module($D.id('hand'));
        foot = new module($D.id('foot'));

        leftEye = new module($('.left.eye')[0]);
        rightEye = new module($('.right.eye')[0]);
        mouthTop = new module($('.mouthTop')[0]);
        mouthBottom = new module($('.mouthBottom')[0]);
        lips = new module($('.lips')[0]);
        lipShadowLeft = new module($('.lipShadow.left')[0]);
        lipShadowRight = new module($('.lipShadow.right')[0]);
        scarf = new module($('.scarf')[0]);
        scarfEnd = new module($('.scarfEnd')[0]);
        scarfShadow = new module($('.scarfShadow')[0]);
        scarfShadowRight = new module($('.scarfShadowRight')[0]);
        scarfEndShadow = new module($('.scarfEndShadow')[0]);
        inner = new module($('.inner')[0]);
        outter = new module($('.outter')[0]);
        leftHandTop = new module($('.leftHandTop')[0]);
        leftHandBottom = new module($('.leftHandBottom')[0]);
        rightHandTop = new module($('.rightHandTop')[0]);
        rightHandBottom = new module($('.rightHandBottom')[0]);
        leftToe = new module($('.left.toe')[0]);
        rightToe = new module($('.right.toe')[0]);
        leftFootTop = new module($('.leftFootTop')[0]);
        leftFootBottom = new module($('.leftFootBottom')[0]);
        rightFootTop = new module($('.rightFootTop')[0]);
        rightFootBottom = new module($('.rightFootBottom')[0]);

        mLeftHandTopContainer = new module(leftHandTopContainer);
        mLeftHandBottomContainer = new module(leftHandBottomContainer);
        mRightHandTopContainer = new module(rightHandTopContainer);
        mRightHandBottomContainer = new module(rightHandBottomContainer);

        Modules.addModule(head)
            .addModule(body)
            .addModule(hand)
            .addModule(foot)
            .addModule(leftEye)
            .addModule(rightEye)
            .addModule(mouthTop)
            .addModule(mouthBottom)
            .addModule(lips)
            .addModule(lipShadowLeft)
            .addModule(lipShadowRight)
            .addModule(scarf)
            .addModule(scarfEnd)
            .addModule(scarfShadow)
            .addModule(scarfShadowRight)
            .addModule(scarfEndShadow)
            .addModule(inner)
            .addModule(outter)
            .addModule(leftHandTop)
            .addModule(leftHandBottom)
            .addModule(rightHandTop)
            .addModule(rightHandBottom)
            .addModule(leftToe)
            .addModule(rightToe)
            .addModule(leftFootTop)
            .addModule(leftFootBottom)
            .addModule(rightFootTop)
            .addModule(rightFootBottom);

        Modules.addModule(mLeftHandBottomContainer)
               .addModule(mLeftHandTopContainer)
               .addModule(mRightHandTopContainer)
               .addModule(mRightHandBottomContainer);
    }

    var endPeriodStage = function(){
    	_periodItem($('body'), true);
    	_periodItem($('header'), true);
        _periodItem($('.copyright'), true);
    }

    var _initPeriodAnimation = function(){
        Modules.period();
    }

    /**
     * ��ʼ����Ķ���
     * �������module���Զ��嶯�����Զ��嶯����ϸ��
     * ������qq-logo-css3-period.css�ļ���
     */
    var _startPeriodAnimation = function(){ 
        this.isPeriodAnimationPlay = true;
        PeriodInfo.changeText('Let\'s Go');
        /**
         * Head part animation
         */
        $U.animationChain.add(head, 'animation1')
                         .add(head, 'animation2',0,function(){PeriodInfo.changeText('Eye Begin, Step 1');})
                         .add(leftEye, 'animation1',0,function(){PeriodInfo.changeText('Step 2')})  
                         .add(leftEye, 'animation2',0,function(){PeriodInfo.changeText('Step 3')})
                         .add(leftEye, 'animation3',0,function(){PeriodInfo.changeText('Step 4')})  
                         .add(rightEye, 'animation1',0,function(){PeriodInfo.changeText('Step 5')})
                         .add(rightEye, 'animation2',0,function(){PeriodInfo.changeText('Step 6')})
                         .add(rightEye, 'animation3',0, function(){PeriodInfo.changeText('Mouth Begin')})
                         .add(mouthTop, 'animation1')
                         .add(mouthTop, 'animation2')
                         .add(mouthTop, 'animation3', 500)
                         .add(mouthBottom, 'animation1')
                         .add(mouthBottom, 'animation2')
                         .add(mouthBottom, 'animation3',500, function(isBack){
                            isBack = isBack || false;
                            if(!isBack){
                                mouthBottomContainer.style.overflow = 'hidden';
                                mouthTopContainer.style.overflow = 'hidden';
                                PeriodInfo.changeText('Lips Begin');
                            }else{
                                mouthBottomContainer.style.overflow = 'visible';
                                mouthTopContainer.style.overflow = 'visible';
                                PeriodInfo.changeText('');
                            }
                            
                         })
                         .add(lips, 'animation1')
                         .add(lips, 'animation2')
                         .add(lips, 'animation3', 300, function(){
                            PeriodInfo.changeText('Lips fix');
                         })
                         .add(lipShadowLeft, 'animation1')
                         .add(lipShadowLeft, 'animation2', 100)
                         .add(lipShadowLeft, 'animation3')
                         .add(lipShadowRight, 'animation1', 100, function(){
                            PeriodInfo.changeText('Head Complete! Go Body');
                         });

        /**
         * body part animation
         */
        $U.animationChain.add(body, 'animation1')
                         .add(scarf, 'animation1', 0, function(){
                            PeriodInfo.changeText('Building...');
                         })
                         .add(outter, 'animation1')
                         .add(inner, 'animation1')
                         .add(scarfEnd, 'animation1')
                         .add(scarfEnd, 'animation2')
                         .add(scarf, 'animation2',0, function(){
                            PeriodInfo.changeText('Paint the body')
                         })
                         .add(outter, 'animation2')
                         .add(inner, 'animation2')
                         .add(scarfEnd, 'animation3')
                         .add(body, 'animation2',0,function(){
                            PeriodInfo.changeText('Body Complete! Go Hand');
                         });


        /**
         * hand part animation
         */
        $U.animationChain.add(hand, 'animation1',0, function(){PeriodInfo.changeText('Hand')})
                        .add(leftHandTop, 'animation1')
                        .add(leftHandBottom, 'animation1')
                        .add(mLeftHandTopContainer, 'animation1')
                        .add(mLeftHandBottomContainer, 'animation1', 0, function(isBack){
                            leftHandTopContainer.style.overflow = "hidden";
                            leftHandBottomContainer.style.overflow = "hidden";
                        })
                        .add(leftHandTop,'animation2', 500)
                        .add(leftHandBottom, 'animation2', 0, function(){
                            PeriodInfo.changeText('Left hand done');
                        })
                        .add(rightHandTop, 'animation1')
                        .add(rightHandBottom, 'animation1')
                        .add(mRightHandTopContainer, 'animation1')
                        .add(mRightHandBottomContainer, 'animation1', 100, function(isBack){
                            isBack = isBack || false;
                            if(!isBack){
                                rightHandTopContainer.style.overflow = "hidden";
                                rightHandBottomContainer.style.overflow = "hidden";
                            }else{
                                rightHandTopContainer.style.overflow = "visible";
                                rightHandBottomContainer.style.overflow = "visible";
                            }
                            
                        })
                        .add(rightHandTop,'animation2', 500)
                        .add(rightHandBottom, 'animation2', 0,function(){
                            PeriodInfo.changeText('Right Hand Done. Rush to body.');
                        })
                        .add(hand, 'animation2',500,function(){
                            PeriodInfo.changeText('Hand Complete! Go Foot')
                        });

        /**
         * foot part animation
         */
        $U.animationChain.add(foot, 'animation1', 500, function(){
                                PeriodInfo.changeText('Four Sub Modules of foot');
                            })
                         .add(leftFootTop, 'animation1')
                         .add(leftFootBottom, 'animation1')
                         .add(rightFootBottom, 'animation1')
                         .add(rightFootTop, 'animation1',200, function(){
                            PeriodInfo.changeText('Combine');
                         })
                         .add(leftFootTop, 'animation2')
                         .add(leftFootBottom, 'animation2')
                         .add(rightFootTop, 'animation2',0, function(){
                            PeriodInfo.changeText('Cut by Container')
                         })
                         .add(rightFootBottom, 'animation2',200, function(isBack){
                            isBack = isBack || false;
                            if(!isBack){
                                leftFootTopWrapper.style.overflow = "hidden";
                                leftFootBottomWrapper.style.overflow = "hidden";
                                rightFootTopWrapper.style.overflow = "hidden";
                                rightFootBottomWrapper.style.overflow = "hidden";
                                PeriodInfo.changeText('WoW, New shoes, ^_^');
                            }else{
                                leftFootTopWrapper.style.overflow = "visible";
                                leftFootBottomWrapper.style.overflow = "visible";
                                rightFootTopWrapper.style.overflow = "visible";
                                rightFootBottomWrapper.style.overflow = "visible";
                                PeriodInfo.changeText('');
                            }
                         })
                         .add(foot, 'animation2', 500, function(){
                            PeriodInfo.changeText('Foot Done. Go Shadow Fix')
                            //PeriodInfo.changeText('Mission Complete!')
                         });

        /**
         * shadow fix animation
         */
        $U.animationChain.add(scarfShadow, 'animation1', 200, function(){
                                PeriodInfo.changeText('Shadow Fix Working');
                            })
                         .add(scarfShadowRight, 'animation1')
                         .add(scarfEndShadow, 'animation1')
                         .add(leftToe,'animation1')
                         .add(rightToe, 'animation1', 0,function(){
                            PeriodInfo.changeText('Mission Complete!');
                            Hello.show();
                            Eye.blink();
                            J.console.warn('animation done.');
                            setTimeout(function(){
                                PeriodInfo.hide();
                            }, 500);
                         });

        ;$U.animationChain.start();
    }

    var _endPeriodAnimation = function(){
    	Modules.period(true);
    }

    function _periodItem(item, bRemove){
        bRemove = bRemove || false;
        if(!$U.isArray(item)){
            item = [item];
        }
        for( var i in item ){
            bRemove ? $D.removeClass(item[i], 'period') : $D.addClass(item[i], 'period');
        }
    }

    var onDbClick = function(e){
    	if(!isPeriod){
    		isPeriod = true;
    		initPeriodStage(); 
    		_initPeriodAnimation();  
            
    	}else{
            if(qqlogo.period.isPeriodAnimationPlay){
                return;
            }
    		isPeriod = false;
            PeriodInfo.show();
            $U.animationChain.init();
            setTimeout(function(){_startPeriodAnimation();},1000);
    	}
    }

    var init = function(){
    	$E.addEventListener($D.mini('body')[0], 'dblclick', onDbClick);
        $E.on(document, 'keydown', function(){
            var JxConsole = $D.id('JxConsole');
            if(JxConsole){
                JxConsole.style.top = '';
                JxConsole.style.left = '';
            }
        });
        var up = $D.mini('.up')[0];
        $E.on(up, 'click', function(){
            Introduce.hide();
        })
        PeriodInfo.init();
        Hello.init();
        Introduce.init();
        New.init();
        Eye.init();
    }

    /**
     * �±�ǩ���л����½��ܡ�ʹ�ñ��ش洢����¼�Ƿ��Ѿ��鿴
     * @type {Object}
     */
    var New = {
        init: function(){
                this.el = $('.new')[0];
                $E.on(this.el, 'click', function(){
                    if(Introduce.isShow()){
                        Introduce.hide();
                    }else{
                        Introduce.show();                        
                    }
                    New.addRecord();
                });
                if(!this.isRecord()){
                    setTimeout(function(){Introduce.show();}, 500);
                }
        },
        addRecord: function(){
            J.localStorage.setItem('new', '1');
        },
        isRecord: function(){
            if(J.localStorage.getItem('new') && J.localStorage.getItem('new') == 1){
                return true;
            }
            return false;
        }
    }

    /**
     * �°汾�ĸ��½���
     * @type {Object}
     */
    var Introduce = {
        init : function(){
            var _this = this;
            $E.on(document, 'keyup', function(event){
                if(event.keyCode == 78){ //N
                    _this.isShow() ? _this.hide() : _this.show();
                }
            });
            this.el = $('.introduce')[0];
            this.goel = $('.go')[0];
            //30s֮������λ�ڶ�������ʾ
            setTimeout(function(){
                _this.goel.style.top = '-110px';
            },30000);
        },
        show: function(){
            $D.addClass(this.el, 'show');
        },
        hide: function(){
            $D.removeClass(this.el, 'show');
        },
        isShow: function(){
            return $D.hasClass(this.el, 'show');
        }
    }

    /**
     * Eye Blink Manager
     */
    var Eye = {
        init: function(){
            this.eyelipLeftTop = $('.eyelipLeftTop')[0];
            this.eyelipLeftBottom = $('.eyelipLeftBottom')[0];
            this.eyelipRightTop = $('.eyelipRightTop')[0];
            this.eyelipRightBottom = $('.eyelipRightBottom')[0];
            this.innerLeftEye = $('.innerLeftEye')[0];
            this.modules = [];
            this.modules.push(this.eyelipLeftTop);
            this.modules.push(this.eyelipLeftBottom);
            this.modules.push(this.eyelipRightTop);
            this.modules.push(this.eyelipRightBottom);
            this.modules.push(this.innerLeftEye);
        },

        blink: function(){
            $A.forEach(this.modules, function(item){
                $D.addClass(item, 'blink');
            });
        },

        removeBlink: function(){
            $A.forEach(this.modules, function(item){
                $D.removeClass(item, 'blink');
            });
        }
    }

    this.Introduce = Introduce;
    this.PeriodInfo = PeriodInfo;
    this.Hello = Hello;

    this.init = init;
    this.Eye = Eye;

    $E.onDomReady(init);
});