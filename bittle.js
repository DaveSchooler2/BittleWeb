/*
Bittle Javascript Page

To do, bugs:
   move moveit() one-time items into setup();
   Run behavior repeat frames
   Slider for animation speed?
   Drag image parts directly?
   Add block for console commands like block for animation?
   offBalance: RfrontFootZ/RbackFootZ wrong?
   Bug: "Warning!" Back incorrect in opposite directions
   Bug: Blue dots not displaying for right side
   Label right side slider?
   Grid/red lines get removed with use of canvas
   Squash other bugs?

MIT License

Copyright (c) 2022 David Schooler

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

var version = "0.13";
var FmaxTopAngle   =  80;              // Max front top degrees
var FminTopAngle   = -190;             // Min front top degrees
var BmaxTopAngle   = 195;              // Max back top degrees
var BminTopAngle   = -75;              // Min back top degrees
var maxBotAngle    = 200;              // Max bottom degrees
var minBotAngle    = -70;              // Min bottom degrees
var sleepTime      = 500;              // Default pause
var movementAmt    = 700;              // How far to move when separating sides
var RBrightness    =  60;              // Brightness of right side (%)
var behaviorSpeed  =   4;              // 1=slow
var debugMode      = true;             // Write some values to console.log
var highlight = '<span style="color:#000080;background:#ffdfff;font-weight:bold;">';
var highlightoff = '</span>';
var gaitColor = "#fff8f8";
var postureColor = "#f8fff8";
var behaviorColor = "#f8f8ff";
// Make the following two equal to be over the top of one another
var LbaseXpos = 175;                     // Absolute X Base position (369,150)
var RbaseXpos = 185;                     // ABsolute X Base posotion (800)
var LbaseYpos = 720;                     // Absolute Y Base position (690)
var RbaseYpos = 710;                     // Absolute Y Base position (680)
var ftxOrig   =  33;                     // Front Top X pivot within image
var ftyOrig   =  35;                     // Front Top Y pivot within image
var fbxOrig   = 165;                     // Front Bottom X pivot within image
var fbyOrig   =  44;                     // Front Bottom Y pivot within image
var btxOrig   =  33;                     // Back Top X pivot within image
var btyOrig   =  35;                     // Back Top Y pivot within image
var bbxOrig   = 165;                     // Back Bottom X pivot within image
var bbyOrig   =  44;                     // Back Bottom Y pivot within image
var offBalanceWarn = 5;                  // Mark when over this mm off balance
var maxRightMove = 900;                  // Right side slider max
var minRightMove = -150;                 // Right side slider min
var RBodyAbsXos    = 131;                // Right side body X offset
var RFrontTopAbsXos = 139;               // Right front top X offset
var RBackTopAbsXos  = 562;               // Right back top X offset
var RFrontBotAbsXos = 0;                 // Right front bottom X offset
var RBackBotAbsXos = 424;                // Right back bottom X offset
var RFrontTopPivXos = 165;               // Right front top pivot X offset
var RBackTopPivXos = 593;                // Right back top pivot X offset
var RFrontBotPivXos = 165;               // 165
var RSideNameXos = 290;                  // Right side name X offset
//////////////////////////////////////////

function setup() {
   if(debugMode) console.log(arguments.callee.name+"()");
   document.getElementById("inputFile").addEventListener("change",readFile,false);
   window.RfrontFootZ = 260; // Distance left to right; 260 pixels is 65mm (?)
   window.RbackFootZ  = 260; // Distance left to right; 260 pixels is 65mm (?)
   window.LbodyAbsX = LbaseXpos + 131;          // Absolute L X Body position (131)
   window.RbodyAbsX = RbaseXpos + RBodyAbsXos;  // Absolute R X Body position (531)
   window.LbodyAbsY = LbaseYpos + 0;            // Absolute L Y Body position
   window.RbodyAbsY = RbaseYpos + 0;            // Absolute R Y Body position
   window.LfrontTopAbsX = LbaseXpos + 139;      // Absolute X Front Top
   window.LfrontTopAbsY = LbaseYpos +  54;      // Absolute Y Front Top
   window.LbackTopAbsX  = LbaseXpos + 562;      // Absolute X Back Top
   window.LbackTopAbsY  = LbaseYpos +  53;      // Absolute Y Back Top
   window.LfrontBotAbsX = LbaseXpos +   0;      // Absolute X Front Bottom
   window.LfrontBotAbsY = LbaseYpos + 210;      // Absolute Y Front Bottom
   window.LbackBotAbsX  = LbaseXpos + 424;      // Absolute X Back Bottom
   window.LbackBotAbsY  = LbaseYpos + 207;      // Absolute Y Back Bottom
   window.RfrontTopAbsX = RbaseXpos + RFrontTopAbsXos; // Absolute X Front Top (539)
   window.RfrontTopAbsY = RbaseYpos +  54;      // Absolute Y Front Top
   window.RbackTopAbsX  = RbaseXpos + RBackTopAbsXos;  // Absolute X Back Top (962)
   window.RbackTopAbsY  = RbaseYpos +  53;      // Absolute Y Back Top
   window.RfrontBotAbsX = RbaseXpos + RFrontBotAbsXos; // Absolute X Front Bottom (400)
   window.RfrontBotAbsY = RbaseYpos + 210;      // Absolute Y Front Bottom
   window.RbackBotAbsX  = RbaseXpos + RBackBotAbsXos;  // Absolute X Back Bottom (824)
   window.RbackBotAbsY  = RbaseYpos + 207;      // Absolute Y Back Bottom
   window.Lftpx = LbaseXpos + 165;              // Absolute X Front Top pivot
   window.Lftpy = LbaseYpos +  82;              // Absolute Y Front Top pivot
   window.Lfbpx = LbaseXpos + 161;              // Absolute X Front Bottom pivot
   window.Lfbpy = LbaseYpos + 248;              // Absolute Y Front Bottom pivot
   window.Lbtpx = LbaseXpos + 584;              // Absolute X Back Top pivot
   window.Lbtpy = LbaseYpos +  82;              // Absolute Y Back Top pivot
   window.Lbbpx = LbaseXpos + 584;              //584
   window.Lbbpy = LbaseYpos + 248;              //248
   window.Rftpx = RbaseXpos + RFrontTopPivXos;  // Absolute X Front Top pivot (565)
   window.Rftpy = RbaseYpos +  82;              // Absolute Y Front Top pivot
   window.Rfbpx = RbaseXpos + RFrontBotPivXos;  // Absolute X Front Bottom pivot (561)
   window.Rfbpy = RbaseYpos + 248;              // Absolute Y Front Bottom pivot
//   window.Rbtpx = RbaseXpos + 984;            // Absolute X Back Top pivot (984)
   window.Rbtpx = RbaseXpos + RBackTopPivXos;   // Absolute X Back Top pivot (984)
   window.Rbtpy = RbaseYpos +  82;              // Absolute Y Back Top pivot
   window.Rbbpx = RbaseXpos + RBackTopPivXos;   //684
   window.Rbbpy = RbaseYpos + 248;              //248
   window.topLineAbsY = LbaseYpos + 288;        // Absolute Y Top red line
   window.botLineAbsY = LbaseYpos + 410;        // Absolute Y Bottom red line
   window.LftPivotAbsX = LbaseXpos + 165;       // Absolute Front Top X pivot
   window.LftPivotAbsY = LbaseYpos +  82;       // Absolute Front Top Y pivit
   window.LfbPivotAbsY = LbaseYpos + 248;       // Absolute Front Bottom Y pivot
   window.LbtPivotAbsX = LbaseXpos + 593;       // Absolute Back Top X pivot
   window.LbtPivotAbsY = LbaseYpos +  82;       // Absolute Back Top Y pivot

   window.RftPivotAbsX = RbaseXpos + 165;       // Absolute Front Top X pivot (565)
   window.RftPivotAbsY = RbaseYpos +  82;       // Absolute Front Top Y pivit
   window.RfbPivotAbsY = RbaseYpos + 248;       // Absolute Front Bottom Y pivot
   window.RbtPivotAbsX = RbaseXpos + RBackTopPivXos;       // Absolute Back Top X pivot (993)
   window.RbtPivotAbsY = RbaseYpos +  82;       // Absolute Back Top Y pivot

   window.LSideNameAbsX = LbaseXpos + 290;
   window.LSideNameAbsY = LbaseYpos +  55;
   window.RSideNameAbsX = RbaseXpos + RSideNameXos;      // (750)
   window.RSideNameAbsY = RbaseYpos +  55;

   window.radius = LfbPivotAbsY - LftPivotAbsY; // Front circle radius
   window.animationTemp = "";                   // For storing animationEdit
   window.arrowStyle = "font-weight:bold;color:#800080;";   // For select arrow
   window.fileContents = "";
   window.demoInstinct = `29, 0, 0, 1,
  48,  39,  63,  52, -10,   7,  -8,   9,
  44,  39,  59,  52,  -3,   7,  -2,   9,
  41,  39,  55,  52,   3,   7,   5,   9,
  39,  39,  52,  52,   7,   7,   9,   9,
  39,  39,  52,  52,   7,   7,   9,   9,
  39,  39,  52,  52,   7,   7,   9,   9,
  39,  39,  52,  52,   7,   7,   9,   9,
  39,  43,  52,  57,   7,   0,   9,   2,
  39,  46,  52,  61,   7,  -6,   9,  -5,
  39,  49,  52,  65,   7, -13,   9, -11,
  39,  52,  52,  69,   7, -19,   9, -17,
  39,  53,  52,  72,   7, -22,   9, -20,
  39,  53,  52,  72,   7, -22,   9, -20,
  39,  51,  52,  67,   7, -16,   9, -14,
  39,  48,  52,  63,   7, -10,   9,  -8,
  39,  44,  52,  59,   7,  -3,   9,  -2,
  39,  41,  52,  55,   7,   3,   9,   5,
  39,  39,  52,  52,   7,   7,   9,   9,
  39,  39,  52,  52,   7,   7,   9,   9,
  39,  39,  52,  52,   7,   7,   9,   9,
  39,  39,  52,  52,   7,   7,   9,   9,
  39,  39,  52,  52,   7,   7,   9,   9,
  43,  39,  57,  52,   0,   7,   2,   9,
  46,  39,  61,  52,  -6,   7,  -5,   9,
  49,  39,  65,  52, -13,   7, -11,   9,
  52,  39,  69,  52, -19,   7, -17,   9,
  53,  39,  72,  52, -22,   7, -20,   9,
  53,  39,  72,  52, -22,   7, -20,   9,
  51,  39,  67,  52, -16,   7, -14,   9,`;

   document.getElementById("version").innerHTML = "v"+version;
   document.getElementById("DisplayGrid").checked = false;
   document.getElementById("DisplaySurfaces").checked = false;
   document.getElementById("DisplayPivots").checked = false;
   document.getElementById("DisplayCanvas").checked = false;
   document.getElementById("LftSlider").max = FmaxTopAngle; 
   document.getElementById("LftSliderMax").innerHTML = FmaxTopAngle;
   document.getElementById("LftSlider").min = FminTopAngle;
   document.getElementById("LftSliderMin").innerHTML = FminTopAngle;
   document.getElementById("LfbSlider").max = maxBotAngle;
   document.getElementById("LfbSliderMax").innerHTML = maxBotAngle;
   document.getElementById("LfbSlider").min = minBotAngle;
   document.getElementById("LfbSliderMin").innerHTML = minBotAngle;
   document.getElementById("LbtSlider").max = BmaxTopAngle;
   document.getElementById("LbtSliderMax").innerHTML = BmaxTopAngle;
   document.getElementById("LbtSlider").min = BminTopAngle;
   document.getElementById("LbtSliderMin").innerHTML = BminTopAngle;
   document.getElementById("LbbSlider").max = maxBotAngle;
   document.getElementById("LbbSliderMax").innerHTML = maxBotAngle;
   document.getElementById("LbbSlider").min = minBotAngle;
   document.getElementById("LbbSliderMin").innerHTML = minBotAngle;

   document.getElementById("RftSlider").max = FmaxTopAngle; 
   document.getElementById("RftSliderMax").innerHTML = FmaxTopAngle;
   document.getElementById("RftSlider").min = FminTopAngle;
   document.getElementById("RftSliderMin").innerHTML = FminTopAngle;
   document.getElementById("RfbSlider").max = maxBotAngle;
   document.getElementById("RfbSliderMax").innerHTML = maxBotAngle;
   document.getElementById("RfbSlider").min = minBotAngle;
   document.getElementById("RfbSliderMin").innerHTML = minBotAngle;
   document.getElementById("RbtSlider").max = BmaxTopAngle;
   document.getElementById("RbtSliderMax").innerHTML = BmaxTopAngle;
   document.getElementById("RbtSlider").min = BminTopAngle;
   document.getElementById("RbtSliderMin").innerHTML = BminTopAngle;
   document.getElementById("RbbSlider").max = maxBotAngle;
   document.getElementById("RbbSliderMax").innerHTML = maxBotAngle;
   document.getElementById("RbbSlider").min = minBotAngle;
   document.getElementById("RbbSliderMin").innerHTML = minBotAngle;

   document.getElementById("LBittleBody").style.left = LbodyAbsX + "px"; 
   document.getElementById("LBittleBody").style.top  = LbodyAbsY + "px";
   document.getElementById("LFrontTop").style.left = LfrontTopAbsX + "px";
   document.getElementById("LFrontTop").style.top  = LfrontTopAbsY + "px";
   document.getElementById("LBackTop").style.left = LbackTopAbsX + "px";
   document.getElementById("LBackTop").style.top  = LbackTopAbsY + "px";
   document.getElementById("LFrontBottom").style.left = LfrontBotAbsX + "px";
   document.getElementById("LFrontBottom").style.top = LfrontBotAbsY + "px";
   document.getElementById("LBackBottom").style.left = LbackBotAbsX + "px";
   document.getElementById("LBackBottom").style.top = LbackBotAbsY + "px";
   document.getElementById("RBittleBody").style.left = RbodyAbsX + "px"; 
   document.getElementById("RBittleBody").style.top  = RbodyAbsY + "px";
   document.getElementById("RFrontTop").style.left = RfrontTopAbsX + "px";
   document.getElementById("RFrontTop").style.top  = RfrontTopAbsY + "px";
   document.getElementById("RBackTop").style.left = RbackTopAbsX + "px";
   document.getElementById("RBackTop").style.top  = RbackTopAbsY + "px";
   document.getElementById("RFrontBottom").style.left = RfrontBotAbsX + "px";
   document.getElementById("RFrontBottom").style.top = RfrontBotAbsY + "px";
   document.getElementById("RBackBottom").style.left = RbackBotAbsX + "px";
   document.getElementById("RBackBottom").style.top = RbackBotAbsY + "px";

   document.getElementById("LfrontTopPivot").style.left = Lftpx + "px";
   document.getElementById("LfrontTopPivot").style.top  = Lftpy + "px";
   document.getElementById("LfrontBottomPivot").style.left = Lfbpx + "px";
   document.getElementById("LfrontBottomPivot").style.top  = Lfbpy + "px";
   document.getElementById("LbackTopPivot").style.left = Lbtpx + "px";
   document.getElementById("LbackTopPivot").style.top  = Lbtpy + "px";
   document.getElementById("LbackBottomPivot").style.left = Lbbpx + "px";
   document.getElementById("LbackBottomPivot").style.top  = Lbbpy + "px";

//   document.getElementById("RfrontTopPivot").style.left = Rftpx + "px";
//   document.getElementById("RfrontTopPivot").style.top  = Rftpy + "px";
//   document.getElementById("RfrontBottomPivot").style.left = Rfbpx + "px";
//   document.getElementById("RfrontBottomPivot").style.top  = Rfbpy + "px";
//   document.getElementById("RbackTopPivot").style.left = Rbtpx + "px";
//   document.getElementById("RbackTopPivot").style.top  = Rbtpy + "px";
   document.getElementById("RbackBottomPivot").style.left = Rbbpx + "px";
   document.getElementById("RbackBottomPivot").style.top  = Rbbpy + "px";

   document.getElementById("RfrontTopPivot").style.left = Rftpx + "px";
   document.getElementById("RfrontBottomPivot").style.left = Rfbpx + "px";
   document.getElementById("RbackTopPivot").style.left = Rbtpx + "px";
   document.getElementById("RbackBottomPivot").style.left = Rbbpx + "px";

   document.getElementById("topRedLine").style.top = topLineAbsY + "px"; 
   document.getElementById("botRedLine").style.top = botLineAbsY + "px";
   document.getElementById("LSideName").style.left = LSideNameAbsX + "px";
   document.getElementById("LSideName").style.top  = LSideNameAbsY + "px";
   document.getElementById("RSideName").style.left = RSideNameAbsX + "px";
   document.getElementById("RSideName").style.top  = RSideNameAbsY + "px";
   document.getElementById("DisplaySeparateSides").checked = false;
   document.getElementById("RBittleBody").style.filter = "brightness("+RBrightness+"%)";
   document.getElementById("RFrontTop").style.filter = "brightness("+RBrightness+"%)";
   document.getElementById("RFrontBottom").style.filter = "brightness("+RBrightness+"%)";
   document.getElementById("RBackTop").style.filter = "brightness("+RBrightness+"%)";
   document.getElementById("RBackBottom").style.filter = "brightness("+RBrightness+"%)";
   document.getElementById("sleepTime").value = sleepTime;
   document.getElementById("LfrontTopAngle").value = "0";
   document.getElementById("LfrontBotAngle").value = "0";
   document.getElementById("LbackTopAngle").value = "0";
   document.getElementById("LbackBotAngle").value = "0";
   document.getElementById("RfrontTopAngle").value = "0";
   document.getElementById("RfrontBotAngle").value = "0";
   document.getElementById("RbackTopAngle").value = "0";
   document.getElementById("RbackBotAngle").value = "0";
   document.getElementById("animation").style.background = gaitColor;
   document.getElementById("gaitRadio").style.background = gaitColor;
   document.getElementById("postureRadio").style.background = postureColor;
   document.getElementById("behaviorRadio").style.background = behaviorColor;
   document.getElementById("RightBodySlider").max = maxRightMove;
   document.getElementById("RightBodySlider").min = minRightMove;
   document.getElementById("RightBodySlider").value = 0;
   document.getElementById("loopCount").value = 1;
   document.getElementById("gaitSkill").checked = "checked";

   var LftSlider = document.getElementById("LftSlider");
   var LfbSlider = document.getElementById("LfbSlider");
   var LbtSlider = document.getElementById("LbtSlider");
   var LbbSlider = document.getElementById("LbbSlider");
   var RftSlider = document.getElementById("RftSlider");
   var RfbSlider = document.getElementById("RfbSlider");
   var RbtSlider = document.getElementById("RbtSlider");
   var RbbSlider = document.getElementById("RbbSlider");
   LftSlider.oninput = function() { slider(); }
   LfbSlider.oninput = function() { slider(); }
   LbtSlider.oninput = function() { slider(); }
   LbbSlider.oninput = function() { slider(); }
   RftSlider.oninput = function() { slider(); }
   RfbSlider.oninput = function() { slider(); }
   RbtSlider.oninput = function() { slider(); }
   RbbSlider.oninput = function() { slider(); }
   RightBodySlider.oninput = function() { bodySlider(); }

   linesCount = 10;      // Number of lines to display in grid
   linesPadding = 30;    // Pixels between lines
   pad = 100;            // First line position from top of main image
   divString = "";
   for(x=0; x<linesCount; x++) {
      divString = divString + "<img src='grayline.png' style='z-index:1;width:100%;height:1px;position:absolute;left:0px;top:"+(LbaseYpos+pad)+"px;'>";
      pad+=linesPadding;
   }
   document.getElementById("graylines").innerHTML = divString;
   moveit();
} // function setup()

function instinctName(instinct) {
   if(debugMode) console.log(arguments.callee.name+"("+instinct+")");
   if(instinct == "balance")   return "Balance posture";
   if(instinct == "bdF")       return "Bound - not recommended";
   if(instinct == "bf")        return "Back flip behavior";
   if(instinct == "bg")        return "Butt drag behavior";
   if(instinct == "bk")        return "Back gait";
   if(instinct == "bkL")       return "Back left gait";
   if(instinct == "bow")       return "Take a bow";
   if(instinct == "buttUp")    return "Bottom up posture";
   if(instinct == "calib")     return "Calibrate posture";
   if(instinct == "ck")        return "Check around behavior";
   if(instinct == "climbCeil") return "Climb ceiling behavior";
   if(instinct == "crF")       return "Crawl forward gait";
   if(instinct == "crL")       return "Crawl left gait";
   if(instinct == "cujo")      return "Cujo posture";
   if(instinct == "dropped")   return "Dropped posture";
   if(instinct == "fd")        return "Fold? behavior";
   if(instinct == "ff")        return "Flip forward behavior";
   if(instinct == "hi")        return "Wave 'hi' behavior";
   if(instinct == "hlw")       return "High walk? gait";
   if(instinct == "jy")        return "Joy behavior";
   if(instinct == "lifted")    return "Lifted posture";
   if(instinct == "mhF")       return "March forward? gait";
   if(instinct == "mhL")       return "March left? gait";
   if(instinct == "pcF")       return "Prance forward? gait";
   if(instinct == "pd")        return "Play dead behavior";
   if(instinct == "pee")       return "Pee behavior";
   if(instinct == "phF")       return "Push forward gait";
   if(instinct == "phL")       return "Push left gait";
   if(instinct == "pu")        return "Pushups behavior";
   if(instinct == "pu1")       return "One paw pushups behavior";
   if(instinct == "rc")        return "Recovery behavior";
   if(instinct == "rest")      return "Rest posture";
   if(instinct == "rlL")       return "Roll over left? behavior";
   if(instinct == "rn")        return "Run gait";
   if(instinct == "rt")        return "rt?";
   if(instinct == "sit")       return "Sit posture";
   if(instinct == "spn")       return "Spin gait";
   if(instinct == "stp")       return "Climb step? behavior";
   if(instinct == "str")       return "Stretch posture";
   if(instinct == "trF")       return "Trot forward gait";
   if(instinct == "trL")       return "Trot left gait";
   if(instinct == "ts")        return "ts?";
   if(instinct == "uncujo")    return "Cujo recover";
   if(instinct == "vtF")       return "Step on same spot gait";
   if(instinct == "vtL")       return "Step left gait";
   if(instinct == "wkF")       return "Walk forward gait";
   if(instinct == "wkL")       return "Walk left gait";
   if(instinct == "zero")      return "Zero posture";
   return "???";
} // function instinctName()

function readFile(e) {
   if(debugMode) console.log(arguments.callee.name+"("+e+")");
   var instinctList = document.getElementById("instinctList");
   var instinctFromFile = document.getElementById("instinctFromFile");
   instinctList.hidden = false;
   var file = e.target.files[0];
   if(!file) return;
   instinctList = "";
   var reader = new FileReader();
   reader.onload = function(e) {
      fileContents = e.target.result;
      var contents = fileContents.split("\n");
      contents.forEach((oneline,i) => {
         if(oneline.includes('progmemPointer')) {
            if(!oneline.trim().startsWith("//")) {
               if(oneline.length > instinctList.length) {
                  instinctList = oneline;
               }
            }
         }
      });
      instinctList = instinctList.replace(/\s/mg,"");
      temp = instinctList.split("{");
      temp = temp[1].split("}");
      temp = temp[0].split(",");
      temp.sort();
      temp.forEach((oneinstinct,i) => {
         if(oneinstinct.trim() != "") {
            option = document.createElement("option");
            option.value = oneinstinct;
            option.text = oneinstinct + " ("+instinctName(oneinstinct)+")";
            instinctFromFile.appendChild(option);
            instinctList.innerHTML += oneinstinct;
         }
      });
   }
   reader.readAsText(file);
} // function readFile()

function readInstinct() {
   which = document.getElementById("instinctFromFile").value;
   anim = document.getElementById("animation");
   anim.innerHTML = "";
   fileContents = fileContents.replace(/,};/mg,",\n}");
   contents = fileContents.split("\n");
   foundFirst = false;
   foundLast  = false;
   contents.forEach((oneline,i) => {
      if(foundFirst && oneline.includes("}")) foundLast = true;
      if(foundFirst && !foundLast) {
         anim.innerHTML += oneline + "<br>";
      }
      if(oneline.includes("[]")) {
         test = oneline.split("[");
         test = test[0].split(" ");
         if(test[2].trim() == which.trim()) {
            foundFirst = true;
         }
      }
   });
   anim.innerHTML = anim.innerHTML.replace(/<br>$/,'');
   test1 = anim.innerHTML.split("<br>");
   test2 = test1[1].split(",");
   if(test2.length < 5) { // preamble is on two lines. Fix here
      anim.innerHTML = anim.innerHTML.replace("<br>",""); // Replace the first one only
      test1 = anim.innerHTML.split("<br>");
   }
   test = test1[1].split(",");  // Change skillType based on second line
   if(test.length == 9) {
      skillType = "gait";
      document.getElementById("gaitSkill").checked = "checked";
      document.getElementById("animation").style.background = gaitColor;
      document.getElementById("behaviorFirst").value = "0";
      document.getElementById("behaviorLast").value  = "0";
      document.getElementById("behaviorMult").value  = "0";
   } else if(test.length == 17) {
      skillType = "posture";
      document.getElementById("postureSkill").checked = "checked";
      document.getElementById("animation").style.background = postureColor;
      document.getElementById("behaviorFirst").value = "0";
      document.getElementById("behaviorLast").value  = "0";
      document.getElementById("behaviorMult").value  = "0";
   } else if(test.length == 21) {
      skillType = "behavior";
      document.getElementById("behaviorSkill").checked = "checked";
      document.getElementById("animation").style.background = behaviorColor;
      preamble = test1[0].split(",");
      document.getElementById("behaviorFirst").value = preamble[4];
      document.getElementById("behaviorLast").value  = preamble[5];
      document.getElementById("behaviorMult").value  = preamble[6];
   }
   populateSelect();
} // function readInstinct()

function clearCanvas() {
   if(debugMode) console.log(arguments.callee.name+"()");
   canvas = document.getElementById('canvas');
   ctx = canvas.getContext('2d');
   ctx.fillStyle = "white";
   ctx.fillRect(0,0,1500,1500); 
} // function clearCanvas()

function drawLine(x1,y1,x2,y2,color) {
   if(debugMode) console.log(arguments.callee.name+"("+x1+","+y1+","+x2+","+y2+","+color+")");
   canvas = document.getElementById('canvas');
   ctx = canvas.getContext('2d');
   ctx.strokeStyle = '#ccffcc';
   ctx.strokeStyle = color;
   ctx.lineWidth = 2;
   ctx.beginPath();
   ctx.moveTo(x1,y1-800);
   ctx.lineTo(x2,y2-800);
   ctx.stroke();
} // function drawLine()

function copyAnimation() {
   if(debugMode) console.log(arguments.callee.name+"()");
    //Before we copy, we are going to select the text.
    var text = document.getElementById("animation");
    var selection = window.getSelection();
    var range = document.createRange();
    range.selectNodeContents(text);
    selection.removeAllRanges();
    selection.addRange(range);
    //add to clipboard.
    document.execCommand('copy');
} // function copyAnimation()

function balanceDistance(x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4) {
   if(debugMode) console.log(arguments.callee.name+"("+x1+","+y1+","+z1+","+x2+","+y2+","+z2+","+x3+","+y3+","+z3+","+x4+","+y4+","+z4+")");
// Given a plane for points x1,y1,z1, x2,y2 x2, x3,y3,z3,
//    calculated distance to point x4,y4,z4.
// This shows how far off balance a foot (x4,y4,z4) is from the other 3 feet.
   var a1 = x2 - x1;
   var b1 = y2 - y1;
   var c1 = z2 - z1;
   var a2 = x3 - x1;
   var b2 = y3 - y1;
   var c2 = z3 - z1;
   var a = b1 * c2 - b2 * c1;
   var b = a2 * c1 - a1 * c2;
   var c = a1 * b2 - b1 * a2;
   var d = (-a * x1 - b * y1 - c * z1);
   d = Math.abs((a * x4 + b * y4 + c * z4 + d));
   let e = Math.sqrt(a * a + b * b + c * c);
   return parseInt((d / e)/2);
} // balanceDistance()

function populateSelect() {
   if(debugMode) console.log(arguments.callee.name+"()");
   select = document.getElementById("select");
   anim = document.getElementById("animation");
   lines = anim.innerHTML.split("<br>"); 
   newselect = "";
   lines.forEach((oneline,i) => {
      if(i < 1) {
         newselect = newselect + " <br>";
      } else {
         newselect = newselect + "<span style='"+arrowStyle+"' id='"+i+"' onclick='highlightLine("+i+");'>&gt;&gt;&gt;</span><br>";
      }
   });
   select.innerHTML = newselect;
} // populateSelect()

function moveRightSide() {
   if(debugMode) console.log(arguments.callee.name+"()");
   current = document.getElementById("DisplaySeparateSides").checked;
   if(current == true) {
      movement = movementAmt;
   } else { 
      movement = -movementAmt;
   }
   document.getElementById("RBittleBody").style.left = parseInt(document.getElementById("RBittleBody").style.left) + movement + "px";
   document.getElementById("RFrontTop").style.left = parseInt(document.getElementById("RFrontTop").style.left) + movement + "px";
   document.getElementById("RBackTop").style.left = parseInt(document.getElementById("RBackTop").style.left) + movement + "px";
   document.getElementById("RFrontBottom").style.left = parseInt(document.getElementById("RFrontBottom").style.left) + movement + "px";
   document.getElementById("RBackBottom").style.left = parseInt(document.getElementById("RBackBottom").style.left) + movement + "px";
   document.getElementById("RfrontTopPivot").style.left = parseInt(document.getElementById("RfrontTopPivot").style.left) + movement + "px";
   document.getElementById("RfrontBottomPivot").style.left = parseInt(document.getElementById("RfrontBottomPivot").style.left) + movement + "px";
   document.getElementById("RbackTopPivot").style.left = parseInt(document.getElementById("RbackTopPivot").style.left) + movement + "px";
   document.getElementById("RbackBottomPivot").style.left = parseInt(document.getElementById("RbackBottomPivot").style.left) + movement + "px";
   document.getElementById("RSideName").style.left = parseInt(document.getElementById("RSideName").style.left) + movement + "px";
   RbtPivotAbsX = RbtPivotAbsX + movement;
   RftPivotAbsX = RftPivotAbsX + movement;
   Rbtpx = Rbtpx + movement;
   Rftpx = Rftpx + movement;
   moveit();
} // function moveRightSide()

function bodySlider() {
   if(debugMode) console.log(arguments.callee.name+"()");
   movement = parseInt(document.getElementById("RightBodySlider").value);
   RbodyAbsX = RbaseXpos + RBodyAbsXos + movement;          // Absolute R X Body position (531)
   RfrontTopAbsX = RbaseXpos + RFrontTopAbsXos + movement;  // Absolute X Front Top (539)
   RbackTopAbsX  = RbaseXpos + RBackTopAbsXos + movement;   // Absolute X Back Top (962)
   RfrontBotAbsX = RbaseXpos + RFrontBotAbsXos + movement;  // Absolute X Front Bottom (400)
   RbackBotAbsX  = RbaseXpos + RBackBotAbsXos + movement;   // Absolute X Back Bottom (824)
   Rftpx = RbaseXpos + RFrontTopPivXos + movement;          // Absolute X Front Top pivot (565)
   Rfbpx = RbaseXpos + RFrontBotPivXos + movement;          // Absolute X Front Bottom pivot (561)
   Rbtpx = RbaseXpos + RBackTopPivXos + movement;           // Absolute X Back Top pivot (984)
   Rbbpx = RbaseXpos + RBackTopPivXos + movement;
   RftPivotAbsX = RbaseXpos + RFrontTopPivXos + movement;   // Absolute Front Top X pivot (565)
   RbtPivotAbsX = RbaseXpos + RBackTopPivXos + movement;    // Absolute Back Top X pivot (993)
   RSideNameAbsX = RbaseXpos + RSideNameXos + movement;     // (750)
   document.getElementById("RBittleBody").style.left = RbodyAbsX + "px"; 
   document.getElementById("RFrontTop").style.left = RfrontTopAbsX + "px";
   document.getElementById("RBackTop").style.left = RbackTopAbsX + "px";
   document.getElementById("RFrontBottom").style.left = RfrontBotAbsX + "px";
   document.getElementById("RBackBottom").style.left = RbackBotAbsX + "px";
   document.getElementById("RfrontTopPivot").style.left = Rftpx + "px";
   document.getElementById("RfrontBottomPivot").style.left = Rfbpx + "px";
   document.getElementById("RbackTopPivot").style.left = Rbtpx + "px";
   document.getElementById("RbackBottomPivot").style.left = Rbbpx + "px";
   document.getElementById("RSideName").style.left = RSideNameAbsX + "px";
   moveit();
} // function bodySlider()

function smooth() {
// Place a step (or more) between existing steps
   if(debugMode) console.log(arguments.callee.name+"()");
   anim = document.getElementById("animation");
   lines = anim.innerHTML.split("<br>"); 
   smoothlines = "";
   lines.forEach((oneline,i) => {
      if(i < 1) {
         smoothlines = oneline + " <br>";
      } else {  // lookahead and insert a line
         smoothlines = smoothlines + oneline + " <br>";
         if(lines.length > i+1) {
            commas = oneline.split(",");
            next   = lines[i+1].split(",");
            avgvals = new Array();
            commas.forEach((oneval,j) => {
               if(j < commas.length-1) {
                  avgvals[j] = parseInt((parseInt(commas[j].trim()) + parseInt(next[j].trim())) / 2);
               }
            });
            smoothlines = smoothlines + avgvals.join(",") + ", <br>"; 
         }
      }
   });
   anim.innerHTML = smoothlines;
   lines = anim.innerHTML.split("<br>");
   commas = lines[0].split(",");
   if(skillType == "gait") {
      commas[0] = lines.length - 1;
   } else if(skillType == "posture") {
      commas[0] = 1;
   } else if(skillType == "behavior") {
      commas[0] = -(lines.length - 1);
   }
   lines[0] = commas.join(",");
   animationText = lines.join("<br>");
   animationText = animationText.replace(/(.<br>$)/,"");
   anim.innerHTML = animationText;
   populateSelect();
} // function smooth()

function demo() {
   if(debugMode) console.log(arguments.callee.name+"()");
   anim = document.getElementById("animation");
   anim.innerHTML = demoInstinct.replace(/\n/mg,"<br>");
   document.getElementById("sleepTime").value = 25;
   document.getElementById("loopCount").value = 5;
   changeSkill("gait");
   populateSelect();
} // function demo()

function highlightLine(lineNo) {
   if(debugMode) console.log(arguments.callee.name+"("+lineNo+")");
   if(lineNo < 1) return;
   anim = document.getElementById("animation"); 
   old = anim.innerHTML.split("<br>");
   newanim = "";
   old.forEach((oneline,i) => {
      oneline = oneline.replace(highlight,"");
      oneline = oneline.replace(highlightoff,"");
      if(i == lineNo) {
         commas = oneline.split(",");
         document.getElementById("instinct").innerHTML = oneline;
         if(skillType == "gait") {
            document.getElementById("LfrontTopAngle").value = commas[0].trim();
            document.getElementById("RfrontTopAngle").value = commas[1].trim();
            document.getElementById("RbackTopAngle").value = commas[2].trim();
            document.getElementById("LbackTopAngle").value = commas[3].trim();
            document.getElementById("LfrontBotAngle").value = commas[4].trim();
            document.getElementById("RfrontBotAngle").value = commas[5].trim();
            document.getElementById("RbackBotAngle").value = commas[6].trim();
            document.getElementById("LbackBotAngle").value = commas[7].trim();
         } else if(skillType == "posture") {
            document.getElementById("LfrontTopAngle").value = commas[8].trim();
            document.getElementById("RfrontTopAngle").value = commas[9].trim();
            document.getElementById("RbackTopAngle").value = commas[10].trim();
            document.getElementById("LbackTopAngle").value = commas[11].trim();
            document.getElementById("LfrontBotAngle").value = commas[12].trim();
            document.getElementById("RfrontBotAngle").value = commas[13].trim();
            document.getElementById("RbackBotAngle").value = commas[14].trim();
            document.getElementById("LbackBotAngle").value = commas[15].trim();
         } else if(skillType == "behavior") {
            document.getElementById("LfrontTopAngle").value = commas[8].trim();
            document.getElementById("RfrontTopAngle").value = commas[9].trim();
            document.getElementById("RbackTopAngle").value = commas[10].trim();
            document.getElementById("LbackTopAngle").value = commas[11].trim();
            document.getElementById("LfrontBotAngle").value = commas[12].trim();
            document.getElementById("RfrontBotAngle").value = commas[13].trim();
            document.getElementById("RbackBotAngle").value = commas[14].trim();
            document.getElementById("LbackBotAngle").value = commas[15].trim();
         }
         moveit();
         newanim += highlight+oneline+highlightoff+"<br>";
      } else {
         newanim += oneline;
         if(i < old.length-1) newanim += "<br>";
      }
   });
   anim.innerHTML = newanim;
} // highlightLine()

function editAnimation() {
   if(debugMode) console.log(arguments.callee.name+"()");
   document.getElementById("editAnimation").disabled = true;
   document.getElementById("saveAnimation").disabled = false;
   document.getElementById("cancelAnimation").disabled = false;
   document.getElementById("demo").disabled = true;
   document.getElementById("select").innerHTML = "";
   animationObject = document.getElementById("animation");
   animationContent = animationObject.innerHTML;
   animationTemp = animationContent;
   animationContent = animationContent.replace(/<br>+/gm,"\n");
   animationContent = animationContent.replace(highlight,"");
   animationContent = animationContent.replace(highlightoff,"");
   animationObject.innerHTML = "<textarea id='editAnimationInput' cols='65' rows='25'>"+animationContent+"</textarea>";
   document.getElementById("editAnimationInput").focus();
} // function editAnimation

function saveAnimation() {
   if(debugMode) console.log(arguments.callee.name+"()");
   document.getElementById("editAnimation").disabled = false;
   document.getElementById("saveAnimation").disabled = true;
   document.getElementById("cancelAnimation").disabled = true;
   document.getElementById("demo").disabled = false;
   animationText = document.getElementById("editAnimationInput").value;
   lines = animationText.split("\n");
   if(lines[lines.length-1].trim() == "") lines.pop();
   if(lines[lines.length-1].trim() == "") lines.pop();
   test = lines[1].split(",");  // Change skillType based on second line
   if(test.length == 9) {
      skillType = "gait";
      document.getElementById("gaitSkill").checked = "checked";
      document.getElementById("animation").style.background = gaitColor;
   } else if(test.length == 17) {
      skillType = "posture";
      document.getElementById("postureSkill").checked = "checked";
      document.getElementById("animation").style.background = postureColor;
   } else if(test.length == 21) {
      skillType = "behavior";
      document.getElementById("behaviorSkill").checked = "checked";
      document.getElementById("animation").style.background = behaviorColor;
   }
   commas = lines[0].split(",");
   if(skillType == "gait") {
      commas[0] = lines.length - 1;
      document.getElementById("behaviorFirst").value = "0"
      document.getElementById("behaviorLast").value  = "0"
      document.getElementById("behaviorMult").value  = "0"
   } else if(skillType == "posture") {
      commas[0] = 1;
      document.getElementById("behaviorFirst").value = "0"
      document.getElementById("behaviorLast").value  = "0"
      document.getElementById("behaviorMult").value  = "0"
   } else if(skillType == "behavior") {
      commas[0] = -(lines.length - 1);
      allvalues = animationText.split(",");
      document.getElementById("behaviorFirst").value = allvalues[4].trim();
      document.getElementById("behaviorLast").value  = allvalues[5].trim(); 
      document.getElementById("behaviorMult").value  = allvalues[6].trim();
   }
   lines[0] = commas.join(",");
   animationText = lines.join("<br>");
   animationText = animationText.replace(/(.<br>$)/,"");
   document.getElementById("animation").innerHTML = animationText;
   populateSelect();
} // function saveAnimation()

function cancelAnimation() {
   if(debugMode) console.log(arguments.callee.name+"()");
   document.getElementById("editAnimation").disabled = false;
   document.getElementById("saveAnimation").disabled = true;
   document.getElementById("cancelAnimation").disabled = true;
   document.getElementById("demo").disabled = false;
   document.getElementById("animation").innerHTML = animationTemp;
   populateSelect();
} // function cancelAnimation()

function animationEdit() {
   if(debugMode) console.log(arguments.callee.name+"()");
   anim = document.getElementById("animation");
   rewrite = anim.innerHTML;
   rewrite = rewrite.replace(/&nbsp;+/gm,'');
   rewrite = rewrite.replace(/<div>+/gm,'<br>');
   rewrite = rewrite.replace(/<\/div>+/gm,'');
   rewrite = rewrite.replace(/<br>$/,'');  // This is an issue - how delete ALL lines with only <br>?
   rewrite = rewrite.replace(/<br>$/,'');
   rewrite = rewrite.replace(/<br>$/,'');
   rewrite = rewrite.replace(/<br>$/,'');
//   rewrite = rewrite.replace(/^\s*[\r\n]|^\s+| +(?= )| +$|\s+$(?![^])/gm, '');
   anim.innerHTML = rewrite;
   lines = anim.innerHTML.split(/<br>/); 
   lineOne = lines[0];
   commas = lineOne.split(",");
   skillTypeNum = commas[0].trim();
   if(skillTypeNum < 1) {
      skillType = behavior;
      if(commas.length = 5) {  // Fix Behavior skill on two lines
         rewrite = lines[0] + lines[1] + "<br>";
         for(x=2; x<lines.length; x++) {
            rewrite = rewrite + lines[x];
            if(x < lines.length-3) rewrite = rewrite + "<br>"; 
         }
         anim.innerHTML = rewrite;
         lines = anim.innerHTML.split(/<br/);
         lineOne = lines[0];
         commas = lineOne.split(",");
      }
      behaviorFirst = commas[4];
      document.getElementById("behaviorFirst").value = behaviorFirst;
      behaviorLast  = commas[5];
      document.getElementById("behaviorLast").value  = behaviorLast;
      behaviorMult  = commas[6];
      document.getElementById("behaviorMult").value  = behaviorMult;
      document.getElementById("behaviorSkill").checked = "checked";
   }
   if(skillTypeNum == 1) {
      skillType = "posture";
      document.getElementById("postureSkill").checked = "checked";
   }
   if(skillTypeNum > 1) {
      skillType = "gait";
      document.getElementById("gaitSkill").checked = "checked";
   }
} // function animationEdit()

function slider() {
   if(debugMode) console.log(arguments.callee.name+"()");
   document.getElementById("LfrontTopAngle").value = document.getElementById("LftSlider").value;
   document.getElementById("LfrontBotAngle").value = document.getElementById("LfbSlider").value;
   document.getElementById("LbackTopAngle").value = document.getElementById("LbtSlider").value;
   document.getElementById("LbackBotAngle").value = document.getElementById("LbbSlider").value;
   document.getElementById("RfrontTopAngle").value = document.getElementById("RftSlider").value;
   document.getElementById("RfrontBotAngle").value = document.getElementById("RfbSlider").value;
   document.getElementById("RbackTopAngle").value = document.getElementById("RbtSlider").value;
   document.getElementById("RbackBotAngle").value = document.getElementById("RbbSlider").value;
   moveit();
} // function slider()

function changeSkill(skill) {
   if(debugMode) console.log(arguments.callee.name+"("+skill+")");
   skillType = skill;
   anim = document.getElementById("animation");
   lines = anim.innerHTML.split(/<br>/);
   instinct = document.getElementById("instinct").innerHTML;
   newLines = "";
   document.getElementById("behaviorFirst").disabled = true;
   document.getElementById("behaviorLast").disabled  = true;
   document.getElementById("behaviorMult").disabled  = true;
   if (skillType == "gait") {
      document.getElementById("animation").style.background = gaitColor;
      document.getElementById("gaitSkill").checked = "checked";
      preamble = (lines.length-1)+", 0, 0, 1,";
      prefix = "";
      suffix = "";
      newLines = "";
      lines.forEach((oneLine,i) => {
         if(i == 0) {
            newLines = preamble+"<br>";
         } else {
            s = oneLine.split(',');
            if(s.length == 9) {           // gait
               newLines = newLines+oneLine+"<br>";
            } else if(s.length == 17) {   // posture
               newLines = newLines+s[8]+","+s[9]+","+s[10]+","+s[11]+","+s[12]+","+s[13]+","+s[14]+","+s[15]+",<br>";
            } else if(s.length == 21) {   // behavior
               newLines = newLines+s[8]+","+s[9]+","+s[10]+","+s[11]+","+s[12]+","+s[13]+","+s[14]+","+s[15]+",<br>";
            }
         }
      });
      document.getElementById("behaviorFirst").value = "0";
      document.getElementById("behaviorLast").value = "0"
      document.getElementById("behaviorMult").value = "0"
   } else if (skillType == "posture") {
      document.getElementById("animation").style.background = postureColor; 
      document.getElementById("postureSkill").checked = "checked";
      preamble = "1, 0, 0, 1,";
      prefix = "0, 0, 0, 0, 0, 0, 0, 0, ";
      suffix = "";
      newLines = "";
      lines.forEach((oneLine,i) => {
         if(i == 0) {
            newLines = preamble+"<br>";
         } else {
            s = oneLine.split(',');
            if(s.length == 9) {           // gait
               newLines = newLines+"0, 0, 0, 0, 0, 0, 0, 0, "+oneLine+"<br>";
            } else if(s.length == 17) {   // posture
               newLines = newLines+oneLine+"<br>";
            } else if(s.length == 21) {   // behavior
               newLines = newLines+s[0]+","+s[1]+","+s[2]+","+s[3]+","+s[4]+","+s[5]+","+s[6]+","+s[7]+","+s[8]+","+s[9]+","+s[10]+","+s[11]+","+s[12]+","+s[13]+","+s[14]+","+s[15]+",<br>";
            }
         }
      });
      document.getElementById("behaviorFirst").value = "0";
      document.getElementById("behaviorLast").value = "0"
      document.getElementById("behaviorMult").value = "0"
   } else if (skillType == "behavior") {
      document.getElementById("animation").style.background = behaviorColor;
      document.getElementById("behaviorSkill").checked = "checked";
      document.getElementById("behaviorFirst").disabled = false;
      document.getElementById("behaviorLast").disabled  = false;
      document.getElementById("behaviorMult").disabled  = false;
      firstRepeat = parseInt(document.getElementById("behaviorFirst").value)+0;
      lastRepeat  = parseInt(document.getElementById("behaviorLast").value)+0;
      repeatCount = parseInt(document.getElementById("behaviorMult").value)+0;
//      preamble = "-"+(lines.length-1)+", 0, 0, 0, 0, 0, 0";
      preamble = "-"+(lines.length-1)+", 0, 0, 1, "+firstRepeat+", "+lastRepeat+", "+repeatCount+",";
      prefix = "0, 0, 0, 0, 0, 0, 0, 0, ";
      suffix = " "+behaviorSpeed+", 0, 0, 0,";
      newLines = "";
      lines.forEach((oneLine,i) => {
         if(i == 0) {
            newLines = preamble+"<br>";
         } else {
            s = oneLine.split(',');
            if(s.length == 9) {           // gait
               newLines = newLines+"0, 0, 0, 0, 0, 0, 0, 0, "+oneLine+" "+behaviorSpeed+", 0, 0, 0,<br>";
            } else if(s.length == 17) {   // posture
               newLines = newLines+oneLine+" 4, 0, 0, 0,<br>";
            } else if(s.length == 21) {   // behavior
               newLines = newLines+oneLine + "<br>";
            }
         }
      });
   } else {
      document.getElementById("instinctpreamble").innerHTML = "error!";
   }
   newLines = newLines.replace(new RegExp("<br>" + '$'), '');// Remove last <br>
   document.getElementById("instinct").innerHTML = prefix+document.getElementById("LfrontTopAngle").value+", "+document.getElementById("RfrontTopAngle").value+", "+document.getElementById("RbackTopAngle").value+", "+document.getElementById("LbackTopAngle").value+", "+document.getElementById("LfrontBotAngle").value+", "+document.getElementById("RfrontBotAngle").value+", "+document.getElementById("RbackBotAngle").value+", "+document.getElementById("LbackBotAngle").value+","+suffix;
   anim.innerHTML = newLines;
} // function changeSkill()

function save() {
   if(debugMode) console.log(arguments.callee.name+"()");
   anim = document.getElementById("animation");
   instinct = document.getElementById("instinct");
   if (anim.innerHTML != "") {
      anim.innerHTML = anim.innerHTML + "<br>";
   }
   anim.value = anim.value + instinct.innerHTML;
   anim.innerHTML = anim.innerHTML + instinct.innerHTML; 
//   newLines = "";
   lines = anim.innerHTML.split(/<br>/);
   lines.forEach((oneLine,i) => {
      if(i == 0) {
         if (skillType == "gait") {
            newLines = (lines.length-1)+", 0, 0, 1,";
         } else if (skillType == "posture") {
            newLines = "1, 0, 0, 1, ";
         } else if (skillType == "behavior") {
            newLines = "-"+(lines.length-1)+", 0, 0, 1,";
         } else {
            newLines = "error!";
         }
      } else {
         newLines = newLines + oneLine;
      }
      if(i+1 < lines.length) newLines = newLines + "<br>";
   });
   anim.innerHTML = newLines;
   populateSelect();
} // function save()

function disableInput(disable) {
   if(debugMode) console.log(arguments.callee.name+"("+disable+")");
   document.getElementById("loopButton").disabled     = disable;
   document.getElementById("loopCount").disabled      = disable;
   document.getElementById("saveButton").disabled     = disable;
   document.getElementById("LfrontTopAngle").disabled = disable;
   document.getElementById("LfrontBotAngle").disabled = disable;
   document.getElementById("LbackTopAngle").disabled  = disable;
   document.getElementById("LbackBotAngle").disabled  = disable;
   document.getElementById("RfrontTopAngle").disabled = disable;
   document.getElementById("RfrontBotAngle").disabled = disable;
   document.getElementById("RbackTopAngle").disabled  = disable;
   document.getElementById("RbackBotAngle").disabled  = disable;
   document.getElementById("skillFormTag").disabled   = disable;
   document.getElementById("sleepTime").disabled      = disable;
   document.getElementById("gaitSkill").disabled      = disable;
   document.getElementById("postureSkill").disabled   = disable;
   document.getElementById("behaviorSkill").disabled  = disable;
   document.getElementById("LftSlider").disabled      = disable;
   document.getElementById("LfbSlider").disabled      = disable;
   document.getElementById("LbtSlider").disabled      = disable;
   document.getElementById("LbbSlider").disabled      = disable;
   document.getElementById("RftSlider").disabled      = disable;
   document.getElementById("RfbSlider").disabled      = disable;
   document.getElementById("RbtSlider").disabled      = disable;
   document.getElementById("RbbSlider").disabled      = disable;
   document.getElementById("behaviorFirst").disabled  = disable;
   document.getElementById("behaviorLast").disabled   = disable;
   document.getElementById("behaviorMult").disabled   = disable;
   document.getElementById("editAnimation").disabled  = disable;
   document.getElementById("demo").disabled           = disable;
   document.getElementById("smooth").disabled         = disable;
   document.getElementById("copy").disabled           = disable;
   document.getElementById("instinctFromFile").disabled   = disable;
} // function disableInput()

//////////////////////////////////////////////////
//////////////////////////////////////////////////

async function loop() {
   if(debugMode) console.log(arguments.callee.name+"()");
   loopCnt = parseInt(document.getElementById("loopCount").value);
   sleepTime = document.getElementById("sleepTime").value;
   disableInput(true);
   var go = 1;
   var cnt = 0;
   var cnt1 = 0;
   anim = document.getElementById("animation");
   rewrite = anim.innerHTML;
   rewrite = rewrite.replace(/&nbsp;+/gm,'');
   rewrite = rewrite.replace(/<div>+/gm,'');
   rewrite = rewrite.replace(/<\/div>+/gm,'');
   anim.innerHTML = rewrite;
   lines = anim.innerHTML.split(/<br>/);
   lineCnt = lines.length - 1;
   while (cnt < loopCnt) {
      setTimeout(function() {
         cnt1++;
         run(cnt1,loopCnt);
      }, cnt*lineCnt*sleepTime);
      setTimeout(function() {
         document.getElementById("step").innerHTML = "";
         rewrite = document.getElementById("animation").innerHTML;
         rewrite = rewrite.replace(highlight,'');
         rewrite = rewrite.replace(highlightoff,'');
         document.getElementById("animation").innerHTML = rewrite;
         disableInput(false);
      }, (cnt+1)*lineCnt*sleepTime);
      cnt++;
   }
} // function loop()

async function run(loopCnt,totLoops) {
   if(debugMode) console.log(arguments.callee.name+"("+loopCnt+","+totLoops+")");
   disableInput(true);
   sleepTime = document.getElementById("sleepTime").value;
   anim = document.getElementById("animation").innerHTML;
   lines = anim.split(/<br>/);
   if(anim != "") {
      lines.forEach((oneLine,i) => {
         if(oneLine.length > 8 && i != 0) {
            setTimeout(function() {
               servos = oneLine.split(',');
               LftServo =  8;
               RftServo =  9;
               RbtServo = 10;
               LbtServo = 11;
               LfbServo = 12;
               RfbServo = 13;
               RbbServo = 14;
               LbbServo = 15;
               if (skillType == "gait") {
                  LftServo = LftServo - 8;
                  LfbServo = LfbServo - 8;
                  LbtServo = LbtServo - 8;
                  LbbServo = LbbServo - 8;
                  RftServo = RftServo - 8;
                  RfbServo = RfbServo - 8;
                  RbtServo = RbtServo - 8;
                  RbbServo = RbbServo - 8;
               }
               rewrite = "";
               lines.forEach((onetline,j) => {
                  onetline = onetline.replace(highlight, '');
                  onetline = onetline.replace(highlightoff, '');
                  if(i == j) {
                     onetline = highlight+onetline+highlightoff;
                  }
                  rewrite = rewrite + onetline + "<br>";
               });
               rewrite = rewrite.replace(new RegExp("<br>" + '$'), '');   // Remove last <br>
               document.getElementById("animation").innerHTML = rewrite;
               document.getElementById("LfrontTopAngle").value = servos[LftServo].trim();
               document.getElementById("LfrontBotAngle").value = servos[LfbServo].trim();
               document.getElementById("LbackTopAngle").value = servos[LbtServo].trim();
               document.getElementById("LbackBotAngle").value = servos[LbbServo].trim();
               document.getElementById("RfrontTopAngle").value = servos[RftServo].trim();
               document.getElementById("RfrontBotAngle").value = servos[RfbServo].trim();
               document.getElementById("RbackTopAngle").value = servos[RbtServo].trim();
               document.getElementById("RbackBotAngle").value = servos[RbbServo].trim();

               moveit();
               perc = " "+parseInt(100 * (((loopCnt-1)*(lines.length-1))+i) / (totLoops * (lines.length-1)))+"%";
               percTab = "<table bgcolor=#dddddd width=100% cellpadding=0 cellspacing=0><tr><td><table cellpadding=0 cellspacing=0 width="+perc+"% bgcolor=#8888ff><tr><td>&nbsp;</td></tr></table></td></tr></table>";
               progress = "<table width=100% cellspacing=0><tr><td width=35%>Loop&nbsp;"+loopCnt+"&nbsp;/&nbsp;"+totLoops+"</td><td width=49%>Step&nbsp;"+(i)+"&nbsp;/&nbsp;"+(lines.length-1)+"</td><td width=33% valign=right>"+perc+"</td></tr><tr><td colspan=3>"+percTab+"</td></tr></table>";
               document.getElementById("step").innerHTML = progress;
            }, (i-1)*sleepTime);
         }
      });
   }
} // function run()

//////////////////////////////
// Point on a circle's circumference (r=radius; cx,cy=origin; a=angle):
//    x = cx + r * cos(a)
//    y = cy + r * sin(a)
//////////////////////////////
function moveit() {
   if(debugMode) console.log(arguments.callee.name+"()");
   skillTypeList = document.getElementsByName("skill");
   clearCanvas();
   for (var i=0; i<skillTypeList.length; i++) {
      if (skillTypeList[i].checked) {
         skillType = skillTypeList[i].value;
      }
   }
   if(document.getElementById("DisplayCanvas").checked == true) {
      document.getElementById("canvas").hidden = false;
   } else {
      document.getElementById("canvas").hidden = true;
   }
   if(document.getElementById("DisplayPivots").checked == true) {
      document.getElementById("pivotDots").hidden = false;
   } else {
      document.getElementById("pivotDots").hidden = true;
   }
   if(document.getElementById("DisplayGrid").checked == true) {
      document.getElementById("graylines").hidden = false;
   } else {
      document.getElementById("graylines").hidden = true;
   }
   if(document.getElementById("DisplaySurfaces").checked == true) {
      document.getElementById("topLine").hidden = false;
      document.getElementById("bottomline").hidden = false;
   } else {
      document.getElementById("topLine").hidden = true;
      document.getElementById("bottomline").hidden = true;
   }
//document.getElementById("instinctList").hidden = true;
   sleepTime     = document.getElementById("sleepTime").value;
   LfrontTopAngle = document.getElementById("LfrontTopAngle").value;
   if(parseInt(LfrontTopAngle) > FmaxTopAngle) {
      LfrontTopAngle = FmaxTopAngle;
		document.getElementById("LfrontTopAngle").value = FmaxTopAngle;
   }
   if(parseInt(LfrontTopAngle) < FminTopAngle) {
      LfrontTopAngle = FminTopAngle;
      document.getElementById("LfrontTopAngle").value = FminTopAngle;
   }
   if(parseInt(LfrontBotAngle) > maxBotAngle) {
      LfrontBotAngle = maxBotAngle;
      document.getElementById("LfrontBotAngle").value = maxBotAngle;
   }
   if(parseInt(LfrontBotAngle) < minBotAngle) {
      LfrontBotAngle = minBotAngle;
      document.getElementById("LfrontBotAngle").value = minBotAngle;
   }
   if(parseInt(LbackTopAngle) > BmaxTopAngle) {
      LbackTopAngle = BmaxTopAngle;
      document.getElementById("LbackTopAngle").value = BmaxTopAngle;
   }
   if(parseInt(LbackTopAngle) < BminTopAngle) {
      LbackTopAngle = BminTopAngle;
      document.getElementById("LbackTopAngle").value = BminTopAngle;
   }
   if(parseInt(LbackBotAngle) > maxBotAngle) {
      LbackBotAngle = maxBotAngle;
      document.getElementById("LbackBotAngle").value = maxBotAngle;
   }
   if(parseInt(LbackBotAngle) < minBotAngle) {
      LbackBotAngle = minBotAngle;
      document.getElementById("LbackBotAngle").value = minBotAngle;
   }
   RfrontTopAngle = document.getElementById("RfrontTopAngle").value;
   if(parseInt(RfrontTopAngle) > FmaxTopAngle) {
      RfrontTopAngle = FmaxTopAngle;
      document.getElementById("RfrontTopAngle").value = FmaxTopAngle;
   }
   if(parseInt(RfrontTopAngle) < FminTopAngle) {
      RfrontTopAngle = FminTopAngle;
      document.getElementById("RfrontTopAngle").value = FminTopAngle;
   }
   if(parseInt(RfrontBotAngle) > maxBotAngle) {
      RfrontBotAngle = maxBotAngle;
      document.getElementById("RfrontBotAngle").value = maxBotAngle;
   }
   if(parseInt(RfrontBotAngle) < minBotAngle) {
      RfrontBotAngle = minBotAngle;
      document.getElementById("RfrontBotAngle").value = minBotAngle;
   }
   if(parseInt(RbackTopAngle) > BmaxTopAngle) {
      RbackTopAngle = BmaxTopAngle;
      document.getElementById("RbackTopAngle").value = BmaxTopAngle;
   }
   if(parseInt(RbackTopAngle) < BminTopAngle) {
      RbackTopAngle = BminTopAngle;
      document.getElementById("RbackTopAngle").value = BminTopAngle;
   }
   if(parseInt(RbackBotAngle) > maxBotAngle) {
      RbackBotAngle = maxBotAngle;
      document.getElementById("RbackBotAngle").value = maxBotAngle;
   }
   if(parseInt(RbackBotAngle) < minBotAngle) {
      RbackBotAngle = minBotAngle;
      document.getElementById("RbackBotAngle").value = minBotAngle;
   }
   document.getElementById("LftSlider").value = LfrontTopAngle;
   LfrontBotAngle = document.getElementById("LfrontBotAngle").value;
   document.getElementById("LfbSlider").value = LfrontBotAngle;
   LbackTopAngle  = document.getElementById("LbackTopAngle").value;
   document.getElementById("LbtSlider").value = LbackTopAngle;
   LbackBotAngle  = document.getElementById("LbackBotAngle").value;
   document.getElementById("LbbSlider").value = LbackBotAngle;
   document.getElementById("RftSlider").value = RfrontTopAngle;
   RfrontBotAngle = document.getElementById("RfrontBotAngle").value;
   document.getElementById("RfbSlider").value = RfrontBotAngle;
   RbackTopAngle  = document.getElementById("RbackTopAngle").value;
   document.getElementById("RbtSlider").value = RbackTopAngle;
   RbackBotAngle  = document.getElementById("RbackBotAngle").value;
   document.getElementById("RbbSlider").value = RbackBotAngle;

   bittleCommand = document.getElementById("bittleCommand");
   instinct      = document.getElementById("instinct");
   LfrontTopImg  = document.getElementById("LFrontTop");
   LfrontBotImg  = document.getElementById("LFrontBottom");
   LbackTopImg   = document.getElementById("LBackTop");
   LbackBotImg   = document.getElementById("LBackBottom");
   RfrontTopImg  = document.getElementById("RFrontTop");
   RfrontBotImg  = document.getElementById("RFrontBottom");
   RbackTopImg   = document.getElementById("RBackTop");
   RbackBotImg   = document.getElementById("RBackBottom");
   LfrontTopImg.style.transformOrigin = ftxOrig+"px "+ftyOrig+"px";
   aLfrontTopAngle = -(LfrontTopAngle);
   LfrontTopImg.style.transform = "rotate(" + aLfrontTopAngle + "deg)";
   frontTopRadian = (aLfrontTopAngle-25) * (Math.PI / 180);  // Degrees to Radians
   newFrontX = parseInt(LftPivotAbsX + radius * Math.cos(frontTopRadian+90)); // New pivot X for front bottom
   newFrontY = parseInt(LftPivotAbsY + radius * Math.sin(frontTopRadian+90)); // New pivot Y for front bottom
   LnewFrontPivot = document.getElementById("LnewFrontPivot");  // Blue Dot
   LnewFrontPivot.style.left = newFrontX + "px";                // Blue Dot
   LnewFrontPivot.style.top  = newFrontY + "px";                // Blue Dot

   LfrontBotImg.style.transformOrigin = fbxOrig+"px "+fbyOrig+"px";
   frontTotalTurn = parseInt(-LfrontBotAngle) + parseInt(aLfrontTopAngle);
   LfrontBotImg.style.transform = "rotate(" + frontTotalTurn + "deg)";
   LfrontBotImg.style.left = newFrontX - fbxOrig + "px";
   LfrontBotImg.style.top  = newFrontY - fbyOrig + "px";
   LbackTopImg.style.transformOrigin = btxOrig+"px "+btyOrig+"px";
   aLbackTopAngle = -(LbackTopAngle);
   LbackTopImg.style.transform = "rotate(" + aLbackTopAngle + "deg)";
   backTopRadian = (aLbackTopAngle-25) * (Math.PI / 180);  // Degrees to Radians
   newBackX = parseInt(LbtPivotAbsX + radius * Math.cos(backTopRadian+90)); // New pivot X for front bottom
   newBackY = parseInt(LbtPivotAbsY + radius * Math.sin(backTopRadian+90)); // New pivot Y for front bottom
   LnewBackPivot = document.getElementById("LnewBackPivot");    // Blue Dot
   LnewBackPivot.style.left = newBackX + "px";                  // Blue Dot
   LnewBackPivot.style.top  = newBackY + "px";                  // Blue Dot
   LbackBotImg.style.transformOrigin = bbxOrig+"px "+bbyOrig+"px";
   backTotalTurn = parseInt(-LbackBotAngle) + parseInt(aLbackTopAngle);
   LbackBotImg.style.transform = "rotate(" + backTotalTurn + "deg)";
   LbackBotImg.style.left = newBackX - bbxOrig + "px";
   LbackBotImg.style.top  = newBackY - bbyOrig + "px";
   r = 170;
   footRadian = (frontTotalTurn+185) * (Math.PI / 180);
   fx = parseInt(newFrontX + r * Math.cos(footRadian));
   fy = parseInt(newFrontY + r * Math.sin(footRadian));
   testing = document.getElementById("LfrontFootPivot");
   testing.style.left = fx+"px";
   testing.style.top =  fy+"px";
   LfrontFootX = fx;
   LfrontFootY = fy;
   Lftpy = parseInt(document.getElementById("LfrontTopPivot").style.top);
   if(fx > Lftpx && fy < Lftpy & LfrontTopAngle > 0) {
      document.getElementById("warning1").innerHTML = "<span style='color:red;background:#ffffcf; font-weight:bold;'> Warning! Left front foot may hit body! </span>";
   } else {
      document.getElementById("warning1").innerHTML = "";
   }
   footRadian = (backTotalTurn+185) * (Math.PI / 180);
   bx = parseInt(newBackX + r * Math.cos(footRadian));
   by = parseInt(newBackY + r * Math.sin(footRadian));
   testing = document.getElementById("LbackFootPivot");
   testing.style.left = bx+"px";
   testing.style.top =  by+"px";
   LbackFootX = bx;
   LbackFootY = by;
   Lbtpy = parseInt(document.getElementById("LbackTopPivot").style.top);
   if(bx < Lbtpx && by < Lbtpy) {
      document.getElementById("warning2").innerHTML = "<span style='color:red;background:#ffffcf; font-weight:bold;'> Warning! Left back foot may hit body! </span>";
   } else {
      document.getElementById("warning2").innerHTML = "";
   }
   RfrontTopImg.style.transformOrigin = ftxOrig+"px "+ftyOrig+"px";
   aRfrontTopAngle = -(RfrontTopAngle);
   RfrontTopImg.style.transform = "rotate(" + aRfrontTopAngle + "deg)";
   frontTopRadian = (aRfrontTopAngle-25) * (Math.PI / 180);  // Degrees to Radians
   newFrontX = parseInt(RftPivotAbsX + radius * Math.cos(frontTopRadian+90)); // New pivot X for front bottom
   newFrontY = parseInt(RftPivotAbsY + radius * Math.sin(frontTopRadian+90)); // New pivot Y for front bottom
   RnewFrontPivot = document.getElementById("RnewFrontPivot");   // Blue Dot
   RnewFrontPivot.style.left = newFrontX + "px";                // Blue Dot
   RnewFrontPivot.style.top  = newFrontY + "px";                // Blue Dot
   RfrontBotImg.style.transformOrigin = fbxOrig+"px "+fbyOrig+"px";
   frontTotalTurn = parseInt(-RfrontBotAngle) + parseInt(aRfrontTopAngle);
   RfrontBotImg.style.transform = "rotate(" + frontTotalTurn + "deg)";
   RfrontBotImg.style.left = newFrontX - fbxOrig + "px";
   RfrontBotImg.style.top  = newFrontY - fbyOrig + "px";
   RbackTopImg.style.transformOrigin = btxOrig+"px "+btyOrig+"px";
   aRbackTopAngle = -(RbackTopAngle);
   RbackTopImg.style.transform = "rotate(" + aRbackTopAngle + "deg)";
   backTopRadian = (aRbackTopAngle-25) * (Math.PI / 180);  // Degrees to Radians
   newBackX = parseInt(RbtPivotAbsX + radius * Math.cos(backTopRadian+90)); // New pivot X for front bottom
   newBackY = parseInt(RbtPivotAbsY + radius * Math.sin(backTopRadian+90)); // New pivot Y for front bottom
   RnewBackPivot = document.getElementById("RnewBackPivot");     // Blue Dot
   RnewBackPivot.style.left = newBackX + "px";                  // Blue Dot
   RnewBackPivot.style.top  = newBackY + "px";                  // Blue Dot
   RbackBotImg.style.transformOrigin = bbxOrig+"px "+bbyOrig+"px";
   backTotalTurn = parseInt(-RbackBotAngle) + parseInt(aRbackTopAngle);
   RbackBotImg.style.transform = "rotate(" + backTotalTurn + "deg)";
   RbackBotImg.style.left = newBackX - bbxOrig + "px";
   RbackBotImg.style.top  = newBackY - bbyOrig + "px";
   r = 170;
   footRadian = (frontTotalTurn+185) * (Math.PI / 180);
   fx = parseInt(newFrontX + r * Math.cos(footRadian));
   fy = parseInt(newFrontY + r * Math.sin(footRadian));
   testing = document.getElementById("RfrontFootPivot");
   testing.style.left = fx+"px";
   testing.style.top =  fy+"px";
   RfrontFootX = fx;
   RfrontFootY = fy;
   Rftpy = parseInt(document.getElementById("RfrontTopPivot").style.top);
   if(fx > Rftpx && fy < Rftpy && RfrontTopAngle > 0) {
      document.getElementById("warning3").innerHTML = "<span style='color:red;background:#ffffcf; font-weight:bold;'> Warning! Right front foot may hit body! </span>";
   } else {
      document.getElementById("warning3").innerHTML = "";
   }
   footRadian = (backTotalTurn+185) * (Math.PI / 180);
   bx = parseInt(newBackX + r * Math.cos(footRadian));
   by = parseInt(newBackY + r * Math.sin(footRadian));
   testing = document.getElementById("RbackFootPivot");
   testing.style.left = bx+"px";
   testing.style.top =  by+"px";
   RbackFootX = bx;
   RbackFootY = by;
   Rbtpy = parseInt(document.getElementById("RbackTopPivot").style.top);
   if(bx < Rbtpx && by < Rbtpy) {
      document.getElementById("warning4").innerHTML = "<span style='color:red;background:#ffffcf; font-weight:bold;'> Warning! Right back foot may hit body! </span>";
   } else {
      document.getElementById("warning4").innerHTML = "";
   }
   drawLine(LfrontFootX,LfrontFootY,LbackFootX,LbackFootY,"#cfffcf");
   drawLine(RfrontFootX,RfrontFootY,RbackFootX,RbackFootY,"#cfcfff");
//drawLine(LfrontFootX,LfrontFootY,RfrontFootX,RfrontFootY);
//drawLine(LbackFootX,LbackFootY,RbackFootX,RbackFootY);

/////////////// Draw floor below foot
//document.getElementById("footline").setAttribute("x1","100");
//document.getElementById("footline").setAttribute("y1","100");
//document.getElementById("footline").setAttribute("x2","500");
//document.getElementById("footline").setAttribute("y2","500");
/////// Needs work!!!
//document.getElementById("blueline").style.top = 60 + newFrontY - fbyOrig + "px";
//document.getElementById("blueline").style.transformOrigin = fbxOrig+"px "+fbyOrig+"px";
//document.getElementById("blueline").style.transform = "rotate(" + frontTotalTurn + "deg)";
//////// Needs work!!!
//document.getElementById("LfrontTopPivot").style.left = "750px";
//document.getElementById("LfrontTopPivot").style.top  = "550px";
//document.getElementById("wholeImage").style.transformOrigin = "750px 500px";
//document.getElementById("wholeImage").style.transform = "rotate(" + frontTotalTurn + "deg)";
   bittleCommand.innerHTML = "m8 "+LfrontTopAngle+" 9 "+RfrontTopAngle+" 10 "+RbackTopAngle+" 11 "+LbackTopAngle+" 12 "+LfrontBotAngle+" 13 "+RfrontBotAngle+" 14 "+RbackBotAngle+" 15 "+LbackBotAngle;
   anim = document.getElementById("animation");
   lines = anim.innerHTML.split(/<br>/);
   if (skillType == "gait") {
      prefix = "";
      suffix = "";
      if(lines.length == 1) {
         anim.innerHTML = lines.length+", 0, 0, 1,";
      }
   } else if (skillType == "posture") {
      prefix = "0, 0, 0, 0, 0, 0, 0, 0, ";
      suffix = "";
      if(lines.length == 1) {
         anim.innerHTML = "1, 0, 0, 1,";
      }
   } else if (skillType == "behavior") {
      prefix = "0, 0, 0, 0, 0, 0, 0, 0, ";
      suffix = " "+behaviorSpeed+", 0, 0, 0,";
      if(lines.length == 1) {
         anim.innerHTML = "-"+(lines.length)+", 0, 0, 1,";
      }
   } else {
      prefix = "error!";
      suffix = "error!";
      if(lines.length == 1) {
         anim.innerHTML = "-"+(lines.length)+", 0, 0, 1,";
      }
   }
   instinct.innerHTML = prefix+LfrontTopAngle+", "+RfrontTopAngle+", "+RbackTopAngle+", "+LbackTopAngle+", "+LfrontBotAngle+", "+RfrontBotAngle+", "+RbackBotAngle+", "+LbackBotAngle+","+suffix;
//RfrontFootZ = 260; // 260 pixels is 65mm (?)
//RbackFootZ  = 260; // 260 pixels is 65mm (?)
   offBalance = balanceDistance(LfrontFootX, LfrontFootY, 0, LbackFootX, LbackFootY, 0, RfrontFootX, RfrontFootY, RfrontFootZ, RbackFootX, RbackFootY, RbackFootZ);
   document.getElementById("balanceDistance").innerHTML = "Off balance by "+offBalance+" mm";
   if(offBalance > offBalanceWarn || offBalance < -offBalanceWarn) {
      document.getElementById("balanceDistance").style.background = "#ffcfcf";
   } else {
      document.getElementById("balanceDistance").style.background = "#ffffff";
   }
} // function moveit()

/////////////////////////////// End of file
