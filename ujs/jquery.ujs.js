String.prototype.format = function () {
    var source = this;
    var part = /\{\d+\}/g;
    var res = source.match(part);
    for (var i = 0; i < res.length; i++) {
        var index = parseInt(res[i].substring(res[i].indexOf("{") + 1, res[i].indexOf("}")));
        source = source.replace(res[i], arguments[index]);
    }
    return source;
};
Array.prototype.contains = function (item) {
    for (var i in this) {
        if (this[i] == item) {
            return true;
        }
    }
    return false;
};
$.extend({
    elements: {},
    render: function () {
        $(".ujs-layout").each(function () {
            var el = $(this).layout();
            if (el.attr("id") != undefined)
                $.elements[el.attr("id")] = el;
        });
        $(".ujs-accordion").each(function () {
            var el = $(this).accordion();
            if (el.attr("id") != undefined)
                $.elements[el.attr("id")] = el;
        });
        $(".ujs-tabs").each(function () {
            var el = $(this).tabs();
            if (el.attr("id") != undefined)
                $.elements[el.attr("id")] = el;
        });

        $(".ujs-button").each(function () {
            var el = $(this).button();
            if (el.attr("id") != undefined)
                $.elements[el.attr("id")] = el;
        });
        $(".ujs-textbox").each(function () {
            var el = $(this).textbox();
            if (el.attr("id") != undefined)
                $.elements[el.attr("id")] = el;
        });
        $(".ujs-textarea").each(function () {
            var el = $(this).textarea();
            if (el.attr("id") != undefined)
                $.elements[el.attr("id")] = el;
        });
        $(".ujs-combobox").each(function () {
            var el = $(this).combobox();
            if (el.attr("id") != undefined)
                $.elements[el.attr("id")] = el;
        });
        $(".ujs-checkbox").each(function () {
            var el = $(this).checkbox();
            if (el.attr("id") != undefined)
                $.elements[el.attr("id")] = el;
        });
        $(".ujs-gridview").each(function () {
            var el = $(this).gridview();
            if (el.attr("id") != undefined)
                $.elements[el.attr("id")] = el;
        });
    },
    renderOrder: function () {
        var els = $(".ujs-layout,.ujs-accordion,.ujs-tabs,.ujs-button,.ujs-textbox,.ujs-textarea,.ujs-combobox,.ujs-checkbox,.ujs-gridview");
        var order = [];
        els.each(function () {
            var type = $(this).attr("class").match(/ujs\-[a-z]+/)[0].split("-")[1];
            var id = $(this).attr("id");
            var el = $(this)["panel"]();
            if (id) {
                $.elements[id] = el;
            }
        });
    },
    objClone: function (source) {
        if (!$.isPlainObject(source)) return;
        var target = {};
        for (var i in source) {
            var isClone = true;
            for (var j = 1; j < arguments.length; j++) {
                if (arguments[j] == i) {
                    isClone = false;
                }
            }
            if (isClone) {
                target[i] = source[i];
            }
        }
        return target;
    }
});
$.fn.extend({
    layout: function (option) {
        var el = this, opts = { regions: {}, autoHeight: true, regionTags: ["north", "south", "west", "east", "center"] };
        if (el.length == 0) {
            return;
        }
        if (el.height() != 0) {
            opts.autoHeight = false;
        }
        el.children().each(function () {
            var tag = $(this).attr("region");
            if (!opts.regionTags.contains(tag)) {
                $(this).remove();
            }
            else {
                var region = opts.regions[$(this).attr("region")] = { title: "", split: true, iconCls: "", expand: true, url: "" };
                for (var i in region) {
                    if (typeof (region[i]) == "string") {
                        if (typeof ($(this).attr(i)) == "string") {
                            region[i] = $(this).attr(i);
                        }
                        if (option != undefined && option[tag] != undefined && option[tag][i] != undefined) {
                            region[i] = option[tag][i];
                        }
                    }
                    else {
                        if ($(this).attr(i) == "false") {
                            region[i] = false;
                        }
                        if (option != undefined && option[tag] != undefined && option[tag][i] != undefined && option[tag][i] == false) {
                            region[i] = false;
                        }
                    }
                }
            }
        });
        if (option != undefined) {
            for (var i in option) {
                if (!opts.regionTags.contains(i) || opts.regions[i] != undefined)
                    continue;
                var region = opts.regions[$(this).attr("region")] = { title: "", split: true, iconCls: "", expand: true, url: "" };
                for (var r in region) {
                    if (typeof (region[t]) == "string") {
                        if (option[i][r] != undefined) {
                            region[r] = option[i][r];
                        }
                    }
                    else {
                        if (option[i][r] == false) {
                            region[r] = false;
                        }
                    }
                }
            }
        }
        function create() {
            for (var i in opts.regions) {
                var el_region = el.find("div[region={0}]".format(i)), el_region_header, el_region_panel, el_region_hide;
                if (el_region.length > 0) {
                    el_region.addClass("ujs-layout-{0}".format(i));
                    el_region.removeAttr("region");
                    el_region.removeAttr("split");
                    el_region.removeAttr("title");
                    el_region.removeAttr("iconCls");
                    el_region.removeAttr("url");
                }
                else {
                    el_region = $("<div class=\"ujs-layout-{0}\"></div>".format(i));
                    el.append(el_region);
                }
                var html = el_region.html();
                el_region.empty();
                if (opts.regions[i].title != "") {
                    var el_region_header_expand = i == "center" ? "" : "<span class=\"{0}\"></span>".format(i);
                    el_region_header = $("<div class=\"ujs-layout-header\"><label class=\"{0}\">{1}</label>{2}</div>".format(opts.regions[i].iconCls, opts.regions[i].title, el_region_header_expand));
                    el_region.append(el_region_header);
                    if (i != "center") {
                        el_region_hide = $("<div class=\"ujs-layout-{0}-hide\"><span class=\"{0}\"></span></div>".format(i));
                        el_region.after(el_region_hide);
                        el_region_header.children("span").hover(function () {
                            $(this).css("opacity", 1);
                        }, function () {
                            $(this).css("opacity", 0.6);
                        }).click(function () {
                            var region = $(this).attr("class");
                            opts.regions[region].expand = false;
                            render(false);
                        });
                        el_region_hide.click(function () {
                            var region = $(this).attr("class").split("-")[2];
                            if (region == "north")
                                $(".ujs-layout-{0}".format(region)).animate({ top: 0 });
                            if (region == "south")
                                $(".ujs-layout-{0}".format(region)).animate({ top: el.height() - $(".ujs-layout-{0}".format(region)).outerHeight() });
                            if (region == "west")
                                $(".ujs-layout-{0}".format(region)).animate({ left: 0 });
                            if (region == "east")
                                $(".ujs-layout-{0}".format(region)).animate({ left: el.width() - $(".ujs-layout-{0}".format(region)).outerWidth() });
                            $(".ujs-layout-{0}".format(region)).mouseleave(function () {
                                $(this).unbind("mouseleave");
                                var region = $(this).attr("class").split("-")[2];
                                if (region == "north")
                                    $(".ujs-layout-{0}".format(region)).animate({ top: -$(".ujs-layout-{0}".format(region)).outerHeight() });
                                if (region == "south")
                                    $(".ujs-layout-{0}".format(region)).animate({ top: el.height() });
                                if (region == "west")
                                    $(".ujs-layout-{0}".format(region)).animate({ left: -$(".ujs-layout-{0}".format(region)).outerWidth() });
                                if (region == "east")
                                    $(".ujs-layout-{0}".format(region)).animate({ left: el.width() });
                            });
                        });
                        el_region_hide.children("span").hover(function () {
                            $(this).css("opacity", 1);
                        }, function () {
                            $(this).css("opacity", 0.6);
                        }).click(function (evt) {
                            var region = $(this).attr("class");
                            opts.regions[region].expand = true;
                            render();
                            evt.stopPropagation();
                        });
                    }
                }
                el_region_panel = $("<div class=\"ujs-layout-panel\">{0}</div>".format(html));
                el_region.append(el_region_panel);
                if (opts.regions[i].split && i != "center") {
                    var el_region_split = $("<div class=\"ujs-layout-{0}-split\"></div>".format(i));
                    el_region.after(el_region_split);
                    el_region_split.mousedown(function (de) {
                        var region = $(this).attr("class").split("-")[2],
                                        spmove = $("<div class=\"ujs-layout-{0}-split-move\"></div>".format(region)),
                                        ismove = true,
                                        offset = 0,
                                        cursor;
                        if (region == "north" || region == "south") {
                            spmove.css({ top: $(this).position().top });
                            offset = de.pageY - $(this).position().top;
                            cursor = "n-resize";
                        }
                        else {
                            spmove.css({ left: $(this).position().left, height: $(this).height(), top: $(this).position().top });
                            offset = de.pageX - $(this).position().left;
                            cursor = "w-resize";
                        }
                        el.append(spmove);
                        $("body").bind("selectstart", function () { return false; }).css("-moz-user-select", "none").css("cursor", cursor);
                        el.mousemove(function (me) {
                            if (ismove) {
                                if (region == "north" || region == "south")
                                    spmove.css({ top: me.pageY - offset });
                                else
                                    spmove.css({ left: me.pageX - offset });
                            }
                        });
                        spmove.mouseup(function () {
                            var regel = el.children(".ujs-layout-{0}".format(region));
                            if (region == "north")
                                regel.height(spmove.position().top);
                            if (region == "south")
                                regel.height(el.height() - spmove.position().top - spmove.outerHeight());
                            if (region == "west")
                                regel.width(spmove.position().left);
                            if (region == "east")
                                regel.width(el.width() - spmove.position().left - spmove.outerWidth());
                            render();
                            spmove.remove();
                            ismove = false;
                            el.unbind("mousemove");
                            $("body").unbind("selectstart").css("-moz-user-select", "").css("cursor", "default");

                        });
                    });
                }
                if (opts.regions[i].url != "") {
                    el_region_panel.empty();
                    var ifr = $("<iframe class=\"ujs-layout-ifr\" src=\"{0}\"></iframe>".format(opts.regions[i].url))
                    el_region_panel.append(ifr);
                }
            }
            render();
        }
        function getregionwh(name) {
            if (opts.regions[name] == undefined) return 0;
            var region = el.children(".ujs-layout-{0}".format(name));
            var region_sp = el.children(".ujs-layout-{0}-split".format(name));
            var region_hd = el.children(".ujs-layout-{0}-hide".format(name));
            if (name == "north" || name == "south") {
                var height = 0;
                if (opts.regions[name].expand) {
                    if (region.length > 0) height += region.outerHeight();
                    if (region_sp.length > 0) height += region_sp.outerHeight();
                }
                else {
                    if (region_hd.length > 0) height += region_hd.outerHeight();
                }
                return height;
            }
            if (name == "west" || name == "east") {
                var width = 0;
                if (opts.regions[name].expand) {
                    if (region.length > 0) width += region.outerWidth();
                    if (region_sp.length > 0) width += region_sp.outerWidth();
                }
                else {
                    if (region_hd.length > 0) width += region_hd.outerWidth();
                }
                return width;
            }
        }
        function render(isrender) {
            var isr = isrender == false ? false : true;
            if (opts.autoHeight) el.height($("body").height() - 2);
            var height = el.height(), width = el.width(), top = 0, left = 0;
            for (var i in opts.regions) {
                var opt = opts.regions[i];
                if (i == "north") {
                    height -= getregionwh(i);
                    top += getregionwh(i);
                }
                if (i == "south") {
                    height -= getregionwh(i);
                }
                if (i == "west") {
                    width -= getregionwh(i);
                    left += getregionwh(i);
                }
                if (i == "east") {
                    width -= getregionwh(i);
                }
            }
            el.children(".ujs-layout-north-split").css({ top: el.children(".ujs-layout-north").outerHeight() });
            el.children(".ujs-layout-north .ujs-layout")
            el.children(".ujs-layout-south-split").css({ top: getregionwh("north") + height });
            el.children(".ujs-layout-west").css({ height: height, top: top });
            el.children(".ujs-layout-west-split").css({ height: height, top: top, left: el.children(".ujs-layout-west").outerWidth() });
            el.children(".ujs-layout-west-hide").css({ height: height, top: top });
            el.children(".ujs-layout-east").css({ height: height, top: top });
            el.children(".ujs-layout-east-split").css({ height: height, top: top, left: getregionwh("west") + width });
            el.children(".ujs-layout-east-hide").css({ height: height, top: top });
            el.children(".ujs-layout-center").css({ width: width, height: height, top: top, left: left });
            function renderhelp(region) {
                if (region == "center") return;
                var value = {
                    north: { expand: { top: 0 }, collapse: { top: -el.children(".ujs-layout-north").outerHeight()} },
                    south: { expand: { top: getregionwh("north") + height + el.children(".ujs-layout-south-split").outerHeight() }, collapse: { top: el.height()} },
                    west: { expand: { left: 0 }, collapse: { left: -$(".ujs-layout-west").outerWidth()} },
                    east: { expand: { left: getregionwh("west") + width + el.children(".ujs-layout-east-split").outerWidth() }, collapse: { left: el.width()} }
                };
                if (opts.regions[region].expand) {
                    if (isr) el.children(".ujs-layout-{0}".format(region)).css(value[region].expand);
                    else el.children(".ujs-layout-{0}".format(region)).animate(value[region].expand);
                    el.children(".ujs-layout-{0}-split".format(region)).show();
                }
                else {
                    if (isr) el.children(".ujs-layout-{0}".format(region)).css(value[region].collapse);
                    else el.children(".ujs-layout-{0}".format(region)).animate(value[region].collapse);
                    el.children(".ujs-layout-{0}-split".format(region)).hide();
                }
            }
            for (var i in opts.regions) {
                renderhelp(i);
                var regionHeight = el.children(".ujs-layout-{0}".format(i)).height();
                var regionHeaderHeight = el.children(".ujs-layout-{0}".format(i)).children(".ujs-layout-header").outerHeight();
                if (regionHeaderHeight == null) {
                    regionHeaderHeight = 0;
                }
                el.children(".ujs-layout-{0}".format(i)).children(".ujs-layout-panel").height(regionHeight - regionHeaderHeight);
            }
        }
        $(window).resize(render);
        el.addRegion = function (option) {
            if (option == undefined || option.region == undefined || !opts.regionTags.contains(option.region)) {
                return;
            }
            if (el.children(".ujs-layout-{0}".format(option.region)).length > 0) {
                return;
            }
            var tag = option.region;
            var region = opts.regions[tag] = { title: "", split: true, iconCls: "", expand: true, url: "" };
            if (typeof (option.title) == "string") {
                region.title = option.title;
            }
            if (option.split == false) {
                region.split = option.split;
            }
            if (typeof (option.iconCls) == "string") {
                region.iconCls = option.iconCls;
            }
            if (option.expand == false) {
                region.expand = option.expand;
            }
            if (typeof (option.url) == "string") {
                region.url = option.url;
            }
            var el_region = $("<div class=\"ujs-layout-{0}\"></div>".format(tag));
            el.append(el_region);
            if (region.title) {
                var el_region_header_expand = tag == "center" ? "" : "<span class=\"{0}\"></span>".format(tag);
                var el_region_header = $("<div class=\"ujs-layout-header\"><label class=\"{0}\">{1}</label>{2}</div>".format(region.iconCls, region.title, el_region_header_expand));
                el_region.append(el_region_header);
                if (tag != "center") {
                    el_region_header.children("span").hover(function () {
                        $(this).css("opacity", 1);
                    }, function () {
                        $(this).css("opacity", 0.6);
                    }).click(function () {
                        region.expand = false;
                        render(false);
                    });
                    var el_region_hide = $("<div class=\"ujs-layout-{0}-hide\"><span class=\"{0}\"></span></div>".format(tag));
                    el_region.after(el_region_hide);
                    el_region_hide.click(function () {
                        if (tag == "north")
                            $(".ujs-layout-{0}".format(tag)).animate({ top: 0 });
                        if (tag == "south")
                            $(".ujs-layout-{0}".format(tag)).animate({ top: el.height() - $(".ujs-layout-{0}".format(tag)).outerHeight() });
                        if (tag == "west")
                            $(".ujs-layout-{0}".format(tag)).animate({ left: 0 });
                        if (tag == "east")
                            $(".ujs-layout-{0}".format(tag)).animate({ left: el.width() - $(".ujs-layout-{0}".format(tag)).outerWidth() });
                        $(".ujs-layout-{0}".format(tag)).mouseleave(function () {
                            $(this).unbind("mouseleave");
                            if (tag == "north")
                                $(".ujs-layout-{0}".format(tag)).animate({ top: -$(".ujs-layout-{0}".format(tag)).outerHeight() });
                            if (tag == "south")
                                $(".ujs-layout-{0}".format(tag)).animate({ top: el.height() });
                            if (tag == "west")
                                $(".ujs-layout-{0}".format(tag)).animate({ left: -$(".ujs-layout-{0}".format(tag)).outerWidth() });
                            if (tag == "east")
                                $(".ujs-layout-{0}".format(tag)).animate({ left: el.width() });
                        });
                    });
                    el_region_hide.children("span").hover(function () {
                        $(this).css("opacity", 1);
                    }, function () {
                        $(this).css("opacity", 0.6);
                    }).click(function (evt) {
                        region.expand = true;
                        render();
                        evt.stopPropagation();
                    });
                }
            }
            var el_region_panel = $("<div class=\"ujs-layout-panel\"></div>");
            el_region.append(el_region_panel);
            if (region.split && tag != "center") {
                var el_region_split = $("<div class=\"ujs-layout-{0}-split\"></div>".format(tag));
                el_region.after(el_region_split);
                el_region_split.mousedown(function (de) {
                    var spmove = $("<div class=\"ujs-layout-{0}-split-move\"></div>".format(tag)),
                                    ismove = true,
                                    offset = 0,
                                    cursor;
                    if (tag == "north" || tag == "south") {
                        spmove.css({ top: $(this).position().top });
                        offset = de.pageY - $(this).position().top;
                        cursor = "n-resize";
                    }
                    else {
                        spmove.css({ left: $(this).position().left, height: $(this).height(), top: $(this).position().top });
                        offset = de.pageX - $(this).position().left;
                        cursor = "w-resize";
                    }
                    el.append(spmove);
                    $("body").bind("selectstart", function () { return false; }).css("-moz-user-select", "none").css("cursor", cursor);
                    el.mousemove(function (me) {
                        if (ismove) {
                            if (tag == "north" || tag == "south")
                                spmove.css({ top: me.pageY - offset });
                            else
                                spmove.css({ left: me.pageX - offset });
                        }
                    });
                    spmove.mouseup(function () {
                        var regel = el.children(".ujs-layout-{0}".format(tag));
                        if (tag == "north")
                            regel.height(spmove.position().top);
                        if (tag == "south")
                            regel.height(el.height() - spmove.position().top - spmove.outerHeight());
                        if (tag == "west")
                            regel.width(spmove.position().left);
                        if (tag == "east")
                            regel.width(el.width() - spmove.position().left - spmove.outerWidth());
                        render();
                        spmove.remove();
                        ismove = false;
                        el.unbind("mousemove");
                        $("body").unbind("selectstart").css("-moz-user-select", "").css("cursor", "default");

                    });
                });
            }
            if (region.url != "") {
                el_region_panel.empty();
                var ifr = $("<iframe class=\"ujs-layout-ifr\" src=\"{0}\"></iframe>".format(region.url))
                el_region_panel.append(ifr);
            }
            render();
        };
        el.removeRegion = function (region) {
            delete opts.regions[region];
            $(".ujs-layout-{0},.ujs-layout-{0}-split,.ujs-layout-{0}-hide".format(region)).each(function () {
                $(this).remove();
            });
            render();
        };
        el.expand = function (region) {
            if (opts.regions[region] == undefined)
                return;
            if (opts.regions[region].title == "")
                return;
            if (opts.regions[region].expand)
                return;
            $(".ujs-layout-{0}-hide span".format(region)).click();
        };
        el.collapse = function (region) {
            if (opts.regions[region] == undefined)
                return;
            if (opts.regions[region].title == undefined)
                return;
            if (!opts.regions[region].expand)
                return;
            $(".ujs-layout-{0} .ujs-layout-header span".format(region)).click();
        };
        el.getPanel = function (region) {
            var panel = $(".ujs-layout-{0} .ujs-layout-panel".format(region));
            if (panel.length == 0) return;
            return panel;
        };
        el.resize = function () {
            opts.autoHeight = false;
            render();
        };
        create();
        return el;
    },
    accordion: function (option) {
        var el = this, opts = { multiple: false, items: [] };
        if (el.length == 0) {
            return;
        }
        if (option == undefined) {
            option = {};
        }
        if (typeof (option.multiple) == false) {
            opts.multiple = true;
        }
        else {
            if (el.attr("multiple") == "multiple") {
                opts.multiple = true;
            }
        }
        el.children(".ujs-accordion-item").each(function () {
            var item = { selected: false, title: "", iconCls: "" };
            if ($(this).attr("selected") == "selected") {
                if (!opts.multiple) {
                    for (var i = 0; i < opts.items.length; i++) {
                        opts.items[i].selected = false;
                    }
                }
                item.selected = true;
            }
            if (typeof ($(this).attr("title")) == "string") {
                item.title = $(this).attr("title");
            }
            if (typeof ($(this).attr("iconCls")) == "string") {
                item.iconCls = $(this).attr("iconCls");
            }
            opts.items.push(item);
        });
        if ($.isArray(option.items)) {
            for (var i = 0; i < option.items.length; i++) {
                el.addItem(option.items[i]);
            }
        }
        function create() {
            el.removeAttr("multiple");
            el.children(".ujs-accordion-item").each(function (i) {
                $(this).removeAttr("selected");
                $(this).removeAttr("title");
                $(this).removeAttr("iconCls");
                var el_panel = $("<div class=\"ujs-accordion-panel\"></div>");
                $(this).after(el_panel);
                el_panel.html($(this).html());
                el_panel.attr("ah", el_panel.height());
                el_panel.height(0);
                $(this).empty();
                var el_tt = $("<label class=\"{0}\">{1}</label>".format(opts.items[i].iconCls, opts.items[i].title));
                var el_ct = $("<span></span>");
                $(this).append(el_tt);
                $(this).append(el_ct);
                $(this).hover(function () {
                    $(this).children("span").css("opacity", 1);
                }, function () {
                    $(this).children("span").css("opacity", 0.6);
                }).click(function () {
                    var index = el.children(".ujs-accordion-item").index($(this));
                    if (!opts.multiple) {
                        for (var i = 0; i < opts.items.length; i++) {
                            if (index != i)
                                opts.items[i].selected = false;
                        }
                    }
                    if (opts.items[index].selected) {
                        opts.items[index].selected = false;
                    }
                    else {
                        opts.items[index].selected = true;
                    }
                    render();
                });
            });
            render(true);
        }
        function render(layout) {
            for (var i = 0; i < opts.items.length; i++) {
                var item = el.children(".ujs-accordion-item").eq(i);
                if (opts.items[i].selected) {
                    item.addClass("ujs-accordion-item-selected");
                    item.next().css("display", "block");
                    if (layout == true) {
                        item.next().css("height", "auto");
                    }
                    else {
                        item.next().animate({ height: parseInt(item.next().attr("ah")) }, function () {
                            item.next().css("height", "auto");
                        });
                    }
                }
                else {
                    item.removeClass("ujs-accordion-item-selected");
                    if (layout == false) {
                        $(this).css({ height: 0, display: "none" });
                    }
                    else {
                        item.next().animate({ height: 0 }, function () {
                            $(this).css("display", "none");
                        });
                    }
                }
            }
        }
        el.addItem = function (option) {
            var item = { selected: false, title: "", iconCls: "" };
            if (option == undefined) {
                option = {};
            }
            if (option.selected == true) {
                if (!opts.multiple) {
                    for (var i = 0; i < opts.items.length; i++) {
                        opts.items[i].selected = false;
                    }
                }
                item.selected = true;
            }
            if (typeof (option.title) == "string") {
                item.title = option.title;
            }
            if (typeof (option.iconCls) == "string") {
                item.iconCls = option.iconCls;
            }
            opts.items.push(item);
            var el_item = $("<div class=\"ujs-accordion-item\"><label class=\"{0}\">{1}</label><span></span><div>".format(item.iconCls, item.title));
            var el_panel = $("<div class=\"ujs-accordion-panel\"></div>");
            el.append(el_item);
            el.append(el_panel);
            el_item.hover(function () {
                $(this).children("span").css("opacity", 1);
            }, function () {
                $(this).children("span").css("opacity", 0.6);
            }).click(function () {
                var index = $(this).index();
                if (!opts.multiple) {
                    for (var i = 0; i < opts.items.length; i++) {
                        if (index != i)
                            opts.items[i].selected = false;
                    }
                }
                if (opts.items[index].selected) {
                    opts.items[index].selected = false;
                }
                else {
                    opts.items[index].selected = true;
                }
                render();
            });
        };
        el.removeItem = function (which) {
            var index;
            if (typeof (which) == "number") {
                index = which;
            }
            if (typeof (which) == "string") {
                for (var i in opts.items) {
                    if (opts.items[i].title == which) {
                        index = i;
                    }
                }
            }
            if (index) {
                el.children(".ujs-accordion-item").eq(index).remove();
                el.children(".ujs-accordion-panel").eq(index).remove();
                opts.items.splice(index, 1);
            }
        };
        el.getPanel = function (which) {
            if (typeof (which) == "number") {
                return el.children(".ujs-accordion-panel").eq(which);
            }
            if (typeof (which) == "string") {
                for (var i in opts.items) {
                    if (opts.items[i].title == which) {
                        return el.children(".ujs-accordion-panel").eq(i);
                    }
                }
            }
            return [];
        };
        el.getSelected = function () {
            return el.children(".ujs-accordion-item-selected").eq(0).next();
        };
        el.getSelections = function () {
            return el.children(".ujs-accordion-item-selected").next();
        };
        el.getIndex = function (item) {
            return el.children(".ujs-accordion-item").index(item);
        };
        el.select = function (which) {
            if (!opts.multiple) {
                for (var i = 0; i < opts.items.length; i++) {
                    opts.items[i].selected = false;
                }
            }
            if (typeof (which) == "number") {
                opts.items[which].selected = true;
            }
            if (typeof (which) == "string") {
                for (var i = 0; i < opts.items.length; i++) {
                    if (opts.items[i].title == which) {
                        opts.items[i].selected = true;
                    }
                }
            }
            render();
        };
        el.unselect = function (which) {
            if (typeof (which) == "number") {
                opts.items[which].selected = false;
            }
            if (typeof (which) == "string") {
                for (var i = 0; i < opts.items.length; i++) {
                    if (opts.items[i].title == which) {
                        opts.items[i].selected = false;
                    }
                }
            }
            render();
        };
        create();
        return el;
    },
    tabs: function (option) {
        var el = this, opts = { showHeader: true, items: [] };
        if (el.length == 0) {
            return;
        }
        if (option == undefined) {
            option = {};
        }
        if (option.showHeader == false) {
            opts.showHeader = false;
        }
        else {
            if (el.attr("showHeader") == "false") {
                opts.showHeader = false;
            }
        }
        function create() {
            var el_tabs = $("<div class=\"ujs-tabs-tabs\"><div class=\"ujs-tabs-tabs-items\"></div></div>");
            var el_items = el_tabs.children(".ujs-tabs-tabs-items");
            var el_tools = el.children(".ujs-tabs-tools");
            var el_control = $("<div class=\"ujs-tabs-control\"><a class=\"left\"></a><a class=\"right\"></a></div>");
            el_tabs.append(el_control);
            if (el_tools.length > 0) {
                el_tabs.append(el_tools);
            }
            if (el.children().length > 0) {
                el.children().eq(0).before(el_tabs);
            }
            else {
                el.append(el_tabs);
            }
            el.children(".ujs-tabs-item").each(function () {
                var item = { title: "", selected: false, iconCls: "", closable: false, url: "" };
                if (typeof ($(this).attr("title")) == "string") {
                    item.title = $(this).attr("title");
                }
                if ($(this).attr("selected") == "selected") {
                    for (var i = 0; i < opts.items.length; i++) {
                        opts.items[i].selected = false;
                    }
                    item.selected = true;
                }
                if (typeof ($(this).attr("iconCls")) == "string") {
                    item.iconCls = $(this).attr("iconCls");
                }
                if ($(this).attr("closable") == "true") {
                    item.closable = true;
                }
                if (typeof ($(this).attr("url")) == "string") {
                    item.url = $(this).attr("url");
                }
                opts.items.push(item);
                $(this).removeClass("ujs-tabs-item").addClass("ujs-tabs-panel");
                $(this).removeAttr("title").removeAttr("selected").removeAttr("iconCls").removeAttr("closable").removeAttr("url");
                if (item.url != "") {
                    $(this).empty();
                    var ifr = $("<iframe class=\"ujs-tabs-panel-ifr\" src=\"{0}\"></iframe>".format(item.url))
                    $(this).append(ifr);
                }
                var el_item = $("<div class=\"ujs-tabs-tabs-item\"><label class=\"{0}\">{1}</label>{2}</div>".format(item.iconCls, item.title, item.closable ? "<a></a>" : ""))
                el_items.append(el_item);
                el_item.click(function () {
                    var index = $(this).index();
                    el.select(index);
                }).children("a").click(function () {
                    var index = $(this).parent().index();
                    el.removeItem(index);
                });
            });
            if (option != undefined && option.items != undefined && $.isArray(option.items)) {
                for (var i = 0; i < option.items.length; i++) {
                    el.addItem(option.items[i]);
                }
            }
            var ismove = false;
            el_control.children(".left").click(function () {
                if (ismove) {
                    return;
                }
                var distance = el_items.position().left + 100;
                if (distance > 0) {
                    distance = 0;
                }
                ismove = true;
                el_items.animate({ left: distance }, 300, function () {
                    ismove = false;
                });
            });
            el_control.children(".right").click(function () {
                if (ismove) {
                    return;
                }
                var toolswidth = el.find(".ujs-tabs-tabs .ujs-tabs-tools").outerWidth(),
                    controlwidth = el.find(".ujs-tabs-tabs .ujs-tabs-control").outerWidth(),
                    tabsitemswidth = el.find(".ujs-tabs-tabs .ujs-tabs-tabs-items").outerWidth(),
                    tabswidth = el.children(".ujs-tabs-tabs").width();
                var distance = el_items.position().left - 100;
                if (distance + toolswidth + controlwidth + tabsitemswidth < tabswidth) {
                    distance = tabswidth - toolswidth - controlwidth - tabsitemswidth;
                }
                ismove = true;
                el_items.animate({ left: distance }, 300, function () {
                    ismove = false;
                });
            });
            render();
        }
        function render() {
            var width = el.width(),
                tabsitemswidth = 4,
                height = el.height(),
                tabsheight = 0,
                tabswidth = el.children(".ujs-tabs-tabs").width(),
                toolswidth = el.find(".ujs-tabs-tabs .ujs-tabs-tools").outerWidth(),
                controlwidth = el.find(".ujs-tabs-tabs .ujs-tabs-control").outerWidth();
            if (opts.showHeader) {
                el.children(".ujs-tabs-tabs").show();
                tabsheight = el.children(".ujs-tabs-tabs").outerHeight();
            }
            else {
                el.children(".ujs-tabs-tabs").hide();
                tabsheight = 0;
            }
            el.find(".ujs-tabs-tabs .ujs-tabs-tabs-items .ujs-tabs-tabs-item").each(function () {
                tabsitemswidth += $(this).outerWidth() + 4;
            });
            el.find(".ujs-tabs-tabs .ujs-tabs-control").css("right", toolswidth);
            if (tabsitemswidth > tabswidth - toolswidth) {
                el.find(".ujs-tabs-tabs .ujs-tabs-control").show();
            }
            else {
                el.find(".ujs-tabs-tabs .ujs-tabs-control").hide();
            }
            el.find(".ujs-tabs-tabs .ujs-tabs-tabs-items").width(tabsitemswidth);

            for (var i = 0; i < opts.items.length; i++) {
                var tab = el.find(".ujs-tabs-tabs .ujs-tabs-tabs-items .ujs-tabs-tabs-item").eq(i);
                var panel = el.children(".ujs-tabs-panel").eq(i);
                if (opts.items[i].selected) {
                    tab.addClass("ujs-tabs-tabs-item-selected");
                    panel.show();
                }
                else {
                    tab.removeClass("ujs-tabs-tabs-item-selected");
                    panel.hide();
                }
                panel.css({ width: width, height: height - tabsheight, top: tabsheight, left: 0 });
            }
        }
        el.addItem = function (option) {
            var item = { title: "", selected: false, iconCls: "", closable: false, url: "" };
            if (option != undefined && typeof (option.title) == "string") {
                item.title = option.title;
            }
            if (option != undefined && option.selected == true) {
                for (var i = 0; i < opts.items.length; i++) {
                    opts.items[i].selected = false;
                }
                item.selected = true;
            }
            if (option != undefined && typeof (option.iconCls) == "string") {
                item.iconCls = option.iconCls;
            }
            if (option != undefined && option.closable == true) {
                item.closable = true;
            }
            if (option != undefined && typeof (option.url) == "string") {
                item.url = option.url;
            }
            opts.items.push(item);
            var el_item = $("<div class=\"ujs-tabs-tabs-item\"><label class=\"{0}\">{1}</label>{2}</div>".format(item.iconCls, item.title, item.closable ? "<a></a>" : ""))
            var el_panel = $("<div class=\"ujs-tabs-panel\"></div>");
            el.find(".ujs-tabs-tabs .ujs-tabs-tabs-items").append(el_item);
            el.append(el_panel);
            el_item.click(function () {
                var index = $(this).index();
                el.select(index);
            }).children("a").click(function () {
                var index = $(this).parent().index();
                el.removeItem(index);
            });
            render();
        }
        el.removeItem = function (witch) {
            var index;
            if (typeof (witch) == "number") {
                index = witch;
            }
            if (typeof (witch) == "string") {
                for (var i = 0; i < opts.items.length; i++) {
                    if (opts.items[i].title == witch) {
                        index = i;
                        break;
                    }
                }
            }
            if (opts.items[index].selected) {
                var newindex;
                if (opts.items.length > 1) {
                    if (index == 0) {
                        newindex = 1;
                    }
                    else {
                        newindex = index - 1;
                    }
                    opts.items[newindex].selected = true;
                }
            }
            opts.items.splice(index, 1);
            el.find(".ujs-tabs-tabs .ujs-tabs-tabs-items .ujs-tabs-tabs-item").eq(index).remove();
            el.children(".ujs-tabs-panel").eq(index).remove();
            render();
        };
        el.select = function (witch) {
            if (typeof (witch) == "number") {
                if (opts.items[witch].selected) {
                    return;
                }
                for (var i = 0; i < opts.items.length; i++) {
                    opts.items[i].selected = false;
                }
                opts.items[witch].selected = true;
            }
            if (typeof (witch) == "string") {
                for (var i = 0; i < opts.items.length; i++) {
                    if (opts.items[i].title == witch) {
                        if (opts.items[i].selected) {
                            return;
                        }
                        for (var item = 0; item < opts.items.length; item++) {
                            opts.items[item].selected = false;
                        }
                        opts.items[i].selected = true;
                    }
                }
            }
            render();
        };
        el.showHeader = function () {
            opts.showHeader = true;
            render();
            render();
        };
        el.hideHeader = function () {
            opts.showHeader = false;
            render();
        };
        el.getPanel = function (witch) {
            var index;
            if (typeof (witch) == "number") {
                index = witch;
            }
            if (typeof (witch) == "string") {
                for (var i = 0; i < opts.items.length; i++) {
                    if (opts.items[i].title == witch) {
                        index = i;
                        break;
                    }
                }
            }
            return el.children(".ujs-tabs-panel").eq(index);
        };
        create();
        $(window).resize(render);
        return el;
    },
    panel: function (option) {
        var el = this;
        el.css("border", "1px solid #f00");
        return el;
    },
    button: function (option) {
        var el = this, opts = { disabled: false, iconCls: "", value: "", toolTip: "" };
        if (el.length == 0) {
            return;
        }
        if (option == undefined) {
            option = {};
        }
        if (typeof (option.disabled) == "boolean") {
            opts.disabled = option.disabled;
        }
        else {
            if (el.attr("disabled") == "disabled") {
                opts.disabled = true;
            }
        }
        if (typeof (option.iconCls) == "string") {
            opts.iconCls = option.iconCls;
        }
        else {
            if (typeof (el.attr("iconCls")) == "string") {
                opts.iconCls = el.attr("iconCls");
            }
        }
        if (typeof (option.value) == "string") {
            opts.value = option.value;
        }
        else {
            if (typeof (el.attr("value")) == "string") {
                opts.value = el.attr("value");
            }
        }
        if (typeof (option.toolTip) == "string") {
            opts.toolTip = option.toolTip;
        }
        else {
            if (typeof (el.attr("toolTip")) == "string") {
                opts.toolTip = el.attr("toolTip");
            }
        }
        function create() {
            var id = "", style = "", cls = "";
            if (typeof (el.attr("id")) == "string") {
                id = el.attr("id");
            }
            if (typeof (el.attr("style")) == "string") {
                style = el.attr("style");
            }
            if (typeof (el.attr("class")) == "string") {
                cls = el.attr("class");
            }
            var el_con = $("<div id=\"{0}\" class=\"{1} ujs-noneselect\" style=\"{2}\"><label></label></div>".format(id, cls, style));
            el.replaceWith(el_con);
            el = el_con;
            el.mousedown(function () {
                if (opts.disabled) return;
                $(this).addClass("ujs-button-press");
            }).mouseup(function () {
                if (opts.disabled) return;
                $(this).removeClass("ujs-button-press");
            }).hover(function () {
                if (opts.disabled) return;
                $(this).addClass("ujs-button-hover");
            }, function () {
                if (opts.disabled) return;
                $(this).removeClass("ujs-button-hover");
                $(this).removeClass("ujs-button-press");
            });
            render();
        }
        function render() {
            if (opts.disabled) {
                el.addClass("ujs-button-disabled");
            }
            else {
                el.removeClass("ujs-button-disabled");
            }
            if (opts.iconCls != "") {
                el.children("label").addClass(opts.iconCls);
            }
            else {
                el.children("label").removeClass(opts.iconCls);
            }
            el.children("label").html(opts.value);
            el.attr("title", opts.toolTip);
            el.children("label").css("line-height", el.height() + "px");
        }
        create();
        el.setValue = function (value) {
            opts.value = value;
            render();
        };
        el.getValue = function () {
            return opts.value;
        };
        el.disable = function () {
            opts.disabled = true;
            render();
        };
        el.enable = function () {
            opts.disabled = false;
            render();
        }
        return el;
    },
    textbox: function (option) {
        var el = this,
            opts = { disabled: false, empty: "", value: "", toolTip: "", vType: "", vRegexp: "", vText: "", password: false },
            isValidate = true,
            results = "";
        if (el.length == 0) {
            return;
        }
        if (option == undefined) {
            option = {};
        }
        if (typeof (option.disabled) == "boolean") {
            opts.disabled = option.disabled;
        }
        else {
            if (el.attr("disabled") == "disabled") {
                opts.disabled = true;
            }
        }
        if (typeof (option.empty) == "string") {
            opts.empty = option.empty;
        }
        else {
            if (typeof (el.attr("empty")) == "string") {
                opts.empty = el.attr("empty");
            }
        }
        if (typeof (option.value) == "string") {
            opts.value = option.value;
        }
        else {
            if (typeof (el.attr("value")) == "string") {
                opts.value = el.attr("value");
            }
        }
        if (typeof (option.toolTip) == "string") {
            opts.toolTip = option.toolTip;
        }
        else {
            if (typeof (el.attr("toolTip")) == "string") {
                opts.toolTip = el.attr("toolTip");
            }
        }
        if (typeof (option.vType) == "string") {
            opts.vType = option.vType;
        }
        else {
            if (typeof (el.attr("vType")) == "string") {
                opts.vType = el.attr("vType");
            }
        }
        if (typeof (option.vRegexp) == "string") {
            opts.vRegexp = option.vRegexp;
        }
        else {
            if (typeof (el.attr("vRegexp")) == "string") {
                opts.vRegexp = el.attr("vRegexp");
            }
        }
        if (typeof (option.vText) == "string") {
            opts.vText = option.vText;
        }
        else {
            if (typeof (el.attr("vText")) == "string") {
                opts.vText = el.attr("vText");
            }
        }
        if (typeof (option.password) == "boolean") {
            opts.password = option.password;
        }
        else {
            if (el.attr("password") == "true") {
                opts.password = true;
            }
        }
        function create() {
            var id = "", style = "", cls = "";
            if (typeof (el.attr("id")) == "string") {
                id = el.attr("id");
            }
            if (typeof (el.attr("style")) == "string") {
                style = el.attr("style");
            }
            if (typeof (el.attr("class")) == "string") {
                cls = el.attr("class");
            }
            var el_con = $("<div class=\"{0}\" style=\"{1}\"><input id=\"{2}\" type=\"text\" /><div class=\"ujs-tooltip-right\"><span></span><label></label></div></div>".format(cls, style, id));
            el.replaceWith(el_con);
            el = el_con.children("input");
            el.hover(function () {
                if (!isValidate) {
                    el.next().show();
                }
            }, function () {
                el.next().hide();
            }).focus(function () {
                $(this).parent().addClass("ujs-textbox-focus");
                el.parent().removeClass("ujs-textbox-empty");
                el.val(opts.value);
            }).blur(function () {
                $(this).parent().removeClass("ujs-textbox-focus");
                opts.value = el.val();
                render();
                el.validate();
            });
            render();
        }
        function render() {
            if (opts.disabled) {
                el.parent().addClass("ujs-textbox-disabled");
                el.attr("disabled", true);
            }
            else {
                el.parent().removeClass("ujs-textbox-disabled");
                el.attr("disabled", false);
            }
            if (opts.empty != "" && opts.value == "") {
                el.parent().addClass("ujs-textbox-empty");
                el.val(opts.empty);
            }
            else {
                el.parent().removeClass("ujs-textbox-empty");
                el.val(opts.value);
            }
            if (opts.password) {
                el.attr("type", "password");
            }
            else {
                el.attr("type", "text");
            }
            el.parent().attr("title", opts.toolTip);
            el.css("line-height", el.parent().height() + "px");
            el.width(el.parent().width() - 10);
            if (!isValidate) {
                el.next().children("label").html(results);
                el.next().css({ top: -3, left: el.parent().outerWidth() + 14 });
                el.parent().addClass("ujs-textbox-error");

            }
            else {
                el.next().children("label").html("");
                el.parent().removeClass("ujs-textbox-error");
            }
        }
        create();
        el.validate = function () {
            if (opts.vType == "") {
                return;
            }
            isValidate = true;
            results = "";
            var parts = opts.vType.split(",");
            for (var i = 0; i < parts.length; i++) {
                if (parts[i].indexOf("required") == 0) {
                    if (opts.value == "") {
                        results += "不能为空<br />";
                        isValidate = false;
                    }
                }
                else if (parts[i].indexOf("email") == 0) {
                    var part = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
                    if (!part.test(opts.value)) {
                        results += "请输入邮件格式<br />";
                        isValidate = false;
                    }
                }
                else if (parts[i].indexOf("url") == 0) {
                    var part = /[a-zA-z]+:\/\/[^\s]*/;
                    if (!part.test(opts.value)) {
                        results += "请输入URL格式<br />";
                        isValidate = false;
                    }
                }
                else if (parts[i].indexOf("float") == 0) {
                    var part = /^\-?(0\.|[1-9]\d*\.?)\d*$/;
                    if (!part.test(opts.value)) {
                        results += "请输入数字<br />";
                        isValidate = false;
                    }
                }
                else if (parts[i].indexOf("int") == 0) {
                    var part = /^\-?[1-9]\d*$/;
                    if (!part.test(opts.value)) {
                        results += "请输入整数<br />";
                        isValidate = false;
                    }
                }
                else if (parts[i].indexOf("maxValue") == 0) {
                    var s = parseFloat(opts.value);
                    var t = parseFloat(parts[i].substring(3));
                    if (s > t) {
                        results += "数字不能大于 {0}<br />".format(t);
                        isValidate = false;
                    }
                }
                else if (parts[i].indexOf("minValue") == 0) {
                    var s = parseFloat(opts.value);
                    var t = parseFloat(parts[i].substring(3));
                    if (s < t) {
                        results += "数字不能小于 {0}<br />".format(t);
                        isValidate = false;
                    }
                }
                else if (parts[i].indexOf("maxLength") == 0) {
                    var s = opts.value.length;
                    var t = parseInt(parts[i].substring(9));
                    if (s > t) {
                        results += "不能超过 {0} 个字符<br />".format(t);
                        isValidate = false;
                    }
                }
                else if (parts[i].indexOf("minLength") == 0) {
                    var s = opts.value.length;
                    var t = parseInt(parts[i].substring(9));
                    if (s < t) {
                        results += "不能少于 {0} 个字符<br />".format(t);
                        isValidate = false;
                    }
                }
                else if (parts[i].indexOf("reenter") == 0) {
                    var s = opts.value;
                    var t = $(parts[i].substring(9)).val();
                    if (s != t) {
                        results += "两次输入不一致<br />".format(t);
                        isValidate = false;
                    }
                }
                else if (parts[i].indexOf("custom") == 0) {
                    var part = new RegExp(opts.vRegexp);
                    if (!part.test(opts.value)) {
                        results += opts.vText + "<br />";
                        isValidate = false;
                    }
                }
            }
            render();
        };
        el.getValue = function () {
            return el.val();
        };
        el.setValue = function (value) {
            el.val(value);
        };
        el.enable = function () {
            opts.disabled = false;
            render();
        };
        el.disable = function () {
            opts.disabled = true;
            render();
        };
        return el;
    },
    textarea: function (option) {
        var el = this,
            opts = { disabled: false, empty: "", value: "", toolTip: "", vType: "", vRegexp: "", vText: "" },
            isValidate = true,
            results = "";
        if (el.length == 0) {
            return;
        }
        if (option == undefined) {
            option = {};
        }
        if (typeof (option.disabled) == "boolean") {
            opts.disabled = option.disabled;
        }
        else {
            if (el.attr("disabled") == "disabled") {
                opts.disabled = true;
            }
        }
        if (typeof (option.empty) == "string") {
            opts.empty = option.empty;
        }
        else {
            if (typeof (el.attr("empty")) == "string") {
                opts.empty = el.attr("empty");
            }
        }
        if (typeof (option.value) == "string") {
            opts.value = option.value;
        }
        else {
            if (typeof (el.attr("value")) == "string") {
                opts.value = el.attr("value");
            }
        }
        if (typeof (option.toolTip) == "string") {
            opts.toolTip = option.toolTip;
        }
        else {
            if (typeof (el.attr("toolTip")) == "string") {
                opts.toolTip = el.attr("toolTip");
            }
        }
        if (typeof (option.vType) == "string") {
            opts.vType = option.vType;
        }
        else {
            if (typeof (el.attr("vType")) == "string") {
                opts.vType = el.attr("vType");
            }
        }
        if (typeof (option.vRegexp) == "string") {
            opts.vRegexp = option.vRegexp;
        }
        else {
            if (typeof (el.attr("vRegexp")) == "string") {
                opts.vRegexp = el.attr("vRegexp");
            }
        }
        if (typeof (option.vText) == "string") {
            opts.vText = option.vText;
        }
        else {
            if (typeof (el.attr("vText")) == "string") {
                opts.vText = el.attr("vText");
            }
        }
        function create() {
            var id = "", style = "", cls = "";
            if (typeof (el.attr("id")) == "string") {
                id = el.attr("id");
            }
            if (typeof (el.attr("style")) == "string") {
                style = el.attr("style");
            }
            if (typeof (el.attr("class")) == "string") {
                cls = el.attr("class");
            }
            var el_con = $("<div class=\"{0}\" style=\"{1}\"><textarea id=\"{2}\"><textarea/><div class=\"ujs-tooltip-right\"><span></span><label></label></div></div>".format(cls, style, id));
            el.replaceWith(el_con);
            el = el_con.children("textarea");
            el.hover(function () {
                if (!isValidate && !opts.disabled) {
                    el.next().show();
                }
            }, function () {
                if (!opts.disabled) {
                    el.next().hide();
                }
            }).focus(function () {
                $(this).parent().addClass("ujs-textarea-focus");
                el.parent().removeClass("ujs-textarea-empty");
                el.val(opts.value);
            }).blur(function () {
                $(this).parent().removeClass("ujs-textarea-focus");
                opts.value = el.val();
                render();
                el.validate();
            });
            render();
        }
        function render() {
            if (opts.disabled) {
                el.parent().addClass("ujs-textarea-disabled");
                el.attr("disabled", true);
            }
            else {
                el.parent().removeClass("ujs-textarea-disabled");
                el.attr("disabled", false);
            }
            if (opts.empty != "" && opts.value == "") {
                el.parent().addClass("ujs-textarea-empty");
                el.val(opts.empty);
            }
            else {
                el.parent().removeClass("ujs-textarea-empty");
                el.val(opts.value);
            }
            el.parent().attr("title", opts.toolTip);
            el.width(el.parent().width() - 10);
            el.height(el.parent().height() - 10);
            if (!isValidate) {
                el.next().children("label").html(results);
                el.next().css({ top: 0, left: el.parent().outerWidth() + 14 });
                el.parent().addClass("ujs-textarea-error");

            }
            else {
                el.next().children("label").html("");
                el.parent().removeClass("ujs-textarea-error");
            }
        }
        create();
        el.validate = function () {
            if (opts.vType == "") {
                return;
            }
            isValidate = true;
            results = "";
            var parts = opts.vType.split(",");
            for (var i = 0; i < parts.length; i++) {
                if (parts[i].indexOf("required") == 0) {
                    if (opts.value == "") {
                        results += "不能为空<br />";
                        isValidate = false;
                    }
                }
                else if (parts[i].indexOf("maxLength") == 0) {
                    var s = opts.value.length;
                    var t = parseInt(parts[i].substring(9));
                    if (s > t) {
                        results += "不能超过 {0} 个字符<br />".format(t);
                        isValidate = false;
                    }
                }
                else if (parts[i].indexOf("minLength") == 0) {
                    var s = opts.value.length;
                    var t = parseInt(parts[i].substring(9));
                    if (s < t) {
                        results += "不能少于 {0} 个字符<br />".format(t);
                        isValidate = false;
                    }
                }
                else if (parts[i].indexOf("custom") == 0) {
                    var part = new RegExp(opts.vRegexp);
                    if (!part.test(opts.value)) {
                        results += opts.vText + "<br />";
                        isValidate = false;
                    }
                }
            }
            render();
        };
        el.getValue = function () {
            return el.val();
        };
        el.setValue = function (value) {
            el.val(value);
        };
        el.enable = function () {
            opts.disabled = false;
            render();
        };
        el.disable = function () {
            opts.disabled = true;
            render();
        };
        return el;
    },
    combobox: function (option) {
        var el = this,
            opts = { disabled: false, items: [], url: "", allowNullItem: false, multiple: false, editable: false, valueField: "value", textField: "text" },
            isExpand = false;
        if (el.length == 0) {
            return;
        }
        if (option == undefined) {
            option = {};
        }
        if (typeof (option.disabled) == "boolean") {
            opts.disabled = option.disabled;
        }
        else {
            if (el.attr("disabled") == "disabled") {
                opts.disabled = true;
            }
        }
        if (typeof (option.url) == "string") {
            opts.url = option.url;
        }
        else {
            if (typeof (el.attr("url")) == "string") {
                opts.url = el.attr("url");
            }
        }
        if (typeof (option.allowNullItem) == "boolean") {
            opts.allowNullItem = option.allowNullItem;
        }
        else {
            if (el.attr("allowNullItem") == "true") {
                opts.allowNullItem = true;
            }
        }
        if (typeof (option.multiple) == "boolean") {
            opts.multiple = option.multiple;
        }
        else {
            if (el.attr("multiple") == "multiple") {
                opts.multiple = true;
            }
        }
        if (typeof (option.editable) == "boolean") {
            opts.editable = option.editable;
        }
        else {
            if (el.attr("editable") == "true") {
                opts.editable = true;
            }
        }
        if (typeof (option.valueField) == "string") {
            opts.valueField = option.valueField;
        }
        else {
            if (typeof (el.attr("valueField")) == "string") {
                opts.valueField = el.attr("valueField");
            }
        }
        if (typeof (option.textField) == "string") {
            opts.textField = option.textField;
        }
        else {
            if (typeof (el.attr("textField")) == "string") {
                opts.textField = el.attr("textField");
            }
        }
        if (opts.allowNullItem && !opts.multiple) {
            var item = { selected: false };
            item[opts.valueField] = "";
            item[opts.textField] = "";
            opts.items.push(item);
        }
        if (opts.url == "") {
            el.children("option").each(function () {
                var item = { selected: false };
                item[opts.valueField] = $(this).val();
                item[opts.textField] = $(this).html();
                if ($(this).attr("selected") == "selected") {
                    if (!opts.multiple) {
                        for (var i = 0; i < opts.items.length; i++) {
                            opts.items[i].selected = false;
                        }
                    }
                    item.selected = true;
                }
                opts.items.push(item);
            });
            if ($.isArray(option.items)) {
                for (var i = 0; i < option.items.length; i++) {
                    var item = option.items[i];
                    if (item.selected == undefined || typeof (item.selected) != "boolean") {
                        item.selected = false;
                    }
                    if (item[opts.valueField] == undefined) {
                        item[opts.valueField] = "";
                    }
                    if (item[opts.textField] == undefined) {
                        item[opts.textField] = "";
                    }
                    if (item.selected == true) {
                        if (!opts.multiple) {
                            for (var j = 0; j < opts.items.length; j++) {
                                opts.items[j].selected = false;
                            }
                        }
                        item.selected = true;
                    }
                    opts.items.push(item);
                }
            }
        }
        else {
            $.post(opts.url, function (e) {
                if ($.isArray(e)) {
                    for (var i = 0; i < e.length; i++) {
                        el.addItem(e[i]);
                    }
                    render();
                }
            }, "json");
        }
        function create() {
            var id = "", style = "", cls = "";
            if (typeof (el.attr("id")) == "string") {
                id = el.attr("id");
            }
            if (typeof (el.attr("style")) == "string") {
                style = el.attr("style");
            }
            if (typeof (el.attr("class")) == "string") {
                cls = el.attr("class");
            }
            var el_con = $("<div class=\"{0}\" style=\"{1}\" id=\"{2}\"><input class=\"text\" type=\"text\" /><a><span></span></a><ul></ul></div>".format(cls, style, id));
            el.replaceWith(el_con);
            el = el_con;
            var el_items = el.children("ul");
            for (var i = 0; i < opts.items.length; i++) {
                var el_item = $("<li></li>");
                var el_item_select = $("<input type=\"checkbox\" />");
                var el_item_label = $("<label></label>");
                if (opts.multiple) {
                    el_item.append(el_item_select);
                }
                el_item.append(el_item_label);
                el_item.attr("value", opts.items[i][opts.valueField]);
                el_item_label.html(opts.items[i][opts.textField]);
                el_items.append(el_item);
            }
            el.click(function (e) {
                if (opts.disabled) {
                    return;
                }
                e.stopPropagation();
            });
            el.children("input").click(function () {
                if (isExpand) {
                    isExpand = false;
                }
                else {
                    isExpand = true;
                }
                render();
            });
            el.children("a").click(function () {
                if (opts.disabled) {
                    return;
                }
                if (isExpand) {
                    isExpand = false;
                }
                else {
                    isExpand = true;
                }
                render();
            });
            el.find("ul li").each(function () {
                $(this).hover(function () {
                    if (opts.disabled) {
                        return;
                    }
                    $(this).addClass("hover");
                }, function () {
                    if (opts.disabled) {
                        return;
                    }
                    $(this).removeClass("hover");
                }).click(function () {
                    if (opts.disabled) {
                        return;
                    }
                    var index = $(this).index();
                    if (!opts.multiple) {
                        for (var i = 0; i < opts.items.length; i++) {
                            opts.items[i].selected = false;
                        }
                        opts.items[index].selected = true;
                    }
                    else {
                        if (opts.items[index].selected) {
                            opts.items[index].selected = false;
                        }
                        else {
                            opts.items[index].selected = true;
                        }
                    }
                    if (!opts.multiple) {
                        isExpand = false;
                    }
                    render();
                });
            });
            $("body").click(function () {
                isExpand = false;
                render();
            });
            render();
        }
        function render() {
            var el_input = el.children("input");
            var el_control = el.children("a");
            var el_items = el.children("ul");
            var el_item = el.find("ul li");
            el_input.width(el.width() - el.children("a").outerWidth() - 11);
            if ($(document).height() - el.offset().top - el.outerHeight() < 200) {
                el_items.css({ width: el.width(), top: -el_items.outerHeight() - 1 });
            }
            else {
                el_items.css({ width: el.width(), top: el.outerHeight() - 1 });
            }
            el_input.val("");
            if (opts.disabled) {
                el.addClass("ujs-combobox-disabled");
                el_input.prop("disabled", true);
            }
            else {
                el.removeClass("ujs-combobox-disabled");
                el_input.prop("disabled", false);
            }
            if (opts.editable) {
                el_input.prop("readonly", false);
            }
            else {
                el_input.prop("readonly", true);
            }
            for (var i = 0; i < opts.items.length; i++) {
                el_item.eq(i).removeClass("selected");
                if (opts.multiple) {
                    el_item.eq(i).children("input").prop("checked", false);
                }
                if (opts.items[i].selected) {
                    el_item.eq(i).addClass("selected");
                    var inputStr = el_input.val();
                    el_input.val(inputStr == "" ? el_item.eq(i).children("label").html() : "{0},{1}".format(inputStr, el_item.eq(i).children("label").html()));
                    if (opts.multiple) {
                        el_item.eq(i).children("input").prop("checked", true);
                    }
                }
            }
            if (isExpand) {
                el_items.show();
                el_control.addClass("selected");
                if ($(document).height() - el.offset().top - el.outerHeight() < 200) {
                    el.addClass("ujs-combobox-uhover");
                    el_items.addClass("up");
                    el_items.removeClass("down");
                }
                else {
                    el.addClass("ujs-combobox-dhover");
                    el_items.addClass("down");
                    el_items.removeClass("up");
                }
            }
            else {
                el_items.hide();
                el_control.removeClass("selected");
                if ($(document).height() - el.offset().top - el.outerHeight() < 200) {
                    el.removeClass("ujs-combobox-uhover");
                }
                else el.removeClass("ujs-combobox-dhover");
            }
        }
        create();
        el.addItem = function (option) {
            if (option == undefined) return;
            var item = option;
            if (item.selected == undefined || typeof (item.selected) != "boolean") {
                item.selected = false;
            }
            if (item[opts.valueField] == undefined) {
                item[opts.valueField] = "";
            }
            if (item[opts.textField] == undefined) {
                item[opts.textField] = "";
            }
            if (item.selected == true) {
                if (!opts.multiple) {
                    for (var j = 0; j < opts.items.length; j++) {
                        opts.items[j].selected = false;
                    }
                }
                item.selected = true;
            }
            opts.items.push(item);
            var el_item = $("<li></li>");
            var el_item_select = $("<input type=\"checkbox\" />");
            var el_item_label = $("<label></label>");
            if (opts.multiple) {
                el_item.append(el_item_select);
            }
            el_item.append(el_item_label);
            el_item.attr("value", item[opts.valueField]);
            el_item_label.html(item[opts.textField]);
            el.children("ul").append(el_item);
            el_item.hover(function () {
                if (opts.disabled) {
                    return;
                }
                $(this).addClass("hover");
            }, function () {
                if (opts.disabled) {
                    return;
                }
                $(this).removeClass("hover");
            }).click(function () {
                if (opts.disabled) {
                    return;
                }
                var index = $(this).index();
                if (!opts.multiple) {
                    for (var i = 0; i < opts.items.length; i++) {
                        opts.items[i].selected = false;
                    }
                    opts.items[index].selected = true;
                }
                else {
                    if (opts.items[index].selected) {
                        opts.items[index].selected = false;
                    }
                    else {
                        opts.items[index].selected = true;
                    }
                }
                if (!opts.multiple) {
                    isExpand = false;
                }
                render();
            });
            render();
        };
        el.removeItem = function (witch) {
            if ($.isArray(witch)) {
                for (var i = 0; i < witch.length; i++) {
                    el.removeItem(witch[i]);
                }
            }
            else {
                for (var i = 0; i < opts.items.length; i++) {
                    if (opts.items[i][opts.valueField] == witch) {
                        opts.items.splice(i, 1);
                        el.find("ul li").eq(i).remove();
                    }
                }
            }
        };
        el.enable = function () {
            opts.disabled = false;
            render();
        };
        el.disable = function () {
            opts.disabled = true;
            render();
        };
        el.getValue = function () {
            var res;
            if (opts.multiple) {
                res = [];
                for (var i = 0; i < opts.items.length; i++) {
                    if (opts.items[i].selected) {
                        var item = $.objClone(opts.items[i], "selected");
                        res.push(item);
                    }
                }
            }
            else {
                for (var i = 0; i < opts.items.length; i++) {
                    if (opts.items[i].selected) {
                        res = $.objClone(opts.items[i], "selected");
                    }
                }
            }
            return res;
        };
        el.setValue = function (witch) {
            if ($.isArray(witch)) {
                for (var i = 0; i < witch.length; i++) {
                    el.setValue(witch[i]);
                }
            }
            else {
                for (var i = 0; i < opts.items.length; i++) {
                    if (opts.items[i][opts.valueField] == witch) {
                        if (!opts.multiple) {
                            for (var j = 0; j < opts.items.length; j++) {
                                opts.items[j].selected = false;
                            }
                        }
                        opts.items[i].selected = true;
                    }
                }
            }
            render();
        };
        return el;
    },
    checkbox: function (option) {
        var el = this,
            opts = { disabled: false, text: "", value: "" };
        if (el.length == 0) {
            return;
        }
        if (option == undefined) {
            option = {};
        }
        if (typeof (option.disabled) == "boolean") {
            opts.disabled = option.disabled;
        }
        else {
            if (el.attr("disabled") == "disabled") {
                opts.disabled = true;
            }
        }
        if (typeof (option.text) == "string") {
            opts.text = option.text;
        }
        else {
            if (typeof (el.attr("text")) == "string") {
                opts.text = el.attr("text");
            }
        }
        if (typeof (option.value) == "string") {
            opts.value = option.value;
        }
        else {
            if (typeof (el.attr("value")) == "string") {
                opts.value = el.attr("value");
            }
        }
        function create() {
            var id = "", style = "", cls = "";
            if (typeof (el.attr("id")) == "string") {
                id = el.attr("id");
            }
            if (typeof (el.attr("style")) == "string") {
                style = el.attr("style");
            }
            if (typeof (el.attr("class")) == "string") {
                cls = el.attr("class");
            }
            var el_con = $("<div id=\"{0}\" class=\"{1}\" style=\"{2}\"><input id=\"{0}_cb\" type=\"checkbox\" /></div>".format(id, cls, style));
            if (opts.text != "") {
                el_con.append("<label for=\"{0}_cb\">{1}</label>".format(id, opts.text));
            }
            el.replaceWith(el_con);
            el = el_con;
            render();
        }
        function render() {
            if (opts.disabled) {
                el.addClass("ujs-checkbox-disabled");
                el.children("input").prop("disabled", true);
            }
            else {
                el.removeClass("ujs-checkbox-disabled");
                el.children("input").prop("disabled", false);
            }
        }
        create();
        el.enable = function () {
            opts.disabled = false;
            render();
        };
        el.disable = function () {
            opts.disabled = true;
            render();
        };
        el.getValue = function () {
            return opts.value;
        };
        el.setValue = function (value) {
            opts.value = value;
        };
        return el;
    },
    form: function (option) { },
    gridview: function (option) {
        var el = this,
            opts = { showTitle: false, title: "", columns: [], pagination: true, pageSize: 10, pagePosition: "bottom", pageIndex: 0, showHeader: true, showFooter: false, url: "" },
            data = [],
            total = 0,
            params = {},
            sort = "",
            order = "asc",
            autoWidth = true,
            autoHeight = true;
        if (el.length == 0) {
            return;
        }
        if (option == undefined) {
            option = {};
        }
        if (option.pagination == false) {
            opts.pagination = false;
        }
        else {
            if (el.attr("pagination") == "false") {
                opts.pagination = false;
            }
        }
        if (typeof (option.pageSize) == "number" && option.pageSize > 0) {
            opts.pageSize = option.pageSize;
        }
        else {
            if (typeof (el.attr("pageSize")) == "string") {
                var ps = parseInt(el.attr("pageSize"));
                if (!isNaN(ps) && ps > 0) {
                    opts.pageSize = ps;
                }
            }
        }
        if (typeof (option.pagePosition) == "string") {
            opts.pagePosition = option.pagePosition;
        }
        else {
            if (typeof (el.attr("pagePosition")) == "string") {
                opts.pagePosition = el.attr("pagePosition");
            }
        }
        if (typeof (option.pageIndex) == "number" && option.pageIndex > 0) {
            opts.pageIndex = option.pageIndex;
        }
        else {
            if (typeof (el.attr("pageIndex")) == "string") {
                var ps = parseInt(el.attr("pageIndex"));
                if (!isNaN(ps) && ps > 0) {
                    opts.pageIndex = ps;
                }
            }
        }
        if (option.showHeader == false) {
            opts.showHeader = false;
        }
        else {
            if (el.attr("showHeader") == "false") {
                opts.showHeader = false;
            }
        }
        if (option.showFooter == true) {
            opts.showFooter = true;
        }
        else {
            if (el.attr("showFooter") == "true") {
                opts.showFooter = true;
            }
        }
        if (typeof (option.url) == "string") {
            opts.url = option.url;
        }
        else {
            if (typeof (el.attr("url")) == "string") {
                opts.url = el.attr("url");
            }
        }
        if (el.width() != 0) {
            autoHeight = false;
        }
        el.find(".ujs-gridview-header th").each(function () {
            var column = { field: "", width: 0, align: "left", headerAlign: "left", sortable: false, text: "" };
            if (typeof ($(this).attr("field")) == "string") {
                column.field = $(this).attr("field");
            }
            if (typeof ($(this).attr("width")) == "string") {
                var w = parseInt($(this).attr("width"));
                if (!isNaN(w)) {
                    column.width = w;
                }
            }
            if (typeof ($(this).attr("align")) == "string") {
                column.align = $(this).attr("align");
            }
            if (typeof ($(this).attr("headerAlign")) == "string") {
                column.headerAlign = $(this).attr("headerAlign");
            }
            if ($(this).attr("sortable") == true) {
                column.sortable = true;
            }
            if (typeof ($(this).html()) == "string") {
                column.text = $(this).html();
            }
            opts.columns.push(column);
        });
        if ($.isArray(option.columns)) {
            for (var i = 0; i < option.columns.length; i++) {
                var column = { field: "", width: 0, align: "left", headerAlign: "left", sortable: false };
                if (typeof (option.columns[i].field) == "string") {
                    column.field = option.columns[i].field;
                }
                if (typeof (option.columns[i].width) == "number") {
                    column.width = option.columns[i].width;
                }
                if (typeof (option.columns[i].align) == "string") {
                    column.align = option.columns[i].align;
                }
                if (typeof (option.columns[i].headerAlign) == "string") {
                    column.headerAlign = option.columns[i].headerAlign;
                }
                if (option.columns[i].sortable == true) {
                    column.sortable = true;
                }
                opts.columns.push(column);
            }
        }
        function create() {
            var id = "", style = "", cls = "";
            if (typeof (el.attr("id")) == "string") {
                id = el.attr("id");
            }
            if (typeof (el.attr("style")) == "string") {
                style = el.attr("style");
            }
            if (typeof (el.attr("class")) == "string") {
                cls = el.attr("class");
            }
            var el_con = $("<div class=\"{0}\" id=\"{1}\" style=\"{2}\"></div>".format(cls, id, style));
            var el_title = $("<div class=\"ujs-gridview-title\">{0}</div>".format(opts.title));
            var el_page_top = $("<div class=\"ujs-gridview-page\"><select><option value=\"10\">10</option><option value=\"20\">20</option>" +
                "<option value=\"30\">30</option><option value=\"50\">50</option><option value=\"100\">100</option></select>" +
                "<div class=\"ujs-gridview-page-split\"></div><a class=\"ujs-gridview-page-first\"></a><a class=\"ujs-gridview-page-prev\"></a>" +
                "<input type=\"text\" class=\"ujs-gridview-page-index\"><span class=\"ujs-gridview-page-pages\"> / 2</span>" +
                "<a class=\"ujs-gridview-page-next\"></a><a class=\"ujs-gridview-page-last\"></a><div class=\"ujs-gridview-page-split\"></div>" +
                "<a class=\"ujs-gridview-page-reload\"></a><span class=\"ujs-gridview-page-info\">共 200 条<span></div>");
            var el_header = $("<div class=\"ujs-gridview-header\"><table><tr></tr></table></div>");
            for (var i = 0; i < opts.columns.length; i++) {
                var el_headeritem = $("<td>{0}</td>".format(opts.columns[i].text));
                if (i == opts.columns.length - 1) {
                    el_headeritem.addClass("last");
                }
                el_header.find("tr").append(el_headeritem);
            }
            var el_rows = $("<div class=\"ujs-gridview-data\"><table class=\"ujs-gridview-rows\"></table></div>");
            el_rows.scroll(function (e) {
                el.find(".ujs-gridview-header table").css({ left: -e.target.scrollLeft });
            });

            el_con.append(el_title);
            if (opts.pagePosition == "top" || opts.pagePosition == "both" && opts.pagination) {
                el_con.append(el_page_top);
                el_page_top.css({ borderTop: "0px", borderBottom: "1px solid #ddd" });
            }
            el_con.append(el_header);
            el_con.append(el_rows);
            if (opts.pagePosition == "bottom" || opts.pagePosition == "both" && opts.pagination) {
                var el_page_bottom = el_page_top.clone();
                el_con.append(el_page_bottom);
                el_page_bottom.css({ borderTop: "1px solid #ddd", borderBottom: "0px" });
            }
            el.replaceWith(el_con);
            el = el_con;
            render();
        }
        function render() {
            var width = 0;
            var num = 0;
            var ywidth = 0;
            var el_header_item = el.find(".ujs-gridview-header table tr td");
            for (var i = 0; i < opts.columns.length; i++) {
                if (opts.columns[i].width > 11) {
                    width += opts.columns[i].width;
                }
                else {
                    num++;
                }
            }
            if (el.children(".ujs-gridview-header").width() > width + num * 11) {
                ywidth = (el.children(".ujs-gridview-header").width() - width - num * 11) / num;
            }
            for (var i = 0; i < opts.columns.length; i++) {
                if (opts.columns[i].width <= 11) {
                    if (ywidth > 0) {
                        el_header_item.eq(i).width(ywidth - 11);
                        opts.columns[i].width = ywidth - 11;
                    }
                    else {
                        opts.columns[i].width = el_header_item.eq(i).width() + 11;
                    }
                }
                else {
                    el_header_item.eq(i).width(opts.columns[i].width - 11);
                }
            }
            if (opts.url != "") {
                if (opts.pagination) {
                    params.page = opts.pageIndex;
                    params.rows = opts.pageSize;
                }
                if (sort != "") {
                    params.sort = sort;
                    params.order = order;
                }
                $.post(opts.url, params, function (e) {
                    if ($.isArray(e)) {
                        data = e;
                    }
                    else {
                        if ($.isArray(e.data)) {
                            data = e.data;
                        }
                    }
                    el.find(".ujs-gridview-data .ujs-gridview-rows").width(el.find(".ujs-gridview-header table").width());
                    for (var i = 0; i < data.length; i++) {
                        var el_row = $("<tr class=\"ujs-gridview-item\"></tr>");
                        for (var c = 0; c < opts.columns.length; c++) {
                            var el_cell = $("<td align=\"{0}\">{1}</td>".format(opts.columns[c].align, data[i][opts.columns[c].field]));
                            if (c == opts.columns.length - 1) {
                                el_cell.addClass("last");
                                el_cell.width(el_cell.width() + 1);
                            }
                            el_cell.width(opts.columns[c].width - 11);
                            el_row.append(el_cell);
                        }
                        el.find(".ujs-gridview-data .ujs-gridview-rows").append(el_row);
                    }
                    el.children(".ujs-gridview-data").height(el.find(".ujs-gridview-data .ujs-gridview-rows").height());
                }, "json");

            }
        }
        create();
        return el;
    }
});
$(function () {
    //$.renderOrder();
    $.render();
});