(function (jQuery, undefined) {
    var oldManip = jQuery.fn.domManip, tmplItmAtt = "_tmplitem", htmlExpr = /^[^<]*(<[\w\W]+>)[^>]*$|\{\{\! /,
        newTmplItems = {}, wrappedItems = {}, appendToTmplItems, topTmplItem = {key: 0, data: {}}, itemKey = 0,
        cloneIndex = 0, stack = [];

    function newTmplItem(options, parentItem, fn, data) {
        // Returns a template item data structure for a new rendered instance of a template (a 'template item').
        // The content field is a hierarchical array of strings and nested items (to be
        // removed and replaced by nodes field of dom elements, once inserted in DOM).
        var newItem = {
            data: data || (parentItem ? parentItem.data : {}),
            _wrap: parentItem ? parentItem._wrap : null,
            tmpl: null,
            parent: parentItem || null,
            nodes: [],
            calls: tiCalls,
            nest: tiNest,
            wrap: tiWrap,
            html: tiHtml,
            update: tiUpdate
        };
        if (options) {
            jQuery.extend(newItem, options, {nodes: [], parent: parentItem});
        }
        if (fn) {
            // Build the hierarchical content to be used during insertion into DOM
            newItem.tmpl = fn;
            newItem._ctnt = newItem._ctnt || newItem.tmpl(jQuery, newItem);
            newItem.key = ++itemKey;
            // Keep track of new template item, until it is stored as jQuery Data on DOM element
            (stack.length ? wrappedItems : newTmplItems)[itemKey] = newItem;
        }
        return newItem;
    }

    // Override appendTo etc., in order to provide support for targeting multiple elements. (This code would disappear if integrated in jquery core).
    jQuery.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function (name, original) {
        jQuery.fn[name] = function (selector) {
            var ret = [], insert = jQuery(selector), elems, i, l, tmplItems,
                parent = this.length === 1 && this[0].parentNode;

            appendToTmplItems = newTmplItems || {};
            if (parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1) {
                insert[original](this[0]);
                ret = this;
            } else {
                for (i = 0, l = insert.length; i < l; i++) {
                    cloneIndex = i;
                    elems = (i > 0 ? this.clone(true) : this).get();
                    jQuery.fn[original].apply(jQuery(insert[i]), elems);
                    ret = ret.concat(elems);
                }
                cloneIndex = 0;
                ret = this.pushStack(ret, name, insert.selector);
            }
            tmplItems = appendToTmplItems;
            appendToTmplItems = null;
            jQuery.tmpl.complete(tmplItems);
            return ret;
        };
    });

    jQuery.fn.extend({
        // Use first wrapped element as template markup.
        // Return wrapped set of template items, obtained by rendering template against data.
        tmpl: function (data, options, parentItem) {
            return jQuery.tmpl(this[0], data, options, parentItem);
        },

        // Find which rendered template item the first wrapped DOM element belongs to
        tmplItem: function () {
            return jQuery.tmplItem(this[0]);
        },

        // Consider the first wrapped element as a template declaration, and get the compiled template or store it as a named template.
        template: function (name) {
            return jQuery.template(name, this[0]);
        },

        domManip: function (args, table, callback, options) {
            // This appears to be a bug in the appendTo, etc. implementation
            // it should be doing .call() instead of .apply(). See #6227
            if (args[0] && args[0].nodeType) {
                var dmArgs = jQuery.makeArray(arguments), argsLength = args.length, i = 0, tmplItem;
                while (i < argsLength && !(tmplItem = jQuery.data(args[i++], "tmplItem"))) {
                }
                if (argsLength > 1) {
                    dmArgs[0] = [jQuery.makeArray(args)];
                }
                if (tmplItem && cloneIndex) {
                    dmArgs[2] = function (fragClone) {
                        // Handler called by oldManip when rendered template has been inserted into DOM.
                        jQuery.tmpl.afterManip(this, fragClone, callback);
                    };
                }
                oldManip.apply(this, dmArgs);
            } else {
                oldManip.apply(this, arguments);
            }
            cloneIndex = 0;
            if (!appendToTmplItems) {
                jQuery.tmpl.complete(newTmplItems);
            }
            return this;
        }
    });

    jQuery.extend({
        // Return wrapped set of template items, obtained by rendering template against data.
        tmpl: function (tmpl, data, options, parentItem) {
            var ret, topLevel = !parentItem;
            if (topLevel) {
                // This is a top-level tmpl call (not from a nested template using {{tmpl}})
                parentItem = topTmplItem;
                tmpl = jQuery.template[tmpl] || jQuery.template(null, tmpl);
                wrappedItems = {}; // Any wrapped items will be rebuilt, since this is top level
            } else if (!tmpl) {
                // The template item is already associated with DOM - this is a refresh.
                // Re-evaluate rendered template for the parentItem
                tmpl = parentItem.tmpl;
                newTmplItems[parentItem.key] = parentItem;
                parentItem.nodes = [];
                if (parentItem.wrapped) {
                    updateWrapped(parentItem, parentItem.wrapped);
                }
                // Rebuild, without creating a new template item
                return jQuery(build(parentItem, null, parentItem.tmpl(jQuery, parentItem)));
            }
            if (!tmpl) {
                return []; // Could throw...
            }
            if (typeof data === "function") {
                data = data.call(parentItem || {});
            }
            if (options && options.wrapped) {
                updateWrapped(options, options.wrapped);
            }
            ret = jQuery.isArray(data) ?
                jQuery.map(data, function (dataItem) {
                    return dataItem ? newTmplItem(options, parentItem, tmpl, dataItem) : null;
                }) :
                [newTmplItem(options, parentItem, tmpl, data)];
            return topLevel ? jQuery(build(parentItem, null, ret)) : ret;
        },

        // Return rendered template item for an element.
        tmplItem: function (elem) {
            var tmplItem;
            if (elem instanceof jQuery) {
                elem = elem[0];
            }
            while (elem && elem.nodeType === 1 && !(tmplItem = jQuery.data(elem, "tmplItem")) && (elem = elem.parentNode)) {
            }
            return tmplItem || topTmplItem;
        },

        // Set:
        // Use $.template( name, tmpl ) to cache a named template,
        // where tmpl is a template string, a script element or a jQuery instance wrapping a script element, etc.
        // Use $( "selector" ).template( name ) to provide access by name to a script block template declaration.

        // Get:
        // Use $.template( name ) to access a cached template.
        // Also $( selectorToScriptBlock ).template(), or $.template( null, templateString )
        // will return the compiled template, without adding a name reference.
        // If templateString includes at least one HTML tag, $.template( templateString ) is equivalent
        // to $.template( null, templateString )
        template: function (name, tmpl) {
            if (tmpl) {
                // Compile template and associate with name
                if (typeof tmpl === "string") {
                    // This is an HTML string being passed directly in.
                    tmpl = buildTmplFn(tmpl)
                } else if (tmpl instanceof jQuery) {
                    tmpl = tmpl[0] || {};
                }
                if (tmpl.nodeType) {
                    // If this is a template block, use cached copy, or generate tmpl function and cache.
                    tmpl = jQuery.data(tmpl, "tmpl") || jQuery.data(tmpl, "tmpl", buildTmplFn(tmpl.innerHTML));
                }
                return typeof name === "string" ? (jQuery.template[name] = tmpl) : tmpl;
            }
            // Return named compiled template
            return name ? (typeof name !== "string" ? jQuery.template(null, name) :
                (jQuery.template[name] ||
                    // If not in map, treat as a selector. (If integrated with core, use quickExpr.exec) 
                    jQuery.template(null, htmlExpr.test(name) ? name : jQuery(name)))) : null;
        },

        encode: function (text) {
            // Do HTML encoding replacing < > & and ' and " by corresponding entities.
            return ("" + text).split("<").join("&lt;").split(">").join("&gt;").split('"').join("&#34;").split("'").join("&#39;");
        }
    });

    jQuery.extend(jQuery.tmpl, {
        tag: {
            "tmpl": {
                _default: {$2: "null"},
                open: "if($notnull_1){_=_.concat($item.nest($1,$2));}"
                // tmpl target parameter can be of type function, so use $1, not $1a (so not auto detection of functions)
                // This means that {{tmpl foo}} treats foo as a template (which IS a function). 
                // Explicit parens can be used if foo is a function that returns a template: {{tmpl foo()}}.
            },
            "wrap": {
                _default: {$2: "null"},
                open: "$item.calls(_,$1,$2);_=[];",
                close: "call=$item.calls();_=call._.concat($item.wrap(call,_));"
            },
            "each": {
                _default: {$2: "$index, $value"},
                open: "if($notnull_1){$.each($1a,function($2){with(this){",
                close: "}});}"
            },
            "if": {
                open: "if(($notnull_1) && $1a){",
                close: "}"
            },
            "else": {
                _default: {$1: "true"},
                open: "}else if(($notnull_1) && $1a){"
            },
            "html": {
                // Unecoded expression evaluation. 
                open: "if($notnull_1){_.push($1a);}"
            },
            "=": {
                // Encoded expression evaluation. Abbreviated form is ${}.
                _default: {$1: "$data"},
                open: "if($notnull_1){_.push($.encode($1a));}"
            },
            "!": {
                // Comment tag. Skipped by parser
                open: ""
            }
        },

        // This stub can be overridden, e.g. in jquery.tmplPlus for providing rendered events
        complete: function (items) {
            newTmplItems = {};
        },

        // Call this from code which overrides domManip, or equivalent
        // Manage cloning/storing template items etc.
        afterManip: function afterManip(elem, fragClone, callback) {
            // Provides cloned fragment ready for fixup prior to and after insertion into DOM
            var content = fragClone.nodeType === 11 ?
                jQuery.makeArray(fragClone.childNodes) :
                fragClone.nodeType === 1 ? [fragClone] : [];

            // Return fragment to original caller (e.g. append) for DOM insertion
            callback.call(elem, fragClone);

            // Fragment has been inserted:- Add inserted nodes to tmplItem data structure. Replace inserted element annotations by jQuery.data.
            storeTmplItems(content);
            cloneIndex++;
        }
    });

    //========================== Private helper functions, used by code above ==========================

    function build(tmplItem, nested, content) {
        // Convert hierarchical content into flat string array 
        // and finally return array of fragments ready for DOM insertion
        var frag, ret = content ? jQuery.map(content, function (item) {
                return (typeof item === "string") ?
                    // Insert template item annotations, to be converted to jQuery.data( "tmplItem" ) when elems are inserted into DOM.
                    (tmplItem.key ? item.replace(/(<\w+)(?=[\s>])(?![^>]*_tmplitem)([^>]*)/g, "$1 " + tmplItmAtt + "=\"" + tmplItem.key + "\" $2") : item) :
                    // This is a child template item. Build nested template.
                    build(item, tmplItem, item._ctnt);
            }) :
            // If content is not defined, insert tmplItem directly. Not a template item. May be a string, or a string array, e.g. from {{html $item.html()}}. 
            tmplItem;
        if (nested) {
            return ret;
        }

        // top-level template
        ret = ret.join("");

        // Support templates which have initial or final text nodes, or consist only of text
        // Also support HTML entities within the HTML markup.
        ret.replace(/^\s*([^<\s][^<]*)?(<[\w\W]+>)([^>]*[^>\s])?\s*$/, function (all, before, middle, after) {
            frag = jQuery(middle).get();

            storeTmplItems(frag);
            if (before) {
                frag = unencode(before).concat(frag);
            }
            if (after) {
                frag = frag.concat(unencode(after));
            }
        });
        return frag ? frag : unencode(ret);
    }

    function unencode(text) {
        // Use createElement, since createTextNode will not render HTML entities correctly
        var el = document.createElement("div");
        el.innerHTML = text;
        return jQuery.makeArray(el.childNodes);
    }

    // Generate a reusable function that will serve to render a template against data
    function buildTmplFn(markup) {
        return new Function("jQuery", "$item",
            "var $=jQuery,call,_=[],$data=$item.data;" +

            // Introduce the data as local variables using with(){}
            "with($data){_.push('" +

            // Convert the template into pure JavaScript
            jQuery.trim(markup)
                .replace(/([\\'])/g, "\\$1")
                .replace(/[\r\t\n]/g, " ")
                .replace(/\$\{([^\}]*)\}/g, "{{= $1}}")
                .replace(/\{\{(\/?)(\w+|.)(?:\(((?:[^\}]|\}(?!\}))*?)?\))?(?:\s+(.*?)?)?(\(((?:[^\}]|\}(?!\}))*?)\))?\s*\}\}/g,
                    function (all, slash, type, fnargs, target, parens, args) {
                        var tag = jQuery.tmpl.tag[type], def, expr, exprAutoFnDetect;
                        if (!tag) {
                            throw "Template command not found: " + type;
                        }
                        def = tag._default || [];
                        if (parens && !/\w$/.test(target)) {
                            target += parens;
                            parens = "";
                        }
                        if (target) {
                            target = unescape(target);
                            args = args ? ("," + unescape(args) + ")") : (parens ? ")" : "");
                            // Support for target being things like a.toLowerCase();
                            // In that case don't call with template item as 'this' pointer. Just evaluate...
                            expr = parens ? (target.indexOf(".") > -1 ? target + parens : ("(" + target + ").call($item" + args)) : target;
                            exprAutoFnDetect = parens ? expr : "(typeof(" + target + ")==='function'?(" + target + ").call($item):(" + target + "))";
                        } else {
                            exprAutoFnDetect = expr = def.$1 || "null";
                        }
                        fnargs = unescape(fnargs);
                        return "');" +
                            tag[slash ? "close" : "open"]
                                .split("$notnull_1").join(target ? "typeof(" + target + ")!=='undefined' && (" + target + ")!=null" : "true")
                                .split("$1a").join(exprAutoFnDetect)
                                .split("$1").join(expr)
                                .split("$2").join(fnargs ?
                                fnargs.replace(/\s*([^\(]+)\s*(\((.*?)\))?/g, function (all, name, parens, params) {
                                    params = params ? ("," + params + ")") : (parens ? ")" : "");
                                    return params ? ("(" + name + ").call($item" + params) : all;
                                })
                                : (def.$2 || "")
                            ) +
                            "_.push('";
                    }) +
            "');}return _;"
        );
    }

    function updateWrapped(options, wrapped) {
        // Build the wrapped content. 
        options._wrap = build(options, true,
            // Suport imperative scenario in which options.wrapped can be set to a selector or an HTML string.
            jQuery.isArray(wrapped) ? wrapped : [htmlExpr.test(wrapped) ? wrapped : jQuery(wrapped).html()]
        ).join("");
    }

    function unescape(args) {
        return args ? args.replace(/\\'/g, "'").replace(/\\\\/g, "\\") : null;
    }

    function outerHtml(elem) {
        var div = document.createElement("div");
        div.appendChild(elem.cloneNode(true));
        return div.innerHTML;
    }

    // Store template items in jQuery.data(), ensuring a unique tmplItem data data structure for each rendered template instance.
    function storeTmplItems(content) {
        var keySuffix = "_" + cloneIndex, elem, elems, newClonedItems = {}, i, l, m;
        for (i = 0, l = content.length; i < l; i++) {
            if ((elem = content[i]).nodeType !== 1) {
                continue;
            }
            elems = elem.getElementsByTagName("*");
            for (m = elems.length - 1; m >= 0; m--) {
                processItemKey(elems[m]);
            }
            processItemKey(elem);
        }

        function processItemKey(el) {
            var pntKey, pntNode = el, pntItem, tmplItem, key;
            // Ensure that each rendered template inserted into the DOM has its own template item,
            if ((key = el.getAttribute(tmplItmAtt))) {
                while (pntNode.parentNode && (pntNode = pntNode.parentNode).nodeType === 1 && !(pntKey = pntNode.getAttribute(tmplItmAtt))) {
                }
                if (pntKey !== key) {
                    // The next ancestor with a _tmplitem expando is on a different key than this one.
                    // So this is a top-level element within this template item
                    // Set pntNode to the key of the parentNode, or to 0 if pntNode.parentNode is null, or pntNode is a fragment.
                    pntNode = pntNode.parentNode ? (pntNode.nodeType === 11 ? 0 : (pntNode.getAttribute(tmplItmAtt) || 0)) : 0;
                    if (!(tmplItem = newTmplItems[key])) {
                        // The item is for wrapped content, and was copied from the temporary parent wrappedItem.
                        tmplItem = wrappedItems[key];
                        tmplItem = newTmplItem(tmplItem, newTmplItems[pntNode] || wrappedItems[pntNode], null, true);
                        tmplItem.key = ++itemKey;
                        newTmplItems[itemKey] = tmplItem;
                    }
                    if (cloneIndex) {
                        cloneTmplItem(key);
                    }
                }
                el.removeAttribute(tmplItmAtt);
            } else if (cloneIndex && (tmplItem = jQuery.data(el, "tmplItem"))) {
                // This was a rendered element, cloned during append or appendTo etc.
                // TmplItem stored in jQuery data has already been cloned in cloneCopyEvent. We must replace it with a fresh cloned tmplItem.
                cloneTmplItem(tmplItem.key);
                newTmplItems[tmplItem.key] = tmplItem;
                pntNode = jQuery.data(el.parentNode, "tmplItem");
                pntNode = pntNode ? pntNode.key : 0;
            }
            if (tmplItem) {
                pntItem = tmplItem;
                // Find the template item of the parent element. 
                // (Using !=, not !==, since pntItem.key is number, and pntNode may be a string)
                while (pntItem && pntItem.key != pntNode) {
                    // Add this element as a top-level node for this rendered template item, as well as for any
                    // ancestor items between this item and the item of its parent element
                    pntItem.nodes.push(el);
                    pntItem = pntItem.parent;
                }
                // Delete content built during rendering - reduce API surface area and memory use, and avoid exposing of stale data after rendering...
                delete tmplItem._ctnt;
                delete tmplItem._wrap;
                // Store template item as jQuery data on the element
                jQuery.data(el, "tmplItem", tmplItem);
            }

            function cloneTmplItem(key) {
                key = key + keySuffix;
                tmplItem = newClonedItems[key] =
                    (newClonedItems[key] || newTmplItem(tmplItem, newTmplItems[tmplItem.parent.key + keySuffix] || tmplItem.parent, null, true));
            }
        }
    }

    //---- Helper functions for template item ----

    function tiCalls(content, tmpl, data, options) {
        if (!content) {
            return stack.pop();
        }
        stack.push({_: content, tmpl: tmpl, item: this, data: data, options: options});
    }

    function tiNest(tmpl, data, options) {
        // nested template, using {{tmpl}} tag
        return jQuery.tmpl(jQuery.template(tmpl), data, options, this);
    }

    function tiWrap(call, wrapped) {
        // nested template, using {{wrap}} tag
        var options = call.options || {};
        options.wrapped = wrapped;
        // Apply the template, which may incorporate wrapped content, 
        return jQuery.tmpl(jQuery.template(call.tmpl), call.data, options, call.item);
    }

    function tiHtml(filter, textOnly) {
        var wrapped = this._wrap;
        return jQuery.map(
            jQuery(jQuery.isArray(wrapped) ? wrapped.join("") : wrapped).filter(filter || "*"),
            function (e) {
                return textOnly ?
                    e.innerText || e.textContent :
                    e.outerHTML || outerHtml(e);
            });
    }

    function tiUpdate() {
        var coll = this.nodes;
        jQuery.tmpl(null, null, null, this).insertBefore(coll[0]);
        jQuery(coll).remove();
    }


    // Set values to cookies.
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + '=' + cvalue + '; ' + expires + '; path=/ ';
        javascript:window.location.reload();
    }


    // Get value from cookies.
    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    /* Toggle Video Modal
      -----------------------------------------*/
    function toggle_video_modal() {
		
		var timer;

        // Click on video thumbnail or link
        jQuery(".js-video-button").hover(function (e) {

            // prevent default behavior for a-tags, button tags, etc. 
            //e.preventDefault();
            var self = this;

            timer = window.setTimeout(function () {
				debugger;
                // Grab the video ID from the element clicked
                var id = jQuery(self).attr('data-video-id');

                // Autoplay when the modal appears
                // Note: this is intetnionally disabled on most mobile devices
                // If critical on mobile, then some alternate method is needed
                var autoplay = '?autoplay=1';

                // Don't show the 'Related Videos' view when the video ends
                var related_no = '&rel=0';

                // String the ID and param variables together
                var src = '//www.youtube.com/embed/' + id + autoplay + related_no;

                // Pass the YouTube video ID into the iframe template...
                // Set the source on the iframe to match the video ID
                //jQuery("#youtube").attr('src', src);

                var myContent = {src: src};

                jQuery.tmpl("modalVideoTmpl", myContent).appendTo("body");

                // Add class to the body to visually reveal the modal
                jQuery("body").addClass("show-video-modal noscroll");

            }, 2000);

           

        },function(e) {

			window.clearTimeout(timer)
			
		});


        // Close and Reset the Video Modal
        function close_video_modal() {

            event.preventDefault();

            // re-hide the video modal
            jQuery("body").removeClass("show-video-modal noscroll");
            //jQuery(".video-modal").remove();

            // reset the source attribute for the iframe template, kills the video
            jQuery("#youtube").attr('src', '');

        }

        // if the 'close' button/element, or the overlay are clicked 
        jQuery('body').on('click', '.close-video-modal, .video-modal .overlay', function (event) {

            // call the close and reset function
            close_video_modal();

        });
    }


    var dict = {

        'Подесувања за форумот': 'oMdrNsM7ar0',
        'Тип на известување по е-пошта': 'LM4YIKf-xE0',
        'Автоматско пријавување на форум': 'xhAb6yOjLWc',
        'Следење на форум': 'qocybMO9XFE',
        'Откако ќе се испратат пораки на форумот': 't4HRbkuXQgA',
        'Подесувања за пораките': 'VDuGoHQ6Rhs',
        'Можете да забраните кој да ви праќа порака': 'IPb7AKlURuE',
        'Само моите контакти': '4pywjo99frs',
        'Моите контакти и секој запишан на мојот курс': 'P-8xPk-H8Lk',
        'Некои курсеви можат да дозволуваат пристап како гостин': 'HuDFfHiZV6Q',
        'Преференци за известувања': 'uswSiG9-i4I',
        'Привремено оневозможи ги известувањата': 'ifAotAfFLcI',
        'Скокачки известувања': 'xLYZW16yQuU',
        'Е-пошта': 'bfF3XERkRfI',
        'Онлајн': '3II3uln1aO0',
        'Офлајн': 'CrY5Oz2xEv0',
        'Задача': 'BBoEbwLp51E',
        'Известувања за задачи': '5CGP2ov-lIE',
        'Фидбек': 'c65g6jpml14',
        'Известувања за фидбек': '6j63-nW3c8k',
        'Најавете се како гостин': 'hB_1UCbC_5g',
        'Потсетник за фидбек': 'M1bxJ59-LN4',
        'Форум': 'iwwz7wK2bmg',
        'Претплатени објави на форум': 'wrQNUyIgsO4',
        'Претплатени објаснувања за форум': 'LSpL-w22ncA',
        'Лекција': 'CL0fL9eafzA',
        'Известувања за оценувани есеи': 'bHKfcHVRnj8',
        'Систем': 'Qo2FscNrDG4',
        'Известувања за потврда на барања за креирање курсеви': '_V-HCdv7Hdw',
        'Известувања за одбивање на барања за креирање курсеви': 'u8-wynCBr2c',
        'Известувања за примање на значки': 'kWnolCI78zU',
        'Известувања': 'DxNopiwpTGM',
        'Коментар објавен на план за учење': 'ANGWcJm1hqM',
        'Коментарот објавен на надлежност': 'ammFuKqG3w8',
        'Известување за побарувања на пораки од контакт': 'Mo9obQ3tBuQ',
        'Мануелни запишувања': 'IFJvWqrAL1s',
        'Известувања за истекување на мануелни запишувања': '8Jso8ASpQpQ',
        'Само-запишување': 'msM6LqpLMrw',
        'Известувања за истек на само-запишувања': 'DzysiXUQOek',
        'Приватност на податоци': 'w3RNGA70-9A',
        'Барање за процесирање на резултатите': '-fNE78oiuaQ',
        'Конфигурација на дојдовни пораки': 'joODAJH8hk8',
        'Немате нови известувања': 'mqdPTLEyLF0',
        'Порака да се одобри дека порака е испратена од вас': 'pamqUyJGEYA',
        'Предупредување дека испратената порака не може да се процесира': 'c-wKvtDSxaY',
        'Потврда дека пораката е успешно процесирана': 'M19UP49Mwt4',
        'Кориснички детали': 'CDd4Fn8FV_s',
        'Уредете профил': 'INKeyd4HfUc',
        'Адреса за е-пошта': '6Ms83aR5CXY',
        'Внес во блог': 'tTQ8ccrYCPw',
        'Додади нов запис': 'y9S6kmLE3LI',
        'Пораки на форумот': 'UgebBuTa-RI',
        'Нема пораки': 'zyHQ0s8qP5Q',
        'Барај': '7WQjMoOSiHc',
        'Немате направено никакви објави': 'hX8VeTdDl40',
        'Дискусии на форумот': 'NSC8qSlJUDo',
        'Сеуште не сте започнале дискусија': 'a4ELHNt6tHY',
        'Планови за учење': 'UQAb4s-jsxM',
        'Листа на планови за учење': '-lP3JBTtAGA',
        'Темплејти': '7pYrmVCn3N4',
        'Статус': 'r2BFtRRpVeI',
        'Акции': 'TmxyAQASj50',
        'Доказ за претходно учење': 'dUv5XaSr9MQ',
        'Извештаи': 'CNzL_nNLoEQ',
        'Поставувања': '8wtDD6KScxk',
        'Мои активни сесии': 'HZQDnY5W9Ag',
        'Најавување': 'W5K8LNmx7Cs',
        'Последен пристап': 'PrTsJkr7-C4',
        'Последна IP адреса': '5J2RjMy4KSc',
        'Преглед на оцени': 'usVWkilh3o0',
        'Прв пристап до сајтот': 'Upckwkok8mA',
        'Последен пристап до сајтот': '1lU1bEeGUSg',
        'Акција': 'hHIhqc33ROE',
        'Оцени': 'uFzFKBGxXAQ',
        'Не сте запишани, ниту предавате некои предмети на овој сајт': 'rZkdtghlLx8',
        'Приватност': 'rQfb0YITyV4',
        'Пораки': 'rsorFVgR2Dk',
        'Контакти': 'vwT5kevz3S4',
        'Означен со ѕвезда': 'zw28jVapTFM',
        'Групни': 'UvxNnkzGBSE',
        'Приватни': 'j8adX7yY_Os',
        'Параметри': 'hpPI5PoKv0Y',
        'Одјавете се': 'cYsDzGA_FBI',
        'Можете да забраните кој да ви праќа порака': 'z2-rhUiw4dw',
        'Само моите контакти': 'OpaUjKmi8N0',
        'Моите контакти и секој запишан на мојот курс': 'MK2Y9TDyVf8',
        'Филозофски факултет - Скопје': 'obhCxkkw-nU',
        'Преференци за известувања': 'kluUVlk_MI4',
        'Е-пошта': 'NbnEE0nuxiQ',
        'Основно': 'w3FPY82MtL4',
        'Стисни ентер за да пратиш': 'AVLP3ZNySMk',
        'Моја почетна страница': 'taA-EAq7RRA',
        'Неодамна пристапени курсеви': 'pQI38wdY-aY',
        'Нема скорешни курсеви': 'w6oikIPWBho',
        'Преглед на курсот': 'wdZn_vA3zdU',
        'Сите курсеви': 'x2hHVEuEOis',
        'Прикажи курсеви во прогрес': 'oY5skwCgPZ4',
        'Не сте најавени': 'a-Tv5GrZmBs',
        'Прикажи идни курсеви': 'zyDLfc4Hphs',
        'Прикажи изминати курсеви': 'QEqlHm_bnNo',
        'Прикажани': 'Upnd-L6_LkM',
        'Скриени': 'IYzG--PyCCc',
        'Мои приватни датотеки': 'bBD8YpszkCQ',
        'Нема датотеки на располагање': 'hWvx5EQusuw',
        'Менаџирај ги моите приватни датотеки': 'N1Wz4v6uZyM',
        'Додади се': 'YaQSWC_QGaw',
        'Креирај фолдер': 'bnR-sbqjYGg',
        'Преземи се': 'YsZsyZgR-EQ',
        'Најавете се': 'nN1EEsghdjo',
        'Прикажи фолдер со икони на датотеки': 'bWJz6E9_e4g',
        'Прикажи фолдер со детали за датотеките': '_jmCX1cmG0g',
        'Прикажи фолдер како дрво': 'G_UjwH2S5vU',
        'Можете да ги довлечете и отпуштите датотеките овде за да ги додадете': '_-klIzjbz4M',
        'Зачувај ги промените': '4ojvv0Ha7Rk',
        'Откажи': 'EEjTOEG_0Ec',
        'Онлајн корисници (последните 5 минути)': 'pUwqGNonz6M',
        'Календар': 'gauh3n9ZPuY',
        'Престојни настани': 'ROJqwzs7GS0',
        'Оди во календар': 'npI5aXoALHM',
        'Вести од страницата': 'RqImHCc42FM',
        'Нов настан': 'qF-PWNoZFjE',
        'Нема никакви настани за денес': '60DW-F5MFLE',
        'Извези календар': 'r8uwgJd8nhA',
        'Менаџирај претплати': 'bxRLe_BvTow',
        'Уредување на настан': 'TMyspMvurYw',
        'Прикажи глобални настани': 'tODUbtSC4MI',
        'Сокриј категоризирани настани': 'zHTQBwWyevs',
        'Сокриј настани на курсот': 'X2heWegFIxw',
        'Сокриј настани на групата': '1pyg2GWeqes',
        'Сокриј кориснички настани': 'a9TIdPFI_o0',
        'Македонски': 'p7Bz3ei1wzA',
        'Најавени сте како': 'bs506TBignM',
        'Одјавете се': 'zMzlJSBP1Wc',
        'Почнете од почеток': 'RbIR3Q7O61k',
        'Резиме за задржување на податоци': '5kOk4Gw32NQ',
        'Сајт': 'HxAmPlmPI_U',
        'Цел': 'c2IeBsG_IWA',
        'Период на задржување': 'BjxGW9D2FaY',
        'Корисници': '6sIaYURijyQ',
        'Цел': 'gjXgMBWq5sE',
        'Категории на курсот': 'eVS95WUCOX0',
        'Англиски': 'VNVwmtMBZ18',
        'Активности во рамките на курсот': 'gZU_BdPzqyQ',
        'Блогови': 'sYfaoPhNl0M',
        'Систем за е-учење на Филозофски факултет': 'wT8Y3hSvshM',
        'Профил': 'qKySAk1jGOw',
        'Врати ги основните вредности': 'Oh2dzE7zsAM',
        'Уреди ја оваа страница': 'n3kEDGUcvZc',
        'Уредете профил': 'm9FXqGAd0H0',
        'Основно': 'MDyZaOS2sss',
        'Прикажи ги сите': 'qJZEMa3tstA',
        'Скриј се': 'uEksaYGzDhg',
        'Запомни корисничко име': 'i3DJgj8_6aQ',
        'Адреса за е-пошта': 'LVe6Qwdnj34',
        'Прикажување на пораките на е-пошта': 'CCv7DmQD6MQ',
        'Дозволи им на другите членови во курсот да ја гледаат мојата адреса за е-пошта': 'rOV0YeGNIAA',
        'Сокриј ја мојата адреса за е-пошта од сите': 'neW2GW7wkHs',
        'Дозволи им на сите да ја гледаат мојата адреса за е-пошта': 'CP6XVTGN-SU',
        'Интереси': 'q9mTQW687RA',
        'Список на интереси': 'edjoSIaGJ58',
        'Внесете ги Вашите интереси одделени со запирки. Вашите интереси ќе бидат прикажани на Вашиот профил како тагови.': 'zM8vLe5jKEQ',
        'Опционо': 'KI4VODRHaR8',
        'Ажурирајте го профилот': 'vsY1rt3gaF0',
        'Го заборавивте корисничкото име или лозинката?': 'AK5LLpeSAdk',
        'Откажи': 'VSzP8ptGqgs',
        'Промени лозинка': 'zcUQQ_a3F2k',
        'Корисничко име': 'SMROnOJTrrM',
        'Лозинките мораат да имаат најмалку': 'h8-senBdzhI',
        'Сегашна лозинка': '8YHzaQT8OWc',
        'Нова лозинка': 'T7LmNr1sUwQ',
        'Нова лозинка повторно': '60rAZxts62A',
        'Пополнувањето на полињата во овој формулар обележани со ! е задолжително': '2FW3Rlvy3pU',
        'Префериран јазик': 'qmwbg2Kmzb4',
        'Македонски': 'm68M3cQ-bTE',
        'Колачињата мораат да бидат овозможени во Вашиот прелистувач': 'vGd_IXAxNTI'


    };


    jQuery(document).ready(function () {


        var tmpl = '<div><div align="center "><section class="video-modal"><div class="overlay"></div><div  id="video-modal-content" class="video-modal-content"><iframe id="youtube" width="100%" height="100%" frameborder="0" allow="autoplay" allowfullscreen src=${src}></iframe><a href="#" class="close-video-modal"> <svg  version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 0 32 32" width="100%" height="100%" frameborder="0" allow="autoplay" allowfullscreen src=${src}></iframe> <a href="#" class="close-video-modal"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 0 32 32" style="enable-background:new 0 0 32 32;" xml:space="preserve" width="24" height="24"><g id="icon-x-close"> <path fill="#ffffff" d="M30.3448276,31.4576271 C29.9059965,31.4572473 29.4852797,31.2855701 29.1751724,30.98$ <path fill="#ffffff" d="M1.65517241,31.4576271 C0.986170142,31.4570487 0.383303157,31.0606209 0.127366673,30$</g></svg></a></div></div>';

        var sign_language_cookie = getCookie("sign_language");

        var jqTmpl = jQuery;

        jQuery.template("modalVideoTmpl", tmpl);

        if (sign_language_cookie == 'true') {
            jQuery.each(dict, function (index, value) {

                var findText = index;
                var v = value;

                jQuery('*').filter(function () {
                    return jQuery(this).children().length < 1 && jQuery(this).text().indexOf(findText) >= 0;
                }).each(function (index, item) {
                    jQuery(item).addClass("sign-language-info");
                    jQuery(item).addClass("js-video-button");
                    jQuery(item).attr("data-video-id", v);

                });


            });
            toggle_video_modal();
        }


        // if the ESC key is tapped
        jQuery('body').keyup(function (e) {
            // ESC key maps to keycode `27`
            if (e.keyCode == 27) {

                // call the close and reset function
                close_video_modal();

            }
        });


    });


})(jQuery);