bbD.manual = {
    init: function () {
        this.setUserData();
        this.events()
    },
    setUserData: function () {
        bbD.format = bbD.lastformat;
    },
    events: function () {
        var a = this,
            b = true;
        $toolbar = jQuery("#editor-toolbar");
        if (!jQuery("#edButtonPreview", $toolbar).hasClass("active")) {
            a.monetizeButton()
        }
        jQuery("a[id^=edButton]", $toolbar).click(function () {
            a._checkMonetize(jQuery(this));
            a.panel.off()
        });
        jQuery("#bb-manual-tags").keypress(function (d) {
            var c = jQuery(":submit");
            if (d.keycode == 13 || d.which == 13) {
                c.attr("onsubmit", "disabled");
                a._apply();
                return false
            } else {
                c.removeAttr("onsubmit")
            }
        })
    },
    monetizeOff: function () {
      if (jQuery("#edButtonPreview")[0]) {
        /* until WP version 3.2 */
        return (jQuery("#edButtonPreview", $toolbar).hasClass("active")) ? true : false;
      }

      if (jQuery("#content-tmce")) {
        /* WP version 3.3 */
        return (jQuery("#wp-content-wrap").hasClass("tmce-active")) ? true : false;
      }

      return false;
    },
    monetizeButton: function () {
        var c = jQuery("#bboxxy_btn");
        if (!c.attr("src") || c.attr("src") == "") {
            var a = this;
            $btn = jQuery('<div><img src="" alt="monetize" id="bboxxy_btn" /></div>');
            $btn.click(function () {
                var d = a.getHTML();
                a.contentType()
            });
            var b = parseFloat(bbD.version);
            if (b >= 2.7) {
                if (jQuery("#original_publish")[0]) {
                    jQuery("#original_publish").before($btn);
                    jQuery("img", $btn).attr("src", cfg.urlstatic + "/images/booboxfy-wp/monetize27.gif")
                }
            } else {
                if (jQuery("#poststuff input[name=save]")[0]) {
                    jQuery("#poststuff input[name=save]").before($btn);
                    jQuery("img", $btn).attr("src", cfg.urlstatic + "/images/booboxfy-wp/monetize.gif")
                }
                jQuery("#bb-custom-editform").css("background-color", "#EAF3FA")
            }
        }
        c.show()
    },
    _checkMonetize: function (b) {
        var a = jQuery("#bboxxy_btn");
        if (b.attr("id") == "edButtonHTML") {
            this.monetizeButton()
        } else {
            a.hide()
        }
    },
    getHTML: function () {
        html = (this.monetizeOff()) ? tinymce.plugins.BooBoxFy.temp_html : this.getTextAreaHTML();
        return jQuery.trim(html)
    },
    setHTML: function (a) {
        (this.monetizeOff()) ? tinymce.plugins.BooBoxFy.set_html(a) : this.setTextAreaHTML(a)
    },
    getSelPos: function () {
        var e = this.getTextArea(),
            c, d, f = e.value;
        if (document.selection) {
            var b = document.selection.createRange();
            var a = b.duplicate();
            if (b.text.length > 0) {
                a.moveToElementText(e);
                a.setEndPoint("EndToEnd", b);
                c = a.text.length - b.text.length;
                d = c + b.text.length
            }
        } else {
            c = e.selectionStart;
            d = e.selectionEnd
        }
        return {
            start: c,
            end: d,
            atext: f,
            area: e
        }
    },
    getTextArea: function () {
        return jQuery("#content:first")[0]
    },
    getTextAreaHTML: function () {
        window.booboxpos = pos = this.getSelPos();
        var a = (pos.start != pos.end) ? pos.atext.substring(pos.start, pos.end) : alert("selecione um trecho do html para continuar");
        return a
    },
    setTextAreaHTML: function (a) {
        var c = window.booboxpos,
            b = tnext = "";
        b = c.atext.substring(0, c.start);
        tnext = c.atext.substring(c.end, c.atext.length);
        finalText = [b, a, tnext].join("");
        return c.area.value = finalText
    },
    nodeState: function (a) {
        return a ? this.panel.off() : this.contentType()
    },
    checkBoobox: function (a) {
        return a.is("a.bbli") && /^http:\/\/([^.]*\.)?boo-box.com/.test(a.attr('href'));
    },
    contentType: function () {
        var c = this.getHTML(), b;
        if (c.match(/\</gi) && c.match(/\>/gi)) {
            var a = jQuery(c), d = this.checkBoobox(a);
            if (d && !(/(boo-boxfy-auto)/i.test(bbD.helpers.getToolByUrl(jQuery(c).attr("href"))))) {
                this.bbexists(a)
            } else {
                if (a.is("img") && !a.is("img.bbic")) {
                    this.panel.init({
                        html: c,
                        tag: false,
                        type: "img"
                    })
                } else {
                    this.panel.off()
                }
            }
        } else {
            this.panel.init({
                html: c,
                tag: false,
                type: "txt"
            })
        }
    },
    bbexists: function (c) {
        c.find("img.bbic").remove();
        c.find("img.bbused").removeClass("bbused");
        var b = c.html(), a = unescape((bbD.helpers.getTagsByUrl(c.attr("href"))).replace(/[+]/g, " "));
        this.panel.init({
            html: b,
            tag: a,
            type: (jQuery(b).is("img")) ? "img" : "txt"
        });
        return this.focus = true
    },
    _apply: function () {
        var a = this.tag.makeCode("html");
        this.setHTML(a);
        this.panel.off()
    },
    panel: {
        init: function (c) {
            var b;
            switch (c.type) {
            case "img":
                this.on("imagem");
                var a = jQuery(c.html)[0];
                b = (!c.tag) ? a.alt || a.href || "" : c.tag;
                break;
            default:
                this.on("link");
                b = (!c.tag) ? c.html : c.tag;
                break
            }
            jQuery("#bb-manual-text").val(c.html);
            jQuery("#bb-manual-tags").val(b)
        },
        on: function (a) {
            jQuery("#bb-manual-content").html('<label for="bb-custom-tags">Tags de ' + a + ':</label><input type="hidden" name="bb-manual-text" id="bb-manual-text" /><input type="text" name="bb-manual-tags" id="bb-manual-tags" /><a href="javascript:void(0);" id="boopreview" class="button">Visualizar</a><a href="javascript:void(0);" id="booapply" class="button">Aplicar</a><br /><div id="bb-tt-simulation" style="display:none"><ul id="bb-tt-offerslist"></ul></div>');
            jQuery("#booManual").slideDown();
            this.events()
        },
        off: function () {
            jQuery("#booManual").slideUp();
            jQuery("#bb-manual-content").html("")
        },
        events: function () {
            jQuery("#boopreview").click(function () {
                jQuery("#bb-tt-offerslist").html("Carregando...");
                var a = jQuery("#bb-manual-tags");
                (a.val != "") ? bbD.manual.tag.simulate(a.val()) : alert("Digite uma tag");
                return false
            });
            jQuery("#booapply").click(function () {
                bbD.manual._apply()
            })
        }
    },
    tag: {
        makeCode: function (c) {
            $tags = jQuery("#bb-manual-tags").val();
            var e = {
                type: "text",
                val: jQuery("#bb-manual-text").val()
            };
            noImage = (!jQuery(e.val).is("img"));
            var a = new Object();
            a.format = (bbD.format != "null" && bbD.format != null && bbD.format != "0") ? bbD.format : "bar";
            a.tags = escape($tags).replace(/(\%20){1,}/gi, "+");
            a.alt = a.tags.replace(/\+/gi, " ");
            a.hash = Base64.encode(a.tags + "_##_" + a.format + "_##_tagging-tool-wp_##_" + bbD.bid);
            a.imageindicator = '<img src="' + cfg.url + 'bbli" alt="[bb]" class="bbic" />';
            a.text = '<a href="' + cfg.urle + "/list/page/" + a.hash + '" class="bbli">' + e.val + ((noImage) ? a.imageindicator : "") + "</a>";
            var b = a.text;
            var d = cfg.urle + "/list/page/" + a.hash;
            switch (c) {
            case "html":
                return b;
                break;
            case "url":
                return d;
                break
            }
        },
        simulate: function (i) {
            var g = jQuery("#boopreview");
            var e = "bb-tt-";
            var a = jQuery("#" + e + "simulation");
            var d;
            var f = function (k) {
                if (!a.is(":visible")) {
                    return
                }
                var r = false;
                $loadingoffers.hide();
                $offersnotloaded.hide();
                $offeritems.remove();
                if (k.products != null) {
                    if (k.products.length > 0) {
                        var r = true;
                        var m = '<li class="' + e + 'offeritem"><a href="#" class="' + e + 'offerlink"><span class="' + e + 'offerimage"></span><span class="' + e + 'offerdescription"><span class="' + e + 'offertitle"></span><span class="' + e + 'offerprice"></span></span></a></li>';
                        var q = k.products.length;
                        var p = 6;
                        var p = q < p ? q : p;
                        for (var l = 0; l < p; l++) {
                            var o = k.products[l];
                            var j = jQuery(m);
                            jQuery("span[class$=offerimage]", j).css("background-image", "url('" + o.img + "')");
                            jQuery("span[class$=offertitle]", j).html(o.name);
                            jQuery("span[class$=offerprice]", j).html(o.price);
                            jQuery("span[class$=offertitle]", j).show();
                            var n = jQuery("a[class$=offerlink]", j);
                            n.attr("href", o.url);
                            n.attr("title", o.name);
                            n.attr("target", "_blank");
                            $offerslist.append(j)
                        }
                        $offeritems = jQuery("." + e + "offeritem").show();
                        $offeritems.show()
                    }
                }
                if (!r) {
                    $offersnotloaded = jQuery("<li></li>").hide().addClass(e + "offersnotloaded").html((k.fail != undefined) ? "offers not loaded" : "no offers found");
                    $offerslist.append($offersnotloaded);
                    $offersnotloaded.fadeIn()
                }
            };
            $offerslist = jQuery("#" + e + "offerslist");
            $loadingoffers = jQuery("." + e + "loadingoffers", a);
            $offersnotloaded = jQuery("." + e + "offersnotloaded", a);
            $offeritems = jQuery("." + e + "offeritem");
            $offeritems.remove();
            $offersnotloaded.hide();
            var h = bbD.bid;
            var c = Base64.encode(i + "_##_simulation_##_tagging-tool_##_" + h);
            var b = cfg.urle + "/list/json/" + c + "?sinc=true&callback=?";
            jQuery.getJSON(b, function (j) {
                $offerslist.html("");
                f(j)
            });
            a.show()
        }
    }
};
