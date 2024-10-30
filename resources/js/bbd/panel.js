bbD.panel = function () {
    var d = parseFloat(bbD.version),
        c = jQuery('<div id="boobox-links" class="postbox"><div id="boobox-preferences"><h3 class="hndle"><span>boo-box </span></h3></div><div id="booPanelContent"></div></div>'),
        e = jQuery("#bb-custom-editform"),
        b = jQuery('<div id="booManual" style="display:none"><h4>Manual</h4><span id="bb-manual-content"></span></div>'),
        a = jQuery('<div id="booAuto" style="display:none"><h4>Autolink</h4><ul id="boobox-links-content"></ul></div>');
    if (d >= 2.7) {
        jQuery("#post-status-info").after(c)
    } else {
        jQuery("#editorcontainer").after(c);
        c.addClass("wpunrounded");
        e.css("background-color", "#EAF3FA")
    }
    jQuery("#booPanelContent", c).append(b).append(a).append(e);
    e.show()
};
