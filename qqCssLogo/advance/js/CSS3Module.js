/**
 * css3Ч����ģ�黯
 * ��������jQuery����ķ�ʽ����ʹ��
 *
 * �ļ�������
 * css-----------CSS3Module.css
 * js------------jquery.latest.min.js
 *         |
 *         ------jquery.tmpl.min.js
 *         |
 *         ------CSS3Module.js 
 *
 * @author aishenhu
 * @date 2012.09.28
 */

;
(function($){
	/**
	 * CSS3Ч�������HTML����ģ�壬����HTML�ṹ�������Ӧ��class, id
	 * Ϊ�˷�ֹ��ͻ����������'ismart-'��Ϊǰ׺
	 * @type {Object}
	 */
	var CSS3Template = {
		flipTemplate: '<div class="ismart-flipcontainer">\
					   		<div class="ismart-flipfront">\
					   		</div>\
					   		<div class="ismart-flipbackface">\
					   		</div>\
					   </div>'
	}

	/**
	 * ��Ԫ�ص�һ�����Խ���ǰ׺��ֵ
	 * @param  {jQ dom�ڵ�} element jQueryѡ����
	 * @param  {[type]} prop    [description]
	 * @param  {[type]} value   [description]
	 * @return {[type]}         [description]
	 */
	function prefixedPropertySign(element, prop, value){
		var pref = ['', '-webkit-', '-moz-', '-o-', '-ms-'];
		for(var p in pref){
			element.css(pref[p] + prop, value);
		}
	}

	/**
	 * CSS3D˫���л����
	 * �����л��ķ���:Ϊ.ismart-flipcontainer�л���flipped��
	 * ���flipped�࣬��������ʾbackface����֮��ʾfront������ֱ��
	 * ��Ԫ�ص�����в�����Ҳ��ʹ��ʹ���ṩ��flipGo��flipBack��flipToggle����
	 * @type {Object}
	 *
	 * !!!��ʼ������������ʹ��init��jQuery�����ͻ
	 * ��ҳ���н��jQueryʹ�÷���:
	 * @example
	 * 	      $(document).ready(function(){
	 *			$('.container').flip({
	 *				flipfront: $('#flipfront'),
	 *				flipbackface: '<div id = "flipbackface">\
	 *									<img src="backface.png"/>\
	 *							   </div>',
	 *				duration: .5,
	 *				timefunction:'linear',
	 *				perspective:'800px',
	 *				perspectiveOrigin:'50% 50%',
	 *				flipGoEnd: function(event){
	 *					console.log(this, 'Now, it\'s backface.');
	 *				},
	 *				flipBackEnd: function(event){
	 *					console.log(this, 'Now, we are back!');
	 *				}
	 *			}).click(function(){
	 *				$(this).flipToggle();
	 *			});
	 *		});
	 */
	var FlipContainer = {
		_dom:'',
		_init: function(opt){
			$.template("flipTemplate", CSS3Template.flipTemplate);
			var flipdom = $.tmpl("flipTemplate");
			var container = $(FlipContainer._dom);
			container.append(flipdom);
			var width = opt.width || container.width();
			var height = opt.height || container.height();

			var flipcontainer = container.find('.ismart-flipcontainer');
			var flipfront = container.find('.ismart-flipfront');
			var flipbackface = container.find('.ismart-flipbackface');

			/**
			 * �ֱ��front������backface������ע�����ݣ���opt��û��ָ��
			 * ��ʹ��Ĭ���ı�
			 * �����������е�ԭ�����ݽ������
			 * @return {[type]} [description]
			 */
			var flipfrontContent = (function(){
				flipfront.empty().append(opt.flipfront);
				return opt.flipfront;
			})() || (function(){
				flipfront.empty().append('<p>Hello, world!</p>');
			})();
			var flipbackfaceContent = (function(){
				flipbackface.empty().append(opt.flipbackface);
				return opt.flipbackface;
			})() || (function(){
				flipbackface.empty().append('<p>I\'m the backface, :)</p>');
			})();

			/**
			 * �ֱ��Զ����ʱ������ʱ�亯����͸��perspective, perspectiveOrigin(-_-||)
			 * 
			 */
			if(opt.duration){
				prefixedPropertySign(flipcontainer.find('.ismart-flipfront,.ismart-flipbackface'),
					'transition-duration', opt.duration+'s');
			}

			/**
			 * ������ʱ�亯��
			 * linear|ease|ease-in|ease-out|ease-in-out|cubic-bezier(n,n,n,n);
			 */
			if(opt.timefunction){
				prefixedPropertySign(flipcontainer.find('.ismart-flipfront,.ismart-flipbackface'),
					'transition-timing-function', opt.timefunction);
			}

			if(opt.perspective){
				prefixedPropertySign(flipcontainer, 'perspective', opt.perspective);
			}

			/**
			 * perspective-origin: x-axis y-axis;
			 * --------------------------------------------------
			 *	Defining where the view is placed at the x-axis
			 *	Possible values:
			 *	left
			 *	center
			 *	right
			 *	length
			 *	%
			 *	Default value: 50%
			 *	---------------------------------------------------
			 *	Defining where the view is placed at the y-axis
			 *	Possible values:
			 *	top
			 *	center
			 *	bottom
			 *	length
			 *	%
			 *	Default value: 50%
			 *	-----------------------------------------------------
			 */
			if(opt.perspectiveOrigin){
				prefixedPropertySign(flipcontainer, 'perspective-origin', opt.perspectiveOrigin);
			}

			/**
			 * �󶨷�ת�����¼��Ĵ��������ص������е�this�������óɶ����ġ�����Ԫ�ء�
			 * ÿ���Ƴ��������flipped�����ᴥ��transition������֮�󽫻����transitionend�¼�
			 * Ӧ�õ�FlipContainer����У���Ҫ��һ���¼��Ĺ��ˣ��ڸ��龰�£�ÿ�����¼�ֻ����Ӧ
			 * һ�Σ����¼����жϵ�������⣩
			 */
			if(opt.flipGoEnd){
				FlipContainer.setFlipGoEnd.call(flipcontainer, opt.flipGoEnd);
			}

			if(opt.flipBackEnd){
				FlipContainer.setFlipBackEnd.call(flipcontainer, opt.flipBackEnd);
			}

			/**
			 * border����
			 */
			if(opt.border){
				flipfront.css('border', opt.border);
				flipbackface.css('border', opt.border);
			}

			if(opt['box-shadow']){
				flipfront.css('box-shadow', opt['box-shadow']);
				flipbackface.css('box-shadow', opt['box-shadow']);
			}

			/**
			 * �趨��x����y����ת
			 * dir: x (y)
			 */
			if(opt.dir){
				var dir = 'flip' + opt.dir.toUpperCase();
				flipcontainer.addClass(dir);
			}
		},
		/**
		 * Make a container flip
		 * @param  {object} opt �Զ������ò���
		 * @return {object}     ���ص�ǰ���󣬱���jQuery����ʽ���ýṹ
		 */
		flip: function(opt){
			FlipContainer._dom = this;
			opt = opt || {};
			FlipContainer._init(opt);
			return this;
		},
		/**
		 * �������ƺ���:��ʾbackface
		 */
		flipGo: function(){
			$(this).find('.ismart-flipcontainer').addClass('flipped');
			return this;
		},
		/**
		 * �������ƺ���:��ʾfront
		 */
		flipBack: function(){
			$(this).find('.ismart-flipcontainer').removeClass('flipped');
			return this;
		},
		/**
		 * �������ƺ���:�л�front��backface����ʾ
		 */
		flipToggle: function(){
			$(this).find('.ismart-flipcontainer').toggleClass('flipped');
			return this;			
		},

		/**
		 * ����front�������
		 */
		setFlipfront: function(front){
			$(this).find('.ismart-flipfront').empty().append(front);
			return this;
		},

		/**
		 * ����backface�������
		 */
		setFlipbackface: function(backface){
			$(this).find('.ismart-flipbackface').empty().append(backface);
			return this;
		},

		/**
		 * �󶨶��������¼�
		 * @param {Function} callback �ص��������ص������е�this����Ϊ.ismart-flipfront
		 */
		setFlipGoEnd: function(callback){
			var goEnd = function(event) {
				if($(this).parent().hasClass('flipped')){
					callback.call(this, event);
				}
			}
			/**
			 * ��transitionend�¼�
			 * @todo ���¼��󶨽���adapter���
			 */
			$(this).find('.ismart-flipfront').bind('webkitTransitionEnd', goEnd)
											 .bind('mozTransitionEnd',goEnd)
											 .bind('oTransitionEnd',goEnd)
											 .bind('msTransitionEnd',goEnd)
											 .bind('transitionend',goEnd);
			return this;
		},
		/**
		 * �󶨶��������¼�
		 * @param {Function} callback �ص��������ص������е�this����Ϊ.ismart-flipbackface
		 */
		setFlipBackEnd: function(callback){
			var goBack = function(event){
				if(!$(this).parent().hasClass('flipped')){
					callback.call(this, event);
				}
			}
			$(this).find('.ismart-flipbackface').bind('webkitTransitionEnd', goBack)
												.bind('mozTransitionEnd', goBack)
												.bind('oTransitionEnd', goBack)
												.bind('msTransitionEnd', goBack)
												.bind('transitionend', goBack);
			return this;
		},

		getFlipState: function(){
			return $(this).find('.ismart-flipcontainer').hasClass('flipped');
		}
	}
	$.fn.extend(FlipContainer);
})(window.jQuery);