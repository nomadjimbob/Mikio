/**
 * DokuWiki Mikio Template Javascript
 *
 * @link    http://dokuwiki.org/template:mikio
 * @author  James Collins <james.collins@outlook.com.au>
 * @license GPLv2 (http://www.gnu.org/licenses/gpl-2.0.html)
 */
"use strict";

var mikio = {
    queueResize: false,
    mikioCSS: false,

    ready: function() {
        var self = this;

        this.addToggleClick('mikio-sidebar-toggle', 'mikio-sidebar-collapse');
        this.addToggleClick('mikio-navbar-toggle', 'mikio-navbar-collapse');
        this.addDropdownClick('mikio-nav-dropdown', 'mikio-dropdown');

        window.onresize = function() {
            if(!this.queueResize) {
                this.queueResize = true;
                window.setTimeout(function() {
                    this.queueResize = false;
                    Array.from(document.getElementsByClassName('mikio-dropdown')).forEach(function(elem) {
                        if(!elem.classList.contains('closed')) {
                            elem.classList.add('closed');
                        }
                    });
                }, 100);
            }
        };

        // Mikio-Dropdown - Click
        Array.from(document.getElementsByClassName('mikio-dropdown')).forEach(function(elem) {
            elem.addEventListener('click', function(event) {
                event.stopPropagation();
            });
        });

        // Mikio-Dropdown - Close when clicked outside dropdown
        Array.from(document.getElementsByTagName('body')).forEach(function(elem) {
            elem.addEventListener('click', function(event) {
                Array.from(document.getElementsByClassName('mikio-dropdown')).forEach(function(elem) {
                    if(!elem.classList.contains('closed')) {
                        elem.classList.add('closed');
                    }
                });
            });
        });

        // Mikio-Navbar-Toggle - Fix
        Array.from(document.getElementsByClassName('mikio-navbar-toggle')).forEach(function(elem) {
            elem.classList.add('closed');
        });

        // Mikio-Dropdown - Fix
        Array.from(document.getElementsByClassName('mikio-dropdown')).forEach(function(elem) {
            elem.classList.add('closed');
        });

        // Input File - Cleanup
        Array.from(document.querySelectorAll('input[type=file]')).forEach(function(elem) {
            var style = window.getComputedStyle(elem);

            if(style.display != 'none') {
                var parentElem = elem.parentElement;
                var fileRect = elem.getBoundingClientRect();
                var parentRect = parentElem.getBoundingClientRect();
                var spanElem = document.createElement('span');

                elem.style.opacity = 0;
                parentElem.style.position = 'relative';
                spanElem.innerHTML = 'Choose file...';
                spanElem.classList.add('mikio-input-file');
                spanElem.style.left = Math.floor(fileRect.left - parentRect.left) + 'px';
                spanElem.style.width = Math.floor(fileRect.right - fileRect.left) + 'px';
                mikio.insertAfter(spanElem, elem);
                
                spanElem.addEventListener('click', function(event) {
                    if(event.target.parentElement.tagName.toLowerCase() != 'label') {
                        let sibling = mikio.getPrevSibling(event.target, 'input');
                        if(typeof sibling !== 'undefined') {
                            sibling.click();
                        }
                    }
                });

                elem.addEventListener('change', function() {
                    if(this.files.length > 0) {
                        let mikioInput = mikio.getNextSibling(this, '.mikio-input-file');
                        if(typeof mikioInput !== 'undefined') {
                            mikioInput.innerHTML = this.files[0].name;
                        }
                    }
                });
            }
        });

        // Input - Span (Placeholder) clear when typing
        Array.from(document.querySelectorAll('.mikio.dokuwiki .mode_login fieldset label.block input.edit, .mikio.dokuwiki .mode_denied fieldset label.block input.edit')).forEach(function(elem) {
            elem.addEventListener('keydown', function(event) {
                console.log(event.key);
                var sibling = mikio.getPrevSibling(event.target, 'span');

                setTimeout(function() {
                    if(sibling) {
                        if(event.target.value != '') {
                            sibling.style.display = 'none';
                        } else {
                            sibling.style.display = 'block';
                        }
                    }
                }, 50);
            });
        });

        // Admin - Exit button
        Array.from(document.querySelectorAll('a[rel="exit-admin"]')).forEach(function(elem) {
            elem.addEventListener('click', function(event) {
                event.preventDefault();

                var href = window.location.protocol + "//" + window.location.host + "/" + window.location.pathname;

                var params = window.location.search;
                if(params !== '') {
                    params = params.substr(1).split('&');
                    if(params.length > 1) {
                        href += '?';
                        params.forEach(function(p) {
                            if(p.substring(0, 3) == 'id=') {
                                href += p;
                            }
                        });
                    }
                }

                window.location = href;
            });
        });

        // Admin - Back button
        Array.from(document.querySelectorAll('a[rel="exit-page"]')).forEach(function(elem) {
            elem.addEventListener('click', function(event) {
                event.preventDefault();

                var href = window.location.protocol + "//" + window.location.host + "/" + window.location.pathname;

                var params = window.location.search;
                if(params != '') {
                    params = params.substr(1).split('&');
                    if(params.length > 1) {
                        href += '?';
                        params.forEach(function(p) {
                            if(p.substring(0, 5) != 'page=') {
                                href += p + '&';
                            }
                        });
                    }
                }

                window.location = href;
            });
        });

        // Admin - Resize large text blocks in tasks
        Array.from(document.querySelectorAll('.admin_tasks span.prompt')).forEach(function(elem) {
            if(elem.offsetHeight > 48) {
                elem.style.fontSize = '80%';
            }
        });

        // Media Manager - ui-resizable is always auto
        var mediaChangedObserver = new MutationObserver(function(mutationsList) {
            for(let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    if(mutation.addedNodes) {
                        mutation.addedNodes.forEach(function(node) {
                            if(node.nodeName == 'LI') {

                            }
                        });
                    }
                }

                if (mutation.type === 'attributes' && mutation.attributeName == 'style' && mutation.target && mutation.target.style.height) {
                    mutation.target.style.height = '';
                }
            }
        });

        var target = document.getElementById('mediamanager__page');
        if(target) {
            mediaChangedObserver.observe(target, {attributes: true, childList: true, subtree: true});
        }

        // Media Manager - file click
        Array.from(document.querySelectorAll('#mediamanager__page .filelist')).forEach(function(elem) {
            elem.addEventListener('click', function(event) {
                var liElem = event.target.closest('li');
                if(liElem && event.target.closest('ul.thumbs')) {
                    var aElem = liElem.querySelector('dd.name a');
                    if(aElem) aElem.click();
                }
            });
        });

        // Popup Media Manager - clean file info
        var mediaPopupFileInfoClean = function(elem) {
            var file = {resolution: '', date: '', time: '', size: ''};

            var infoElem = elem.querySelector('span.info');
            if(infoElem) {
                var infoText = infoElem.innerText.replace(/(<[^>]*>|[\(\)])/g, '');
                var detail = infoText.split(' ');
                while(detail.length < 4) {
                    detail.unshift('');
                }

                infoElem.innerHTML = detail[0] + '<br>' + detail[1] + ' ' + detail[2] + '<br>' + detail[3];
            }

            console.log('there');
            Array.from(elem.querySelectorAll('img')).forEach(function(elem) {
                elem.removeAttribute('width');
                elem.removeAttribute('height');
            });
        }

        var mediaPopupObserver = new MutationObserver(function(mutationsList) {
            for(let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    if(mutation.addedNodes) {
                        mutation.addedNodes.forEach(function(node) {
                            if(node.nodeName == 'DIV') {
                                mediaPopupFileInfoClean(node);
                            }
                        });
                    }
                }
            }
        });

        var target = document.getElementById('media__content');
        if(target) {
            Array.from(target.querySelectorAll('div.odd, div.even')).forEach(function(elem) {
                mediaPopupFileInfoClean(elem);
            });

            mediaPopupObserver.observe(target, {attributes: false, childList: true});
        }

        if(typeof mikioFooterRun === "function") mikioFooterRun();

        // TESTING

        var mediaChangedObserver = new MutationObserver(function(mutationsList) {
            for(let mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName == 'href') {
                    if(self.mikioCSS != false) {
                        var elem = self.mikioCSS;
                        var prev = elem.href;
                        
                        setTimeout(function() {
                            var url = new URL(prev);
                            var params = url.searchParams;
                            params.set('seed', new Date().getTime());
                            url.search = params.toString();
                            elem.href = url.toString();
                        }, 500);                        
                    }
                }
            }
        });

        var linkElements = document.getElementsByTagName('link');
        for(let element of linkElements) {
            if(element.rel == 'stylesheet' && element.href) {
                if(element.href.includes('/lib/exe/css.php')) {
                    mediaChangedObserver.observe(element, {attributes: true, childList: true, subtree: true});
                } else if(element.href.includes('/lib/tpl/mikio/css.php')) {
                    this.mikioCSS = element;
                }
            }
        }
    },

    insertAfter: function(newNode, existingNode) {
        existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
    },

    addToggleClick: function(elemToggle, elemCollapse) {
        this.addEventListenerByClassName(elemToggle, 'click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            let nextSibling = mikio.getNextSibling(this, '.' + elemCollapse);

            if(typeof nextSibling !== 'undefined') {
                mikio.toggleCollapse(this, nextSibling);
            }
        });
    },

    addDropdownClick: function(elemToggle, elemCollapse) {
        this.addEventListenerByClassName(elemToggle, 'click', function(event) {
            event.preventDefault();
            event.stopPropagation();

            var dropdown = this.querySelector('.' + elemCollapse);
            if(dropdown) {
                mikio.toggleDropdown(dropdown);
            }
        });
    },
    
    addEventListenerByClassName: function(className, eventType, callback) {
        Array.from(document.getElementsByClassName(className)).forEach(function(elem) {
            elem.addEventListener(eventType, callback);
        });
    },

    getNextSibling: function(elem, selector) {
        var sibling = elem.nextElementSibling;
    
        while (sibling) {
            if (sibling.matches(selector)) return sibling;
            sibling = sibling.nextElementSibling;
        }    
    },

    getPrevSibling: function(elem, selector) {
        var sibling = elem.previousElementSibling;
    
        while (sibling) {
            if (sibling.matches(selector)) return sibling;
            sibling = sibling.previousElementSibling;
        }    
    },

    toggleCollapse: function(objToggle, objCollapse) {
        if(objToggle.classList.contains('closed')) {
            objToggle.classList.remove('closed');
            objToggle.classList.add('open');
            var height = objCollapse.offsetHeight;
            objCollapse.style.overflow = 'hidden';
            objCollapse.style.height = 0;
            objCollapse.style.paddingTop = 0;
            objCollapse.style.paddingBottom = 0;
            objCollapse.style.marginTop = 0;
            objCollapse.style.marginBottom = 0;
            objCollapse.offsetHeight;
            objCollapse.style.boxSizing = 'border-box';
            objCollapse.style.transitionProperty = "height, margin, padding";
            objCollapse.style.transitionDuration = '500ms';
            objCollapse.style.height = height + 'px';
            objCollapse.style.removeProperty('padding-top');
            objCollapse.style.removeProperty('padding-bottom');
            objCollapse.style.removeProperty('margin-top');
            objCollapse.style.removeProperty('margin-bottom');
            window.setTimeout(function() {
                objCollapse.style.removeProperty('height');
                objCollapse.style.removeProperty('overflow');
                objCollapse.style.removeProperty('transition-duration');
                objCollapse.style.removeProperty('transition-property');
                objCollapse.style.removeProperty('box-sizing');
            }, 500);    
        } else {
            objCollapse.style.transitionProperty = 'height, margin, padding';
            objCollapse.style.transitionDuration = '500ms';
            objCollapse.style.boxSizing = 'border-box';
            objCollapse.style.height = objCollapse.offsetHeight + 'px';
            objCollapse.offsetHeight;
            objCollapse.style.overflow = 'hidden';
            objCollapse.style.height = 0;
            objCollapse.style.paddingTop = 0;
            objCollapse.style.paddingBottom = 0;
            objCollapse.style.marginTop = 0;
            objCollapse.style.marginBottom = 0;
            window.setTimeout(function() {
                objToggle.classList.add('closed');
                objToggle.classList.remove('open');
                objCollapse.style.removeProperty('height');
                objCollapse.style.removeProperty('padding-top');
                objCollapse.style.removeProperty('padding-bottom');
                objCollapse.style.removeProperty('margin-top');
                objCollapse.style.removeProperty('margin-bottom');
                objCollapse.style.removeProperty('overflow');
                objCollapse.style.removeProperty('transition-duration');
                objCollapse.style.removeProperty('transition-property');
                objCollapse.style.removeProperty('box-sizing');
            }, 500);
        }
    },


    toggleDropdown: function(objToggle) {
        if(objToggle.classList.contains('closed')) {
            objToggle.classList.remove('closed');
        } else {
            objToggle.classList.add('closed');
        }

        Array.from(document.getElementsByClassName('mikio-dropdown')).forEach(function(elem) {
            if(!elem.classList.contains('closed') && elem != objToggle) {
                elem.classList.add('closed');
            }
        });
    },

    setHeroSubTitle: function(str) {
        Array.from(document.getElementsByClassName('mikio-hero-subtitle')).forEach(function(elem) {
            elem.innerHTML = str;
        });
    },

    setHeroImage: function(str) {
        var heroImages = document.getElementsByClassName('mikio-hero-image');

        if(heroImages.length > 0) {
            Array.from(document.getElementsByClassName('mikio-hero-image')).forEach(function(elem) {
                elem.style.backgroundImage = 'url(\'' + str + '\')';
                elem.classList.add('mikio-hero-image-resize');
            });    
        } else {
            Array.from(document.getElementsByClassName('mikio-hero-text')).forEach(function(elem) {
                elem.insertAdjacentHTML('afterend', '<div class="mikio-hero-image mikio-hero-image-resize" style="background-image:url(\'' + str + '\');"></div>');
            });
        }
    },

    setHeroColor: function(str) {
        var colors = str.trim().replace(/ +(?= )/g,'').split(/(?!\(.*)\s(?![^(]*?\))/g);
        if(colors.length > 0 && colors[0] != '') {
            Array.from(document.getElementsByClassName('mikio-hero')).forEach(function(elem) {
                elem.style.backgroundColor = colors[0];
            });

            if(colors.length > 1) {
                Array.from(document.getElementsByClassName('mikio-hero-title')).forEach(function(elem) {
                    elem.style.color = colors[1];
                });
            }

            if(colors.length > 2) {
                Array.from(document.getElementsByClassName('mikio-hero-subtitle')).forEach(function(elem) {
                    elem.style.color = colors[2];
                });
            }

            if(colors.length > 3) {
                Array.from(document.getElementsByClassName('mikio-hero')).forEach(function(parentElem) {
                    Array.from(parentElem.querySelectorAll('.mikio-breadcrumbs ul li a')).forEach(function(elem) {
                        elem.style.color = colors[3];
                    });

                    Array.from(parentElem.querySelectorAll('.mikio-breadcrumbs ul li, .mikio-breadcrumbs ul li a')).forEach(function(elem) {
                        elem.style.color = colors[3];
                        elem.onmouseover = function() { this.style.color = (colors.length > 4 ? colors[4] : 'initial'); };
                        elem.onmouseout = function() { this.style.color = colors[3]; };
                    });
                });
            }
        }
    },

    setTags: function(str) {
        Array.from(document.getElementsByClassName('mikio-tags')).forEach(function(elem) {
            elem.innerHTML = str;
        });
    },
    
    hidePart: function (part) {
      var selectorArray = {
        topheader: '.mikio-page-topheader',
        header: '.mikio-page-header',
        contentheader: '.mikio-page-contentheader',
        contentfooter: '.mikio-page-contentfooter',
        sidebarheader: '.mikio-sidebar-left .mikio-sidebar-header',
        sidebarfooter: '.mikio-sidebar-left .mikio-sidebar-footer',
        rightsidebarheader: '.mikio-sidebar-right .mikio-sidebar-header',
        rightsidebarfooter: '.mikio-sidebar-right .mikio-sidebar-footer',
        footer: '.mikio-footer',
        bottomfooter: '.mikio-page-bottomfooter',
        navbar: '.mikio-navbar',
        hero: '.mikio-hero'
      };
  
      if(selectorArray.hasOwnProperty(part)) {
        Array.from(document.querySelectorAll(selectorArray[part])).forEach(function (elem) {
          elem.style.display = 'none';
        });
      }
    }
};


if(document.readyState != 'loading') {
    mikio.ready();
} else {
    document.addEventListener('DOMContentLoaded', function() { mikio.ready() });
}
