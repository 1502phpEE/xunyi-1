//if (!$.browser.msie) {
//	$("#header").css("z-index", "8000");
//	$("#header").css("position", "relative");
//}
function showAlert(domObject, parentGroup, content, otherDomHub, place) {
	if (otherDomHub == null) {
		popHub = domObject;
	} else {
		popHub = otherDomHub;
	}
	popHub.popover({
		content : content,
		template : '<div class="popover"><div class="arrow"></div><div class="popover-inner"><div class="popover-content"><p></p></div></div></div>',
        placement : place
	}).popover('show');
	parentGroup.addClass("error");
	popHub.live("focus click", function() {
		$(this).popover('destroy');
		parentGroup.removeClass('error');
	});
}

function closeAlert(domObject, parentGroup, otherDomHub) {
	if (otherDomHub == null) {
		popHub = domObject;
	} else {
		popHub = otherDomHub;
	}
	popHub.popover('destroy');
	parentGroup.removeClass('error');
}

function setAlert(domObject, parentGroup, content, otherDomHub, subjoin, place) {
	var domVal = $.trim(domObject.val());
    if (domVal.length == 0) {
        showAlert(domObject, parentGroup, content, otherDomHub, place);
        return false;
    }else if(typeof(subjoin) != 'undefined'){
        try{
            if(domVal.length > JSON.parse(subjoin).number){
                showAlert(domObject, parentGroup, (new Function("return " + subjoin))().content, otherDomHub, place);
                return false;
            }
        }catch(e){
            console.log(e+";参数subjoin格式错误,预期:{'content':'xxx','number','xxx'}");
        }
    }
	return true;
}

function disableSubmit(whichButton) {
	if (document.getElementById) {
		// this is the way the standards work
		document.getElementById(whichButton).disabled = true;
	} else if (document.all) {
		// this is the way old msie versions work
		document.all[whichButton].disabled = true;
	} else if (document.layers) {
		// this is the way nn4 works
		document.layers[whichButton].disabled = true;
	}
}

function enableSubmit(whichButton) {
	if (document.getElementById) {
		// this is the way the standards work
		document.getElementById(whichButton).disabled = false;
	} else if (document.all) {
		// this is the way old msie versions work
		document.all[whichButton].disabled = false;
	} else if (document.layers) {
		// this is the way nn4 works
		document.layers[whichButton].disabled = false;
	}
}

// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

//this String.prototype.trim fix IE's trim bug!
// if(typeof String.prototype.trim !== 'function') {
// String.prototype.trim = function() {
// return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
// }
// }

'use strict';

// Add ECMA262-5 method binding if not supported natively
//
if (!('bind' in Function.prototype)) {
	Function.prototype.bind = function(owner) {
		var that = this;
		if (arguments.length <= 1) {
			return function() {
				return that.apply(owner, arguments);
			};
		} else {
			var args = Array.prototype.slice.call(arguments, 1);
			return function() {
				return that.apply(owner, arguments.length === 0 ? args : args.concat(Array.prototype.slice.call(arguments)));
			};
		}
	};
}

// Add ECMA262-5 string trim if not supported natively
//
if (!('trim' in String.prototype)) {
	String.prototype.trim = function() {
		return this.replace(/^\s+/, '').replace(/\s+$/, '');
	};
}

// Add ECMA262-5 Array methods if not supported natively
//
if (!('indexOf' in Array.prototype)) {
	Array.prototype.indexOf = function(find, i /*opt*/) {
		if (i === undefined)
			i = 0;
		if (i < 0)
			i += this.length;
		if (i < 0)
			i = 0;
		for (var n = this.length; i < n; i++)
			if ( i in this && this[i] === find)
				return i;
		return -1;
	};
}
if (!('lastIndexOf' in Array.prototype)) {
	Array.prototype.lastIndexOf = function(find, i /*opt*/) {
		if (i === undefined)
			i = this.length - 1;
		if (i < 0)
			i += this.length;
		if (i > this.length - 1)
			i = this.length - 1;
		for (i++; i-- > 0; )/* i++ because from-argument is sadly inclusive */
			if ( i in this && this[i] === find)
				return i;
		return -1;
	};
}
if (!('forEach' in Array.prototype)) {
	Array.prototype.forEach = function(action, that /*opt*/) {
		for (var i = 0, n = this.length; i < n; i++)
			if ( i in this)
				action.call(that, this[i], i, this);
	};
}
if (!('map' in Array.prototype)) {
	Array.prototype.map = function(mapper, that /*opt*/) {
		var other = new Array(this.length);
		for (var i = 0, n = this.length; i < n; i++)
			if ( i in this)
				other[i] = mapper.call(that, this[i], i, this);
		return other;
	};
}
if (!('filter' in Array.prototype)) {
	Array.prototype.filter = function(filter, that /*opt*/) {
		var other = [], v;
		for (var i = 0, n = this.length; i < n; i++)
			if ( i in this && filter.call(that, v = this[i], i, this))
				other.push(v);
		return other;
	};
}
if (!('every' in Array.prototype)) {
	Array.prototype.every = function(tester, that /*opt*/) {
		for (var i = 0, n = this.length; i < n; i++)
			if ( i in this && !tester.call(that, this[i], i, this))
				return false;
		return true;
	};
}
if (!('some' in Array.prototype)) {
	Array.prototype.some = function(tester, that /*opt*/) {
		for (var i = 0, n = this.length; i < n; i++)
			if ( i in this && tester.call(that, this[i], i, this))
				return true;
		return false;
	};
}