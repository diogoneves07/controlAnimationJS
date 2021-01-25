/*
# Copyright ( c ) 2021, FlyNeves - Diogo Neves. All rights reserved.

# For licensing, see LICENSE.md or MIT License ( MIT ).

# library: controlAnimationJS - 1.0.0
___________________________________________________________________________________

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*                                                                                 *
*  The code below is long, separate in groups.                                    *
*  If you read the code, note the names of the variables, functions,              *
*  and properties of the objects.                                                 *
*                                                                                 *
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
*/
(function (global, doc, Infinity) {
  'use strict';
/*
  --------<<<<<< Parent function, Initial and global data.
*/
  var
  pointAndCommaString = ';',
  equalSignString = ':',
  emptyString = '',
  spaceString = ' ',
  noneString = 'none',
  bodyElement = doc.body,
  savedInterpolations = {
  },
  identicalTimeline = {
  },
  animationsInProgress = [
  ],
  requestAnimationFrameId = [
  ],
  animationsStyleSheet = {
  },
  animationsStyleInline = {
  },
  releaseOfStyleMutations = 0,
  lastStyleElementContent,
  animationDirections = {
    normal: 'normal',
    reverse: 'reverse',
    alternate: 'alternate',
    alternateReverse: 'alternate-reverse',
    randomKeys: 'random-keys',
    randomOffset: 'random-offset',
    fluidRandomKeys: 'fluid-random-keys',
    fluidRandomOffset: 'fluid-random-offset'
  },
  animationStates = {
    running: 'running',
    paused: 'paused',
    completed: 'completed',
    canceled: 'canceled'
  },
  animationListeners = {
    start: 'start',
    end: 'end',
    iterations: 'iterations',
    changekeys: 'changekeys'
  },
  animationsId = 0,
  libraryAnimationObjects = [
  ],
  developerAnimationObjects = [
  ],
  animationEndList = [
  ],
  animationIterationsList = [
  ],
  animationStartList = [
  ],
  animationChangekeysframeList = [
  ],
  controlAnimationString = 'controlAnimationJS',
  styleElementAnimations = appendStyleElement(),
  controlAnimationClassStringPrefix = controlAnimationString + '-class--',
  controlAnimationDefaultProperties = {
    'direction': animationDirections.normal,
    'iterations': 1,
    'fill': false,
    'easing': easeLinear,
    'duration': 3,
    'delay': false,
    'styleBetweenFrames': true,
    'keepFrameStyle': false,
    'insertStyle': 'auto'
  },
  normalizeAnimationTimeout = 13.6,
  animationTimeout,
  equestAnimationFrame = 'equestAnimationFrame',
  requestAnimationFrame = 'r' + equestAnimationFrame,
  ancelAnimationFrame = 'ancelAnimationFrame',
  cancelAnimationFrame = 'c' + ancelAnimationFrame,
  vendors = [
    'moz',
    'ms',
    'o',
    'webkit'
  ],
  vendor;
  while (!global[requestAnimationFrame] && (vendor = vendors.pop())) {
    if (global[requestAnimationFrame]) {
      global[requestAnimationFrame] = global[vendor + 'R' + equestAnimationFrame];
      global[cancelAnimationFrame] = global[vendor + 'C' + ancelAnimationFrame] || global[vendor + 'CancelR' + equestAnimationFrame];
    }
  }
  if (global.requestAnimationFrame) {
    if (global.performance && global.performance.now) {
      normalizeAnimationTimeout = false;
    }
    animationTimeout = function (runFunction, timeout, libraryAnimationObject) {
      if (_isNaN(timeout)) {
        var requestAnimationId = global.requestAnimationFrame(runFunction);
        requestAnimationFrameId[requestAnimationFrameId.length] = [
          requestAnimationId,
          noneString,
          libraryAnimationObject
        ];
        return noneString;
      }
      var idSet = setTimeout(function () {
        var requestAnimationId = global.requestAnimationFrame(runFunction);
        requestAnimationFrameId[requestAnimationFrameId.length] = [
          requestAnimationId,
          idSet,
          libraryAnimationObject
        ];
      }, timeout);
      return idSet;
    };
  } else {
    animationTimeout = function (runFunction, timeout) {
      timeout = timeout || 0;
      return global.setTimeout(function () {
        runFunction.call(global);
      }, timeout);
    };
  }  
/*
-------->>>>>>
*/
/*
  --------<<<<<< Functions that handle Arrays.
*/
  function reverseArrayClone(array) {
    return array.slice().reverse();
  }
  function ordernateByGrowingValues(array) {
    var counting = array.length;
    while (counting--) {
      array[counting] = _parseFloat(array[counting]);
    }
    return array.sort(function (a, b) {
      return a - b;
    });
  }  
/*
  -------->>>>>>
*/
/*
  --------<<<<<< Functions that configure and prepare the object for the animation.
*/
  function reverseKeyframes(keyframes, keys) {
    var reverseKeys = reverseArrayClone(keys),
    newKeyframes = {
    },
    counting = reverseKeys.length;
    while (counting--) {
      var key = reverseKeys[counting];
      newKeyframes[key] = keyframes[keys[counting]];
    }
    return newKeyframes;
  }
  function getRandomKey(keys, lastkeyframe) {
    var selected = _parseInt(Math.random() * keys.length);
    return keys[selected] == lastkeyframe ? keys[selected - 1 >= 0 ? selected - 1 : selected + 1] : keys[selected];
  }
  function normalizeCompressedStyle(stringStyleInitial, compressedStyle) {
    stringStyleInitial = removeMultipleSpacesChar(stringStyleInitial).split(pointAndCommaString);
    compressedStyle = removeMultipleSpacesChar(compressedStyle).split(pointAndCommaString);
    var counting = stringStyleInitial.length;
    while (counting--) {
      if (compressedStyle[counting]) {
        var property = compressedStyle[counting].split(equalSignString),
        propertyName = property[1] ? property[0] : emptyString,
        propertyNameIsNumber = !_isNaN(_parseInt(propertyName)) ? _parseInt(propertyName) : counting,
        propertyValue = property[1] || compressedStyle[counting],
        propertyInitialValue = stringStyleInitial[propertyNameIsNumber].split(equalSignString) [1] || stringStyleInitial[propertyNameIsNumber],
        value = removeMultipleSpacesChar(spaceString + propertyValue).split(spaceString),
        valueInitial = removeMultipleSpacesChar(spaceString + propertyInitialValue).split(spaceString),
        countingAgain = value.length,
        newSubValue = emptyString;
        while (countingAgain--) {
          var subValue = value[countingAgain];
          if (subValue) {
            if (!_isNaN(subValue)) {
              var unitOfMeasure = valueInitial[countingAgain];
              unitOfMeasure = unitOfMeasure.split(_parseFloat(unitOfMeasure)) [1] || emptyString;
              newSubValue = _parseFloat(value[countingAgain]) + unitOfMeasure + spaceString + newSubValue;
            } 
            else {
              newSubValue = value[countingAgain] + spaceString + newSubValue;
            }
          }
        }
        var checkPropertyName = compressedStyle[counting].split(equalSignString);
        if (checkPropertyName.length < 2) {
          compressedStyle[counting] = stringStyleInitial[propertyNameIsNumber].split(equalSignString) [0] + equalSignString + newSubValue;
        } else if (!_isNaN(_parseFloat(checkPropertyName[0]))) {
          compressedStyle[counting] = stringStyleInitial[_parseInt(checkPropertyName)].split(equalSignString) [0] + equalSignString + newSubValue;
        } 
        else {
          compressedStyle[counting] = propertyName + equalSignString + newSubValue;
        }
        compressedStyle[counting] = compressedStyle[counting] + pointAndCommaString;
      }
    }
    return removeDuplicateStyle(compressedStyle.join(emptyString));
  }
  function readingKeyframes(developerAnimationObject, libraryAnimationObject, actualInitialValues) {
    var maxKey = 0,
    styleObject = actualInitialValues ? actualInitialValues : {
    },
    stringStyleInitial = developerAnimationObject[0],
    key;
    stringStyleInitial = _isString(stringStyleInitial) ? stringStyleInitial : styleObjectToString(stringStyleInitial);
    libraryAnimationObject.keyframesOriginal = {
    };
    libraryAnimationObject.style = cloneObject(styleObject);
    for (key in developerAnimationObject) {
      if (_isNaN(key)) {
        continue;
      }
      var keyframeValue = cloneObject(developerAnimationObject[key]),
      frameKey = _parseFloat(key);
      libraryAnimationObject.keyframesOriginal[frameKey] = keyframeValue;
      if (_isObject(keyframeValue)) {
        keyframeValue = styleObjectToString(keyframeValue);
        libraryAnimationObject.keyframesOriginal[frameKey] = styleObjectToString(developerAnimationObject[frameKey]);
      }
      if (_isString(keyframeValue)) {
        if (frameKey == 0) {
          keyframeValue = removeDuplicateStyle(keyframeValue);
        } 
        else {
          keyframeValue = normalizeCompressedStyle(stringStyleInitial, keyframeValue);
        }
        keyframeValue = removeDuplicateStyle(keyframeValue + pointAndCommaString + styleObjectToString(styleObject[frameKey] || {
        }));
        styleObject[frameKey] = stringToStyleObject(keyframeValue);
        libraryAnimationObject.style[frameKey] = cloneObject(styleObject[frameKey]);
      } 
      else {
        styleObject[frameKey] = developerAnimationObject[key];
        libraryAnimationObject.style[frameKey] = {
        };
        libraryAnimationObject.keyframesOriginal[frameKey] = developerAnimationObject[frameKey];
      }
      maxKey = frameKey > maxKey ? frameKey : maxKey;
      libraryAnimationObject.maxKey = maxKey;
    }
    return styleObject;
  }
  function futurePropertyValue(initialValueOfTheProperty, maxPropertyValue, smallerKey, biggestKey) {
   
    initialValueOfTheProperty = separatesPropertyValues(initialValueOfTheProperty);
    maxPropertyValue = separatesPropertyValues(maxPropertyValue);
    var counting = maxPropertyValue.length,
    realValue = emptyString;
    function futureValue(initialValue, x) {
      var z = _parseFloat(initialValue),
      y = _parseFloat(x),
      available = numberToNumber(y, z),
      unitOfMeasure = initialValue.split(z) [1] || emptyString,
      result = (available / biggestKey) * smallerKey;
      result = (z > y ? z - result : z + result);
      if (hasOccurrence(unitOfMeasure, '.')) {
        unitOfMeasure = unitOfMeasure.replace(/[.]+/g, emptyString);
      } 
      else {
        result = _parseRound(result);
      }
      return result + unitOfMeasure;
    }
    while (counting--) {
      var maxValue = maxPropertyValue[counting],
      initialValue = initialValueOfTheProperty[counting];
      if (isColorCSS(maxValue)) {
        maxValue = isColorHex(maxValue) ? hexToRGB(maxValue) : maxValue;
        initialValue = isColorHex(initialValue) ? hexToRGB(initialValue) : initialValue;
      }
      if (hasOccurrence(maxValue, '(')) {
        var propertyCurrentValue = initialValue.split('(');
        propertyCurrentValue = propertyCurrentValue.splice(1, propertyCurrentValue.length).join(emptyString).split(',');
        var propertyGoToValue = maxValue.split('('),
        propertySubName = propertyGoToValue[0];
        propertyGoToValue = propertyGoToValue.splice(1, propertyGoToValue.length).join(emptyString).split(',');
        var countingFragmentValues = - 1,
        propertyGoToValueLength = propertyGoToValue.length - 1,
        valuesContained = propertySubName + '(',
        organize = 0;
        while (countingFragmentValues++ < propertyGoToValueLength) {
          if (propertyGoToValue[countingFragmentValues] === emptyString) {
            continue;
          }
          var subValueUsed = removeClosingParentheses(propertyCurrentValue[countingFragmentValues]),
          subValue = removeClosingParentheses(propertyGoToValue[countingFragmentValues]);
          subValue = futureValue(subValueUsed, subValue);
          if (organize === 0) {
            valuesContained = valuesContained + subValue;
          } else {
            valuesContained = valuesContained + ', ' + subValue;
          }
          organize++;
        }
        maxValue = valuesContained + ')';
      } 
      else if (!_isNaN(_parseFloat(maxValue))) {
        maxValue = futureValue(initialValue, maxValue);
      }
      realValue = maxValue + spaceString + realValue;
    }
    return realValue;
  }  
  function removeUnnecessarySpace(string) {
    return _trim(string).split(", ").join(",").split(" ,").join(",").split("( ").join("(").split(" )").join(")");
  }
  function loadKeyframesStyle(libraryAnimationObject) {
    var timelineNormal = libraryAnimationObject.timelineNormal,
    keepFrameStyle = emptyString,
    keyframesExtendedProperties = {
    },
    keys = libraryAnimationObject.timelineNormalKeys,
    keysLength = keys.length - 1,
    countingKeys = 1, /* No need to read the key 0 and 1 */
    initialStyleObject = cloneObject(timelineNormal[0]),
    key;
    while (countingKeys++ < keysLength) {
      key = keys[countingKeys];
      var keyframeProperties = timelineNormal[key],
      countingKeysAgain = countingKeys,
      propertyName;
      for (propertyName in keyframeProperties) {
        while (countingKeysAgain--) {
          var previousKey = keys[countingKeysAgain];
          if (!timelineNormal[previousKey][propertyName] && (previousKey in libraryAnimationObject.style ? libraryAnimationObject.styleBetweenFrames : true)) {
            if (!keyframesExtendedProperties[key]) {
              keyframesExtendedProperties[key] = {
              };
            }
            if (!keyframesExtendedProperties[key][propertyName]) {
              keyframesExtendedProperties[key][propertyName] = {
                keys: [
                ]
              };
              keyframesExtendedProperties[key][propertyName].endValue = timelineNormal[key][propertyName];
            }
            keyframesExtendedProperties[key][propertyName].keys.push(previousKey);
          } 
          else {
            if (keyframesExtendedProperties[key] && keyframesExtendedProperties[key][propertyName]) {
              initialStyleObject[propertyName] = timelineNormal[previousKey][propertyName] || initialStyleObject[propertyName];
              keyframesExtendedProperties[key][propertyName].startValue = initialStyleObject[propertyName];
              keyframesExtendedProperties[key][propertyName].startKey = previousKey;
            }
            break;
          }
        }
        countingKeysAgain = countingKeys;
      }
    }
    for (key in keyframesExtendedProperties) {
      var keyValue = keyframesExtendedProperties[key];
      for (propertyName in keyValue) {
        var propertyObject = keyValue[propertyName],
        propertyEndValue = propertyObject.endValue,
        propertyStartValue = propertyObject.startValue,
        startKey = propertyObject.startKey;
        keys = propertyObject.keys;
        var keyframesLength = keys.length,
        counting = keyframesLength;
        while (counting--) {
          previousKey = keys[counting];
          var propertyStartValues = removeUnnecessarySpace(propertyStartValue).split(spaceString);
          var propertyEndValues = removeUnnecessarySpace(propertyEndValue).split(spaceString);
          var countingPropertyValues = propertyEndValues.length;
          var resultValues = emptyString;
         
          while ( countingPropertyValues-- ) {
            var propertyValue = futurePropertyValue(propertyStartValues[ countingPropertyValues ], propertyEndValues[ countingPropertyValues ], _parseFloat(previousKey) - _parseFloat(startKey), _parseFloat(key) - _parseFloat(startKey));
            resultValues = propertyValue + spaceString + resultValues;
          }
          
          timelineNormal[previousKey][propertyName] = resultValues;
        }
      }
      if (libraryAnimationObject.keepFrameStyle) {
        keepFrameStyle = keepFrameStyle + styleObjectToString(timelineNormal[key]);
        timelineNormal[key] = stringToStyleObject(keepFrameStyle);
        keepFrameStyle = styleObjectToString(timelineNormal[key]);
      }
    }
    for (key in timelineNormal) {
      timelineNormal[key].cssText = styleObjectToString(timelineNormal[key]);
    }
    return timelineNormal;
  }
  function cloneDeveloperAnimationObject(libraryAnimationObject, developerAnimationObject) {
    var key;
    libraryAnimationObject.developerAnimationObjectClone = {
    };
    for (key in developerAnimationObject) {
      if (_isNaN(key) && !_isFunction(developerAnimationObject[key]) && key !== 'animationId') {
        var propertyValue = developerAnimationObject[key];
        libraryAnimationObject.developerAnimationObjectClone[key] = _isObject(propertyValue) && propertyValue.length && propertyValue.slice ? propertyValue.slice() : propertyValue;
      }
    }
  }
  function prepareAnimationObjects(libraryAnimationObject, developerAnimationObject) {
    var styleObject = readingKeyframes(developerAnimationObject, libraryAnimationObject);
    if (!libraryAnimationObject.keepFrameStyle) {
      styleObject[libraryAnimationObject.maxKey] = stringToStyleObject(styleObjectToString(developerAnimationObject[0]) + styleObjectToString(styleObject[libraryAnimationObject.maxKey]));
    } 
    libraryAnimationObject.style = styleObject;
  }
  function removeAnimationStyle(libraryAnimationObject) {
    var elements = libraryAnimationObject.elements,
    amountOfElements = elements.length,
    styleNotAppliedByTheAnimation = libraryAnimationObject.styleNotAppliedByTheAnimation,
    animationClassName = '.' + libraryAnimationObject.className;
    animationsStyleSheet[animationClassName] = animationsStyleInline[animationClassName] = null;
    while (amountOfElements--) {
      var elementInMutation = elements[amountOfElements];
      if (elementInMutation && elementInMutation.parentElement) {
        var scrollingValues = styleNotAppliedByTheAnimation.scrollingValues[amountOfElements],
        inlineStyle = styleNotAppliedByTheAnimation.inlineStyle[amountOfElements];
        if (scrollingValues)
        {
          elementInMutation.scrollTop = scrollingValues[0];
          elementInMutation.scrollLeft = scrollingValues[1];
          elementInMutation.style.cssText = inlineStyle;
        }

      }
    }
    applyStyleSheet();
  }  
/*
  -------->>>>>>
*/
/*
  --------<<<<<< Functions that handle styleObject objects and CSS property string.
*/
  function normalizeStringStyle(string) {
    if (hasOccurrence(string, '-')) {
      return string;
    }
    string = string.split(emptyString);
    var stringLength = string.length,
    counting = stringLength,
    newString = emptyString;
    while (counting--) {
      var character = string[counting];
      if (character === character.toUpperCase() && isNaN(_parseFloat(character))) {
        character = '-' + _toLowerCase(character);
      }
      newString = character + newString;
    }
    return newString.split('-$').join('$');
  }
  function separatesPropertyValues(string) {
    var array = removeUnnecessarySpace(string).split(spaceString),
    counting = array.length,
    newArray = [
    ];
    while (counting--) {
      if (array[counting] !== emptyString) {
        newArray[newArray.length] = removeSpacesChar(array[counting]);
      }
    }
    return newArray;
  }
  function insertNewStyle(element, content) {
    if (element.styleSheet) {
      element.styleSheet.cssText = content;
    } else {
      textContent(element, content);
    }
    return element;
  }
  function textContent(element, replace) {
    var property;
    if (_isString(element.textContent)) {
      property = 'textContent';
    } else if (_isString(element.nodeValue)) {
      property = 'nodeValue';
    } else {
      property = 'innerText';
    }
    if (_isString(replace)) {
      element[property] = replace;
    } else {
      return element[property];
    }
  }
  function CSSStyleToJavaScriptStyle(string) {
    string = removeSpacesChar(string).split(emptyString);
    var stringLength = string.length,
    counting = stringLength,
    newString = emptyString;
    while (counting--) {
      var character = string[counting];
      if (character === '-') {
        newString = newString.split(emptyString);
        character = newString[0].toUpperCase();
        newString[0] = emptyString;
        newString = newString.join(emptyString);
      }
      newString = character + newString;
    }
    newString = newString.split(emptyString);
    newString[0] = _toLowerCase(newString[0]);
    return newString.join(emptyString);
  }
  function styleObjectToString(objectWithStyle) {
    if (_isString(objectWithStyle)) {
      return objectWithStyle;
    }
    var stringStyle = emptyString,
    property;
    for (property in objectWithStyle) {
      stringStyle = (stringStyle + normalizeStringStyle(property) + equalSignString + spaceString + _trim(objectWithStyle[property]) + pointAndCommaString + spaceString).split(spaceString + pointAndCommaString).join(pointAndCommaString);
    }
    return stringStyle;
  }
  function stringToStyleObject(string) {
    if (_isObject(string)) {
      return string;
    }
    string = (string + pointAndCommaString).split(pointAndCommaString);
    var stringLength = string.length - 1,
    countingProperties = - 1,
    styleObject = {
    };
    while (countingProperties++ < stringLength) {
      var property = string[countingProperties].split(equalSignString);
      if (property[1]) {
        styleObject[removeSpacesChar(CSSStyleToJavaScriptStyle(property[0]))] = _trim(property[1]);
      }
    }
    return styleObject;
  }
  function removeDuplicateStyle(string) {
    var styleObject = stringToStyleObject(string);
    return styleObjectToString(styleObject);
  }  
/*
  -------->>>>>>
*/
/*
  --------<<<<<< Functions that manipulate and verify the data entered in the animation object.
*/
  function controlAnimationConfig() {
    return controlAnimationDefaultProperties;
  }
  function getDeveloperAnimationObjects(name) {
    if (name === void !0) {
      return developerAnimationObjects;
    }
    var counting = developerAnimationObjects.length,
    objects = [
    ];
    while (counting--) {
      var developerAnimationObject = developerAnimationObjects[counting];
      if (developerAnimationObject['name'] === name) {
        objects[objects.length] = developerAnimationObject;
      }
    }
    return objects[1] ? objects : objects[0];
  }
  function getLibraryAnimationObject(object) {
    var counting = libraryAnimationObjects.length;
    var animationId = _isNumber(object['animationId']) ? object['animationId'] : object.animationId;
    while (counting--) {
      var libraryAnimationObject = libraryAnimationObjects[counting];
      if (libraryAnimationObject && animationId === libraryAnimationObject.animationId) {
        return libraryAnimationObject;
      }
    }
  }
  function cloneObject(object) {
    if (!_isObject(object)) {
      return object;
    }
    var newObject = new Object(),
    key;
    for (key in object) {
      newObject[key] = object[key];
    }
    object = null;
    return newObject;
  }
  function hasUpdateAnimation(libraryAnimationObject) {
    var developerAnimationObject = developerAnimationObjects[libraryAnimationObject.positionInArray],
    keyframesOriginal = libraryAnimationObject.keyframesOriginal,
    keys = libraryAnimationObject.keys,
    counting = keys.length,
    developerAnimationObjectClone = libraryAnimationObject.developerAnimationObjectClone,
    developerAnimationObjectCloneKeys = libraryAnimationObject.developerAnimationObjectCloneKeys;
    while (counting--) {
      var key = keys[counting],
      developerKeyframesValue = developerAnimationObject[key];
      developerKeyframesValue = _isObject(developerKeyframesValue) ? styleObjectToString(developerKeyframesValue) : developerKeyframesValue;
      if (keyframesOriginal[key] !== developerKeyframesValue) {
        return 'keyframes';
      }
    }
    counting = developerAnimationObjectCloneKeys.length;
    while (counting--) {
      var propertyName = developerAnimationObjectCloneKeys[counting];
      if (developerAnimationObjectClone[propertyName] !== developerAnimationObject[propertyName]) {
        return 'property';
      }
    }
  }  
  function updateDeveloperObjects(libraryAnimationObject) {
    var developerAnimationObject = developerAnimationObjects[libraryAnimationObject.positionInArray],
    developerAnimationObjectClone = libraryAnimationObject.developerAnimationObjectClone;
    developerAnimationObject['iterationsComplete'] = developerAnimationObjectClone['iterationsComplete'] = libraryAnimationObject.iterationsComplete;
    developerAnimationObject['progress'] = developerAnimationObjectClone['progress'] = libraryAnimationObject.progress;
    developerAnimationObject['state'] = developerAnimationObjectClone['state'] = libraryAnimationObject.state;
    developerAnimationObject['maxProgress'] = developerAnimationObjectClone['maxProgress'] = libraryAnimationObject.maxProgressOriginal;
  }
  function cloneAnimationObject(amount) {
    var amountClones = amount.length || amount;
    var developerAnimationObject = this,
    clonedAnimations = [
    ],
    counting = 0;
    amountClones = amountClones > 1 ? amountClones : 1;
    while (counting++ < amountClones) {
      var libraryAnimationObject = PlayAnimation(developerAnimationObject, 'clone');
      if (!libraryAnimationObject) {
        continue;
      }
      var developerAnimationObjectClone = cloneObject(developerAnimationObject),
      keyframesOriginal = libraryAnimationObject.keyframesOriginal,
      key;
      libraryAnimationObject = null;
      for (key in keyframesOriginal) {
        developerAnimationObjectClone[key] = keyframesOriginal[key];
      }
      developerAnimationObjectClone = new MyAnimation(developerAnimationObjectClone);
      if (amount[counting]) {
        developerAnimationObjectClone['element'] = amount[counting];
      }
      clonedAnimations[clonedAnimations.length] = developerAnimationObjectClone;
    }
    return clonedAnimations;
  }
  function animationMultipleObjects(array, action) {
    var counting = array.length;
    while (counting--) {
      PlayAnimation(array[counting], action);
    }
    identicalTimeline = {
    };
  }
  function MyAnimation(developerAnimationObject) {
    var _this = this,
    key,
    newAnimationObject;
    developerAnimationObject = developerAnimationObject ? developerAnimationObject : controlAnimationDefaultProperties;
    if (_this instanceof MyAnimation) {
      newAnimationObject = _this;
    } 
    else {
      newAnimationObject = new MyAnimation();
    }
    for (key in developerAnimationObject) {
      if (!_isFunction(developerAnimationObject[key]) || key == 'easing') {
        newAnimationObject[key] = developerAnimationObject[key];
      }
    }
    developerAnimationObject = newAnimationObject;
    return developerAnimationObject;
  }  
  function PlayAnimation(developerAnimationObject, action) {
    var libraryAnimationObject = this;
    if (!(libraryAnimationObject instanceof PlayAnimation)) {
      return new PlayAnimation(developerAnimationObject, action);
    }
    if (developerAnimationObject.length) {
      animationMultipleObjects(developerAnimationObject, action);
      return
    }
    if (!developerAnimationObject || !_isObject(developerAnimationObject)) {
      throw new Error('controlAnimationJSError: The sent animation object is Invalid, try another.');
    }
    libraryAnimationObject.direction = developerAnimationObject['direction'] = developerAnimationObject['direction'] ? developerAnimationObject['direction'] : animationDirections.normal;
    libraryAnimationObject.iterations = developerAnimationObject['iterations'] = Math.max(developerAnimationObject['iterations'], 1);
    libraryAnimationObject.easing = developerAnimationObject['easing'];
    libraryAnimationObject.call = developerAnimationObject['call'] = developerAnimationObject['call'] || false;
    libraryAnimationObject.insertStyle = developerAnimationObject['insertStyle'] = developerAnimationObject['insertStyle'];
    libraryAnimationObject.iterationsComplete = developerAnimationObject['iterationsComplete'] = developerAnimationObject['iterationsComplete'] || 0;
    libraryAnimationObject.delayOriginal = developerAnimationObject['delay'] = developerAnimationObject['delay'];
    libraryAnimationObject.durationOriginal = developerAnimationObject['duration'];
    libraryAnimationObject.keepFrameStyle = developerAnimationObject['keepFrameStyle'];
    libraryAnimationObject.state = developerAnimationObject['state'] = animationStates.running;
    libraryAnimationObject.fill = developerAnimationObject['fill'];
    developerAnimationObject['listenerFired'] = false;
    libraryAnimationObject.progress = libraryAnimationObject.initialProgress = developerAnimationObject['progress'];
    libraryAnimationObject.delay = toMilliseconds(libraryAnimationObject.delayOriginal);
    libraryAnimationObject.duration = toMilliseconds(libraryAnimationObject.durationOriginal);
    if (action === 'new') {
      libraryAnimationObject = null;
      return developerAnimationObject;
    }
    libraryAnimationObject.styleNotAppliedByTheAnimation = {
    };
    libraryAnimationObject.styleNotAppliedByTheAnimation.inlineStyle = [
    ];
    libraryAnimationObject.styleNotAppliedByTheAnimation.scrollingValues = [
    ];
    libraryAnimationObject.styleBetweenFrames = developerAnimationObject['styleBetweenFrames'];
    libraryAnimationObject.originalElements = developerAnimationObject['element'];
    libraryAnimationObject.elements = libraryAnimationObject.originalElements;
    libraryAnimationObject.elements = libraryAnimationObject.elements && libraryAnimationObject.elements[0] ? libraryAnimationObject.elements : [
      libraryAnimationObject.elements
    ];
    prepareAnimationObjects(libraryAnimationObject, developerAnimationObject);
    libraryAnimationObject.keys = ordernateByGrowingValues(getObjectKeys(libraryAnimationObject.style));
    libraryAnimationObject.keysString = libraryAnimationObject.keys.join(spaceString);
    libraryAnimationObject.maxProgressOriginal = developerAnimationObject['maxProgress'] = developerAnimationObject['maxProgress'];
    setAnimationDirection(libraryAnimationObject);
    libraryAnimationObject.maxProgressOriginal = libraryAnimationObject.maxProgressOriginal === undefined ? libraryAnimationObject.maxProgress : libraryAnimationObject.maxProgressOriginal;
    libraryAnimationObject.progress = developerAnimationObject['progress'] = _isNumber(developerAnimationObject['progress']) ? developerAnimationObject['progress'] : libraryAnimationObject.progress;
    if (action === 'clone') {
      return libraryAnimationObject;
    }
    developerAnimationObject['animationId'] = libraryAnimationObject.animationId = developerAnimationObject['animationId'] || animationsId;
    developerAnimationObject['name'] = developerAnimationObject['name'] || animationsId;
    libraryAnimationObject.className = developerAnimationObject['className'] = developerAnimationObject['className'] ? developerAnimationObject['className'] : controlAnimationClassStringPrefix + animationsId;
    cloneDeveloperAnimationObject(libraryAnimationObject, developerAnimationObject);
    libraryAnimationObject.developerAnimationObjectCloneKeys = getObjectKeys(libraryAnimationObject.developerAnimationObjectClone);
    if (action === 'update') {
      return libraryAnimationObject;
    } 
    libraryAnimationObject.iterationsFixed = 0;
    developerAnimationObjects[developerAnimationObjects.length] = developerAnimationObject;
    libraryAnimationObject.positionInArray = libraryAnimationObjects.push(libraryAnimationObject) - 1;
    animationsId++;
    developerAnimationObject = developerAnimationObject instanceof MyAnimation ? developerAnimationObject : new MyAnimation(developerAnimationObject);
    if (!identicalTimeline.timelineNormal) {
      loadAnimation(libraryAnimationObject, developerAnimationObject, action);
      if (action === true) {
        identicalTimeline.timelineNormal = libraryAnimationObject.timelineNormal;
        identicalTimeline.timelineNormalKeys = libraryAnimationObject.timelineNormalKeys;
        identicalTimeline.timelineReverse = libraryAnimationObject.timelineReverse;
        identicalTimeline.timelineReverseKeys = libraryAnimationObject.timelineReverseKeys;
        identicalTimeline.interactionTime = libraryAnimationObject.interactionTime;
      }
    } 
    else {
      libraryAnimationObject.timelineNormal = identicalTimeline.timelineNormal;
      libraryAnimationObject.timelineNormalKeys = identicalTimeline.timelineNormalKeys;
      libraryAnimationObject.timelineReverse = identicalTimeline.timelineReverse;
      libraryAnimationObject.timelineReverseKeys = identicalTimeline.timelineReverseKeys;
      libraryAnimationObject.interactionTime = identicalTimeline.interactionTime;
      developerAnimationObject['timeline'] = {
        'normal': libraryAnimationObject.timelineNormal,
        'reverse': libraryAnimationObject.timelineReverse
      };
      forwardTheAnimation(libraryAnimationObject);
    }
    return developerAnimationObject;
  }
  function calculateInterpolation(libraryAnimationObject) {
    var interpolation = savedInterpolations[libraryAnimationObject.duration];
    if (interpolation && interpolation[1] === libraryAnimationObject.easing) {
      var counting = interpolation[0].length;
      var keys = {
      };
      while (counting--) {
        keys[interpolation[0][counting]] = {
        };
      }
      return keys;
    }
    var progressOfEstimatedTime = 0,
    durationForEachIntercalation = 18,
    /* Normalizes between browsers, the time taken for each Animation intercalation. */
    /* 18 - time that best caters to all browsers. */
    progress = 0,
    maxKey = libraryAnimationObject.maxKey,
    duration = libraryAnimationObject.duration,
    easing = libraryAnimationObject.easing,
    keys = {
    };
    savedInterpolations[duration] = [
      []
    ];
    while (progress != maxKey) {
      if (_isFunction(easing)) {
        progressOfEstimatedTime += durationForEachIntercalation;
        progress = easing(progressOfEstimatedTime > duration ? duration : progressOfEstimatedTime, 0, maxKey, duration);
      } else {
        progress += easing || 1;
      }
      keys[progress] = {
      };
      if (progress > maxKey) {
        progress = maxKey;
        keys[maxKey] = {
        };
      }
      savedInterpolations[duration][0].push(progress);
    }
    savedInterpolations[duration][1] = libraryAnimationObject.easing;
    return keys;
  }
  function loadTimeline(libraryAnimationObject, developerAnimationObject) {
    libraryAnimationObject.timelineNormal = {
    };
    libraryAnimationObject.timelineNormal = calculateInterpolation(libraryAnimationObject);
    var keys = libraryAnimationObject.keys,
    counting = keys.length;
    while (counting--) {
      var key = keys[counting];
      libraryAnimationObject.timelineNormal[key] = libraryAnimationObject.style[key];
    }
    libraryAnimationObject.timelineNormalKeys = ordernateByGrowingValues(getObjectKeys(libraryAnimationObject.timelineNormal));
    libraryAnimationObject.timelineReverseKeys = reverseArrayClone(libraryAnimationObject.timelineNormalKeys);
    libraryAnimationObject.timelineNormal = loadKeyframesStyle(libraryAnimationObject);
    libraryAnimationObject.timelineReverse = reverseKeyframes(libraryAnimationObject.timelineNormal, libraryAnimationObject.timelineNormalKeys);
    libraryAnimationObject.interactionTime = libraryAnimationObject.duration / libraryAnimationObject.timelineNormalKeys.length;
    developerAnimationObject['timeline'] = {
      'normal': libraryAnimationObject.timelineNormal,
      'reverse': libraryAnimationObject.timelineReverse
    };
  }
  function forwardTheAnimation(libraryAnimationObject) {
    setTimeout(function(){
      updateDeveloperObjects(libraryAnimationObject);
      manufactureOfAnimationData(libraryAnimationObject, 1);
    }, 0);
  }
  function loadAnimation(libraryAnimationObject, developerAnimationObject, action) {
    if (action === true) {
      loadTimeline(libraryAnimationObject, developerAnimationObject);
      forwardTheAnimation(libraryAnimationObject);
    } 
    else {
      /*  setTimeout: Avoiding recursion */
      var timeoutID1 = setTimeout(function () {
        loadTimeline(libraryAnimationObject, developerAnimationObject);
        forwardTheAnimation(libraryAnimationObject);
        clearTimeout(timeoutID1);
      }, 0);
    }
  }
  function prepareNewIteration(libraryAnimationObject) {
    prepareAnimationObjects(libraryAnimationObject, developerAnimationObjects[libraryAnimationObject.positionInArray]);
  }
  function setAnimationDirection(libraryAnimationObject) {
    function easyKeyRandom(property, lastProgress) {
      return getRandomKey(direction === property ? libraryAnimationObject.keys : timelineNormalKeys, lastProgress);
    }
    var direction = libraryAnimationObject.direction,
    progressStoppedAt = libraryAnimationObject.progress || 0,
    maxKey = libraryAnimationObject.maxKey,
    runTimeline = libraryAnimationObject.runTimeline,
    timelineNormalKeys = libraryAnimationObject.timelineNormalKeys || libraryAnimationObject.keys,
    fluidOut = !_isNumber(libraryAnimationObject.progress) && direction.split('fluid').length > 1;
    libraryAnimationObject.runTimeline = 'normal';
    if (fluidOut) {
      progressStoppedAt = easyKeyRandom(animationDirections.randomKeys, libraryAnimationObject.maxProgress);
    }
    libraryAnimationObject.progress = progressStoppedAt;
    if (direction === animationDirections.fluidRandomOffset || direction === animationDirections.fluidRandomKeys) {
      libraryAnimationObject.maxProgress = easyKeyRandom(animationDirections.fluidRandomKeys, progressStoppedAt);
    } 
    else {
      if (direction === animationDirections.randomKeys || direction === animationDirections.randomOffset) {
        libraryAnimationObject.maxProgress = easyKeyRandom(animationDirections.randomKeys, progressStoppedAt);
        libraryAnimationObject.progress = 0;
      } 
      else if (direction === animationDirections.reverse || (direction === animationDirections.alternateReverse && (!runTimeline || runTimeline === 'normal')) || (direction === animationDirections.alternate && runTimeline === 'normal')) {
        libraryAnimationObject.progress = maxKey;
        libraryAnimationObject.maxProgress = 0;
        libraryAnimationObject.runTimeline = 'reverse';
      } 
      else {
        libraryAnimationObject.progress = 0;
        libraryAnimationObject.maxProgress = maxKey;
      }
    }
    if (libraryAnimationObject.maxProgressOriginal && libraryAnimationObject.maxProgressOriginal[0]) {
      if (libraryAnimationObject.maxProgressOriginal[libraryAnimationObject.iterationsFixed] === 'restart') {
        libraryAnimationObject.iterationsFixed = 0;
      }
      libraryAnimationObject.maxProgress = libraryAnimationObject.maxProgressOriginal[libraryAnimationObject.iterationsFixed] || libraryAnimationObject.maxProgress;
      libraryAnimationObject.iterationsFixed++;
    }
  }
  function animationInteractionCompleted(libraryAnimationObject) {
    garbageCollectorOfAnimations(libraryAnimationObject);
    var iterations = libraryAnimationObject.iterations,
    progress = libraryAnimationObject.progress;
    if (libraryAnimationObject.backRunning) {
      libraryAnimationObject.iterationsComplete--;
    }
    libraryAnimationObject.iterationsComplete++;
    if (iterations > libraryAnimationObject.iterationsComplete || iterations === Infinity || (_isNumber(libraryAnimationObject.fill) && !libraryAnimationObject.fillExecuted)) {
      setAnimationDirection(libraryAnimationObject);
      if (libraryAnimationObject.backRunning) {
        libraryAnimationObject.backRunning = null;
        libraryAnimationObject.progress = progress;
      }
      prepareNewIteration(libraryAnimationObject);
      if (iterations <= libraryAnimationObject.iterationsComplete + 1 && _isNumber(libraryAnimationObject.fill)) {
        libraryAnimationObject.maxProgress = libraryAnimationObject.fill;
        libraryAnimationObject.fillExecuted = true;
      } 
      else {
        propagateListenerAnimation(animationIterationsList, libraryAnimationObject, 'iterations');
      }
      libraryAnimationObject.animationControllersData = null;
      updateDeveloperObjects(libraryAnimationObject);
      manufactureOfAnimationData(libraryAnimationObject, 1);
    } else {
      propagateListenerAnimation(animationIterationsList, libraryAnimationObject, 'iterations');
      libraryAnimationObject.state = animationStates.completed;
      if (!libraryAnimationObject.fill) {
        removeAnimationStyle(libraryAnimationObject);
      }
      updateDeveloperObjects(libraryAnimationObject);
      propagateListenerAnimation(animationEndList, libraryAnimationObject, 'maxProgress');
    }
  }  
/*
  -------->>>>>>
*/
/*
  --------<<<<<< Function that controls and run the animation.
*/

  function manufactureOfAnimationData(libraryAnimationObject, jumpTimeout) {
    var animationControllersData = {
    },
    end = libraryAnimationObject.maxProgress,
    duration = libraryAnimationObject.duration,
    progress = libraryAnimationObject.progress
    var reverseExecution = progress > end;
    libraryAnimationObject.reverseExecution = reverseExecution;
    animationControllersData.progress = progress;
    animationControllersData.maxProgress = end;
    animationControllersData.noDuration = duration <= 0;
    animationControllersData.jumpTimeout = jumpTimeout;
    libraryAnimationObject.animationControllersData = animationControllersData;
    insertAnimationQueue(libraryAnimationObject);
  }
  function keyframeForwardStyle(keyframeStyle, libraryAnimationObject) {
    var keyframeStyleString = keyframeStyle.cssText;
    if (!keyframeStyleString || !libraryAnimationObject.elements[0]) {
      return;
    }
    var elementsToBeAnimated = libraryAnimationObject.elements,
    amountOfElements = elementsToBeAnimated.length,
    counting = amountOfElements,
    inlineIsBest = libraryAnimationObject.insertStyle == 'auto' && amountOfElements < 2,
    $scrollTo = keyframeStyle.$scrollTo,
    $scrollTop = _parseFloat(keyframeStyle.$scrollTop || ($scrollTo ? $scrollTo[0] : false)),
    $scrollLeft = _parseFloat(keyframeStyle.$scrollLeft || ($scrollTo ? $scrollTo[1] : false)),
    animationClassName = '.' + libraryAnimationObject.className;
    keyframeStyleString = keyframeStyleString.replace(/\$[^>](.*?)\;/g, '');
    while (counting--) {
      var elementInMutation = elementsToBeAnimated[counting];
      if (!_isString(libraryAnimationObject.styleNotAppliedByTheAnimation.inlineStyle[counting])) {
        libraryAnimationObject.styleNotAppliedByTheAnimation.inlineStyle[counting] = elementInMutation.style.cssText;
        libraryAnimationObject.styleNotAppliedByTheAnimation.scrollingValues[counting] = [
          elementInMutation.scrollTop,
          elementInMutation.scrollLeft
        ];
      }
      if (libraryAnimationObject.insertStyle == 'inline' || inlineIsBest) {
        animationsStyleInline[animationClassName] = {
          element: elementInMutation,
          style: keyframeStyleString
        };
        animationsStyleSheet[animationClassName] = null;
      } else {
        if (!hasOccurrence(elementInMutation.className, spaceString + libraryAnimationObject.className)) {
          elementInMutation.className = elementInMutation.className + spaceString + libraryAnimationObject.className;
        }
      }
      if (_isNumber($scrollTop)) {
        elementInMutation.scrollTop = $scrollTop;
      }
      if (_isNumber($scrollLeft)) {
        elementInMutation.scrollLeft = $scrollLeft;
      }
    }
    if (libraryAnimationObject.insertStyle == 'tag' && !inlineIsBest) {
      keyframeStyleString = keyframeStyleString.split(pointAndCommaString).join(' !important;');
      animationsStyleSheet[animationClassName] = keyframeStyleString;
    }
  }
  function applyTimeline(libraryAnimationObject) {
    var timelineObject,
    timelineKeys;
    if (libraryAnimationObject.runTimeline === 'normal') {
      timelineObject = libraryAnimationObject.timelineNormal;
      timelineKeys = libraryAnimationObject.timelineNormalKeys;
    } 
    else {
      timelineObject = libraryAnimationObject.timelineReverse;
      timelineKeys = libraryAnimationObject.timelineReverseKeys;
    }
    var progress = libraryAnimationObject.progress,
    timelineKeysLength = timelineKeys.length,
    counting = timelineKeysLength,
    keyframeStyle,
    runTimelineNormal = libraryAnimationObject.runTimeline === 'normal',
    reverseExecution = libraryAnimationObject.reverseExecution,
    key;
    timelineKeysLength--;
    if (reverseExecution && runTimelineNormal || !reverseExecution && !runTimelineNormal) {
      while (counting--) {
        key = timelineKeys[counting];
        if (!runTimelineNormal && key > progress) {
          counting = timelineKeysLength - counting;
          keyframeStyle = timelineObject[timelineKeys[counting]];
          break;
        }
        if (runTimelineNormal && key < progress) {
          keyframeStyle = timelineObject[key];
          break;
        }
      }
    } 
    else {
      counting = - 1;
      while (counting++ < timelineKeysLength) {
        key = timelineKeys[counting];
        if (!runTimelineNormal && key < progress) {
          counting = timelineKeysLength - counting;
          keyframeStyle = timelineObject[timelineKeys[counting]];
          break;
        }
        if (runTimelineNormal && key > progress) {
          keyframeStyle = timelineObject[key];
          break;
        }
      }
    }
    if (!keyframeStyle) {
      key = timelineKeys[counting < 0 ? 0 : counting - 1];
      keyframeStyle = timelineObject[key];
    }
    libraryAnimationObject.animationControllersData.progress = key;
    return keyframeStyle;
  }
  function animationsCycleCompleted() {
    var counting = libraryAnimationObjects.length;
    var forwardedAnimations = 0;
    while (counting--) {
      var object = libraryAnimationObjects[counting];
      if (object && object.state == animationStates.running) {
        forwardedAnimations++;
      }
    }
    if (forwardedAnimations > 0 && releaseOfStyleMutations >= forwardedAnimations) {
      releaseOfStyleMutations = 0;
      applyStyleInline();
      applyStyleSheet();
    }
  }
  function applyStyleInline() {
    var animationClassName;
    for (animationClassName in animationsStyleInline) {
      var animate = animationsStyleInline[animationClassName];
      if (animate) {
        var element = animate.element;
        if (element && element.parentElement) {
          element.style.cssText = animate.style;
        }
      }
    }
    animationsStyleInline = {
    };
  }
  function applyStyleSheet() {
    var key,
    styleElementContent = spaceString;
    for (key in animationsStyleSheet) {
      var groupRules = animationsStyleSheet[key];
      if (groupRules) {
        styleElementContent = styleElementContent + key + '{' + groupRules + '}';
      }
    }
    if (styleElementContent !== lastStyleElementContent) {
      lastStyleElementContent = styleElementContent;
      if (!styleElementAnimations.parentElement) {
        appendStyleElement();
      }
      insertNewStyle(styleElementAnimations, styleElementContent);
    }
  }
  function insertAnimationQueue(libraryAnimationObject) {
    var delay = normalizeAnimationTimeout,
    animationControllersData = libraryAnimationObject.animationControllersData;
    if (animationControllersData.jumpTimeout === 1) {
      delay = _isNumber(libraryAnimationObject.delay) ? libraryAnimationObject.delay : normalizeAnimationTimeout;
      releaseOfStyleMutations++;
    }
    if (animationControllersData.noDuration || (!libraryAnimationObject.delay && animationControllersData.jumpTimeout) || animationControllersData.jumpTimeout === 2) {
      animationControllersData.jumpTimeout = false;
      releaseOfStyleMutations--;
      runAnimation(libraryAnimationObject);
    } else {
      animationControllersData.jumpTimeout = false;
      var timeoutId = animationTimeout(function () {
        runAnimation(libraryAnimationObject, 1);
      }, delay, libraryAnimationObject);
      animationsInProgress[animationsInProgress.length] = [
        timeoutId,
        libraryAnimationObject
      ];
    }
  }
  function runAnimation(libraryAnimationObject, callGarbageCollector) {
    releaseOfStyleMutations++;
    var animationControllersData = libraryAnimationObject.animationControllersData,
    animationId = callGarbageCollector ? libraryAnimationObject.animationId : false,
    reverseExecution = libraryAnimationObject.reverseExecution;
    if (hasUpdateAnimation(libraryAnimationObject)) {
      updateAnimation(libraryAnimationObject);
      return;
    }
    if (libraryAnimationObject.call && _isFunction(libraryAnimationObject.call)) {
      libraryAnimationObject.call.call(global, developerAnimationObjects[libraryAnimationObject.positionInArray]);
    }
    if (animationControllersData.progress != animationControllersData.maxProgress) {
      if (!libraryAnimationObject.animationAlreadyStarted) {
        propagateListenerAnimation(animationStartList, libraryAnimationObject, 'start');
        libraryAnimationObject.animationAlreadyStarted = true;
      }
      keyframeForwardStyle(applyTimeline(libraryAnimationObject), libraryAnimationObject);
      animationsCycleCompleted();
      if (animationControllersData.progress in libraryAnimationObject.style || libraryAnimationObject.propagateListenerChangekeys) {
        if (!libraryAnimationObject.propagateListenerChangekeys) {
          libraryAnimationObject.propagateListenerChangekeys = true;
        } 
        else {
          propagateListenerAnimation(animationChangekeysframeList, libraryAnimationObject, 'changekeys');
          libraryAnimationObject.propagateListenerChangekeys = false;
        }
      }
      if (!reverseExecution && animationControllersData.progress > animationControllersData.maxProgress || reverseExecution && animationControllersData.progress < animationControllersData.maxProgress) {
        animationControllersData.progress = animationControllersData.maxProgress;
      }
      libraryAnimationObject.progress = animationControllersData.progress;
      updateDeveloperObjects(libraryAnimationObject);
    } else {
      animationsCycleCompleted();
      libraryAnimationObject.progress = animationControllersData.maxProgress;
      updateDeveloperObjects(libraryAnimationObject);
      animationInteractionCompleted(libraryAnimationObject);
      return;
    }
    if (_isNumber(animationId)) {
      garbageCollectorOfAnimations(animationId);
    }
    insertAnimationQueue(libraryAnimationObject);
  }  
/*
  -------->>>>>>
*/
/*
  --------<<<<<< Function that collects the indentificadres of the time functions and delete useless objects.
*/

  function garbageCollectorOfAnimations(libraryAnimationObject) {
    var animationId = _isNumber(libraryAnimationObject) ? libraryAnimationObject : libraryAnimationObject.animationId,
    found = false,
    counting = animationsInProgress.length;
    function cancelAnimationFrame(idkeyframe) {
      var countingInsanely = requestAnimationFrameId.length;
      while (countingInsanely--) {
        var get = requestAnimationFrameId[countingInsanely];
        if (get[2].animationId === idkeyframe) {
          global.cancelAnimationFrame(get[0]);
          clearTimeout(get[1]);
          get = null;
          requestAnimationFrameId.splice(countingInsanely, 1);
          break;
        }
      }
    }
    while (counting--) {
      var result = animationsInProgress[counting],
      id = result[0];
      if (result[1].animationId === animationId) {
        found = true;
        clearTimeout(id);
        cancelAnimationFrame(animationId);
        result = null;
        animationsInProgress[counting] = null;
        animationsInProgress.splice(counting, 1);
        break;
      }
    }
    return found;
  }  
/*
  -------->>>>>>
*/
/*
  --------<<<<<< Functions that make the call of other.
*/

  function functionCallForAnimationObjects(argArray) {
    var counting = developerAnimationObjects.length;
    var animationObjects = developerAnimationObjects.slice();
    /* Keeps the objects even if they are excluded in the callback */
    while (counting--) {
      argArray[0].call(global, animationObjects[counting], argArray[1], argArray[2]);
    }
  }  
/*
  -------->>>>>>
*/
/*
  --------<<<<<< Functions that handle the state of the animation.
*/
  function updateAnimation(libraryAnimationObject) {
    var positionInArray = libraryAnimationObject.positionInArray,
    developerAnimationObject = developerAnimationObjects[positionInArray],
    newLibraryAnimationObject = PlayAnimation(developerAnimationObject, 'update'),
    alteredDisplacement = developerAnimationObject['maxProgress'] !== libraryAnimationObject.maxProgressOriginal || libraryAnimationObject.direction !== developerAnimationObject['direction'];
    newLibraryAnimationObject.state = developerAnimationObject['state'];
    newLibraryAnimationObject.animationId = developerAnimationObject['animationId'];
    newLibraryAnimationObject.className = developerAnimationObject['className'];
    newLibraryAnimationObject.backRunning = libraryAnimationObject.backRunning;
    newLibraryAnimationObject.initialProgress = libraryAnimationObject.initialProgress;
    newLibraryAnimationObject.iterationsFixed = libraryAnimationObject.iterationsFixed;
    if (hasUpdateAnimation(libraryAnimationObject) === 'keyframes' || libraryAnimationObject.keepFrameStyle !== developerAnimationObject['keepFrameStyle'] || libraryAnimationObject.styleBetweenFrames !== developerAnimationObject['styleBetweenFrames'] || libraryAnimationObject.durationOriginal !== developerAnimationObject['duration'] || libraryAnimationObject.easing !== developerAnimationObject['easing']) {
      loadTimeline(newLibraryAnimationObject, developerAnimationObject);
    } 
    else {
      newLibraryAnimationObject.timelineNormal = libraryAnimationObject.timelineNormal;
      newLibraryAnimationObject.timelineNormalKeys = libraryAnimationObject.timelineNormalKeys;
      newLibraryAnimationObject.timelineReverse = libraryAnimationObject.timelineReverse;
      newLibraryAnimationObject.timelineReverseKeys = libraryAnimationObject.timelineReverseKeys;
    }
    newLibraryAnimationObject.progress = developerAnimationObject['progress'];
    newLibraryAnimationObject.maxProgress = alteredDisplacement ? newLibraryAnimationObject.maxProgress : libraryAnimationObject.maxProgress;
    libraryAnimationObjects[positionInArray] = newLibraryAnimationObject;
    newLibraryAnimationObject.positionInArray = positionInArray;
    updateDeveloperObjects(newLibraryAnimationObject);
    if (newLibraryAnimationObject.iterations >= developerAnimationObject['iterationsComplete']) {
      manufactureOfAnimationData(newLibraryAnimationObject, 2);
    } 
    else {
      libraryAnimationObject.backRunning = null;
    }
    libraryAnimationObject = null;
  }
  function pauseAllAnimations() {
    functionCallForAnimationObjects([pauseAnimation]);
  }
  function pauseAnimation(developerAnimationObject) {
    developerAnimationObject['state'] = animationStates.paused;
    garbageCollectorOfAnimations(developerAnimationObject);
  }
  function resumeAllAnimations() {
    functionCallForAnimationObjects([resumeAnimation]);
  }
  function resumeAnimation(developerAnimationObject) {
    var libraryAnimationObject = getLibraryAnimationObject(developerAnimationObject);
    if (!libraryAnimationObject) {
      return
    }
    developerAnimationObject['state'] = animationStates.running;
    manufactureOfAnimationData(libraryAnimationObject, 2);
  }
  function goAllAnimations(newProgress) {
    functionCallForAnimationObjects([goAnimation,
    newProgress]);
  }
  function goAnimation(developerAnimationObject, newProgress) {
    var libraryAnimationObject = getLibraryAnimationObject(developerAnimationObject);
    if (!libraryAnimationObject) {
      return
    }
    var progress = libraryAnimationObject.progress,
    reverseExecution = libraryAnimationObject.runTimeline;
    if (newProgress < progress) {
      newProgress = reverseExecution === 'reverse' ? libraryAnimationObject.maxKey - newProgress : newProgress;
      libraryAnimationObject.maxProgress = newProgress;
      manufactureOfAnimationData(libraryAnimationObject, 2);
    } 
    else {
      libraryAnimationObject.backRunning = false;
    }
  }
  function backAllAnimations(newProgress) {
    functionCallForAnimationObjects([backAnimation,
    newProgress]);
  }
  function backAnimation(developerAnimationObject, newProgress) {
    var libraryAnimationObject = getLibraryAnimationObject(developerAnimationObject);
    if (!libraryAnimationObject) {
      return
    }
    libraryAnimationObject.backRunning = true;
    goAnimation(developerAnimationObject, newProgress);
  }
  function restartAllAnimations() {
    functionCallForAnimationObjects([restartAnimation]);
  } 
  function restartAnimation(developerAnimationObject) {
    var libraryAnimationObject = getLibraryAnimationObject(developerAnimationObject);
    if (!libraryAnimationObject) {
      return;
    }
    developerAnimationObject['state'] = animationStates.running;
    developerAnimationObject['iterationsComplete'] = 0;
    libraryAnimationObject.progress = libraryAnimationObject.initialProgress;
    setAnimationDirection(libraryAnimationObject);
    libraryAnimationObject.animationAlreadyStarted = false;
    manufactureOfAnimationData(libraryAnimationObject, 1);
  }
  function cancelAllAnimations() {
    functionCallForAnimationObjects([cancelAnimation]);
  }
  function cancelAnimation(developerAnimationObject) {
    var libraryAnimationObject = getLibraryAnimationObject(developerAnimationObject);
    developerAnimationObject['state'] = animationStates.canceled;
    if (!libraryAnimationObject) {
      return
    }
    garbageCollectorOfAnimations(libraryAnimationObject);
    removeAnimationStyle(libraryAnimationObject);
  }
  function developerAnimationObjectPause() {
    pauseAnimation(this);
  }
  function developerAnimationObjectResume() {
    resumeAnimation(this);
  }
  function developerAnimationObjectGo(newProgress) {
    goAnimation(this, newProgress);
  }
  function developerAnimationObjectBack(newProgress) {
    backAnimation(this, newProgress);
  }
  function developerAnimationObjectRestart() {
    restartAnimation(this);
  }
  function developerAnimationObjectCancel() {
    cancelAnimation(this);
  }  
/*
  -------->>>>>>
*/
/*
  --------<<<<<< Functions that handle and add costomized ListenerNames.
*/

  function fireCalls(getCall, libraryAnimationObject, listenerFired) {
    var developerAnimationObject = developerAnimationObjects[libraryAnimationObject.positionInArray];
    developerAnimationObject['listenerFired'] = listenerFired;
    getCall.call(global, developerAnimationObject);
    developerAnimationObject['listenerFired'] = false;
  }
  function propagateListenerAnimation(array, libraryAnimationObject, listenerFired) {
    var counting = - 1,
    arrayLength = array.length - 1;
    while (counting++ < arrayLength) {
      var getCall = array[counting];
      if (!_isFunction(getCall) && getCall[0]) {
        if (_isFunction(getCall[0]) && getCall[1]['animationId'] === libraryAnimationObject.animationId) {
          fireCalls(getCall[0], libraryAnimationObject, listenerFired);
        }
      } else {
        if (_isFunction(getCall)) {
          fireCalls(getCall, libraryAnimationObject, listenerFired);
        }
      }
    }
  }
  function selectListenerArray(ListenerName) {
    ListenerName = _toLowerCase(ListenerName);
    var array;
    switch (ListenerName) {
      case animationListeners.start:
        array = animationStartList;
        break;
      case animationListeners.maxProgress:
        array = animationEndList;
        break;
      case animationListeners.iterations:
        array = animationIterationsList;
        break;
      case animationListeners.changekeys:
        array = animationChangekeysframeList;
        break;
    }
    return array;
  }
  function addListener(ListenerName, callback, developerAnimationObject) {
    var array = selectListenerArray(ListenerName);
    array[array.length] = developerAnimationObject ? [
      callback,
      developerAnimationObject
    ] : callback;
  }
  function removeListener(ListenerName, callback, developerAnimationObject) {
    var array = selectListenerArray(ListenerName),
    arrayLength = array.length - 1,
    counting = - 1,
    newArray = [
    ];
    while (counting++ < arrayLength) {
      var getCall = array[counting];
      if (!_isFunction(getCall) && getCall[0]) {
        if (removeSpacesChar(_toString(getCall[0])) !== removeSpacesChar(_toString(callback)) || getCall[1] !== developerAnimationObject) {
          newArray[newArray.length] = getCall;
        }
      } else {
        if (removeSpacesChar(_toString(getCall)) !== removeSpacesChar(_toString(callback))) {
          newArray[newArray.length] = getCall;
        }
      }
    }
    switch (ListenerName) {
      case animationListeners.start:
        animationStartList = newArray;
        break;
      case animationListeners.maxProgress:
        animationEndList = newArray;
        break;
      case animationListeners.iterations:
        animationIterationsList = newArray;
        break;
      case animationListeners.changekeys:
        animationChangekeysframeList = newArray;
        break;
    }
  }
  function addListenerAllOrganized(developerAnimationObject, ListenerName, callback) {
    addListener(ListenerName, callback, developerAnimationObject);
  }
  function removeListenerAllOrganized(developerAnimationObject, ListenerName, callback) {
    removeListener(ListenerName, callback, developerAnimationObject);
  }
  function addListenerAll(ListenerName, callback) {
    functionCallForAnimationObjects([addListenerAllOrganized,
    ListenerName,
    callback]);
  }
  function removeListenerAll(ListenerName, callback) {
    functionCallForAnimationObjects([removeListenerAllOrganized,
    ListenerName,
    callback]);
  }
  function developerAnimationObjectAddListener(ListenerName, callback) {
    addListener(ListenerName, callback, this);
  }
  function developerAnimationObjectRemoveListener(ListenerName, callback) {
    removeListener(ListenerName, callback, this);
  }  
/*
  -------->>>>>>
*/
/*
  --------<<<<<< Functions with mathematical purpose, and simple manipulation of numbers.
*/
  function toMilliseconds(seconds) {
    if (!_isNumber(seconds)) {
      return seconds;
    }
    var milliseconds;
    milliseconds = Math.floor(seconds * 1000);
    return milliseconds;
  }
  function _parseRound(n) {
    return Math.round(n);
  }
  function easeLinear(t, b, c, d) {
    return c * t / d + b;
  }
  function _parseAbs(n) {
    return Math.abs(n);
  }
  function numberToNumber(start, end) {
    var n1 = Math.min(start, end),
    n2 = Math.max(start, end);
    if (n1 === n2) {
      return 0;
    }
    if (n1 === 0) {
      return _parseAbs(n2);
    }
    if (n2 === 0) {
      return _parseAbs(n1);
    }
    var counting = 0,
    d = _parseAbs(n1) / _parseRound(_parseAbs(n2));
    while (n1 !== n2 && n1 < n2) {
      n1 += d;
      counting += d;
    }
    return counting;
  }
  function _parseFloat(array) {
    if (!_isObject(array)) {
      return parseFloat(array);
    }
    var counting = array.length;
    while (counting--) {
      array[counting] = parseFloat(array[counting]);
    }
    return array;
  }
  function _parseInt(number) {
    return parseInt(number);
  }  
/*
  -------->>>>>>
*/
/*
  --------<<<<<< Functions that gets the data type.
*/

  function _isNaN(n) {
    return isNaN(n);
  }
  function _typeof(i) {
    return typeof i;
  }
  function _isFunction(i) {
    return _typeof(i) === 'function';
  }
  function _isObject(i) {
    return _typeof(i) === 'object';
  }
  function _isNumber(i) {
    return _typeof(i) === 'number';
  }
  function _isString(i) {
    return _typeof(i) === 'string';
  }  
/*
  -------->>>>>>
*/
/*
  --------<<<<<< Functions that manipulate and verify string
*/
  function removeClosingParentheses(string) {
    return string.replace(/[)]+/g, emptyString);
  }
  function _toLowerCase(stringOrElement) {
    return stringOrElement.toLowerCase();
  }
  function hasOccurrence(string, find) {
    return string.split(find).length > 1;
  }
  function _trim(string) {
    return string.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  }
  function _toString(i) {
    return i.toString();
  }
  function removeSpacesChar(string) {
    return string.replace(/[ ]+/g, emptyString);
  }
  function removeMultipleSpacesChar(string) {
    return string.replace(/[  ]+/g, spaceString);
  }  
/*
  -------->>>>>>
*/
/*
  --------<<<<<< Function that get the properties of the object in an array.
*/
  function getObjectKeys(object) {
    var array = [
    ],
    key;
    for (key in object) {
      array.push(key);
    }
    return array;
  }  
/*
  -------->>>>>>
*/
/*
  --------<<<<<< Functions that manipulate elements and attributes HTML.
*/
function appendStyleElement() {
  var styleString = 'style',
  element = createElement(styleString);
  bodyElement.appendChild(element);
  element.id = controlAnimationString + '-animations-' + styleString
  return element;
}
  function createElement(tag) {
    return doc.createElement(tag);
  }
/*
  -------->>>>>>
*/
/*
  --------<<<<<< Functions that manipulate and verify CSS colors.
*/
  function isColorHex(string) {
    return /^#([0-9A-F]{3}){1,2}$/i.test(string);
  }
  function hexToRGB(hex) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split(emptyString);
      if (c.length === 3) {
        c = [
          c[0],
          c[0],
          c[1],
          c[1],
          c[2],
          c[2]
        ];
      }
      c = '0x' + c.join(emptyString);
      return "rgb(" + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") + ")";
    }
  }
  function isColorRGB(string) {
    return hasOccurrence(_toLowerCase(string), 'rgb');
  }
  function isColorCSS(string) {
    return isColorRGB(string) ? true : isColorHex(string) ? true : false;
  }  
