/*
 * Copyright (c) 2013, Personal
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*jslint nomen: true, unparam: true */
/*global define, window */

(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // Register as an anonymous AMD module:
        define(['jquery', './jquery.fileupload-ui'], factory);
    } else {
        // Browser globals:
        factory(window.jQuery);
    }
}(function ($) {
    'use strict';

    $.widget('blueimp.fileupload', $.blueimp.fileupload, {

        options: {
            progress: function (e, data) {
                if (data.context) {
                    data.context.find('.progress').progressbar(
                        'option',
                        'value',
                        parseInt(data.loaded / data.total * 100, 10)
                    );
                }
            },
            progressall: function (e, data) {
                var $this = $(this);
                $this.find('.fileupload-progress')
                    .find('.progress').progressbar(
                        'option',
                        'value',
                        parseInt(data.loaded / data.total * 100, 10)
                    ).end()
                    .find('.progress-extended').each(function () {
                        $(this).html(
                            ($this.data('blueimp-fileupload') ||
                                    $this.data('fileupload'))
                                ._renderExtendedProgress(data)
                        );
                    });
            }
        },

        _renderUpload: function (func, files) {
            var node = this._super(func, files),
                showIconText = $(window).width() > 480;
            node.find('.progress').empty().progressbar();
            node.find('.start').button({
                icons: {primary: 'ui-icon-circle-arrow-e'},
                text: showIconText
            });
            node.find('.cancel').button({
                icons: {primary: 'ui-icon-cancel'},
                text: showIconText
            });
            if (node.hasClass('fade')) {
                node.hide();
            }
            return node;
        },

        _renderDownload: function (func, files) {
            var node = this._super(func, files),
                showIconText = $(window).width() > 480;
            node.find('.delete').button({
                icons: {primary: 'ui-icon-trash'},
                text: showIconText
            });
            if (node.hasClass('fade')) {
                node.hide();
            }
            return node;
        },

        _transition: function (node) {
            var deferred = $.Deferred();
            if (node.hasClass('fade')) {
                node.fadeToggle(
                    this.options.transitionDuration,
                    this.options.transitionEasing,
                    function () {
                        deferred.resolveWith(node);
                    }
                );
            } else {
                deferred.resolveWith(node);
            }
            return deferred;
        },

        _create: function () {
            this._super();
            this.element
                .find('.fileupload-buttonbar')
                .find('.fileinput-button').each(function () {
                    var input = $(this).find('input:file').detach();
                    $(this)
                        .button({icons: {primary: 'ui-icon-plusthick'}})
                        .append(input);
                })
                .end().find('.start')
                .button({icons: {primary: 'ui-icon-circle-arrow-e'}})
                .end().find('.cancel')
                .button({icons: {primary: 'ui-icon-cancel'}})
                .end().find('.delete')
                .button({icons: {primary: 'ui-icon-trash'}})
                .end().find('.progress').progressbar();
        },

        _destroy: function () {
            this.element
                .find('.fileupload-buttonbar')
                .find('.fileinput-button').each(function () {
                    var input = $(this).find('input:file').detach();
                    $(this)
                        .button('destroy')
                        .append(input);
                })
                .end().find('.start')
                .button('destroy')
                .end().find('.cancel')
                .button('destroy')
                .end().find('.delete')
                .button('destroy')
                .end().find('.progress').progressbar('destroy');
            this._super();
        }

    });

}));
