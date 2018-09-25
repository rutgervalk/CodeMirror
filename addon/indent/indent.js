// Written by Rutger Valk-van de Klundert @ Lightspeed HQ

// Plugin adds indentation markers to editor

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";

  function doIndentGuides(cm, toggle) {
    cm.operation(function() {

      var guideClass = "indent-guides";

      var indentGuidesOverlay = {
        token: function (stream, state) {
          var char = stream.next() || "";
          var colNum = stream.column() || 0;

          if (' \t\n\r\v'.indexOf(char) == -1) {
            stream.skipToEnd();
            return null;
          }

          var isTabStart = (colNum % cm.getOption("indentUnit")) ? false : true;

          if ((char === " " && isTabStart) | (char === "\t" && isTabStart)) {
            return guideClass;
          } else {
            return null;
          }
        },
        flattenSpans: false
      };

      cm.state.indentGuides.enabled = toggle;
      if (toggle == true ){
        cm.addOverlay(indentGuidesOverlay);
      } else {
        cm.removeOverlay(indentGuidesOverlay);
      }
      cm.refresh();
    });
  }

  CodeMirror.defineOption("indentGuides", false, function(cm, val, old) {
    if (old && old != CodeMirror.Init) {
      // Update option
      doIndentGuides(cm, val);
    }
    // Init option?
    if (val) {
      cm.state.indentGuides = typeof val == "object" ? val : {enabled: val};
      doIndentGuides(cm, val);
    }
  });
});