/*
  -------->>>>>>
*/
/*
  --------<<<<<< Global object, inserting methods and properties.
*/
  MyAnimation.prototype = {
    'pause': developerAnimationObjectPause,
    'resume': developerAnimationObjectResume,
    'cancel': developerAnimationObjectCancel,
    'go': developerAnimationObjectGo,
    'back': developerAnimationObjectBack,
    'restart': developerAnimationObjectRestart,
    'addListener': developerAnimationObjectAddListener,
    'removeListener': developerAnimationObjectRemoveListener,
    'clone': cloneAnimationObject
  }  
  function ControlAnimation() {};
  ControlAnimation.prototype = {
    'create': MyAnimation,
    'play': PlayAnimation,
    'pauseAll': pauseAllAnimations,
    'resumeAll': resumeAllAnimations,
    'restartAll': restartAllAnimations,
    'cancelAll': cancelAllAnimations,
    'goAll': goAllAnimations,
    'backAll': backAllAnimations,
    'addListenerAll': addListenerAll,
    'removeListenerAll': removeListenerAll,
    'get': getDeveloperAnimationObjects,
    'getAll': getDeveloperAnimationObjects,
    'config': controlAnimationConfig
  };
  var controlAnimation = new ControlAnimation();
  if ('undefined' !== typeof module && 'undefined' !== typeof module.exports) {
    module.exports = controlAnimation;
  } 
  else if (typeof define === 'function' && define.amd) {
    define('controlAnimation', [
    ], function () {
      return controlAnimation;
    });
  } 
  else {
    global['controlAnimation'] = controlAnimation;
  }  
/*
  -------->>>>>>
*/

}) ('undefined' !== typeof window ? window : this, document, Infinity);
