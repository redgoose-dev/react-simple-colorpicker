(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/** @jsx React.DOM */var React = require('react');
var ColorPicker = require('../lib/index');

document.addEventListener('DOMContentLoaded', function () {
  var container = document.getElementById('container');
  React.renderComponent(ColorPicker(null ), container);
});

},{"../lib/index":7,"react":159}],2:[function(require,module,exports){
/** @jsx React.DOM */var React = require('react');
var husl = require('husl');
var tiny = require('tinytinycolor');
var Details = require('./details.react');
var Map = require('./map.react');
var Sample = require('./sample.react');
var Slider = require('./slider.react');

var ColorPicker = React.createClass({displayName: 'ColorPicker',

  propTypes: {
    color: React.PropTypes.instanceOf(tiny)
  },

  getDefaultProps: function () {
    return {
      color: tiny('#808080')
    };
  },

  getInitialState: function () {
    return this.props.color.toHsl();
  },

  handleHueChange: function (hue) {
    this.setState({
      h: hue 
    });
  },

  handleSaturationChange: function (saturation) {
    this.setState({
      s: saturation
    });
  },

  handleLightnessChange: function (lightness) {
    this.setState({
      l: lightness
    });
  },

  handleMapChange: function (hue, sat) {
    this.setState({
      h: hue,
      s: sat
    });
  },

  render: function () {
    var color = tiny(husl.toHex(this.state.h * 360, this.state.s * 100, this.state.l * 100));

    return (
      React.DOM.div( {className:"colorpicker"}, 
        React.DOM.div( {className:"hue-slider"}, 
          Slider( {vertical:false, value:this.state.h, onChange:this.handleHueChange} )
        ),
        React.DOM.div( {className:"sat-slider"}, 
          Slider( {vertical:true, value:this.state.s, onChange:this.handleSaturationChange} )
        ),
        React.DOM.div( {className:"light-slider"}, 
          Slider( {vertical:true, value:this.state.l, onChange:this.handleLightnessChange} )
        ),
        Map( {h:this.state.h, s:this.state.s, l:this.state.l, onChange:this.handleMapChange} ),
        Details( {color:color, h:this.state.h, s:this.state.s, l:this.state.l} ),
        Sample( {color:color} )
      )
    );
  }

});

module.exports = ColorPicker;

},{"./details.react":3,"./map.react":4,"./sample.react":5,"./slider.react":6,"husl":9,"react":159,"tinytinycolor":160}],3:[function(require,module,exports){
/** @jsx React.DOM */var React = require('react');
var tiny = require('tinytinycolor');

var Details = React.createClass({displayName: 'Details',

  propTypes: {
    h: React.PropTypes.number.isRequired,
    s: React.PropTypes.number.isRequired,
    l: React.PropTypes.number.isRequired,
    color: React.PropTypes.instanceOf(tiny).isRequired
  },

  render: function () {
    var rgb = this.props.color.toRgb();
    var hex = this.props.color.toHex();
    var hsl = {
      h: Math.round(this.props.h),
      s: Math.round(this.props.s * 100),
      l: Math.round(this.props.l * 100)
    };

    return (
      React.DOM.div( {className:"details"}, 
        React.DOM.ul( {className:"rgb"}, 
          React.DOM.li(null, React.DOM.label(null, "R:"), " ", React.DOM.span( {className:"value"},  rgb.r )),
          React.DOM.li(null, React.DOM.label(null, "G:"), " ", React.DOM.span( {className:"value"},  rgb.g )),
          React.DOM.li(null, React.DOM.label(null, "B:"), " ", React.DOM.span( {className:"value"},  rgb.b ))
        ),
        React.DOM.ul( {className:"hsl"}, 
          React.DOM.li(null, React.DOM.label(null, "H:"), " ", React.DOM.span( {className:"value"},  hsl.h )),
          React.DOM.li(null, React.DOM.label(null, "S:"), " ", React.DOM.span( {className:"value"},  hsl.s )),
          React.DOM.li(null, React.DOM.label(null, "L:"), " ", React.DOM.span( {className:"value"},  hsl.l ))
        ),
        React.DOM.ul( {className:"hex"}, 
          React.DOM.li(null, React.DOM.label(null, "#"), " ", React.DOM.span( {className:"value"},  hex ))
        )
      )
    );
  }

});

module.exports = Details;

},{"react":159,"tinytinycolor":160}],4:[function(require,module,exports){
/** @jsx React.DOM */
var React = require('react');
var tiny = require('tinytinycolor');
var huslMap = require('../utils/huslMap');

var Map = React.createClass({displayName: 'Map',

  propTypes: {
    h: React.PropTypes.number.isRequired,
    s: React.PropTypes.number.isRequired,
    l: React.PropTypes.number.isRequired,
    onChange: React.PropTypes.func
  },

  getDefaultProps: function () {
    return {
      onChange: function () {}
    };
  },

  getInitialState: function () {
    return {
      active: false
    };
  },

  componentDidMount: function () {
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  },

  handleMouseDown: function (e) {
    e.preventDefault();
    this.setState({
      active: true
    });
  },

  handleMouseMove: function (e) {
    if (! this.state.active) return;
    var el = this.getDOMNode();
    var rect = el.getBoundingClientRect();
    var hue = (e.clientX - rect.left) / rect.width;
    var sat = (rect.bottom - e.clientY) / rect.height;

    if (hue < 0) hue = 0;
    else if (hue > 1) hue = 1;

    if (sat < 0) sat = 0;
    else if (sat > 1) sat = 1;

    this.props.onChange(hue, sat);
  },

  handleMouseUp: function () {
    if (! this.state.active) return;
    this.setState({
      active: false
    });
  },


  render: function () {
    var lightness = this.props.l >= 1 ? 0.99 : this.props.l;
    var imageId = Math.floor(lightness * 10);
    var offset = (Math.floor(lightness * 100) % 10) * -100;
    var darkLight = lightness < 0.5 ? 'dark' : 'light';

    return (
      React.DOM.div( {className:'map ' + darkLight, onMouseDown:this.handleMouseDown}, 
        React.DOM.img( {className:"background", src:
          'data:image/jpg;base64,' + huslMap[imageId],
         style:{
          top: offset + '%'
        }} ),
        React.DOM.div( {className:"pointer", style:{
          top: (100 - this.props.s * 100) + '%',
          left: this.props.h * 100 + '%'
        }} )
      )
    );
  }

});

module.exports = Map;

},{"../utils/huslMap":8,"react":159,"tinytinycolor":160}],5:[function(require,module,exports){
/** @jsx React.DOM */var React = require('react');
var tiny = require('tinytinycolor');

var Sample = React.createClass({displayName: 'Sample',

  propTypes: {
    color: React.PropTypes.instanceOf(tiny).isRequired
  },

  render: function () {
    return (
      React.DOM.div( {className:"sample", style:{
        background: this.props.color.toHexString()
      }} )
    );
  }

});

module.exports = Sample;

},{"react":159,"tinytinycolor":160}],6:[function(require,module,exports){
/** @jsx React.DOM */var React = require('react/addons');
var tiny = require('tinytinycolor');

var Slider = React.createClass({displayName: 'Slider',

  propTypes: {
    vertical: React.PropTypes.bool.isRequired,
    value: React.PropTypes.number.isRequired,
    onChange: React.PropTypes.func
  },

  getDefaultProps: function () {
    return {
      onChange: function () {}
    };
  },

  getInitialState: function () {
    return {
      active: false
    };
  },

  componentDidMount: function () {
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  },

  componentWillUnmount: function () {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  },

  handleMouseDown: function () {
    this.setState({
      active: true
    });
  },

  handleMouseMove: function (e) {
    if (! this.state.active) return;
    var el = this.getDOMNode();
    var rect = el.getBoundingClientRect();

    var value;
    if (this.props.vertical) {
      value = (rect.bottom - e.clientY) / rect.height;
    } else {
      value = (e.clientX - rect.left) / rect.width;
    }

    if (value < 0) value = 0;
    else if (value > 1) value = 1;
    
    this.props.onChange(value);
  },

  handleMouseUp: function () {
    if (! this.state.active) return;
    this.setState({
      active: false
    });
  },

  getCss: function () {
    var obj = {};
    var attr = this.props.vertical ? 'bottom' : 'left';
    obj[attr] = this.props.value * 100 + '%';
    return obj;
  },

  render: function () {
    var classes = React.addons.classSet({
      slider: true,
      vertical: this.props.vertical,
      horizontal: ! this.props.vertical
    });

    return (
      React.DOM.div( {className:classes, onMouseDown:this.handleMouseDown}, 
        React.DOM.div( {className:"track"} ),
        React.DOM.div( {className:"pointer", style:this.getCss()} )
      )
    );
  }

});

module.exports = Slider;

},{"react/addons":10,"tinytinycolor":160}],7:[function(require,module,exports){
module.exports = require('./components/colorpicker.react');

},{"./components/colorpicker.react":2}],8:[function(require,module,exports){


var map = [
  "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+3q488ZzmZmc45yAFLdatVbVutdvTy54zmZmZnHOIFCrrVqrVtu+vo5YxmZkzM4xkAFXWqtVbbddfRyxnOZMzOc4yAKNXVWqtXWunfnjOZMyZznEQsoLdWrSrbddO/PGZmSZmc4gAKurVpVtuunXGMyZkkznEACl1atKq6vTrjOcySSZzmQBRWrVUtW631xnMkkmZnMAAttqqVbbvrjMzJJJM5gAUttVSlut9MZkkkkmcwAoW2qUq273mZkiSTOQAKtVSi1rW8ySSRJmQAoLapRVu9TMkSRMwAAtVQqrdbzJJEiTIACqpRS1reZJESJkBZQVSlFXWsyIkRIAAKpQpbdSSIiRAACqKFFupIhESAAUUKFLbEhCRAAKUFBS2IIiAAAoKBSoQQgAAKAKUIECAACgAKAgAAAAAAABnnmACrd6tW1bbrfb18eWM5zM5znHPMAUXWtW1Vtt1rt6uPPGczMznOOeUChWtatWra1d9fTy54zMzMznHPIApbrVqrVt1rr6OfPOczMzM45yAUVdatVatt309HLGc5kzMzGMgBTWrVqrV1rp354zmTMmc5xIAUa1atVVt117c8ZmZJmZziCKBbq1aVbbrp1xiZkzJM5xAAVdW1Squr064xMySSZznIBQ1bVUtW631xnMkkmZnMAAttqqVbbvpnOZJJJM5gAottVRVut7zmSSSSZyhQBdKqirbvecySRJM5AAqqq0VWtbzJJJEmZAChVqilW63mSRJIzAAC1SlKt1qZkRJEyAFCqUUq61JJESRJQAFUootupIkRIgABVFCi6siQiRAALKUoUW2IiEiAAUUUFFqQREJYolBQoBaQRCAAAoAoUIESwAAoACgEAAEoAAAsADPLMAUXW9W1bVutb7ezhz55znMznGOWUBRWt6tq1bbrfb18eWM5zMzGcc8ABV1rVtWrbda7erjzxnMzM5zjnmAULrWrVq2tXfX08uecTMzM5xzyAFNa1atWrda6+jljOczMzM45yAFLdatVatt30788ZzmTMzMYyJQK1q1aq1da6d+eM5mZJnOcZAFGtWrS1bddO2MZzJJmZziIoBbq1aVbbrp1xjMmZJM5xAAVdW1Sqt106ZxMySTMzmQBQ1bVUtW630ziTMjMmcwAFW2qpVau+mc5kkkkzmACi21VFW3fTOZmJJJnIAC2qWirbvecySRJMyAFBb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CgAooAJYAgSgAUUAAgJYAAClAAIAQAAKKAAIAQABQUAAQAgAoAoACAAQUAAUACAEpKAAFSyggAEoAAAFgAAAAAAADzuuqEImM6FAUnLpQQlnXQEJM5qigVMboghOtVBEmZVAoWZ3UEQbtEIjMooFCapCEN0EImZVCgpNVBCJuggkkpQKBoEITVAhJChQFLSCEaWAiJKKAUaAhE1RAkSVQChbUCEWiBEhQChVoghLQgiJQVKFNAQhQQIgKAUtAQSgghBQBRaAQAIIhQBRVAEAEEJQLFCqAEACEAWUBVABAEBBUoBSgAlgECKABRQASwCWEoAFCgAQAQAAUFAAQAQABSUoAEABACgAoAIAJUKAAAKlQACUAlAAAAAAAAAAB5521RCJMSqCgTl0oCSztaEJJmUoFBjYEIdNAREzm0UCjOwhEs6VUESZlUUCk0CEJu0QSSSihZQaBCE3QQiZloKCjQQhGqCESSllBRZoCETVAhJBQKFLRBCaAQiShQKGgIQoCESUoCiqAglAISCgsoVagIS2AIiUFAUtCCCoBCSigFKoQEogIQUCxRVBAlEAiFBUUKoEAIBACkUFUBACAgFJQCqAQEAEKSgBVAIAgCKAAUoCAJYAAACgUgBLAAAAKAAEAAAAKAAAgAAAFAAEqAAAAFAAQAAAABQlD//EABkBAQEBAQEBAAAAAAAAAAAAAAABAgMEBf/aAAgBAhAAAADPHCAot101bbVtutb9Ht8/LGM5znOcc+WIAUu96ttq2266dvZw5885znOc558sAAt1vVtW223W+3r48sZznMznGOWYAout6tq1bbrfb1ceeM5zM5znHPCBQretW1att1rt6OfPGczMznOOeYAoutatWra1d9fRyxjOZmZmcc8gArWtWqtW3WuvfnzzmZkzmY5yAULdatVatt117c8ZmZmTOc4yAKNatWqq3WunbnjMzJMzOcSAULdWrSrbddOuMTMmZJnOIACrqraVa1enXGc5kkmZnEAKGraqlq3W+uM5kmZJM5gAKttVSq1d9M5zJJJJnMAKFtqqKt1vecyZSSTOUoAWrS0Vbd7zmSSJJmQAoLVpRa1recyRJJJIoALVKUq3W8ySRJJIABSqUUq61JIkSRIqKlBVKKLbqSJESIAAVRQourIkIkQACylKCltkQiIgKSgoUBVsQhEAABQBQtghCWAACgAosBAAAAAAFQAZ44iUCrvpq22222736Pd5+OMYznOc458cQBSt9NW21bbrW/R7OHLnnGZnOcc+WIAKu96ttq2266dvXx5YznOc5znnywgKK3vVtW2tXW+3q488ZznMznGOWYAout6tq1bbrfb08cYznOZnOcc8CFCt61atq23Wu3o5c85zmZmc455gFC61q1atW63178+ec5mZmYzzyAKNa1aq1bbvr254zmZmZnOecgKC6uqtVa1dde3PGczMmZnOMgCjWrVpatu+nXGMzMmZM5xAALdWrSrbddOuMZkzJMzOIALKuqtVVq66dM4mZJMyZwiygLbaqlq3W+mMzMkkkzmABS21VFrV30xmSSSTMzBQBbaVSrbveZmSJJM5AApaq0VbdbzJJJJJJAChVqilW63mSSJJJAAC1SlKt1rMkSJIyAFCqUUW61mREiRAACqKFK1WUREiAAWUpQotsREREBSUFCgUtSEIgAAKAKKqEIQAAFABRYCAAAAAAKgAzx5wApd9N222226109Hv83LnjGc5zjPLjzQFFu+mrbbbbbvfo9vn5c84znOc458cQBSt9NW21bbrW+/s4csYznMzjPPliACrverbVttut9/Vx54xnMznOMcsICit71bVtXV1vt6eXLOMzOc5zjlmAKLrerVtW26319PLnjOZmZznHLIAVda1atW2276+jnzxmZmZnOOeYChWtatWqtutde/PGJnMmc5zzyAKW61aq1bbvp354znMmZnOecACmrqrVVdXXTtjGczMmZnOMgKFurVVatuunbnnOZMyZmcQAFXVW0q1rW+uM5zJJMzOIAKNW1VLVut9cZzJMySZzAAVbaqlVq76ZzmSSSZmYAULbVKVbre85mYkkzMgAKtVVKtu95zJJJJJIAUKtUUtXepmSJJJIlABapSlW61MxIkkkAChVKKVdakkiRIkoAFKUUW3UkiIkQAApShRbqSIhIgKipRRQUWoiEQAJQUAoWkIQgAAKACioEAAJQAABSAGeHOAFW76burWluta6ej6Hm488YznOM45cecJQVem9222226109Ht4ceecZznOMc+PNAKW76atttttuunf2cOWMZznOc458cQBSt9NW21bbrW+/r4c8YznOc5zz45gBS73q21bbbrfb1cuWM5zmZzjHLAAVdburVtW6u+3p5c8ZzmZznOOWYBRW9atW1bbrfX0csYznMzM5585AFF1rVq1aurvr354xnMzM5znnkAKa1qrVq261178+eczMzM5xiQChdXVWrVauuvbnjOZMzMzjEAFGrqrVVbd9OuMZmZMyZziAAW6q1Vq266dcYzJmSZmcQAUXVqqW1q9OmcTMkmZM4gUBbbVUtW630xmZkkkzMwAUW2qpVau+mMySSSZmYKAVbSqVbd7zMySJMzIAULVWiq1reZmJJJJIUALVKUq3W8ySRJJIAFCqUUq61JJESRkUAFUootupIkRIgABVCii3UkRCRAALKUoKLqREIhLFIoKAULSEIQAAFAChUEAAQUAAApACeflAFLenTd1bbbbrfT0fR83DnjGcZzjHLhzgBVu+m7q1bbq76ej3efjzxnOM5zjlx5wAVem9222226107+3hxxjOc5xnHPjzQUKu97tttXVuunf18eXPOc5znGefHCAUt101bbVtutb7evjyxnEznOcY5YgClb3dW1bWrrfb08ueM4mc5znHLMAKXW7q1bVt1vt6OWMZznMznPPnkAKb1q1attutdu/PnnOczOc5xzkAorWtVbVq3W+vfljOc5kznOMZAKLdaq1Vtt30788ZzmZkznGIAFNXVWqtauunbGM5mZMzOM5AULbqqq1bddO3POcyZkzM4gAKuqtVVtut9cZzMySZmcQAoatqqWrdb64zmTMkmZmAAq21VKtt30znMkkkzMwFAW2qUtXWumczMiSZmQAFWqqlW3W5mSSSSSQKAWqUotut5kkiSSQAAtUpRa3rMkSJJIKQoKpRRbqyRIiRAACqClFupEhEiAAFKUFLbIhEQgpFBQsKFpBEEAACgBQqCAAQKAAAoQBPNzkBSr16burbbbrWunq+j5ePLGMZzjPPlw5QBS3p03dW2226109Pv83LljOM5zjHLhzgClu+m7dVbbq736Pd5+OMYznOcY58ecAUrpvWrbbbbrW/R7OHLnjOc5znHPjiAFLve7bbVt1rff18eWMZznOc458sABV3vVtq223XTt6uPPGM5zM5xz54RQKut3Vq2rda329HLnjOczOc5588wBStbuqtq23W+vp5c8ZzM5mcY55AFLrWrVq226119HLGM5mZnOcYyAFNa1VtVbda69+eMZmZmZzjEgFC3WltVbbd9O3PGZnMmZnGIAFNXVVaq3WunXGMzMmZmYzJQAt1VqrVt1064xmTMkzMZgAourVUtq66dM4mZJMzMwgUC21apVt1vpjMzJJJmZgAottUqqut7zmSSSTMyAAq2lUq273nMkkkZmQAotUpSrrWpmSJJJIAAWqUotutTMSRJJAAoVSii3WplIkSIAAVQUpWrIiIkQAApQpRbZEIhEFQoFFSgtEIQgAAUAUKIIAEBQAAFBAJ5uUgUVrp13q2226ut9PV9Ly8OWMYzjOOfLz85Aoq9em7q2226u+np+h5uPLGM5xnGOXDkgUVenTdurV1brXT0e7z8cYxnOM5xy4c0Cir03rVtttt1rp6PZw5c8ZznGc458eaBQt3vWrbbV1d77+vjyxjOc5xnHPliAoVvetW2rbda339XHljOc5znOOfLMAUXe7q2rbbdb7+njzxnOc5znPPngAUut3Vq1bdXfb08ueM5zmZzjHPIAU1u6q1bbdb6+jlzznOZnOc45yAUVrV0tq1dXfXvz55znMzM5xjIBQ1rVWqtt1rr254znMzMzOMQAKatttVautdO2MZzMzMmcYgBRbdVVWrbrp255zmZkmc5zAApdWqqq1db64znMkmZmYgKA1atUq2630znMzJJMzMAFFtWqVbbvpnOZJJJmZgKAttKpVt3vMzJJEzMgBRVpVFaut5mYkkkkhZQC1SlFt1qSSSJJIACiqooq61JJESRJUoAqhQq26kkREiAAFKFKLbERCIgsFAoFBbYhCEAACgChRBABAFAABZUqATzcYigtvXrvVurbbrW+nq+n5OHLGMZxjGOPn5QAq3p13dW226ut9PT9DzceWMZxnGefLz84AUvXprWrbbbdb6ej3+blz55xnOM45cOcAKXp01q3S23V309Ht8/LnjGc5zjHLjiAFL03rVtttt1rp39nDlzzjOc5xjnyxACl3vWrbat1ddO/q48sYznOc5xz5YACrretW1bbda329XHnjGc5zMZ58soUFN7urVtaa1vt6ePPOM5mc5xjnmAKVrdt0tW26329HLnjOZnOc5xzyAUXWrpattt1rr6OWMZmczOc4xkAKa1qrVq2611788YzMzMznGJAoFutLaq2276dueM5mZMzOMQAoaulqrautdOuMZmZMzOc5gAKurVVVtuunXGMzMkzM5zAChdWqpat106YzmSZkmZgABbatUq23pvOcySSTMzAKBbVpS1da6ZzmSRMyZAChbVKVbdbmZJJJJJAsoFqlKVbreZJIkkkABRSqUVdakkiJJEFAC0UKW3UkiIkQAApQopbYiISEAFBQUFWxCEIAAFAKCiCAgAKAAAqACeXjACrevberq226ut9fV9TycOXPGMYzjnx8/GAKW9eu7q23Vuta6+n6Pm4csYxnGcc+Xn5QBS3p11rVttt1rXX0e/z8eWMZzjOMcvPzgFKvTprV1bV1da6en2+flzxjOM5xjlx5oFFXfTWrbbbbre/R7OHLnjOM5znnz44QKKu961bbbbbvfo9XHljGc5xnOOfLEAore9atq2261vv6uPPnnOc5zjPPlmAKVvWtWrbbbrff08eeM5znOc4xyyAKXW7pbatutb6+nlzxnOc5mcY55ACmt222rbbrfX0csYznMznOcc5AoK1q6Wraurvr35885zmZmc4xkAot1qrVq26117c8ZzmZmZnGIACtXS2qttuunbGM5zJmZznEBQLdVaqrbddOuM5zMyTOc5gAUurVVVXWt9cYmZJMzOcpQAttWqVbdb6ZxMySSZmYAULbVKW1re85kkkkzMgAUtqlKtu95zJJJJJIBQLVUUq3epmSRJJIACilKott3mSREkiAUBVUFLbqSRESIAAUooUt1JEIkQAKCgoKtiEIQAAKAoFECAgAUAABSAE8vCAKW9u29XVturrW+vr+p4+HLnzzjGMc+Pm4oBS3t13q3Vtt1rfX0/S8vDljGMZxjny8/KQKKvXrrWrbbdXW+np+h5uPLGM4zjGOXn5wAquvTWrq2226309Pt8/LnzzjOM4xy484AVXTprVtttuta6ej2cOXPGM5zjPPnxxAFK6b1q22226107+zhy55xnOc4xz45gBS73rVtq26uunf1ceWMZznOc458sACl1vWrVttutb7erjzxjOc5znGOWSUCrrWtWraurrfb08ueMZzM5zjHPMBQrW7bbatt1vt6OXPGc5mc5zjnkAot3bbatrWtde/PGM5mZnOcc4AFNaulq1bda69+eMZmZnMzjEgUFXWltVbbd9O3PGczMmc5ziAFDWrVpat1rp1xjOZMyZznMACl1VtKtt106YzmZkmZnOYAULq1VVVut9cZzMySTMwACltqlLbbvpnOZJJJmZhQBVtUpVt3vOZJJJJMgLKC2qKVbvecyRJJJAAFVSilt1qZkSJJIAsoKpQpbqyRIiRAAClFCqupIiEiAAoUKClqQhEAABQFAogQAAAAACoAP/xAAaAQEBAQEBAQEAAAAAAAAAAAAAAQIDBAUG/9oACAEDEAAAAPsOXLGZmZkzMc8wCVAvq9nTVttWrx5ZzmTMmc5xgIAF9Pr3u22rV488TMzJMzGMwAAvo9W9attWrxxjMzJJmZxgJQBe/p3rVtq1eXPOZmSTMzjMAAW9vRvWrbVq8sYzJJJmZxkAArt33rVttVefPOZJJMzOcpQlAvXvvVtttVz5zMmZEznOQAspenberbbbTnjMzJJJJnIABXTtrV1VtpzznMkkkkzlYCgXfXd1attMYzJJJJJmAAFb661batpjOcxJJJMwAUlXe9222rTGcySJEzIAAsu961atWmcSSSJEzABQXW9W2rVM5zEkSJkAAVrd0tqquMySIkSQKgUNa1bVWjMzEREkJQALdXS1VLnMiIiRAAVKuratLZczKIhEAIoF1VqqsSSEQiAAAulqlWJERBEAACtKVVREIggBAKKqqFhEECAAAVVAsIBAgAAoUAIAAAQCgAL9lw54znMmZnOeeEBFgX1+zpu221V48sZmZMzMxzzBKlQL6vX01q21avHnjOZMyZznGEWABfT6umtW2rV4885zMyTMxjMAAL6PT01q22qvHGMzMkmZnGAABe/o6a1bbVXlzzmZkkzM4ygqFC9u/TWrbVq8sYmZJJmZxkABV69961batXljOZJJMzOcgAFde29attWrz55kmZIznMlQoSl6dt3VttVeeMzMkkkmcgAWW7671bbbS885zJJJJMwSgBd9datttpeeczKSSSZgAWKb66urVtsuMTMkSJmSFEUF3vWratpcZzJIkjMgALKb3q22rVYzJJIkTIigBdburVW0ziRJEiSAAKa1q21VsucySIkSSxQANa1aq1TOZEREkAAqVdW2qqmZJCQiRQgoLq1aVZcyIiEQAAF1VUtSzKEgiAABVtVSoSEQQAgClVVFQiCBAAAFqgqEBAQAAUKAsQAAAgFAAX7Thz55zMyZznPLEAAlez29N2222nHljOZmZmc554gEUD1+zprVttquPLOJmTMzMc8AJUUvp9XXWrbbVceeM5kzJnOcYJYAVfR6em7q21a4885zMyTMxjMAAW9/R03bq1avLnjMzJJmZxgAAt7ejetXS21eXPOcySTMzjIABXbvvdtttq8sYzJJJmZxEFRQXr26at0ttXljOZMpMzOcgAUvTtvVuqtq8+eZJmSSTEAAK6dd61bVtXnjOZJJJJnIBQLvrvVttWrzxmSSSSTMAAK311q22rV55zMpJJJmABQuum7bbVq885kkSJmQABZd71q1atXGJJIkiZlgFAut6ttW0ZzmJIkTIAArWtW21aM5kkRIkgVBQa1q2qqmcyIiJIAAsW6ulWqJmSERIgpAoXVq1VEzERCIAAC6q0qiZQiEQAAKtqqpLJCIIShACqqqKhCECAAALVCkICAgAAUUBYgAACAFABX275+WM5zMzOc55c0AAPb7umtatW1eHLnnMzJnOc8+cAAL6/Z11q222nHljOZmZmc554gABfV6+m7q22048s4mZMzMxzwAlAvp9XTWrq1avHnjOZMyZznGAEoF9Hp6a1bbbV4885zMyTMxjIRQC9/R01q222ry54zMySZmcZgAUXt36a1bbbV5c85zJJMzOMgAKvXvvWrbbavLnnMkkmZnOQACuvbetW22054zmTMkkzmRYWUC9O29W222nPGZmSSSTOQAKXfXerbbbTGM5kkkkmYAALvrrV0ttpjGZJJJJMwAKlN9N3Vq20xnOZIkZkkUIoLrprVtW2mM5kkSRMwAKlN71bbatlxmSSRImZQAC63dVatVnEiSJEkBYFDWtW1atlzmSREiQigAt1dLVWy5zIiIkQACi6tq0tlzmIiEQAAF1VpVsSSEQkAABVtVVJZIRBEKIAVapSkshCBAAAFqhSEBAQAAKUBUIAACABQBT7rz8sYzM5mc5xy5kAAe73dd3VtWr5+WM5zMzOc55c0AAX2e3pvVtttXz88YzMyZznPPmgADXq9fXWtW22nHljOZmZmc554gAC30+rpvVtttXjyziZkzM5zjEAAq+j09N3Vttq8eeM5kzJnOcYAAVe/o6burbbV4885zMyTMzjAABb279Na1bbavHGMyZkmZnGQlALevfe7q2tLeXPOcySTMzjNgqFC9e3TV1bVtc+ecySSZmc5AAVenberq21a54zmTMkkzmAAFdOu9attW1zxmZkkkkzksFEpd9d3Vtq1eec5kkkkmYAAVvpvVttqrzzmZiSSTMCkKF101q221VxiZkiSMyAAKb3q6W1auMSSRJIzFikoF1u6tWrTOcxJEiSAAKa1q21apnMkiJEhCgBbrVqrVlzmRESJAAFlXVtqqsuZJCQiAIoC6tVVWJJCISAAAW21SrEiIgiCkAKaUqgkIQIAAAtUUQQQCAABSgUhAAAQAFAUfevm5c85zmZznOOXOEABfd7+utatttPPyxjMzmZznHPkJYAL7fb13q222r5+WM5zMzOc55cwQsWVfX7Om9XVttOPLGMzMmc5zz5glAL6vV13dW23Rx5YzmZmZnOeeAlAGvR6eutatttXjyziZkzM5zjBKJQNd/R03q6rVq8eeM5mZJmYxkllSgXt6d71dLbo5c8TMzJMzOMwAsovbv01q222ryxjMzJJnMxkABV69umtW221efPOcySTMziAAFvTtvWrbbavPnnMkzJJnObCkUF6dd61bbbV54xJmSSSZyAFirvrvVtttq88ZzJJJJMyUABd9dattttMYzJJJJJmAAUuum7q1baYznMkSMyQAAXXTWrattMZzJIkiZgAoLrerbatsuMySSJGYAAU1rVttWlxmSJEiSAKAa1q1atGZmIiRIAAKurbVpTMkiIRIoQUF1atLUuZERCIAAC3SqWokQiEQAAU0pVLEhCBEoAAWqKIIIBAAApQUQgAAQACgUPv3zccYzmZznOccuUCAC+/6HXWtW22r5uXPOc5mc5zjlzgEVFX2+7rvVt0tXz8sYzM5mc5xz5wCUC+z2dd6urbavn5YznMzM5znliAALfT7Om9atttXjyxiZzMzOc88QACr6fV03q6ttq8eWM5zJmZznnmAAVe/q6burdW1ePLGZmTMznOMAAKvf0dNa1bbdHLnjOZmSZmMZAALe3fprWrbbV5c8ZkzJmTOMgAFvXvvd1bbavLnnOZJJmZxkCygXr23u6tttXljEzJJMzOcgAUvTtvV1a1avLGczLMkmcwAArp13q6tq6l54zMySSSZyCooLvrrWrbVq885zJJJJMwABTfTd1bVtXGMyZSRmZixSUC66a1bbVq4xMyRJEzAAqU101bbatM4kkiSJmUCUC61rVW1aZxJEiRJABQNa1bVq2XOcpESJAAAt1batWxMyRCIkFIFC6tWqtiZiIhEAABdVaVUsyiEIgAAppVKWIhECIoAAtUUuRBAIAACqCiCAACAAoFB+hebjjGJnOc5zjjygQAX6H0O29W226l83LnjOZnOc5xy5IAAvu93XetXVtp5+XPOc5zM5zjlzQAC31+3rvd1bbV8/LGM5mZnOcc+Yiosovq9nXetW23Rw5YznOZM5zjHMBKBr0evpvWrq21eHPGMzMzM5zzwAAW9/V03rVtt0vHljOcyZmc5xgJQC3t6em9XVttXlyxmZmZM5zjMssqKDXX0dN6urbavLnjOZmTMmcYAFlF7d+mtW6XVXlzxmZkmZmYyACyr17dNatultc+ec5kkzJnEAAVenbetW221efPOZJmSTOc2WKlAvTrvWrbbavPGJMySSTOQAspd9d6ttttXnjOZJJJJmAAFb6b1bbbaYxmSSSSTMAChddNattttMYmZEkTMgABWumrqrbS4zmSRJJJChFBdburatoznMiJImQAVFa1q21apnMkiIkgAAW6uqq1Zc5kiERICwKF1bVVbEzIREIlAALqrVKlkkQhEAAFLapVREQQRFAAKqlFzYgQEAABVChAgACABQAo/RXy8eeM5znMxnny4oCWAv0fo9d7t1baebjjGJnOc5zjjyIABff7+u9aurbV83HGM5zM5znHLkCUllL7Pd13rV1bavn5c85znMznOOfOAALfV7Ou93VtujhyxjOZmZznHPEAAq+n19d61bdWrw5YznOZmZzjGIAFF9Hq671dW26OPLOMzMzM5zzwACi9/T11rV1bavHnjOcyZmc5xgABV7enprWrdW1ePPGZmZkznOMgAKvX0dNa1bbqrx55zmZkmczGQAC3r26a1q222uXPOZmSZkziRUUAvXtvWtW22ryxiZkkzJnOQAoXp16aurbbV5YzmSZkkzmAAKu+u9W6ttpzxmZkkkmZIsoAXfXWrq2rV55zmSSSSZgAFLrpu6tq2rzzmTKSRmQAArXTWrbVtMZzJIkkkgVBQt6attq2y4zJJEkjIAFita1bbVpcZkiJEkhQiga1q1aqmcyRCJEAAouratVZc5SISESgAF1VqqsSSIRCAACltVVISIIQlAlAVVKLmxAgIAACqFCAgAEUAAAV+keXjzxjOZnOM8+PFAEsF+l9Lrvd1bbTzceeM5znOc558uUIAFvv9/betXVtq+bjzzjMznOc45coAAa9nu7b1q6tupfPxxjOczOc5xy5kAFL6/b13rWrbdHDlzziZzM5zjnzBKAt9Pr69Nat1bV4cuec5mZnOcc8AAFvo9XXetXVt0vDljEzmZmc554AALe/p671q26tXjyxnOZMz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z6LCEldbQhJM5tFBQzuoQks6aAiM5looFE2EIidLSEJMyqFBSbCERN2iESZKKFCzVIIiboQSSSqFBRoCITVBCJlRQFK0EIRaCESSqAopoCETSwISQoFCloCEWkEIkooFFWkCEtIERBQFCrRAgoghIUBQq0CBKECIlCgFWgIAEEIKAKLQCACBEKAKFoBABAgAFAtAIAICACgKUAgBAQBQBSgEAIBBQAKKBAAQEoACgCwACAAAFAAAAQAAFAAAAIAAoAAAACFAAAADyT0aoREzjNqhQJx60IRZ22BEkxm2hQVMbohEs66ohEmJVCgpnYQiHS0ISTMpQoUzukIks3oCJJM2lBRU1SEQm6BETMtBQoaqCITVqBEklFChTQISGqIEjMqgoUapBETVCCJJRQKK0CEJaEESSqBQpoCEKCBJCigKWqgQlAgiSigULaIESgIJBQFCrQQgsBBIUKAWqCBKQEIlFAFVQIAQIIKACqoCAQEEUAClUBAICAABZSqAgEAgACpRVAICAQAFIoospACASwKSxQUAAIAJUqUAKAAIABKAAUAAgAAAACgCAAAAAAAHkd9qgkkxm0KBU4daBErtqhCSYzaKChz6UhElddARJM5tKCisbpCITraQRJiWlBRWdgiInTQISTMqigom6hCQ3QQjMilFCjQISJugREzLSgUGwhETaoISSUosoU1UEQmqEIkhRQFLaIIi0IRElKAorQEImgQRJKoCirQEIoEIkKFApaAQlAgiSigKVVgEAEEQUAoqqQEUgQhFAKKVRASoCCJQsUFUpAAgIQFlAKpZUAEBBBQBRQAAgIEoAUKAAEAgACpRQAAQEsAKSgoAAQBLBQAFAAEAAAABQAIAAAAACgQAAAAAAA8b0aoIknPNpQUJx6WkImp31RCJnGbVFCjn0CESztoCJJiVRQoZ3UIiWdNUhEZzKooKJsIiE6WiESZiqFCk2EIib0CEkzLSgUqbCERN0CJJJVBQo1SEImqBETJRQUpoEITQCEklKCijVIIiapAiMlCgpWgQhLSBESUUClNAQhQgRIKFAq0BBKECJChQUWgEJQQQkpQCi1UBACBEFBZQqqQEAQIigqUFVRAQCAgFACqLACAQIKABVAAQJYEUABSgAIEsAAAKUACAEAAAUoACBLAAACigBAJSAAAoFllEAikAAUAAAEUAAAAAB4np1QiJnGLaFBU4daEJNO+gIkmM2lBRZz6UhElddUQiZzm0ooUx0CEhOugQkmc2lCimd0hElnSrBEZzKpQUqbCIhN2kESZlUKFDVIRCboQiTJSgopqoIhNUEJJJVFBRdAhIWghEyUoKFaqCETSwIiSVQoFW0QRFpBCSFFApWgIRLRBESUoCitAIRQgiIUAoq0AhKCEIlBUoVaAIAQQgKAotACAIIQUAoqgAgECIoAUVQASwIEABQKoACBAQFigFUABAIECgBSgAQBAigAKUACAIAACxRQAgAgAKQUCwUgAIAAoAAAAAAAAAA8U9O1ISSc82ihQnDrahCanfVCImcZtoUKOfRYREs7aohJJiVRQpZndIRJZ1tCIkxKpQUsm6hEROmgIkmZVChRN0hEidLSESTMtUFFGqgiRN6CESZlUoKK0CEiboIiSSlCylGqQRE1QQkZloUFK0CEJoCESSihZSraQRCgIiQUKCltCEJQEJIUKClaAhBUBESUUKFWgIRRAhIKFAq0AhKICIlBQKWgEAQEIFAKLQBAECEFAKFoAQEAhKBYoLQAQEBAKSgFoAICAIUlACqAECAEUAAooBASwAAAFAABAAAACgABFgAAABQAIAAAABZULFeF6dWwRJnGLVFBU8/ahETU9GqERM4zaUKKnPpRESV20BEkxm1RQox0qERE66ohIznNqihRNhCQnTQISTEtUKFJuoRETpQQkmZVKFFTdgiIm7UERMylFClmwhETdEISZloospTVIQiaoQiSSqFCi6BCItCEJkooUK1SCImgIRJKoFCraIISgQiQoUCltBCJagQiSlAKVaBCKQIRCgCi2gEJRBBIoCgq0AQCBCAFAVaAIBAQgKAUtACAgIQUAUWgAgIEEoAULQAQIBAAKBVACBLAQAoBRQCAlgEFAAUAAJYAAAAoAAIAAAAUABAAAAAFIWF//EABkBAQEBAQEBAAAAAAAAAAAAAAABAgMEBf/aAAgBAhAAAACeTjkBS67dt61bdW6u99fX9Tyeflz54zjHPnx83GQKK117b1dW23V3vp6/peThyxjGMZ544+blACrevXWtW26t1rXX0/Q83HljGM4xjHHhygClvTrrV1bbbrWuvp93n48sYzjOM8+XDmgUVenTWrdLbq6309Ht8/LnjGcZzjHLjzQUKu+mtW2226u+nf2cOXPGcZznGOfHCChV3vWrba1brW/R6uPLGM4znOcc+WIBRW961bVtt1rp29XHnzznOc5xjHLMAorW9XVW223XTt6ePPGc5znOcY5ZAKLrd0ttq3Wt9fRz54znOc5znHPIAo1u6W1bbdb69+fPOc5zM5zjnIsKFa1bbVtXV317c8ZznMzM5xjIChbq22rVt1rp2xjOczMzmYxABRq6qqtW6107c85zmZkznOAAFuqtpVtuunXGMyZkzM5zAChdVapaur06YzmSZkmc5AAq21VKtt6bznMkkkzMwKAW2lUq3Wumc5kkkkmQBQWrSi1rW8zMSSSSSgAWqUVVutSZSRJJAFlBVKKLdazIkRIgABVFCi3UkRERCxSCihQUtSEIgAAKAFKECAAAAAAogBPJwyAqtdu+9at1bq61vt6/rePz8efPGMYxz4eXjACre3Xpq6turda319f0vL5+WOeM4xjnx83GAUq9um9at1bbrW+vp+j5uHLHPOMZxz4+fnACrenXWtW226ut9PV7vPx5YxjOM458uHOAKW9OmtW6tturvp6fb5+XLGcZxnGOXDEAUt301q2223WtdPR7OHLnjGc4zjHPjiAKVvprVtttt1rp6PXw5c84znOM458cwBRd71q21bdXXTv6uPLGM5znOM8+WABS63rVtW23Wt9/Tx54xnOc5zjHLIAVda1bbba1db7ejlzzjOczOM45SBQVrd1Vq2263278+eM5zM5znHPICitatttW22769+eMZzM5mc45wAot1bbVW26117c8ZzmZmZnGIAFLq22qtauuvXGM5mZmZznEAULbpaq1bddOuM5zMyZmc5gAouqtUtrWt9cZzmSZkznJKAVbaqlW3W+mMzMkkmZmAFC21Slq63vOZmSRmTIAKLVWirbrczJJJJJIKALVKUq3W8ySSJJIAFCqUUq61JJEiRAACqKFK1ZEhEiAqKBRQUXUiIRAAAUAULYQQlAAAAAUEAnj4SApbe/bprV1bq6u99fZ9fxefjz54xjHPnw8vCAKW9+u93VurdXe+vr+n5OHHnjGMYxz4+XlABbevXetXVturvfX1fR8vDlzxjGcY58fPygClvXpvWrbbq61vp6vf5uPLnnGM4xz5efmgUVenXWrq223Wt9PT7vPx5YxnGcYxy4c0KCr06a1bbbq3W+no9vn5c8YxnOM8+fDAAVd9Natttt1d9O/s4cueM4znOMc+OAAq73rVtrVt1rp39XHljGcZznGefHMChV1vV1VttutdO3q48+ec4znOcY5ZgFFb1q2222266dvRy54ziZznOOfPIBRda1bbatutb6+jljGJnOc5zjnkAUt3bbVttut9e/PnnOc5mc5xziUBTWrbatW3W+vbnjGZmZzMZxkKlFXVttVbbd9O3POMzMmc5ziAFDVttVat1rp1xjMzMyZznMABV1Vqqtt106YzmZkmZnOYCgW2rVKtut9M5zMySTOZABRbapVVdb3nMkkkzJkABVqqpVt3vOZJJJJJAoBapSlW63mSSJJJAAUVSlFXWpJIiSIAAVQUpWrIiIkQFgoFFCjVkRCEAACgFBbCCBKIBQAAUCATx+eQUVb6O3TWrq6t1rXTr7frePzcefPGMc8cuHl4SApWu3be7q6tuta329f1PJ5+PPGMYxz58fLxgClvbrvWrq26utb6+v6Pl4cueMYxjHPj5+Ugoq3p13rVturda319Xv83HlzxjOMY58vPzgClvTpvV1bbdXW+vp93n4c8YxnGMY5cOcAUt303q23Vt1d9PT7fPx54xnGc458+GIBRbvprVtttuta6ej2cOXPGM4znGOXLEAorfTWrbbbbrXT0erjy54znOM5xy5ZgClb3q6tW26u99/Vx5YxnOc5xjnzwAUXW9XS22261vt6eXPGM5znOcc+eQBS61q222rda329HLnjOc5znOccoAFNbtttW23W+3fljGc5zM5zjnIFBWtW21at1d9e/PnnOczMzjPOAFFurbatW3WuvbnjOczMznOcQAUaulqrautdO3POc5kzM5zhFAKurVVVtuunXGMzMkzM5zAFBdVapat106YzmTMkmc5ACi2rSqtt30znMkkmZMygAq2lUq273nMkkkkmQFAtUqird6mZJEkkgAKKVSirreZJESSAACqFCrbrKRESIAFAoUKasiERAAAUBQVUQQIACgABQEAnj80RQq69HbprWrdXV1vp19v2PF5uPLnjnjHPn5/JwkFFW9+296t1bq63vr7Pq+Pz8eeOeMYxy4+XjICla7dd61q26t1vfX1/S8vn5c+eM4xz58fNygClvXrvWrbq3V3vp6/oebhy54xjGMc+Xn5IFFXr03q6tt1da309Xu8/DnzxnGMYxx4YkKFL06b1bq2261vp6fb5+PPGMZxnHPlxxACl6b3q2226ut9PR7OHLnzzjOM4xy44AFLvpq6ttturvp39fHlzxjOc4zjlywAKXe9XVtrVutdO/q48sYxnOc4xz5ZRQKut6t0ttt1rp29PLljOM5znOOfPMFBTetXS2223W+/o5c8YznMzjPPnIChWtatttW3V329HLnnGZnOc554yAUW7tttWtXWu3bnjGczOZnGecAFGtW21atutde2Oec5mZnOc4gAKutLaq22669cYzmZmZnOcQFAt1VtKtt1064znMzJmZzmAFC6tVVVdXp0ziZkmZM5yACltWlVbb03nOZJJMyZhQAttUpVutdMTMkkkkyAKC2qKVda3nMkSSSQAClUVRbbvMkSJIkUACqKKW3UkiIkQACihQVbZEIiAAAoFAqogQIAFAAAoQBPF5oShV16O/TWtat1da3vt7fs+HzceXPnjHPnz8/k88AKuu/be9XVurrWunX2fV8fn48+eMY545cfJxgBVvbtvWtW6t1rW+3r+n5PPy588Yxjnz4+blIFFa69d61dW3V1rfX1/R8vDlz54zjHPny83OAKW9Ou9XVt1brW+vq9/m4c+eMYzjnjjw5wBS3p03q6tturrfX0+7zceeOecZxjny4YgKKu+m9W23Vurvp6fZw488YzjOMY5ccQFFXe96tttt1rXT0ezhy54xnGc458+WICirrpq6tttt1rp39fHlzxnOM5xjnyzAKK3vV1att1ddO/p5csYznOM5xz5ZAKVrerbbbbbvfb08uWM5znOcZ588gFF1rVttq3V1vt3588ZznOc5zz5wAUt1q22rbbrfXvz55znOZnOMYkoBTWrbatq3W+vbnjOc5zM5znGQKFXVttVbbd9O2MYzMzMznOIAoNXS1Vq3WunXGM5kzMzOcwAUXVWqW23W+uM5zJMyZzlFAKttVSrbrfTGZmSSTOZAChbaVSrdb3nMzJJJJkAUFq0Uta1vMzEkkkgACqpRVW61MyJEkkFSgFUoUtupJERIgAFFChS2xEREAABQWFFVECJQAAAAKCAJ4vNkBVa9PfprWtXV1db6dvd9nw+Xjy588c8c+Xn8fDICq13773q6urq63vt7PrePzcefPHPGOfPz+XjkBVa7dt61q3V1db319n0/J5+XLGMY545cfLygClvbrvWrq26utdOvr+j5eHHHPGMYxy4+fkgUVevXetW3VurvfT1+/zcOfPGMYxjnx4c4AVb06b1dW23Wtb6er3ebjz54xnGMc+XDEAUt303dW3Vt1rfT0+3z8eeMYzjGMcuOIApXTe9W223V1vp6PZw488ZxnGcY5ccwBSt9NXVtttut9O/r48ueMZzjOMc+WACi73q6tq261rfo9PHnzzjOc4zjnyyAKXW9W222261vv6ePPGM5znOcc+eQBS61q221bq6329HPnjGc5znOMc5CgU1rVttW23W+3fnzxnOczOcYxkKBWtW22qurd9e/PnnOczOc5zzgChbq22qtt1rr254znMzM5znEAKGrbatWrrXTrjOJmZkznOAAUuqtVVtuunTOMzMmZM5zAoC21apVt1vpnOZmSSZzIAULbVKqrre85kmYmZMgBQtVVKtut5kkkkkkigAtUpSrdakykiSSCxUoKpRRbdSRIiRAAClFCltiIiIAACgFCqhBEoCCgAAUCATw+bICrb6fR01u6urrWt9O3u+14PNw5c+eOfPny8/j88gKq30d971q3V1rWunb2/W8fm4c+fPGOfPn5/LwkFFW9+29a1dW61rXTr7PqeTzcuWOeMY58+Hl5SApbevbetXVurrWt9vX9LycOPPHPOOeOfDz8oApb1671dXVt1rW+vr+h5eHLnjGMYxz4+fnAKVenXerq23V1rfX1e7z8OWMYxjGOfLhzgFKvTpvVurbbrW+vp9vn48+eM4xnnjlwwhQVd9N3Vtt1brfT0+zhx54xjOcYxy44QoKu97urbbbrWuno9fDlzxnGc4zz58coUFXXTV1ba1brXTv6uPLGM4znOMc+WYKCrrerdLbbda6d/Tx5884znOc458pAUU1vVttttt107ejlzxnGczGcY55AoVrWrbatt1rfX0csYxmZznOMYyAUW7ttq2tXWu3bnjGczOczGMQAoa1bbVq26117Y55zmZmc5ziABS6ttWrWrrr1xjOcyZmc5xBQFW6Wqq23XTrjEzmSZmc5gFAuqq0tW66dMZzJmSZmcgBRbVpVW276ZzmSSZkmQAUW0qlW3e85kkkkkkKAFqlKVbreZJJEkkBSUFpQUt1rMiREiAAFKFFLakRCQAACgUFVEECAAoAAUAgJ4fLICluvT6Om9aurq63rp3932/B5eHLnz5458+Pn8fmiKFXXo773rV1dXWt9O3t+v4vNw58+eOeOfLz+ThAFLrt26butW6utb329n1fH5+PLnjHPHPnw8vGJQpb269Na1bq3WtdOvs+l5OHHnzxjGOfPh5uSApWunbetW6t1da6dfX9Dy8OXPGMYxz58fPzgBVvTrvV1bdW6106er6Hm4cueMYzjnz5efEAUt6dN3Wrbbq7309Pu8/HljGMZxjny4YgClu+m7q23Vutb6en2cOPPnjOM4xz58MwBS3e93Vttt1rfT0evhy54xnGcZ58+OYBRbrpq6tttt1vp39XHljGM4znGOfLMAore9W3S23V3vv6uPLGM5zjOcc+WQFFa3q22223Wt9/Ry54xnOc5xjHPIBRda1bbatutb7ejlzxnOc5znGOcAFLdattq2263178+ec5znMzjGIAFNattq2rdb69ueMZmczOc55osoFXVttVbbd9O3PGczMzM5ziAoFt0tpVtu+nTGc5mZMzOcwAoXVWqqrq9OmcTMmZJnOQAUtq0qrbd9M5zJJJmTMUAUtqlKtu95zJJJJJkFlAtUpSrdbzJJEkkgCgKpQpbrWZESJEAAKUUKW6kiIiAAAoFAtIQQQACgALFBAE8PkkBS3Xq9HTetXV1rWt9O/u+54PJx48+fPnz58vN4vPkBVa9HfpvWrq61d66d/b9jw+bjy5Y5458+Xn8nCQFLb37dNa1q3WrrfTt7Pq+Pz8eXPHPHPnz4eTlkClt7demtat1dXW99vZ9Pyefjz54xzxz58PNygClvXr01q6tutXe+3r+j5fPy588Yxjnz4+flAKVevXW7q3Vuta319X0PNw5c8YxjHPny8/NBRS9Outaurbq61vr6fd5+PLnjGcYxz5cOaKCq6dN3Vt1bda309Pt4ceWMYzjGOfPhgApW+m7q226t1vp6PZw5c+ecZxnHPnxwAUre93Vttt1d9PR6uPLnjGc4zjHPjkAUu96urVt1da6d/Vx5YxjOc4zjnyyAKXW9W22226107enlyxjOc5zjGOeQBS61q222rq6329HPnjGc5znOMc4lAU1rVttW23W+3fnzxnOczOcYxkUBWtW21a01d9e/PnnOczOc5xiAUKurbaq22769cYxM5mZnOcQBQattqrVutdOuMZzJmZmc4ACi6q1S2ta31xnOZMyTOcgAVbaqlW3W+mMzMkkzJmFAC2qqlW3e8zMkkkkyAsoVaUpVu9TMkiSSQAUFUopV1qSSJEiAAFUUFLdSRERCUABQUBaQgiUAAAACgQD//xAAaAQEBAQEBAQEAAAAAAAAAAAAAAQIDBAUG/9oACAEDEAAAAP018nDnjOc5znGefHjEAEV9P6Xbe7q23Uvl488YznMzjPPlxgSkspfofQ7b1q6tupfNx54znOc5znny5JYAFvt9/XprV1bdS+fjzxnOZnOc45c4AAt9ft69NaurbpfPxxjOc5mc5xyxAAKvq9nXetatuqvDjjGczMznOOeEAKGvR6+u9at1bo48uec5zMzOcYxABQ139XTe7q3Vq8eWMZmZmZznnmAFlGu3p6b1q6tul48sZzmTMznOMACyi9vR03rVt1avLljMzMyZznGQAWVevo6a1q23VXlzxnMzJmZznIACr17dNa1bbdHPnjMzJJmZxAAC3p23rV1bbV5YxMySZkznIFlAvTrvWrqtWryxnMmZJJnMAApd9d3Vt0upeeM5kkkkmYAAVvpvVtttq885zJJJJMwCxQXXTWrbbbTGJmSJJJIAAprpq6W22y4zmSSJIyIoAXWtatW1TOcxJESSBUChrWratWy5zmIiJIAAFurbVq2JmSIhIhQigXVqqtRJIREIAALLpapVzZIghABAKVVUVEQEEAAAqighAAAAAAFH6d5OHPGM5znOM8+HGSwAS36f0+3TWrbq08vDnjOJnOcZ58eKAANe/wCj26a1q26p5uPPGM5znOc8+XKAAGvb7+296urbo8/HnjOc5znOefLmgBYrXr9vbe9XVt0vn488ZzmZznOOXMSkoLfV7OvTWrq3VXhxxjOczOc5xz5gAFvp9fXe7q6ttvDjjGczMznOOeAAFX0errvWrq26XhyxnOczMznGMAAFvf09d61bq21x5885mZmZznGAAFXt6Ou9XVt1V488ZzmZkznOMgAFvX0dN6urbdLx54zmTMmc5zmKigLenfpu6t1bV5c85zmSTOc5yCooL17b3dW26q8uec5kkmZnEAFil6demrq221eeMZkmZJM5gABbvrvV1bbavPGJlmSSZmSygCt9N6urbbTGM5kkkkmYAFC66bura0q4xmZSSSSQABTXTWrbatMZzJIkkZlQoAuta1batsuM5iSJEkBYCjWtW2rVM5kkRIkJQALdW21VsucyQkJEFIFC6tWqqXMiIhEAABbbVKsSQiCEoQBSqqlIhBAgAAKUUEEAAAgCgFD9Q8nDnzzjOc5xnnw4RAAL9T6nbe9XVt1Hl4c8YznOc4zz48EAAa+h9Lt01rVurTzcOeM4zmYzjHHkgAFvu9/bpu61bqr5uHPGc5znOc8+XIBKC32e7tvWtat1V83LnjOMzOc4xz5wACter2dt71dW6q+flzxnOZnOc45YQAoa9Pr69Na1bq6OHLnnOJmZznHPAipQW+j1dd71bq3S8OWMZzM5mc455RUoC3v6eu9a1bq2uPLGcTMzM5zzyiwUFvb09N61dW3S8eWM5zMyZznGALFC3r6Om9atura5c8YmZmZmc4yALKL179N61bbqry54zmZkzMzGQAWVenfprV1bbV588ZmZJM5mIAAq9OvTWrdW2ryxiZkzJJnObLKAK6dd61bbbo54zmZZkkzMgWKC76b1q222rzxnMkkkkzAAFXXTd1bbbTGMyZSSSZAAFa6a1bbaq4xMyRJIzALFBbvdttq0xmSSRImQACmtattq2xnMkiJEhFABbq22rVlzmSIRIgpAUXVq1VsTMREIgAALdKqqiSEIRBSAUNKUpCIQCAAAqihchAACAAUKB+qePhyxjOcZzjHPhwggAX6v1O/TWrq3Vl8nDnzxnOc5xjHDjCWAFv0fpd971q3V1L5eHPGM5znOMY48SVAKa930O3TWtat1V8vHnjGc5znOMcuSAArXs93bprWrq6q+bjzxnOc5znGOXMBKC31+3r01rWrdVfPxxjGczOc558+YABb6vZ13vV1bqtefjjGc5zM5zjnzAAVr0ertvWtXVul4cueM5mczOcc8AAU139XXetXVuqvHlzznMzmZzjGAAKXv6em93V1bpePLGMzMzM5zjAAFL29HTetatuqvHnjOczMmc5xkABV6+jprWrdW6XjzxnMmZmZznIABb079Na1bdWry55xMyTMznMipQC3p16a1q226XlzznMkmZM5yAUC9Ou9aurbavPnnMkzJJnMAApd9d6t1a1V54xMySSTMgABW+m9W222rzziSSSSTMWFAF101q2220xiZkSSSSAAoa6atttaLjEkkSSMgACta1bbVtlziSJEiSWKJQGtXVWqpnMkQiRAAKLq2qq2JmRCIQAAF0tVVRJCEIgAFBbVKXJCEBAAAVSguQQACAAUKA/V3xcOXPOM5xnGOfDzwIAL9b6vfprWrdWnk4csYxnOc4xz48IEsqWVr6P0+3TetW6upfLw5YxnOc5xjny4wABb7/od+mtaurqr5ePLGc4znOcY48gRUoa9vu773rV1dVfNx54xnOc5zjHLnAAK16/b26a1q6uqvn488ZznOc5xjnzQAUa9Xs69Na1q6trhx54znMznOccsCWWUFvp9fXe9XV1dLw4885znMznOOeAAC30errvd1dW6XjxxjOZnMznHPIABb39PXetat1bbw5YznOZmZznnkAAt7ejrvWrq3VXjz55zmZkznOMkoAW9fR03q6t1bXLnjEzMzMznGRZUoLenfpvV1bbpeXPGczMmZnOcgCgvXtvd1dW2rz54zMyTMmcQACl6dd7urbdVeWMTMmZJM5gACrvrvV1bbavPGc5kkkmZmkoArfTerq220xjOZJJJJmAFAuumtXVq2rzzmZiSRmQACjXTVttttlxnMkiSSQSgBWta1Vtqmc5kRIkkFEKDWtW1atjMzEhEiAAqVdW1aqxMpEJCAAAultKqJEQiEAAULaVS5IgQQAACqUKyBAAQFAAKH614vPyxjGc4zjHPh5kIAF+v9bv01rV1bqPJ5+fPGc4znGOfDggADX0vp9+m9aurdS+Thz55xnOc4xz48UAAuvf8AR7dN61dXVXy8OeMZxM4zjny5QABde339um9aurqr5uHPGM5znOcY5chLLLKLfZ7e3TetXV1V8/HljOc5znOMcuYACter2dumtaurqtefjzxjMznOcY58wAKa9Pr69N3Wrq6Xz8ueM5zM5zjPPEAWUNej1demtat1dLw5c84mc5mc454AKC3v6eu96urdVePLGM5mczOcYwBYoW9vR13rWrdXS8eWMZmZmZznGABZS3r6Om9aurdVePPGc5mZM5zjIAKL179N61bdXS8eeM5mZMzOc5ABRenfe9XVt1V5c8ZmZJMzOIAAq9OvTWrq22rz55zmSZkmc5soSgt313rVturV5YzmTMkkzMligC76b1q222rzxnMkkkkzABUpddNa1bbbZcYzMspJJIAAprpq6ttWmM5kkiSSSooAXWtatq22M5zEkRJIFQKGtatq2rLnOYiIkgAFSrq21VqXMyiIhACUBdVaVbmzKIQiAACltKpckQEQAABVKKZEAAAAACg/XXw+flzxnGc4xjn5/PIIAL9j63o6a1rVurL4/PyxjGc4zjHPhwiAAt+n9Tv03rV1dU8nDljGcZznGOfHjBBZZTX0Po9+m9aurrUvl4c+eM5znGcc+PIiwFGvb9Dv03q61dVfNw5885xnOc458ucAArXr9/bprd1q6q+fhzxjOc5znGOXNLAsot9Xt7dN61dXVa83HnjOc5znOMc+YJQFvq9fbe9a1bq2+fjzzjOZnOcZ5YAAVr0ertverq6ul4ccYznOZnOcc8AAU139PXprWrq3S8eOMZzM5mc4xgABWu3p6dNaurq23hyxnOczMznPPIAFL29HTe7q6t0vHljOczMmc5xkABV69+uta1bdVeXLOMyZmZnOcgAKvTv01rV1bdLy5ZznMkmc5zJSUAt6demtatt1V5c85zJMyTOcgqKFdOu9aurbavPnnMkzJJnMAFBd9N61bdNWXnjMzJJJJmAAKb6burbbavPGZJJJJMgACtdNattttlxiZkiSSSBSUC3etW2rbLjOYkiRJAAUNa1batWXOZJESJAABV1batW5uZJCQiAEoC6q1VXNmUIhEBYAKtqlVmyIIEAAAWqFMhAABAAoKB+weHz8ueMZxnGefLh5pAQBfs/X79dburq6jx+flzxnGcZxjn5+EJYAXX0/qd+u9aurrUvj4cueM5xnOMc+HGAALfo/R9HTetXWrqXy8OWMYznOM458eUAAXXt+j26b3dautS+bhyxjOcZznHPlyIsLKLfZ7+3TetautVfNx5YzjOc5zjHHmAArXq93bprWtaurXn488YznOc5xjliABS30+zt03rV1daXz8eeMZmc5zjHPEFhQW+n1dumta1dXS8OPPGc5zM5xnnhKSgLfR6uu96urq6Xhy55xM5zM5xzyAAW9/T13rWrq6q8eXPOc5mczOMZlikoLe3o671q6urpePLGMzMzM5zjFiygFvXv13rVurdLx54znMzMzOcZBUoLenfpvV1bdVeXPGczMmZnOcgFBXXr03dXVt0c+eMzMkzJnEAChenXe7q23VXljEzJmSTOYABS7663dW22rzxiZkkkmZAACt9N6tummpeec5kkkkmYsKALrprVtttpjEzJEkkkCoKFu9attq0ziSSJImQAVKa1q22rbGcySIiSAACrq22qtjMkiIREKABdWqqrEkiEIgAApbVUrNkIQIAABVKKZBAAIAAooD9i8Pn4455xjOMY5efzSAEDX2fsd+ut6urdS+Lz8cYxjOcYxy4eeASga+p9Xv03vV1q6l8fDlzxjOcZxjlx4IABdfQ+n36b3q61dL5PPz54zjOc4xz48UABWvd9Hv03rWtXWl8vn5884znOM458ecAAXXs9/fpvWtauqvm48sYzjOc5xz5cyAsot9fu7dN61q61WvNw54zjOc5zjHLmAAXXp9vbprd1q6tvn4c8ZznOc5xjnzAApr0ezr03rV1daXz8eecZzM5zjPLAAKW+j1demta1dXS8OOMZznMznOOeAAot7+nrvetXVul48cYzmZzM5xjAAoW9vR13rWtW6rXDljOc5mZnOMZAKlLevo6b1rVurpePLGc5mZM5zjIAoNdO/TetW6t0vLljOZMzMznOQBZRenfe9XVt1V5c85zmSZkziAAUvTrverdW3UvPnnOZJmSZzAAFXfXetW23VOeM5kmZJMzKpQBW+m9XVttq88ZzJJJJMwCgF101q3S21eeczMSSSSAsChre7bbbbLjEkkSSMgAWK1rVttW2XGZIiRJJQAC3VttWrEzJEIkIKAC6tWqqJJEIhAACi2qpUSIEIAAAqlFMgQAEAFAFB+zeDz8eeMYzjGefLz+WIEsBr7X2PR13rV1dazfF5uXPGM4zjGOXDzIABb9X6vo6b3rV1dS+Pz8ueM4zjOMcuHGBLFBr6P0/R03vV1q6XyeflzzjGc5xjnw4gJQW+/wCj3671rWrrS+ThyxjGc5xnHPjyIAot9v0O3XetautW3y8OWMZznGc458uQACtev3d+m9a1datvm4c+ecZznOcY5c0Asot9Xt7dN61rV1WvNx54xnOc5zjHLBFlAXXo9nbprWtaurb5+PPGMzOc5xjngABWu/r69N61dXWl4ceeM5zmZzjPPAAFNd/T16a1rV1dLw5c84mc5mc455AAprt6Ou961dW6Xjy55znMzM5xjIAFNdfR03u61bqrx5885mcyZznGQAFXr36b1rVurpePPGJmZmZnOIAAq9O+961bq3S8ueM5zJMzOcyUAFXfbprV1bdVeXPOcyTMkznNlABbvrvWrdW2rz55zJmSSZmSxQBd9N61bbbqXnjOZJJJJmACguumtatttsuMZmWUkkkACpTW926W22XGcySRJJAABWtatttqy4zJIiJIRQAW6uqtVZc5kiISIFQUF1atVblJIRCIAAKaVVVcpECEAAAVVFGQgAAEoAFA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oBVCwAgCCKAFlKAAQBAACxQoAEAEABYoFAAgASwBQAFAQAAhQAAAAAAAAAAAfPerdBIzOfPVUUKTz9dCIjU9OqESSc8aqiihy61CJFnfVIRJnGdKUKUx0qESSzrqhEkmM6VQopnoERInXQESZzKpRRSbpERE6WkIkmZVFClTdIhIm9CCRnMtUUKWbqEJE3QhEmZaKFFNgiImqEEkkpRQpWqQhE0sEJGZaFClXQISFpBESSlChS6AhEtIISQoUFK0qBEUIIiSigoW2iCEoQQkKBQVbQQgCCEigoFLaCCAIQgKAUW0CCWBBCCgFFWgQECBEUAKKqggIECAAoFUpLAQJYIAUAqgAIEsCCgApQAECWAAAFKABASwAABQKAgEogABQAAAigAAAAAPnPXuhEkzzxpShQnDrQiJuejdEJJnGNKUoU5dKIiSzvtYIkzjNqiilmd0RElz21RCSTGbVKKKz0CIkTroERM5zaoopU3UIklm9VBEkxLVCiqm6hERN2kIkmZVKKKNgiIm6EJEzKooUpsIRE1QhEmSqCil1UERGlgiJJKpQKW2iERNUgiJkqgUVdARCWiERJKoKFVoBEKEISQoUFLaqBCUIIiSigoq1SBAEEJCgUFWqQIAQREoKBS1RAQCCECgFKpUAgECIKAUVQAQBBCUFSgqgAQCBAWUAVQAIAgQoAFKACAEAAAsoUAgAiwABUUAAABFgqCoUAAAARSAUAAB85690QkmefPVUUKTju1CJNz07oiJM8820UUWY3SEiWd9UIkk551SiijO6REks7aoiJM4lqiilZ3SIiJ10CJJMS1QopZsIiROmgREzmVSlCrN1CJDPS1BEkzKpQUpsERE1oQSSZKoUUrVEJEaoQiTMtFCirqoIkTVCESSUoUUrVEIiaBBIyUUKKugQhLUEIklKCil0sCIlpCESCigpbVQISiCESUUFC20QIlCEIgoFCraCEAQgkUCgVbQQIECEBQBS1QgQECEKACqosAQIEEoAUVQAEEBAAFCqABAgEACgVQAIJYBFlAAooBAIAAABQAWAQAAABQACAAAAAUAPmvX0oiJMc8W0ooWctUIibnp2qEjM541SiijG6REk1O+qESTOM20oopndIiSWdtKhEmcZ0qhSibpESSzpqiIkmM6Uooo2ERInTQIkZznSiilG7CEkTpahESYlqlClNhCSJvQ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BjHfb1a3dVVVV1pr0el7PLx82OOeWWeOPJ5/IkADGOuvo1u6qqdXWmu/o+ty8nPjllnnlljzcPNIADGOujo0u6qnVVd679/q8vLz5ZZ555ZZc3FgkAMGOt99LqqqnVXem/d6fNy4ZZ5Rnnljz8mKQAwY6220uqp06qr127vR5ubHLLOM888uflxQADBt67aXTqnTqr027e/DmxyzjOM88sOXNAADBvXXSqqm6p1em3X34c+OeecZxnljzZoABgytNbqqdN1VVpr19uGGWecZxGeePPmIGAMb00uqdN06qr26uzHDLPOIiM88ueAAAYN3pdU6bbqqvXp68scs4iIiM8sIAAGDHelVTbdN1V69HVljnERETnnnjKABgMdaVTptt06vTo6css4iJiYzzylADAGOrtt0U23V6b9GeWcTEzERnkkAwAY6t02223Tu994yiImZmIzzSBgAwbum22223Wm2+ecRMzMzEZoTAAGFVTbbG26d7bRnEzMzMzESDAAGFU22xtjp3rrOczMypmYhAwABg6bbGxtt3prETKlSpmYQwAAYNttjGNt1ppMSpSlKZlAwAAY2xsGMbdXpMzKSSlSkDAAAY2xgwY3VXKlJJJJSDTAAAbGDBgxuqSSSQkkgBpgAAxgMBg26SSEISEAwAAAGADABjYkCBCaAAABgAAADAAAEAAeXxSgBgyq7urW7uqd1V6a9Hpetjxc+GOWeWWWHJ53LKAGDbrq6dbuqqqqrvXo9H1MOPnxyyzyzyx5eDmSAYDbfT0aaVVVTq6006PQ9LDk58sss888sebi50AAMbfRvpdVVVTq7137vS5+XDLLPPPPLLm5MEAAMbe2+l1VOqdXem/d348uOOeeeeeeXPyZJAwGDrXbSrp06qqvTbt7sebHLPOM888sOXJAAwG3rrpVVTp1VXe3Z25c+OWcZxnnljzZoTAGDeut1VOm6qq026+zHDLLOIjPPPHmhAAMGPTW6p06bqq016+rLHLKIjOIyy54EDAGM00uqbpunVaadXVnhnnnEREZ5YQAADBu7uqbbp06vXp6c8c84iJjOMsYAAGA3WlU6bbdOr06ejPLPOYiYjPPGQABgMu6p0223TvTo3jLOImJic88pAAYAy6ttttt1Vab7RnnEzEzEZ5yADAGFXTbbbbdVe28Z5zMTMzEZyAMAGFVTbbG26q9doiIm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um084UpJJJJIAAABgVdum222iJlJISSSAAAAaGVVNttticSkhIQkgAAAABum22NjlykkIEgQAAAAAOmNjGORJCAQIAAAQwAGMYwGSIAEAAAgAAABgDAAP0E8zkwyzziIzzzx5OJIBAAAV9B9D07aXVVVVJ5/JjlnnERGeePLyoTQAADr2fc6dtLq6qqT4OXHLPOIiIzx5udAAJgA69X2OrXS7qqqh8PNhnnERERnjhziAAABl+l63TrpdXVVQ+LmxzziImM4y58QQADTB16Hp9Oul3VVVFcfNjnnExERGWOIgAAYDru9Lo10uqqqsfJz45xERMRGeGQAAADHXb39GulXVVVFcnPlnETExEZ45gAAADK7O7fW7q6qqHzc+WcTExMRnlmAAAMB11du+mlVVVVj5sMs5iZiYnPKE0NMABldPZtrdVVVVFc2GcREzMzGecAAAAMb6OvbS6qqqqK58M4iZmZiYzgAAAYDfR07Xd1TqqHhjnETMqZiIgABpgA3v0a6XVU6qh4YxESplTMRAA0wAGPbfXSqqnVMrDLOZmVKmYiWmAAAMeu+l3Tp1THjnnMypUqZiWAAAAx6baXVU3ToeWUTKlKVMygAAABjva7p06bpPPOJUpSkplAAAADHel26bpuk885lSkklKQAAAAwvS6bpttpxEykkkkpAAAABhV26bbbacRKSQkkkmAAAADqqdDbbcuYSSEJCQJgAAAN022xscuUkhCBCTAAAAAdMbGMciSEAgQAAIAGADYxgwhoAAQAIGAgAGAAwAD9CPM5MMsoziM4yx5OFIAQAAV9B9F1baXVVVVL87kwyzjOIjPLHm5EACAAZfs+51baXdVVUnwcuGWcREZxllzcwgAAAHXrez07aXdVVWnw8uOWcRERGWXPggATAAden63TtpdXVVRXDzY5RnExGcZc+KAAAAZfoep066XdVVWq4+bHKIiInOMsMQAAABl93pdG13dVVWPk5ssoiJiIjLHIBAwAGV2+jvtd3VVVFcnPlnnExMRGeOQAAAMHXZ3dGt3VVVWPlwyziImYiM8swAAABt9fbvrd1VVVFc3PlERMxMRGWYAAAwHXT2b6XdVVVRXNhlETEzMTnnCAaYADK6OvbS7qqqqHz45REzMzExnAAAADG9+rbS6qqp2PnxziYmVMxEQAAAMBvfo2u6qqdUVhjnEzMypmM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PRrpV1Tqru9ej0eyeXDDLLPLPHHm4eeQABjddG+t3VU6q6006PQ655ufHLPPLPLHm4sZAAYx1tvrdVVU6q7137+qebDLLPPPLPHn48UAAwbe2+lXVOqdXem/d0zz4ZZ55555Zc/LkgABjb12u7dU6p3em3b0zz45Z55xnllhzZCAGDG9ddKqqdOqq727Oicccs84zjPLDnzQAAxj100qqdN1VVpt17zjllnEZxnljzwgAYMbvW6p03Tqq016t5xyzjOIjPPHCBDAGDd6XVN03Tqr26dljlnERERlljAAAMG7u6ptum6q9enacsoiIiIzyygAGAMdaVTptt06vTo2nLOImImM88UgGADHV1Tbptt1em+s55xMTMRGeSQMAGDq6bbbbdO730WcREzMTGeaAABgOqpttsdN1ptpMREzMzE5wgAAYDdU22Ntt1e1qImZmZmYhAAAwCqbbG2Nur1tREyplTMQAAAwCm22MbG6rS1MzKlSpmAAAYAOmNjGMdVdEzKUpSpkAAGADbGwYxlO6SlJSkkpAAAYA2MGDBjqmSkkJJJAAAMAGMGAMY6aQkhCQgAaAYADAGAMKBCECEAAAADAAAABgAAIADyvPkQwGN339e2l1dVVXem3T6fVXPzc+OWWWOOHF53HKAYMbrs6dru6qqq7016fS6Xzc+GOWWWWWHJwcsgADG66ujXSrqqqqvTXo9HqXPz4ZZZZ5ZYcvDzpADBtvo6NbuqqqqrvXo9DpXPz45ZZ55ZY83FghDAY2999bqqqqqq006O7pXPhjnlnnnljzcmKQDBjK220u6p1VVV67926wwyyzzzzzx5+XFAAwY3ttd1VU6qqvTft3WGOWUZ55544cuaAAGMrTa7qqdOqq9NuzdYY5555xnnlhzZiAYDG9NdKqnTp1V6a9myxxzzziM88sefMAAYMemt1Tp03VXe3Vsscs84jOM88cIQAwGM00uqbpunV3r1arLLOM4iIyywkQwBgy9Lp03TdO706dVlnnERERnljIAAMGXpVOm26butejRZ55zETEZ54yAAwGOrqm6bbdO9OjRZ5xExMRGeUgAwBjq3TbbbdO9NtFnETEzExnnIAwBg3dNttttu72sziYmZmJziRgADAqqbbY226va1ETMzMzMZgAADAqm22NjdO9aImFMqZmIAAAYA6bbGNjdVrSmZlSpUzAAAD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ppt1+hJrnz4Y44448/B5fFKABjbvt6ttbuqurrTTbq7wrLDDHLLHHn4/N5JEMBsquvp20urqrq7026e8VZYYZZZY44cnn80iGAxuunp10u6qqur026O5p5YY5ZZZY4cvDzyAAxlPo6NdKuqqqu9NejtaeWGWWWWWWHNxYJADGNvffW7qqqqutNejsaMscs8s8ssObkxSAYDZW2+l3VU6q6006Otoyyyyzzzyw5+TJAAwY3ttpdVVU6ur136xGeOeeeeWePPy5oAAY29ddLqqdVVVem/U0ZZZ5555544c2YhgDGPXW7qnVOqq9NulozyzzjPPPLDnhAAMY3et3Tp06qrvbpBZ55xnGeeWOECYAMG71uqdN06qtNehozzziIzjLLCAABgx3pdOm6bqqvXoBRnERGcZ5YygGAMHd3TptunVXrs0RnERMZxllIAAMGXdU3Tbbqr02aU5xMTEZ55IABgMKuqbbbbqq02BRMTExOcZyAMAYFXTbbbbdVerRExMzMRGaGAAMG6pttjbbq9QUzMzMzE5gAAMBum2xtjbq9AUzKmVMTAADQwG222MbG6q2iVMpTKmABgAAymMYxsbqwJUpJSpSGAAAMbYMYMbqgSSSSSSTAAAAbGDBgNtgJCSEhAAAAMBgAwBjYCEIQgAAAAYAAADAAAAQAeN5soAYx1fpdm+ml1dXdaa7dfdK1XPhjjjjhz8HlcUoAGNu+3r21u6uqu7126u5K558Mcsccefj83kgABjbrr6ttLuququ9dertFUc+OWOWWGHJ53NIADG3XT066XdVV1d6a9PaJxhjllljjhy8HOkAwY3XR0a6XVVVXV6a9PYJ5445Z5ZY4c3DggABjdb763dVVVdXpr0dYnnjllnlllhzceKAAGNvffS7qqqqq7136xPPHPLPLPLHm5MkJgDG3ttpdW6qqqtNN+sRnllnnnnljz8uQgYDGVptpdVVOqqr126hEZZZ555544c2aAAYxvTa7qnVOqq9NukFGeUZ5555Yc+YAAMY9NbunTqnVXpr0iIyzjOM88scIQAMGN3pd06bp1V3tuCnKM4jOMscYAABg3el06dN06rTXcRGcRERnnlhIADAY7u6dNum6q9dmiIziYjOMsUhpgMB1pVOm226q9NgUxETERnnkgAAYMq6pttt06rTYRMRMTE5xkgAGAwq6bbbbbqtNGi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mZmJjOAAGmADrfffS6uqdWq58c4iZmVMREDAAAGFbb7Xd06qqHhlnEwplTMRIAAAMG9dtruqdU6HjlnMzMqVMxIAAMAG9ddNKqnTqk8somZUqVMzIDTAAGPTTS6qnTdJ5ZxKlKUlMyDAAAGO9LunTdNp5xEpKUkpSAAAAYOtKqnTbdS4iZSSSSSQAAADAurdNttuXEykkJJCQAAAxMKqm22NuXClCQISEAAAAwHTbGxjkUiECBCAAAAGAxsYMZAIAQAAAgAAABjAAGfpx5HFzY5Z55555ZYcXnJAgABM3+h9j2erXS6q6uH5XHz45Z5555544cnHICAABm3uet6nTrpdXV0n5vHz45555xnlljycqBAAAx6+x6npdGul3VXarzuPDHPPOM888sebmQIAGAPX1fS9Ho00u6urHwcnPlnnnEZ55483OIAAAY9PT9Hv310urq7Hw8mGWecRnGeePPgAgBgDNPR9Dt6NNLq6um+LlwyzziIjPPLnxAAAAG77+/s300urq6b4+XHLPOImM88sMgQMAAbvu7evfS7uqunXHy455xEREZ54ZoAAYAzTs7OrbTS6q6srk5sc84iYiIyxzAAABg76+vq10u6uqsrk58s84mJiIzxgAAABjrq6una7uqq6K5cMYzmJiYjPKAAAYAO+jq6NburqqsfNhlnEzEzERnAAAADHXR0b63dVV1Q+fDPOYmZmJjKQAAaYDrfffS7qqqqK58c85iZUzERAA0wAGVtvtpdVVU7VYY5xMzMqYmJAAAAYVrttd1VOqpVhlETMqZUxMgAAMAb1100qqp06HjlEzKlSpmZAABgA3pppdVTp1SeWcTMpKUphAAwAAbvS7p06bpPKIlJKUlKlgAAAMdXdum26aecTKSSSSkAAAAGF1bptttoiZSSQkKQAAABgVVNttscuZlCEISEAAADAHTbGxskSSECBCAAAAAYNsYwZAIABACAAAABgAwAGfp78fi5scss8888sufi85IEAAmHT9B6/sd2ml1dXUPy+Lmxyzzzzzzxw5OJIAQAMN/c9X1OvXS6urua8zj58cs884zyyw5eQQAhgA9vY9P0urXS7q6sfncfPllnnGcZZY8vMgAAAGber6XodOul3V1ZXn8eGWWcZxnnljzYIATTAB6+n6HodGt6VdXY+HkwxzziM4zzx58EAAADHp6Pf3dGt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mp03SIkznnnVVSlV16VnEiSSzpsIkkzzzq0qlLd9KmEiSWb1SIkzOctqlKW73bmRJETegiSTOJbVFKre7ZIkSXO6ESMzEtpRSrrdshEkudWwSJM5lqlKVdatRESJqkIkkzLSlFVrVpCREtEREzJVKKVbq0QiJQhEkyqhRS6toQiFgiJJClCitW0EIlIQiSSqFFLbaBEBCESRRQoW20BCCEESChQpbVAhBBCJFCgotqgIQggiCgKFtKBCECEJQUBVUogQgQQFACqUAIQIEUABVKAQQCAABYpQAEAIsFgpCgoBAAAAAAADwzr1oSSZxx460qlUr2drOfh5yJvp1nTpoSJmY4892qUqr6Oupz8+IkutzpvRETMxyxq1VKqu/TUzwkklupvdESTOeeNWqpSr161nlJJF1ne6REmc883SqUquvSpzkSFmthEkmeedVVKVb03bnMkRLNapESZziW0qird7tmYkRc60IiSZxLaUpVb3bJESE1QiRmYlqqKVd6tSIkJdEJEmcy1SilutaIiIS0REkmZaUUqtatIRCKIiJmSqUUq6tohEFQiJJkqlCl1bQhCKhESMy0oUVq2ghAQhIklUUKW20CCBCIkhSgottoCECEIkFBQq2qBBBCESKCgpbVAQgghECgUVVUEEEEIigoCqpUsCCCCAsoClKAEECBKAFCigIEAgACgKAAQAlgoABQAgAAAAAAB5F60JJM44cd20qlNezrqc/H50demtTXTRETMxx56tqlUt9PTTHm5xNaupreiJGZjljVqqUq9+tZ44kl01LuhJJnPLOrVKVV7dKnLMktWXdIiTOeeNW0pVW9OlucZiKS7WIkkzzzqqpSrem7ZiSAl1SJEznGdVVKVbvekzEgS6CJJM4ltKUqumtGYiCWhEjMxLVUUq71okRBGiEiTOZapRS3WrUIgikIkkzLSilVrWhCEShCRMyVSilXVtCEIsERJMlUUVWraCEJUIiSSWlCi220CCCEIkkqihS22gIQIhEkKUKKttAIQQhEgoKKW1QEEIQiJRQKVaoBCEEIgoKCrVAQQggiUKAVVUCCEECCgBSqACEBAAAUUoBAgEAAFBQspAgAQUAAUAQAAAAAAA88nTQSSZxw47tVSlb9nTTn5vHL26aupOmiImc548t21SlW+nrWeHCN6tsbtRIznPLnrVUpVa79Kzy5Jq1Y3Q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3emu3XtCdnPjjjjz8/D5nFKAYMdV2de2t3dXV3ppv1bQnSwxxyxw5+LzuSQAGMqurq200q6urrTTfp2lFTjjjljjz8fBzSgYDG76OnbS7qqurvTbq2hFTjjlljjz8vDzyAAxt1v063d1VXV3pr07Shzjlllljz83FhIAwY29+jW7q6qqq9NenWUOcssssscebjxkAYMbe2+t3VVVVV6a9GsoJyyzyzxx5uXFADBjK121uqqqqqu9d9UgnLLPPLLHDlyQAMGN67aXVVTqqu9N9ZETnnnlnllhy5gADBt6a6XVOqdVV67aygnPPPPPPHHmgQMBg3prd06dU6q9NtEgnPPOM88seeAAGDGaaXdOm6dVd7aJBOecRnnnjhIAAMG70unTpunVaa6JCWcRGcZZYyADAYO7unTbpuqvW0ImIiYzzzxSYADBl3VN0226q9LQiZiJiM885AAYDC6qm223TqtLQiZiZiIjOQYADBu6bbbZTd3QgmZmYmIhAADAG6ptsbbbq6EChTMzEwgAYAMdNtjY23VUIFMqZUTKGAAMBttsYxtuqQClKVMqQAAGANsbBg2ymAhKUklIAwAAGxgwYMbYCEkJIQAAAAMGAwBjGCBAkIAAAAAYAAMAAAAEAR43lykMGN1fqd3Rrel3V3pprv2OE72wwxwww5PO8rghAMG277+zfW9Ku6vS9d+vTMLrDHHDHDl4fN4oAAY277OvbW7u6utL136tIRTxxxxxw5uLz+NIAYNu+rq200q6uru9durSUN4444448/HwcsgAMbddPTtpd1V1daabdOkoZjlljjjz8vDzJAMGN10dG13dVdVd6bdOkoayxyyyx5+Xj50JgMY636Nburqqq7016NJAWWWWWWWHLyYIABjHW2+ml1VVVXWmvRpKAyyyzyxx5uXFAAMY3ttrdVVVVVemnRpKBZZ55Z5Yc/NiAAMG3rtpdVVOqq713tIFlnnnlnjhzZIBgMY9ddLqqdOqu9N7STnPPPPPPHHnzQAwGN6a3dU6dOrrTbSRCzzjPPPLHDMAAYMeml3Tp06dXpraELOM4zzzxxhAMAY3elW6dN06u9bSBZxEZxlllAADAY7u6dNum6rTS0gURERnnnlADAGA60qm6bbdVelpAoiJiM885AAYAyrqm223TqtKECiYmIiM5AGADCrpttttuquhCImZmIiJYAAwG6ptsbbbq6QImZmZiYQAAwBum2xsbbqqQImVMzMygYAAwbobGMbbqkCJSlSpkAABgDbGMYxttgISlJJSAAwABsYMGDG2CBJCSQAAAADBgMBgxoAQgSAAAAAGAAADAAABAGXleRKEwY3V+r3dGul3d1pemvR1kIvfLDDHDk4+HzPOgQwG29O/s310u6u7vTXfrcJ1pjjhjjzcnF53DKAGDbvs7Ntbu7q7vTXbrcoqssMscOfm4/P45QDBjqurr200urq6vTTfqqAdY45Y48/NycPLKAYMbvp6dtLurqru9deqpQ3ljlljhzcvFzSAAxt10dG13d1VXWmm3RcoHlllljhhy8fPIAMG3W++ul3VVVXem3RSQGeWWWWGHNyYJAMGNvffTS6qqqrvTXopJMyyzyyxw5+XBADBjb2200q6dVV1prvciDPLPLPHHn5sUAMGMrXbS6qqp1daab3KAzyzzzxy5+fJAAwY3rrpdVTqqqr03pIFGeeeWeOPPkAAMGVe13TqnVVV6bUkCjPPPPPLHDNAMBg3et3Tp06qq02pIFGcZ555ZY5gAMGDvWrdOm6qqvakhEZxEZ5Z4wAADButLp026dO71YhERERnnnlAAMBg60qm6bbp1erQIiJiIzzzlMABgyrqm223Tq7pAiJiYiIzkAGAMKt022226q6QImJmYiIkGADAKqm2xttutGgRMzMzEwgAGADdNtsY23VtCCZUzMqEDAABjbbYxjbdMEEpSplSAAAwBtjYwY22wQJJSkkgAGmAMbBgwY2xAJCSQgAAAAYMBgDGMQAkITQAAAADAAGAAAAAgMPN8eEADG609Xu320u7u7vXXo64hOt5www5OTl4vO8yUADG6vv7d9dLu6u70236iEVpGGOHPy8vJ5/nygBjHV9nZtrelXdXemu/USh3GGOPPzc3Jw8MgAMbd9XXtppdXV3d67dTgC88cccOfm5eLjkTAY266erbS7q6ur0026XKHWeOOWGHPy8fIkAwY3XR066aVdVV3em3S5QVnjllhhhzcnKgAGMdb9Gul3VVV1ppr0VKB55ZZY48/Py8yAAYx1t0aaXVVVXV6a9DSAjLLLLDHn5udAAMY61300q6qndXevQ0kPPPLPHLDDnwQADGN67a3VVVVVXeu1SIIzzyyyxwwwAABjb020uqp1VVV67VIgjPPPLLLHDFAMBj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Oax48Mcs4zzjPLHnwAAAAZXV19XT1dW2l1Q5rLk58ss4jOM8sufEAAAGN9PV09PT07Xd0NPLlwxzjOIzjPHDIAAAYN9HT09HR066VbdS8+XDLOM4iIzyxyAAAGDe/Tv0b9Ot3VNy8+bHLOIiIjPPHMAAAGFbdG++++t3VNzWfNjnnERMRGWWYDTAAY9t9t9t9auqbms+fHOIiYmIzygAAGAN67bbbbaXVtuazwyziJiZiIykAAAYD1121120q6bacYZRETMzExnAAwABj010111u6ptpxjlETMyomIkAABgD000001uqptpxlnETKmVMRIDAAAZeml6aXVOhpxlETKlSpmEAAAwB1d3pduqbcOc4mVKUqVCAaYAAOrq7unTbJcxEpKUkpSAAAAYVVVVum2yRRKSSSSSQAAAwB1Tqm22yGplISEhJNDAAABt0222DgJQhCBCAAAAAGxtjGDzAQCAAQAAAAAMGAMD6M8+Dkwxxzyyyxx5vP8qRAIAA19z0+/u7/U9G6zmTN58HLhjlllnllhzcPAkAgAGX6/o93b3el23akUPPh5cMcs88sssefi45AQAAy/T9Dt7e30OvShBLy4ubDHLPPLPLHn5ORCAAAZfod/b2dnd1aWAS8+Lmwyyzzzzyxw5OZAmgYA67+3s6+zt6dLBkvPj5scss88888cOXnEAAMB129vX1dfZ0aWxkuOPnxyyjPPPPLDmwQAAAwrs7Orq6uvo0ptk1nyc+OeeecZ55Y82KAABgOurr6unp6ui7bYnHJhjnnnGcZ5Zc+KaBgAMrp6uno6ere7bblxy4ZZRnEZxllhkJgAAMro6enfp6N7ttuajlxxziIziM8sM0AwABlb9O+/R0bXbbacc2OWcRERGeeOQAMABj36N9t+ja6bbTnmxzziImIzzyzAABgDe2+22++t1Tblzz5Z5xMRMRnlAAADAK1222131q225qefLOImJmIjKAGAAMHrtrrrtpdNtzU4ZRETMzExlIADTAG9NdNdddKpttOcc85mJUxMRIAAAwHppppprd023LnLOJhTKmJiQAGAAy9NL00uqbblrLOJUypUzCAAABg6u70u6bbctZRMqUpUqEADEwAdXV1dumNyKIlJSklKlgAAAMqqqrptscNQpSSSSSQAADAB1TqqY2OGplCSEhJAMBMABt022xjgJQhCBCAAAA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01oZASQRJJMc86q0pVvTetCAiSBEkznnnVqqVV3vVtkAiQhJJM85bVUpbvd0sICSCJEznEtqqUt1u21BBIhCSTOJpVKVW9W1YEIhESMzEtqilXWrasCCQiIkzmW0opWtW1UCEgiJJMy1Sil1baqBCIRESZlpRSmrbSwIQiESSSqKKW21QEEQiImVKKFW2qAgiEQkhRQotqqCBEIRElUFCrVUICEQRIoKBaqlQBEEIQKApVKAIIIIigUClKAgQIICygFKKQBAQIoACigAgBAAKgoFAQAEWFAAAAKzzCJM558OG7bSqXfs671ZOdoJMBIzM8+PLdtVVLr09dasmKWEmQkZmccee7aqlXXfprVZzQJMiJJM45Y1bVUq669NaqZLBJlYiSZxyzq1VVVvXetVICEyIkkznnm6WlKt6dLqpAImaiJJnPPOrVUpb03dUgQkgiSSZ5y2qpVXe7pUCEZERJnOJbVUpbvVtqAhIREkmcS2qUqt6ttEEJCIkZmJpVKUutW2hBEgiJJnMtpSlXVtqiCIhESSZlqlFLq21RBCIRIkzLVFFW22qIIRCIkklUoUttqqgQiEREyqgoq21VQIRBESQooUq1aAQiCIiSqCiqqqCBCEIkUKClVSiBBBCIKBQqlAEECCJQUCilAQICCCgChRRAIBAAAoFAEWABAUAAKAgAAAAAABqTGREmc8/Pw6W1VKvX19darOSiJiCRmZ58eW7aqlXfp6a1UyAkzBIzM448921Squ+3TdqZURJkRJJnHLnu2qpV123u1IBEyREkzjlnVqqqm+nTVpIBJkJJJnPPGraqlXXTerSBCSERJM5551aqlVre9WkBCZESSTPPOrVUqr01qqgISQRJM5xLaqlLd61VEEJCIkkziW1SlW61dKEESEJEzMTSqUpd220IISERJM5ltKKW6ttoQQiIiSTMtUoqtW2qIIRCIkmZaUoq221RBCEREkkqlFKttVUCEIhImVKUKaWqAQRCIkhShRatUBAiEQklUKFVaUEBEIRIooCqqlEAiCEQoBRVUACEEIAUBSlAICBBBQApRQECAQABYoUAAQBABQAUAQAAAAAAA3JjAiTOefn4b1VpSvR6um7UyLCTORIzM8+HLerVKq9fRvdqZoQmciRmZxx561VVVXp23u1IAkzBJJM45c921Squ+29WkCEkiEkmccsbtVVLddd6tICIzBImZjnjVtVSrrpvVpAIkiIkmc886tUql101q0EESQiRmZ551aqlVretWgQSQiJJnOJbVUpda1qqBCJERJJnEtqqUt3dVQIRIRImZiW1SlNauloEIkIiSZzLaUpV1dLQIREIkjOZbRSltttoEIiERJMy1RRVulqhBCIhJJJaUKVqrVCCEQiJJKoUVbVVSBCIREkKUKLaqrAQRCESCigq1SgIIgiIlFBRVVQQEQQiFBQUqlQBCBCAUBRSgEBAQhQCgooCBAEAFACgACACKAABQCAAAAAAAG0xzETMxjz8N6WqVXr9HTVpkBJnAiZmefDlvVVVVe3fpq0yqCTOREzM4489aqqqr17b1aQIRnIkkmcccbtWlVenXerSAhMwiSTOOWNaqqpbvpvVogIkyJEzMcs6tqqVd9NatAhEkIkkznnnVqlVW961aBBJIREzM886tVSq1vWrQEIkREkznEtqqVWt3VoCESISSTOJbVUpdauqoEIkIiSZxNKpSrdatUCERERJJiW0pStXVWgQhERImcy1VFLbqrQIQiIiSZlqilLq1VCCEQkSSS0oottWqEEIRESSVRQq2qqkCEIiJIpQoW1VWAghEIkKFBVqlAQIhCJKUClVSggIQhEKCgqlKgBCCEBZQFUoAEECEKAKKKAQCAgAUBQVLAAgEUAAUAAQAAAAFAD//EABkBAAMBAQEAAAAAAAAAAAAAAAABAgMEBf/aAAgBAhAAAADn4fH5kADZT09fv3200u7u9NNujfKUO9+Tk5ubn5uXi8vBAMG29PQ7ejXS7u7vTTXo3iAL05uXmw5+bm4/NyQAxjq+3s310u7q700133iROr5ubDnw5+bk8/IABjbvr69tdLuru70126IkTdc/Phhhz8/Jw5gAMbd9PVtrd3V1d6a7bzKCnhz4Y4Yc/Lx5oGDGVXR1a6aVdXV3eu2ylA3hhjhjjz83JmADGN1v066XdVdXWmm2ykQzHDHHHHDn5JQMBjdb766XV1VVd6bbKRDMccccscMOWRDBg3WvRppV1VVV3prspEBljljllhhzyhgDG3ttppVVVVV1prqJIDLHLPLHLDnkGAMbeu13dVVOrq9dSRAZZZZ5ZZY4SAwGMeuulXTqnVXemokIMss888sssEAMBjemt1bqnTq700EhBlnnnnnnligAGMHppdVVN06q9NBIQZ55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K222223/AINtttttt/ikknwtttttT29PT02222M0aNnMPHTp06dOnTp06dOn5/n/AJlxmDBgwcbw7bbbU9vT0aGMYxmjRs5RqSdes69evXr169eBcZgwYMHG8O22227enoYxjGM0aNnKNSSSSSSScK4zBgwYfG8u22227enoYxjGMZo0chJJJJJJJOJcZgwYMGHl22223b0aGMYxjGaNHISSSSSSSTjWDBkwYMPLttttu3o0MYxjGM0aNkkkkkkkk41gyZMmTDy7bbbbt6GMYxjGMZo2SSSSSSSTCwZMmTJh5dtttt2aGMYxjGMZo2SSSSSSSTCwZMmTJh5dtttt09DGMYxjGM0bJJJJJJJJgyZMmTJl5dtttt09DGMYxjGM0aJJJISSSTCyZMmTJlp22223T0MYxjGMYzRokkkkkkkmVkyZMmTLTttttumxjGMYxjGM15kJIQhJkyZEZMmWnbbbbdNjGMYxjGMZr3hPM8ZMmRCMmRO22226bGMYxjGMYzXrCes8ZEIQhGRO22226bGMYxjGMYx/Ce6EIQhCE7bbba2xjGMYxjGMftPaeEIQhCEJ22221tjGMYxjGMY/4EIQhCEJ22221ttjH6MYxj95PdCEIQhCdttttbYx+7GP1nyQhCEIQnbbbbW238WP4yeqEIQhCE7bbba2/m/5UITttttrd/hn2tttttrdv/Atttttt+kk/httttttpfhJ/LbbbbU9vT09NtttjNGjZzjx06dOnTp06dOnT8/z/P8AzrjMGDBg43h2222p7eno0MYxjNGjZzDU6zr169evXr169evCuMwYMGDjeXbbbant6NDGMYxmjRs5RqSSSSSSThXGYMGDBh5dtttqe3o0MYxjGM0bOQkkkkkkknEsGDBgwYeXbbaW7ejQxjGMYzRo5CSSSSSSScawYMmTBh5dtttt29GhjGMYxmjRyEkkkkkkk41gyZMmTDy7bbbbt6NDGMYxjNGjZJJJJJJJMLBkyZMmHl22223b0MYxjGMZo0bJJJJJJJJhZMmTJky8u22227ehjGMYxjGaNkkkkkkkkwsmTJkyZeXbbbbdGhjGMYxjGaNEkkkkkkkwZMmTJkyJ22223T0MYxjGMYzRokJJJJJCZMmTJkyZE7bbbbpsYxjGMYxjNE8QhJJJJkyZEZMmRO22226bGMYxjGMYzXpCEkJ4mTIhCMmRO22226bbGMYxjGMZr1hCE8zIhCEIyJ22223TYxjGMYxjGP1nyQhCEIQnbbbbdNjGMYxjGMY/hPdCEIQhCdttttbYxjGMYxjGPxPhPRCEIQhCdttttbbYxj9GMY/lPVCEIQhCdttttbbYx+zGP3nwQhCEIQnbbbbW238WP4TzPKEIQhCE7bbba23fgx/Keq8IQhCLbbbbW/5pPii22221u35SfyW22222/wAck+dpbbbbbf7rbbbbU9vT09NtttvRo0bOceOnTp06dOnT8+n5/n+a4+BcZgwYMHG8u2221Pb09PQxjGM0aNnMNdZ169evXr169evVZ4VxmDBgwYeXbbS27eno0MYxjNGjZyjUkkkkkkS4lgwYMGDDy7bbbbt6NDGMYxmjRs5CSSSSSSScawYMmDBh5dtttLt6NDGMYxjNGjkJJJJJJJJxrBkyZMGHl222luno0MYxjGM0aOQkkkkkkknGsGTJkyYMu22226ejQxjGMYzRo2SSSSSSSTBkyZMmTBl22223T0aGMYxjGM0bJJJJJJJJgyZMmTJky7bbbbp6GMYxjGMZo2SSSSSSSTBkyZMmTJl22223T0MYxjGMYzRokkkkkkkmTJkyZMmRO22226ehjGMYxjGaNEkkkkkkkyZMmTJkyJ22223TYxjGMYxjGa8QkkkkJDJkyZEZMidtttt02MYxjGMYxmvSEIQkJkQhCEZE7bbbbptsYxjGMYxmvSE8SeuRCEIRkTttttumxjGMYxjGMfxnshCEIQhO2222ttsYxjGMYxj9YTxPVCEIQhCdttttbYxjGMYxjGPzCfJCEIQhCdttttbbYx+GMYxjH856IQhCEITttttrbH7sYx/KeqEIQhCE7bbba22x/BjJ4ntPRCEIQhCLbbba238n/KhFttttrd+c8z3nxpbbbbbfrJP4LbbbbbfrJP4bS22223++22220b29PTbbbb0aNGznHjp06dOnTp06fn+f5/njHCuMwYMGDjeXbbSl09PT0MYxmjRo2cw11nXr169evXr169c54lgwYMGDDy7bbbbp6ejQxjGM0aNnKNSSSSSSTK4lgwYMGDDy7baW3T09DGMYxmjRs5SSSSSSSRLjWDBkyYMPLtttpdPT0MYxjGM0aOQkkkkkkkS4zBkyZMmHl220tunp6GMYxjGaNHISSSSSSSJYMGTJkyYM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qvfru6toghJMyJJnOOPPdtqqrt03dWqQQkmYiZmcccbttKq9d71bVEIRmSJJM45Z1bVUt6b1q2qQQiZiJM5zzxrS1SrvetWrSCESSJJM5551aqlXe7q1aQQiSJIzM85baVS71dWqsCESREkznEttKpda1atWBCJESSTOJpaUq6urVoCERIiSZxNLSitatqqCCIiJJJhVUpV1atUIIRESJnKqUpbbVVSBCISJJktFFW2qqoEEIiRMy1RRatVQCCEREklooVaqlAgQhEiSqFC1SlEBBCIkKUCqoqoBAhCIUCilFAEBBCAKBShQEAQQhQBRQVAAIEACgWUAABLASgALFACKgVAAAKioAdUk54iSZxz83n6aq1S9PZ13u20IIkmMxJM4x5+PS21VXfo671baEERnOUkmc8+HPeqtVWu/TerbQgiJnMSTOccee7bVK126a1bVEERM5RJnOOON21VVrrvWraoghJmJJJnHLG7aqlvTetW1RBCSSRJmY5Z1papV6buraoghJJEkmc886tVVNb1q2qqCCSRIkznnLbSqretW1VQQSREkkzzltqlLu6tqrAgiSJEznE0tUVdatq0CBEiRJM5zpVUq6ttVQQIkRJJMKqlK1baqhARIiJM5VVFLbbVUQEIiJJMqpRTVVVVAIRERJkqii2qqgCCIiJIUoUtVVAIEQiJJVCiqqlAQIRCSKKClUqggEIREKFBSlAAQQhAUApRQCAIIRQBQoUBAECAWKAUAAAgAAAFAAAgAAABQA6yM55RJM45+bz9LbVVe/r6b1baBCJM80kmcY8/Heraqr19HTWrbQIRJnCSTOefDnvVWqrp26a1baBCJM5SSZzjjz3bVVXTrvWrbQIRJMxJM5xxxu2qqt9d3VtoIIkmUkkzjljdtVS66b1baoQRJJEkzMcs60tUrXTWrbVCCIzEkkznnnVqqpretW2qEIRMokmc85bapVu9W2rRBCJIkkmecttUprWrbVUghEiRJnOJqqVS7ttqqgQiREkmc51VKVdW2rVgQREiSSZlqlFtttVQIIiJEkzKqil1VqqCCEREkmVUoq21VKQEIRIkyVRRbaVVQEEIiSQpRSrSqAQIRESS0KFqlKBAQhESUoKVRSiAIIhIUKCqKAAgQhBQFFCgCAIISgUFAoCABBBQAoCwAAEAAFAAAAAQUAAAB1iTPKSSZxz83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ZiEAwY7u6qm6dOgECBTMqVKmZzABgy7um6bdOgQIBTKlKUpmAAYMq6pttumwBAClSkklMymAwCrdNtttsBACFKSSSSkAAYOqbbG2NoAQCSSQkkkwABtttjGxgCABJCQhJADABtjGMYwBAAkIQCEAAwBjBgMAAABCAAEAAAAwAAYAAACADDLHDl8zzWDbda+76fVvtpppppprWMSkgRjjlnnlnllhzedxjGOq09T0unbbTTS9NNLzhJIQssss8s888sOfg5RjG609Hv6dtdNL0vTTTOUkhCyyyzzzjLPHm4ucGNur7u7o210vS700uZlCELLLPPPOM8sufjwBjbd9nb0baaXel3pcykhAsss4zzjPPLn5cGA26rr7N9dNLu70u1KSECyzzziM4zyw5cWDG3fT1766Xd3d6XMiQgWWecREZ554c2TBjbrp6ttb0q7u7tShIBZ5REREZ548+QwbKrfp200u6uru0khAjPOIiIiM8cMwYxutunXTSrq6u7SSEIM84iYic4ywzGDG62310u6q6urSEgQoiIiZiIyxgBjHWu+ml1dVVXQkIEKIiYmYmMsoBg2PXfS7qqqqukIQgURMTMzE55QMGMeuul1dOqqqEIECiYmZmZiM4YDGPTW7qqp1VUIQgFMTMypmIzlgMG71uqqnTqmCBAKYUzKlROcsBgy9Lqqbp06ECARMzKlKZmEAMGXdunTbp0gECCZUpKUomWAwHV1TbbdNgIBBKlJJKVCYAwKt02222xACAlJJJEqUMAGOqbbG2wAEAJJJCSSQMAG222MbGAgAEkJCEJADAG2MYxjEAACQhAIQAAMGMGAwAAAEIABAAAADAAAYAAAIAMM8cebz/HTG261970+rfbTTTTTTUxhJIQssc8s8888sebi81MbbrT1fR6tttNNL001eUpJCFlllnnnGWePPxcIDZVX6PodO2umml6aaOJlCELLLPPPOM8sufk4hg2607u7o210vS9L1cSkIQsss4zjPPPLDk5Bg26vs7ejbTS9LvTRzKSECyzzziM4zyw5uUGNlX19fRrppd3pejlJIQLPLOIiM888ebmBjHVdXXvrpd3d3pUyJCBZ55xERGeePPzgxjqujq31vS6u7upSEIFnnERERGeOGAMY3XR07aaXdXdaNJCECzziJiIjPPDAYNlPfp100q6urukkhAjOIiJmI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UABQAgAAAAAAB1IkxxkznHLzebpq1Vvt9HTWratVBBEmeUmc55efjvVtqvT33rVtWrBAiTPOSZxz4ct6tqr37b1batAgRJnEkzjHDnvVqq7dd6ttVQgIkmJJnPPjjWrVq9OutW2qoQIRnMmZnnyxrVqq673bbVUICIzmSZzjlnWqqr03q21aogIRnKZmcc86tqq3vV0q0qAQiZkkzjnLpapvd1VVVgCETMTMxjOrVVda1aqqAIIkkkznEtqqutW1VUAgRJJJM4ltpTWraqqAgIkiSZxNKqmrbVUoEBEiSSYVVKuqqqUEBCJEmcqqi21VKUgBERJJlVKLbSlKQBCIiTKlFWqUUAQCREkKULVKKAICERIKKVRQoCAQhElKCqKChABCEigoUUFgAECEFAUFAABAIACgKABCiAQoAAoAEAAAAAKAOhEmeOZnOOXl83TWlq79/berbaqkEIjPLMznPLz8Omrat16uu9W21VQIRGeeZM458OW9WrWvR11q21aqCCEzjMmc8+HPeqtW9+m7batWBBCZxJM558ca1atXt01qrVUECImJJnPPljWrVW9d61VqqCCCTOZJnHHOtVat6b1bVVQgQiZkmc55Z1baW9NatqlogIJMySZxzmrVVd7ttVSkCBJJJmYxnVqqu9W2lVUCBEkkmc4ltql3dLSqAQEkiZmcS21S61apVAIESJJM4mlpV1bVKUCAhJJJMKqqatqlKEAQkiTOVVSrpVFKIBBIkkyqlLaqiiwBAiRJlVFLaUKAJUERJIVQtVQUAQCEiQootKBQEAIiIKCqUCggAQiJRQUoCwAAgiFAooAAAECAoCgAAACAACgAAAAQCgAAAdBEzy5zOccvL5umrbV9Ht6buqtVUCCJOWJM45efh01bVvX09datWqqBBEnPOZnHPz8umrVrp6OmtWrVWBAiTGczOefDnu6qrvvvdtWlAgRJjMmc8+PPerVrfberaqqCAiTOZM558sa1ata7a1bVVQgESZmZM45Y1qrV103baqqEAiSZkznPLOrbVa6attVSkARGcszOeedWqrW9aqqpUAQjMkmc886tqmt6tVVLACEZkkmecttVbrVqqoAEIkkmc4mqqmtW1VKAIESSSZzLVUutKqlAICJImZmWqVdVaUoAgRIkkzLVFttUooJYCIkTMlVRbaoooQBERJJKpS1VFFIAISIm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BgIAAAQAACAAABgAAwAQMEABlEZ548vl+ONuq2+g9Xr6NtdNdNJxmUJAhZ5xETE5xnjzeb5w23evren1dGuuummhlMoQgSjOIiYmIyy5/O4hjqtPT9Hp3200000ecyJCAWecTEzERnlz8HIMdVfod/VtrrpemjzSSEIFnETEzExnlhw8rG3V93d0ba63pejhJIQIURExMzERlhx8w2U77O3o210vS7qEkgQIziYmZmYjLHk5mNuq6+zfbTS70tykhCAUREzMzM5548uAxt309e+ut3d3UpIQIFETMzKmIzy5cRjbrp6ttdLu7tpJAgQpiZmVMzGeXPiDbdb9O+ml3V20kIQCImZmVMzOefPixjdb9G2l3dXbSQgQCmJUqZUxGeGQxtvbo10u6uqqRAgQKZlSpUzMZ45gxt7ba6XV1VNCBAIJhSlKUzOeOYxjeu2t3VVVNCAQCJlSkpSmIygGDem2l1VVVMQgQAlMpJJSonKAYx6a3dVVOmgQAgJlJJJKZnOBgx3rdVTp00AgBBKSSSJUzEMGDu7qqbptACABJJJISUrOWAx1dunTbaABACSQkJClQgBhV1TbbbQACAEkhCEkpQAwqqbbY2gABAISECEkkAMHTbY2MQAACEIQCESAANtjYMYIAABCBAAhAAA2MGAwQAAAIAAEAAADAAAAAAAAAymM88ubg8CW3VbfQet19G2uummmWUpIQIWcRETExGeXPweQDdVr6/p9XRrrrpppGcpCQIUZxMTMTGeXPxeYm2619L0erfbTXS9JiUhCBGcRMTMxGeeHH5ybbrT0O/q21100vRRKEIQKIiJmZic88OTgBt1p29/RtrrpelqZQhAhRExMzMxGePJxA26vs7ejbXS9L0UyJAgRERMzMzMZ48vImN1fV2dG2ml6XZMiECBREzMqZiIx5uUGU76evfXW7vS1IkIBCmJmZUzMRlzcwNlV09W2ul6XViSEIBETMzKmZmMufnBjddHTtrpd3ViSECAUxKmUpmYyw5xjbrfo20u7urEkCBApmZUpTMxGGANjrbo10u6uqaSBAIJhSlKUzEY4gxt6766XV1VNIQIAUypSlJTEZYgxt67aaXVVVAhAIBKZSSUqZjPFgxvTbS6unVAgQAglSkkkpmM8wYN6a3dVVOgQCABKUkkklM55gwbvW6qqdMBAIASSSSEpUxmDGOtLqqbpgIAEAkkkJJKYgYMLu3TptgCAAEkhIQkpmGAwq6pttsABAAJJCEIUqQAZVU22xgACABIQgQhSgAY6bbGwAABACEIBAkgAGUxsYAAAACECaAQgAAbGDAYgAAAEAACAAABgAwQ0AAAABnExnlz8Xgc7bqtvofW6+jbXXTS+eFIhCBZxExMzEZ54cfjZDdVr6/qdXRtrpppeUJJCBCiIiZmYnPPDk8nNtu9PT9Hq321000vOEkIQIziYmZmYjLHl8yBt3foeh077aaaaXnKSECBRETMzMxGeXL50MdVfd3dO2uul6XEpCECFExMzMzMZ5c3nyxur7e3o210vS7mUhAgRETMypmJzy5+GRt1XX2dG2ml6XcyhCBAomZmVMzEZc/HLG6rq699db0u6UoQIEETMzKlRMZYcksbd9HVvrppd3SkQhACmJUylMzGeHLLG3XR07a6Xd1akQgECmZUylKic8eVDY636dtLu7q0kgQCCZmUpSmYjHnQxutujXS7q6oSEAgFMqUlKUxGXOmMda766XV1VCQIBATMpJKVMxnghjb1200uqqqEIEAIlSkkkpmM8Uwbem2l1dOqEIBACUpJJJKYjEBjd7XdVVOhAgEASkkkhSpzyBg3emlVVOmIBAAJJJISSUxmhgy9LqqbpiABABKQkJClRCGDLu3TptggAEAkhIQklMAAyrqm22wEAACQkIQJKZABlVTbbGAAgAEhCAQkpABjptsbAABNACECAQkgAB0xsYAAAACBAIAQgABsYMAAAAAEAACAAAAYADABAAAABnMRGeHJ4fnNuq2+h9bs6NtdddFhCSEIBZxMTMzMRnhy+PyMp1r7Hp9fRtrppqZQkIQgUREzMzMRnly+VzDdVp6fpdW+2ummjzhIQIERETMzMzGeXN5nOx1Wnoeh077aaaaOJkQgQKImZlTMRGXN52I26vu7+nbbTS9KzSSBAgiJmZUzMRlz+fkNur7O7o2100vRwkhAgREzMypmZjLDgyY3V9fZ0baaaXdQkgQIFMSplSpiM8OLMY6vp7N9db0u6hIQIBETKmUpmYzx48xtuunq3100u7coQgQCmZlSlKic8eSBsqt+rbXS7u3KECAQQplKUpmc8uWBjdb9O2l3d1UiECAFMyklKUxGXNDG2999tLurqkkCAQEypSSUzMZ88DG3tvrpdXVUkgEAIlSkkkpmM8JBjeu+ml1VVSQgBAJSkkklKiMJGMrTbS6uqdJAgAQSkkkkkojGWDZptd1VVTQgBACSSSQkpWeSBjNNNKqqdNCABAEpCQkkpnJDBl6XVU3TQCAAQkkIQkpnNDBl3bp02xAAgASSEIQpWaYDKuqbbbEAACBCQhAklCYDKp022MBAAAhCEAhJSADHTbY2AAIABAgQCESAAymNgwAATEAIAQAhAADYwYAAAAAIAAEAAAAwABgAgAAADOZnPPLl8jxG3V7fQ+t2dG22mumWUJAhAiIiZmZmYzy5vL8ttu9fY9Pr6NtdNdIzlJAgQoiZmVMxEZc/meex1Wvp+l1b7a6aaTEpCEAiImZlTMxGXP53C23Wno+h077aaaaKJSBAgUTMzKmZnPPn4OMbdad3f07baaaWRKECBBEwplSpiM8OHkY3V9vb07a6aXopkQgQCmJUypUzGeHFzDbquzs6NtNNLslJAgEETMpSpUTnjx8w26rq6+jXW9LslIQIAUzMpSpUxGPJzsbqunq3100u7JQhAIFMqUlKmZjHlwY266OrbXS7uyUCBAImVKSlKZjLmwY2636ddb0q7JECAQEzKSSUzM5c+I2OtujbS7uqaSAQAiVKSSSmZywyGNvbfXS6uqaQgEAJSkkkkpiMMmMb1300uqqmkAgEBKSSSSSiMcwY3rtpdXVUIQAgBJJJISUzGWYxj010uqqqEAgAQKUJISSmM82DHpppVVToEAgAEkhISEpnOAYy9LqqdMBACABJIQhJKc5GDLu3TptoEAAIQkIEhKYkYMq6ptttAAIAEhAhCFMyMBu6bbbEAAACEIECEKUADdNtjYCAAAECBAIEkAA6Y2DAAABACAQACQAA2MGAAAAAIAAAQAAAMAAAAAAAADNTE55c/nfNpur7fe9Hu6NttdL580kIQIIiZmVMzEZYef4Y276fZ7+vo2110vKJSBCAUTMzKmZmMsODyBt10er3dW+2umt5xKECBBEwplSpiM8OLyht3t6Xb077aa6XnKSBCAUxKmVKmYzw4/NG3W3odfTttpppcSkIECCJmUpUzMRjx+eNute7r6NtdNNLiUgQIBTMylKlTEY8nCDda9vT0a66aXcyhAgBESpSlKZnPLl4htvTs6d9db0u5SQgEAplSlKUqIy5uMbb06ujfXTS7uUhAgBEypSUpTMZ83INt31b7a6Xd3KQIEAKVKSSUqYz5+UbHp0b663pV2pEAgEEqUkklMznhzDG73310u7qhIQCAEpSSSSUznhgDHe+uul1dUJAIAQSkkkKUojHAY3W2uml1VUIQAgBJJJISUzGWIMda66XV1VJAIABClCSEkpjPEYOtdLuqqqQgBAAkkJIQlM5ZMGVppV1VOhCAAQCSQhCSU55gMq7uqp0xACAAQkJCEJTGYMHpVVTpsEACaAQkIEJJRAwHdVTbbABAAAkIQIElMDAdU6bbAAAQACEIBAlMsAbptsbBAAAAhAgBAkgAbbGwYAIAAAECAAQgAGxgwAAAABAAAAIEwAYAAAAAAAAH/8QAGgEBAAMBAQEAAAAAAAAAAAAAAAECAwQFBv/aAAgBAxAAAAD3iU3jDHDDn5uLyvCpECB1ez29O++u2u2+1gmCU2rjjhhhzcfmeVWIAbep19O+2uu2u+0yAlNq4Y448/Pyeb51YBEtPR6+jbbXXXbbaUiJJm1MccccOfk8/giADTv6t9tdtNddtpJIkmZrjjljhz8vBxQQCb9vTvtrrprrrtJJCUrVxxyxx5+bh5IQCV+vp220100112kShKVqZY5ZY4c3FywAL9XRtrrpppprrYSglM1yyyyxw5+PmgBK3T0a66aaaaaazImCUzXLLLLLHn5OeAJLdG+ummml9NdJSTAmZrllnlljz83OAStvtrppfS+mmkpESSmueWeeWOHNiAJnfbTS976X00kkhKU1zzzzyyx5sQkFttdL3ve+l9JJIJTNc88888sufIAlO2ml72ve99JEoJJjPOmeeeWGQJCddNLXva173mRMCU1pTOmeeeGZIC2ml7Wva17XlIiRKKUpSmeeOcgJTpe17Wta17SkQkTFKUrSmeVACU3va1rWta1pSIEprWla0pTKoEib2tabWm1rSEwEorWtaVpnUCRNrWm02mbWkJqkTFa1ila0qBIm02mZm0zaQQSIisVitaQCQWm0zKZtKQgExEViIrWAJiSZmZTMzIkqkERERERAATMpSlMgQAQhEQABKUiUgQAIEAACQEge2lMzbDHDDn5uLyfCpECB6XrdfRvtrrtrtvIlCUrThjhjz83H5flVhAHZ6XXvvrrrrtttJJCUrMcMcefn4/N86qAHV39W+22umuu20iUEptGOWGOHPyedw1QA6e3q221101111sEwSmWOOWOHPy8HFEAG/b0bbaa6aa662EoJTLHLHHHn5uHjgAbdm+2uummmmusyJglMxlljljhzcXIgEmvV0a66aaaaaazImCUzGWWWWOHNycoAa9O+ummml9NdJkAlLLLLLLDn5OcANejbXTS+l9NNJSAlLLLPLLHn5cAA06NddL3vpfTSUiJJTGeeWeWOHNjAkGm22l73vfS+kpEJJmM8888ssOfEBJfbXS97Xve+kkkJJM88888scMSQF9tL3ve173vJJBJLPOmeeeOGYBK2ul72va173kSgkmKUzpnnljmEgvpe9r2ta17yJQJTFKUpTPLLNIBbS97Wta1rXkSgJKUpWmdMs5ASnS9pta1ptdIQkTFaVrSlMqgEpva1rTNrWsSIEita0rWmdQJiU3m1pm0zaxIgSK1rWta0qBMSm1pmZm0zYkQElaxWK1pAExJa0zMpmbBKqQRFYiK1gAktKZlMzISqkERERERAAlMpSlMgQAQhEQACUiUkgQAIIAACQASe0Smb5YYYc/NxeT4NIggT7Xo9XRtrrrrrttYAlM2xxxw5+bi8zyawgE+l39W+2umuuu2syATMzljhjz8/H5vmxEAT39vTvrrrpprtrMgEzM5Y44Yc/J53BEEBPb2dG+umummuusyASsyyxxw5+Tg4ogBPX177a66aaaa6zIBKZyyxxx5+Xh5IgBPV1b666aaaaaaykBKZyyxyx5+bi5YAHT0766aaaX010mQiSUzlllljhzcfNACXR0ba6X00vpppKQEpnLLLLLDn5OeAJN+jXXS976X00lIiSUs88ssseflwgCTfbbS973vpfSUiJJSzzyzyxw5sACW22t9L2ve+l5SATLPPPPLLDnxAE6663ve173veUiEkpzzzzzyx58gJGuul72va173kkglJTOmeeeOGSQE6aaXte1rXteUiEiVKZ0zzyxzASaaXte1rWte0pEEkqUpSmeWWYSC+l7Wta1rWtJJAkmlK0pnnlQkCbXva02tNrWkSgJK1pWlM86SAla9rTabTabSJQEla1rStM6gErWtNpm0zaZEoBKta1rWtKgEptaZmZm0zIISCKxWK1pABKZtMzKZmZBASRFYiK1gATMymZTMpBAJREREREABMylKUyBABCERAAJSJSSBVIEBAAASBIg9lJM3phjz8/LxeT4NIggb+33dO+2uumuuu0iUEpm+eGOHPzcXl+TWCA09Xt6N9dddNNddpJISTNs8ccOfm5PM82IQDT0ezo210100111kkhJM2zxxww5uTzuCIAX7+ro210000011kkhJM2zxxxw5+Tg4YECbd3TvrrpppppprKREkpnPLHHHn5eHjgIkt2dO2ummml9NdJJIkTM55ZY48/NxciAF+ro2100vpfTTSUiJJTOeWWWGPNx8oAt09Guul730vppKREiZnPLLLLDn5OYAW6dtdb3ve+l9JSIkTKmeWWWPPy84At0baaaWve99LykAlNM88sscOXEAW2200ve173veUiJEppnnnllhzYgkTttpe9r2va95SISSmmeeeeWPPkATOuul7Wva173SAJTSmeeeeOGQJE66Xve1rWte0yEJJTSlM888scpAJ10va1rWta10hCRKtKUpnljQCSb6XtNrWm1rpCEiVaVpTPPKgSE3va1rTabWskISE1rStKZ50JAm9rWm02mbWJECSa1rWlaZ0kAm15tMzNptKQgSIrWta1zrIBNrTZZMzaUhASRWKxWtIAEzaZmVkzMggEoisRWKwAJmZlKZlKQgAiIiIiAAmZTJKUggAhEIgAEpEpEggAgIAAAkJA9cSm8Y4c/Py8Xk+BSIIHoex2dG+umummuutgBKbRjhhz8vH5Xk1ggOv1OvfbXXTTTTXWwAlNowxw5+bj83zawQHT6PVvtrppppprrITBJNq444Yc3J53nwgDfv6tttNNNNL66yEwSlauOOOHNy+fxRADbu6Ntdb6aX001kSglK1ccccefl4ONADbs6NddNL6X000kShJK1ccscefm4eWADXr3200ve+l9NJJISStXHLLDHm4uaADXq220ve976X0kkhJKa55Y448/HzwCTTp2000te976XlIiRKa55ZZYYcmEAkv0baaXva973vKQCU1zzyyxw5cAJL7663va9r2vokASmueeeWOPNiATbfW972va173SAJTXPPPPLHnxEgvtpe97Wta17pAEprTPPPLLDIBK2ul72ta1rWvIASmtKZ555YZiQW1ve1rWtab2kJgJTWlKZ0yxzkBM6aWtabWm1rSEwEkUrSmeeVAJJ0va02m0za0hMAlFaVpTPOgkE6WtNpm0zaZEoBKK1rSudKEgTe1pmZmbTYJQCUVrWta51kAm1ptMymZsJIAmKxWK1pWQCbTMzKZmZBMATEViKxWABMzMpTKZJEAEREREQAJlKZJSkRNUgQiEQACUkiQCEgIEAACQAD1kkrWxww5uXi8jwKRBA9v0uvfbXTTTTTXWSSEkrTjhhz8vH5Xk0QQPT9Hp3110000001lIhJMzOGOHPzcfmebWAHf39O2ummml9NdJSIklMsccMObk83gqQDt7ujbXTS+l9NNZAEpljjjhzcvn8MQA6+3fbTTS+l766SEwJTLHHLDn5eDjhAJ6evfbTS976X00kSgkmWOWOGHNw8iAHT1b66Xve99L6SSQSTLLHLDDm4+UAdHTtrfS9r3vpeSSEiZZZY4483JzADfp11ve9r3ve8pEJJSyyyyw5+XnAG++2l7Xva173lIBKWWeWWPPzYADbfW972va173kAJSyzzyxx5sYSBrvpe97Wta17yEwEpimeWeWPPiBJptpe9rWta17SAEpimeeeWXPmATpre9rWta1rWkSgSTFKZ555YZgkaaXva02tNrWkkgSTFKUzpljmSBppa82tNptaxIgSTFaUpnnlQAm2l5taZtM2skISExWlaUzzoBJa95tMzaZtKQgkTFa1pSmdQkLXtMzMzNpmQQkCtYpWlKkgWtNpmZTMzIISBFaxWtKpAWmbJmUzMgQkCKxFYrWQCbTKUpTIEJAiIiIqAEzKSUpAQkCEIiAAkkkJJIQEhBAAAkAAeqEzN8sOfn5eLx/ApEEGvvd/TvrppppfTXWQBKZtlhhz8vF5Xk1iBDT1u7p210vppfTTWQmCSZtlhhz83H5nmVQC3p9vRrrppfS+mmkkkJJTbLDDDm5PN8+ICJt6HZvrrpe99L6aSkQklNscccObk8/hggLd/Vvrppe976aaJAEpnPHHDm5eDjgBPb1ba6Xve976aSEwJSnPHHDDl4eWAE9nTtppe9r3vfSRKCSU545YYc3HywAt1dG2l73te973kSgkmWeWOOPNyc0AlPT0a6Xva9rXveUiJCZZ5ZY48/LzwSE9G+t9LWva173SAJSzzyyx5+XGBInffS97Xta17XkAJSzzzyxw5sQJTttpe9rWta17SJQJJUzyzyw58gCdtdL2ta1rWtcSQJJUzzzyy58gkTrre9rTa02tckQkJUpnnnlhmATrpe1rWmbWtZIQkJUpTPPPHMJE6aWtabTaZtaQQkJVpSmeeWaQJvpa02mbTNpkJgElaVpTPKoBN72tMzM2mbBKASVrWlKZ1Akva02mZTNpSEAkrWta0pUSC82mZmUzMkiASRWsVrSpIFrTKZlMykEEokisRWK1kAtMylKUyBAkIiIiKgBMyklKQEEghCIgAJSJEgECQQIAAEgAHpkkzpnhhzcvD5Hz9IhA7vc7ejXXS+ml9NNJJISJm+eGHPy8XleRWIEOr1+vo110ve+l9NJkASm+eGHPzcXmeZEIDo9Pr3100ve+l9NJAEpWphhhzcfm+fEAbej1b66Xve99L6SEwSTM0wxw5uTz+GIA27+nbTTS9r3vpeUhEiZmmOGHPy8HHEAa93Rtppe9r3vfSQAlM0xxww5eHkgBr2dGul73va973kJgJTNMcsMObi5QDTr310ve17Wve8iUEiZpljjjzcfMAadW+ml7Wva173SCJEpplljjz8nOAadO2l73ta1rXvIASlTPLLHn5cAC/Trpe9rWta17SJQEpmmWeWOHNiAX310va1rWta1wTASmaZ5Z5Yc+JILb63va02tabXSEJCZpnnnljhkBK22l7WtabTa1khEhKaUzzzxxySBbXS9rTabTNrSACU0pTPPPHMCU63vabTNpm1glAJTWlKZ540EhbS9rTMzNpmxIhMSJrStKZ5UkBa97TM2TM2mQQkE1rWlKZ1AmLXtNpmZTMzIACa1rWtKVCRNrTMzMpmZEkAJitYrStRITaZmUymUpCAExFYrFapAWmZSlKUggCURERFYkAslJKSQIEkCIRAASkJSAIJBAQAAEgAPSCU3c+HNy8Pj+DlEEHt+r1766aXvfS+mkgCSbxz4c/LxeT5NIQHp+l1b66Xve99L6SJQSTNq4Yc/NxeZ5lYQHoeh1baaXve976XmQBKbVwx5+bj83z6oB2+h0baaXva9730kASTauOGHNyedxVQDs7ejbS972ve97ySQSStXHHn5+Xg4oQDr7OjXS9r3te17ykQkTM1xxww5eHkhAT09e+t73te1r3vIASma5Y4Yc3FywA6OvbTS9rXta9ryJgJJmuWOOHPx80BJv07aaWva1rWvckQkSmuWWOPPyc6Eht066Xva1rWta8gAlMZZZYYcuEJBt0a3va1rWtN7SEwEpmuWeWOHNjAka763va02tNrXEkEiZrnlnlhz4gS030va1rTabWskISJTXPPPLHDIA110va02m02tMhMAlN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t16fX6O/Xr06b1nMQQRnOZJmSZzjl5/nxbr0evv269em96zlECEmcySTMznPLz+GLdej09+vXp03vWZEICZmZJJMzOOfDxSre/p7devTe96zIQIM5kkkkzMY4eOLb29Hbr0303rWYggJMySSSTOccPLFt69+3Tpve9akiBAzJJJEzM44+WVb179OnTet61IhAJJJJEkznPHzxa69unTe9a3ZCAgkzESSTOeXnlW9OvTe9b1qxAgJJEiRJnPLjFXfXpreta1UIBCSJESSYxxlVvpveta1dSAgEkSIiZnPkK3veta1dWEAgiRCJJMcimt71dXVqCWASIhESYxFNb1dW21AJYERCETGYprV1bbQQAIiBEkyC6ttq2AAIhLBEklFtq1QJYAQCCICqpQAAQAEAFBYAAAYmc5xjj5Pznzrdez7vv8AV6O3ft29GOOIhCEznMzmTMzjny8nwvHbr0fX93p79+3Xt3zyzIhAmc5zJmTOc8+Xl+L5bdd/qez09u/Xr26uWYhBDGZmTMmc5xy8vyPPbe30vX6O/Xr169pzkiCCZzMyZkmc45eb5XBddfoer0duvXp16uciECM5zJJmTOcc/N8ziuunu9Xft16denVjKEIJM5kkmZMZ5+f5vJb09vp79evTp06XEiCBMzMkkmZnHPh8/lbd+z0duvXpvp0uIiAhmZkkkmZjnx8HK279Xo7dem+nTdzIggSZkkkkmc8+Pi5W3fp79evTe+m7mQQIZkkkkZznHHx87br09uvTpve93MIIEkkkkTMzjl48Vd9+3XfTe9bskEAkkkkSSZxy8uKuu/Xp03re9WQgIMyJEkkznn5cq1269N71vW0QICSRIkSZzz82at7dOm9a1vVkIBCSJESSZ58Mq106b3rWtasgIBJIiJGZz45prpveta1q2EAQiREJJnPHNNb3vV1daICARIhETOeULd61rVuqIAEREISTPOKuta1bbbAEsCIRBJnEVdXVttpAAIhLBEmJRq6W1QACCCCEzKLbVWgEAIBAklFVSgABAAIAKBYAAAxJnOccvN8H4du/u/T9fo79evXr2nOSEIJnMzJMzMxjn5vi/Kt19b6Pq9Hbr169OrGYggTOcyTMkznHLz/I+bbr6X0PT37devTp1YkgghnMzJJmZzjnw+T4Lde/3env169OnTqxIIQTMzJJMyZxz4fL8Vt93s9Pbr16dOnRmRCBGZmSSSZznnw+b47b7PZ6O3Xp0306MyEEDOZJJJMzGOHz/JbfX6vR169N9N9LiEECTMkkkkznHDweZb6vV369Om99N3MggQzJJJJJMY5eDz1fT6e3Xp03ve7mECCSSSSJmZxy8Xnq+j09eu+m9b3ZIEBJJJIkkzjl4+FXv6OvTpvW97SEAhMxIkkmc8vJxq9u/Xpvet63coCAzIkSSSZ5eXkt69uu971vWrIIAkkSIkmc8/Nyq9e3Te9a1raCAgkkREkmcefkrr16b1rWtasgIBJIiIkzjz86vTp01rWtXVhAEJERCSZzwwrp01vV1q6ICAREiETOeOKb6a1rVurYQAhEQRJM8sl1vWrq26QAQIhCImeeS61rVttoJYAhCCIzjJdatttqoABCCCJM5pdW1aoAiwIECJmUtq1SwAAgEBIFUooBAAAIAKAAAAGZM5znn5/lflbfo/c9vo79evTp06sSEEEzMySTMmcc+HzPz116/r+z0duvXp06dGZEEEZmZJJJnOefD5vxK9X1PX6O3Xp0306MxCCDOZJJJMzGOHzvj2+j6Xr79evTfTfS5kQQJMySSSTOefHwfJt7/Q9Xbt06b303cxBAiZkkkkkxjj4fmL393p7denTe99EkIEGZJJJGZnHHxfNt7e30duu+m973cxAgSSSSRJnOOXj+fb19nft06b3re7lCAJJJJEkmccvJ4Lenr79enTet71ZCAQmYkSSTOeXk8VvT1d+nTe9b1u5IEBmRIkkkzy8vkXp6e3Tpret61ZAgEkkREkznn5vKu/R26b3rWtbQICEkiIkkzz8/lrfo69Nb1rWtWICAkiREkmccPNW+3Xe9a1rWkCAQkiEiTOOHBddum9butXViAEJERCSTHHhWuvTetXV1agIBERIRM55cTXXe7rVurYQAREQRJM8uS3pvWrq26QCAIhCImefKr01rVttoCAIQgiSY5l3rVtttIABEEEJMYVu6q2qAJUCCBDOc01baq0ARYICAjOVaWqVYAAgCAiCqUUAgUgAQAoAAAAMyTMzz4+D8fz6/ovoert169N9N9GYgQJmSSSSTOccfD+Yzv7Xv9Pbr06b303cyCCCZkkkkkxjl4fzs39b2+nt06dN73u5hAgZkkkkZmccvF8Ga+n7fR1676b3vaRAgSSSSRJmY5eP4c39H1+jr06b3re7lCAJJlJEkmcc/H8ea9/r79em963vaQgEJmJIkkznl5fkNe31d+nTe9b1uyIEBmRJEkkxz8vy5r2ert03vet61YgIDMkRIkznn5vmL6/T1671vWt6sggESSIiSZzjzfOX1ejr03vWta1YQBCSRESSZx5/nr6fR06b1rWtasQEBJEiJJJz4eFfR36b3rWta0QQCEkQkSZxw8a9+3Tet3WrqxACESIRJJjj4179em9autXRAICJCQkZzx8q9uu9a1q3VsEAIiEREmePmXr13rV1bdCABERBEkzz869Om9XVttsAgCIQiJnnwXpvd1bbaEACEIQkmOMu961bbbSAARBBCTHI3u6W2qABAggQznmutW2rVAAggQETOFurVVVQABAQCTFW1VKAEoQAIJCqKFAQUgAgAUAAAAGYkzMcvJ+P8X2/s+vv16dN63vdyhAEkkkiSTOOfk/L+b6f1vX269N71ve0iAETMSRJJnPLy/nPP9D6nq7dOm963rdkQEDMiSJJJjn5fz/H3fS9Pbpve9b1tEBAZiSRJJM8/L8Ll7Poenr06a3rW9WQIBJJEiJM55+f4nL1+/wBHXpveta1uyBARJIiJJMY8/wAbn6vd3673vWta1YQICSJESSZx5/k8/T7O/Xe9a1rWrCBASRIiRmc+Hy+fo9nbpveta1rRAgESJERJnHD5vP0ert03rWtaurBACRIhEkznj83Hf1dem9autXViAgIkQiSTHL5+O3p673rV1q6IBASIhEjOeXgz279d71dW6tgQBERCIkzy8WevfpvWrq26IAIIiEIznn4507dN6t1bbUAgEQhCTPPy56dt61q220IAEIQiJnHmm+u9atttoQAIghBM488303q222rAAEQQQkxwm+mrqraoAEsEIIRjlNb1batUABAhAhM85rWrVVaCACAgEZxNaq1SgABAAgzmXVUpQAAQAESFoopAAAAEAUAAAADKJM55+f8AKeP9J7u/Xpveta1uyBAJJIiJJMY8/wCa8n3vb369Nb1rWtoQECSJESSZx5/z3l+17O/TpvWta1qwgIEkSIkkzjh8HzfX9ffpveta1rVkCAJIkhIzMcPh+f6vr7dN61rWtaIEAkRIiJM44/F4fT9XXpvWta1dWEAEiRCJJnPH4/H6Pp69N61daurEBLBEiESSY4/J5e/09d71q6utCAgJEQiSTPH5fL3ejrvWtat1bAgBIiESM55fN5e3v03vVurq2BAEREISTPL53P2dum9aurbogEsCIhCSZ5/P5+vt03q6tttQCAREIRmc/Bj1demtXVttsCACIghJnHix6OvTV1bbaCABIQQknPyY9HTetW220QAEQghGceXHfrrVtttWAAQhLCEmPNnt01dVbVsAAhARCTPnz16attWqAAIQggmeGeu7batUCAAhAhJxz03bVVaCABBAEZ5zeqtUoAAQJRBJza0tKUAAEAEEw0qlKAAEAAhlVKFIAAAACCgAAAASEkmOP56/U9PXe9autXViAIJEQiSTHL4L6Xo673rV1q6IBARIhEkmePxH0e/Xeta1dXSBLAJEQiRnPL40+h36b3dat1bAgBIiERJjn8ee/v03rV1bq2EsAREQhJM8vlT29971q6tuhASwIiEJJnn8uezt03datt0QCWBEQhGc8/mz19umtXVttsASwIiEImefzp6+u9aurbbYEAEJCCTOPnz1dd6urbbbBAAiIISTn4c+rpvWrbbaCABIQQkmPC9HTerbbbSAARCCEZz4p6OmtW22rYABCEsESY8k79NXVW2gABCCCJM+Wdt7ttWqAAIQQhJnzOu9W1bVAAIIIQTPnnXd0tqqBLACCBCTzum7aq1QRYAQgIScW9W2lVQgAQSkCTlN6tVSgAAgBBJzbtUpQAAgAgTE1aqigACAAQYW0oUQAAAAjNUUFgAAAAEKAAAAAiETPP571dN7t1bbbAQAiEQSZx4J6eu9XVtttggAREIJJz8M9PTetW220EACIhBJMeGenpu6tttpAAEhBCSY8U9HTerbbbSAARCCEZx43fprVtttVAAIhAhJjxu+92221bAAEQlgiTHkd96uqttAACEEESZ8s7b1q2rVAAEIIIkz5p23q21aoABCBBEmfPOu9W1bVAAIQIITPnnXd0tWqAQAgQgmeE661atVQCAEBEEzxnXVtVaoBACCBCTjOmraqrQCAIBAjPKdNVaqgAAQCBE5N21S0AACAIEnNq6UpQAAgBAjnN2qUoAAQAQJibWlFCUgAAIEytooUioAAAgYtUoKSoAAAEM1RQVKgAAAERQoCwAAAAIoAAAAAgRM8Z01q1aqgEAIEEJni6atqrVAIAQIIScZ01bVWqAQBAQQk4t6tqqtAIAgECM8XS3SqVYAAQCBE4t6tVVAAAgECJxb1aqqAABAIETk3bVLQAAIBAicm7apVAACAICTm1dFUoAAQBASc2tVSlAACAECObVqlFAAEAIEc2rVKKAAIAQEw1VFKAQAAICYaqlCgIAACBMrVKFAgAAECZW0UKBAAAEDDSlBQIAAAgZVSgoIAAAIMqqgUEAAACEKFBRAAAAQigoFgAAABAUAAAAAAIFAAAAAAAAAAAAP/8QAGgEBAQEBAQEBAAAAAAAAAAAAAAECAwQFBv/aAAgBAxAAAAD3grXTj5/N5PD4PNw4ebycj2/ofb6OvTe963ve90AUt3x8/n8vh8Xn4cePDB6ftez0dem963rW97qhKKu+Pn8/l8fi48ePLlk7/X9ffp03vW9a3vdACrby4efy+PyceXLnyh2+p6u/TpvWt61vewqFFt5cOHm8fl48+fPnDr9L1dum971rWtb2oAVby4+fz+TzcufPniHX6Hp7dN63rWta3qhYKW3jx4efy+flzxjEOnv9Hbpreta1rW9FEUVby48OHl8/PGMZh09vo673rWta1rWqAFLeXLhw83DnjOMxd+zv13vWrrWrrahFC1z48ePm4884zkb9fbrvWtXWrrWqACq58uPHhwxnOcjfq7dNbutW61rQpBRby58uPDjjOZka9PbprWrq6t1qgApefPlx48sZmYNejrverq3VutAApXPnz5ceWZmSLrv03u6turdVQihTHPnz488zMg133vWrbbdXQAFGMc+fLGZJBe3TWrq1bdVZSBSsY545Ykkg113q6ttW3QEUFYzjnjEkiVem9W22rbRUAoznGMYiQL01q1attoEChMZzjMRBd61aVatAigXOZnEkILu21VVVCAFTMzMoJTVtLRaAigJJJIAW0qiqCAAiSACqKCgIBSCAAUAAHtFLenPz+byeLyceXLly5efy/V+36+3XfTWt61ve1ACrvn5/P5PH5uPLnz5c+PD6P1/V26dN61vWt63RUFLdc/P5/L4+HHnz58+fPj7vq+nt03veta1re1ACrrnw8/l8nDlzxzxzxy9n0/R26b3rWta1vVACl1z4efz+TjyxzxjGOfr+h6evTW9a1rWtbKJQW3nx8/n8vHnjGMZxj0+/0dd71rWta1rVABV1z4cPP5uXPGM4zjPo93fp03q61q61tQihWufHhw83LGMZznOPR7O/Te9autXWtULApbz5cOHn5YznOc5z29nbpvWtat1rWigBVxx48fPzxnOczOe3r69N61dXV1rQLAVbz5cePDnnOczMz29PXprWtW6t1pQigtxy5ceGM5zMyZ6+nrvWrq3VurQAKuOfLjxxmZkzJ09HXerq26t1VSoKKxz58uOc5kkk6d+mtattt1dAAFuOfPlzxmSSSdO3TWrdNLdVQgUXGOfPniSSJN9t6urbVt0AAVnHPHPMkkSb671bbattKIClxnHPGZEiNdN6tW1baAAVnOMYkiRGumrbVWrQAFJjOcSIRNb1bVVVUEUBMzOEQhdatUqqUQAWZmZEILdUpVKAAEkkggNUpQqggARIQBVFAoEApCAAKAAD2Aq7nn83k8fHlz545458vZ9L09um9b1rWtb1RYKK3nz+fyeXjyxzxjHPn6/o+jtve9a1rWt6oAKus+fz+XzceeOecYxz9Xv9HXpvWta1d62CwKXeOHn8vn4455xjOMej39+vTWta1rV3qgAq6xw8/m8/PnjOM5xj0e30dN71q61q62URQrWOPn8/n54xnGc5x39vfpvWtXWrrWqFgKtzw4efhzxnEznOO/r773rWtW61rQpFlF1jjw4cOecZmc5z29fXpvWrq6utaACyrccuHDjjGczOZnr6uvTWtXV1brShFBbnjx4csZzmZmZ09PXprV1bq3WgWAprHLjx5YzmZkmevo6b3dW3VuqoRZRbnly48sTMzJJ079N61bbdW6AAVc8+XHnnMzJJN9+m9W6W3VtAAW55c+XPOZJJJvvvWrq2rdVQixRc8+fLGZJJJN9t6urbVttAAVnHPnjMkiRrrvVttq20UgKXOOeMTKRI103q1bVtoEUFZzjnmSREa3u21atUsBYomcYzIiIvTVtVVWgACzGc5iIhd22qqqoIBSZmcpBC6tqlVQAAMzMQgNWqKpQIAWSSEBLaoooBFAIkAgtCgVAAoggACgAB6gpda8/m8nm5c8YzjOMej3ejp01rWta1d6oAFbefz+ThyxjGcZxnv7fR03vV1rWrrdAlBdPP5/Nw5YxnOcZx39vbrvWtXWrrWqFgKtcPP5uHPGc5zjOe3s7dN61rV1da0oAK1OHn8/HnnGc5mcdvX26a3q6t1rWgqCi2cfP5+WMZznMznr6u3TWtXV1brVAArU4cOHLGM5mZnPX1dd7utW6t1oKgsq2ceHDnjGZmTOevp671q6t1bq0AFLOXDjyznOZMydPR03u6tt1dWgigtnHjx55zmTMk6d+m9attt1dAAKs5ceXPOZmSSb79NbttturaAAtnLjyxnMkkk326a1bqrbq0EUCzny5YzmSSJvr01dW21boAAtnLnyzmSSSNdt3VttW20AAs58+ecySJJvrrVttq20UgLKc+fPMkiRNddatW1baBFAsxzxmSIka6attWrVKgBRjGMyIiL0urVVVoAAszjEiQhd22qqqoIBRnGZEQi7tqlVQAAszmSIQXVVSqUAAGZlBBLbVFUUECwskiCAtoKUAigEhAEqgoUBAAAgAKAAPSCmunn83k4884znOc57evt01u61dXWtLKRQW74eby8uecZzM5z19fXpvWrq6utaAAVrXDzeflzznOczOevq69Na1dXVutFACrrh5/PyxnOczOZ19PXe7q6urdaLKgsq28PPw54znMzMzp6eu9aurdW6tABS3j5+PPGc5kzM9fR03u6tt1dWgigtvDhx55zmZkmeno6b1q226t0FgFLePDlzznMkzJ079Na1bbbq6AAVXLhyxnOZJJN9971bdLbq0EUFXjx54xJmSSb771q6tW3VFIoFcuPPGZJJJN9t6ura0ttAAVeXLlnMkkka69Lq21pbaAAVz5c85kkSTfTerbattopAUXlz55kkiRrpvVW1bbQIoFc+eMySIk103baq2qURQK588SSREXpq6VVtUqACmOeZJESNb1bVVVoEUCzOM5iIhd22rSqAFhRnGZEQi61aVVUAAKziSIQNaVSqUAAGcxEILbVFUoEFErMkICW1QpQAAEkEAVQUoAACQgAoFBQIAAEAAoAB3FFvTj5PPzxnMzMzPT09d61dW3V1aABV6cfLw54zmZkzOno6b3dW26uqFSgW74+XjzznMzJmdPR03rVtt1dUKgKXfHz8eec5kzJnp6N71q226t0ABS64+fljEzJmSb79N3VtturaAArXLz8sZzJJMzp26a1dWrbq0CUC648OeM5kkkm+29aurWl1QqKBby48sZkkkk323q6trS20qAKa5ceWcySSSb671q21pbaAAW8uXPOZJJI113q22tLbQRUUt5cueZJJImuu7bbWltAAovPljOZEiTXXWrVq22gAC3nyxmSJEmum7bVW2lCKBXPniSSIi9NaWqtWgAFXnzzJJERemrapatAigVjnmSERLvVtWlVUBRKXGMyREJd6qrSqAAFZxmIhBu2lpVAACs4kiEDWlVSqAABnMRCBq0qiqBCgMyRAg1SlFAAoJJECBaoooAACRAEKoKKAgFEgAhQFAAAAAgAFAA7AK68vJyxmZkkzN9971dWrbq0AAvTl5eeM5kkkzvvvWrq2rdUKSgXfLz8sZkkkmd9t7t1bat0KQCrrl5+eczMkSa7b1dW1pboABTfLhzxMySRNdd61ba0ttAALrlx55zJJJGuu9W21bbSiKSl1y488ySSSNddattq22gFRRrnxxnMkSRrpu6W1bbQABdc+OMySJI101q1attoAAt58sTMSRF6bttVbVUICjXPlnMkSIvTWmirVoAFFxyzlJERd61aVatAAFuOWZIkIu9W1VVVBFAXGMySIhd22qqqqAoC4xmSEQutVVpVAAC3GMxEIl3bS0qgABWcSRCEuraWlUAAFznMQgl1VVRaAigLnOUIEttKoqiAoCZkEEW0qhQABRmRBAWqUFAAAkQECqKCgAASIAChQKBAKggBFBQAAAAAICgAB0UC748cYkkkSa661bbVttAAU3y44zmSJE103dVattoAAu+XHGZJIkXrrVq1bbQABdcuWMySIk101q1atrQAAuuXLEkkiJre7bVWrSiAo1z5ZzJESL01baq1aABRrnyzmRESa3rVpVq0ABTXPlmSRETW9W1VVaBFAtxzzmJERd6tqqqqEKA1zxnKRELu21VVVIFAa54zJEIl3poqqqoABbjGYiIi61aVVUAALcYmUQg3bSqqgABbjEkQhLq2lotAABc5zEQRdVVUWgAAucRIIGrSqKoEUBc5kQgltpVFUCKATMhBBqlKKogKAzIhALSqCgAAuZBAS0pQUAACRAIKooFAABIQAKKAUEBQiAEKKAAACoQABQAAAAAAAAADVAW88ZzESEu9W1VVVBKAt54zlIiF3bbSqqhCgLjGZIhIu7baVVUQApcYzIiIl3ppSqoAAq4xmIiIutWqVVAAC3GJlEIl3bVKqgABbjEkRELq2qVVAABc4kiEJdW1SqoAALnEiQQa1SlLQAAXOcxECXVpVFUAALnEiCBq0qiqAAFzmSCEW2lUVQAATMiEBbSqKoAAJmQhA1SlC0CKAZkggS2lKFUIAFzIhFgtKUKAACzKEBLRVBQAAJICApSgUAA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"
];

module.exports = map;

},{}],9:[function(require,module,exports){
// Generated by CoffeeScript 1.7.1
(function() {
  var L_to_Y, Y_to_L, conv, dotProduct, epsilon, fromLinear, kappa, m, m_inv, maxChroma, maxChromaD, refU, refV, refX, refY, refZ, rgbPrepare, root, round, stylus, toLinear, _hradExtremum, _maxChroma;

  refX = 0.95047;

  refY = 1.00000;

  refZ = 1.08883;

  refU = (4 * refX) / (refX + (15 * refY) + (3 * refZ));

  refV = (9 * refY) / (refX + (15 * refY) + (3 * refZ));

  m = {
    R: [3.240454162114103, -1.537138512797715, -0.49853140955601],
    G: [-0.96926603050518, 1.876010845446694, 0.041556017530349],
    B: [0.055643430959114, -0.20402591351675, 1.057225188223179]
  };

  m_inv = {
    X: [0.41245643908969, 0.3575760776439, 0.18043748326639],
    Y: [0.21267285140562, 0.71515215528781, 0.072174993306559],
    Z: [0.019333895582329, 0.1191920258813, 0.95030407853636]
  };

  kappa = 24389 / 27;

  epsilon = 216 / 24389;

  _maxChroma = function(L, H) {
    var cosH, hrad, sinH, sub1, sub2;
    hrad = H / 360 * 2 * Math.PI;
    sinH = Math.sin(hrad);
    cosH = Math.cos(hrad);
    sub1 = Math.pow(L + 16, 3) / 1560896;
    sub2 = sub1 > epsilon ? sub1 : L / kappa;
    return function(channel) {
      var bottom, lbottom, m1, m2, m3, rbottom, top, _ref;
      _ref = m[channel], m1 = _ref[0], m2 = _ref[1], m3 = _ref[2];
      top = (12739311 * m3 + 11700000 * m2 + 11120499 * m1) * sub2;
      rbottom = 9608480 * m3 - 1921696 * m2;
      lbottom = 1441272 * m3 - 4323816 * m1;
      bottom = (rbottom * sinH + lbottom * cosH) * sub2;
      return function(limit) {
        return L * (top - 11700000 * limit) / (bottom + 1921696 * sinH * limit);
      };
    };
  };

  _hradExtremum = function(L) {
    var lhs, rhs, sub;
    lhs = (Math.pow(L, 3) + 48 * Math.pow(L, 2) + 768 * L + 4096) / 1560896;
    rhs = epsilon;
    sub = lhs > rhs ? lhs : L / kappa;
    return function(channel, limit) {
      var bottom, hrad, m1, m2, m3, top, _ref;
      _ref = m[channel], m1 = _ref[0], m2 = _ref[1], m3 = _ref[2];
      top = (20 * m3 - 4 * m2) * sub + 4 * limit;
      bottom = (3 * m3 - 9 * m1) * sub;
      hrad = Math.atan2(top, bottom);
      if (limit === 1) {
        hrad += Math.PI;
      }
      return hrad;
    };
  };

  maxChroma = function(L, H) {
    var C, channel, limit, mc1, mc2, result, _i, _j, _len, _len1, _ref, _ref1;
    result = Infinity;
    mc1 = _maxChroma(L, H);
    _ref = ['R', 'G', 'B'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      channel = _ref[_i];
      mc2 = mc1(channel);
      _ref1 = [0, 1];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        limit = _ref1[_j];
        C = mc2(limit);
        if ((0 < C && C < result)) {
          result = C;
        }
      }
    }
    return result;
  };

  maxChromaD = function(L) {
    var C, channel, he1, hrad, limit, minima_C, _i, _j, _len, _len1, _ref, _ref1;
    minima_C = [];
    he1 = _hradExtremum(L);
    _ref = ['R', 'G', 'B'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      channel = _ref[_i];
      _ref1 = [0, 1];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        limit = _ref1[_j];
        hrad = he1(channel, limit);
        C = maxChroma(L, hrad * 180 / Math.PI);
        minima_C.push(C);
      }
    }
    return Math.min.apply(Math, minima_C);
  };

  dotProduct = function(a, b) {
    var i, ret, _i, _ref;
    ret = 0;
    for (i = _i = 0, _ref = a.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      ret += a[i] * b[i];
    }
    return ret;
  };

  round = function(num, places) {
    var n;
    n = Math.pow(10, places);
    return Math.round(num * n) / n;
  };

  fromLinear = function(c) {
    if (c <= 0.0031308) {
      return 12.92 * c;
    } else {
      return 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
    }
  };

  toLinear = function(c) {
    var a;
    a = 0.055;
    if (c > 0.04045) {
      return Math.pow((c + a) / (1 + a), 2.4);
    } else {
      return c / 12.92;
    }
  };

  rgbPrepare = function(tuple) {
    var ch, n, _i, _j, _len, _len1, _results;
    tuple = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = tuple.length; _i < _len; _i++) {
        n = tuple[_i];
        _results.push(round(n, 3));
      }
      return _results;
    })();
    for (_i = 0, _len = tuple.length; _i < _len; _i++) {
      ch = tuple[_i];
      if (ch < -0.0001 || ch > 1.0001) {
        throw new Error("Illegal rgb value: " + ch);
      }
      if (ch < 0) {
        ch = 0;
      }
      if (ch > 1) {
        ch = 1;
      }
    }
    _results = [];
    for (_j = 0, _len1 = tuple.length; _j < _len1; _j++) {
      ch = tuple[_j];
      _results.push(Math.round(ch * 255));
    }
    return _results;
  };

  conv = {
    'xyz': {},
    'luv': {},
    'lch': {},
    'husl': {},
    'huslp': {},
    'rgb': {},
    'hex': {}
  };

  conv.xyz.rgb = function(tuple) {
    var B, G, R;
    R = fromLinear(dotProduct(m.R, tuple));
    G = fromLinear(dotProduct(m.G, tuple));
    B = fromLinear(dotProduct(m.B, tuple));
    return [R, G, B];
  };

  conv.rgb.xyz = function(tuple) {
    var B, G, R, X, Y, Z, rgbl;
    R = tuple[0], G = tuple[1], B = tuple[2];
    rgbl = [toLinear(R), toLinear(G), toLinear(B)];
    X = dotProduct(m_inv.X, rgbl);
    Y = dotProduct(m_inv.Y, rgbl);
    Z = dotProduct(m_inv.Z, rgbl);
    return [X, Y, Z];
  };

  Y_to_L = function(Y) {
    if (Y <= epsilon) {
      return (Y / refY) * kappa;
    } else {
      return 116 * Math.pow(Y / refY, 1 / 3) - 16;
    }
  };

  L_to_Y = function(L) {
    if (L <= 8) {
      return refY * L / kappa;
    } else {
      return refY * Math.pow((L + 16) / 116, 3);
    }
  };

  conv.xyz.luv = function(tuple) {
    var L, U, V, X, Y, Z, varU, varV;
    X = tuple[0], Y = tuple[1], Z = tuple[2];
    varU = (4 * X) / (X + (15 * Y) + (3 * Z));
    varV = (9 * Y) / (X + (15 * Y) + (3 * Z));
    L = Y_to_L(Y);
    if (L === 0) {
      return [0, 0, 0];
    }
    U = 13 * L * (varU - refU);
    V = 13 * L * (varV - refV);
    return [L, U, V];
  };

  conv.luv.xyz = function(tuple) {
    var L, U, V, X, Y, Z, varU, varV;
    L = tuple[0], U = tuple[1], V = tuple[2];
    if (L === 0) {
      return [0, 0, 0];
    }
    varU = U / (13 * L) + refU;
    varV = V / (13 * L) + refV;
    Y = L_to_Y(L);
    X = 0 - (9 * Y * varU) / ((varU - 4) * varV - varU * varV);
    Z = (9 * Y - (15 * varV * Y) - (varV * X)) / (3 * varV);
    return [X, Y, Z];
  };

  conv.luv.lch = function(tuple) {
    var C, H, Hrad, L, U, V;
    L = tuple[0], U = tuple[1], V = tuple[2];
    C = Math.pow(Math.pow(U, 2) + Math.pow(V, 2), 1 / 2);
    Hrad = Math.atan2(V, U);
    H = Hrad * 360 / 2 / Math.PI;
    if (H < 0) {
      H = 360 + H;
    }
    return [L, C, H];
  };

  conv.lch.luv = function(tuple) {
    var C, H, Hrad, L, U, V;
    L = tuple[0], C = tuple[1], H = tuple[2];
    Hrad = H / 360 * 2 * Math.PI;
    U = Math.cos(Hrad) * C;
    V = Math.sin(Hrad) * C;
    return [L, U, V];
  };

  conv.husl.lch = function(tuple) {
    var C, H, L, S, max;
    H = tuple[0], S = tuple[1], L = tuple[2];
    if (L > 99.9999999) {
      return [100, 0, H];
    }
    if (L < 0.00000001) {
      return [0, 0, H];
    }
    max = maxChroma(L, H);
    C = max / 100 * S;
    return [L, C, H];
  };

  conv.lch.husl = function(tuple) {
    var C, H, L, S, max;
    L = tuple[0], C = tuple[1], H = tuple[2];
    if (L > 99.9999999) {
      return [H, 0, 100];
    }
    if (L < 0.00000001) {
      return [H, 0, 0];
    }
    max = maxChroma(L, H);
    S = C / max * 100;
    return [H, S, L];
  };

  conv.huslp.lch = function(tuple) {
    var C, H, L, S, max;
    H = tuple[0], S = tuple[1], L = tuple[2];
    if (L > 99.9999999) {
      return [100, 0, H];
    }
    if (L < 0.00000001) {
      return [0, 0, H];
    }
    max = maxChromaD(L);
    C = max / 100 * S;
    return [L, C, H];
  };

  conv.lch.huslp = function(tuple) {
    var C, H, L, S, max;
    L = tuple[0], C = tuple[1], H = tuple[2];
    if (L > 99.9999999) {
      return [H, 0, 100];
    }
    if (L < 0.00000001) {
      return [H, 0, 0];
    }
    max = maxChromaD(L);
    S = C / max * 100;
    return [H, S, L];
  };

  conv.rgb.hex = function(tuple) {
    var ch, hex, _i, _len;
    hex = "#";
    tuple = rgbPrepare(tuple);
    for (_i = 0, _len = tuple.length; _i < _len; _i++) {
      ch = tuple[_i];
      ch = ch.toString(16);
      if (ch.length === 1) {
        ch = "0" + ch;
      }
      hex += ch;
    }
    return hex;
  };

  conv.hex.rgb = function(hex) {
    var b, g, r;
    if (hex.charAt(0) === "#") {
      hex = hex.substring(1, 7);
    }
    r = hex.substring(0, 2);
    g = hex.substring(2, 4);
    b = hex.substring(4, 6);
    return [r, g, b].map(function(n) {
      return parseInt(n, 16) / 255;
    });
  };

  conv.lch.rgb = function(tuple) {
    return conv.xyz.rgb(conv.luv.xyz(conv.lch.luv(tuple)));
  };

  conv.rgb.lch = function(tuple) {
    return conv.luv.lch(conv.xyz.luv(conv.rgb.xyz(tuple)));
  };

  conv.husl.rgb = function(tuple) {
    return conv.lch.rgb(conv.husl.lch(tuple));
  };

  conv.rgb.husl = function(tuple) {
    return conv.lch.husl(conv.rgb.lch(tuple));
  };

  conv.huslp.rgb = function(tuple) {
    return conv.lch.rgb(conv.huslp.lch(tuple));
  };

  conv.rgb.huslp = function(tuple) {
    return conv.lch.huslp(conv.rgb.lch(tuple));
  };

  root = {};

  if (typeof require !== "undefined" && require !== null) {
    try {
      stylus = require('stylus');
      root = function() {
        return function(style) {
          style.define('husl', function(H, S, L, A) {
            var B, G, R, _ref;
            _ref = rgbPrepare(conv.husl.rgb([H.val, S.val, L.val])), R = _ref[0], G = _ref[1], B = _ref[2];
            return new stylus.nodes.RGBA(R, G, B, (A != null ? A.val : 1));
          });
          return style.define('huslp', function(H, S, L, A) {
            var B, G, R, _ref;
            _ref = rgbPrepare(conv.huslp.rgb([H.val, S.val, L.val])), R = _ref[0], G = _ref[1], B = _ref[2];
            return new stylus.nodes.RGBA(R, G, B, (A != null ? A.val : 1));
          });
        };
      };
    } catch (_error) {}
  }

  root.fromRGB = function(R, G, B) {
    return conv.rgb.husl([R, G, B]);
  };

  root.fromHex = function(hex) {
    return conv.rgb.husl(conv.hex.rgb(hex));
  };

  root.toRGB = function(H, S, L) {
    return conv.husl.rgb([H, S, L]);
  };

  root.toHex = function(H, S, L) {
    return conv.rgb.hex(conv.husl.rgb([H, S, L]));
  };

  root.p = {};

  root.p.toRGB = function(H, S, L) {
    return conv.xyz.rgb(conv.luv.xyz(conv.lch.luv(conv.huslp.lch([H, S, L]))));
  };

  root.p.toHex = function(H, S, L) {
    return conv.rgb.hex(conv.xyz.rgb(conv.luv.xyz(conv.lch.luv(conv.huslp.lch([H, S, L])))));
  };

  root.p.fromRGB = function(R, G, B) {
    return conv.lch.huslp(conv.luv.lch(conv.xyz.luv(conv.rgb.xyz([R, G, B]))));
  };

  root.p.fromHex = function(hex) {
    return conv.lch.huslp(conv.luv.lch(conv.xyz.luv(conv.rgb.xyz(conv.hex.rgb(hex)))));
  };

  root._conv = conv;

  root._round = round;

  root._maxChroma = maxChroma;

  root._maxChromaD = maxChromaD;

  root._hradExtremum = _hradExtremum;

  root._rgbPrepare = rgbPrepare;

  if (!((typeof module !== "undefined" && module !== null) || (typeof jQuery !== "undefined" && jQuery !== null) || (typeof requirejs !== "undefined" && requirejs !== null))) {
    this.HUSL = root;
  }

  if (typeof module !== "undefined" && module !== null) {
    module.exports = root;
  }

  if (typeof jQuery !== "undefined" && jQuery !== null) {
    jQuery.husl = root;
  }

  if ((typeof requirejs !== "undefined" && requirejs !== null) && (typeof define !== "undefined" && define !== null)) {
    define(root);
  }

}).call(this);

},{}],10:[function(require,module,exports){
module.exports = require('./lib/ReactWithAddons');

},{"./lib/ReactWithAddons":92}],11:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule AutoFocusMixin
 * @typechecks static-only
 */

"use strict";

var focusNode = require("./focusNode");

var AutoFocusMixin = {
  componentDidMount: function() {
    if (this.props.autoFocus) {
      focusNode(this.getDOMNode());
    }
  }
};

module.exports = AutoFocusMixin;

},{"./focusNode":123}],12:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule CSSCore
 * @typechecks
 */

var invariant = require("./invariant");

/**
 * The CSSCore module specifies the API (and implements most of the methods)
 * that should be used when dealing with the display of elements (via their
 * CSS classes and visibility on screen. It is an API focused on mutating the
 * display and not reading it as no logical state should be encoded in the
 * display of elements.
 */

var CSSCore = {

  /**
   * Adds the class passed in to the element if it doesn't already have it.
   *
   * @param {DOMElement} element the element to set the class on
   * @param {string} className the CSS className
   * @return {DOMElement} the element passed in
   */
  addClass: function(element, className) {
    ("production" !== process.env.NODE_ENV ? invariant(
      !/\s/.test(className),
      'CSSCore.addClass takes only a single class name. "%s" contains ' +
      'multiple classes.', className
    ) : invariant(!/\s/.test(className)));

    if (className) {
      if (element.classList) {
        element.classList.add(className);
      } else if (!CSSCore.hasClass(element, className)) {
        element.className = element.className + ' ' + className;
      }
    }
    return element;
  },

  /**
   * Removes the class passed in from the element
   *
   * @param {DOMElement} element the element to set the class on
   * @param {string} className the CSS className
   * @return {DOMElement} the element passed in
   */
  removeClass: function(element, className) {
    ("production" !== process.env.NODE_ENV ? invariant(
      !/\s/.test(className),
      'CSSCore.removeClass takes only a single class name. "%s" contains ' +
      'multiple classes.', className
    ) : invariant(!/\s/.test(className)));

    if (className) {
      if (element.classList) {
        element.classList.remove(className);
      } else if (CSSCore.hasClass(element, className)) {
        element.className = element.className
          .replace(new RegExp('(^|\\s)' + className + '(?:\\s|$)', 'g'), '$1')
          .replace(/\s+/g, ' ') // multiple spaces to one
          .replace(/^\s*|\s*$/g, ''); // trim the ends
      }
    }
    return element;
  },

  /**
   * Helper to add or remove a class from an element based on a condition.
   *
   * @param {DOMElement} element the element to set the class on
   * @param {string} className the CSS className
   * @param {*} bool condition to whether to add or remove the class
   * @return {DOMElement} the element passed in
   */
  conditionClass: function(element, className, bool) {
    return (bool ? CSSCore.addClass : CSSCore.removeClass)(element, className);
  },

  /**
   * Tests whether the element has the class specified.
   *
   * @param {DOMNode|DOMWindow} element the element to set the class on
   * @param {string} className the CSS className
   * @returns {boolean} true if the element has the class, false if not
   */
  hasClass: function(element, className) {
    ("production" !== process.env.NODE_ENV ? invariant(
      !/\s/.test(className),
      'CSS.hasClass takes only a single class name.'
    ) : invariant(!/\s/.test(className)));
    if (element.classList) {
      return !!className && element.classList.contains(className);
    }
    return (' ' + element.className + ' ').indexOf(' ' + className + ' ') > -1;
  }

};

module.exports = CSSCore;

}).call(this,require("qvMYcC"))
},{"./invariant":135,"qvMYcC":161}],13:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule CSSProperty
 */

"use strict";

/**
 * CSS properties which accept numbers but are not in units of "px".
 */
var isUnitlessNumber = {
  columnCount: true,
  fillOpacity: true,
  flex: true,
  flexGrow: true,
  flexShrink: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  widows: true,
  zIndex: true,
  zoom: true
};

/**
 * @param {string} prefix vendor-specific prefix, eg: Webkit
 * @param {string} key style name, eg: transitionDuration
 * @return {string} style name prefixed with `prefix`, properly camelCased, eg:
 * WebkitTransitionDuration
 */
function prefixKey(prefix, key) {
  return prefix + key.charAt(0).toUpperCase() + key.substring(1);
}

/**
 * Support style names that may come passed in prefixed by adding permutations
 * of vendor prefixes.
 */
var prefixes = ['Webkit', 'ms', 'Moz', 'O'];

// Using Object.keys here, or else the vanilla for-in loop makes IE8 go into an
// infinite loop, because it iterates over the newly added props too.
Object.keys(isUnitlessNumber).forEach(function(prop) {
  prefixes.forEach(function(prefix) {
    isUnitlessNumber[prefixKey(prefix, prop)] = isUnitlessNumber[prop];
  });
});

/**
 * Most style properties can be unset by doing .style[prop] = '' but IE8
 * doesn't like doing that with shorthand properties so for the properties that
 * IE8 breaks on, which are listed here, we instead unset each of the
 * individual properties. See http://bugs.jquery.com/ticket/12385.
 * The 4-value 'clock' properties like margin, padding, border-width seem to
 * behave without any problems. Curiously, list-style works too without any
 * special prodding.
 */
var shorthandPropertyExpansions = {
  background: {
    backgroundImage: true,
    backgroundPosition: true,
    backgroundRepeat: true,
    backgroundColor: true
  },
  border: {
    borderWidth: true,
    borderStyle: true,
    borderColor: true
  },
  borderBottom: {
    borderBottomWidth: true,
    borderBottomStyle: true,
    borderBottomColor: true
  },
  borderLeft: {
    borderLeftWidth: true,
    borderLeftStyle: true,
    borderLeftColor: true
  },
  borderRight: {
    borderRightWidth: true,
    borderRightStyle: true,
    borderRightColor: true
  },
  borderTop: {
    borderTopWidth: true,
    borderTopStyle: true,
    borderTopColor: true
  },
  font: {
    fontStyle: true,
    fontVariant: true,
    fontWeight: true,
    fontSize: true,
    lineHeight: true,
    fontFamily: true
  }
};

var CSSProperty = {
  isUnitlessNumber: isUnitlessNumber,
  shorthandPropertyExpansions: shorthandPropertyExpansions
};

module.exports = CSSProperty;

},{}],14:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule CSSPropertyOperations
 * @typechecks static-only
 */

"use strict";

var CSSProperty = require("./CSSProperty");

var dangerousStyleValue = require("./dangerousStyleValue");
var escapeTextForBrowser = require("./escapeTextForBrowser");
var hyphenate = require("./hyphenate");
var memoizeStringOnly = require("./memoizeStringOnly");

var processStyleName = memoizeStringOnly(function(styleName) {
  return escapeTextForBrowser(hyphenate(styleName));
});

/**
 * Operations for dealing with CSS properties.
 */
var CSSPropertyOperations = {

  /**
   * Serializes a mapping of style properties for use as inline styles:
   *
   *   > createMarkupForStyles({width: '200px', height: 0})
   *   "width:200px;height:0;"
   *
   * Undefined values are ignored so that declarative programming is easier.
   *
   * @param {object} styles
   * @return {?string}
   */
  createMarkupForStyles: function(styles) {
    var serialized = '';
    for (var styleName in styles) {
      if (!styles.hasOwnProperty(styleName)) {
        continue;
      }
      var styleValue = styles[styleName];
      if (styleValue != null) {
        serialized += processStyleName(styleName) + ':';
        serialized += dangerousStyleValue(styleName, styleValue) + ';';
      }
    }
    return serialized || null;
  },

  /**
   * Sets the value for multiple styles on a node.  If a value is specified as
   * '' (empty string), the corresponding style property will be unset.
   *
   * @param {DOMElement} node
   * @param {object} styles
   */
  setValueForStyles: function(node, styles) {
    var style = node.style;
    for (var styleName in styles) {
      if (!styles.hasOwnProperty(styleName)) {
        continue;
      }
      var styleValue = dangerousStyleValue(styleName, styles[styleName]);
      if (styleValue) {
        style[styleName] = styleValue;
      } else {
        var expansion = CSSProperty.shorthandPropertyExpansions[styleName];
        if (expansion) {
          // Shorthand property that IE8 won't like unsetting, so unset each
          // component to placate it
          for (var individualStyleName in expansion) {
            style[individualStyleName] = '';
          }
        } else {
          style[styleName] = '';
        }
      }
    }
  }

};

module.exports = CSSPropertyOperations;

},{"./CSSProperty":13,"./dangerousStyleValue":118,"./escapeTextForBrowser":121,"./hyphenate":133,"./memoizeStringOnly":143}],15:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ChangeEventPlugin
 */

"use strict";

var EventConstants = require("./EventConstants");
var EventPluginHub = require("./EventPluginHub");
var EventPropagators = require("./EventPropagators");
var ExecutionEnvironment = require("./ExecutionEnvironment");
var ReactUpdates = require("./ReactUpdates");
var SyntheticEvent = require("./SyntheticEvent");

var isEventSupported = require("./isEventSupported");
var isTextInputElement = require("./isTextInputElement");
var keyOf = require("./keyOf");

var topLevelTypes = EventConstants.topLevelTypes;

var eventTypes = {
  change: {
    phasedRegistrationNames: {
      bubbled: keyOf({onChange: null}),
      captured: keyOf({onChangeCapture: null})
    },
    dependencies: [
      topLevelTypes.topBlur,
      topLevelTypes.topChange,
      topLevelTypes.topClick,
      topLevelTypes.topFocus,
      topLevelTypes.topInput,
      topLevelTypes.topKeyDown,
      topLevelTypes.topKeyUp,
      topLevelTypes.topSelectionChange
    ]
  }
};

/**
 * For IE shims
 */
var activeElement = null;
var activeElementID = null;
var activeElementValue = null;
var activeElementValueProp = null;

/**
 * SECTION: handle `change` event
 */
function shouldUseChangeEvent(elem) {
  return (
    elem.nodeName === 'SELECT' ||
    (elem.nodeName === 'INPUT' && elem.type === 'file')
  );
}

var doesChangeEventBubble = false;
if (ExecutionEnvironment.canUseDOM) {
  // See `handleChange` comment below
  doesChangeEventBubble = isEventSupported('change') && (
    !('documentMode' in document) || document.documentMode > 8
  );
}

function manualDispatchChangeEvent(nativeEvent) {
  var event = SyntheticEvent.getPooled(
    eventTypes.change,
    activeElementID,
    nativeEvent
  );
  EventPropagators.accumulateTwoPhaseDispatches(event);

  // If change and propertychange bubbled, we'd just bind to it like all the
  // other events and have it go through ReactEventTopLevelCallback. Since it
  // doesn't, we manually listen for the events and so we have to enqueue and
  // process the abstract event manually.
  //
  // Batching is necessary here in order to ensure that all event handlers run
  // before the next rerender (including event handlers attached to ancestor
  // elements instead of directly on the input). Without this, controlled
  // components don't work properly in conjunction with event bubbling because
  // the component is rerendered and the value reverted before all the event
  // handlers can run. See https://github.com/facebook/react/issues/708.
  ReactUpdates.batchedUpdates(runEventInBatch, event);
}

function runEventInBatch(event) {
  EventPluginHub.enqueueEvents(event);
  EventPluginHub.processEventQueue();
}

function startWatchingForChangeEventIE8(target, targetID) {
  activeElement = target;
  activeElementID = targetID;
  activeElement.attachEvent('onchange', manualDispatchChangeEvent);
}

function stopWatchingForChangeEventIE8() {
  if (!activeElement) {
    return;
  }
  activeElement.detachEvent('onchange', manualDispatchChangeEvent);
  activeElement = null;
  activeElementID = null;
}

function getTargetIDForChangeEvent(
    topLevelType,
    topLevelTarget,
    topLevelTargetID) {
  if (topLevelType === topLevelTypes.topChange) {
    return topLevelTargetID;
  }
}
function handleEventsForChangeEventIE8(
    topLevelType,
    topLevelTarget,
    topLevelTargetID) {
  if (topLevelType === topLevelTypes.topFocus) {
    // stopWatching() should be a noop here but we call it just in case we
    // missed a blur event somehow.
    stopWatchingForChangeEventIE8();
    startWatchingForChangeEventIE8(topLevelTarget, topLevelTargetID);
  } else if (topLevelType === topLevelTypes.topBlur) {
    stopWatchingForChangeEventIE8();
  }
}


/**
 * SECTION: handle `input` event
 */
var isInputEventSupported = false;
if (ExecutionEnvironment.canUseDOM) {
  // IE9 claims to support the input event but fails to trigger it when
  // deleting text, so we ignore its input events
  isInputEventSupported = isEventSupported('input') && (
    !('documentMode' in document) || document.documentMode > 9
  );
}

/**
 * (For old IE.) Replacement getter/setter for the `value` property that gets
 * set on the active element.
 */
var newValueProp =  {
  get: function() {
    return activeElementValueProp.get.call(this);
  },
  set: function(val) {
    // Cast to a string so we can do equality checks.
    activeElementValue = '' + val;
    activeElementValueProp.set.call(this, val);
  }
};

/**
 * (For old IE.) Starts tracking propertychange events on the passed-in element
 * and override the value property so that we can distinguish user events from
 * value changes in JS.
 */
function startWatchingForValueChange(target, targetID) {
  activeElement = target;
  activeElementID = targetID;
  activeElementValue = target.value;
  activeElementValueProp = Object.getOwnPropertyDescriptor(
    target.constructor.prototype,
    'value'
  );

  Object.defineProperty(activeElement, 'value', newValueProp);
  activeElement.attachEvent('onpropertychange', handlePropertyChange);
}

/**
 * (For old IE.) Removes the event listeners from the currently-tracked element,
 * if any exists.
 */
function stopWatchingForValueChange() {
  if (!activeElement) {
    return;
  }

  // delete restores the original property definition
  delete activeElement.value;
  activeElement.detachEvent('onpropertychange', handlePropertyChange);

  activeElement = null;
  activeElementID = null;
  activeElementValue = null;
  activeElementValueProp = null;
}

/**
 * (For old IE.) Handles a propertychange event, sending a `change` event if
 * the value of the active element has changed.
 */
function handlePropertyChange(nativeEvent) {
  if (nativeEvent.propertyName !== 'value') {
    return;
  }
  var value = nativeEvent.srcElement.value;
  if (value === activeElementValue) {
    return;
  }
  activeElementValue = value;

  manualDispatchChangeEvent(nativeEvent);
}

/**
 * If a `change` event should be fired, returns the target's ID.
 */
function getTargetIDForInputEvent(
    topLevelType,
    topLevelTarget,
    topLevelTargetID) {
  if (topLevelType === topLevelTypes.topInput) {
    // In modern browsers (i.e., not IE8 or IE9), the input event is exactly
    // what we want so fall through here and trigger an abstract event
    return topLevelTargetID;
  }
}

// For IE8 and IE9.
function handleEventsForInputEventIE(
    topLevelType,
    topLevelTarget,
    topLevelTargetID) {
  if (topLevelType === topLevelTypes.topFocus) {
    // In IE8, we can capture almost all .value changes by adding a
    // propertychange handler and looking for events with propertyName
    // equal to 'value'
    // In IE9, propertychange fires for most input events but is buggy and
    // doesn't fire when text is deleted, but conveniently, selectionchange
    // appears to fire in all of the remaining cases so we catch those and
    // forward the event if the value has changed
    // In either case, we don't want to call the event handler if the value
    // is changed from JS so we redefine a setter for `.value` that updates
    // our activeElementValue variable, allowing us to ignore those changes
    //
    // stopWatching() should be a noop here but we call it just in case we
    // missed a blur event somehow.
    stopWatchingForValueChange();
    startWatchingForValueChange(topLevelTarget, topLevelTargetID);
  } else if (topLevelType === topLevelTypes.topBlur) {
    stopWatchingForValueChange();
  }
}

// For IE8 and IE9.
function getTargetIDForInputEventIE(
    topLevelType,
    topLevelTarget,
    topLevelTargetID) {
  if (topLevelType === topLevelTypes.topSelectionChange ||
      topLevelType === topLevelTypes.topKeyUp ||
      topLevelType === topLevelTypes.topKeyDown) {
    // On the selectionchange event, the target is just document which isn't
    // helpful for us so just check activeElement instead.
    //
    // 99% of the time, keydown and keyup aren't necessary. IE8 fails to fire
    // propertychange on the first input event after setting `value` from a
    // script and fires only keydown, keypress, keyup. Catching keyup usually
    // gets it and catching keydown lets us fire an event for the first
    // keystroke if user does a key repeat (it'll be a little delayed: right
    // before the second keystroke). Other input methods (e.g., paste) seem to
    // fire selectionchange normally.
    if (activeElement && activeElement.value !== activeElementValue) {
      activeElementValue = activeElement.value;
      return activeElementID;
    }
  }
}


/**
 * SECTION: handle `click` event
 */
function shouldUseClickEvent(elem) {
  // Use the `click` event to detect changes to checkbox and radio inputs.
  // This approach works across all browsers, whereas `change` does not fire
  // until `blur` in IE8.
  return (
    elem.nodeName === 'INPUT' &&
    (elem.type === 'checkbox' || elem.type === 'radio')
  );
}

function getTargetIDForClickEvent(
    topLevelType,
    topLevelTarget,
    topLevelTargetID) {
  if (topLevelType === topLevelTypes.topClick) {
    return topLevelTargetID;
  }
}

/**
 * This plugin creates an `onChange` event that normalizes change events
 * across form elements. This event fires at a time when it's possible to
 * change the element's value without seeing a flicker.
 *
 * Supported elements are:
 * - input (see `isTextInputElement`)
 * - textarea
 * - select
 */
var ChangeEventPlugin = {

  eventTypes: eventTypes,

  /**
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {DOMEventTarget} topLevelTarget The listening component root node.
   * @param {string} topLevelTargetID ID of `topLevelTarget`.
   * @param {object} nativeEvent Native browser event.
   * @return {*} An accumulation of synthetic events.
   * @see {EventPluginHub.extractEvents}
   */
  extractEvents: function(
      topLevelType,
      topLevelTarget,
      topLevelTargetID,
      nativeEvent) {

    var getTargetIDFunc, handleEventFunc;
    if (shouldUseChangeEvent(topLevelTarget)) {
      if (doesChangeEventBubble) {
        getTargetIDFunc = getTargetIDForChangeEvent;
      } else {
        handleEventFunc = handleEventsForChangeEventIE8;
      }
    } else if (isTextInputElement(topLevelTarget)) {
      if (isInputEventSupported) {
        getTargetIDFunc = getTargetIDForInputEvent;
      } else {
        getTargetIDFunc = getTargetIDForInputEventIE;
        handleEventFunc = handleEventsForInputEventIE;
      }
    } else if (shouldUseClickEvent(topLevelTarget)) {
      getTargetIDFunc = getTargetIDForClickEvent;
    }

    if (getTargetIDFunc) {
      var targetID = getTargetIDFunc(
        topLevelType,
        topLevelTarget,
        topLevelTargetID
      );
      if (targetID) {
        var event = SyntheticEvent.getPooled(
          eventTypes.change,
          targetID,
          nativeEvent
        );
        EventPropagators.accumulateTwoPhaseDispatches(event);
        return event;
      }
    }

    if (handleEventFunc) {
      handleEventFunc(
        topLevelType,
        topLevelTarget,
        topLevelTargetID
      );
    }
  }

};

module.exports = ChangeEventPlugin;

},{"./EventConstants":25,"./EventPluginHub":27,"./EventPropagators":30,"./ExecutionEnvironment":31,"./ReactUpdates":91,"./SyntheticEvent":99,"./isEventSupported":136,"./isTextInputElement":138,"./keyOf":142}],16:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ClientReactRootIndex
 * @typechecks
 */

"use strict";

var nextReactRootIndex = 0;

var ClientReactRootIndex = {
  createReactRootIndex: function() {
    return nextReactRootIndex++;
  }
};

module.exports = ClientReactRootIndex;

},{}],17:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule CompositionEventPlugin
 * @typechecks static-only
 */

"use strict";

var EventConstants = require("./EventConstants");
var EventPropagators = require("./EventPropagators");
var ExecutionEnvironment = require("./ExecutionEnvironment");
var ReactInputSelection = require("./ReactInputSelection");
var SyntheticCompositionEvent = require("./SyntheticCompositionEvent");

var getTextContentAccessor = require("./getTextContentAccessor");
var keyOf = require("./keyOf");

var END_KEYCODES = [9, 13, 27, 32]; // Tab, Return, Esc, Space
var START_KEYCODE = 229;

var useCompositionEvent = (
  ExecutionEnvironment.canUseDOM &&
  'CompositionEvent' in window
);

// In IE9+, we have access to composition events, but the data supplied
// by the native compositionend event may be incorrect. In Korean, for example,
// the compositionend event contains only one character regardless of
// how many characters have been composed since compositionstart.
// We therefore use the fallback data while still using the native
// events as triggers.
var useFallbackData = (
  !useCompositionEvent ||
  'documentMode' in document && document.documentMode > 8
);

var topLevelTypes = EventConstants.topLevelTypes;
var currentComposition = null;

// Events and their corresponding property names.
var eventTypes = {
  compositionEnd: {
    phasedRegistrationNames: {
      bubbled: keyOf({onCompositionEnd: null}),
      captured: keyOf({onCompositionEndCapture: null})
    },
    dependencies: [
      topLevelTypes.topBlur,
      topLevelTypes.topCompositionEnd,
      topLevelTypes.topKeyDown,
      topLevelTypes.topKeyPress,
      topLevelTypes.topKeyUp,
      topLevelTypes.topMouseDown
    ]
  },
  compositionStart: {
    phasedRegistrationNames: {
      bubbled: keyOf({onCompositionStart: null}),
      captured: keyOf({onCompositionStartCapture: null})
    },
    dependencies: [
      topLevelTypes.topBlur,
      topLevelTypes.topCompositionStart,
      topLevelTypes.topKeyDown,
      topLevelTypes.topKeyPress,
      topLevelTypes.topKeyUp,
      topLevelTypes.topMouseDown
    ]
  },
  compositionUpdate: {
    phasedRegistrationNames: {
      bubbled: keyOf({onCompositionUpdate: null}),
      captured: keyOf({onCompositionUpdateCapture: null})
    },
    dependencies: [
      topLevelTypes.topBlur,
      topLevelTypes.topCompositionUpdate,
      topLevelTypes.topKeyDown,
      topLevelTypes.topKeyPress,
      topLevelTypes.topKeyUp,
      topLevelTypes.topMouseDown
    ]
  }
};

/**
 * Translate native top level events into event types.
 *
 * @param {string} topLevelType
 * @return {object}
 */
function getCompositionEventType(topLevelType) {
  switch (topLevelType) {
    case topLevelTypes.topCompositionStart:
      return eventTypes.compositionStart;
    case topLevelTypes.topCompositionEnd:
      return eventTypes.compositionEnd;
    case topLevelTypes.topCompositionUpdate:
      return eventTypes.compositionUpdate;
  }
}

/**
 * Does our fallback best-guess model think this event signifies that
 * composition has begun?
 *
 * @param {string} topLevelType
 * @param {object} nativeEvent
 * @return {boolean}
 */
function isFallbackStart(topLevelType, nativeEvent) {
  return (
    topLevelType === topLevelTypes.topKeyDown &&
    nativeEvent.keyCode === START_KEYCODE
  );
}

/**
 * Does our fallback mode think that this event is the end of composition?
 *
 * @param {string} topLevelType
 * @param {object} nativeEvent
 * @return {boolean}
 */
function isFallbackEnd(topLevelType, nativeEvent) {
  switch (topLevelType) {
    case topLevelTypes.topKeyUp:
      // Command keys insert or clear IME input.
      return (END_KEYCODES.indexOf(nativeEvent.keyCode) !== -1);
    case topLevelTypes.topKeyDown:
      // Expect IME keyCode on each keydown. If we get any other
      // code we must have exited earlier.
      return (nativeEvent.keyCode !== START_KEYCODE);
    case topLevelTypes.topKeyPress:
    case topLevelTypes.topMouseDown:
    case topLevelTypes.topBlur:
      // Events are not possible without cancelling IME.
      return true;
    default:
      return false;
  }
}

/**
 * Helper class stores information about selection and document state
 * so we can figure out what changed at a later date.
 *
 * @param {DOMEventTarget} root
 */
function FallbackCompositionState(root) {
  this.root = root;
  this.startSelection = ReactInputSelection.getSelection(root);
  this.startValue = this.getText();
}

/**
 * Get current text of input.
 *
 * @return {string}
 */
FallbackCompositionState.prototype.getText = function() {
  return this.root.value || this.root[getTextContentAccessor()];
};

/**
 * Text that has changed since the start of composition.
 *
 * @return {string}
 */
FallbackCompositionState.prototype.getData = function() {
  var endValue = this.getText();
  var prefixLength = this.startSelection.start;
  var suffixLength = this.startValue.length - this.startSelection.end;

  return endValue.substr(
    prefixLength,
    endValue.length - suffixLength - prefixLength
  );
};

/**
 * This plugin creates `onCompositionStart`, `onCompositionUpdate` and
 * `onCompositionEnd` events on inputs, textareas and contentEditable
 * nodes.
 */
var CompositionEventPlugin = {

  eventTypes: eventTypes,

  /**
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {DOMEventTarget} topLevelTarget The listening component root node.
   * @param {string} topLevelTargetID ID of `topLevelTarget`.
   * @param {object} nativeEvent Native browser event.
   * @return {*} An accumulation of synthetic events.
   * @see {EventPluginHub.extractEvents}
   */
  extractEvents: function(
      topLevelType,
      topLevelTarget,
      topLevelTargetID,
      nativeEvent) {

    var eventType;
    var data;

    if (useCompositionEvent) {
      eventType = getCompositionEventType(topLevelType);
    } else if (!currentComposition) {
      if (isFallbackStart(topLevelType, nativeEvent)) {
        eventType = eventTypes.compositionStart;
      }
    } else if (isFallbackEnd(topLevelType, nativeEvent)) {
      eventType = eventTypes.compositionEnd;
    }

    if (useFallbackData) {
      // The current composition is stored statically and must not be
      // overwritten while composition continues.
      if (!currentComposition && eventType === eventTypes.compositionStart) {
        currentComposition = new FallbackCompositionState(topLevelTarget);
      } else if (eventType === eventTypes.compositionEnd) {
        if (currentComposition) {
          data = currentComposition.getData();
          currentComposition = null;
        }
      }
    }

    if (eventType) {
      var event = SyntheticCompositionEvent.getPooled(
        eventType,
        topLevelTargetID,
        nativeEvent
      );
      if (data) {
        // Inject data generated from fallback path into the synthetic event.
        // This matches the property of native CompositionEventInterface.
        event.data = data;
      }
      EventPropagators.accumulateTwoPhaseDispatches(event);
      return event;
    }
  }
};

module.exports = CompositionEventPlugin;

},{"./EventConstants":25,"./EventPropagators":30,"./ExecutionEnvironment":31,"./ReactInputSelection":66,"./SyntheticCompositionEvent":97,"./getTextContentAccessor":131,"./keyOf":142}],18:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule DOMChildrenOperations
 * @typechecks static-only
 */

"use strict";

var Danger = require("./Danger");
var ReactMultiChildUpdateTypes = require("./ReactMultiChildUpdateTypes");

var getTextContentAccessor = require("./getTextContentAccessor");

/**
 * The DOM property to use when setting text content.
 *
 * @type {string}
 * @private
 */
var textContentAccessor = getTextContentAccessor();

/**
 * Inserts `childNode` as a child of `parentNode` at the `index`.
 *
 * @param {DOMElement} parentNode Parent node in which to insert.
 * @param {DOMElement} childNode Child node to insert.
 * @param {number} index Index at which to insert the child.
 * @internal
 */
function insertChildAt(parentNode, childNode, index) {
  var childNodes = parentNode.childNodes;
  if (childNodes[index] === childNode) {
    return;
  }
  // If `childNode` is already a child of `parentNode`, remove it so that
  // computing `childNodes[index]` takes into account the removal.
  if (childNode.parentNode === parentNode) {
    parentNode.removeChild(childNode);
  }
  if (index >= childNodes.length) {
    parentNode.appendChild(childNode);
  } else {
    parentNode.insertBefore(childNode, childNodes[index]);
  }
}

var updateTextContent;
if (textContentAccessor === 'textContent') {
  /**
   * Sets the text content of `node` to `text`.
   *
   * @param {DOMElement} node Node to change
   * @param {string} text New text content
   */
  updateTextContent = function(node, text) {
    node.textContent = text;
  };
} else {
  /**
   * Sets the text content of `node` to `text`.
   *
   * @param {DOMElement} node Node to change
   * @param {string} text New text content
   */
  updateTextContent = function(node, text) {
    // In order to preserve newlines correctly, we can't use .innerText to set
    // the contents (see #1080), so we empty the element then append a text node
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
    if (text) {
      var doc = node.ownerDocument || document;
      node.appendChild(doc.createTextNode(text));
    }
  };
}

/**
 * Operations for updating with DOM children.
 */
var DOMChildrenOperations = {

  dangerouslyReplaceNodeWithMarkup: Danger.dangerouslyReplaceNodeWithMarkup,

  updateTextContent: updateTextContent,

  /**
   * Updates a component's children by processing a series of updates. The
   * update configurations are each expected to have a `parentNode` property.
   *
   * @param {array<object>} updates List of update configurations.
   * @param {array<string>} markupList List of markup strings.
   * @internal
   */
  processUpdates: function(updates, markupList) {
    var update;
    // Mapping from parent IDs to initial child orderings.
    var initialChildren = null;
    // List of children that will be moved or removed.
    var updatedChildren = null;

    for (var i = 0; update = updates[i]; i++) {
      if (update.type === ReactMultiChildUpdateTypes.MOVE_EXISTING ||
          update.type === ReactMultiChildUpdateTypes.REMOVE_NODE) {
        var updatedIndex = update.fromIndex;
        var updatedChild = update.parentNode.childNodes[updatedIndex];
        var parentID = update.parentID;

        initialChildren = initialChildren || {};
        initialChildren[parentID] = initialChildren[parentID] || [];
        initialChildren[parentID][updatedIndex] = updatedChild;

        updatedChildren = updatedChildren || [];
        updatedChildren.push(updatedChild);
      }
    }

    var renderedMarkup = Danger.dangerouslyRenderMarkup(markupList);

    // Remove updated children first so that `toIndex` is consistent.
    if (updatedChildren) {
      for (var j = 0; j < updatedChildren.length; j++) {
        updatedChildren[j].parentNode.removeChild(updatedChildren[j]);
      }
    }

    for (var k = 0; update = updates[k]; k++) {
      switch (update.type) {
        case ReactMultiChildUpdateTypes.INSERT_MARKUP:
          insertChildAt(
            update.parentNode,
            renderedMarkup[update.markupIndex],
            update.toIndex
          );
          break;
        case ReactMultiChildUpdateTypes.MOVE_EXISTING:
          insertChildAt(
            update.parentNode,
            initialChildren[update.parentID][update.fromIndex],
            update.toIndex
          );
          break;
        case ReactMultiChildUpdateTypes.TEXT_CONTENT:
          updateTextContent(
            update.parentNode,
            update.textContent
          );
          break;
        case ReactMultiChildUpdateTypes.REMOVE_NODE:
          // Already removed by the for-loop above.
          break;
      }
    }
  }

};

module.exports = DOMChildrenOperations;

},{"./Danger":21,"./ReactMultiChildUpdateTypes":73,"./getTextContentAccessor":131}],19:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule DOMProperty
 * @typechecks static-only
 */

/*jslint bitwise: true */

"use strict";

var invariant = require("./invariant");

var DOMPropertyInjection = {
  /**
   * Mapping from normalized, camelcased property names to a configuration that
   * specifies how the associated DOM property should be accessed or rendered.
   */
  MUST_USE_ATTRIBUTE: 0x1,
  MUST_USE_PROPERTY: 0x2,
  HAS_SIDE_EFFECTS: 0x4,
  HAS_BOOLEAN_VALUE: 0x8,
  HAS_POSITIVE_NUMERIC_VALUE: 0x10,

  /**
   * Inject some specialized knowledge about the DOM. This takes a config object
   * with the following properties:
   *
   * isCustomAttribute: function that given an attribute name will return true
   * if it can be inserted into the DOM verbatim. Useful for data-* or aria-*
   * attributes where it's impossible to enumerate all of the possible
   * attribute names,
   *
   * Properties: object mapping DOM property name to one of the
   * DOMPropertyInjection constants or null. If your attribute isn't in here,
   * it won't get written to the DOM.
   *
   * DOMAttributeNames: object mapping React attribute name to the DOM
   * attribute name. Attribute names not specified use the **lowercase**
   * normalized name.
   *
   * DOMPropertyNames: similar to DOMAttributeNames but for DOM properties.
   * Property names not specified use the normalized name.
   *
   * DOMMutationMethods: Properties that require special mutation methods. If
   * `value` is undefined, the mutation method should unset the property.
   *
   * @param {object} domPropertyConfig the config as described above.
   */
  injectDOMPropertyConfig: function(domPropertyConfig) {
    var Properties = domPropertyConfig.Properties || {};
    var DOMAttributeNames = domPropertyConfig.DOMAttributeNames || {};
    var DOMPropertyNames = domPropertyConfig.DOMPropertyNames || {};
    var DOMMutationMethods = domPropertyConfig.DOMMutationMethods || {};

    if (domPropertyConfig.isCustomAttribute) {
      DOMProperty._isCustomAttributeFunctions.push(
        domPropertyConfig.isCustomAttribute
      );
    }

    for (var propName in Properties) {
      ("production" !== process.env.NODE_ENV ? invariant(
        !DOMProperty.isStandardName[propName],
        'injectDOMPropertyConfig(...): You\'re trying to inject DOM property ' +
        '\'%s\' which has already been injected. You may be accidentally ' +
        'injecting the same DOM property config twice, or you may be ' +
        'injecting two configs that have conflicting property names.',
        propName
      ) : invariant(!DOMProperty.isStandardName[propName]));

      DOMProperty.isStandardName[propName] = true;

      var lowerCased = propName.toLowerCase();
      DOMProperty.getPossibleStandardName[lowerCased] = propName;

      var attributeName = DOMAttributeNames[propName];
      if (attributeName) {
        DOMProperty.getPossibleStandardName[attributeName] = propName;
      }

      DOMProperty.getAttributeName[propName] = attributeName || lowerCased;

      DOMProperty.getPropertyName[propName] =
        DOMPropertyNames[propName] || propName;

      var mutationMethod = DOMMutationMethods[propName];
      if (mutationMethod) {
        DOMProperty.getMutationMethod[propName] = mutationMethod;
      }

      var propConfig = Properties[propName];
      DOMProperty.mustUseAttribute[propName] =
        propConfig & DOMPropertyInjection.MUST_USE_ATTRIBUTE;
      DOMProperty.mustUseProperty[propName] =
        propConfig & DOMPropertyInjection.MUST_USE_PROPERTY;
      DOMProperty.hasSideEffects[propName] =
        propConfig & DOMPropertyInjection.HAS_SIDE_EFFECTS;
      DOMProperty.hasBooleanValue[propName] =
        propConfig & DOMPropertyInjection.HAS_BOOLEAN_VALUE;
      DOMProperty.hasPositiveNumericValue[propName] =
        propConfig & DOMPropertyInjection.HAS_POSITIVE_NUMERIC_VALUE;

      ("production" !== process.env.NODE_ENV ? invariant(
        !DOMProperty.mustUseAttribute[propName] ||
          !DOMProperty.mustUseProperty[propName],
        'DOMProperty: Cannot require using both attribute and property: %s',
        propName
      ) : invariant(!DOMProperty.mustUseAttribute[propName] ||
        !DOMProperty.mustUseProperty[propName]));
      ("production" !== process.env.NODE_ENV ? invariant(
        DOMProperty.mustUseProperty[propName] ||
          !DOMProperty.hasSideEffects[propName],
        'DOMProperty: Properties that have side effects must use property: %s',
        propName
      ) : invariant(DOMProperty.mustUseProperty[propName] ||
        !DOMProperty.hasSideEffects[propName]));
      ("production" !== process.env.NODE_ENV ? invariant(
        !DOMProperty.hasBooleanValue[propName] ||
          !DOMProperty.hasPositiveNumericValue[propName],
        'DOMProperty: Cannot have both boolean and positive numeric value: %s',
        propName
      ) : invariant(!DOMProperty.hasBooleanValue[propName] ||
        !DOMProperty.hasPositiveNumericValue[propName]));
    }
  }
};
var defaultValueCache = {};

/**
 * DOMProperty exports lookup objects that can be used like functions:
 *
 *   > DOMProperty.isValid['id']
 *   true
 *   > DOMProperty.isValid['foobar']
 *   undefined
 *
 * Although this may be confusing, it performs better in general.
 *
 * @see http://jsperf.com/key-exists
 * @see http://jsperf.com/key-missing
 */
var DOMProperty = {

  ID_ATTRIBUTE_NAME: 'data-reactid',

  /**
   * Checks whether a property name is a standard property.
   * @type {Object}
   */
  isStandardName: {},

  /**
   * Mapping from lowercase property names to the properly cased version, used
   * to warn in the case of missing properties.
   * @type {Object}
   */
  getPossibleStandardName: {},

  /**
   * Mapping from normalized names to attribute names that differ. Attribute
   * names are used when rendering markup or with `*Attribute()`.
   * @type {Object}
   */
  getAttributeName: {},

  /**
   * Mapping from normalized names to properties on DOM node instances.
   * (This includes properties that mutate due to external factors.)
   * @type {Object}
   */
  getPropertyName: {},

  /**
   * Mapping from normalized names to mutation methods. This will only exist if
   * mutation cannot be set simply by the property or `setAttribute()`.
   * @type {Object}
   */
  getMutationMethod: {},

  /**
   * Whether the property must be accessed and mutated as an object property.
   * @type {Object}
   */
  mustUseAttribute: {},

  /**
   * Whether the property must be accessed and mutated using `*Attribute()`.
   * (This includes anything that fails `<propName> in <element>`.)
   * @type {Object}
   */
  mustUseProperty: {},

  /**
   * Whether or not setting a value causes side effects such as triggering
   * resources to be loaded or text selection changes. We must ensure that
   * the value is only set if it has changed.
   * @type {Object}
   */
  hasSideEffects: {},

  /**
   * Whether the property should be removed when set to a falsey value.
   * @type {Object}
   */
  hasBooleanValue: {},

  /**
   * Whether the property must be positive numeric or parse as a positive
   * numeric and should be removed when set to a falsey value.
   * @type {Object}
   */
  hasPositiveNumericValue: {},

  /**
   * All of the isCustomAttribute() functions that have been injected.
   */
  _isCustomAttributeFunctions: [],

  /**
   * Checks whether a property name is a custom attribute.
   * @method
   */
  isCustomAttribute: function(attributeName) {
    for (var i = 0; i < DOMProperty._isCustomAttributeFunctions.length; i++) {
      var isCustomAttributeFn = DOMProperty._isCustomAttributeFunctions[i];
      if (isCustomAttributeFn(attributeName)) {
        return true;
      }
    }
    return false;
  },

  /**
   * Returns the default property value for a DOM property (i.e., not an
   * attribute). Most default values are '' or false, but not all. Worse yet,
   * some (in particular, `type`) vary depending on the type of element.
   *
   * TODO: Is it better to grab all the possible properties when creating an
   * element to avoid having to create the same element twice?
   */
  getDefaultValueForProperty: function(nodeName, prop) {
    var nodeDefaults = defaultValueCache[nodeName];
    var testElement;
    if (!nodeDefaults) {
      defaultValueCache[nodeName] = nodeDefaults = {};
    }
    if (!(prop in nodeDefaults)) {
      testElement = document.createElement(nodeName);
      nodeDefaults[prop] = testElement[prop];
    }
    return nodeDefaults[prop];
  },

  injection: DOMPropertyInjection
};

module.exports = DOMProperty;

}).call(this,require("qvMYcC"))
},{"./invariant":135,"qvMYcC":161}],20:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule DOMPropertyOperations
 * @typechecks static-only
 */

"use strict";

var DOMProperty = require("./DOMProperty");

var escapeTextForBrowser = require("./escapeTextForBrowser");
var memoizeStringOnly = require("./memoizeStringOnly");
var warning = require("./warning");

function shouldIgnoreValue(name, value) {
  return value == null ||
    DOMProperty.hasBooleanValue[name] && !value ||
    DOMProperty.hasPositiveNumericValue[name] && (isNaN(value) || value < 1);
}

var processAttributeNameAndPrefix = memoizeStringOnly(function(name) {
  return escapeTextForBrowser(name) + '="';
});

if ("production" !== process.env.NODE_ENV) {
  var reactProps = {
    children: true,
    dangerouslySetInnerHTML: true,
    key: true,
    ref: true
  };
  var warnedProperties = {};

  var warnUnknownProperty = function(name) {
    if (reactProps[name] || warnedProperties[name]) {
      return;
    }

    warnedProperties[name] = true;
    var lowerCasedName = name.toLowerCase();

    // data-* attributes should be lowercase; suggest the lowercase version
    var standardName = DOMProperty.isCustomAttribute(lowerCasedName) ?
      lowerCasedName : DOMProperty.getPossibleStandardName[lowerCasedName];

    // For now, only warn when we have a suggested correction. This prevents
    // logging too much when using transferPropsTo.
    ("production" !== process.env.NODE_ENV ? warning(
      standardName == null,
      'Unknown DOM property ' + name + '. Did you mean ' + standardName + '?'
    ) : null);

  };
}

/**
 * Operations for dealing with DOM properties.
 */
var DOMPropertyOperations = {

  /**
   * Creates markup for the ID property.
   *
   * @param {string} id Unescaped ID.
   * @return {string} Markup string.
   */
  createMarkupForID: function(id) {
    return processAttributeNameAndPrefix(DOMProperty.ID_ATTRIBUTE_NAME) +
      escapeTextForBrowser(id) + '"';
  },

  /**
   * Creates markup for a property.
   *
   * @param {string} name
   * @param {*} value
   * @return {?string} Markup string, or null if the property was invalid.
   */
  createMarkupForProperty: function(name, value) {
    if (DOMProperty.isStandardName[name]) {
      if (shouldIgnoreValue(name, value)) {
        return '';
      }
      var attributeName = DOMProperty.getAttributeName[name];
      if (DOMProperty.hasBooleanValue[name]) {
        return escapeTextForBrowser(attributeName);
      }
      return processAttributeNameAndPrefix(attributeName) +
        escapeTextForBrowser(value) + '"';
    } else if (DOMProperty.isCustomAttribute(name)) {
      if (value == null) {
        return '';
      }
      return processAttributeNameAndPrefix(name) +
        escapeTextForBrowser(value) + '"';
    } else if ("production" !== process.env.NODE_ENV) {
      warnUnknownProperty(name);
    }
    return null;
  },

  /**
   * Sets the value for a property on a node.
   *
   * @param {DOMElement} node
   * @param {string} name
   * @param {*} value
   */
  setValueForProperty: function(node, name, value) {
    if (DOMProperty.isStandardName[name]) {
      var mutationMethod = DOMProperty.getMutationMethod[name];
      if (mutationMethod) {
        mutationMethod(node, value);
      } else if (shouldIgnoreValue(name, value)) {
        this.deleteValueForProperty(node, name);
      } else if (DOMProperty.mustUseAttribute[name]) {
        node.setAttribute(DOMProperty.getAttributeName[name], '' + value);
      } else {
        var propName = DOMProperty.getPropertyName[name];
        if (!DOMProperty.hasSideEffects[name] || node[propName] !== value) {
          node[propName] = value;
        }
      }
    } else if (DOMProperty.isCustomAttribute(name)) {
      if (value == null) {
        node.removeAttribute(DOMProperty.getAttributeName[name]);
      } else {
        node.setAttribute(name, '' + value);
      }
    } else if ("production" !== process.env.NODE_ENV) {
      warnUnknownProperty(name);
    }
  },

  /**
   * Deletes the value for a property on a node.
   *
   * @param {DOMElement} node
   * @param {string} name
   */
  deleteValueForProperty: function(node, name) {
    if (DOMProperty.isStandardName[name]) {
      var mutationMethod = DOMProperty.getMutationMethod[name];
      if (mutationMethod) {
        mutationMethod(node, undefined);
      } else if (DOMProperty.mustUseAttribute[name]) {
        node.removeAttribute(DOMProperty.getAttributeName[name]);
      } else {
        var propName = DOMProperty.getPropertyName[name];
        var defaultValue = DOMProperty.getDefaultValueForProperty(
          node.nodeName,
          propName
        );
        if (!DOMProperty.hasSideEffects[name] ||
            node[propName] !== defaultValue) {
          node[propName] = defaultValue;
        }
      }
    } else if (DOMProperty.isCustomAttribute(name)) {
      node.removeAttribute(name);
    } else if ("production" !== process.env.NODE_ENV) {
      warnUnknownProperty(name);
    }
  }

};

module.exports = DOMPropertyOperations;

}).call(this,require("qvMYcC"))
},{"./DOMProperty":19,"./escapeTextForBrowser":121,"./memoizeStringOnly":143,"./warning":158,"qvMYcC":161}],21:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule Danger
 * @typechecks static-only
 */

/*jslint evil: true, sub: true */

"use strict";

var ExecutionEnvironment = require("./ExecutionEnvironment");

var createNodesFromMarkup = require("./createNodesFromMarkup");
var emptyFunction = require("./emptyFunction");
var getMarkupWrap = require("./getMarkupWrap");
var invariant = require("./invariant");

var OPEN_TAG_NAME_EXP = /^(<[^ \/>]+)/;
var RESULT_INDEX_ATTR = 'data-danger-index';

/**
 * Extracts the `nodeName` from a string of markup.
 *
 * NOTE: Extracting the `nodeName` does not require a regular expression match
 * because we make assumptions about React-generated markup (i.e. there are no
 * spaces surrounding the opening tag and there is at least one attribute).
 *
 * @param {string} markup String of markup.
 * @return {string} Node name of the supplied markup.
 * @see http://jsperf.com/extract-nodename
 */
function getNodeName(markup) {
  return markup.substring(1, markup.indexOf(' '));
}

var Danger = {

  /**
   * Renders markup into an array of nodes. The markup is expected to render
   * into a list of root nodes. Also, the length of `resultList` and
   * `markupList` should be the same.
   *
   * @param {array<string>} markupList List of markup strings to render.
   * @return {array<DOMElement>} List of rendered nodes.
   * @internal
   */
  dangerouslyRenderMarkup: function(markupList) {
    ("production" !== process.env.NODE_ENV ? invariant(
      ExecutionEnvironment.canUseDOM,
      'dangerouslyRenderMarkup(...): Cannot render markup in a Worker ' +
      'thread. This is likely a bug in the framework. Please report ' +
      'immediately.'
    ) : invariant(ExecutionEnvironment.canUseDOM));
    var nodeName;
    var markupByNodeName = {};
    // Group markup by `nodeName` if a wrap is necessary, else by '*'.
    for (var i = 0; i < markupList.length; i++) {
      ("production" !== process.env.NODE_ENV ? invariant(
        markupList[i],
        'dangerouslyRenderMarkup(...): Missing markup.'
      ) : invariant(markupList[i]));
      nodeName = getNodeName(markupList[i]);
      nodeName = getMarkupWrap(nodeName) ? nodeName : '*';
      markupByNodeName[nodeName] = markupByNodeName[nodeName] || [];
      markupByNodeName[nodeName][i] = markupList[i];
    }
    var resultList = [];
    var resultListAssignmentCount = 0;
    for (nodeName in markupByNodeName) {
      if (!markupByNodeName.hasOwnProperty(nodeName)) {
        continue;
      }
      var markupListByNodeName = markupByNodeName[nodeName];

      // This for-in loop skips the holes of the sparse array. The order of
      // iteration should follow the order of assignment, which happens to match
      // numerical index order, but we don't rely on that.
      for (var resultIndex in markupListByNodeName) {
        if (markupListByNodeName.hasOwnProperty(resultIndex)) {
          var markup = markupListByNodeName[resultIndex];

          // Push the requested markup with an additional RESULT_INDEX_ATTR
          // attribute.  If the markup does not start with a < character, it
          // will be discarded below (with an appropriate console.error).
          markupListByNodeName[resultIndex] = markup.replace(
            OPEN_TAG_NAME_EXP,
            // This index will be parsed back out below.
            '$1 ' + RESULT_INDEX_ATTR + '="' + resultIndex + '" '
          );
        }
      }

      // Render each group of markup with similar wrapping `nodeName`.
      var renderNodes = createNodesFromMarkup(
        markupListByNodeName.join(''),
        emptyFunction // Do nothing special with <script> tags.
      );

      for (i = 0; i < renderNodes.length; ++i) {
        var renderNode = renderNodes[i];
        if (renderNode.hasAttribute &&
            renderNode.hasAttribute(RESULT_INDEX_ATTR)) {

          resultIndex = +renderNode.getAttribute(RESULT_INDEX_ATTR);
          renderNode.removeAttribute(RESULT_INDEX_ATTR);

          ("production" !== process.env.NODE_ENV ? invariant(
            !resultList.hasOwnProperty(resultIndex),
            'Danger: Assigning to an already-occupied result index.'
          ) : invariant(!resultList.hasOwnProperty(resultIndex)));

          resultList[resultIndex] = renderNode;

          // This should match resultList.length and markupList.length when
          // we're done.
          resultListAssignmentCount += 1;

        } else if ("production" !== process.env.NODE_ENV) {
          console.error(
            "Danger: Discarding unexpected node:",
            renderNode
          );
        }
      }
    }

    // Although resultList was populated out of order, it should now be a dense
    // array.
    ("production" !== process.env.NODE_ENV ? invariant(
      resultListAssignmentCount === resultList.length,
      'Danger: Did not assign to every index of resultList.'
    ) : invariant(resultListAssignmentCount === resultList.length));

    ("production" !== process.env.NODE_ENV ? invariant(
      resultList.length === markupList.length,
      'Danger: Expected markup to render %s nodes, but rendered %s.',
      markupList.length,
      resultList.length
    ) : invariant(resultList.length === markupList.length));

    return resultList;
  },

  /**
   * Replaces a node with a string of markup at its current position within its
   * parent. The markup must render into a single root node.
   *
   * @param {DOMElement} oldChild Child node to replace.
   * @param {string} markup Markup to render in place of the child node.
   * @internal
   */
  dangerouslyReplaceNodeWithMarkup: function(oldChild, markup) {
    ("production" !== process.env.NODE_ENV ? invariant(
      ExecutionEnvironment.canUseDOM,
      'dangerouslyReplaceNodeWithMarkup(...): Cannot render markup in a ' +
      'worker thread. This is likely a bug in the framework. Please report ' +
      'immediately.'
    ) : invariant(ExecutionEnvironment.canUseDOM));
    ("production" !== process.env.NODE_ENV ? invariant(markup, 'dangerouslyReplaceNodeWithMarkup(...): Missing markup.') : invariant(markup));
    ("production" !== process.env.NODE_ENV ? invariant(
      oldChild.tagName.toLowerCase() !== 'html',
      'dangerouslyReplaceNodeWithMarkup(...): Cannot replace markup of the ' +
      '<html> node. This is because browser quirks make this unreliable ' +
      'and/or slow. If you want to render to the root you must use ' +
      'server rendering. See renderComponentToString().'
    ) : invariant(oldChild.tagName.toLowerCase() !== 'html'));

    var newChild = createNodesFromMarkup(markup, emptyFunction)[0];
    oldChild.parentNode.replaceChild(newChild, oldChild);
  }

};

module.exports = Danger;

}).call(this,require("qvMYcC"))
},{"./ExecutionEnvironment":31,"./createNodesFromMarkup":115,"./emptyFunction":119,"./getMarkupWrap":128,"./invariant":135,"qvMYcC":161}],22:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule DefaultDOMPropertyConfig
 */

/*jslint bitwise: true*/

"use strict";

var DOMProperty = require("./DOMProperty");

var MUST_USE_ATTRIBUTE = DOMProperty.injection.MUST_USE_ATTRIBUTE;
var MUST_USE_PROPERTY = DOMProperty.injection.MUST_USE_PROPERTY;
var HAS_BOOLEAN_VALUE = DOMProperty.injection.HAS_BOOLEAN_VALUE;
var HAS_SIDE_EFFECTS = DOMProperty.injection.HAS_SIDE_EFFECTS;
var HAS_POSITIVE_NUMERIC_VALUE =
  DOMProperty.injection.HAS_POSITIVE_NUMERIC_VALUE;

var DefaultDOMPropertyConfig = {
  isCustomAttribute: RegExp.prototype.test.bind(
    /^(data|aria)-[a-z_][a-z\d_.\-]*$/
  ),
  Properties: {
    /**
     * Standard Properties
     */
    accept: null,
    accessKey: null,
    action: null,
    allowFullScreen: MUST_USE_ATTRIBUTE | HAS_BOOLEAN_VALUE,
    allowTransparency: MUST_USE_ATTRIBUTE,
    alt: null,
    async: HAS_BOOLEAN_VALUE,
    autoComplete: null,
    // autoFocus is polyfilled/normalized by AutoFocusMixin
    // autoFocus: HAS_BOOLEAN_VALUE,
    autoPlay: HAS_BOOLEAN_VALUE,
    cellPadding: null,
    cellSpacing: null,
    charSet: MUST_USE_ATTRIBUTE,
    checked: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    className: MUST_USE_PROPERTY,
    cols: MUST_USE_ATTRIBUTE | HAS_POSITIVE_NUMERIC_VALUE,
    colSpan: null,
    content: null,
    contentEditable: null,
    contextMenu: MUST_USE_ATTRIBUTE,
    controls: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    crossOrigin: null,
    data: null, // For `<object />` acts as `src`.
    dateTime: MUST_USE_ATTRIBUTE,
    defer: HAS_BOOLEAN_VALUE,
    dir: null,
    disabled: MUST_USE_ATTRIBUTE | HAS_BOOLEAN_VALUE,
    download: null,
    draggable: null,
    encType: null,
    form: MUST_USE_ATTRIBUTE,
    formNoValidate: HAS_BOOLEAN_VALUE,
    frameBorder: MUST_USE_ATTRIBUTE,
    height: MUST_USE_ATTRIBUTE,
    hidden: MUST_USE_ATTRIBUTE | HAS_BOOLEAN_VALUE,
    href: null,
    hrefLang: null,
    htmlFor: null,
    httpEquiv: null,
    icon: null,
    id: MUST_USE_PROPERTY,
    label: null,
    lang: null,
    list: null,
    loop: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    max: null,
    maxLength: MUST_USE_ATTRIBUTE,
    mediaGroup: null,
    method: null,
    min: null,
    multiple: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    muted: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    name: null,
    noValidate: HAS_BOOLEAN_VALUE,
    pattern: null,
    placeholder: null,
    poster: null,
    preload: null,
    radioGroup: null,
    readOnly: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    rel: null,
    required: HAS_BOOLEAN_VALUE,
    role: MUST_USE_ATTRIBUTE,
    rows: MUST_USE_ATTRIBUTE | HAS_POSITIVE_NUMERIC_VALUE,
    rowSpan: null,
    sandbox: null,
    scope: null,
    scrollLeft: MUST_USE_PROPERTY,
    scrollTop: MUST_USE_PROPERTY,
    seamless: MUST_USE_ATTRIBUTE | HAS_BOOLEAN_VALUE,
    selected: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    size: MUST_USE_ATTRIBUTE | HAS_POSITIVE_NUMERIC_VALUE,
    span: HAS_POSITIVE_NUMERIC_VALUE,
    spellCheck: null,
    src: null,
    srcDoc: MUST_USE_PROPERTY,
    srcSet: null,
    step: null,
    style: null,
    tabIndex: null,
    target: null,
    title: null,
    type: null,
    value: MUST_USE_PROPERTY | HAS_SIDE_EFFECTS,
    width: MUST_USE_ATTRIBUTE,
    wmode: MUST_USE_ATTRIBUTE,

    /**
     * Non-standard Properties
     */
    autoCapitalize: null, // Supported in Mobile Safari for keyboard hints
    autoCorrect: null, // Supported in Mobile Safari for keyboard hints
    property: null, // Supports OG in meta tags

    /**
     * SVG Properties
     */
    cx: MUST_USE_ATTRIBUTE,
    cy: MUST_USE_ATTRIBUTE,
    d: MUST_USE_ATTRIBUTE,
    fill: MUST_USE_ATTRIBUTE,
    fx: MUST_USE_ATTRIBUTE,
    fy: MUST_USE_ATTRIBUTE,
    gradientTransform: MUST_USE_ATTRIBUTE,
    gradientUnits: MUST_USE_ATTRIBUTE,
    offset: MUST_USE_ATTRIBUTE,
    points: MUST_USE_ATTRIBUTE,
    r: MUST_USE_ATTRIBUTE,
    rx: MUST_USE_ATTRIBUTE,
    ry: MUST_USE_ATTRIBUTE,
    spreadMethod: MUST_USE_ATTRIBUTE,
    stopColor: MUST_USE_ATTRIBUTE,
    stopOpacity: MUST_USE_ATTRIBUTE,
    stroke: MUST_USE_ATTRIBUTE,
    strokeLinecap: MUST_USE_ATTRIBUTE,
    strokeWidth: MUST_USE_ATTRIBUTE,
    textAnchor: MUST_USE_ATTRIBUTE,
    transform: MUST_USE_ATTRIBUTE,
    version: MUST_USE_ATTRIBUTE,
    viewBox: MUST_USE_ATTRIBUTE,
    x1: MUST_USE_ATTRIBUTE,
    x2: MUST_USE_ATTRIBUTE,
    x: MUST_USE_ATTRIBUTE,
    y1: MUST_USE_ATTRIBUTE,
    y2: MUST_USE_ATTRIBUTE,
    y: MUST_USE_ATTRIBUTE
  },
  DOMAttributeNames: {
    className: 'class',
    gradientTransform: 'gradientTransform',
    gradientUnits: 'gradientUnits',
    htmlFor: 'for',
    spreadMethod: 'spreadMethod',
    stopColor: 'stop-color',
    stopOpacity: 'stop-opacity',
    strokeLinecap: 'stroke-linecap',
    strokeWidth: 'stroke-width',
    textAnchor: 'text-anchor',
    viewBox: 'viewBox'
  },
  DOMPropertyNames: {
    autoCapitalize: 'autocapitalize',
    autoComplete: 'autocomplete',
    autoCorrect: 'autocorrect',
    autoFocus: 'autofocus',
    autoPlay: 'autoplay',
    encType: 'enctype',
    hrefLang: 'hreflang',
    radioGroup: 'radiogroup',
    spellCheck: 'spellcheck',
    srcDoc: 'srcdoc',
    srcSet: 'srcset'
  }
};

module.exports = DefaultDOMPropertyConfig;

},{"./DOMProperty":19}],23:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule DefaultEventPluginOrder
 */

"use strict";

 var keyOf = require("./keyOf");

/**
 * Module that is injectable into `EventPluginHub`, that specifies a
 * deterministic ordering of `EventPlugin`s. A convenient way to reason about
 * plugins, without having to package every one of them. This is better than
 * having plugins be ordered in the same order that they are injected because
 * that ordering would be influenced by the packaging order.
 * `ResponderEventPlugin` must occur before `SimpleEventPlugin` so that
 * preventing default on events is convenient in `SimpleEventPlugin` handlers.
 */
var DefaultEventPluginOrder = [
  keyOf({ResponderEventPlugin: null}),
  keyOf({SimpleEventPlugin: null}),
  keyOf({TapEventPlugin: null}),
  keyOf({EnterLeaveEventPlugin: null}),
  keyOf({ChangeEventPlugin: null}),
  keyOf({SelectEventPlugin: null}),
  keyOf({CompositionEventPlugin: null}),
  keyOf({AnalyticsEventPlugin: null}),
  keyOf({MobileSafariClickEventPlugin: null})
];

module.exports = DefaultEventPluginOrder;

},{"./keyOf":142}],24:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule EnterLeaveEventPlugin
 * @typechecks static-only
 */

"use strict";

var EventConstants = require("./EventConstants");
var EventPropagators = require("./EventPropagators");
var SyntheticMouseEvent = require("./SyntheticMouseEvent");

var ReactMount = require("./ReactMount");
var keyOf = require("./keyOf");

var topLevelTypes = EventConstants.topLevelTypes;
var getFirstReactDOM = ReactMount.getFirstReactDOM;

var eventTypes = {
  mouseEnter: {
    registrationName: keyOf({onMouseEnter: null}),
    dependencies: [
      topLevelTypes.topMouseOut,
      topLevelTypes.topMouseOver
    ]
  },
  mouseLeave: {
    registrationName: keyOf({onMouseLeave: null}),
    dependencies: [
      topLevelTypes.topMouseOut,
      topLevelTypes.topMouseOver
    ]
  }
};

var extractedEvents = [null, null];

var EnterLeaveEventPlugin = {

  eventTypes: eventTypes,

  /**
   * For almost every interaction we care about, there will be both a top-level
   * `mouseover` and `mouseout` event that occurs. Only use `mouseout` so that
   * we do not extract duplicate events. However, moving the mouse into the
   * browser from outside will not fire a `mouseout` event. In this case, we use
   * the `mouseover` top-level event.
   *
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {DOMEventTarget} topLevelTarget The listening component root node.
   * @param {string} topLevelTargetID ID of `topLevelTarget`.
   * @param {object} nativeEvent Native browser event.
   * @return {*} An accumulation of synthetic events.
   * @see {EventPluginHub.extractEvents}
   */
  extractEvents: function(
      topLevelType,
      topLevelTarget,
      topLevelTargetID,
      nativeEvent) {
    if (topLevelType === topLevelTypes.topMouseOver &&
        (nativeEvent.relatedTarget || nativeEvent.fromElement)) {
      return null;
    }
    if (topLevelType !== topLevelTypes.topMouseOut &&
        topLevelType !== topLevelTypes.topMouseOver) {
      // Must not be a mouse in or mouse out - ignoring.
      return null;
    }

    var win;
    if (topLevelTarget.window === topLevelTarget) {
      // `topLevelTarget` is probably a window object.
      win = topLevelTarget;
    } else {
      // TODO: Figure out why `ownerDocument` is sometimes undefined in IE8.
      var doc = topLevelTarget.ownerDocument;
      if (doc) {
        win = doc.defaultView || doc.parentWindow;
      } else {
        win = window;
      }
    }

    var from, to;
    if (topLevelType === topLevelTypes.topMouseOut) {
      from = topLevelTarget;
      to =
        getFirstReactDOM(nativeEvent.relatedTarget || nativeEvent.toElement) ||
        win;
    } else {
      from = win;
      to = topLevelTarget;
    }

    if (from === to) {
      // Nothing pertains to our managed components.
      return null;
    }

    var fromID = from ? ReactMount.getID(from) : '';
    var toID = to ? ReactMount.getID(to) : '';

    var leave = SyntheticMouseEvent.getPooled(
      eventTypes.mouseLeave,
      fromID,
      nativeEvent
    );
    leave.type = 'mouseleave';
    leave.target = from;
    leave.relatedTarget = to;

    var enter = SyntheticMouseEvent.getPooled(
      eventTypes.mouseEnter,
      toID,
      nativeEvent
    );
    enter.type = 'mouseenter';
    enter.target = to;
    enter.relatedTarget = from;

    EventPropagators.accumulateEnterLeaveDispatches(leave, enter, fromID, toID);

    extractedEvents[0] = leave;
    extractedEvents[1] = enter;

    return extractedEvents;
  }

};

module.exports = EnterLeaveEventPlugin;

},{"./EventConstants":25,"./EventPropagators":30,"./ReactMount":70,"./SyntheticMouseEvent":102,"./keyOf":142}],25:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule EventConstants
 */

"use strict";

var keyMirror = require("./keyMirror");

var PropagationPhases = keyMirror({bubbled: null, captured: null});

/**
 * Types of raw signals from the browser caught at the top level.
 */
var topLevelTypes = keyMirror({
  topBlur: null,
  topChange: null,
  topClick: null,
  topCompositionEnd: null,
  topCompositionStart: null,
  topCompositionUpdate: null,
  topContextMenu: null,
  topCopy: null,
  topCut: null,
  topDoubleClick: null,
  topDrag: null,
  topDragEnd: null,
  topDragEnter: null,
  topDragExit: null,
  topDragLeave: null,
  topDragOver: null,
  topDragStart: null,
  topDrop: null,
  topError: null,
  topFocus: null,
  topInput: null,
  topKeyDown: null,
  topKeyPress: null,
  topKeyUp: null,
  topLoad: null,
  topMouseDown: null,
  topMouseMove: null,
  topMouseOut: null,
  topMouseOver: null,
  topMouseUp: null,
  topPaste: null,
  topReset: null,
  topScroll: null,
  topSelectionChange: null,
  topSubmit: null,
  topTouchCancel: null,
  topTouchEnd: null,
  topTouchMove: null,
  topTouchStart: null,
  topWheel: null
});

var EventConstants = {
  topLevelTypes: topLevelTypes,
  PropagationPhases: PropagationPhases
};

module.exports = EventConstants;

},{"./keyMirror":141}],26:[function(require,module,exports){
(function (process){
/**
 * @providesModule EventListener
 */

var emptyFunction = require("./emptyFunction");

/**
 * Upstream version of event listener. Does not take into account specific
 * nature of platform.
 */
var EventListener = {
  /**
   * Listen to DOM events during the bubble phase.
   *
   * @param {DOMEventTarget} target DOM element to register listener on.
   * @param {string} eventType Event type, e.g. 'click' or 'mouseover'.
   * @param {function} callback Callback function.
   * @return {object} Object with a `remove` method.
   */
  listen: function(target, eventType, callback) {
    if (target.addEventListener) {
      target.addEventListener(eventType, callback, false);
      return {
        remove: function() {
          target.removeEventListener(eventType, callback, false);
        }
      };
    } else if (target.attachEvent) {
      target.attachEvent('on' + eventType, callback);
      return {
        remove: function() {
          target.detachEvent(eventType, callback);
        }
      };
    }
  },

  /**
   * Listen to DOM events during the capture phase.
   *
   * @param {DOMEventTarget} target DOM element to register listener on.
   * @param {string} eventType Event type, e.g. 'click' or 'mouseover'.
   * @param {function} callback Callback function.
   * @return {object} Object with a `remove` method.
   */
  capture: function(target, eventType, callback) {
    if (!target.addEventListener) {
      if ("production" !== process.env.NODE_ENV) {
        console.error(
          'Attempted to listen to events during the capture phase on a ' +
          'browser that does not support the capture phase. Your application ' +
          'will not receive some events.'
        );
      }
      return {
        remove: emptyFunction
      };
    } else {
      target.addEventListener(eventType, callback, true);
      return {
        remove: function() {
          target.removeEventListener(eventType, callback, true);
        }
      };
    }
  }
};

module.exports = EventListener;

}).call(this,require("qvMYcC"))
},{"./emptyFunction":119,"qvMYcC":161}],27:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule EventPluginHub
 */

"use strict";

var EventPluginRegistry = require("./EventPluginRegistry");
var EventPluginUtils = require("./EventPluginUtils");
var ExecutionEnvironment = require("./ExecutionEnvironment");

var accumulate = require("./accumulate");
var forEachAccumulated = require("./forEachAccumulated");
var invariant = require("./invariant");
var isEventSupported = require("./isEventSupported");
var monitorCodeUse = require("./monitorCodeUse");

/**
 * Internal store for event listeners
 */
var listenerBank = {};

/**
 * Internal queue of events that have accumulated their dispatches and are
 * waiting to have their dispatches executed.
 */
var eventQueue = null;

/**
 * Dispatches an event and releases it back into the pool, unless persistent.
 *
 * @param {?object} event Synthetic event to be dispatched.
 * @private
 */
var executeDispatchesAndRelease = function(event) {
  if (event) {
    var executeDispatch = EventPluginUtils.executeDispatch;
    // Plugins can provide custom behavior when dispatching events.
    var PluginModule = EventPluginRegistry.getPluginModuleForEvent(event);
    if (PluginModule && PluginModule.executeDispatch) {
      executeDispatch = PluginModule.executeDispatch;
    }
    EventPluginUtils.executeDispatchesInOrder(event, executeDispatch);

    if (!event.isPersistent()) {
      event.constructor.release(event);
    }
  }
};

/**
 * - `InstanceHandle`: [required] Module that performs logical traversals of DOM
 *   hierarchy given ids of the logical DOM elements involved.
 */
var InstanceHandle = null;

function validateInstanceHandle() {
  var invalid = !InstanceHandle||
    !InstanceHandle.traverseTwoPhase ||
    !InstanceHandle.traverseEnterLeave;
  if (invalid) {
    throw new Error('InstanceHandle not injected before use!');
  }
}

/**
 * This is a unified interface for event plugins to be installed and configured.
 *
 * Event plugins can implement the following properties:
 *
 *   `extractEvents` {function(string, DOMEventTarget, string, object): *}
 *     Required. When a top-level event is fired, this method is expected to
 *     extract synthetic events that will in turn be queued and dispatched.
 *
 *   `eventTypes` {object}
 *     Optional, plugins that fire events must publish a mapping of registration
 *     names that are used to register listeners. Values of this mapping must
 *     be objects that contain `registrationName` or `phasedRegistrationNames`.
 *
 *   `executeDispatch` {function(object, function, string)}
 *     Optional, allows plugins to override how an event gets dispatched. By
 *     default, the listener is simply invoked.
 *
 * Each plugin that is injected into `EventsPluginHub` is immediately operable.
 *
 * @public
 */
var EventPluginHub = {

  /**
   * Methods for injecting dependencies.
   */
  injection: {

    /**
     * @param {object} InjectedMount
     * @public
     */
    injectMount: EventPluginUtils.injection.injectMount,

    /**
     * @param {object} InjectedInstanceHandle
     * @public
     */
    injectInstanceHandle: function(InjectedInstanceHandle) {
      InstanceHandle = InjectedInstanceHandle;
      if ("production" !== process.env.NODE_ENV) {
        validateInstanceHandle();
      }
    },

    getInstanceHandle: function() {
      if ("production" !== process.env.NODE_ENV) {
        validateInstanceHandle();
      }
      return InstanceHandle;
    },

    /**
     * @param {array} InjectedEventPluginOrder
     * @public
     */
    injectEventPluginOrder: EventPluginRegistry.injectEventPluginOrder,

    /**
     * @param {object} injectedNamesToPlugins Map from names to plugin modules.
     */
    injectEventPluginsByName: EventPluginRegistry.injectEventPluginsByName

  },

  eventNameDispatchConfigs: EventPluginRegistry.eventNameDispatchConfigs,

  registrationNameModules: EventPluginRegistry.registrationNameModules,

  /**
   * Stores `listener` at `listenerBank[registrationName][id]`. Is idempotent.
   *
   * @param {string} id ID of the DOM element.
   * @param {string} registrationName Name of listener (e.g. `onClick`).
   * @param {?function} listener The callback to store.
   */
  putListener: function(id, registrationName, listener) {
    ("production" !== process.env.NODE_ENV ? invariant(
      ExecutionEnvironment.canUseDOM,
      'Cannot call putListener() in a non-DOM environment.'
    ) : invariant(ExecutionEnvironment.canUseDOM));
    ("production" !== process.env.NODE_ENV ? invariant(
      !listener || typeof listener === 'function',
      'Expected %s listener to be a function, instead got type %s',
      registrationName, typeof listener
    ) : invariant(!listener || typeof listener === 'function'));

    if ("production" !== process.env.NODE_ENV) {
      // IE8 has no API for event capturing and the `onScroll` event doesn't
      // bubble.
      if (registrationName === 'onScroll' &&
          !isEventSupported('scroll', true)) {
        monitorCodeUse('react_no_scroll_event');
        console.warn('This browser doesn\'t support the `onScroll` event');
      }
    }
    var bankForRegistrationName =
      listenerBank[registrationName] || (listenerBank[registrationName] = {});
    bankForRegistrationName[id] = listener;
  },

  /**
   * @param {string} id ID of the DOM element.
   * @param {string} registrationName Name of listener (e.g. `onClick`).
   * @return {?function} The stored callback.
   */
  getListener: function(id, registrationName) {
    var bankForRegistrationName = listenerBank[registrationName];
    return bankForRegistrationName && bankForRegistrationName[id];
  },

  /**
   * Deletes a listener from the registration bank.
   *
   * @param {string} id ID of the DOM element.
   * @param {string} registrationName Name of listener (e.g. `onClick`).
   */
  deleteListener: function(id, registrationName) {
    var bankForRegistrationName = listenerBank[registrationName];
    if (bankForRegistrationName) {
      delete bankForRegistrationName[id];
    }
  },

  /**
   * Deletes all listeners for the DOM element with the supplied ID.
   *
   * @param {string} id ID of the DOM element.
   */
  deleteAllListeners: function(id) {
    for (var registrationName in listenerBank) {
      delete listenerBank[registrationName][id];
    }
  },

  /**
   * Allows registered plugins an opportunity to extract events from top-level
   * native browser events.
   *
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {DOMEventTarget} topLevelTarget The listening component root node.
   * @param {string} topLevelTargetID ID of `topLevelTarget`.
   * @param {object} nativeEvent Native browser event.
   * @return {*} An accumulation of synthetic events.
   * @internal
   */
  extractEvents: function(
      topLevelType,
      topLevelTarget,
      topLevelTargetID,
      nativeEvent) {
    var events;
    var plugins = EventPluginRegistry.plugins;
    for (var i = 0, l = plugins.length; i < l; i++) {
      // Not every plugin in the ordering may be loaded at runtime.
      var possiblePlugin = plugins[i];
      if (possiblePlugin) {
        var extractedEvents = possiblePlugin.extractEvents(
          topLevelType,
          topLevelTarget,
          topLevelTargetID,
          nativeEvent
        );
        if (extractedEvents) {
          events = accumulate(events, extractedEvents);
        }
      }
    }
    return events;
  },

  /**
   * Enqueues a synthetic event that should be dispatched when
   * `processEventQueue` is invoked.
   *
   * @param {*} events An accumulation of synthetic events.
   * @internal
   */
  enqueueEvents: function(events) {
    if (events) {
      eventQueue = accumulate(eventQueue, events);
    }
  },

  /**
   * Dispatches all synthetic events on the event queue.
   *
   * @internal
   */
  processEventQueue: function() {
    // Set `eventQueue` to null before processing it so that we can tell if more
    // events get enqueued while processing.
    var processingEventQueue = eventQueue;
    eventQueue = null;
    forEachAccumulated(processingEventQueue, executeDispatchesAndRelease);
    ("production" !== process.env.NODE_ENV ? invariant(
      !eventQueue,
      'processEventQueue(): Additional events were enqueued while processing ' +
      'an event queue. Support for this has not yet been implemented.'
    ) : invariant(!eventQueue));
  },

  /**
   * These are needed for tests only. Do not use!
   */
  __purge: function() {
    listenerBank = {};
  },

  __getListenerBank: function() {
    return listenerBank;
  }

};

module.exports = EventPluginHub;

}).call(this,require("qvMYcC"))
},{"./EventPluginRegistry":28,"./EventPluginUtils":29,"./ExecutionEnvironment":31,"./accumulate":108,"./forEachAccumulated":124,"./invariant":135,"./isEventSupported":136,"./monitorCodeUse":148,"qvMYcC":161}],28:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule EventPluginRegistry
 * @typechecks static-only
 */

"use strict";

var invariant = require("./invariant");

/**
 * Injectable ordering of event plugins.
 */
var EventPluginOrder = null;

/**
 * Injectable mapping from names to event plugin modules.
 */
var namesToPlugins = {};

/**
 * Recomputes the plugin list using the injected plugins and plugin ordering.
 *
 * @private
 */
function recomputePluginOrdering() {
  if (!EventPluginOrder) {
    // Wait until an `EventPluginOrder` is injected.
    return;
  }
  for (var pluginName in namesToPlugins) {
    var PluginModule = namesToPlugins[pluginName];
    var pluginIndex = EventPluginOrder.indexOf(pluginName);
    ("production" !== process.env.NODE_ENV ? invariant(
      pluginIndex > -1,
      'EventPluginRegistry: Cannot inject event plugins that do not exist in ' +
      'the plugin ordering, `%s`.',
      pluginName
    ) : invariant(pluginIndex > -1));
    if (EventPluginRegistry.plugins[pluginIndex]) {
      continue;
    }
    ("production" !== process.env.NODE_ENV ? invariant(
      PluginModule.extractEvents,
      'EventPluginRegistry: Event plugins must implement an `extractEvents` ' +
      'method, but `%s` does not.',
      pluginName
    ) : invariant(PluginModule.extractEvents));
    EventPluginRegistry.plugins[pluginIndex] = PluginModule;
    var publishedEvents = PluginModule.eventTypes;
    for (var eventName in publishedEvents) {
      ("production" !== process.env.NODE_ENV ? invariant(
        publishEventForPlugin(
          publishedEvents[eventName],
          PluginModule,
          eventName
        ),
        'EventPluginRegistry: Failed to publish event `%s` for plugin `%s`.',
        eventName,
        pluginName
      ) : invariant(publishEventForPlugin(
        publishedEvents[eventName],
        PluginModule,
        eventName
      )));
    }
  }
}

/**
 * Publishes an event so that it can be dispatched by the supplied plugin.
 *
 * @param {object} dispatchConfig Dispatch configuration for the event.
 * @param {object} PluginModule Plugin publishing the event.
 * @return {boolean} True if the event was successfully published.
 * @private
 */
function publishEventForPlugin(dispatchConfig, PluginModule, eventName) {
  ("production" !== process.env.NODE_ENV ? invariant(
    !EventPluginRegistry.eventNameDispatchConfigs[eventName],
    'EventPluginHub: More than one plugin attempted to publish the same ' +
    'event name, `%s`.',
    eventName
  ) : invariant(!EventPluginRegistry.eventNameDispatchConfigs[eventName]));
  EventPluginRegistry.eventNameDispatchConfigs[eventName] = dispatchConfig;

  var phasedRegistrationNames = dispatchConfig.phasedRegistrationNames;
  if (phasedRegistrationNames) {
    for (var phaseName in phasedRegistrationNames) {
      if (phasedRegistrationNames.hasOwnProperty(phaseName)) {
        var phasedRegistrationName = phasedRegistrationNames[phaseName];
        publishRegistrationName(
          phasedRegistrationName,
          PluginModule,
          eventName
        );
      }
    }
    return true;
  } else if (dispatchConfig.registrationName) {
    publishRegistrationName(
      dispatchConfig.registrationName,
      PluginModule,
      eventName
    );
    return true;
  }
  return false;
}

/**
 * Publishes a registration name that is used to identify dispatched events and
 * can be used with `EventPluginHub.putListener` to register listeners.
 *
 * @param {string} registrationName Registration name to add.
 * @param {object} PluginModule Plugin publishing the event.
 * @private
 */
function publishRegistrationName(registrationName, PluginModule, eventName) {
  ("production" !== process.env.NODE_ENV ? invariant(
    !EventPluginRegistry.registrationNameModules[registrationName],
    'EventPluginHub: More than one plugin attempted to publish the same ' +
    'registration name, `%s`.',
    registrationName
  ) : invariant(!EventPluginRegistry.registrationNameModules[registrationName]));
  EventPluginRegistry.registrationNameModules[registrationName] = PluginModule;
  EventPluginRegistry.registrationNameDependencies[registrationName] =
    PluginModule.eventTypes[eventName].dependencies;
}

/**
 * Registers plugins so that they can extract and dispatch events.
 *
 * @see {EventPluginHub}
 */
var EventPluginRegistry = {

  /**
   * Ordered list of injected plugins.
   */
  plugins: [],

  /**
   * Mapping from event name to dispatch config
   */
  eventNameDispatchConfigs: {},

  /**
   * Mapping from registration name to plugin module
   */
  registrationNameModules: {},

  /**
   * Mapping from registration name to event name
   */
  registrationNameDependencies: {},

  /**
   * Injects an ordering of plugins (by plugin name). This allows the ordering
   * to be decoupled from injection of the actual plugins so that ordering is
   * always deterministic regardless of packaging, on-the-fly injection, etc.
   *
   * @param {array} InjectedEventPluginOrder
   * @internal
   * @see {EventPluginHub.injection.injectEventPluginOrder}
   */
  injectEventPluginOrder: function(InjectedEventPluginOrder) {
    ("production" !== process.env.NODE_ENV ? invariant(
      !EventPluginOrder,
      'EventPluginRegistry: Cannot inject event plugin ordering more than once.'
    ) : invariant(!EventPluginOrder));
    // Clone the ordering so it cannot be dynamically mutated.
    EventPluginOrder = Array.prototype.slice.call(InjectedEventPluginOrder);
    recomputePluginOrdering();
  },

  /**
   * Injects plugins to be used by `EventPluginHub`. The plugin names must be
   * in the ordering injected by `injectEventPluginOrder`.
   *
   * Plugins can be injected as part of page initialization or on-the-fly.
   *
   * @param {object} injectedNamesToPlugins Map from names to plugin modules.
   * @internal
   * @see {EventPluginHub.injection.injectEventPluginsByName}
   */
  injectEventPluginsByName: function(injectedNamesToPlugins) {
    var isOrderingDirty = false;
    for (var pluginName in injectedNamesToPlugins) {
      if (!injectedNamesToPlugins.hasOwnProperty(pluginName)) {
        continue;
      }
      var PluginModule = injectedNamesToPlugins[pluginName];
      if (namesToPlugins[pluginName] !== PluginModule) {
        ("production" !== process.env.NODE_ENV ? invariant(
          !namesToPlugins[pluginName],
          'EventPluginRegistry: Cannot inject two different event plugins ' +
          'using the same name, `%s`.',
          pluginName
        ) : invariant(!namesToPlugins[pluginName]));
        namesToPlugins[pluginName] = PluginModule;
        isOrderingDirty = true;
      }
    }
    if (isOrderingDirty) {
      recomputePluginOrdering();
    }
  },

  /**
   * Looks up the plugin for the supplied event.
   *
   * @param {object} event A synthetic event.
   * @return {?object} The plugin that created the supplied event.
   * @internal
   */
  getPluginModuleForEvent: function(event) {
    var dispatchConfig = event.dispatchConfig;
    if (dispatchConfig.registrationName) {
      return EventPluginRegistry.registrationNameModules[
        dispatchConfig.registrationName
      ] || null;
    }
    for (var phase in dispatchConfig.phasedRegistrationNames) {
      if (!dispatchConfig.phasedRegistrationNames.hasOwnProperty(phase)) {
        continue;
      }
      var PluginModule = EventPluginRegistry.registrationNameModules[
        dispatchConfig.phasedRegistrationNames[phase]
      ];
      if (PluginModule) {
        return PluginModule;
      }
    }
    return null;
  },

  /**
   * Exposed for unit testing.
   * @private
   */
  _resetEventPlugins: function() {
    EventPluginOrder = null;
    for (var pluginName in namesToPlugins) {
      if (namesToPlugins.hasOwnProperty(pluginName)) {
        delete namesToPlugins[pluginName];
      }
    }
    EventPluginRegistry.plugins.length = 0;

    var eventNameDispatchConfigs = EventPluginRegistry.eventNameDispatchConfigs;
    for (var eventName in eventNameDispatchConfigs) {
      if (eventNameDispatchConfigs.hasOwnProperty(eventName)) {
        delete eventNameDispatchConfigs[eventName];
      }
    }

    var registrationNameModules = EventPluginRegistry.registrationNameModules;
    for (var registrationName in registrationNameModules) {
      if (registrationNameModules.hasOwnProperty(registrationName)) {
        delete registrationNameModules[registrationName];
      }
    }
  }

};

module.exports = EventPluginRegistry;

}).call(this,require("qvMYcC"))
},{"./invariant":135,"qvMYcC":161}],29:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule EventPluginUtils
 */

"use strict";

var EventConstants = require("./EventConstants");

var invariant = require("./invariant");

/**
 * Injected dependencies:
 */

/**
 * - `Mount`: [required] Module that can convert between React dom IDs and
 *   actual node references.
 */
var injection = {
  Mount: null,
  injectMount: function(InjectedMount) {
    injection.Mount = InjectedMount;
    if ("production" !== process.env.NODE_ENV) {
      ("production" !== process.env.NODE_ENV ? invariant(
        InjectedMount && InjectedMount.getNode,
        'EventPluginUtils.injection.injectMount(...): Injected Mount module ' +
        'is missing getNode.'
      ) : invariant(InjectedMount && InjectedMount.getNode));
    }
  }
};

var topLevelTypes = EventConstants.topLevelTypes;

function isEndish(topLevelType) {
  return topLevelType === topLevelTypes.topMouseUp ||
         topLevelType === topLevelTypes.topTouchEnd ||
         topLevelType === topLevelTypes.topTouchCancel;
}

function isMoveish(topLevelType) {
  return topLevelType === topLevelTypes.topMouseMove ||
         topLevelType === topLevelTypes.topTouchMove;
}
function isStartish(topLevelType) {
  return topLevelType === topLevelTypes.topMouseDown ||
         topLevelType === topLevelTypes.topTouchStart;
}


var validateEventDispatches;
if ("production" !== process.env.NODE_ENV) {
  validateEventDispatches = function(event) {
    var dispatchListeners = event._dispatchListeners;
    var dispatchIDs = event._dispatchIDs;

    var listenersIsArr = Array.isArray(dispatchListeners);
    var idsIsArr = Array.isArray(dispatchIDs);
    var IDsLen = idsIsArr ? dispatchIDs.length : dispatchIDs ? 1 : 0;
    var listenersLen = listenersIsArr ?
      dispatchListeners.length :
      dispatchListeners ? 1 : 0;

    ("production" !== process.env.NODE_ENV ? invariant(
      idsIsArr === listenersIsArr && IDsLen === listenersLen,
      'EventPluginUtils: Invalid `event`.'
    ) : invariant(idsIsArr === listenersIsArr && IDsLen === listenersLen));
  };
}

/**
 * Invokes `cb(event, listener, id)`. Avoids using call if no scope is
 * provided. The `(listener,id)` pair effectively forms the "dispatch" but are
 * kept separate to conserve memory.
 */
function forEachEventDispatch(event, cb) {
  var dispatchListeners = event._dispatchListeners;
  var dispatchIDs = event._dispatchIDs;
  if ("production" !== process.env.NODE_ENV) {
    validateEventDispatches(event);
  }
  if (Array.isArray(dispatchListeners)) {
    for (var i = 0; i < dispatchListeners.length; i++) {
      if (event.isPropagationStopped()) {
        break;
      }
      // Listeners and IDs are two parallel arrays that are always in sync.
      cb(event, dispatchListeners[i], dispatchIDs[i]);
    }
  } else if (dispatchListeners) {
    cb(event, dispatchListeners, dispatchIDs);
  }
}

/**
 * Default implementation of PluginModule.executeDispatch().
 * @param {SyntheticEvent} SyntheticEvent to handle
 * @param {function} Application-level callback
 * @param {string} domID DOM id to pass to the callback.
 */
function executeDispatch(event, listener, domID) {
  event.currentTarget = injection.Mount.getNode(domID);
  var returnValue = listener(event, domID);
  event.currentTarget = null;
  return returnValue;
}

/**
 * Standard/simple iteration through an event's collected dispatches.
 */
function executeDispatchesInOrder(event, executeDispatch) {
  forEachEventDispatch(event, executeDispatch);
  event._dispatchListeners = null;
  event._dispatchIDs = null;
}

/**
 * Standard/simple iteration through an event's collected dispatches, but stops
 * at the first dispatch execution returning true, and returns that id.
 *
 * @return id of the first dispatch execution who's listener returns true, or
 * null if no listener returned true.
 */
function executeDispatchesInOrderStopAtTrue(event) {
  var dispatchListeners = event._dispatchListeners;
  var dispatchIDs = event._dispatchIDs;
  if ("production" !== process.env.NODE_ENV) {
    validateEventDispatches(event);
  }
  if (Array.isArray(dispatchListeners)) {
    for (var i = 0; i < dispatchListeners.length; i++) {
      if (event.isPropagationStopped()) {
        break;
      }
      // Listeners and IDs are two parallel arrays that are always in sync.
      if (dispatchListeners[i](event, dispatchIDs[i])) {
        return dispatchIDs[i];
      }
    }
  } else if (dispatchListeners) {
    if (dispatchListeners(event, dispatchIDs)) {
      return dispatchIDs;
    }
  }
  return null;
}

/**
 * Execution of a "direct" dispatch - there must be at most one dispatch
 * accumulated on the event or it is considered an error. It doesn't really make
 * sense for an event with multiple dispatches (bubbled) to keep track of the
 * return values at each dispatch execution, but it does tend to make sense when
 * dealing with "direct" dispatches.
 *
 * @return The return value of executing the single dispatch.
 */
function executeDirectDispatch(event) {
  if ("production" !== process.env.NODE_ENV) {
    validateEventDispatches(event);
  }
  var dispatchListener = event._dispatchListeners;
  var dispatchID = event._dispatchIDs;
  ("production" !== process.env.NODE_ENV ? invariant(
    !Array.isArray(dispatchListener),
    'executeDirectDispatch(...): Invalid `event`.'
  ) : invariant(!Array.isArray(dispatchListener)));
  var res = dispatchListener ?
    dispatchListener(event, dispatchID) :
    null;
  event._dispatchListeners = null;
  event._dispatchIDs = null;
  return res;
}

/**
 * @param {SyntheticEvent} event
 * @return {bool} True iff number of dispatches accumulated is greater than 0.
 */
function hasDispatches(event) {
  return !!event._dispatchListeners;
}

/**
 * General utilities that are useful in creating custom Event Plugins.
 */
var EventPluginUtils = {
  isEndish: isEndish,
  isMoveish: isMoveish,
  isStartish: isStartish,

  executeDirectDispatch: executeDirectDispatch,
  executeDispatch: executeDispatch,
  executeDispatchesInOrder: executeDispatchesInOrder,
  executeDispatchesInOrderStopAtTrue: executeDispatchesInOrderStopAtTrue,
  hasDispatches: hasDispatches,
  injection: injection,
  useTouchEvents: false
};

module.exports = EventPluginUtils;

}).call(this,require("qvMYcC"))
},{"./EventConstants":25,"./invariant":135,"qvMYcC":161}],30:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule EventPropagators
 */

"use strict";

var EventConstants = require("./EventConstants");
var EventPluginHub = require("./EventPluginHub");

var accumulate = require("./accumulate");
var forEachAccumulated = require("./forEachAccumulated");

var PropagationPhases = EventConstants.PropagationPhases;
var getListener = EventPluginHub.getListener;

/**
 * Some event types have a notion of different registration names for different
 * "phases" of propagation. This finds listeners by a given phase.
 */
function listenerAtPhase(id, event, propagationPhase) {
  var registrationName =
    event.dispatchConfig.phasedRegistrationNames[propagationPhase];
  return getListener(id, registrationName);
}

/**
 * Tags a `SyntheticEvent` with dispatched listeners. Creating this function
 * here, allows us to not have to bind or create functions for each event.
 * Mutating the event's members allows us to not have to create a wrapping
 * "dispatch" object that pairs the event with the listener.
 */
function accumulateDirectionalDispatches(domID, upwards, event) {
  if ("production" !== process.env.NODE_ENV) {
    if (!domID) {
      throw new Error('Dispatching id must not be null');
    }
  }
  var phase = upwards ? PropagationPhases.bubbled : PropagationPhases.captured;
  var listener = listenerAtPhase(domID, event, phase);
  if (listener) {
    event._dispatchListeners = accumulate(event._dispatchListeners, listener);
    event._dispatchIDs = accumulate(event._dispatchIDs, domID);
  }
}

/**
 * Collect dispatches (must be entirely collected before dispatching - see unit
 * tests). Lazily allocate the array to conserve memory.  We must loop through
 * each event and perform the traversal for each one. We can not perform a
 * single traversal for the entire collection of events because each event may
 * have a different target.
 */
function accumulateTwoPhaseDispatchesSingle(event) {
  if (event && event.dispatchConfig.phasedRegistrationNames) {
    EventPluginHub.injection.getInstanceHandle().traverseTwoPhase(
      event.dispatchMarker,
      accumulateDirectionalDispatches,
      event
    );
  }
}


/**
 * Accumulates without regard to direction, does not look for phased
 * registration names. Same as `accumulateDirectDispatchesSingle` but without
 * requiring that the `dispatchMarker` be the same as the dispatched ID.
 */
function accumulateDispatches(id, ignoredDirection, event) {
  if (event && event.dispatchConfig.registrationName) {
    var registrationName = event.dispatchConfig.registrationName;
    var listener = getListener(id, registrationName);
    if (listener) {
      event._dispatchListeners = accumulate(event._dispatchListeners, listener);
      event._dispatchIDs = accumulate(event._dispatchIDs, id);
    }
  }
}

/**
 * Accumulates dispatches on an `SyntheticEvent`, but only for the
 * `dispatchMarker`.
 * @param {SyntheticEvent} event
 */
function accumulateDirectDispatchesSingle(event) {
  if (event && event.dispatchConfig.registrationName) {
    accumulateDispatches(event.dispatchMarker, null, event);
  }
}

function accumulateTwoPhaseDispatches(events) {
  forEachAccumulated(events, accumulateTwoPhaseDispatchesSingle);
}

function accumulateEnterLeaveDispatches(leave, enter, fromID, toID) {
  EventPluginHub.injection.getInstanceHandle().traverseEnterLeave(
    fromID,
    toID,
    accumulateDispatches,
    leave,
    enter
  );
}


function accumulateDirectDispatches(events) {
  forEachAccumulated(events, accumulateDirectDispatchesSingle);
}



/**
 * A small set of propagation patterns, each of which will accept a small amount
 * of information, and generate a set of "dispatch ready event objects" - which
 * are sets of events that have already been annotated with a set of dispatched
 * listener functions/ids. The API is designed this way to discourage these
 * propagation strategies from actually executing the dispatches, since we
 * always want to collect the entire set of dispatches before executing event a
 * single one.
 *
 * @constructor EventPropagators
 */
var EventPropagators = {
  accumulateTwoPhaseDispatches: accumulateTwoPhaseDispatches,
  accumulateDirectDispatches: accumulateDirectDispatches,
  accumulateEnterLeaveDispatches: accumulateEnterLeaveDispatches
};

module.exports = EventPropagators;

}).call(this,require("qvMYcC"))
},{"./EventConstants":25,"./EventPluginHub":27,"./accumulate":108,"./forEachAccumulated":124,"qvMYcC":161}],31:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ExecutionEnvironment
 */

/*jslint evil: true */

"use strict";

var canUseDOM = typeof window !== 'undefined';

/**
 * Simple, lightweight module assisting with the detection and context of
 * Worker. Helps avoid circular dependencies and allows code to reason about
 * whether or not they are in a Worker, even if they never include the main
 * `ReactWorker` dependency.
 */
var ExecutionEnvironment = {

  canUseDOM: canUseDOM,

  canUseWorkers: typeof Worker !== 'undefined',

  canUseEventListeners:
    canUseDOM && (window.addEventListener || window.attachEvent),

  isInWorker: !canUseDOM // For now, this is true - might change in the future.

};

module.exports = ExecutionEnvironment;

},{}],32:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule LinkedStateMixin
 * @typechecks static-only
 */

"use strict";

var ReactLink = require("./ReactLink");
var ReactStateSetters = require("./ReactStateSetters");

/**
 * A simple mixin around ReactLink.forState().
 */
var LinkedStateMixin = {
  /**
   * Create a ReactLink that's linked to part of this component's state. The
   * ReactLink will have the current value of this.state[key] and will call
   * setState() when a change is requested.
   *
   * @param {string} key state key to update. Note: you may want to use keyOf()
   * if you're using Google Closure Compiler advanced mode.
   * @return {ReactLink} ReactLink instance linking to the state.
   */
  linkState: function(key) {
    return new ReactLink(
      this.state[key],
      ReactStateSetters.createStateKeySetter(this, key)
    );
  }
};

module.exports = LinkedStateMixin;

},{"./ReactLink":68,"./ReactStateSetters":85}],33:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule LinkedValueUtils
 * @typechecks static-only
 */

"use strict";

var ReactPropTypes = require("./ReactPropTypes");

var invariant = require("./invariant");
var warning = require("./warning");

var hasReadOnlyValue = {
  'button': true,
  'checkbox': true,
  'image': true,
  'hidden': true,
  'radio': true,
  'reset': true,
  'submit': true
};

function _assertSingleLink(input) {
  ("production" !== process.env.NODE_ENV ? invariant(
      input.props.checkedLink == null || input.props.valueLink == null,
      'Cannot provide a checkedLink and a valueLink. If you want to use ' +
      'checkedLink, you probably don\'t want to use valueLink and vice versa.'
  ) : invariant(input.props.checkedLink == null || input.props.valueLink == null));
}
function _assertValueLink(input) {
  _assertSingleLink(input);
  ("production" !== process.env.NODE_ENV ? invariant(
    input.props.value == null && input.props.onChange == null,
    'Cannot provide a valueLink and a value or onChange event. If you want ' +
    'to use value or onChange, you probably don\'t want to use valueLink.'
  ) : invariant(input.props.value == null && input.props.onChange == null));
}

function _assertCheckedLink(input) {
  _assertSingleLink(input);
  ("production" !== process.env.NODE_ENV ? invariant(
    input.props.checked == null && input.props.onChange == null,
    'Cannot provide a checkedLink and a checked property or onChange event. ' +
    'If you want to use checked or onChange, you probably don\'t want to ' +
    'use checkedLink'
  ) : invariant(input.props.checked == null && input.props.onChange == null));
}

/**
 * @param {SyntheticEvent} e change event to handle
 */
function _handleLinkedValueChange(e) {
  /*jshint validthis:true */
  this.props.valueLink.requestChange(e.target.value);
}

/**
  * @param {SyntheticEvent} e change event to handle
  */
function _handleLinkedCheckChange(e) {
  /*jshint validthis:true */
  this.props.checkedLink.requestChange(e.target.checked);
}

/**
 * Provide a linked `value` attribute for controlled forms. You should not use
 * this outside of the ReactDOM controlled form components.
 */
var LinkedValueUtils = {
  Mixin: {
    propTypes: {
      value: function(props, propName, componentName) {
        if ("production" !== process.env.NODE_ENV) {
          ("production" !== process.env.NODE_ENV ? warning(
            !props[propName] ||
            hasReadOnlyValue[props.type] ||
            props.onChange ||
            props.readOnly ||
            props.disabled,
            'You provided a `value` prop to a form field without an ' +
            '`onChange` handler. This will render a read-only field. If ' +
            'the field should be mutable use `defaultValue`. Otherwise, ' +
            'set either `onChange` or `readOnly`.'
          ) : null);
        }
      },
      checked: function(props, propName, componentName) {
        if ("production" !== process.env.NODE_ENV) {
          ("production" !== process.env.NODE_ENV ? warning(
            !props[propName] ||
            props.onChange ||
            props.readOnly ||
            props.disabled,
            'You provided a `checked` prop to a form field without an ' +
            '`onChange` handler. This will render a read-only field. If ' +
            'the field should be mutable use `defaultChecked`. Otherwise, ' +
            'set either `onChange` or `readOnly`.'
          ) : null);
        }
      },
      onChange: ReactPropTypes.func
    }
  },

  /**
   * @param {ReactComponent} input Form component
   * @return {*} current value of the input either from value prop or link.
   */
  getValue: function(input) {
    if (input.props.valueLink) {
      _assertValueLink(input);
      return input.props.valueLink.value;
    }
    return input.props.value;
  },

  /**
   * @param {ReactComponent} input Form component
   * @return {*} current checked status of the input either from checked prop
   *             or link.
   */
  getChecked: function(input) {
    if (input.props.checkedLink) {
      _assertCheckedLink(input);
      return input.props.checkedLink.value;
    }
    return input.props.checked;
  },

  /**
   * @param {ReactComponent} input Form component
   * @return {function} change callback either from onChange prop or link.
   */
  getOnChange: function(input) {
    if (input.props.valueLink) {
      _assertValueLink(input);
      return _handleLinkedValueChange;
    } else if (input.props.checkedLink) {
      _assertCheckedLink(input);
      return _handleLinkedCheckChange;
    }
    return input.props.onChange;
  }
};

module.exports = LinkedValueUtils;

}).call(this,require("qvMYcC"))
},{"./ReactPropTypes":79,"./invariant":135,"./warning":158,"qvMYcC":161}],34:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule MobileSafariClickEventPlugin
 * @typechecks static-only
 */

"use strict";

var EventConstants = require("./EventConstants");

var emptyFunction = require("./emptyFunction");

var topLevelTypes = EventConstants.topLevelTypes;

/**
 * Mobile Safari does not fire properly bubble click events on non-interactive
 * elements, which means delegated click listeners do not fire. The workaround
 * for this bug involves attaching an empty click listener on the target node.
 *
 * This particular plugin works around the bug by attaching an empty click
 * listener on `touchstart` (which does fire on every element).
 */
var MobileSafariClickEventPlugin = {

  eventTypes: null,

  /**
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {DOMEventTarget} topLevelTarget The listening component root node.
   * @param {string} topLevelTargetID ID of `topLevelTarget`.
   * @param {object} nativeEvent Native browser event.
   * @return {*} An accumulation of synthetic events.
   * @see {EventPluginHub.extractEvents}
   */
  extractEvents: function(
      topLevelType,
      topLevelTarget,
      topLevelTargetID,
      nativeEvent) {
    if (topLevelType === topLevelTypes.topTouchStart) {
      var target = nativeEvent.target;
      if (target && !target.onclick) {
        target.onclick = emptyFunction;
      }
    }
  }

};

module.exports = MobileSafariClickEventPlugin;

},{"./EventConstants":25,"./emptyFunction":119}],35:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule PooledClass
 */

"use strict";

var invariant = require("./invariant");

/**
 * Static poolers. Several custom versions for each potential number of
 * arguments. A completely generic pooler is easy to implement, but would
 * require accessing the `arguments` object. In each of these, `this` refers to
 * the Class itself, not an instance. If any others are needed, simply add them
 * here, or in their own files.
 */
var oneArgumentPooler = function(copyFieldsFrom) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, copyFieldsFrom);
    return instance;
  } else {
    return new Klass(copyFieldsFrom);
  }
};

var twoArgumentPooler = function(a1, a2) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2);
    return instance;
  } else {
    return new Klass(a1, a2);
  }
};

var threeArgumentPooler = function(a1, a2, a3) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2, a3);
    return instance;
  } else {
    return new Klass(a1, a2, a3);
  }
};

var fiveArgumentPooler = function(a1, a2, a3, a4, a5) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2, a3, a4, a5);
    return instance;
  } else {
    return new Klass(a1, a2, a3, a4, a5);
  }
};

var standardReleaser = function(instance) {
  var Klass = this;
  ("production" !== process.env.NODE_ENV ? invariant(
    instance instanceof Klass,
    'Trying to release an instance into a pool of a different type.'
  ) : invariant(instance instanceof Klass));
  if (instance.destructor) {
    instance.destructor();
  }
  if (Klass.instancePool.length < Klass.poolSize) {
    Klass.instancePool.push(instance);
  }
};

var DEFAULT_POOL_SIZE = 10;
var DEFAULT_POOLER = oneArgumentPooler;

/**
 * Augments `CopyConstructor` to be a poolable class, augmenting only the class
 * itself (statically) not adding any prototypical fields. Any CopyConstructor
 * you give this may have a `poolSize` property, and will look for a
 * prototypical `destructor` on instances (optional).
 *
 * @param {Function} CopyConstructor Constructor that can be used to reset.
 * @param {Function} pooler Customizable pooler.
 */
var addPoolingTo = function(CopyConstructor, pooler) {
  var NewKlass = CopyConstructor;
  NewKlass.instancePool = [];
  NewKlass.getPooled = pooler || DEFAULT_POOLER;
  if (!NewKlass.poolSize) {
    NewKlass.poolSize = DEFAULT_POOL_SIZE;
  }
  NewKlass.release = standardReleaser;
  return NewKlass;
};

var PooledClass = {
  addPoolingTo: addPoolingTo,
  oneArgumentPooler: oneArgumentPooler,
  twoArgumentPooler: twoArgumentPooler,
  threeArgumentPooler: threeArgumentPooler,
  fiveArgumentPooler: fiveArgumentPooler
};

module.exports = PooledClass;

}).call(this,require("qvMYcC"))
},{"./invariant":135,"qvMYcC":161}],36:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule React
 */

"use strict";

var DOMPropertyOperations = require("./DOMPropertyOperations");
var EventPluginUtils = require("./EventPluginUtils");
var ReactChildren = require("./ReactChildren");
var ReactComponent = require("./ReactComponent");
var ReactCompositeComponent = require("./ReactCompositeComponent");
var ReactContext = require("./ReactContext");
var ReactCurrentOwner = require("./ReactCurrentOwner");
var ReactDOM = require("./ReactDOM");
var ReactDOMComponent = require("./ReactDOMComponent");
var ReactDefaultInjection = require("./ReactDefaultInjection");
var ReactInstanceHandles = require("./ReactInstanceHandles");
var ReactMount = require("./ReactMount");
var ReactMultiChild = require("./ReactMultiChild");
var ReactPerf = require("./ReactPerf");
var ReactPropTypes = require("./ReactPropTypes");
var ReactServerRendering = require("./ReactServerRendering");
var ReactTextComponent = require("./ReactTextComponent");

var onlyChild = require("./onlyChild");

ReactDefaultInjection.inject();

var React = {
  Children: {
    map: ReactChildren.map,
    forEach: ReactChildren.forEach,
    only: onlyChild
  },
  DOM: ReactDOM,
  PropTypes: ReactPropTypes,
  initializeTouchEvents: function(shouldUseTouch) {
    EventPluginUtils.useTouchEvents = shouldUseTouch;
  },
  createClass: ReactCompositeComponent.createClass,
  constructAndRenderComponent: ReactMount.constructAndRenderComponent,
  constructAndRenderComponentByID: ReactMount.constructAndRenderComponentByID,
  renderComponent: ReactPerf.measure(
    'React',
    'renderComponent',
    ReactMount.renderComponent
  ),
  renderComponentToString: ReactServerRendering.renderComponentToString,
  renderComponentToStaticMarkup:
    ReactServerRendering.renderComponentToStaticMarkup,
  unmountComponentAtNode: ReactMount.unmountComponentAtNode,
  isValidClass: ReactCompositeComponent.isValidClass,
  isValidComponent: ReactComponent.isValidComponent,
  withContext: ReactContext.withContext,
  __internals: {
    Component: ReactComponent,
    CurrentOwner: ReactCurrentOwner,
    DOMComponent: ReactDOMComponent,
    DOMPropertyOperations: DOMPropertyOperations,
    InstanceHandles: ReactInstanceHandles,
    Mount: ReactMount,
    MultiChild: ReactMultiChild,
    TextComponent: ReactTextComponent
  }
};

if ("production" !== process.env.NODE_ENV) {
  var ExecutionEnvironment = require("./ExecutionEnvironment");
  if (ExecutionEnvironment.canUseDOM &&
      window.top === window.self &&
      navigator.userAgent.indexOf('Chrome') > -1) {
    console.debug(
      'Download the React DevTools for a better development experience: ' +
      'http://fb.me/react-devtools'
    );
  }
}

// Version exists only in the open-source version of React, not in Facebook's
// internal version.
React.version = '0.10.0';

module.exports = React;

}).call(this,require("qvMYcC"))
},{"./DOMPropertyOperations":20,"./EventPluginUtils":29,"./ExecutionEnvironment":31,"./ReactChildren":40,"./ReactComponent":41,"./ReactCompositeComponent":43,"./ReactContext":44,"./ReactCurrentOwner":45,"./ReactDOM":46,"./ReactDOMComponent":48,"./ReactDefaultInjection":58,"./ReactInstanceHandles":67,"./ReactMount":70,"./ReactMultiChild":72,"./ReactPerf":75,"./ReactPropTypes":79,"./ReactServerRendering":83,"./ReactTextComponent":87,"./onlyChild":151,"qvMYcC":161}],37:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactBrowserComponentMixin
 */

"use strict";

var ReactMount = require("./ReactMount");

var invariant = require("./invariant");

var ReactBrowserComponentMixin = {
  /**
   * Returns the DOM node rendered by this component.
   *
   * @return {DOMElement} The root node of this component.
   * @final
   * @protected
   */
  getDOMNode: function() {
    ("production" !== process.env.NODE_ENV ? invariant(
      this.isMounted(),
      'getDOMNode(): A component must be mounted to have a DOM node.'
    ) : invariant(this.isMounted()));
    return ReactMount.getNode(this._rootNodeID);
  }
};

module.exports = ReactBrowserComponentMixin;

}).call(this,require("qvMYcC"))
},{"./ReactMount":70,"./invariant":135,"qvMYcC":161}],38:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @typechecks
 * @providesModule ReactCSSTransitionGroup
 */

"use strict";

var React = require("./React");

var ReactTransitionGroup = require("./ReactTransitionGroup");
var ReactCSSTransitionGroupChild = require("./ReactCSSTransitionGroupChild");

var ReactCSSTransitionGroup = React.createClass({
  propTypes: {
    transitionName: React.PropTypes.string.isRequired,
    transitionEnter: React.PropTypes.bool,
    transitionLeave: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      transitionEnter: true,
      transitionLeave: true
    };
  },

  _wrapChild: function(child) {
    // We need to provide this childFactory so that
    // ReactCSSTransitionGroupChild can receive updates to name, enter, and
    // leave while it is leaving.
    return ReactCSSTransitionGroupChild(
      {
        name: this.props.transitionName,
        enter: this.props.transitionEnter,
        leave: this.props.transitionLeave
      },
      child
    );
  },

  render: function() {
    return this.transferPropsTo(
      ReactTransitionGroup(
        {childFactory: this._wrapChild},
        this.props.children
      )
    );
  }
});

module.exports = ReactCSSTransitionGroup;

},{"./React":36,"./ReactCSSTransitionGroupChild":39,"./ReactTransitionGroup":90}],39:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @typechecks
 * @providesModule ReactCSSTransitionGroupChild
 */

"use strict";

var React = require("./React");

var CSSCore = require("./CSSCore");
var ReactTransitionEvents = require("./ReactTransitionEvents");

var onlyChild = require("./onlyChild");

// We don't remove the element from the DOM until we receive an animationend or
// transitionend event. If the user screws up and forgets to add an animation
// their node will be stuck in the DOM forever, so we detect if an animation
// does not start and if it doesn't, we just call the end listener immediately.
var TICK = 17;
var NO_EVENT_TIMEOUT = 5000;

var noEventListener = null;


if ("production" !== process.env.NODE_ENV) {
  noEventListener = function() {
    console.warn(
      'transition(): tried to perform an animation without ' +
      'an animationend or transitionend event after timeout (' +
      NO_EVENT_TIMEOUT + 'ms). You should either disable this ' +
      'transition in JS or add a CSS animation/transition.'
    );
  };
}

var ReactCSSTransitionGroupChild = React.createClass({
  transition: function(animationType, finishCallback) {
    var node = this.getDOMNode();
    var className = this.props.name + '-' + animationType;
    var activeClassName = className + '-active';
    var noEventTimeout = null;

    var endListener = function() {
      if ("production" !== process.env.NODE_ENV) {
        clearTimeout(noEventTimeout);
      }

      CSSCore.removeClass(node, className);
      CSSCore.removeClass(node, activeClassName);

      ReactTransitionEvents.removeEndEventListener(node, endListener);

      // Usually this optional callback is used for informing an owner of
      // a leave animation and telling it to remove the child.
      finishCallback && finishCallback();
    };

    ReactTransitionEvents.addEndEventListener(node, endListener);

    CSSCore.addClass(node, className);

    // Need to do this to actually trigger a transition.
    this.queueClass(activeClassName);

    if ("production" !== process.env.NODE_ENV) {
      noEventTimeout = setTimeout(noEventListener, NO_EVENT_TIMEOUT);
    }
  },

  queueClass: function(className) {
    this.classNameQueue.push(className);

    if (this.props.runNextTick) {
      this.props.runNextTick(this.flushClassNameQueue);
      return;
    }

    if (!this.timeout) {
      this.timeout = setTimeout(this.flushClassNameQueue, TICK);
    }
  },

  flushClassNameQueue: function() {
    if (this.isMounted()) {
      this.classNameQueue.forEach(
        CSSCore.addClass.bind(CSSCore, this.getDOMNode())
      );
    }
    this.classNameQueue.length = 0;
    this.timeout = null;
  },

  componentWillMount: function() {
    this.classNameQueue = [];
  },

  componentWillUnmount: function() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  },

  componentWillEnter: function(done) {
    if (this.props.enter) {
      this.transition('enter', done);
    } else {
      done();
    }
  },

  componentWillLeave: function(done) {
    if (this.props.leave) {
      this.transition('leave', done);
    } else {
      done();
    }
  },

  render: function() {
    return onlyChild(this.props.children);
  }
});

module.exports = ReactCSSTransitionGroupChild;

}).call(this,require("qvMYcC"))
},{"./CSSCore":12,"./React":36,"./ReactTransitionEvents":89,"./onlyChild":151,"qvMYcC":161}],40:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactChildren
 */

"use strict";

var PooledClass = require("./PooledClass");

var invariant = require("./invariant");
var traverseAllChildren = require("./traverseAllChildren");

var twoArgumentPooler = PooledClass.twoArgumentPooler;
var threeArgumentPooler = PooledClass.threeArgumentPooler;

/**
 * PooledClass representing the bookkeeping associated with performing a child
 * traversal. Allows avoiding binding callbacks.
 *
 * @constructor ForEachBookKeeping
 * @param {!function} forEachFunction Function to perform traversal with.
 * @param {?*} forEachContext Context to perform context with.
 */
function ForEachBookKeeping(forEachFunction, forEachContext) {
  this.forEachFunction = forEachFunction;
  this.forEachContext = forEachContext;
}
PooledClass.addPoolingTo(ForEachBookKeeping, twoArgumentPooler);

function forEachSingleChild(traverseContext, child, name, i) {
  var forEachBookKeeping = traverseContext;
  forEachBookKeeping.forEachFunction.call(
    forEachBookKeeping.forEachContext, child, i);
}

/**
 * Iterates through children that are typically specified as `props.children`.
 *
 * The provided forEachFunc(child, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} forEachFunc.
 * @param {*} forEachContext Context for forEachContext.
 */
function forEachChildren(children, forEachFunc, forEachContext) {
  if (children == null) {
    return children;
  }

  var traverseContext =
    ForEachBookKeeping.getPooled(forEachFunc, forEachContext);
  traverseAllChildren(children, forEachSingleChild, traverseContext);
  ForEachBookKeeping.release(traverseContext);
}

/**
 * PooledClass representing the bookkeeping associated with performing a child
 * mapping. Allows avoiding binding callbacks.
 *
 * @constructor MapBookKeeping
 * @param {!*} mapResult Object containing the ordered map of results.
 * @param {!function} mapFunction Function to perform mapping with.
 * @param {?*} mapContext Context to perform mapping with.
 */
function MapBookKeeping(mapResult, mapFunction, mapContext) {
  this.mapResult = mapResult;
  this.mapFunction = mapFunction;
  this.mapContext = mapContext;
}
PooledClass.addPoolingTo(MapBookKeeping, threeArgumentPooler);

function mapSingleChildIntoContext(traverseContext, child, name, i) {
  var mapBookKeeping = traverseContext;
  var mapResult = mapBookKeeping.mapResult;
  var mappedChild =
    mapBookKeeping.mapFunction.call(mapBookKeeping.mapContext, child, i);
  // We found a component instance
  ("production" !== process.env.NODE_ENV ? invariant(
    !mapResult.hasOwnProperty(name),
    'ReactChildren.map(...): Encountered two children with the same key, ' +
    '`%s`. Children keys must be unique.',
    name
  ) : invariant(!mapResult.hasOwnProperty(name)));
  mapResult[name] = mappedChild;
}

/**
 * Maps children that are typically specified as `props.children`.
 *
 * The provided mapFunction(child, key, index) will be called for each
 * leaf child.
 *
 * TODO: This may likely break any calls to `ReactChildren.map` that were
 * previously relying on the fact that we guarded against null children.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} mapFunction.
 * @param {*} mapContext Context for mapFunction.
 * @return {object} Object containing the ordered map of results.
 */
function mapChildren(children, func, context) {
  if (children == null) {
    return children;
  }

  var mapResult = {};
  var traverseContext = MapBookKeeping.getPooled(mapResult, func, context);
  traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
  MapBookKeeping.release(traverseContext);
  return mapResult;
}

var ReactChildren = {
  forEach: forEachChildren,
  map: mapChildren
};

module.exports = ReactChildren;

}).call(this,require("qvMYcC"))
},{"./PooledClass":35,"./invariant":135,"./traverseAllChildren":156,"qvMYcC":161}],41:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactComponent
 */

"use strict";

var ReactCurrentOwner = require("./ReactCurrentOwner");
var ReactOwner = require("./ReactOwner");
var ReactUpdates = require("./ReactUpdates");

var invariant = require("./invariant");
var keyMirror = require("./keyMirror");
var merge = require("./merge");
var monitorCodeUse = require("./monitorCodeUse");

/**
 * Every React component is in one of these life cycles.
 */
var ComponentLifeCycle = keyMirror({
  /**
   * Mounted components have a DOM node representation and are capable of
   * receiving new props.
   */
  MOUNTED: null,
  /**
   * Unmounted components are inactive and cannot receive new props.
   */
  UNMOUNTED: null
});

/**
 * Warn if there's no key explicitly set on dynamic arrays of children or
 * object keys are not valid. This allows us to keep track of children between
 * updates.
 */

var ownerHasExplicitKeyWarning = {};
var ownerHasPropertyWarning = {};
var ownerHasMonitoredObjectMap = {};

var NUMERIC_PROPERTY_REGEX = /^\d+$/;

var injected = false;

/**
 * Optionally injectable environment dependent cleanup hook. (server vs.
 * browser etc). Example: A browser system caches DOM nodes based on component
 * ID and must remove that cache entry when this instance is unmounted.
 *
 * @private
 */
var unmountIDFromEnvironment = null;

/**
 * The "image" of a component tree, is the platform specific (typically
 * serialized) data that represents a tree of lower level UI building blocks.
 * On the web, this "image" is HTML markup which describes a construction of
 * low level `div` and `span` nodes. Other platforms may have different
 * encoding of this "image". This must be injected.
 *
 * @private
 */
var mountImageIntoNode = null;

/**
 * Warn if the component doesn't have an explicit key assigned to it.
 * This component is in an array. The array could grow and shrink or be
 * reordered. All children that haven't already been validated are required to
 * have a "key" property assigned to it.
 *
 * @internal
 * @param {ReactComponent} component Component that requires a key.
 */
function validateExplicitKey(component) {
  if (component.__keyValidated__ || component.props.key != null) {
    return;
  }
  component.__keyValidated__ = true;

  // We can't provide friendly warnings for top level components.
  if (!ReactCurrentOwner.current) {
    return;
  }

  // Name of the component whose render method tried to pass children.
  var currentName = ReactCurrentOwner.current.constructor.displayName;
  if (ownerHasExplicitKeyWarning.hasOwnProperty(currentName)) {
    return;
  }
  ownerHasExplicitKeyWarning[currentName] = true;

  var message = 'Each child in an array should have a unique "key" prop. ' +
                'Check the render method of ' + currentName + '.';

  var childOwnerName = null;
  if (!component.isOwnedBy(ReactCurrentOwner.current)) {
    // Name of the component that originally created this child.
    childOwnerName =
      component._owner &&
      component._owner.constructor.displayName;

    // Usually the current owner is the offender, but if it accepts
    // children as a property, it may be the creator of the child that's
    // responsible for assigning it a key.
    message += ' It was passed a child from ' + childOwnerName + '.';
  }

  message += ' See http://fb.me/react-warning-keys for more information.';
  monitorCodeUse('react_key_warning', {
    component: currentName,
    componentOwner: childOwnerName
  });
  console.warn(message);
}

/**
 * Warn if the key is being defined as an object property but has an incorrect
 * value.
 *
 * @internal
 * @param {string} name Property name of the key.
 * @param {ReactComponent} component Component that requires a key.
 */
function validatePropertyKey(name) {
  if (NUMERIC_PROPERTY_REGEX.test(name)) {
    // Name of the component whose render method tried to pass children.
    var currentName = ReactCurrentOwner.current.constructor.displayName;
    if (ownerHasPropertyWarning.hasOwnProperty(currentName)) {
      return;
    }
    ownerHasPropertyWarning[currentName] = true;

    monitorCodeUse('react_numeric_key_warning');
    console.warn(
      'Child objects should have non-numeric keys so ordering is preserved. ' +
      'Check the render method of ' + currentName + '. ' +
      'See http://fb.me/react-warning-keys for more information.'
    );
  }
}

/**
 * Log that we're using an object map. We're considering deprecating this
 * feature and replace it with proper Map and ImmutableMap data structures.
 *
 * @internal
 */
function monitorUseOfObjectMap() {
  // Name of the component whose render method tried to pass children.
  // We only use this to avoid spewing the logs. We lose additional
  // owner stacks but hopefully one level is enough to trace the source.
  var currentName = (ReactCurrentOwner.current &&
                    ReactCurrentOwner.current.constructor.displayName) || '';
  if (ownerHasMonitoredObjectMap.hasOwnProperty(currentName)) {
    return;
  }
  ownerHasMonitoredObjectMap[currentName] = true;
  monitorCodeUse('react_object_map_children');
}

/**
 * Ensure that every component either is passed in a static location, in an
 * array with an explicit keys property defined, or in an object literal
 * with valid key property.
 *
 * @internal
 * @param {*} component Statically passed child of any type.
 * @return {boolean}
 */
function validateChildKeys(component) {
  if (Array.isArray(component)) {
    for (var i = 0; i < component.length; i++) {
      var child = component[i];
      if (ReactComponent.isValidComponent(child)) {
        validateExplicitKey(child);
      }
    }
  } else if (ReactComponent.isValidComponent(component)) {
    // This component was passed in a valid location.
    component.__keyValidated__ = true;
  } else if (component && typeof component === 'object') {
    monitorUseOfObjectMap();
    for (var name in component) {
      validatePropertyKey(name, component);
    }
  }
}

/**
 * Components are the basic units of composition in React.
 *
 * Every component accepts a set of keyed input parameters known as "props" that
 * are initialized by the constructor. Once a component is mounted, the props
 * can be mutated using `setProps` or `replaceProps`.
 *
 * Every component is capable of the following operations:
 *
 *   `mountComponent`
 *     Initializes the component, renders markup, and registers event listeners.
 *
 *   `receiveComponent`
 *     Updates the rendered DOM nodes to match the given component.
 *
 *   `unmountComponent`
 *     Releases any resources allocated by this component.
 *
 * Components can also be "owned" by other components. Being owned by another
 * component means being constructed by that component. This is different from
 * being the child of a component, which means having a DOM representation that
 * is a child of the DOM representation of that component.
 *
 * @class ReactComponent
 */
var ReactComponent = {

  injection: {
    injectEnvironment: function(ReactComponentEnvironment) {
      ("production" !== process.env.NODE_ENV ? invariant(
        !injected,
        'ReactComponent: injectEnvironment() can only be called once.'
      ) : invariant(!injected));
      mountImageIntoNode = ReactComponentEnvironment.mountImageIntoNode;
      unmountIDFromEnvironment =
        ReactComponentEnvironment.unmountIDFromEnvironment;
      ReactComponent.BackendIDOperations =
        ReactComponentEnvironment.BackendIDOperations;
      ReactComponent.ReactReconcileTransaction =
        ReactComponentEnvironment.ReactReconcileTransaction;
      injected = true;
    }
  },

  /**
   * @param {?object} object
   * @return {boolean} True if `object` is a valid component.
   * @final
   */
  isValidComponent: function(object) {
    if (!object || !object.type || !object.type.prototype) {
      return false;
    }
    // This is the safer way of duck checking the type of instance this is.
    // The object can be a generic descriptor but the type property refers to
    // the constructor and it's prototype can be used to inspect the type that
    // will actually get mounted.
    var prototype = object.type.prototype;
    return (
      typeof prototype.mountComponentIntoNode === 'function' &&
      typeof prototype.receiveComponent === 'function'
    );
  },

  /**
   * @internal
   */
  LifeCycle: ComponentLifeCycle,

  /**
   * Injected module that provides ability to mutate individual properties.
   * Injected into the base class because many different subclasses need access
   * to this.
   *
   * @internal
   */
  BackendIDOperations: null,

  /**
   * React references `ReactReconcileTransaction` using this property in order
   * to allow dependency injection.
   *
   * @internal
   */
  ReactReconcileTransaction: null,

  /**
   * Base functionality for every ReactComponent constructor. Mixed into the
   * `ReactComponent` prototype, but exposed statically for easy access.
   *
   * @lends {ReactComponent.prototype}
   */
  Mixin: {

    /**
     * Checks whether or not this component is mounted.
     *
     * @return {boolean} True if mounted, false otherwise.
     * @final
     * @protected
     */
    isMounted: function() {
      return this._lifeCycleState === ComponentLifeCycle.MOUNTED;
    },

    /**
     * Sets a subset of the props.
     *
     * @param {object} partialProps Subset of the next props.
     * @param {?function} callback Called after props are updated.
     * @final
     * @public
     */
    setProps: function(partialProps, callback) {
      // Merge with `_pendingProps` if it exists, otherwise with existing props.
      this.replaceProps(
        merge(this._pendingProps || this.props, partialProps),
        callback
      );
    },

    /**
     * Replaces all of the props.
     *
     * @param {object} props New props.
     * @param {?function} callback Called after props are updated.
     * @final
     * @public
     */
    replaceProps: function(props, callback) {
      ("production" !== process.env.NODE_ENV ? invariant(
        this.isMounted(),
        'replaceProps(...): Can only update a mounted component.'
      ) : invariant(this.isMounted()));
      ("production" !== process.env.NODE_ENV ? invariant(
        this._mountDepth === 0,
        'replaceProps(...): You called `setProps` or `replaceProps` on a ' +
        'component with a parent. This is an anti-pattern since props will ' +
        'get reactively updated when rendered. Instead, change the owner\'s ' +
        '`render` method to pass the correct value as props to the component ' +
        'where it is created.'
      ) : invariant(this._mountDepth === 0));
      this._pendingProps = props;
      ReactUpdates.enqueueUpdate(this, callback);
    },

    /**
     * Base constructor for all React components.
     *
     * Subclasses that override this method should make sure to invoke
     * `ReactComponent.Mixin.construct.call(this, ...)`.
     *
     * @param {?object} initialProps
     * @param {*} children
     * @internal
     */
    construct: function(initialProps, children) {
      this.props = initialProps || {};
      // Record the component responsible for creating this component.
      this._owner = ReactCurrentOwner.current;
      // All components start unmounted.
      this._lifeCycleState = ComponentLifeCycle.UNMOUNTED;

      this._pendingProps = null;
      this._pendingCallbacks = null;

      // Unlike _pendingProps and _pendingCallbacks, we won't use null to
      // indicate that nothing is pending because it's possible for a component
      // to have a null owner. Instead, an owner change is pending when
      // this._owner !== this._pendingOwner.
      this._pendingOwner = this._owner;

      // Children can be more than one argument
      var childrenLength = arguments.length - 1;
      if (childrenLength === 1) {
        if ("production" !== process.env.NODE_ENV) {
          validateChildKeys(children);
        }
        this.props.children = children;
      } else if (childrenLength > 1) {
        var childArray = Array(childrenLength);
        for (var i = 0; i < childrenLength; i++) {
          if ("production" !== process.env.NODE_ENV) {
            validateChildKeys(arguments[i + 1]);
          }
          childArray[i] = arguments[i + 1];
        }
        this.props.children = childArray;
      }
    },

    /**
     * Initializes the component, renders markup, and registers event listeners.
     *
     * NOTE: This does not insert any nodes into the DOM.
     *
     * Subclasses that override this method should make sure to invoke
     * `ReactComponent.Mixin.mountComponent.call(this, ...)`.
     *
     * @param {string} rootID DOM ID of the root node.
     * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
     * @param {number} mountDepth number of components in the owner hierarchy.
     * @return {?string} Rendered markup to be inserted into the DOM.
     * @internal
     */
    mountComponent: function(rootID, transaction, mountDepth) {
      ("production" !== process.env.NODE_ENV ? invariant(
        !this.isMounted(),
        'mountComponent(%s, ...): Can only mount an unmounted component. ' +
        'Make sure to avoid storing components between renders or reusing a ' +
        'single component instance in multiple places.',
        rootID
      ) : invariant(!this.isMounted()));
      var props = this.props;
      if (props.ref != null) {
        ReactOwner.addComponentAsRefTo(this, props.ref, this._owner);
      }
      this._rootNodeID = rootID;
      this._lifeCycleState = ComponentLifeCycle.MOUNTED;
      this._mountDepth = mountDepth;
      // Effectively: return '';
    },

    /**
     * Releases any resources allocated by `mountComponent`.
     *
     * NOTE: This does not remove any nodes from the DOM.
     *
     * Subclasses that override this method should make sure to invoke
     * `ReactComponent.Mixin.unmountComponent.call(this)`.
     *
     * @internal
     */
    unmountComponent: function() {
      ("production" !== process.env.NODE_ENV ? invariant(
        this.isMounted(),
        'unmountComponent(): Can only unmount a mounted component.'
      ) : invariant(this.isMounted()));
      var props = this.props;
      if (props.ref != null) {
        ReactOwner.removeComponentAsRefFrom(this, props.ref, this._owner);
      }
      unmountIDFromEnvironment(this._rootNodeID);
      this._rootNodeID = null;
      this._lifeCycleState = ComponentLifeCycle.UNMOUNTED;
    },

    /**
     * Given a new instance of this component, updates the rendered DOM nodes
     * as if that instance was rendered instead.
     *
     * Subclasses that override this method should make sure to invoke
     * `ReactComponent.Mixin.receiveComponent.call(this, ...)`.
     *
     * @param {object} nextComponent Next set of properties.
     * @param {ReactReconcileTransaction} transaction
     * @internal
     */
    receiveComponent: function(nextComponent, transaction) {
      ("production" !== process.env.NODE_ENV ? invariant(
        this.isMounted(),
        'receiveComponent(...): Can only update a mounted component.'
      ) : invariant(this.isMounted()));
      this._pendingOwner = nextComponent._owner;
      this._pendingProps = nextComponent.props;
      this._performUpdateIfNecessary(transaction);
    },

    /**
     * Call `_performUpdateIfNecessary` within a new transaction.
     *
     * @internal
     */
    performUpdateIfNecessary: function() {
      var transaction = ReactComponent.ReactReconcileTransaction.getPooled();
      transaction.perform(this._performUpdateIfNecessary, this, transaction);
      ReactComponent.ReactReconcileTransaction.release(transaction);
    },

    /**
     * If `_pendingProps` is set, update the component.
     *
     * @param {ReactReconcileTransaction} transaction
     * @internal
     */
    _performUpdateIfNecessary: function(transaction) {
      if (this._pendingProps == null) {
        return;
      }
      var prevProps = this.props;
      var prevOwner = this._owner;
      this.props = this._pendingProps;
      this._owner = this._pendingOwner;
      this._pendingProps = null;
      this.updateComponent(transaction, prevProps, prevOwner);
    },

    /**
     * Updates the component's currently mounted representation.
     *
     * @param {ReactReconcileTransaction} transaction
     * @param {object} prevProps
     * @internal
     */
    updateComponent: function(transaction, prevProps, prevOwner) {
      var props = this.props;
      // If either the owner or a `ref` has changed, make sure the newest owner
      // has stored a reference to `this`, and the previous owner (if different)
      // has forgotten the reference to `this`.
      if (this._owner !== prevOwner || props.ref !== prevProps.ref) {
        if (prevProps.ref != null) {
          ReactOwner.removeComponentAsRefFrom(
            this, prevProps.ref, prevOwner
          );
        }
        // Correct, even if the owner is the same, and only the ref has changed.
        if (props.ref != null) {
          ReactOwner.addComponentAsRefTo(this, props.ref, this._owner);
        }
      }
    },

    /**
     * Mounts this component and inserts it into the DOM.
     *
     * @param {string} rootID DOM ID of the root node.
     * @param {DOMElement} container DOM element to mount into.
     * @param {boolean} shouldReuseMarkup If true, do not insert markup
     * @final
     * @internal
     * @see {ReactMount.renderComponent}
     */
    mountComponentIntoNode: function(rootID, container, shouldReuseMarkup) {
      var transaction = ReactComponent.ReactReconcileTransaction.getPooled();
      transaction.perform(
        this._mountComponentIntoNode,
        this,
        rootID,
        container,
        transaction,
        shouldReuseMarkup
      );
      ReactComponent.ReactReconcileTransaction.release(transaction);
    },

    /**
     * @param {string} rootID DOM ID of the root node.
     * @param {DOMElement} container DOM element to mount into.
     * @param {ReactReconcileTransaction} transaction
     * @param {boolean} shouldReuseMarkup If true, do not insert markup
     * @final
     * @private
     */
    _mountComponentIntoNode: function(
        rootID,
        container,
        transaction,
        shouldReuseMarkup) {
      var markup = this.mountComponent(rootID, transaction, 0);
      mountImageIntoNode(markup, container, shouldReuseMarkup);
    },

    /**
     * Checks if this component is owned by the supplied `owner` component.
     *
     * @param {ReactComponent} owner Component to check.
     * @return {boolean} True if `owners` owns this component.
     * @final
     * @internal
     */
    isOwnedBy: function(owner) {
      return this._owner === owner;
    },

    /**
     * Gets another component, that shares the same owner as this one, by ref.
     *
     * @param {string} ref of a sibling Component.
     * @return {?ReactComponent} the actual sibling Component.
     * @final
     * @internal
     */
    getSiblingByRef: function(ref) {
      var owner = this._owner;
      if (!owner || !owner.refs) {
        return null;
      }
      return owner.refs[ref];
    }
  }
};

module.exports = ReactComponent;

}).call(this,require("qvMYcC"))
},{"./ReactCurrentOwner":45,"./ReactOwner":74,"./ReactUpdates":91,"./invariant":135,"./keyMirror":141,"./merge":144,"./monitorCodeUse":148,"qvMYcC":161}],42:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactComponentBrowserEnvironment
 */

/*jslint evil: true */

"use strict";

var ReactDOMIDOperations = require("./ReactDOMIDOperations");
var ReactMarkupChecksum = require("./ReactMarkupChecksum");
var ReactMount = require("./ReactMount");
var ReactPerf = require("./ReactPerf");
var ReactReconcileTransaction = require("./ReactReconcileTransaction");

var getReactRootElementInContainer = require("./getReactRootElementInContainer");
var invariant = require("./invariant");


var ELEMENT_NODE_TYPE = 1;
var DOC_NODE_TYPE = 9;


/**
 * Abstracts away all functionality of `ReactComponent` requires knowledge of
 * the browser context.
 */
var ReactComponentBrowserEnvironment = {
  ReactReconcileTransaction: ReactReconcileTransaction,

  BackendIDOperations: ReactDOMIDOperations,

  /**
   * If a particular environment requires that some resources be cleaned up,
   * specify this in the injected Mixin. In the DOM, we would likely want to
   * purge any cached node ID lookups.
   *
   * @private
   */
  unmountIDFromEnvironment: function(rootNodeID) {
    ReactMount.purgeID(rootNodeID);
  },

  /**
   * @param {string} markup Markup string to place into the DOM Element.
   * @param {DOMElement} container DOM Element to insert markup into.
   * @param {boolean} shouldReuseMarkup Should reuse the existing markup in the
   * container if possible.
   */
  mountImageIntoNode: ReactPerf.measure(
    'ReactComponentBrowserEnvironment',
    'mountImageIntoNode',
    function(markup, container, shouldReuseMarkup) {
      ("production" !== process.env.NODE_ENV ? invariant(
        container && (
          container.nodeType === ELEMENT_NODE_TYPE ||
            container.nodeType === DOC_NODE_TYPE
        ),
        'mountComponentIntoNode(...): Target container is not valid.'
      ) : invariant(container && (
        container.nodeType === ELEMENT_NODE_TYPE ||
          container.nodeType === DOC_NODE_TYPE
      )));

      if (shouldReuseMarkup) {
        if (ReactMarkupChecksum.canReuseMarkup(
          markup,
          getReactRootElementInContainer(container))) {
          return;
        } else {
          ("production" !== process.env.NODE_ENV ? invariant(
            container.nodeType !== DOC_NODE_TYPE,
            'You\'re trying to render a component to the document using ' +
            'server rendering but the checksum was invalid. This usually ' +
            'means you rendered a different component type or props on ' +
            'the client from the one on the server, or your render() ' +
            'methods are impure. React cannot handle this case due to ' +
            'cross-browser quirks by rendering at the document root. You ' +
            'should look for environment dependent code in your components ' +
            'and ensure the props are the same client and server side.'
          ) : invariant(container.nodeType !== DOC_NODE_TYPE));

          if ("production" !== process.env.NODE_ENV) {
            console.warn(
              'React attempted to use reuse markup in a container but the ' +
              'checksum was invalid. This generally means that you are ' +
              'using server rendering and the markup generated on the ' +
              'server was not what the client was expecting. React injected' +
              'new markup to compensate which works but you have lost many ' +
              'of the benefits of server rendering. Instead, figure out ' +
              'why the markup being generated is different on the client ' +
              'or server.'
            );
          }
        }
      }

      ("production" !== process.env.NODE_ENV ? invariant(
        container.nodeType !== DOC_NODE_TYPE,
        'You\'re trying to render a component to the document but ' +
          'you didn\'t use server rendering. We can\'t do this ' +
          'without using server rendering due to cross-browser quirks. ' +
          'See renderComponentToString() for server rendering.'
      ) : invariant(container.nodeType !== DOC_NODE_TYPE));

      container.innerHTML = markup;
    }
  )
};

module.exports = ReactComponentBrowserEnvironment;

}).call(this,require("qvMYcC"))
},{"./ReactDOMIDOperations":50,"./ReactMarkupChecksum":69,"./ReactMount":70,"./ReactPerf":75,"./ReactReconcileTransaction":81,"./getReactRootElementInContainer":130,"./invariant":135,"qvMYcC":161}],43:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactCompositeComponent
 */

"use strict";

var ReactComponent = require("./ReactComponent");
var ReactContext = require("./ReactContext");
var ReactCurrentOwner = require("./ReactCurrentOwner");
var ReactErrorUtils = require("./ReactErrorUtils");
var ReactOwner = require("./ReactOwner");
var ReactPerf = require("./ReactPerf");
var ReactPropTransferer = require("./ReactPropTransferer");
var ReactPropTypeLocations = require("./ReactPropTypeLocations");
var ReactPropTypeLocationNames = require("./ReactPropTypeLocationNames");
var ReactUpdates = require("./ReactUpdates");

var instantiateReactComponent = require("./instantiateReactComponent");
var invariant = require("./invariant");
var keyMirror = require("./keyMirror");
var merge = require("./merge");
var mixInto = require("./mixInto");
var monitorCodeUse = require("./monitorCodeUse");
var objMap = require("./objMap");
var shouldUpdateReactComponent = require("./shouldUpdateReactComponent");
var warning = require("./warning");

/**
 * Policies that describe methods in `ReactCompositeComponentInterface`.
 */
var SpecPolicy = keyMirror({
  /**
   * These methods may be defined only once by the class specification or mixin.
   */
  DEFINE_ONCE: null,
  /**
   * These methods may be defined by both the class specification and mixins.
   * Subsequent definitions will be chained. These methods must return void.
   */
  DEFINE_MANY: null,
  /**
   * These methods are overriding the base ReactCompositeComponent class.
   */
  OVERRIDE_BASE: null,
  /**
   * These methods are similar to DEFINE_MANY, except we assume they return
   * objects. We try to merge the keys of the return values of all the mixed in
   * functions. If there is a key conflict we throw.
   */
  DEFINE_MANY_MERGED: null
});


var injectedMixins = [];

/**
 * Composite components are higher-level components that compose other composite
 * or native components.
 *
 * To create a new type of `ReactCompositeComponent`, pass a specification of
 * your new class to `React.createClass`. The only requirement of your class
 * specification is that you implement a `render` method.
 *
 *   var MyComponent = React.createClass({
 *     render: function() {
 *       return <div>Hello World</div>;
 *     }
 *   });
 *
 * The class specification supports a specific protocol of methods that have
 * special meaning (e.g. `render`). See `ReactCompositeComponentInterface` for
 * more the comprehensive protocol. Any other properties and methods in the
 * class specification will available on the prototype.
 *
 * @interface ReactCompositeComponentInterface
 * @internal
 */
var ReactCompositeComponentInterface = {

  /**
   * An array of Mixin objects to include when defining your component.
   *
   * @type {array}
   * @optional
   */
  mixins: SpecPolicy.DEFINE_MANY,

  /**
   * An object containing properties and methods that should be defined on
   * the component's constructor instead of its prototype (static methods).
   *
   * @type {object}
   * @optional
   */
  statics: SpecPolicy.DEFINE_MANY,

  /**
   * Definition of prop types for this component.
   *
   * @type {object}
   * @optional
   */
  propTypes: SpecPolicy.DEFINE_MANY,

  /**
   * Definition of context types for this component.
   *
   * @type {object}
   * @optional
   */
  contextTypes: SpecPolicy.DEFINE_MANY,

  /**
   * Definition of context types this component sets for its children.
   *
   * @type {object}
   * @optional
   */
  childContextTypes: SpecPolicy.DEFINE_MANY,

  // ==== Definition methods ====

  /**
   * Invoked when the component is mounted. Values in the mapping will be set on
   * `this.props` if that prop is not specified (i.e. using an `in` check).
   *
   * This method is invoked before `getInitialState` and therefore cannot rely
   * on `this.state` or use `this.setState`.
   *
   * @return {object}
   * @optional
   */
  getDefaultProps: SpecPolicy.DEFINE_MANY_MERGED,

  /**
   * Invoked once before the component is mounted. The return value will be used
   * as the initial value of `this.state`.
   *
   *   getInitialState: function() {
   *     return {
   *       isOn: false,
   *       fooBaz: new BazFoo()
   *     }
   *   }
   *
   * @return {object}
   * @optional
   */
  getInitialState: SpecPolicy.DEFINE_MANY_MERGED,

  /**
   * @return {object}
   * @optional
   */
  getChildContext: SpecPolicy.DEFINE_MANY_MERGED,

  /**
   * Uses props from `this.props` and state from `this.state` to render the
   * structure of the component.
   *
   * No guarantees are made about when or how often this method is invoked, so
   * it must not have side effects.
   *
   *   render: function() {
   *     var name = this.props.name;
   *     return <div>Hello, {name}!</div>;
   *   }
   *
   * @return {ReactComponent}
   * @nosideeffects
   * @required
   */
  render: SpecPolicy.DEFINE_ONCE,



  // ==== Delegate methods ====

  /**
   * Invoked when the component is initially created and about to be mounted.
   * This may have side effects, but any external subscriptions or data created
   * by this method must be cleaned up in `componentWillUnmount`.
   *
   * @optional
   */
  componentWillMount: SpecPolicy.DEFINE_MANY,

  /**
   * Invoked when the component has been mounted and has a DOM representation.
   * However, there is no guarantee that the DOM node is in the document.
   *
   * Use this as an opportunity to operate on the DOM when the component has
   * been mounted (initialized and rendered) for the first time.
   *
   * @param {DOMElement} rootNode DOM element representing the component.
   * @optional
   */
  componentDidMount: SpecPolicy.DEFINE_MANY,

  /**
   * Invoked before the component receives new props.
   *
   * Use this as an opportunity to react to a prop transition by updating the
   * state using `this.setState`. Current props are accessed via `this.props`.
   *
   *   componentWillReceiveProps: function(nextProps, nextContext) {
   *     this.setState({
   *       likesIncreasing: nextProps.likeCount > this.props.likeCount
   *     });
   *   }
   *
   * NOTE: There is no equivalent `componentWillReceiveState`. An incoming prop
   * transition may cause a state change, but the opposite is not true. If you
   * need it, you are probably looking for `componentWillUpdate`.
   *
   * @param {object} nextProps
   * @optional
   */
  componentWillReceiveProps: SpecPolicy.DEFINE_MANY,

  /**
   * Invoked while deciding if the component should be updated as a result of
   * receiving new props, state and/or context.
   *
   * Use this as an opportunity to `return false` when you're certain that the
   * transition to the new props/state/context will not require a component
   * update.
   *
   *   shouldComponentUpdate: function(nextProps, nextState, nextContext) {
   *     return !equal(nextProps, this.props) ||
   *       !equal(nextState, this.state) ||
   *       !equal(nextContext, this.context);
   *   }
   *
   * @param {object} nextProps
   * @param {?object} nextState
   * @param {?object} nextContext
   * @return {boolean} True if the component should update.
   * @optional
   */
  shouldComponentUpdate: SpecPolicy.DEFINE_ONCE,

  /**
   * Invoked when the component is about to update due to a transition from
   * `this.props`, `this.state` and `this.context` to `nextProps`, `nextState`
   * and `nextContext`.
   *
   * Use this as an opportunity to perform preparation before an update occurs.
   *
   * NOTE: You **cannot** use `this.setState()` in this method.
   *
   * @param {object} nextProps
   * @param {?object} nextState
   * @param {?object} nextContext
   * @param {ReactReconcileTransaction} transaction
   * @optional
   */
  componentWillUpdate: SpecPolicy.DEFINE_MANY,

  /**
   * Invoked when the component's DOM representation has been updated.
   *
   * Use this as an opportunity to operate on the DOM when the component has
   * been updated.
   *
   * @param {object} prevProps
   * @param {?object} prevState
   * @param {?object} prevContext
   * @param {DOMElement} rootNode DOM element representing the component.
   * @optional
   */
  componentDidUpdate: SpecPolicy.DEFINE_MANY,

  /**
   * Invoked when the component is about to be removed from its parent and have
   * its DOM representation destroyed.
   *
   * Use this as an opportunity to deallocate any external resources.
   *
   * NOTE: There is no `componentDidUnmount` since your component will have been
   * destroyed by that point.
   *
   * @optional
   */
  componentWillUnmount: SpecPolicy.DEFINE_MANY,



  // ==== Advanced methods ====

  /**
   * Updates the component's currently mounted DOM representation.
   *
   * By default, this implements React's rendering and reconciliation algorithm.
   * Sophisticated clients may wish to override this.
   *
   * @param {ReactReconcileTransaction} transaction
   * @internal
   * @overridable
   */
  updateComponent: SpecPolicy.OVERRIDE_BASE

};

/**
 * Mapping from class specification keys to special processing functions.
 *
 * Although these are declared like instance properties in the specification
 * when defining classes using `React.createClass`, they are actually static
 * and are accessible on the constructor instead of the prototype. Despite
 * being static, they must be defined outside of the "statics" key under
 * which all other static methods are defined.
 */
var RESERVED_SPEC_KEYS = {
  displayName: function(ConvenienceConstructor, displayName) {
    ConvenienceConstructor.componentConstructor.displayName = displayName;
  },
  mixins: function(ConvenienceConstructor, mixins) {
    if (mixins) {
      for (var i = 0; i < mixins.length; i++) {
        mixSpecIntoComponent(ConvenienceConstructor, mixins[i]);
      }
    }
  },
  childContextTypes: function(ConvenienceConstructor, childContextTypes) {
    var Constructor = ConvenienceConstructor.componentConstructor;
    validateTypeDef(
      Constructor,
      childContextTypes,
      ReactPropTypeLocations.childContext
    );
    Constructor.childContextTypes = merge(
      Constructor.childContextTypes,
      childContextTypes
    );
  },
  contextTypes: function(ConvenienceConstructor, contextTypes) {
    var Constructor = ConvenienceConstructor.componentConstructor;
    validateTypeDef(
      Constructor,
      contextTypes,
      ReactPropTypeLocations.context
    );
    Constructor.contextTypes = merge(Constructor.contextTypes, contextTypes);
  },
  propTypes: function(ConvenienceConstructor, propTypes) {
    var Constructor = ConvenienceConstructor.componentConstructor;
    validateTypeDef(
      Constructor,
      propTypes,
      ReactPropTypeLocations.prop
    );
    Constructor.propTypes = merge(Constructor.propTypes, propTypes);
  },
  statics: function(ConvenienceConstructor, statics) {
    mixStaticSpecIntoComponent(ConvenienceConstructor, statics);
  }
};

function validateTypeDef(Constructor, typeDef, location) {
  for (var propName in typeDef) {
    if (typeDef.hasOwnProperty(propName)) {
      ("production" !== process.env.NODE_ENV ? invariant(
        typeof typeDef[propName] == 'function',
        '%s: %s type `%s` is invalid; it must be a function, usually from ' +
        'React.PropTypes.',
        Constructor.displayName || 'ReactCompositeComponent',
        ReactPropTypeLocationNames[location],
        propName
      ) : invariant(typeof typeDef[propName] == 'function'));
    }
  }
}

function validateMethodOverride(proto, name) {
  var specPolicy = ReactCompositeComponentInterface[name];

  // Disallow overriding of base class methods unless explicitly allowed.
  if (ReactCompositeComponentMixin.hasOwnProperty(name)) {
    ("production" !== process.env.NODE_ENV ? invariant(
      specPolicy === SpecPolicy.OVERRIDE_BASE,
      'ReactCompositeComponentInterface: You are attempting to override ' +
      '`%s` from your class specification. Ensure that your method names ' +
      'do not overlap with React methods.',
      name
    ) : invariant(specPolicy === SpecPolicy.OVERRIDE_BASE));
  }

  // Disallow defining methods more than once unless explicitly allowed.
  if (proto.hasOwnProperty(name)) {
    ("production" !== process.env.NODE_ENV ? invariant(
      specPolicy === SpecPolicy.DEFINE_MANY ||
      specPolicy === SpecPolicy.DEFINE_MANY_MERGED,
      'ReactCompositeComponentInterface: You are attempting to define ' +
      '`%s` on your component more than once. This conflict may be due ' +
      'to a mixin.',
      name
    ) : invariant(specPolicy === SpecPolicy.DEFINE_MANY ||
    specPolicy === SpecPolicy.DEFINE_MANY_MERGED));
  }
}

function validateLifeCycleOnReplaceState(instance) {
  var compositeLifeCycleState = instance._compositeLifeCycleState;
  ("production" !== process.env.NODE_ENV ? invariant(
    instance.isMounted() ||
      compositeLifeCycleState === CompositeLifeCycle.MOUNTING,
    'replaceState(...): Can only update a mounted or mounting component.'
  ) : invariant(instance.isMounted() ||
    compositeLifeCycleState === CompositeLifeCycle.MOUNTING));
  ("production" !== process.env.NODE_ENV ? invariant(compositeLifeCycleState !== CompositeLifeCycle.RECEIVING_STATE,
    'replaceState(...): Cannot update during an existing state transition ' +
    '(such as within `render`). This could potentially cause an infinite ' +
    'loop so it is forbidden.'
  ) : invariant(compositeLifeCycleState !== CompositeLifeCycle.RECEIVING_STATE));
  ("production" !== process.env.NODE_ENV ? invariant(compositeLifeCycleState !== CompositeLifeCycle.UNMOUNTING,
    'replaceState(...): Cannot update while unmounting component. This ' +
    'usually means you called setState() on an unmounted component.'
  ) : invariant(compositeLifeCycleState !== CompositeLifeCycle.UNMOUNTING));
}

/**
 * Custom version of `mixInto` which handles policy validation and reserved
 * specification keys when building `ReactCompositeComponent` classses.
 */
function mixSpecIntoComponent(ConvenienceConstructor, spec) {
  ("production" !== process.env.NODE_ENV ? invariant(
    !isValidClass(spec),
    'ReactCompositeComponent: You\'re attempting to ' +
    'use a component class as a mixin. Instead, just use a regular object.'
  ) : invariant(!isValidClass(spec)));
  ("production" !== process.env.NODE_ENV ? invariant(
    !ReactComponent.isValidComponent(spec),
    'ReactCompositeComponent: You\'re attempting to ' +
    'use a component as a mixin. Instead, just use a regular object.'
  ) : invariant(!ReactComponent.isValidComponent(spec)));

  var Constructor = ConvenienceConstructor.componentConstructor;
  var proto = Constructor.prototype;
  for (var name in spec) {
    var property = spec[name];
    if (!spec.hasOwnProperty(name)) {
      continue;
    }

    validateMethodOverride(proto, name);

    if (RESERVED_SPEC_KEYS.hasOwnProperty(name)) {
      RESERVED_SPEC_KEYS[name](ConvenienceConstructor, property);
    } else {
      // Setup methods on prototype:
      // The following member methods should not be automatically bound:
      // 1. Expected ReactCompositeComponent methods (in the "interface").
      // 2. Overridden methods (that were mixed in).
      var isCompositeComponentMethod = name in ReactCompositeComponentInterface;
      var isInherited = name in proto;
      var markedDontBind = property && property.__reactDontBind;
      var isFunction = typeof property === 'function';
      var shouldAutoBind =
        isFunction &&
        !isCompositeComponentMethod &&
        !isInherited &&
        !markedDontBind;

      if (shouldAutoBind) {
        if (!proto.__reactAutoBindMap) {
          proto.__reactAutoBindMap = {};
        }
        proto.__reactAutoBindMap[name] = property;
        proto[name] = property;
      } else {
        if (isInherited) {
          // For methods which are defined more than once, call the existing
          // methods before calling the new property.
          if (ReactCompositeComponentInterface[name] ===
              SpecPolicy.DEFINE_MANY_MERGED) {
            proto[name] = createMergedResultFunction(proto[name], property);
          } else {
            proto[name] = createChainedFunction(proto[name], property);
          }
        } else {
          proto[name] = property;
        }
      }
    }
  }
}

function mixStaticSpecIntoComponent(ConvenienceConstructor, statics) {
  if (!statics) {
    return;
  }
  for (var name in statics) {
    var property = statics[name];
    if (!statics.hasOwnProperty(name)) {
      return;
    }

    var isInherited = name in ConvenienceConstructor;
    var result = property;
    if (isInherited) {
      var existingProperty = ConvenienceConstructor[name];
      var existingType = typeof existingProperty;
      var propertyType = typeof property;
      ("production" !== process.env.NODE_ENV ? invariant(
        existingType === 'function' && propertyType === 'function',
        'ReactCompositeComponent: You are attempting to define ' +
        '`%s` on your component more than once, but that is only supported ' +
        'for functions, which are chained together. This conflict may be ' +
        'due to a mixin.',
        name
      ) : invariant(existingType === 'function' && propertyType === 'function'));
      result = createChainedFunction(existingProperty, property);
    }
    ConvenienceConstructor[name] = result;
    ConvenienceConstructor.componentConstructor[name] = result;
  }
}

/**
 * Merge two objects, but throw if both contain the same key.
 *
 * @param {object} one The first object, which is mutated.
 * @param {object} two The second object
 * @return {object} one after it has been mutated to contain everything in two.
 */
function mergeObjectsWithNoDuplicateKeys(one, two) {
  ("production" !== process.env.NODE_ENV ? invariant(
    one && two && typeof one === 'object' && typeof two === 'object',
    'mergeObjectsWithNoDuplicateKeys(): Cannot merge non-objects'
  ) : invariant(one && two && typeof one === 'object' && typeof two === 'object'));

  objMap(two, function(value, key) {
    ("production" !== process.env.NODE_ENV ? invariant(
      one[key] === undefined,
      'mergeObjectsWithNoDuplicateKeys(): ' +
      'Tried to merge two objects with the same key: %s',
      key
    ) : invariant(one[key] === undefined));
    one[key] = value;
  });
  return one;
}

/**
 * Creates a function that invokes two functions and merges their return values.
 *
 * @param {function} one Function to invoke first.
 * @param {function} two Function to invoke second.
 * @return {function} Function that invokes the two argument functions.
 * @private
 */
function createMergedResultFunction(one, two) {
  return function mergedResult() {
    var a = one.apply(this, arguments);
    var b = two.apply(this, arguments);
    if (a == null) {
      return b;
    } else if (b == null) {
      return a;
    }
    return mergeObjectsWithNoDuplicateKeys(a, b);
  };
}

/**
 * Creates a function that invokes two functions and ignores their return vales.
 *
 * @param {function} one Function to invoke first.
 * @param {function} two Function to invoke second.
 * @return {function} Function that invokes the two argument functions.
 * @private
 */
function createChainedFunction(one, two) {
  return function chainedFunction() {
    one.apply(this, arguments);
    two.apply(this, arguments);
  };
}

if ("production" !== process.env.NODE_ENV) {

  var unmountedPropertyWhitelist = {
    constructor: true,
    construct: true,
    isOwnedBy: true, // should be deprecated but can have code mod (internal)
    type: true,
    props: true,
    // currently private but belong on the descriptor and are valid for use
    // inside the framework:
    __keyValidated__: true,
    _owner: true,
    _currentContext: true
  };

  var componentInstanceProperties = {
    __keyValidated__: true,
    __keySetters: true,
    _compositeLifeCycleState: true,
    _currentContext: true,
    _defaultProps: true,
    _instance: true,
    _lifeCycleState: true,
    _mountDepth: true,
    _owner: true,
    _pendingCallbacks: true,
    _pendingContext: true,
    _pendingForceUpdate: true,
    _pendingOwner: true,
    _pendingProps: true,
    _pendingState: true,
    _renderedComponent: true,
    _rootNodeID: true,
    context: true,
    props: true,
    refs: true,
    state: true,

    // These are known instance properties coming from other sources
    _pendingQueries: true,
    _queryPropListeners: true,
    queryParams: true

  };

  var hasWarnedOnComponentType = {};

  var warningStackCounter = 0;

  var issueMembraneWarning = function(instance, key) {
    var isWhitelisted = unmountedPropertyWhitelist.hasOwnProperty(key);
    if (warningStackCounter > 0 || isWhitelisted) {
      return;
    }
    var name = instance.constructor.displayName || 'Unknown';
    var owner = ReactCurrentOwner.current;
    var ownerName = (owner && owner.constructor.displayName) || 'Unknown';
    var warningKey = key + '|' + name + '|' + ownerName;
    if (hasWarnedOnComponentType.hasOwnProperty(warningKey)) {
      // We have already warned for this combination. Skip it this time.
      return;
    }
    hasWarnedOnComponentType[warningKey] = true;

    var context = owner ? ' in ' + ownerName + '.' : ' at the top level.';
    var staticMethodExample = '<' + name + ' />.type.' + key + '(...)';

    monitorCodeUse('react_descriptor_property_access', { component: name });
    console.warn(
      'Invalid access to component property "' + key + '" on ' + name +
      context + ' See http://fb.me/react-warning-descriptors .' +
      ' Use a static method instead: ' + staticMethodExample
    );
  };

  var wrapInMembraneFunction = function(fn, thisBinding) {
    if (fn.__reactMembraneFunction && fn.__reactMembraneSelf === thisBinding) {
      return fn.__reactMembraneFunction;
    }
    return fn.__reactMembraneFunction = function() {
      /**
       * By getting this function, you've already received a warning. The
       * internals of this function will likely cause more warnings. To avoid
       * Spamming too much we disable any warning triggered inside of this
       * stack.
       */
      warningStackCounter++;
      try {
        // If the this binding is unchanged, we defer to the real component.
        // This is important to keep some referential integrity in the
        // internals. E.g. owner equality check.
        var self = this === thisBinding ? this.__realComponentInstance : this;
        return fn.apply(self, arguments);
      } finally {
        warningStackCounter--;
      }
    };
  };

  var defineMembraneProperty = function(membrane, prototype, key) {
    Object.defineProperty(membrane, key, {

      configurable: false,
      enumerable: true,

      get: function() {
        if (this === membrane) {
          // We're allowed to access the prototype directly.
          return prototype[key];
        }
        issueMembraneWarning(this, key);

        var realValue = this.__realComponentInstance[key];
        // If the real value is a function, we need to provide a wrapper that
        // disables nested warnings. The properties type and constructors are
        // expected to the be constructors and therefore is often use with an
        // equality check and we shouldn't try to rebind those.
        if (typeof realValue === 'function' &&
            key !== 'type' &&
            key !== 'constructor') {
          return wrapInMembraneFunction(realValue, this);
        }
        return realValue;
      },

      set: function(value) {
        if (this === membrane) {
          // We're allowed to set a value on the prototype directly.
          prototype[key] = value;
          return;
        }
        issueMembraneWarning(this, key);
        this.__realComponentInstance[key] = value;
      }

    });
  };

  /**
   * Creates a membrane prototype which wraps the original prototype. If any
   * property is accessed in an unmounted state, a warning is issued.
   *
   * @param {object} prototype Original prototype.
   * @return {object} The membrane prototype.
   * @private
   */
  var createMountWarningMembrane = function(prototype) {
    var membrane = {};
    var key;
    for (key in prototype) {
      defineMembraneProperty(membrane, prototype, key);
    }
    // These are properties that goes into the instance but not the prototype.
    // We can create the membrane on the prototype even though this will
    // result in a faulty hasOwnProperty check it's better perf.
    for (key in componentInstanceProperties) {
      if (componentInstanceProperties.hasOwnProperty(key) &&
          !(key in prototype)) {
        defineMembraneProperty(membrane, prototype, key);
      }
    }
    return membrane;
  };

  /**
   * Creates a membrane constructor which wraps the component that gets mounted.
   *
   * @param {function} constructor Original constructor.
   * @return {function} The membrane constructor.
   * @private
   */
  var createDescriptorProxy = function(constructor) {
    try {
      var ProxyConstructor = function() {
        this.__realComponentInstance = new constructor();

        // We can only safely pass through known instance variables. Unknown
        // expandos are not safe. Use the real mounted instance to avoid this
        // problem if it blows something up.
        Object.freeze(this);
      };

      ProxyConstructor.prototype = createMountWarningMembrane(
        constructor.prototype
      );

      return ProxyConstructor;
    } catch(x) {
      // In IE8 define property will fail on non-DOM objects. If anything in
      // the membrane creation fails, we'll bail out and just use the plain
      // constructor without warnings.
      return constructor;
    }
  };

}

/**
 * `ReactCompositeComponent` maintains an auxiliary life cycle state in
 * `this._compositeLifeCycleState` (which can be null).
 *
 * This is different from the life cycle state maintained by `ReactComponent` in
 * `this._lifeCycleState`. The following diagram shows how the states overlap in
 * time. There are times when the CompositeLifeCycle is null - at those times it
 * is only meaningful to look at ComponentLifeCycle alone.
 *
 * Top Row: ReactComponent.ComponentLifeCycle
 * Low Row: ReactComponent.CompositeLifeCycle
 *
 * +-------+------------------------------------------------------+--------+
 * |  UN   |                    MOUNTED                           |   UN   |
 * |MOUNTED|                                                      | MOUNTED|
 * +-------+------------------------------------------------------+--------+
 * |       ^--------+   +------+   +------+   +------+   +--------^        |
 * |       |        |   |      |   |      |   |      |   |        |        |
 * |    0--|MOUNTING|-0-|RECEIV|-0-|RECEIV|-0-|RECEIV|-0-|   UN   |--->0   |
 * |       |        |   |PROPS |   | PROPS|   | STATE|   |MOUNTING|        |
 * |       |        |   |      |   |      |   |      |   |        |        |
 * |       |        |   |      |   |      |   |      |   |        |        |
 * |       +--------+   +------+   +------+   +------+   +--------+        |
 * |       |                                                      |        |
 * +-------+------------------------------------------------------+--------+
 */
var CompositeLifeCycle = keyMirror({
  /**
   * Components in the process of being mounted respond to state changes
   * differently.
   */
  MOUNTING: null,
  /**
   * Components in the process of being unmounted are guarded against state
   * changes.
   */
  UNMOUNTING: null,
  /**
   * Components that are mounted and receiving new props respond to state
   * changes differently.
   */
  RECEIVING_PROPS: null,
  /**
   * Components that are mounted and receiving new state are guarded against
   * additional state changes.
   */
  RECEIVING_STATE: null
});

/**
 * @lends {ReactCompositeComponent.prototype}
 */
var ReactCompositeComponentMixin = {

  /**
   * Base constructor for all composite component.
   *
   * @param {?object} initialProps
   * @param {*} children
   * @final
   * @internal
   */
  construct: function(initialProps, children) {
    // Children can be either an array or more than one argument
    ReactComponent.Mixin.construct.apply(this, arguments);
    ReactOwner.Mixin.construct.apply(this, arguments);

    this.state = null;
    this._pendingState = null;

    this.context = null;
    this._currentContext = ReactContext.current;
    this._pendingContext = null;

    // The descriptor that was used to instantiate this component. Will be
    // set by the instantiator instead of the constructor since this
    // constructor is currently used by both instances and descriptors.
    this._descriptor = null;

    this._compositeLifeCycleState = null;
  },

  /**
   * Components in the intermediate state now has cyclic references. To avoid
   * breaking JSON serialization we expose a custom JSON format.
   * @return {object} JSON compatible representation.
   * @internal
   * @final
   */
  toJSON: function() {
    return { type: this.type, props: this.props };
  },

  /**
   * Checks whether or not this composite component is mounted.
   * @return {boolean} True if mounted, false otherwise.
   * @protected
   * @final
   */
  isMounted: function() {
    return ReactComponent.Mixin.isMounted.call(this) &&
      this._compositeLifeCycleState !== CompositeLifeCycle.MOUNTING;
  },

  /**
   * Initializes the component, renders markup, and registers event listeners.
   *
   * @param {string} rootID DOM ID of the root node.
   * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
   * @param {number} mountDepth number of components in the owner hierarchy
   * @return {?string} Rendered markup to be inserted into the DOM.
   * @final
   * @internal
   */
  mountComponent: ReactPerf.measure(
    'ReactCompositeComponent',
    'mountComponent',
    function(rootID, transaction, mountDepth) {
      ReactComponent.Mixin.mountComponent.call(
        this,
        rootID,
        transaction,
        mountDepth
      );
      this._compositeLifeCycleState = CompositeLifeCycle.MOUNTING;

      this.context = this._processContext(this._currentContext);
      this._defaultProps = this.getDefaultProps ? this.getDefaultProps() : null;
      this.props = this._processProps(this.props);

      if (this.__reactAutoBindMap) {
        this._bindAutoBindMethods();
      }

      this.state = this.getInitialState ? this.getInitialState() : null;
      ("production" !== process.env.NODE_ENV ? invariant(
        typeof this.state === 'object' && !Array.isArray(this.state),
        '%s.getInitialState(): must return an object or null',
        this.constructor.displayName || 'ReactCompositeComponent'
      ) : invariant(typeof this.state === 'object' && !Array.isArray(this.state)));

      this._pendingState = null;
      this._pendingForceUpdate = false;

      if (this.componentWillMount) {
        this.componentWillMount();
        // When mounting, calls to `setState` by `componentWillMount` will set
        // `this._pendingState` without triggering a re-render.
        if (this._pendingState) {
          this.state = this._pendingState;
          this._pendingState = null;
        }
      }

      this._renderedComponent = instantiateReactComponent(
        this._renderValidatedComponent()
      );

      // Done with mounting, `setState` will now trigger UI changes.
      this._compositeLifeCycleState = null;
      var markup = this._renderedComponent.mountComponent(
        rootID,
        transaction,
        mountDepth + 1
      );
      if (this.componentDidMount) {
        transaction.getReactMountReady().enqueue(this, this.componentDidMount);
      }
      return markup;
    }
  ),

  /**
   * Releases any resources allocated by `mountComponent`.
   *
   * @final
   * @internal
   */
  unmountComponent: function() {
    this._compositeLifeCycleState = CompositeLifeCycle.UNMOUNTING;
    if (this.componentWillUnmount) {
      this.componentWillUnmount();
    }
    this._compositeLifeCycleState = null;

    this._defaultProps = null;

    this._renderedComponent.unmountComponent();
    this._renderedComponent = null;

    ReactComponent.Mixin.unmountComponent.call(this);

    // Some existing components rely on this.props even after they've been
    // destroyed (in event handlers).
    // TODO: this.props = null;
    // TODO: this.state = null;
  },

  /**
   * Sets a subset of the state. Always use this or `replaceState` to mutate
   * state. You should treat `this.state` as immutable.
   *
   * There is no guarantee that `this.state` will be immediately updated, so
   * accessing `this.state` after calling this method may return the old value.
   *
   * There is no guarantee that calls to `setState` will run synchronously,
   * as they may eventually be batched together.  You can provide an optional
   * callback that will be executed when the call to setState is actually
   * completed.
   *
   * @param {object} partialState Next partial state to be merged with state.
   * @param {?function} callback Called after state is updated.
   * @final
   * @protected
   */
  setState: function(partialState, callback) {
    ("production" !== process.env.NODE_ENV ? invariant(
      typeof partialState === 'object' || partialState == null,
      'setState(...): takes an object of state variables to update.'
    ) : invariant(typeof partialState === 'object' || partialState == null));
    if ("production" !== process.env.NODE_ENV) {
      ("production" !== process.env.NODE_ENV ? warning(
        partialState != null,
        'setState(...): You passed an undefined or null state object; ' +
        'instead, use forceUpdate().'
      ) : null);
    }
    // Merge with `_pendingState` if it exists, otherwise with existing state.
    this.replaceState(
      merge(this._pendingState || this.state, partialState),
      callback
    );
  },

  /**
   * Replaces all of the state. Always use this or `setState` to mutate state.
   * You should treat `this.state` as immutable.
   *
   * There is no guarantee that `this.state` will be immediately updated, so
   * accessing `this.state` after calling this method may return the old value.
   *
   * @param {object} completeState Next state.
   * @param {?function} callback Called after state is updated.
   * @final
   * @protected
   */
  replaceState: function(completeState, callback) {
    validateLifeCycleOnReplaceState(this);
    this._pendingState = completeState;
    ReactUpdates.enqueueUpdate(this, callback);
  },

  /**
   * Filters the context object to only contain keys specified in
   * `contextTypes`, and asserts that they are valid.
   *
   * @param {object} context
   * @return {?object}
   * @private
   */
  _processContext: function(context) {
    var maskedContext = null;
    var contextTypes = this.constructor.contextTypes;
    if (contextTypes) {
      maskedContext = {};
      for (var contextName in contextTypes) {
        maskedContext[contextName] = context[contextName];
      }
      if ("production" !== process.env.NODE_ENV) {
        this._checkPropTypes(
          contextTypes,
          maskedContext,
          ReactPropTypeLocations.context
        );
      }
    }
    return maskedContext;
  },

  /**
   * @param {object} currentContext
   * @return {object}
   * @private
   */
  _processChildContext: function(currentContext) {
    var childContext = this.getChildContext && this.getChildContext();
    var displayName = this.constructor.displayName || 'ReactCompositeComponent';
    if (childContext) {
      ("production" !== process.env.NODE_ENV ? invariant(
        typeof this.constructor.childContextTypes === 'object',
        '%s.getChildContext(): childContextTypes must be defined in order to ' +
        'use getChildContext().',
        displayName
      ) : invariant(typeof this.constructor.childContextTypes === 'object'));
      if ("production" !== process.env.NODE_ENV) {
        this._checkPropTypes(
          this.constructor.childContextTypes,
          childContext,
          ReactPropTypeLocations.childContext
        );
      }
      for (var name in childContext) {
        ("production" !== process.env.NODE_ENV ? invariant(
          name in this.constructor.childContextTypes,
          '%s.getChildContext(): key "%s" is not defined in childContextTypes.',
          displayName,
          name
        ) : invariant(name in this.constructor.childContextTypes));
      }
      return merge(currentContext, childContext);
    }
    return currentContext;
  },

  /**
   * Processes props by setting default values for unspecified props and
   * asserting that the props are valid. Does not mutate its argument; returns
   * a new props object with defaults merged in.
   *
   * @param {object} newProps
   * @return {object}
   * @private
   */
  _processProps: function(newProps) {
    var props = merge(newProps);
    var defaultProps = this._defaultProps;
    for (var propName in defaultProps) {
      if (typeof props[propName] === 'undefined') {
        props[propName] = defaultProps[propName];
      }
    }
    if ("production" !== process.env.NODE_ENV) {
      var propTypes = this.constructor.propTypes;
      if (propTypes) {
        this._checkPropTypes(propTypes, props, ReactPropTypeLocations.prop);
      }
    }
    return props;
  },

  /**
   * Assert that the props are valid
   *
   * @param {object} propTypes Map of prop name to a ReactPropType
   * @param {object} props
   * @param {string} location e.g. "prop", "context", "child context"
   * @private
   */
  _checkPropTypes: function(propTypes, props, location) {
    var componentName = this.constructor.displayName;
    for (var propName in propTypes) {
      if (propTypes.hasOwnProperty(propName)) {
        propTypes[propName](props, propName, componentName, location);
      }
    }
  },

  performUpdateIfNecessary: function() {
    var compositeLifeCycleState = this._compositeLifeCycleState;
    // Do not trigger a state transition if we are in the middle of mounting or
    // receiving props because both of those will already be doing this.
    if (compositeLifeCycleState === CompositeLifeCycle.MOUNTING ||
        compositeLifeCycleState === CompositeLifeCycle.RECEIVING_PROPS) {
      return;
    }
    ReactComponent.Mixin.performUpdateIfNecessary.call(this);
  },

  /**
   * If any of `_pendingProps`, `_pendingState`, or `_pendingForceUpdate` is
   * set, update the component.
   *
   * @param {ReactReconcileTransaction} transaction
   * @internal
   */
  _performUpdateIfNecessary: function(transaction) {
    if (this._pendingProps == null &&
        this._pendingState == null &&
        this._pendingContext == null &&
        !this._pendingForceUpdate) {
      return;
    }

    var nextFullContext = this._pendingContext || this._currentContext;
    var nextContext = this._processContext(nextFullContext);
    this._pendingContext = null;

    var nextProps = this.props;
    if (this._pendingProps != null) {
      nextProps = this._processProps(this._pendingProps);
      this._pendingProps = null;

      this._compositeLifeCycleState = CompositeLifeCycle.RECEIVING_PROPS;
      if (this.componentWillReceiveProps) {
        this.componentWillReceiveProps(nextProps, nextContext);
      }
    }

    this._compositeLifeCycleState = CompositeLifeCycle.RECEIVING_STATE;

    // Unlike props, state, and context, we specifically don't want to set
    // _pendingOwner to null here because it's possible for a component to have
    // a null owner, so we instead make `this._owner === this._pendingOwner`
    // mean that there's no owner change pending.
    var nextOwner = this._pendingOwner;

    var nextState = this._pendingState || this.state;
    this._pendingState = null;

    try {
      if (this._pendingForceUpdate ||
          !this.shouldComponentUpdate ||
          this.shouldComponentUpdate(nextProps, nextState, nextContext)) {
        this._pendingForceUpdate = false;
        // Will set `this.props`, `this.state` and `this.context`.
        this._performComponentUpdate(
          nextProps,
          nextOwner,
          nextState,
          nextFullContext,
          nextContext,
          transaction
        );
      } else {
        // If it's determined that a component should not update, we still want
        // to set props and state.
        this.props = nextProps;
        this._owner = nextOwner;
        this.state = nextState;
        this._currentContext = nextFullContext;
        this.context = nextContext;
      }
    } finally {
      this._compositeLifeCycleState = null;
    }
  },

  /**
   * Merges new props and state, notifies delegate methods of update and
   * performs update.
   *
   * @param {object} nextProps Next object to set as properties.
   * @param {?ReactComponent} nextOwner Next component to set as owner
   * @param {?object} nextState Next object to set as state.
   * @param {?object} nextFullContext Next object to set as _currentContext.
   * @param {?object} nextContext Next object to set as context.
   * @param {ReactReconcileTransaction} transaction
   * @private
   */
  _performComponentUpdate: function(
    nextProps,
    nextOwner,
    nextState,
    nextFullContext,
    nextContext,
    transaction
  ) {
    var prevProps = this.props;
    var prevOwner = this._owner;
    var prevState = this.state;
    var prevContext = this.context;

    if (this.componentWillUpdate) {
      this.componentWillUpdate(nextProps, nextState, nextContext);
    }

    this.props = nextProps;
    this._owner = nextOwner;
    this.state = nextState;
    this._currentContext = nextFullContext;
    this.context = nextContext;

    this.updateComponent(
      transaction,
      prevProps,
      prevOwner,
      prevState,
      prevContext
    );

    if (this.componentDidUpdate) {
      transaction.getReactMountReady().enqueue(
        this,
        this.componentDidUpdate.bind(this, prevProps, prevState, prevContext)
      );
    }
  },

  receiveComponent: function(nextComponent, transaction) {
    if (nextComponent === this._descriptor) {
      // Since props and context are immutable after the component is
      // mounted, we can do a cheap identity compare here to determine
      // if this is a superfluous reconcile.
      return;
    }

    // Update the descriptor that was last used by this component instance
    this._descriptor = nextComponent;

    this._pendingContext = nextComponent._currentContext;
    ReactComponent.Mixin.receiveComponent.call(
      this,
      nextComponent,
      transaction
    );
  },

  /**
   * Updates the component's currently mounted DOM representation.
   *
   * By default, this implements React's rendering and reconciliation algorithm.
   * Sophisticated clients may wish to override this.
   *
   * @param {ReactReconcileTransaction} transaction
   * @param {object} prevProps
   * @param {?ReactComponent} prevOwner
   * @param {?object} prevState
   * @param {?object} prevContext
   * @internal
   * @overridable
   */
  updateComponent: ReactPerf.measure(
    'ReactCompositeComponent',
    'updateComponent',
    function(transaction, prevProps, prevOwner, prevState, prevContext) {
      ReactComponent.Mixin.updateComponent.call(
        this,
        transaction,
        prevProps,
        prevOwner
      );


      var prevComponentInstance = this._renderedComponent;
      var nextComponent = this._renderValidatedComponent();
      if (shouldUpdateReactComponent(prevComponentInstance, nextComponent)) {
        prevComponentInstance.receiveComponent(nextComponent, transaction);
      } else {
        // These two IDs are actually the same! But nothing should rely on that.
        var thisID = this._rootNodeID;
        var prevComponentID = prevComponentInstance._rootNodeID;
        prevComponentInstance.unmountComponent();
        this._renderedComponent = instantiateReactComponent(nextComponent);
        var nextMarkup = this._renderedComponent.mountComponent(
          thisID,
          transaction,
          this._mountDepth + 1
        );
        ReactComponent.BackendIDOperations.dangerouslyReplaceNodeWithMarkupByID(
          prevComponentID,
          nextMarkup
        );
      }
    }
  ),

  /**
   * Forces an update. This should only be invoked when it is known with
   * certainty that we are **not** in a DOM transaction.
   *
   * You may want to call this when you know that some deeper aspect of the
   * component's state has changed but `setState` was not called.
   *
   * This will not invoke `shouldUpdateComponent`, but it will invoke
   * `componentWillUpdate` and `componentDidUpdate`.
   *
   * @param {?function} callback Called after update is complete.
   * @final
   * @protected
   */
  forceUpdate: function(callback) {
    var compositeLifeCycleState = this._compositeLifeCycleState;
    ("production" !== process.env.NODE_ENV ? invariant(
      this.isMounted() ||
        compositeLifeCycleState === CompositeLifeCycle.MOUNTING,
      'forceUpdate(...): Can only force an update on mounted or mounting ' +
        'components.'
    ) : invariant(this.isMounted() ||
      compositeLifeCycleState === CompositeLifeCycle.MOUNTING));
    ("production" !== process.env.NODE_ENV ? invariant(
      compositeLifeCycleState !== CompositeLifeCycle.RECEIVING_STATE &&
      compositeLifeCycleState !== CompositeLifeCycle.UNMOUNTING,
      'forceUpdate(...): Cannot force an update while unmounting component ' +
      'or during an existing state transition (such as within `render`).'
    ) : invariant(compositeLifeCycleState !== CompositeLifeCycle.RECEIVING_STATE &&
    compositeLifeCycleState !== CompositeLifeCycle.UNMOUNTING));
    this._pendingForceUpdate = true;
    ReactUpdates.enqueueUpdate(this, callback);
  },

  /**
   * @private
   */
  _renderValidatedComponent: ReactPerf.measure(
    'ReactCompositeComponent',
    '_renderValidatedComponent',
    function() {
      var renderedComponent;
      var previousContext = ReactContext.current;
      ReactContext.current = this._processChildContext(this._currentContext);
      ReactCurrentOwner.current = this;
      try {
        renderedComponent = this.render();
      } finally {
        ReactContext.current = previousContext;
        ReactCurrentOwner.current = null;
      }
      ("production" !== process.env.NODE_ENV ? invariant(
        ReactComponent.isValidComponent(renderedComponent),
        '%s.render(): A valid ReactComponent must be returned. You may have ' +
          'returned null, undefined, an array, or some other invalid object.',
        this.constructor.displayName || 'ReactCompositeComponent'
      ) : invariant(ReactComponent.isValidComponent(renderedComponent)));
      return renderedComponent;
    }
  ),

  /**
   * @private
   */
  _bindAutoBindMethods: function() {
    for (var autoBindKey in this.__reactAutoBindMap) {
      if (!this.__reactAutoBindMap.hasOwnProperty(autoBindKey)) {
        continue;
      }
      var method = this.__reactAutoBindMap[autoBindKey];
      this[autoBindKey] = this._bindAutoBindMethod(ReactErrorUtils.guard(
        method,
        this.constructor.displayName + '.' + autoBindKey
      ));
    }
  },

  /**
   * Binds a method to the component.
   *
   * @param {function} method Method to be bound.
   * @private
   */
  _bindAutoBindMethod: function(method) {
    var component = this;
    var boundMethod = function() {
      return method.apply(component, arguments);
    };
    if ("production" !== process.env.NODE_ENV) {
      boundMethod.__reactBoundContext = component;
      boundMethod.__reactBoundMethod = method;
      boundMethod.__reactBoundArguments = null;
      var componentName = component.constructor.displayName;
      var _bind = boundMethod.bind;
      boundMethod.bind = function(newThis ) {var args=Array.prototype.slice.call(arguments,1);
        // User is trying to bind() an autobound method; we effectively will
        // ignore the value of "this" that the user is trying to use, so
        // let's warn.
        if (newThis !== component && newThis !== null) {
          monitorCodeUse('react_bind_warning', { component: componentName });
          console.warn(
            'bind(): React component methods may only be bound to the ' +
            'component instance. See ' + componentName
          );
        } else if (!args.length) {
          monitorCodeUse('react_bind_warning', { component: componentName });
          console.warn(
            'bind(): You are binding a component method to the component. ' +
            'React does this for you automatically in a high-performance ' +
            'way, so you can safely remove this call. See ' + componentName
          );
          return boundMethod;
        }
        var reboundMethod = _bind.apply(boundMethod, arguments);
        reboundMethod.__reactBoundContext = component;
        reboundMethod.__reactBoundMethod = method;
        reboundMethod.__reactBoundArguments = args;
        return reboundMethod;
      };
    }
    return boundMethod;
  }
};

var ReactCompositeComponentBase = function() {};
mixInto(ReactCompositeComponentBase, ReactComponent.Mixin);
mixInto(ReactCompositeComponentBase, ReactOwner.Mixin);
mixInto(ReactCompositeComponentBase, ReactPropTransferer.Mixin);
mixInto(ReactCompositeComponentBase, ReactCompositeComponentMixin);

/**
 * Checks if a value is a valid component constructor.
 *
 * @param {*}
 * @return {boolean}
 * @public
 */
function isValidClass(componentClass) {
  return componentClass instanceof Function &&
         'componentConstructor' in componentClass &&
         componentClass.componentConstructor instanceof Function;
}
/**
 * Module for creating composite components.
 *
 * @class ReactCompositeComponent
 * @extends ReactComponent
 * @extends ReactOwner
 * @extends ReactPropTransferer
 */
var ReactCompositeComponent = {

  LifeCycle: CompositeLifeCycle,

  Base: ReactCompositeComponentBase,

  /**
   * Creates a composite component class given a class specification.
   *
   * @param {object} spec Class specification (which must define `render`).
   * @return {function} Component constructor function.
   * @public
   */
  createClass: function(spec) {
    var Constructor = function() {};
    Constructor.prototype = new ReactCompositeComponentBase();
    Constructor.prototype.constructor = Constructor;

    var DescriptorConstructor = Constructor;

    var ConvenienceConstructor = function(props, children) {
      var descriptor = new DescriptorConstructor();
      descriptor.construct.apply(descriptor, arguments);
      return descriptor;
    };
    ConvenienceConstructor.componentConstructor = Constructor;
    Constructor.ConvenienceConstructor = ConvenienceConstructor;
    ConvenienceConstructor.originalSpec = spec;

    injectedMixins.forEach(
      mixSpecIntoComponent.bind(null, ConvenienceConstructor)
    );

    mixSpecIntoComponent(ConvenienceConstructor, spec);

    ("production" !== process.env.NODE_ENV ? invariant(
      Constructor.prototype.render,
      'createClass(...): Class specification must implement a `render` method.'
    ) : invariant(Constructor.prototype.render));

    if ("production" !== process.env.NODE_ENV) {
      if (Constructor.prototype.componentShouldUpdate) {
        monitorCodeUse(
          'react_component_should_update_warning',
          { component: spec.displayName }
        );
        console.warn(
          (spec.displayName || 'A component') + ' has a method called ' +
          'componentShouldUpdate(). Did you mean shouldComponentUpdate()? ' +
          'The name is phrased as a question because the function is ' +
          'expected to return a value.'
         );
      }
    }

    // Expose the convience constructor on the prototype so that it can be
    // easily accessed on descriptors. E.g. <Foo />.type === Foo.type and for
    // static methods like <Foo />.type.staticMethod();
    // This should not be named constructor since this may not be the function
    // that created the descriptor, and it may not even be a constructor.
    ConvenienceConstructor.type = Constructor;
    Constructor.prototype.type = Constructor;

    // Reduce time spent doing lookups by setting these on the prototype.
    for (var methodName in ReactCompositeComponentInterface) {
      if (!Constructor.prototype[methodName]) {
        Constructor.prototype[methodName] = null;
      }
    }

    if ("production" !== process.env.NODE_ENV) {
      // In DEV the convenience constructor generates a proxy to another
      // instance around it to warn about access to properties on the
      // descriptor.
      DescriptorConstructor = createDescriptorProxy(Constructor);
    }

    return ConvenienceConstructor;
  },

  isValidClass: isValidClass,

  injection: {
    injectMixin: function(mixin) {
      injectedMixins.push(mixin);
    }
  }
};

module.exports = ReactCompositeComponent;

}).call(this,require("qvMYcC"))
},{"./ReactComponent":41,"./ReactContext":44,"./ReactCurrentOwner":45,"./ReactErrorUtils":61,"./ReactOwner":74,"./ReactPerf":75,"./ReactPropTransferer":76,"./ReactPropTypeLocationNames":77,"./ReactPropTypeLocations":78,"./ReactUpdates":91,"./instantiateReactComponent":134,"./invariant":135,"./keyMirror":141,"./merge":144,"./mixInto":147,"./monitorCodeUse":148,"./objMap":149,"./shouldUpdateReactComponent":154,"./warning":158,"qvMYcC":161}],44:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactContext
 */

"use strict";

var merge = require("./merge");

/**
 * Keeps track of the current context.
 *
 * The context is automatically passed down the component ownership hierarchy
 * and is accessible via `this.context` on ReactCompositeComponents.
 */
var ReactContext = {

  /**
   * @internal
   * @type {object}
   */
  current: {},

  /**
   * Temporarily extends the current context while executing scopedCallback.
   *
   * A typical use case might look like
   *
   *  render: function() {
   *    var children = ReactContext.withContext({foo: 'foo'} () => (
   *
   *    ));
   *    return <div>{children}</div>;
   *  }
   *
   * @param {object} newContext New context to merge into the existing context
   * @param {function} scopedCallback Callback to run with the new context
   * @return {ReactComponent|array<ReactComponent>}
   */
  withContext: function(newContext, scopedCallback) {
    var result;
    var previousContext = ReactContext.current;
    ReactContext.current = merge(previousContext, newContext);
    try {
      result = scopedCallback();
    } finally {
      ReactContext.current = previousContext;
    }
    return result;
  }

};

module.exports = ReactContext;

},{"./merge":144}],45:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactCurrentOwner
 */

"use strict";

/**
 * Keeps track of the current owner.
 *
 * The current owner is the component who should own any components that are
 * currently being constructed.
 *
 * The depth indicate how many composite components are above this render level.
 */
var ReactCurrentOwner = {

  /**
   * @internal
   * @type {ReactComponent}
   */
  current: null

};

module.exports = ReactCurrentOwner;

},{}],46:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactDOM
 * @typechecks static-only
 */

"use strict";

var ReactDOMComponent = require("./ReactDOMComponent");

var mergeInto = require("./mergeInto");
var objMapKeyVal = require("./objMapKeyVal");

/**
 * Creates a new React class that is idempotent and capable of containing other
 * React components. It accepts event listeners and DOM properties that are
 * valid according to `DOMProperty`.
 *
 *  - Event listeners: `onClick`, `onMouseDown`, etc.
 *  - DOM properties: `className`, `name`, `title`, etc.
 *
 * The `style` property functions differently from the DOM API. It accepts an
 * object mapping of style properties to values.
 *
 * @param {string} tag Tag name (e.g. `div`).
 * @param {boolean} omitClose True if the close tag should be omitted.
 * @private
 */
function createDOMComponentClass(tag, omitClose) {
  var Constructor = function() {};
  Constructor.prototype = new ReactDOMComponent(tag, omitClose);
  Constructor.prototype.constructor = Constructor;
  Constructor.displayName = tag;

  var ConvenienceConstructor = function(props, children) {
    var instance = new Constructor();
    instance.construct.apply(instance, arguments);
    return instance;
  };

  // Expose the constructor on the ConvenienceConstructor and prototype so that
  // it can be easily easily accessed on descriptors.
  // E.g. <div />.type === div.type
  ConvenienceConstructor.type = Constructor;
  Constructor.prototype.type = Constructor;

  Constructor.ConvenienceConstructor = ConvenienceConstructor;
  ConvenienceConstructor.componentConstructor = Constructor;
  return ConvenienceConstructor;
}

/**
 * Creates a mapping from supported HTML tags to `ReactDOMComponent` classes.
 * This is also accessible via `React.DOM`.
 *
 * @public
 */
var ReactDOM = objMapKeyVal({
  a: false,
  abbr: false,
  address: false,
  area: true,
  article: false,
  aside: false,
  audio: false,
  b: false,
  base: true,
  bdi: false,
  bdo: false,
  big: false,
  blockquote: false,
  body: false,
  br: true,
  button: false,
  canvas: false,
  caption: false,
  cite: false,
  code: false,
  col: true,
  colgroup: false,
  data: false,
  datalist: false,
  dd: false,
  del: false,
  details: false,
  dfn: false,
  div: false,
  dl: false,
  dt: false,
  em: false,
  embed: true,
  fieldset: false,
  figcaption: false,
  figure: false,
  footer: false,
  form: false, // NOTE: Injected, see `ReactDOMForm`.
  h1: false,
  h2: false,
  h3: false,
  h4: false,
  h5: false,
  h6: false,
  head: false,
  header: false,
  hr: true,
  html: false,
  i: false,
  iframe: false,
  img: true,
  input: true,
  ins: false,
  kbd: false,
  keygen: true,
  label: false,
  legend: false,
  li: false,
  link: true,
  main: false,
  map: false,
  mark: false,
  menu: false,
  menuitem: false, // NOTE: Close tag should be omitted, but causes problems.
  meta: true,
  meter: false,
  nav: false,
  noscript: false,
  object: false,
  ol: false,
  optgroup: false,
  option: false,
  output: false,
  p: false,
  param: true,
  pre: false,
  progress: false,
  q: false,
  rp: false,
  rt: false,
  ruby: false,
  s: false,
  samp: false,
  script: false,
  section: false,
  select: false,
  small: false,
  source: true,
  span: false,
  strong: false,
  style: false,
  sub: false,
  summary: false,
  sup: false,
  table: false,
  tbody: false,
  td: false,
  textarea: false, // NOTE: Injected, see `ReactDOMTextarea`.
  tfoot: false,
  th: false,
  thead: false,
  time: false,
  title: false,
  tr: false,
  track: true,
  u: false,
  ul: false,
  'var': false,
  video: false,
  wbr: true,

  // SVG
  circle: false,
  defs: false,
  g: false,
  line: false,
  linearGradient: false,
  path: false,
  polygon: false,
  polyline: false,
  radialGradient: false,
  rect: false,
  stop: false,
  svg: false,
  text: false
}, createDOMComponentClass);

var injection = {
  injectComponentClasses: function(componentClasses) {
    mergeInto(ReactDOM, componentClasses);
  }
};

ReactDOM.injection = injection;

module.exports = ReactDOM;

},{"./ReactDOMComponent":48,"./mergeInto":146,"./objMapKeyVal":150}],47:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactDOMButton
 */

"use strict";

var AutoFocusMixin = require("./AutoFocusMixin");
var ReactBrowserComponentMixin = require("./ReactBrowserComponentMixin");
var ReactCompositeComponent = require("./ReactCompositeComponent");
var ReactDOM = require("./ReactDOM");

var keyMirror = require("./keyMirror");

// Store a reference to the <button> `ReactDOMComponent`.
var button = ReactDOM.button;

var mouseListenerNames = keyMirror({
  onClick: true,
  onDoubleClick: true,
  onMouseDown: true,
  onMouseMove: true,
  onMouseUp: true,
  onClickCapture: true,
  onDoubleClickCapture: true,
  onMouseDownCapture: true,
  onMouseMoveCapture: true,
  onMouseUpCapture: true
});

/**
 * Implements a <button> native component that does not receive mouse events
 * when `disabled` is set.
 */
var ReactDOMButton = ReactCompositeComponent.createClass({
  displayName: 'ReactDOMButton',

  mixins: [AutoFocusMixin, ReactBrowserComponentMixin],

  render: function() {
    var props = {};

    // Copy the props; except the mouse listeners if we're disabled
    for (var key in this.props) {
      if (this.props.hasOwnProperty(key) &&
          (!this.props.disabled || !mouseListenerNames[key])) {
        props[key] = this.props[key];
      }
    }

    return button(props, this.props.children);
  }

});

module.exports = ReactDOMButton;

},{"./AutoFocusMixin":11,"./ReactBrowserComponentMixin":37,"./ReactCompositeComponent":43,"./ReactDOM":46,"./keyMirror":141}],48:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactDOMComponent
 * @typechecks static-only
 */

"use strict";

var CSSPropertyOperations = require("./CSSPropertyOperations");
var DOMProperty = require("./DOMProperty");
var DOMPropertyOperations = require("./DOMPropertyOperations");
var ReactBrowserComponentMixin = require("./ReactBrowserComponentMixin");
var ReactComponent = require("./ReactComponent");
var ReactEventEmitter = require("./ReactEventEmitter");
var ReactMount = require("./ReactMount");
var ReactMultiChild = require("./ReactMultiChild");
var ReactPerf = require("./ReactPerf");

var escapeTextForBrowser = require("./escapeTextForBrowser");
var invariant = require("./invariant");
var keyOf = require("./keyOf");
var merge = require("./merge");
var mixInto = require("./mixInto");

var deleteListener = ReactEventEmitter.deleteListener;
var listenTo = ReactEventEmitter.listenTo;
var registrationNameModules = ReactEventEmitter.registrationNameModules;

// For quickly matching children type, to test if can be treated as content.
var CONTENT_TYPES = {'string': true, 'number': true};

var STYLE = keyOf({style: null});

var ELEMENT_NODE_TYPE = 1;

/**
 * @param {?object} props
 */
function assertValidProps(props) {
  if (!props) {
    return;
  }
  // Note the use of `==` which checks for null or undefined.
  ("production" !== process.env.NODE_ENV ? invariant(
    props.children == null || props.dangerouslySetInnerHTML == null,
    'Can only set one of `children` or `props.dangerouslySetInnerHTML`.'
  ) : invariant(props.children == null || props.dangerouslySetInnerHTML == null));
  ("production" !== process.env.NODE_ENV ? invariant(
    props.style == null || typeof props.style === 'object',
    'The `style` prop expects a mapping from style properties to values, ' +
    'not a string.'
  ) : invariant(props.style == null || typeof props.style === 'object'));
}

function putListener(id, registrationName, listener, transaction) {
  var container = ReactMount.findReactContainerForID(id);
  if (container) {
    var doc = container.nodeType === ELEMENT_NODE_TYPE ?
      container.ownerDocument :
      container;
    listenTo(registrationName, doc);
  }
  transaction.getPutListenerQueue().enqueuePutListener(
    id,
    registrationName,
    listener
  );
}


/**
 * @constructor ReactDOMComponent
 * @extends ReactComponent
 * @extends ReactMultiChild
 */
function ReactDOMComponent(tag, omitClose) {
  this._tagOpen = '<' + tag;
  this._tagClose = omitClose ? '' : '</' + tag + '>';
  this.tagName = tag.toUpperCase();
}

ReactDOMComponent.Mixin = {

  /**
   * Generates root tag markup then recurses. This method has side effects and
   * is not idempotent.
   *
   * @internal
   * @param {string} rootID The root DOM ID for this node.
   * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
   * @param {number} mountDepth number of components in the owner hierarchy
   * @return {string} The computed markup.
   */
  mountComponent: ReactPerf.measure(
    'ReactDOMComponent',
    'mountComponent',
    function(rootID, transaction, mountDepth) {
      ReactComponent.Mixin.mountComponent.call(
        this,
        rootID,
        transaction,
        mountDepth
      );
      assertValidProps(this.props);
      return (
        this._createOpenTagMarkupAndPutListeners(transaction) +
        this._createContentMarkup(transaction) +
        this._tagClose
      );
    }
  ),

  /**
   * Creates markup for the open tag and all attributes.
   *
   * This method has side effects because events get registered.
   *
   * Iterating over object properties is faster than iterating over arrays.
   * @see http://jsperf.com/obj-vs-arr-iteration
   *
   * @private
   * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
   * @return {string} Markup of opening tag.
   */
  _createOpenTagMarkupAndPutListeners: function(transaction) {
    var props = this.props;
    var ret = this._tagOpen;

    for (var propKey in props) {
      if (!props.hasOwnProperty(propKey)) {
        continue;
      }
      var propValue = props[propKey];
      if (propValue == null) {
        continue;
      }
      if (registrationNameModules[propKey]) {
        putListener(this._rootNodeID, propKey, propValue, transaction);
      } else {
        if (propKey === STYLE) {
          if (propValue) {
            propValue = props.style = merge(props.style);
          }
          propValue = CSSPropertyOperations.createMarkupForStyles(propValue);
        }
        var markup =
          DOMPropertyOperations.createMarkupForProperty(propKey, propValue);
        if (markup) {
          ret += ' ' + markup;
        }
      }
    }

    // For static pages, no need to put React ID and checksum. Saves lots of
    // bytes.
    if (transaction.renderToStaticMarkup) {
      return ret + '>';
    }

    var markupForID = DOMPropertyOperations.createMarkupForID(this._rootNodeID);
    return ret + ' ' + markupForID + '>';
  },

  /**
   * Creates markup for the content between the tags.
   *
   * @private
   * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
   * @return {string} Content markup.
   */
  _createContentMarkup: function(transaction) {
    // Intentional use of != to avoid catching zero/false.
    var innerHTML = this.props.dangerouslySetInnerHTML;
    if (innerHTML != null) {
      if (innerHTML.__html != null) {
        return innerHTML.__html;
      }
    } else {
      var contentToUse =
        CONTENT_TYPES[typeof this.props.children] ? this.props.children : null;
      var childrenToUse = contentToUse != null ? null : this.props.children;
      if (contentToUse != null) {
        return escapeTextForBrowser(contentToUse);
      } else if (childrenToUse != null) {
        var mountImages = this.mountChildren(
          childrenToUse,
          transaction
        );
        return mountImages.join('');
      }
    }
    return '';
  },

  receiveComponent: function(nextComponent, transaction) {
    if (nextComponent === this) {
      // Since props and context are immutable after the component is
      // mounted, we can do a cheap identity compare here to determine
      // if this is a superfluous reconcile.

      // TODO: compare the descriptor
      return;
    }

    assertValidProps(nextComponent.props);
    ReactComponent.Mixin.receiveComponent.call(
      this,
      nextComponent,
      transaction
    );
  },

  /**
   * Updates a native DOM component after it has already been allocated and
   * attached to the DOM. Reconciles the root DOM node, then recurses.
   *
   * @param {ReactReconcileTransaction} transaction
   * @param {object} prevProps
   * @internal
   * @overridable
   */
  updateComponent: ReactPerf.measure(
    'ReactDOMComponent',
    'updateComponent',
    function(transaction, prevProps, prevOwner) {
      ReactComponent.Mixin.updateComponent.call(
        this,
        transaction,
        prevProps,
        prevOwner
      );
      this._updateDOMProperties(prevProps, transaction);
      this._updateDOMChildren(prevProps, transaction);
    }
  ),

  /**
   * Reconciles the properties by detecting differences in property values and
   * updating the DOM as necessary. This function is probably the single most
   * critical path for performance optimization.
   *
   * TODO: Benchmark whether checking for changed values in memory actually
   *       improves performance (especially statically positioned elements).
   * TODO: Benchmark the effects of putting this at the top since 99% of props
   *       do not change for a given reconciliation.
   * TODO: Benchmark areas that can be improved with caching.
   *
   * @private
   * @param {object} lastProps
   * @param {ReactReconcileTransaction} transaction
   */
  _updateDOMProperties: function(lastProps, transaction) {
    var nextProps = this.props;
    var propKey;
    var styleName;
    var styleUpdates;
    for (propKey in lastProps) {
      if (nextProps.hasOwnProperty(propKey) ||
         !lastProps.hasOwnProperty(propKey)) {
        continue;
      }
      if (propKey === STYLE) {
        var lastStyle = lastProps[propKey];
        for (styleName in lastStyle) {
          if (lastStyle.hasOwnProperty(styleName)) {
            styleUpdates = styleUpdates || {};
            styleUpdates[styleName] = '';
          }
        }
      } else if (registrationNameModules[propKey]) {
        deleteListener(this._rootNodeID, propKey);
      } else if (
          DOMProperty.isStandardName[propKey] ||
          DOMProperty.isCustomAttribute(propKey)) {
        ReactComponent.BackendIDOperations.deletePropertyByID(
          this._rootNodeID,
          propKey
        );
      }
    }
    for (propKey in nextProps) {
      var nextProp = nextProps[propKey];
      var lastProp = lastProps[propKey];
      if (!nextProps.hasOwnProperty(propKey) || nextProp === lastProp) {
        continue;
      }
      if (propKey === STYLE) {
        if (nextProp) {
          nextProp = nextProps.style = merge(nextProp);
        }
        if (lastProp) {
          // Unset styles on `lastProp` but not on `nextProp`.
          for (styleName in lastProp) {
            if (lastProp.hasOwnProperty(styleName) &&
                !nextProp.hasOwnProperty(styleName)) {
              styleUpdates = styleUpdates || {};
              styleUpdates[styleName] = '';
            }
          }
          // Update styles that changed since `lastProp`.
          for (styleName in nextProp) {
            if (nextProp.hasOwnProperty(styleName) &&
                lastProp[styleName] !== nextProp[styleName]) {
              styleUpdates = styleUpdates || {};
              styleUpdates[styleName] = nextProp[styleName];
            }
          }
        } else {
          // Relies on `updateStylesByID` not mutating `styleUpdates`.
          styleUpdates = nextProp;
        }
      } else if (registrationNameModules[propKey]) {
        putListener(this._rootNodeID, propKey, nextProp, transaction);
      } else if (
          DOMProperty.isStandardName[propKey] ||
          DOMProperty.isCustomAttribute(propKey)) {
        ReactComponent.BackendIDOperations.updatePropertyByID(
          this._rootNodeID,
          propKey,
          nextProp
        );
      }
    }
    if (styleUpdates) {
      ReactComponent.BackendIDOperations.updateStylesByID(
        this._rootNodeID,
        styleUpdates
      );
    }
  },

  /**
   * Reconciles the children with the various properties that affect the
   * children content.
   *
   * @param {object} lastProps
   * @param {ReactReconcileTransaction} transaction
   */
  _updateDOMChildren: function(lastProps, transaction) {
    var nextProps = this.props;

    var lastContent =
      CONTENT_TYPES[typeof lastProps.children] ? lastProps.children : null;
    var nextContent =
      CONTENT_TYPES[typeof nextProps.children] ? nextProps.children : null;

    var lastHtml =
      lastProps.dangerouslySetInnerHTML &&
      lastProps.dangerouslySetInnerHTML.__html;
    var nextHtml =
      nextProps.dangerouslySetInnerHTML &&
      nextProps.dangerouslySetInnerHTML.__html;

    // Note the use of `!=` which checks for null or undefined.
    var lastChildren = lastContent != null ? null : lastProps.children;
    var nextChildren = nextContent != null ? null : nextProps.children;

    // If we're switching from children to content/html or vice versa, remove
    // the old content
    var lastHasContentOrHtml = lastContent != null || lastHtml != null;
    var nextHasContentOrHtml = nextContent != null || nextHtml != null;
    if (lastChildren != null && nextChildren == null) {
      this.updateChildren(null, transaction);
    } else if (lastHasContentOrHtml && !nextHasContentOrHtml) {
      this.updateTextContent('');
    }

    if (nextContent != null) {
      if (lastContent !== nextContent) {
        this.updateTextContent('' + nextContent);
      }
    } else if (nextHtml != null) {
      if (lastHtml !== nextHtml) {
        ReactComponent.BackendIDOperations.updateInnerHTMLByID(
          this._rootNodeID,
          nextHtml
        );
      }
    } else if (nextChildren != null) {
      this.updateChildren(nextChildren, transaction);
    }
  },

  /**
   * Destroys all event registrations for this instance. Does not remove from
   * the DOM. That must be done by the parent.
   *
   * @internal
   */
  unmountComponent: function() {
    this.unmountChildren();
    ReactEventEmitter.deleteAllListeners(this._rootNodeID);
    ReactComponent.Mixin.unmountComponent.call(this);
  }

};

mixInto(ReactDOMComponent, ReactComponent.Mixin);
mixInto(ReactDOMComponent, ReactDOMComponent.Mixin);
mixInto(ReactDOMComponent, ReactMultiChild.Mixin);
mixInto(ReactDOMComponent, ReactBrowserComponentMixin);

module.exports = ReactDOMComponent;

}).call(this,require("qvMYcC"))
},{"./CSSPropertyOperations":14,"./DOMProperty":19,"./DOMPropertyOperations":20,"./ReactBrowserComponentMixin":37,"./ReactComponent":41,"./ReactEventEmitter":62,"./ReactMount":70,"./ReactMultiChild":72,"./ReactPerf":75,"./escapeTextForBrowser":121,"./invariant":135,"./keyOf":142,"./merge":144,"./mixInto":147,"qvMYcC":161}],49:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactDOMForm
 */

"use strict";

var ReactBrowserComponentMixin = require("./ReactBrowserComponentMixin");
var ReactCompositeComponent = require("./ReactCompositeComponent");
var ReactDOM = require("./ReactDOM");
var ReactEventEmitter = require("./ReactEventEmitter");
var EventConstants = require("./EventConstants");

// Store a reference to the <form> `ReactDOMComponent`.
var form = ReactDOM.form;

/**
 * Since onSubmit doesn't bubble OR capture on the top level in IE8, we need
 * to capture it on the <form> element itself. There are lots of hacks we could
 * do to accomplish this, but the most reliable is to make <form> a
 * composite component and use `componentDidMount` to attach the event handlers.
 */
var ReactDOMForm = ReactCompositeComponent.createClass({
  displayName: 'ReactDOMForm',

  mixins: [ReactBrowserComponentMixin],

  render: function() {
    // TODO: Instead of using `ReactDOM` directly, we should use JSX. However,
    // `jshint` fails to parse JSX so in order for linting to work in the open
    // source repo, we need to just use `ReactDOM.form`.
    return this.transferPropsTo(form(null, this.props.children));
  },

  componentDidMount: function() {
    ReactEventEmitter.trapBubbledEvent(
      EventConstants.topLevelTypes.topReset,
      'reset',
      this.getDOMNode()
    );
    ReactEventEmitter.trapBubbledEvent(
      EventConstants.topLevelTypes.topSubmit,
      'submit',
      this.getDOMNode()
    );
  }
});

module.exports = ReactDOMForm;

},{"./EventConstants":25,"./ReactBrowserComponentMixin":37,"./ReactCompositeComponent":43,"./ReactDOM":46,"./ReactEventEmitter":62}],50:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactDOMIDOperations
 * @typechecks static-only
 */

/*jslint evil: true */

"use strict";

var CSSPropertyOperations = require("./CSSPropertyOperations");
var DOMChildrenOperations = require("./DOMChildrenOperations");
var DOMPropertyOperations = require("./DOMPropertyOperations");
var ReactMount = require("./ReactMount");
var ReactPerf = require("./ReactPerf");

var invariant = require("./invariant");

/**
 * Errors for properties that should not be updated with `updatePropertyById()`.
 *
 * @type {object}
 * @private
 */
var INVALID_PROPERTY_ERRORS = {
  dangerouslySetInnerHTML:
    '`dangerouslySetInnerHTML` must be set using `updateInnerHTMLByID()`.',
  style: '`style` must be set using `updateStylesByID()`.'
};

var useWhitespaceWorkaround;

/**
 * Operations used to process updates to DOM nodes. This is made injectable via
 * `ReactComponent.BackendIDOperations`.
 */
var ReactDOMIDOperations = {

  /**
   * Updates a DOM node with new property values. This should only be used to
   * update DOM properties in `DOMProperty`.
   *
   * @param {string} id ID of the node to update.
   * @param {string} name A valid property name, see `DOMProperty`.
   * @param {*} value New value of the property.
   * @internal
   */
  updatePropertyByID: ReactPerf.measure(
    'ReactDOMIDOperations',
    'updatePropertyByID',
    function(id, name, value) {
      var node = ReactMount.getNode(id);
      ("production" !== process.env.NODE_ENV ? invariant(
        !INVALID_PROPERTY_ERRORS.hasOwnProperty(name),
        'updatePropertyByID(...): %s',
        INVALID_PROPERTY_ERRORS[name]
      ) : invariant(!INVALID_PROPERTY_ERRORS.hasOwnProperty(name)));

      // If we're updating to null or undefined, we should remove the property
      // from the DOM node instead of inadvertantly setting to a string. This
      // brings us in line with the same behavior we have on initial render.
      if (value != null) {
        DOMPropertyOperations.setValueForProperty(node, name, value);
      } else {
        DOMPropertyOperations.deleteValueForProperty(node, name);
      }
    }
  ),

  /**
   * Updates a DOM node to remove a property. This should only be used to remove
   * DOM properties in `DOMProperty`.
   *
   * @param {string} id ID of the node to update.
   * @param {string} name A property name to remove, see `DOMProperty`.
   * @internal
   */
  deletePropertyByID: ReactPerf.measure(
    'ReactDOMIDOperations',
    'deletePropertyByID',
    function(id, name, value) {
      var node = ReactMount.getNode(id);
      ("production" !== process.env.NODE_ENV ? invariant(
        !INVALID_PROPERTY_ERRORS.hasOwnProperty(name),
        'updatePropertyByID(...): %s',
        INVALID_PROPERTY_ERRORS[name]
      ) : invariant(!INVALID_PROPERTY_ERRORS.hasOwnProperty(name)));
      DOMPropertyOperations.deleteValueForProperty(node, name, value);
    }
  ),

  /**
   * Updates a DOM node with new style values. If a value is specified as '',
   * the corresponding style property will be unset.
   *
   * @param {string} id ID of the node to update.
   * @param {object} styles Mapping from styles to values.
   * @internal
   */
  updateStylesByID: ReactPerf.measure(
    'ReactDOMIDOperations',
    'updateStylesByID',
    function(id, styles) {
      var node = ReactMount.getNode(id);
      CSSPropertyOperations.setValueForStyles(node, styles);
    }
  ),

  /**
   * Updates a DOM node's innerHTML.
   *
   * @param {string} id ID of the node to update.
   * @param {string} html An HTML string.
   * @internal
   */
  updateInnerHTMLByID: ReactPerf.measure(
    'ReactDOMIDOperations',
    'updateInnerHTMLByID',
    function(id, html) {
      var node = ReactMount.getNode(id);

      // IE8: When updating a just created node with innerHTML only leading
      // whitespace is removed. When updating an existing node with innerHTML
      // whitespace in root TextNodes is also collapsed.
      // @see quirksmode.org/bugreports/archives/2004/11/innerhtml_and_t.html

      if (useWhitespaceWorkaround === undefined) {
        // Feature detection; only IE8 is known to behave improperly like this.
        var temp = document.createElement('div');
        temp.innerHTML = ' ';
        useWhitespaceWorkaround = temp.innerHTML === '';
      }

      if (useWhitespaceWorkaround) {
        // Magic theory: IE8 supposedly differentiates between added and updated
        // nodes when processing innerHTML, innerHTML on updated nodes suffers
        // from worse whitespace behavior. Re-adding a node like this triggers
        // the initial and more favorable whitespace behavior.
        node.parentNode.replaceChild(node, node);
      }

      if (useWhitespaceWorkaround && html.match(/^[ \r\n\t\f]/)) {
        // Recover leading whitespace by temporarily prepending any character.
        // \uFEFF has the potential advantage of being zero-width/invisible.
        node.innerHTML = '\uFEFF' + html;
        node.firstChild.deleteData(0, 1);
      } else {
        node.innerHTML = html;
      }
    }
  ),

  /**
   * Updates a DOM node's text content set by `props.content`.
   *
   * @param {string} id ID of the node to update.
   * @param {string} content Text content.
   * @internal
   */
  updateTextContentByID: ReactPerf.measure(
    'ReactDOMIDOperations',
    'updateTextContentByID',
    function(id, content) {
      var node = ReactMount.getNode(id);
      DOMChildrenOperations.updateTextContent(node, content);
    }
  ),

  /**
   * Replaces a DOM node that exists in the document with markup.
   *
   * @param {string} id ID of child to be replaced.
   * @param {string} markup Dangerous markup to inject in place of child.
   * @internal
   * @see {Danger.dangerouslyReplaceNodeWithMarkup}
   */
  dangerouslyReplaceNodeWithMarkupByID: ReactPerf.measure(
    'ReactDOMIDOperations',
    'dangerouslyReplaceNodeWithMarkupByID',
    function(id, markup) {
      var node = ReactMount.getNode(id);
      DOMChildrenOperations.dangerouslyReplaceNodeWithMarkup(node, markup);
    }
  ),

  /**
   * Updates a component's children by processing a series of updates.
   *
   * @param {array<object>} updates List of update configurations.
   * @param {array<string>} markup List of markup strings.
   * @internal
   */
  dangerouslyProcessChildrenUpdates: ReactPerf.measure(
    'ReactDOMIDOperations',
    'dangerouslyProcessChildrenUpdates',
    function(updates, markup) {
      for (var i = 0; i < updates.length; i++) {
        updates[i].parentNode = ReactMount.getNode(updates[i].parentID);
      }
      DOMChildrenOperations.processUpdates(updates, markup);
    }
  )
};

module.exports = ReactDOMIDOperations;

}).call(this,require("qvMYcC"))
},{"./CSSPropertyOperations":14,"./DOMChildrenOperations":18,"./DOMPropertyOperations":20,"./ReactMount":70,"./ReactPerf":75,"./invariant":135,"qvMYcC":161}],51:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactDOMImg
 */

"use strict";

var ReactBrowserComponentMixin = require("./ReactBrowserComponentMixin");
var ReactCompositeComponent = require("./ReactCompositeComponent");
var ReactDOM = require("./ReactDOM");
var ReactEventEmitter = require("./ReactEventEmitter");
var EventConstants = require("./EventConstants");

// Store a reference to the <img> `ReactDOMComponent`.
var img = ReactDOM.img;

/**
 * Since onLoad doesn't bubble OR capture on the top level in IE8, we need to
 * capture it on the <img> element itself. There are lots of hacks we could do
 * to accomplish this, but the most reliable is to make <img> a composite
 * component and use `componentDidMount` to attach the event handlers.
 */
var ReactDOMImg = ReactCompositeComponent.createClass({
  displayName: 'ReactDOMImg',
  tagName: 'IMG',

  mixins: [ReactBrowserComponentMixin],

  render: function() {
    return img(this.props);
  },

  componentDidMount: function() {
    var node = this.getDOMNode();
    ReactEventEmitter.trapBubbledEvent(
      EventConstants.topLevelTypes.topLoad,
      'load',
      node
    );
    ReactEventEmitter.trapBubbledEvent(
      EventConstants.topLevelTypes.topError,
      'error',
      node
    );
  }
});

module.exports = ReactDOMImg;

},{"./EventConstants":25,"./ReactBrowserComponentMixin":37,"./ReactCompositeComponent":43,"./ReactDOM":46,"./ReactEventEmitter":62}],52:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactDOMInput
 */

"use strict";

var AutoFocusMixin = require("./AutoFocusMixin");
var DOMPropertyOperations = require("./DOMPropertyOperations");
var LinkedValueUtils = require("./LinkedValueUtils");
var ReactBrowserComponentMixin = require("./ReactBrowserComponentMixin");
var ReactCompositeComponent = require("./ReactCompositeComponent");
var ReactDOM = require("./ReactDOM");
var ReactMount = require("./ReactMount");

var invariant = require("./invariant");
var merge = require("./merge");

// Store a reference to the <input> `ReactDOMComponent`.
var input = ReactDOM.input;

var instancesByReactID = {};

/**
 * Implements an <input> native component that allows setting these optional
 * props: `checked`, `value`, `defaultChecked`, and `defaultValue`.
 *
 * If `checked` or `value` are not supplied (or null/undefined), user actions
 * that affect the checked state or value will trigger updates to the element.
 *
 * If they are supplied (and not null/undefined), the rendered element will not
 * trigger updates to the element. Instead, the props must change in order for
 * the rendered element to be updated.
 *
 * The rendered element will be initialized as unchecked (or `defaultChecked`)
 * with an empty value (or `defaultValue`).
 *
 * @see http://www.w3.org/TR/2012/WD-html5-20121025/the-input-element.html
 */
var ReactDOMInput = ReactCompositeComponent.createClass({
  displayName: 'ReactDOMInput',

  mixins: [AutoFocusMixin, LinkedValueUtils.Mixin, ReactBrowserComponentMixin],

  getInitialState: function() {
    var defaultValue = this.props.defaultValue;
    return {
      checked: this.props.defaultChecked || false,
      value: defaultValue != null ? defaultValue : null
    };
  },

  shouldComponentUpdate: function() {
    // Defer any updates to this component during the `onChange` handler.
    return !this._isChanging;
  },

  render: function() {
    // Clone `this.props` so we don't mutate the input.
    var props = merge(this.props);

    props.defaultChecked = null;
    props.defaultValue = null;

    var value = LinkedValueUtils.getValue(this);
    props.value = value != null ? value : this.state.value;

    var checked = LinkedValueUtils.getChecked(this);
    props.checked = checked != null ? checked : this.state.checked;

    props.onChange = this._handleChange;

    return input(props, this.props.children);
  },

  componentDidMount: function() {
    var id = ReactMount.getID(this.getDOMNode());
    instancesByReactID[id] = this;
  },

  componentWillUnmount: function() {
    var rootNode = this.getDOMNode();
    var id = ReactMount.getID(rootNode);
    delete instancesByReactID[id];
  },

  componentDidUpdate: function(prevProps, prevState, prevContext) {
    var rootNode = this.getDOMNode();
    if (this.props.checked != null) {
      DOMPropertyOperations.setValueForProperty(
        rootNode,
        'checked',
        this.props.checked || false
      );
    }

    var value = LinkedValueUtils.getValue(this);
    if (value != null) {
      // Cast `value` to a string to ensure the value is set correctly. While
      // browsers typically do this as necessary, jsdom doesn't.
      DOMPropertyOperations.setValueForProperty(rootNode, 'value', '' + value);
    }
  },

  _handleChange: function(event) {
    var returnValue;
    var onChange = LinkedValueUtils.getOnChange(this);
    if (onChange) {
      this._isChanging = true;
      returnValue = onChange.call(this, event);
      this._isChanging = false;
    }
    this.setState({
      checked: event.target.checked,
      value: event.target.value
    });

    var name = this.props.name;
    if (this.props.type === 'radio' && name != null) {
      var rootNode = this.getDOMNode();
      var queryRoot = rootNode;

      while (queryRoot.parentNode) {
        queryRoot = queryRoot.parentNode;
      }

      // If `rootNode.form` was non-null, then we could try `form.elements`,
      // but that sometimes behaves strangely in IE8. We could also try using
      // `form.getElementsByName`, but that will only return direct children
      // and won't include inputs that use the HTML5 `form=` attribute. Since
      // the input might not even be in a form, let's just use the global
      // `querySelectorAll` to ensure we don't miss anything.
      var group = queryRoot.querySelectorAll(
        'input[name=' + JSON.stringify('' + name) + '][type="radio"]');

      for (var i = 0, groupLen = group.length; i < groupLen; i++) {
        var otherNode = group[i];
        if (otherNode === rootNode ||
            otherNode.form !== rootNode.form) {
          continue;
        }
        var otherID = ReactMount.getID(otherNode);
        ("production" !== process.env.NODE_ENV ? invariant(
          otherID,
          'ReactDOMInput: Mixing React and non-React radio inputs with the ' +
          'same `name` is not supported.'
        ) : invariant(otherID));
        var otherInstance = instancesByReactID[otherID];
        ("production" !== process.env.NODE_ENV ? invariant(
          otherInstance,
          'ReactDOMInput: Unknown radio button ID %s.',
          otherID
        ) : invariant(otherInstance));
        // In some cases, this will actually change the `checked` state value.
        // In other cases, there's no change but this forces a reconcile upon
        // which componentDidUpdate will reset the DOM property to whatever it
        // should be.
        otherInstance.setState({
          checked: false
        });
      }
    }

    return returnValue;
  }

});

module.exports = ReactDOMInput;

}).call(this,require("qvMYcC"))
},{"./AutoFocusMixin":11,"./DOMPropertyOperations":20,"./LinkedValueUtils":33,"./ReactBrowserComponentMixin":37,"./ReactCompositeComponent":43,"./ReactDOM":46,"./ReactMount":70,"./invariant":135,"./merge":144,"qvMYcC":161}],53:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactDOMOption
 */

"use strict";

var ReactBrowserComponentMixin = require("./ReactBrowserComponentMixin");
var ReactCompositeComponent = require("./ReactCompositeComponent");
var ReactDOM = require("./ReactDOM");

var warning = require("./warning");

// Store a reference to the <option> `ReactDOMComponent`.
var option = ReactDOM.option;

/**
 * Implements an <option> native component that warns when `selected` is set.
 */
var ReactDOMOption = ReactCompositeComponent.createClass({
  displayName: 'ReactDOMOption',

  mixins: [ReactBrowserComponentMixin],

  componentWillMount: function() {
    // TODO (yungsters): Remove support for `selected` in <option>.
    if ("production" !== process.env.NODE_ENV) {
      ("production" !== process.env.NODE_ENV ? warning(
        this.props.selected == null,
        'Use the `defaultValue` or `value` props on <select> instead of ' +
        'setting `selected` on <option>.'
      ) : null);
    }
  },

  render: function() {
    return option(this.props, this.props.children);
  }

});

module.exports = ReactDOMOption;

}).call(this,require("qvMYcC"))
},{"./ReactBrowserComponentMixin":37,"./ReactCompositeComponent":43,"./ReactDOM":46,"./warning":158,"qvMYcC":161}],54:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactDOMSelect
 */

"use strict";

var AutoFocusMixin = require("./AutoFocusMixin");
var LinkedValueUtils = require("./LinkedValueUtils");
var ReactBrowserComponentMixin = require("./ReactBrowserComponentMixin");
var ReactCompositeComponent = require("./ReactCompositeComponent");
var ReactDOM = require("./ReactDOM");

var invariant = require("./invariant");
var merge = require("./merge");

// Store a reference to the <select> `ReactDOMComponent`.
var select = ReactDOM.select;

/**
 * Validation function for `value` and `defaultValue`.
 * @private
 */
function selectValueType(props, propName, componentName) {
  if (props[propName] == null) {
    return;
  }
  if (props.multiple) {
    ("production" !== process.env.NODE_ENV ? invariant(
      Array.isArray(props[propName]),
      'The `%s` prop supplied to <select> must be an array if `multiple` is ' +
      'true.',
      propName
    ) : invariant(Array.isArray(props[propName])));
  } else {
    ("production" !== process.env.NODE_ENV ? invariant(
      !Array.isArray(props[propName]),
      'The `%s` prop supplied to <select> must be a scalar value if ' +
      '`multiple` is false.',
      propName
    ) : invariant(!Array.isArray(props[propName])));
  }
}

/**
 * If `value` is supplied, updates <option> elements on mount and update.
 * @param {ReactComponent} component Instance of ReactDOMSelect
 * @param {?*} propValue For uncontrolled components, null/undefined. For
 * controlled components, a string (or with `multiple`, a list of strings).
 * @private
 */
function updateOptions(component, propValue) {
  var multiple = component.props.multiple;
  var value = propValue != null ? propValue : component.state.value;
  var options = component.getDOMNode().options;
  var selectedValue, i, l;
  if (multiple) {
    selectedValue = {};
    for (i = 0, l = value.length; i < l; ++i) {
      selectedValue['' + value[i]] = true;
    }
  } else {
    selectedValue = '' + value;
  }
  for (i = 0, l = options.length; i < l; i++) {
    var selected = multiple ?
      selectedValue.hasOwnProperty(options[i].value) :
      options[i].value === selectedValue;

    if (selected !== options[i].selected) {
      options[i].selected = selected;
    }
  }
}

/**
 * Implements a <select> native component that allows optionally setting the
 * props `value` and `defaultValue`. If `multiple` is false, the prop must be a
 * string. If `multiple` is true, the prop must be an array of strings.
 *
 * If `value` is not supplied (or null/undefined), user actions that change the
 * selected option will trigger updates to the rendered options.
 *
 * If it is supplied (and not null/undefined), the rendered options will not
 * update in response to user actions. Instead, the `value` prop must change in
 * order for the rendered options to update.
 *
 * If `defaultValue` is provided, any options with the supplied values will be
 * selected.
 */
var ReactDOMSelect = ReactCompositeComponent.createClass({
  displayName: 'ReactDOMSelect',

  mixins: [AutoFocusMixin, LinkedValueUtils.Mixin, ReactBrowserComponentMixin],

  propTypes: {
    defaultValue: selectValueType,
    value: selectValueType
  },

  getInitialState: function() {
    return {value: this.props.defaultValue || (this.props.multiple ? [] : '')};
  },

  componentWillReceiveProps: function(nextProps) {
    if (!this.props.multiple && nextProps.multiple) {
      this.setState({value: [this.state.value]});
    } else if (this.props.multiple && !nextProps.multiple) {
      this.setState({value: this.state.value[0]});
    }
  },

  shouldComponentUpdate: function() {
    // Defer any updates to this component during the `onChange` handler.
    return !this._isChanging;
  },

  render: function() {
    // Clone `this.props` so we don't mutate the input.
    var props = merge(this.props);

    props.onChange = this._handleChange;
    props.value = null;

    return select(props, this.props.children);
  },

  componentDidMount: function() {
    updateOptions(this, LinkedValueUtils.getValue(this));
  },

  componentDidUpdate: function() {
    var value = LinkedValueUtils.getValue(this);
    if (value != null) {
      updateOptions(this, value);
    }
  },

  _handleChange: function(event) {
    var returnValue;
    var onChange = LinkedValueUtils.getOnChange(this);
    if (onChange) {
      this._isChanging = true;
      returnValue = onChange.call(this, event);
      this._isChanging = false;
    }

    var selectedValue;
    if (this.props.multiple) {
      selectedValue = [];
      var options = event.target.options;
      for (var i = 0, l = options.length; i < l; i++) {
        if (options[i].selected) {
          selectedValue.push(options[i].value);
        }
      }
    } else {
      selectedValue = event.target.value;
    }

    this.setState({value: selectedValue});
    return returnValue;
  }

});

module.exports = ReactDOMSelect;

}).call(this,require("qvMYcC"))
},{"./AutoFocusMixin":11,"./LinkedValueUtils":33,"./ReactBrowserComponentMixin":37,"./ReactCompositeComponent":43,"./ReactDOM":46,"./invariant":135,"./merge":144,"qvMYcC":161}],55:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactDOMSelection
 */

"use strict";

var getNodeForCharacterOffset = require("./getNodeForCharacterOffset");
var getTextContentAccessor = require("./getTextContentAccessor");

/**
 * Get the appropriate anchor and focus node/offset pairs for IE.
 *
 * The catch here is that IE's selection API doesn't provide information
 * about whether the selection is forward or backward, so we have to
 * behave as though it's always forward.
 *
 * IE text differs from modern selection in that it behaves as though
 * block elements end with a new line. This means character offsets will
 * differ between the two APIs.
 *
 * @param {DOMElement} node
 * @return {object}
 */
function getIEOffsets(node) {
  var selection = document.selection;
  var selectedRange = selection.createRange();
  var selectedLength = selectedRange.text.length;

  // Duplicate selection so we can move range without breaking user selection.
  var fromStart = selectedRange.duplicate();
  fromStart.moveToElementText(node);
  fromStart.setEndPoint('EndToStart', selectedRange);

  var startOffset = fromStart.text.length;
  var endOffset = startOffset + selectedLength;

  return {
    start: startOffset,
    end: endOffset
  };
}

/**
 * @param {DOMElement} node
 * @return {?object}
 */
function getModernOffsets(node) {
  var selection = window.getSelection();

  if (selection.rangeCount === 0) {
    return null;
  }

  var anchorNode = selection.anchorNode;
  var anchorOffset = selection.anchorOffset;
  var focusNode = selection.focusNode;
  var focusOffset = selection.focusOffset;

  var currentRange = selection.getRangeAt(0);
  var rangeLength = currentRange.toString().length;

  var tempRange = currentRange.cloneRange();
  tempRange.selectNodeContents(node);
  tempRange.setEnd(currentRange.startContainer, currentRange.startOffset);

  var start = tempRange.toString().length;
  var end = start + rangeLength;

  // Detect whether the selection is backward.
  var detectionRange = document.createRange();
  detectionRange.setStart(anchorNode, anchorOffset);
  detectionRange.setEnd(focusNode, focusOffset);
  var isBackward = detectionRange.collapsed;
  detectionRange.detach();

  return {
    start: isBackward ? end : start,
    end: isBackward ? start : end
  };
}

/**
 * @param {DOMElement|DOMTextNode} node
 * @param {object} offsets
 */
function setIEOffsets(node, offsets) {
  var range = document.selection.createRange().duplicate();
  var start, end;

  if (typeof offsets.end === 'undefined') {
    start = offsets.start;
    end = start;
  } else if (offsets.start > offsets.end) {
    start = offsets.end;
    end = offsets.start;
  } else {
    start = offsets.start;
    end = offsets.end;
  }

  range.moveToElementText(node);
  range.moveStart('character', start);
  range.setEndPoint('EndToStart', range);
  range.moveEnd('character', end - start);
  range.select();
}

/**
 * In modern non-IE browsers, we can support both forward and backward
 * selections.
 *
 * Note: IE10+ supports the Selection object, but it does not support
 * the `extend` method, which means that even in modern IE, it's not possible
 * to programatically create a backward selection. Thus, for all IE
 * versions, we use the old IE API to create our selections.
 *
 * @param {DOMElement|DOMTextNode} node
 * @param {object} offsets
 */
function setModernOffsets(node, offsets) {
  var selection = window.getSelection();

  var length = node[getTextContentAccessor()].length;
  var start = Math.min(offsets.start, length);
  var end = typeof offsets.end === 'undefined' ?
            start : Math.min(offsets.end, length);

  // IE 11 uses modern selection, but doesn't support the extend method.
  // Flip backward selections, so we can set with a single range.
  if (!selection.extend && start > end) {
    var temp = end;
    end = start;
    start = temp;
  }

  var startMarker = getNodeForCharacterOffset(node, start);
  var endMarker = getNodeForCharacterOffset(node, end);

  if (startMarker && endMarker) {
    var range = document.createRange();
    range.setStart(startMarker.node, startMarker.offset);
    selection.removeAllRanges();

    if (start > end) {
      selection.addRange(range);
      selection.extend(endMarker.node, endMarker.offset);
    } else {
      range.setEnd(endMarker.node, endMarker.offset);
      selection.addRange(range);
    }

    range.detach();
  }
}

var ReactDOMSelection = {
  /**
   * @param {DOMElement} node
   */
  getOffsets: function(node) {
    var getOffsets = document.selection ? getIEOffsets : getModernOffsets;
    return getOffsets(node);
  },

  /**
   * @param {DOMElement|DOMTextNode} node
   * @param {object} offsets
   */
  setOffsets: function(node, offsets) {
    var setOffsets = document.selection ? setIEOffsets : setModernOffsets;
    setOffsets(node, offsets);
  }
};

module.exports = ReactDOMSelection;

},{"./getNodeForCharacterOffset":129,"./getTextContentAccessor":131}],56:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactDOMTextarea
 */

"use strict";

var AutoFocusMixin = require("./AutoFocusMixin");
var DOMPropertyOperations = require("./DOMPropertyOperations");
var LinkedValueUtils = require("./LinkedValueUtils");
var ReactBrowserComponentMixin = require("./ReactBrowserComponentMixin");
var ReactCompositeComponent = require("./ReactCompositeComponent");
var ReactDOM = require("./ReactDOM");

var invariant = require("./invariant");
var merge = require("./merge");

var warning = require("./warning");

// Store a reference to the <textarea> `ReactDOMComponent`.
var textarea = ReactDOM.textarea;

/**
 * Implements a <textarea> native component that allows setting `value`, and
 * `defaultValue`. This differs from the traditional DOM API because value is
 * usually set as PCDATA children.
 *
 * If `value` is not supplied (or null/undefined), user actions that affect the
 * value will trigger updates to the element.
 *
 * If `value` is supplied (and not null/undefined), the rendered element will
 * not trigger updates to the element. Instead, the `value` prop must change in
 * order for the rendered element to be updated.
 *
 * The rendered element will be initialized with an empty value, the prop
 * `defaultValue` if specified, or the children content (deprecated).
 */
var ReactDOMTextarea = ReactCompositeComponent.createClass({
  displayName: 'ReactDOMTextarea',

  mixins: [AutoFocusMixin, LinkedValueUtils.Mixin, ReactBrowserComponentMixin],

  getInitialState: function() {
    var defaultValue = this.props.defaultValue;
    // TODO (yungsters): Remove support for children content in <textarea>.
    var children = this.props.children;
    if (children != null) {
      if ("production" !== process.env.NODE_ENV) {
        ("production" !== process.env.NODE_ENV ? warning(
          false,
          'Use the `defaultValue` or `value` props instead of setting ' +
          'children on <textarea>.'
        ) : null);
      }
      ("production" !== process.env.NODE_ENV ? invariant(
        defaultValue == null,
        'If you supply `defaultValue` on a <textarea>, do not pass children.'
      ) : invariant(defaultValue == null));
      if (Array.isArray(children)) {
        ("production" !== process.env.NODE_ENV ? invariant(
          children.length <= 1,
          '<textarea> can only have at most one child.'
        ) : invariant(children.length <= 1));
        children = children[0];
      }

      defaultValue = '' + children;
    }
    if (defaultValue == null) {
      defaultValue = '';
    }
    var value = LinkedValueUtils.getValue(this);
    return {
      // We save the initial value so that `ReactDOMComponent` doesn't update
      // `textContent` (unnecessary since we update value).
      // The initial value can be a boolean or object so that's why it's
      // forced to be a string.
      initialValue: '' + (value != null ? value : defaultValue),
      value: defaultValue
    };
  },

  shouldComponentUpdate: function() {
    // Defer any updates to this component during the `onChange` handler.
    return !this._isChanging;
  },

  render: function() {
    // Clone `this.props` so we don't mutate the input.
    var props = merge(this.props);
    var value = LinkedValueUtils.getValue(this);

    ("production" !== process.env.NODE_ENV ? invariant(
      props.dangerouslySetInnerHTML == null,
      '`dangerouslySetInnerHTML` does not make sense on <textarea>.'
    ) : invariant(props.dangerouslySetInnerHTML == null));

    props.defaultValue = null;
    props.value = value != null ? value : this.state.value;
    props.onChange = this._handleChange;

    // Always set children to the same thing. In IE9, the selection range will
    // get reset if `textContent` is mutated.
    return textarea(props, this.state.initialValue);
  },

  componentDidUpdate: function(prevProps, prevState, prevContext) {
    var value = LinkedValueUtils.getValue(this);
    if (value != null) {
      var rootNode = this.getDOMNode();
      // Cast `value` to a string to ensure the value is set correctly. While
      // browsers typically do this as necessary, jsdom doesn't.
      DOMPropertyOperations.setValueForProperty(rootNode, 'value', '' + value);
    }
  },

  _handleChange: function(event) {
    var returnValue;
    var onChange = LinkedValueUtils.getOnChange(this);
    if (onChange) {
      this._isChanging = true;
      returnValue = onChange.call(this, event);
      this._isChanging = false;
    }
    this.setState({value: event.target.value});
    return returnValue;
  }

});

module.exports = ReactDOMTextarea;

}).call(this,require("qvMYcC"))
},{"./AutoFocusMixin":11,"./DOMPropertyOperations":20,"./LinkedValueUtils":33,"./ReactBrowserComponentMixin":37,"./ReactCompositeComponent":43,"./ReactDOM":46,"./invariant":135,"./merge":144,"./warning":158,"qvMYcC":161}],57:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactDefaultBatchingStrategy
 */

"use strict";

var ReactUpdates = require("./ReactUpdates");
var Transaction = require("./Transaction");

var emptyFunction = require("./emptyFunction");
var mixInto = require("./mixInto");

var RESET_BATCHED_UPDATES = {
  initialize: emptyFunction,
  close: function() {
    ReactDefaultBatchingStrategy.isBatchingUpdates = false;
  }
};

var FLUSH_BATCHED_UPDATES = {
  initialize: emptyFunction,
  close: ReactUpdates.flushBatchedUpdates.bind(ReactUpdates)
};

var TRANSACTION_WRAPPERS = [FLUSH_BATCHED_UPDATES, RESET_BATCHED_UPDATES];

function ReactDefaultBatchingStrategyTransaction() {
  this.reinitializeTransaction();
}

mixInto(ReactDefaultBatchingStrategyTransaction, Transaction.Mixin);
mixInto(ReactDefaultBatchingStrategyTransaction, {
  getTransactionWrappers: function() {
    return TRANSACTION_WRAPPERS;
  }
});

var transaction = new ReactDefaultBatchingStrategyTransaction();

var ReactDefaultBatchingStrategy = {
  isBatchingUpdates: false,

  /**
   * Call the provided function in a context within which calls to `setState`
   * and friends are batched such that components aren't updated unnecessarily.
   */
  batchedUpdates: function(callback, param) {
    var alreadyBatchingUpdates = ReactDefaultBatchingStrategy.isBatchingUpdates;

    ReactDefaultBatchingStrategy.isBatchingUpdates = true;

    // The code is written this way to avoid extra allocations
    if (alreadyBatchingUpdates) {
      callback(param);
    } else {
      transaction.perform(callback, null, param);
    }
  }
};

module.exports = ReactDefaultBatchingStrategy;

},{"./ReactUpdates":91,"./Transaction":106,"./emptyFunction":119,"./mixInto":147}],58:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactDefaultInjection
 */

"use strict";

var ReactInjection = require("./ReactInjection");

var ExecutionEnvironment = require("./ExecutionEnvironment");

var DefaultDOMPropertyConfig = require("./DefaultDOMPropertyConfig");

var ChangeEventPlugin = require("./ChangeEventPlugin");
var ClientReactRootIndex = require("./ClientReactRootIndex");
var CompositionEventPlugin = require("./CompositionEventPlugin");
var DefaultEventPluginOrder = require("./DefaultEventPluginOrder");
var EnterLeaveEventPlugin = require("./EnterLeaveEventPlugin");
var MobileSafariClickEventPlugin = require("./MobileSafariClickEventPlugin");
var ReactBrowserComponentMixin = require("./ReactBrowserComponentMixin");
var ReactComponentBrowserEnvironment =
  require("./ReactComponentBrowserEnvironment");
var ReactEventTopLevelCallback = require("./ReactEventTopLevelCallback");
var ReactDOM = require("./ReactDOM");
var ReactDOMButton = require("./ReactDOMButton");
var ReactDOMForm = require("./ReactDOMForm");
var ReactDOMImg = require("./ReactDOMImg");
var ReactDOMInput = require("./ReactDOMInput");
var ReactDOMOption = require("./ReactDOMOption");
var ReactDOMSelect = require("./ReactDOMSelect");
var ReactDOMTextarea = require("./ReactDOMTextarea");
var ReactInstanceHandles = require("./ReactInstanceHandles");
var ReactMount = require("./ReactMount");
var SelectEventPlugin = require("./SelectEventPlugin");
var ServerReactRootIndex = require("./ServerReactRootIndex");
var SimpleEventPlugin = require("./SimpleEventPlugin");

var ReactDefaultBatchingStrategy = require("./ReactDefaultBatchingStrategy");

var createFullPageComponent = require("./createFullPageComponent");

function inject() {
  ReactInjection.EventEmitter.injectTopLevelCallbackCreator(
    ReactEventTopLevelCallback
  );

  /**
   * Inject modules for resolving DOM hierarchy and plugin ordering.
   */
  ReactInjection.EventPluginHub.injectEventPluginOrder(DefaultEventPluginOrder);
  ReactInjection.EventPluginHub.injectInstanceHandle(ReactInstanceHandles);
  ReactInjection.EventPluginHub.injectMount(ReactMount);

  /**
   * Some important event plugins included by default (without having to require
   * them).
   */
  ReactInjection.EventPluginHub.injectEventPluginsByName({
    SimpleEventPlugin: SimpleEventPlugin,
    EnterLeaveEventPlugin: EnterLeaveEventPlugin,
    ChangeEventPlugin: ChangeEventPlugin,
    CompositionEventPlugin: CompositionEventPlugin,
    MobileSafariClickEventPlugin: MobileSafariClickEventPlugin,
    SelectEventPlugin: SelectEventPlugin
  });

  ReactInjection.DOM.injectComponentClasses({
    button: ReactDOMButton,
    form: ReactDOMForm,
    img: ReactDOMImg,
    input: ReactDOMInput,
    option: ReactDOMOption,
    select: ReactDOMSelect,
    textarea: ReactDOMTextarea,

    html: createFullPageComponent(ReactDOM.html),
    head: createFullPageComponent(ReactDOM.head),
    title: createFullPageComponent(ReactDOM.title),
    body: createFullPageComponent(ReactDOM.body)
  });


  // This needs to happen after createFullPageComponent() otherwise the mixin
  // gets double injected.
  ReactInjection.CompositeComponent.injectMixin(ReactBrowserComponentMixin);

  ReactInjection.DOMProperty.injectDOMPropertyConfig(DefaultDOMPropertyConfig);

  ReactInjection.Updates.injectBatchingStrategy(
    ReactDefaultBatchingStrategy
  );

  ReactInjection.RootIndex.injectCreateReactRootIndex(
    ExecutionEnvironment.canUseDOM ?
      ClientReactRootIndex.createReactRootIndex :
      ServerReactRootIndex.createReactRootIndex
  );

  ReactInjection.Component.injectEnvironment(ReactComponentBrowserEnvironment);

  if ("production" !== process.env.NODE_ENV) {
    var url = (ExecutionEnvironment.canUseDOM && window.location.href) || '';
    if ((/[?&]react_perf\b/).test(url)) {
      var ReactDefaultPerf = require("./ReactDefaultPerf");
      ReactDefaultPerf.start();
    }
  }
}

module.exports = {
  inject: inject
};

}).call(this,require("qvMYcC"))
},{"./ChangeEventPlugin":15,"./ClientReactRootIndex":16,"./CompositionEventPlugin":17,"./DefaultDOMPropertyConfig":22,"./DefaultEventPluginOrder":23,"./EnterLeaveEventPlugin":24,"./ExecutionEnvironment":31,"./MobileSafariClickEventPlugin":34,"./ReactBrowserComponentMixin":37,"./ReactComponentBrowserEnvironment":42,"./ReactDOM":46,"./ReactDOMButton":47,"./ReactDOMForm":49,"./ReactDOMImg":51,"./ReactDOMInput":52,"./ReactDOMOption":53,"./ReactDOMSelect":54,"./ReactDOMTextarea":56,"./ReactDefaultBatchingStrategy":57,"./ReactDefaultPerf":59,"./ReactEventTopLevelCallback":64,"./ReactInjection":65,"./ReactInstanceHandles":67,"./ReactMount":70,"./SelectEventPlugin":93,"./ServerReactRootIndex":94,"./SimpleEventPlugin":95,"./createFullPageComponent":114,"qvMYcC":161}],59:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactDefaultPerf
 * @typechecks static-only
 */

"use strict";

var DOMProperty = require("./DOMProperty");
var ReactDefaultPerfAnalysis = require("./ReactDefaultPerfAnalysis");
var ReactMount = require("./ReactMount");
var ReactPerf = require("./ReactPerf");

var performanceNow = require("./performanceNow");

function roundFloat(val) {
  return Math.floor(val * 100) / 100;
}

var ReactDefaultPerf = {
  _allMeasurements: [], // last item in the list is the current one
  _injected: false,

  start: function() {
    if (!ReactDefaultPerf._injected) {
      ReactPerf.injection.injectMeasure(ReactDefaultPerf.measure);
    }

    ReactDefaultPerf._allMeasurements.length = 0;
    ReactPerf.enableMeasure = true;
  },

  stop: function() {
    ReactPerf.enableMeasure = false;
  },

  getLastMeasurements: function() {
    return ReactDefaultPerf._allMeasurements;
  },

  printExclusive: function(measurements) {
    measurements = measurements || ReactDefaultPerf._allMeasurements;
    var summary = ReactDefaultPerfAnalysis.getExclusiveSummary(measurements);
    console.table(summary.map(function(item) {
      return {
        'Component class name': item.componentName,
        'Total inclusive time (ms)': roundFloat(item.inclusive),
        'Total exclusive time (ms)': roundFloat(item.exclusive),
        'Exclusive time per instance (ms)': roundFloat(item.exclusive / item.count),
        'Instances': item.count
      };
    }));
    console.log(
      'Total time:',
      ReactDefaultPerfAnalysis.getTotalTime(measurements).toFixed(2) + ' ms'
    );
  },

  printInclusive: function(measurements) {
    measurements = measurements || ReactDefaultPerf._allMeasurements;
    var summary = ReactDefaultPerfAnalysis.getInclusiveSummary(measurements);
    console.table(summary.map(function(item) {
      return {
        'Owner > component': item.componentName,
        'Inclusive time (ms)': roundFloat(item.time),
        'Instances': item.count
      };
    }));
    console.log(
      'Total time:',
      ReactDefaultPerfAnalysis.getTotalTime(measurements).toFixed(2) + ' ms'
    );
  },

  printWasted: function(measurements) {
    measurements = measurements || ReactDefaultPerf._allMeasurements;
    var summary = ReactDefaultPerfAnalysis.getInclusiveSummary(
      measurements,
      true
    );
    console.table(summary.map(function(item) {
      return {
        'Owner > component': item.componentName,
        'Wasted time (ms)': item.time,
        'Instances': item.count
      };
    }));
    console.log(
      'Total time:',
      ReactDefaultPerfAnalysis.getTotalTime(measurements).toFixed(2) + ' ms'
    );
  },

  printDOM: function(measurements) {
    measurements = measurements || ReactDefaultPerf._allMeasurements;
    var summary = ReactDefaultPerfAnalysis.getDOMSummary(measurements);
    console.table(summary.map(function(item) {
      var result = {};
      result[DOMProperty.ID_ATTRIBUTE_NAME] = item.id;
      result['type'] = item.type;
      result['args'] = JSON.stringify(item.args);
      return result;
    }));
    console.log(
      'Total time:',
      ReactDefaultPerfAnalysis.getTotalTime(measurements).toFixed(2) + ' ms'
    );
  },

  _recordWrite: function(id, fnName, totalTime, args) {
    // TODO: totalTime isn't that useful since it doesn't count paints/reflows
    var writes =
      ReactDefaultPerf
        ._allMeasurements[ReactDefaultPerf._allMeasurements.length - 1]
        .writes;
    writes[id] = writes[id] || [];
    writes[id].push({
      type: fnName,
      time: totalTime,
      args: args
    });
  },

  measure: function(moduleName, fnName, func) {
    return function() {var args=Array.prototype.slice.call(arguments,0);
      var totalTime;
      var rv;
      var start;

      if (fnName === '_renderNewRootComponent' ||
          fnName === 'flushBatchedUpdates') {
        // A "measurement" is a set of metrics recorded for each flush. We want
        // to group the metrics for a given flush together so we can look at the
        // components that rendered and the DOM operations that actually
        // happened to determine the amount of "wasted work" performed.
        ReactDefaultPerf._allMeasurements.push({
          exclusive: {},
          inclusive: {},
          counts: {},
          writes: {},
          displayNames: {},
          totalTime: 0
        });
        start = performanceNow();
        rv = func.apply(this, args);
        ReactDefaultPerf._allMeasurements[
          ReactDefaultPerf._allMeasurements.length - 1
        ].totalTime = performanceNow() - start;
        return rv;
      } else if (moduleName === 'ReactDOMIDOperations' ||
        moduleName === 'ReactComponentBrowserEnvironment') {
        start = performanceNow();
        rv = func.apply(this, args);
        totalTime = performanceNow() - start;

        if (fnName === 'mountImageIntoNode') {
          var mountID = ReactMount.getID(args[1]);
          ReactDefaultPerf._recordWrite(mountID, fnName, totalTime, args[0]);
        } else if (fnName === 'dangerouslyProcessChildrenUpdates') {
          // special format
          args[0].forEach(function(update) {
            var writeArgs = {};
            if (update.fromIndex !== null) {
              writeArgs.fromIndex = update.fromIndex;
            }
            if (update.toIndex !== null) {
              writeArgs.toIndex = update.toIndex;
            }
            if (update.textContent !== null) {
              writeArgs.textContent = update.textContent;
            }
            if (update.markupIndex !== null) {
              writeArgs.markup = args[1][update.markupIndex];
            }
            ReactDefaultPerf._recordWrite(
              update.parentID,
              update.type,
              totalTime,
              writeArgs
            );
          });
        } else {
          // basic format
          ReactDefaultPerf._recordWrite(
            args[0],
            fnName,
            totalTime,
            Array.prototype.slice.call(args, 1)
          );
        }
        return rv;
      } else if (moduleName === 'ReactCompositeComponent' && (
        fnName === 'mountComponent' ||
        fnName === 'updateComponent' || // TODO: receiveComponent()?
        fnName === '_renderValidatedComponent')) {

        var rootNodeID = fnName === 'mountComponent' ?
          args[0] :
          this._rootNodeID;
        var isRender = fnName === '_renderValidatedComponent';
        var entry = ReactDefaultPerf._allMeasurements[
          ReactDefaultPerf._allMeasurements.length - 1
        ];

        if (isRender) {
          entry.counts[rootNodeID] = entry.counts[rootNodeID] || 0;
          entry.counts[rootNodeID] += 1;
        }

        start = performanceNow();
        rv = func.apply(this, args);
        totalTime = performanceNow() - start;

        var typeOfLog = isRender ? entry.exclusive : entry.inclusive;
        typeOfLog[rootNodeID] = typeOfLog[rootNodeID] || 0;
        typeOfLog[rootNodeID] += totalTime;

        entry.displayNames[rootNodeID] = {
          current: this.constructor.displayName,
          owner: this._owner ? this._owner.constructor.displayName : '<root>'
        };

        return rv;
      } else {
        return func.apply(this, args);
      }
    };
  }
};

module.exports = ReactDefaultPerf;

},{"./DOMProperty":19,"./ReactDefaultPerfAnalysis":60,"./ReactMount":70,"./ReactPerf":75,"./performanceNow":152}],60:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactDefaultPerfAnalysis
 */

var merge = require("./merge");

// Don't try to save users less than 1.2ms (a number I made up)
var DONT_CARE_THRESHOLD = 1.2;
var DOM_OPERATION_TYPES = {
  'mountImageIntoNode': 'set innerHTML',
  INSERT_MARKUP: 'set innerHTML',
  MOVE_EXISTING: 'move',
  REMOVE_NODE: 'remove',
  TEXT_CONTENT: 'set textContent',
  'updatePropertyByID': 'update attribute',
  'deletePropertyByID': 'delete attribute',
  'updateStylesByID': 'update styles',
  'updateInnerHTMLByID': 'set innerHTML',
  'dangerouslyReplaceNodeWithMarkupByID': 'replace'
};

function getTotalTime(measurements) {
  // TODO: return number of DOM ops? could be misleading.
  // TODO: measure dropped frames after reconcile?
  // TODO: log total time of each reconcile and the top-level component
  // class that triggered it.
  var totalTime = 0;
  for (var i = 0; i < measurements.length; i++) {
    var measurement = measurements[i];
    totalTime += measurement.totalTime;
  }
  return totalTime;
}

function getDOMSummary(measurements) {
  var items = [];
  for (var i = 0; i < measurements.length; i++) {
    var measurement = measurements[i];
    var id;

    for (id in measurement.writes) {
      measurement.writes[id].forEach(function(write) {
        items.push({
          id: id,
          type: DOM_OPERATION_TYPES[write.type] || write.type,
          args: write.args
        });
      });
    }
  }
  return items;
}

function getExclusiveSummary(measurements) {
  var candidates = {};
  var displayName;

  for (var i = 0; i < measurements.length; i++) {
    var measurement = measurements[i];
    var allIDs = merge(measurement.exclusive, measurement.inclusive);

    for (var id in allIDs) {
      displayName = measurement.displayNames[id].current;

      candidates[displayName] = candidates[displayName] || {
        componentName: displayName,
        inclusive: 0,
        exclusive: 0,
        count: 0
      };
      if (measurement.exclusive[id]) {
        candidates[displayName].exclusive += measurement.exclusive[id];
      }
      if (measurement.inclusive[id]) {
        candidates[displayName].inclusive += measurement.inclusive[id];
      }
      if (measurement.counts[id]) {
        candidates[displayName].count += measurement.counts[id];
      }
    }
  }

  // Now make a sorted array with the results.
  var arr = [];
  for (displayName in candidates) {
    if (candidates[displayName].exclusive >= DONT_CARE_THRESHOLD) {
      arr.push(candidates[displayName]);
    }
  }

  arr.sort(function(a, b) {
    return b.exclusive - a.exclusive;
  });

  return arr;
}

function getInclusiveSummary(measurements, onlyClean) {
  var candidates = {};
  var inclusiveKey;

  for (var i = 0; i < measurements.length; i++) {
    var measurement = measurements[i];
    var allIDs = merge(measurement.exclusive, measurement.inclusive);
    var cleanComponents;

    if (onlyClean) {
      cleanComponents = getUnchangedComponents(measurement);
    }

    for (var id in allIDs) {
      if (onlyClean && !cleanComponents[id]) {
        continue;
      }

      var displayName = measurement.displayNames[id];

      // Inclusive time is not useful for many components without knowing where
      // they are instantiated. So we aggregate inclusive time with both the
      // owner and current displayName as the key.
      inclusiveKey = displayName.owner + ' > ' + displayName.current;

      candidates[inclusiveKey] = candidates[inclusiveKey] || {
        componentName: inclusiveKey,
        time: 0,
        count: 0
      };

      if (measurement.inclusive[id]) {
        candidates[inclusiveKey].time += measurement.inclusive[id];
      }
      if (measurement.counts[id]) {
        candidates[inclusiveKey].count += measurement.counts[id];
      }
    }
  }

  // Now make a sorted array with the results.
  var arr = [];
  for (inclusiveKey in candidates) {
    if (candidates[inclusiveKey].time >= DONT_CARE_THRESHOLD) {
      arr.push(candidates[inclusiveKey]);
    }
  }

  arr.sort(function(a, b) {
    return b.time - a.time;
  });

  return arr;
}

function getUnchangedComponents(measurement) {
  // For a given reconcile, look at which components did not actually
  // render anything to the DOM and return a mapping of their ID to
  // the amount of time it took to render the entire subtree.
  var cleanComponents = {};
  var dirtyLeafIDs = Object.keys(measurement.writes);
  var allIDs = merge(measurement.exclusive, measurement.inclusive);

  for (var id in allIDs) {
    var isDirty = false;
    // For each component that rendered, see if a component that triggerd
    // a DOM op is in its subtree.
    for (var i = 0; i < dirtyLeafIDs.length; i++) {
      if (dirtyLeafIDs[i].indexOf(id) === 0) {
        isDirty = true;
        break;
      }
    }
    if (!isDirty && measurement.counts[id] > 0) {
      cleanComponents[id] = true;
    }
  }
  return cleanComponents;
}

var ReactDefaultPerfAnalysis = {
  getExclusiveSummary: getExclusiveSummary,
  getInclusiveSummary: getInclusiveSummary,
  getDOMSummary: getDOMSummary,
  getTotalTime: getTotalTime
};

module.exports = ReactDefaultPerfAnalysis;

},{"./merge":144}],61:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactErrorUtils
 * @typechecks
 */

"use strict";

var ReactErrorUtils = {
  /**
   * Creates a guarded version of a function. This is supposed to make debugging
   * of event handlers easier. To aid debugging with the browser's debugger,
   * this currently simply returns the original function.
   *
   * @param {function} func Function to be executed
   * @param {string} name The name of the guard
   * @return {function}
   */
  guard: function(func, name) {
    return func;
  }
};

module.exports = ReactErrorUtils;

},{}],62:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactEventEmitter
 * @typechecks static-only
 */

"use strict";

var EventConstants = require("./EventConstants");
var EventListener = require("./EventListener");
var EventPluginHub = require("./EventPluginHub");
var EventPluginRegistry = require("./EventPluginRegistry");
var ExecutionEnvironment = require("./ExecutionEnvironment");
var ReactEventEmitterMixin = require("./ReactEventEmitterMixin");
var ViewportMetrics = require("./ViewportMetrics");

var invariant = require("./invariant");
var isEventSupported = require("./isEventSupported");
var merge = require("./merge");

/**
 * Summary of `ReactEventEmitter` event handling:
 *
 *  - Top-level delegation is used to trap native browser events. We normalize
 *    and de-duplicate events to account for browser quirks.
 *
 *  - Forward these native events (with the associated top-level type used to
 *    trap it) to `EventPluginHub`, which in turn will ask plugins if they want
 *    to extract any synthetic events.
 *
 *  - The `EventPluginHub` will then process each event by annotating them with
 *    "dispatches", a sequence of listeners and IDs that care about that event.
 *
 *  - The `EventPluginHub` then dispatches the events.
 *
 * Overview of React and the event system:
 *
 *                   .
 * +------------+    .
 * |    DOM     |    .
 * +------------+    .                         +-----------+
 *       +           .               +--------+|SimpleEvent|
 *       |           .               |         |Plugin     |
 * +-----|------+    .               v         +-----------+
 * |     |      |    .    +--------------+                    +------------+
 * |     +-----------.--->|EventPluginHub|                    |    Event   |
 * |            |    .    |              |     +-----------+  | Propagators|
 * | ReactEvent |    .    |              |     |TapEvent   |  |------------|
 * |  Emitter   |    .    |              |<---+|Plugin     |  |other plugin|
 * |            |    .    |              |     +-----------+  |  utilities |
 * |     +-----------.--->|              |                    +------------+
 * |     |      |    .    +--------------+
 * +-----|------+    .                ^        +-----------+
 *       |           .                |        |Enter/Leave|
 *       +           .                +-------+|Plugin     |
 * +-------------+   .                         +-----------+
 * | application |   .
 * |-------------|   .
 * |             |   .
 * |             |   .
 * +-------------+   .
 *                   .
 *    React Core     .  General Purpose Event Plugin System
 */

var alreadyListeningTo = {};
var isMonitoringScrollValue = false;
var reactTopListenersCounter = 0;

// For events like 'submit' which don't consistently bubble (which we trap at a
// lower node than `document`), binding at `document` would cause duplicate
// events so we don't include them here
var topEventMapping = {
  topBlur: 'blur',
  topChange: 'change',
  topClick: 'click',
  topCompositionEnd: 'compositionend',
  topCompositionStart: 'compositionstart',
  topCompositionUpdate: 'compositionupdate',
  topContextMenu: 'contextmenu',
  topCopy: 'copy',
  topCut: 'cut',
  topDoubleClick: 'dblclick',
  topDrag: 'drag',
  topDragEnd: 'dragend',
  topDragEnter: 'dragenter',
  topDragExit: 'dragexit',
  topDragLeave: 'dragleave',
  topDragOver: 'dragover',
  topDragStart: 'dragstart',
  topDrop: 'drop',
  topFocus: 'focus',
  topInput: 'input',
  topKeyDown: 'keydown',
  topKeyPress: 'keypress',
  topKeyUp: 'keyup',
  topMouseDown: 'mousedown',
  topMouseMove: 'mousemove',
  topMouseOut: 'mouseout',
  topMouseOver: 'mouseover',
  topMouseUp: 'mouseup',
  topPaste: 'paste',
  topScroll: 'scroll',
  topSelectionChange: 'selectionchange',
  topTouchCancel: 'touchcancel',
  topTouchEnd: 'touchend',
  topTouchMove: 'touchmove',
  topTouchStart: 'touchstart',
  topWheel: 'wheel'
};

/**
 * To ensure no conflicts with other potential React instances on the page
 */
var topListenersIDKey = "_reactListenersID" + String(Math.random()).slice(2);

function getListeningForDocument(mountAt) {
  if (mountAt[topListenersIDKey] == null) {
    mountAt[topListenersIDKey] = reactTopListenersCounter++;
    alreadyListeningTo[mountAt[topListenersIDKey]] = {};
  }
  return alreadyListeningTo[mountAt[topListenersIDKey]];
}

/**
 * Traps top-level events by using event bubbling.
 *
 * @param {string} topLevelType Record from `EventConstants`.
 * @param {string} handlerBaseName Event name (e.g. "click").
 * @param {DOMEventTarget} element Element on which to attach listener.
 * @internal
 */
function trapBubbledEvent(topLevelType, handlerBaseName, element) {
  EventListener.listen(
    element,
    handlerBaseName,
    ReactEventEmitter.TopLevelCallbackCreator.createTopLevelCallback(
      topLevelType
    )
  );
}

/**
 * Traps a top-level event by using event capturing.
 *
 * @param {string} topLevelType Record from `EventConstants`.
 * @param {string} handlerBaseName Event name (e.g. "click").
 * @param {DOMEventTarget} element Element on which to attach listener.
 * @internal
 */
function trapCapturedEvent(topLevelType, handlerBaseName, element) {
  EventListener.capture(
    element,
    handlerBaseName,
    ReactEventEmitter.TopLevelCallbackCreator.createTopLevelCallback(
      topLevelType
    )
  );
}

/**
 * `ReactEventEmitter` is used to attach top-level event listeners. For example:
 *
 *   ReactEventEmitter.putListener('myID', 'onClick', myFunction);
 *
 * This would allocate a "registration" of `('onClick', myFunction)` on 'myID'.
 *
 * @internal
 */
var ReactEventEmitter = merge(ReactEventEmitterMixin, {

  /**
   * React references `ReactEventTopLevelCallback` using this property in order
   * to allow dependency injection.
   */
  TopLevelCallbackCreator: null,

  injection: {
    /**
     * @param {function} TopLevelCallbackCreator
     */
    injectTopLevelCallbackCreator: function(TopLevelCallbackCreator) {
      ReactEventEmitter.TopLevelCallbackCreator = TopLevelCallbackCreator;
    }
  },

  /**
   * Sets whether or not any created callbacks should be enabled.
   *
   * @param {boolean} enabled True if callbacks should be enabled.
   */
  setEnabled: function(enabled) {
    ("production" !== process.env.NODE_ENV ? invariant(
      ExecutionEnvironment.canUseDOM,
      'setEnabled(...): Cannot toggle event listening in a Worker thread. ' +
      'This is likely a bug in the framework. Please report immediately.'
    ) : invariant(ExecutionEnvironment.canUseDOM));
    if (ReactEventEmitter.TopLevelCallbackCreator) {
      ReactEventEmitter.TopLevelCallbackCreator.setEnabled(enabled);
    }
  },

  /**
   * @return {boolean} True if callbacks are enabled.
   */
  isEnabled: function() {
    return !!(
      ReactEventEmitter.TopLevelCallbackCreator &&
      ReactEventEmitter.TopLevelCallbackCreator.isEnabled()
    );
  },

  /**
   * We listen for bubbled touch events on the document object.
   *
   * Firefox v8.01 (and possibly others) exhibited strange behavior when
   * mounting `onmousemove` events at some node that was not the document
   * element. The symptoms were that if your mouse is not moving over something
   * contained within that mount point (for example on the background) the
   * top-level listeners for `onmousemove` won't be called. However, if you
   * register the `mousemove` on the document object, then it will of course
   * catch all `mousemove`s. This along with iOS quirks, justifies restricting
   * top-level listeners to the document object only, at least for these
   * movement types of events and possibly all events.
   *
   * @see http://www.quirksmode.org/blog/archives/2010/09/click_event_del.html
   *
   * Also, `keyup`/`keypress`/`keydown` do not bubble to the window on IE, but
   * they bubble to document.
   *
   * @param {string} registrationName Name of listener (e.g. `onClick`).
   * @param {DOMDocument} contentDocument Document which owns the container
   */
  listenTo: function(registrationName, contentDocument) {
    var mountAt = contentDocument;
    var isListening = getListeningForDocument(mountAt);
    var dependencies = EventPluginRegistry.
      registrationNameDependencies[registrationName];

    var topLevelTypes = EventConstants.topLevelTypes;
    for (var i = 0, l = dependencies.length; i < l; i++) {
      var dependency = dependencies[i];
      if (!isListening[dependency]) {
        var topLevelType = topLevelTypes[dependency];

        if (topLevelType === topLevelTypes.topWheel) {
          if (isEventSupported('wheel')) {
            trapBubbledEvent(topLevelTypes.topWheel, 'wheel', mountAt);
          } else if (isEventSupported('mousewheel')) {
            trapBubbledEvent(topLevelTypes.topWheel, 'mousewheel', mountAt);
          } else {
            // Firefox needs to capture a different mouse scroll event.
            // @see http://www.quirksmode.org/dom/events/tests/scroll.html
            trapBubbledEvent(
              topLevelTypes.topWheel,
              'DOMMouseScroll',
              mountAt);
          }
        } else if (topLevelType === topLevelTypes.topScroll) {

          if (isEventSupported('scroll', true)) {
            trapCapturedEvent(topLevelTypes.topScroll, 'scroll', mountAt);
          } else {
            trapBubbledEvent(topLevelTypes.topScroll, 'scroll', window);
          }
        } else if (topLevelType === topLevelTypes.topFocus ||
            topLevelType === topLevelTypes.topBlur) {

          if (isEventSupported('focus', true)) {
            trapCapturedEvent(topLevelTypes.topFocus, 'focus', mountAt);
            trapCapturedEvent(topLevelTypes.topBlur, 'blur', mountAt);
          } else if (isEventSupported('focusin')) {
            // IE has `focusin` and `focusout` events which bubble.
            // @see http://www.quirksmode.org/blog/archives/2008/04/delegating_the.html
            trapBubbledEvent(topLevelTypes.topFocus, 'focusin', mountAt);
            trapBubbledEvent(topLevelTypes.topBlur, 'focusout', mountAt);
          }

          // to make sure blur and focus event listeners are only attached once
          isListening[topLevelTypes.topBlur] = true;
          isListening[topLevelTypes.topFocus] = true;
        } else if (topEventMapping[dependency]) {
          trapBubbledEvent(topLevelType, topEventMapping[dependency], mountAt);
        }

        isListening[dependency] = true;
      }
    }
  },

  /**
   * Listens to window scroll and resize events. We cache scroll values so that
   * application code can access them without triggering reflows.
   *
   * NOTE: Scroll events do not bubble.
   *
   * @see http://www.quirksmode.org/dom/events/scroll.html
   */
  ensureScrollValueMonitoring: function(){
    if (!isMonitoringScrollValue) {
      var refresh = ViewportMetrics.refreshScrollValues;
      EventListener.listen(window, 'scroll', refresh);
      EventListener.listen(window, 'resize', refresh);
      isMonitoringScrollValue = true;
    }
  },

  eventNameDispatchConfigs: EventPluginHub.eventNameDispatchConfigs,

  registrationNameModules: EventPluginHub.registrationNameModules,

  putListener: EventPluginHub.putListener,

  getListener: EventPluginHub.getListener,

  deleteListener: EventPluginHub.deleteListener,

  deleteAllListeners: EventPluginHub.deleteAllListeners,

  trapBubbledEvent: trapBubbledEvent,

  trapCapturedEvent: trapCapturedEvent

});

module.exports = ReactEventEmitter;

}).call(this,require("qvMYcC"))
},{"./EventConstants":25,"./EventListener":26,"./EventPluginHub":27,"./EventPluginRegistry":28,"./ExecutionEnvironment":31,"./ReactEventEmitterMixin":63,"./ViewportMetrics":107,"./invariant":135,"./isEventSupported":136,"./merge":144,"qvMYcC":161}],63:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactEventEmitterMixin
 */

"use strict";

var EventPluginHub = require("./EventPluginHub");
var ReactUpdates = require("./ReactUpdates");

function runEventQueueInBatch(events) {
  EventPluginHub.enqueueEvents(events);
  EventPluginHub.processEventQueue();
}

var ReactEventEmitterMixin = {

  /**
   * Streams a fired top-level event to `EventPluginHub` where plugins have the
   * opportunity to create `ReactEvent`s to be dispatched.
   *
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {object} topLevelTarget The listening component root node.
   * @param {string} topLevelTargetID ID of `topLevelTarget`.
   * @param {object} nativeEvent Native environment event.
   */
  handleTopLevel: function(
      topLevelType,
      topLevelTarget,
      topLevelTargetID,
      nativeEvent) {
    var events = EventPluginHub.extractEvents(
      topLevelType,
      topLevelTarget,
      topLevelTargetID,
      nativeEvent
    );

    // Event queue being processed in the same cycle allows `preventDefault`.
    ReactUpdates.batchedUpdates(runEventQueueInBatch, events);
  }
};

module.exports = ReactEventEmitterMixin;

},{"./EventPluginHub":27,"./ReactUpdates":91}],64:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactEventTopLevelCallback
 * @typechecks static-only
 */

"use strict";

var PooledClass = require("./PooledClass");
var ReactEventEmitter = require("./ReactEventEmitter");
var ReactInstanceHandles = require("./ReactInstanceHandles");
var ReactMount = require("./ReactMount");

var getEventTarget = require("./getEventTarget");
var mixInto = require("./mixInto");

/**
 * @type {boolean}
 * @private
 */
var _topLevelListenersEnabled = true;

/**
 * Finds the parent React component of `node`.
 *
 * @param {*} node
 * @return {?DOMEventTarget} Parent container, or `null` if the specified node
 *                           is not nested.
 */
function findParent(node) {
  // TODO: It may be a good idea to cache this to prevent unnecessary DOM
  // traversal, but caching is difficult to do correctly without using a
  // mutation observer to listen for all DOM changes.
  var nodeID = ReactMount.getID(node);
  var rootID = ReactInstanceHandles.getReactRootIDFromNodeID(nodeID);
  var container = ReactMount.findReactContainerForID(rootID);
  var parent = ReactMount.getFirstReactDOM(container);
  return parent;
}

/**
 * Calls ReactEventEmitter.handleTopLevel for each node stored in bookKeeping's
 * ancestor list. Separated from createTopLevelCallback to avoid try/finally
 * deoptimization.
 *
 * @param {string} topLevelType
 * @param {DOMEvent} nativeEvent
 * @param {TopLevelCallbackBookKeeping} bookKeeping
 */
function handleTopLevelImpl(topLevelType, nativeEvent, bookKeeping) {
  var topLevelTarget = ReactMount.getFirstReactDOM(
    getEventTarget(nativeEvent)
  ) || window;

  // Loop through the hierarchy, in case there's any nested components.
  // It's important that we build the array of ancestors before calling any
  // event handlers, because event handlers can modify the DOM, leading to
  // inconsistencies with ReactMount's node cache. See #1105.
  var ancestor = topLevelTarget;
  while (ancestor) {
    bookKeeping.ancestors.push(ancestor);
    ancestor = findParent(ancestor);
  }

  for (var i = 0, l = bookKeeping.ancestors.length; i < l; i++) {
    topLevelTarget = bookKeeping.ancestors[i];
    var topLevelTargetID = ReactMount.getID(topLevelTarget) || '';
    ReactEventEmitter.handleTopLevel(
      topLevelType,
      topLevelTarget,
      topLevelTargetID,
      nativeEvent
    );
  }
}

// Used to store ancestor hierarchy in top level callback
function TopLevelCallbackBookKeeping() {
  this.ancestors = [];
}
mixInto(TopLevelCallbackBookKeeping, {
  destructor: function() {
    this.ancestors.length = 0;
  }
});
PooledClass.addPoolingTo(TopLevelCallbackBookKeeping);

/**
 * Top-level callback creator used to implement event handling using delegation.
 * This is used via dependency injection.
 */
var ReactEventTopLevelCallback = {

  /**
   * Sets whether or not any created callbacks should be enabled.
   *
   * @param {boolean} enabled True if callbacks should be enabled.
   */
  setEnabled: function(enabled) {
    _topLevelListenersEnabled = !!enabled;
  },

  /**
   * @return {boolean} True if callbacks are enabled.
   */
  isEnabled: function() {
    return _topLevelListenersEnabled;
  },

  /**
   * Creates a callback for the supplied `topLevelType` that could be added as
   * a listener to the document. The callback computes a `topLevelTarget` which
   * should be the root node of a mounted React component where the listener
   * is attached.
   *
   * @param {string} topLevelType Record from `EventConstants`.
   * @return {function} Callback for handling top-level events.
   */
  createTopLevelCallback: function(topLevelType) {
    return function(nativeEvent) {
      if (!_topLevelListenersEnabled) {
        return;
      }

      var bookKeeping = TopLevelCallbackBookKeeping.getPooled();
      try {
        handleTopLevelImpl(topLevelType, nativeEvent, bookKeeping);
      } finally {
        TopLevelCallbackBookKeeping.release(bookKeeping);
      }
    };
  }

};

module.exports = ReactEventTopLevelCallback;

},{"./PooledClass":35,"./ReactEventEmitter":62,"./ReactInstanceHandles":67,"./ReactMount":70,"./getEventTarget":127,"./mixInto":147}],65:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactInjection
 */

"use strict";

var DOMProperty = require("./DOMProperty");
var EventPluginHub = require("./EventPluginHub");
var ReactComponent = require("./ReactComponent");
var ReactCompositeComponent = require("./ReactCompositeComponent");
var ReactDOM = require("./ReactDOM");
var ReactEventEmitter = require("./ReactEventEmitter");
var ReactPerf = require("./ReactPerf");
var ReactRootIndex = require("./ReactRootIndex");
var ReactUpdates = require("./ReactUpdates");

var ReactInjection = {
  Component: ReactComponent.injection,
  CompositeComponent: ReactCompositeComponent.injection,
  DOMProperty: DOMProperty.injection,
  EventPluginHub: EventPluginHub.injection,
  DOM: ReactDOM.injection,
  EventEmitter: ReactEventEmitter.injection,
  Perf: ReactPerf.injection,
  RootIndex: ReactRootIndex.injection,
  Updates: ReactUpdates.injection
};

module.exports = ReactInjection;

},{"./DOMProperty":19,"./EventPluginHub":27,"./ReactComponent":41,"./ReactCompositeComponent":43,"./ReactDOM":46,"./ReactEventEmitter":62,"./ReactPerf":75,"./ReactRootIndex":82,"./ReactUpdates":91}],66:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactInputSelection
 */

"use strict";

var ReactDOMSelection = require("./ReactDOMSelection");

var containsNode = require("./containsNode");
var focusNode = require("./focusNode");
var getActiveElement = require("./getActiveElement");

function isInDocument(node) {
  return containsNode(document.documentElement, node);
}

/**
 * @ReactInputSelection: React input selection module. Based on Selection.js,
 * but modified to be suitable for react and has a couple of bug fixes (doesn't
 * assume buttons have range selections allowed).
 * Input selection module for React.
 */
var ReactInputSelection = {

  hasSelectionCapabilities: function(elem) {
    return elem && (
      (elem.nodeName === 'INPUT' && elem.type === 'text') ||
      elem.nodeName === 'TEXTAREA' ||
      elem.contentEditable === 'true'
    );
  },

  getSelectionInformation: function() {
    var focusedElem = getActiveElement();
    return {
      focusedElem: focusedElem,
      selectionRange:
          ReactInputSelection.hasSelectionCapabilities(focusedElem) ?
          ReactInputSelection.getSelection(focusedElem) :
          null
    };
  },

  /**
   * @restoreSelection: If any selection information was potentially lost,
   * restore it. This is useful when performing operations that could remove dom
   * nodes and place them back in, resulting in focus being lost.
   */
  restoreSelection: function(priorSelectionInformation) {
    var curFocusedElem = getActiveElement();
    var priorFocusedElem = priorSelectionInformation.focusedElem;
    var priorSelectionRange = priorSelectionInformation.selectionRange;
    if (curFocusedElem !== priorFocusedElem &&
        isInDocument(priorFocusedElem)) {
      if (ReactInputSelection.hasSelectionCapabilities(priorFocusedElem)) {
        ReactInputSelection.setSelection(
          priorFocusedElem,
          priorSelectionRange
        );
      }
      focusNode(priorFocusedElem);
    }
  },

  /**
   * @getSelection: Gets the selection bounds of a focused textarea, input or
   * contentEditable node.
   * -@input: Look up selection bounds of this input
   * -@return {start: selectionStart, end: selectionEnd}
   */
  getSelection: function(input) {
    var selection;

    if ('selectionStart' in input) {
      // Modern browser with input or textarea.
      selection = {
        start: input.selectionStart,
        end: input.selectionEnd
      };
    } else if (document.selection && input.nodeName === 'INPUT') {
      // IE8 input.
      var range = document.selection.createRange();
      // There can only be one selection per document in IE, so it must
      // be in our element.
      if (range.parentElement() === input) {
        selection = {
          start: -range.moveStart('character', -input.value.length),
          end: -range.moveEnd('character', -input.value.length)
        };
      }
    } else {
      // Content editable or old IE textarea.
      selection = ReactDOMSelection.getOffsets(input);
    }

    return selection || {start: 0, end: 0};
  },

  /**
   * @setSelection: Sets the selection bounds of a textarea or input and focuses
   * the input.
   * -@input     Set selection bounds of this input or textarea
   * -@offsets   Object of same form that is returned from get*
   */
  setSelection: function(input, offsets) {
    var start = offsets.start;
    var end = offsets.end;
    if (typeof end === 'undefined') {
      end = start;
    }

    if ('selectionStart' in input) {
      input.selectionStart = start;
      input.selectionEnd = Math.min(end, input.value.length);
    } else if (document.selection && input.nodeName === 'INPUT') {
      var range = input.createTextRange();
      range.collapse(true);
      range.moveStart('character', start);
      range.moveEnd('character', end - start);
      range.select();
    } else {
      ReactDOMSelection.setOffsets(input, offsets);
    }
  }
};

module.exports = ReactInputSelection;

},{"./ReactDOMSelection":55,"./containsNode":111,"./focusNode":123,"./getActiveElement":125}],67:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactInstanceHandles
 * @typechecks static-only
 */

"use strict";

var ReactRootIndex = require("./ReactRootIndex");

var invariant = require("./invariant");

var SEPARATOR = '.';
var SEPARATOR_LENGTH = SEPARATOR.length;

/**
 * Maximum depth of traversals before we consider the possibility of a bad ID.
 */
var MAX_TREE_DEPTH = 100;

/**
 * Creates a DOM ID prefix to use when mounting React components.
 *
 * @param {number} index A unique integer
 * @return {string} React root ID.
 * @internal
 */
function getReactRootIDString(index) {
  return SEPARATOR + index.toString(36);
}

/**
 * Checks if a character in the supplied ID is a separator or the end.
 *
 * @param {string} id A React DOM ID.
 * @param {number} index Index of the character to check.
 * @return {boolean} True if the character is a separator or end of the ID.
 * @private
 */
function isBoundary(id, index) {
  return id.charAt(index) === SEPARATOR || index === id.length;
}

/**
 * Checks if the supplied string is a valid React DOM ID.
 *
 * @param {string} id A React DOM ID, maybe.
 * @return {boolean} True if the string is a valid React DOM ID.
 * @private
 */
function isValidID(id) {
  return id === '' || (
    id.charAt(0) === SEPARATOR && id.charAt(id.length - 1) !== SEPARATOR
  );
}

/**
 * Checks if the first ID is an ancestor of or equal to the second ID.
 *
 * @param {string} ancestorID
 * @param {string} descendantID
 * @return {boolean} True if `ancestorID` is an ancestor of `descendantID`.
 * @internal
 */
function isAncestorIDOf(ancestorID, descendantID) {
  return (
    descendantID.indexOf(ancestorID) === 0 &&
    isBoundary(descendantID, ancestorID.length)
  );
}

/**
 * Gets the parent ID of the supplied React DOM ID, `id`.
 *
 * @param {string} id ID of a component.
 * @return {string} ID of the parent, or an empty string.
 * @private
 */
function getParentID(id) {
  return id ? id.substr(0, id.lastIndexOf(SEPARATOR)) : '';
}

/**
 * Gets the next DOM ID on the tree path from the supplied `ancestorID` to the
 * supplied `destinationID`. If they are equal, the ID is returned.
 *
 * @param {string} ancestorID ID of an ancestor node of `destinationID`.
 * @param {string} destinationID ID of the destination node.
 * @return {string} Next ID on the path from `ancestorID` to `destinationID`.
 * @private
 */
function getNextDescendantID(ancestorID, destinationID) {
  ("production" !== process.env.NODE_ENV ? invariant(
    isValidID(ancestorID) && isValidID(destinationID),
    'getNextDescendantID(%s, %s): Received an invalid React DOM ID.',
    ancestorID,
    destinationID
  ) : invariant(isValidID(ancestorID) && isValidID(destinationID)));
  ("production" !== process.env.NODE_ENV ? invariant(
    isAncestorIDOf(ancestorID, destinationID),
    'getNextDescendantID(...): React has made an invalid assumption about ' +
    'the DOM hierarchy. Expected `%s` to be an ancestor of `%s`.',
    ancestorID,
    destinationID
  ) : invariant(isAncestorIDOf(ancestorID, destinationID)));
  if (ancestorID === destinationID) {
    return ancestorID;
  }
  // Skip over the ancestor and the immediate separator. Traverse until we hit
  // another separator or we reach the end of `destinationID`.
  var start = ancestorID.length + SEPARATOR_LENGTH;
  for (var i = start; i < destinationID.length; i++) {
    if (isBoundary(destinationID, i)) {
      break;
    }
  }
  return destinationID.substr(0, i);
}

/**
 * Gets the nearest common ancestor ID of two IDs.
 *
 * Using this ID scheme, the nearest common ancestor ID is the longest common
 * prefix of the two IDs that immediately preceded a "marker" in both strings.
 *
 * @param {string} oneID
 * @param {string} twoID
 * @return {string} Nearest common ancestor ID, or the empty string if none.
 * @private
 */
function getFirstCommonAncestorID(oneID, twoID) {
  var minLength = Math.min(oneID.length, twoID.length);
  if (minLength === 0) {
    return '';
  }
  var lastCommonMarkerIndex = 0;
  // Use `<=` to traverse until the "EOL" of the shorter string.
  for (var i = 0; i <= minLength; i++) {
    if (isBoundary(oneID, i) && isBoundary(twoID, i)) {
      lastCommonMarkerIndex = i;
    } else if (oneID.charAt(i) !== twoID.charAt(i)) {
      break;
    }
  }
  var longestCommonID = oneID.substr(0, lastCommonMarkerIndex);
  ("production" !== process.env.NODE_ENV ? invariant(
    isValidID(longestCommonID),
    'getFirstCommonAncestorID(%s, %s): Expected a valid React DOM ID: %s',
    oneID,
    twoID,
    longestCommonID
  ) : invariant(isValidID(longestCommonID)));
  return longestCommonID;
}

/**
 * Traverses the parent path between two IDs (either up or down). The IDs must
 * not be the same, and there must exist a parent path between them. If the
 * callback returns `false`, traversal is stopped.
 *
 * @param {?string} start ID at which to start traversal.
 * @param {?string} stop ID at which to end traversal.
 * @param {function} cb Callback to invoke each ID with.
 * @param {?boolean} skipFirst Whether or not to skip the first node.
 * @param {?boolean} skipLast Whether or not to skip the last node.
 * @private
 */
function traverseParentPath(start, stop, cb, arg, skipFirst, skipLast) {
  start = start || '';
  stop = stop || '';
  ("production" !== process.env.NODE_ENV ? invariant(
    start !== stop,
    'traverseParentPath(...): Cannot traverse from and to the same ID, `%s`.',
    start
  ) : invariant(start !== stop));
  var traverseUp = isAncestorIDOf(stop, start);
  ("production" !== process.env.NODE_ENV ? invariant(
    traverseUp || isAncestorIDOf(start, stop),
    'traverseParentPath(%s, %s, ...): Cannot traverse from two IDs that do ' +
    'not have a parent path.',
    start,
    stop
  ) : invariant(traverseUp || isAncestorIDOf(start, stop)));
  // Traverse from `start` to `stop` one depth at a time.
  var depth = 0;
  var traverse = traverseUp ? getParentID : getNextDescendantID;
  for (var id = start; /* until break */; id = traverse(id, stop)) {
    var ret;
    if ((!skipFirst || id !== start) && (!skipLast || id !== stop)) {
      ret = cb(id, traverseUp, arg);
    }
    if (ret === false || id === stop) {
      // Only break //after// visiting `stop`.
      break;
    }
    ("production" !== process.env.NODE_ENV ? invariant(
      depth++ < MAX_TREE_DEPTH,
      'traverseParentPath(%s, %s, ...): Detected an infinite loop while ' +
      'traversing the React DOM ID tree. This may be due to malformed IDs: %s',
      start, stop
    ) : invariant(depth++ < MAX_TREE_DEPTH));
  }
}

/**
 * Manages the IDs assigned to DOM representations of React components. This
 * uses a specific scheme in order to traverse the DOM efficiently (e.g. in
 * order to simulate events).
 *
 * @internal
 */
var ReactInstanceHandles = {

  /**
   * Constructs a React root ID
   * @return {string} A React root ID.
   */
  createReactRootID: function() {
    return getReactRootIDString(ReactRootIndex.createReactRootIndex());
  },

  /**
   * Constructs a React ID by joining a root ID with a name.
   *
   * @param {string} rootID Root ID of a parent component.
   * @param {string} name A component's name (as flattened children).
   * @return {string} A React ID.
   * @internal
   */
  createReactID: function(rootID, name) {
    return rootID + name;
  },

  /**
   * Gets the DOM ID of the React component that is the root of the tree that
   * contains the React component with the supplied DOM ID.
   *
   * @param {string} id DOM ID of a React component.
   * @return {?string} DOM ID of the React component that is the root.
   * @internal
   */
  getReactRootIDFromNodeID: function(id) {
    if (id && id.charAt(0) === SEPARATOR && id.length > 1) {
      var index = id.indexOf(SEPARATOR, 1);
      return index > -1 ? id.substr(0, index) : id;
    }
    return null;
  },

  /**
   * Traverses the ID hierarchy and invokes the supplied `cb` on any IDs that
   * should would receive a `mouseEnter` or `mouseLeave` event.
   *
   * NOTE: Does not invoke the callback on the nearest common ancestor because
   * nothing "entered" or "left" that element.
   *
   * @param {string} leaveID ID being left.
   * @param {string} enterID ID being entered.
   * @param {function} cb Callback to invoke on each entered/left ID.
   * @param {*} upArg Argument to invoke the callback with on left IDs.
   * @param {*} downArg Argument to invoke the callback with on entered IDs.
   * @internal
   */
  traverseEnterLeave: function(leaveID, enterID, cb, upArg, downArg) {
    var ancestorID = getFirstCommonAncestorID(leaveID, enterID);
    if (ancestorID !== leaveID) {
      traverseParentPath(leaveID, ancestorID, cb, upArg, false, true);
    }
    if (ancestorID !== enterID) {
      traverseParentPath(ancestorID, enterID, cb, downArg, true, false);
    }
  },

  /**
   * Simulates the traversal of a two-phase, capture/bubble event dispatch.
   *
   * NOTE: This traversal happens on IDs without touching the DOM.
   *
   * @param {string} targetID ID of the target node.
   * @param {function} cb Callback to invoke.
   * @param {*} arg Argument to invoke the callback with.
   * @internal
   */
  traverseTwoPhase: function(targetID, cb, arg) {
    if (targetID) {
      traverseParentPath('', targetID, cb, arg, true, false);
      traverseParentPath(targetID, '', cb, arg, false, true);
    }
  },

  /**
   * Traverse a node ID, calling the supplied `cb` for each ancestor ID. For
   * example, passing `.0.$row-0.1` would result in `cb` getting called
   * with `.0`, `.0.$row-0`, and `.0.$row-0.1`.
   *
   * NOTE: This traversal happens on IDs without touching the DOM.
   *
   * @param {string} targetID ID of the target node.
   * @param {function} cb Callback to invoke.
   * @param {*} arg Argument to invoke the callback with.
   * @internal
   */
  traverseAncestors: function(targetID, cb, arg) {
    traverseParentPath('', targetID, cb, arg, true, false);
  },

  /**
   * Exposed for unit testing.
   * @private
   */
  _getFirstCommonAncestorID: getFirstCommonAncestorID,

  /**
   * Exposed for unit testing.
   * @private
   */
  _getNextDescendantID: getNextDescendantID,

  isAncestorIDOf: isAncestorIDOf,

  SEPARATOR: SEPARATOR

};

module.exports = ReactInstanceHandles;

}).call(this,require("qvMYcC"))
},{"./ReactRootIndex":82,"./invariant":135,"qvMYcC":161}],68:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactLink
 * @typechecks static-only
 */

"use strict";

/**
 * ReactLink encapsulates a common pattern in which a component wants to modify
 * a prop received from its parent. ReactLink allows the parent to pass down a
 * value coupled with a callback that, when invoked, expresses an intent to
 * modify that value. For example:
 *
 * React.createClass({
 *   getInitialState: function() {
 *     return {value: ''};
 *   },
 *   render: function() {
 *     var valueLink = new ReactLink(this.state.value, this._handleValueChange);
 *     return <input valueLink={valueLink} />;
 *   },
 *   this._handleValueChange: function(newValue) {
 *     this.setState({value: newValue});
 *   }
 * });
 *
 * We have provided some sugary mixins to make the creation and
 * consumption of ReactLink easier; see LinkedValueUtils and LinkedStateMixin.
 */

/**
 * @param {*} value current value of the link
 * @param {function} requestChange callback to request a change
 */
function ReactLink(value, requestChange) {
  this.value = value;
  this.requestChange = requestChange;
}

module.exports = ReactLink;

},{}],69:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactMarkupChecksum
 */

"use strict";

var adler32 = require("./adler32");

var ReactMarkupChecksum = {
  CHECKSUM_ATTR_NAME: 'data-react-checksum',

  /**
   * @param {string} markup Markup string
   * @return {string} Markup string with checksum attribute attached
   */
  addChecksumToMarkup: function(markup) {
    var checksum = adler32(markup);
    return markup.replace(
      '>',
      ' ' + ReactMarkupChecksum.CHECKSUM_ATTR_NAME + '="' + checksum + '">'
    );
  },

  /**
   * @param {string} markup to use
   * @param {DOMElement} element root React element
   * @returns {boolean} whether or not the markup is the same
   */
  canReuseMarkup: function(markup, element) {
    var existingChecksum = element.getAttribute(
      ReactMarkupChecksum.CHECKSUM_ATTR_NAME
    );
    existingChecksum = existingChecksum && parseInt(existingChecksum, 10);
    var markupChecksum = adler32(markup);
    return markupChecksum === existingChecksum;
  }
};

module.exports = ReactMarkupChecksum;

},{"./adler32":109}],70:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactMount
 */

"use strict";

var DOMProperty = require("./DOMProperty");
var ReactEventEmitter = require("./ReactEventEmitter");
var ReactInstanceHandles = require("./ReactInstanceHandles");
var ReactPerf = require("./ReactPerf");

var containsNode = require("./containsNode");
var getReactRootElementInContainer = require("./getReactRootElementInContainer");
var instantiateReactComponent = require("./instantiateReactComponent");
var invariant = require("./invariant");
var shouldUpdateReactComponent = require("./shouldUpdateReactComponent");

var SEPARATOR = ReactInstanceHandles.SEPARATOR;

var ATTR_NAME = DOMProperty.ID_ATTRIBUTE_NAME;
var nodeCache = {};

var ELEMENT_NODE_TYPE = 1;
var DOC_NODE_TYPE = 9;

/** Mapping from reactRootID to React component instance. */
var instancesByReactRootID = {};

/** Mapping from reactRootID to `container` nodes. */
var containersByReactRootID = {};

if ("production" !== process.env.NODE_ENV) {
  /** __DEV__-only mapping from reactRootID to root elements. */
  var rootElementsByReactRootID = {};
}

// Used to store breadth-first search state in findComponentRoot.
var findComponentRootReusableArray = [];

/**
 * @param {DOMElement} container DOM element that may contain a React component.
 * @return {?string} A "reactRoot" ID, if a React component is rendered.
 */
function getReactRootID(container) {
  var rootElement = getReactRootElementInContainer(container);
  return rootElement && ReactMount.getID(rootElement);
}

/**
 * Accessing node[ATTR_NAME] or calling getAttribute(ATTR_NAME) on a form
 * element can return its control whose name or ID equals ATTR_NAME. All
 * DOM nodes support `getAttributeNode` but this can also get called on
 * other objects so just return '' if we're given something other than a
 * DOM node (such as window).
 *
 * @param {?DOMElement|DOMWindow|DOMDocument|DOMTextNode} node DOM node.
 * @return {string} ID of the supplied `domNode`.
 */
function getID(node) {
  var id = internalGetID(node);
  if (id) {
    if (nodeCache.hasOwnProperty(id)) {
      var cached = nodeCache[id];
      if (cached !== node) {
        ("production" !== process.env.NODE_ENV ? invariant(
          !isValid(cached, id),
          'ReactMount: Two valid but unequal nodes with the same `%s`: %s',
          ATTR_NAME, id
        ) : invariant(!isValid(cached, id)));

        nodeCache[id] = node;
      }
    } else {
      nodeCache[id] = node;
    }
  }

  return id;
}

function internalGetID(node) {
  // If node is something like a window, document, or text node, none of
  // which support attributes or a .getAttribute method, gracefully return
  // the empty string, as if the attribute were missing.
  return node && node.getAttribute && node.getAttribute(ATTR_NAME) || '';
}

/**
 * Sets the React-specific ID of the given node.
 *
 * @param {DOMElement} node The DOM node whose ID will be set.
 * @param {string} id The value of the ID attribute.
 */
function setID(node, id) {
  var oldID = internalGetID(node);
  if (oldID !== id) {
    delete nodeCache[oldID];
  }
  node.setAttribute(ATTR_NAME, id);
  nodeCache[id] = node;
}

/**
 * Finds the node with the supplied React-generated DOM ID.
 *
 * @param {string} id A React-generated DOM ID.
 * @return {DOMElement} DOM node with the suppled `id`.
 * @internal
 */
function getNode(id) {
  if (!nodeCache.hasOwnProperty(id) || !isValid(nodeCache[id], id)) {
    nodeCache[id] = ReactMount.findReactNodeByID(id);
  }
  return nodeCache[id];
}

/**
 * A node is "valid" if it is contained by a currently mounted container.
 *
 * This means that the node does not have to be contained by a document in
 * order to be considered valid.
 *
 * @param {?DOMElement} node The candidate DOM node.
 * @param {string} id The expected ID of the node.
 * @return {boolean} Whether the node is contained by a mounted container.
 */
function isValid(node, id) {
  if (node) {
    ("production" !== process.env.NODE_ENV ? invariant(
      internalGetID(node) === id,
      'ReactMount: Unexpected modification of `%s`',
      ATTR_NAME
    ) : invariant(internalGetID(node) === id));

    var container = ReactMount.findReactContainerForID(id);
    if (container && containsNode(container, node)) {
      return true;
    }
  }

  return false;
}

/**
 * Causes the cache to forget about one React-specific ID.
 *
 * @param {string} id The ID to forget.
 */
function purgeID(id) {
  delete nodeCache[id];
}

var deepestNodeSoFar = null;
function findDeepestCachedAncestorImpl(ancestorID) {
  var ancestor = nodeCache[ancestorID];
  if (ancestor && isValid(ancestor, ancestorID)) {
    deepestNodeSoFar = ancestor;
  } else {
    // This node isn't populated in the cache, so presumably none of its
    // descendants are. Break out of the loop.
    return false;
  }
}

/**
 * Return the deepest cached node whose ID is a prefix of `targetID`.
 */
function findDeepestCachedAncestor(targetID) {
  deepestNodeSoFar = null;
  ReactInstanceHandles.traverseAncestors(
    targetID,
    findDeepestCachedAncestorImpl
  );

  var foundNode = deepestNodeSoFar;
  deepestNodeSoFar = null;
  return foundNode;
}

/**
 * Mounting is the process of initializing a React component by creatings its
 * representative DOM elements and inserting them into a supplied `container`.
 * Any prior content inside `container` is destroyed in the process.
 *
 *   ReactMount.renderComponent(
 *     component,
 *     document.getElementById('container')
 *   );
 *
 *   <div id="container">                   <-- Supplied `container`.
 *     <div data-reactid=".3">              <-- Rendered reactRoot of React
 *       // ...                                 component.
 *     </div>
 *   </div>
 *
 * Inside of `container`, the first element rendered is the "reactRoot".
 */
var ReactMount = {
  /** Time spent generating markup. */
  totalInstantiationTime: 0,

  /** Time spent inserting markup into the DOM. */
  totalInjectionTime: 0,

  /** Whether support for touch events should be initialized. */
  useTouchEvents: false,

  /** Exposed for debugging purposes **/
  _instancesByReactRootID: instancesByReactRootID,

  /**
   * This is a hook provided to support rendering React components while
   * ensuring that the apparent scroll position of its `container` does not
   * change.
   *
   * @param {DOMElement} container The `container` being rendered into.
   * @param {function} renderCallback This must be called once to do the render.
   */
  scrollMonitor: function(container, renderCallback) {
    renderCallback();
  },

  /**
   * Take a component that's already mounted into the DOM and replace its props
   * @param {ReactComponent} prevComponent component instance already in the DOM
   * @param {ReactComponent} nextComponent component instance to render
   * @param {DOMElement} container container to render into
   * @param {?function} callback function triggered on completion
   */
  _updateRootComponent: function(
      prevComponent,
      nextComponent,
      container,
      callback) {
    var nextProps = nextComponent.props;
    ReactMount.scrollMonitor(container, function() {
      prevComponent.replaceProps(nextProps, callback);
    });

    if ("production" !== process.env.NODE_ENV) {
      // Record the root element in case it later gets transplanted.
      rootElementsByReactRootID[getReactRootID(container)] =
        getReactRootElementInContainer(container);
    }

    return prevComponent;
  },

  /**
   * Register a component into the instance map and starts scroll value
   * monitoring
   * @param {ReactComponent} nextComponent component instance to render
   * @param {DOMElement} container container to render into
   * @return {string} reactRoot ID prefix
   */
  _registerComponent: function(nextComponent, container) {
    ("production" !== process.env.NODE_ENV ? invariant(
      container && (
        container.nodeType === ELEMENT_NODE_TYPE ||
        container.nodeType === DOC_NODE_TYPE
      ),
      '_registerComponent(...): Target container is not a DOM element.'
    ) : invariant(container && (
      container.nodeType === ELEMENT_NODE_TYPE ||
      container.nodeType === DOC_NODE_TYPE
    )));

    ReactEventEmitter.ensureScrollValueMonitoring();

    var reactRootID = ReactMount.registerContainer(container);
    instancesByReactRootID[reactRootID] = nextComponent;
    return reactRootID;
  },

  /**
   * Render a new component into the DOM.
   * @param {ReactComponent} nextComponent component instance to render
   * @param {DOMElement} container container to render into
   * @param {boolean} shouldReuseMarkup if we should skip the markup insertion
   * @return {ReactComponent} nextComponent
   */
  _renderNewRootComponent: ReactPerf.measure(
    'ReactMount',
    '_renderNewRootComponent',
    function(
        nextComponent,
        container,
        shouldReuseMarkup) {

      var componentInstance = instantiateReactComponent(nextComponent);
      var reactRootID = ReactMount._registerComponent(
        componentInstance,
        container
      );
      componentInstance.mountComponentIntoNode(
        reactRootID,
        container,
        shouldReuseMarkup
      );

      if ("production" !== process.env.NODE_ENV) {
        // Record the root element in case it later gets transplanted.
        rootElementsByReactRootID[reactRootID] =
          getReactRootElementInContainer(container);
      }

      return componentInstance;
    }
  ),

  /**
   * Renders a React component into the DOM in the supplied `container`.
   *
   * If the React component was previously rendered into `container`, this will
   * perform an update on it and only mutate the DOM as necessary to reflect the
   * latest React component.
   *
   * @param {ReactComponent} nextComponent Component instance to render.
   * @param {DOMElement} container DOM element to render into.
   * @param {?function} callback function triggered on completion
   * @return {ReactComponent} Component instance rendered in `container`.
   */
  renderComponent: function(nextComponent, container, callback) {
    var prevComponent = instancesByReactRootID[getReactRootID(container)];

    if (prevComponent) {
      if (shouldUpdateReactComponent(prevComponent, nextComponent)) {
        return ReactMount._updateRootComponent(
          prevComponent,
          nextComponent,
          container,
          callback
        );
      } else {
        ReactMount.unmountComponentAtNode(container);
      }
    }

    var reactRootElement = getReactRootElementInContainer(container);
    var containerHasReactMarkup =
      reactRootElement && ReactMount.isRenderedByReact(reactRootElement);

    var shouldReuseMarkup = containerHasReactMarkup && !prevComponent;

    var component = ReactMount._renderNewRootComponent(
      nextComponent,
      container,
      shouldReuseMarkup
    );
    callback && callback.call(component);
    return component;
  },

  /**
   * Constructs a component instance of `constructor` with `initialProps` and
   * renders it into the supplied `container`.
   *
   * @param {function} constructor React component constructor.
   * @param {?object} props Initial props of the component instance.
   * @param {DOMElement} container DOM element to render into.
   * @return {ReactComponent} Component instance rendered in `container`.
   */
  constructAndRenderComponent: function(constructor, props, container) {
    return ReactMount.renderComponent(constructor(props), container);
  },

  /**
   * Constructs a component instance of `constructor` with `initialProps` and
   * renders it into a container node identified by supplied `id`.
   *
   * @param {function} componentConstructor React component constructor
   * @param {?object} props Initial props of the component instance.
   * @param {string} id ID of the DOM element to render into.
   * @return {ReactComponent} Component instance rendered in the container node.
   */
  constructAndRenderComponentByID: function(constructor, props, id) {
    var domNode = document.getElementById(id);
    ("production" !== process.env.NODE_ENV ? invariant(
      domNode,
      'Tried to get element with id of "%s" but it is not present on the page.',
      id
    ) : invariant(domNode));
    return ReactMount.constructAndRenderComponent(constructor, props, domNode);
  },

  /**
   * Registers a container node into which React components will be rendered.
   * This also creates the "reactRoot" ID that will be assigned to the element
   * rendered within.
   *
   * @param {DOMElement} container DOM element to register as a container.
   * @return {string} The "reactRoot" ID of elements rendered within.
   */
  registerContainer: function(container) {
    var reactRootID = getReactRootID(container);
    if (reactRootID) {
      // If one exists, make sure it is a valid "reactRoot" ID.
      reactRootID = ReactInstanceHandles.getReactRootIDFromNodeID(reactRootID);
    }
    if (!reactRootID) {
      // No valid "reactRoot" ID found, create one.
      reactRootID = ReactInstanceHandles.createReactRootID();
    }
    containersByReactRootID[reactRootID] = container;
    return reactRootID;
  },

  /**
   * Unmounts and destroys the React component rendered in the `container`.
   *
   * @param {DOMElement} container DOM element containing a React component.
   * @return {boolean} True if a component was found in and unmounted from
   *                   `container`
   */
  unmountComponentAtNode: function(container) {
    var reactRootID = getReactRootID(container);
    var component = instancesByReactRootID[reactRootID];
    if (!component) {
      return false;
    }
    ReactMount.unmountComponentFromNode(component, container);
    delete instancesByReactRootID[reactRootID];
    delete containersByReactRootID[reactRootID];
    if ("production" !== process.env.NODE_ENV) {
      delete rootElementsByReactRootID[reactRootID];
    }
    return true;
  },

  /**
   * Unmounts a component and removes it from the DOM.
   *
   * @param {ReactComponent} instance React component instance.
   * @param {DOMElement} container DOM element to unmount from.
   * @final
   * @internal
   * @see {ReactMount.unmountComponentAtNode}
   */
  unmountComponentFromNode: function(instance, container) {
    instance.unmountComponent();

    if (container.nodeType === DOC_NODE_TYPE) {
      container = container.documentElement;
    }

    // http://jsperf.com/emptying-a-node
    while (container.lastChild) {
      container.removeChild(container.lastChild);
    }
  },

  /**
   * Finds the container DOM element that contains React component to which the
   * supplied DOM `id` belongs.
   *
   * @param {string} id The ID of an element rendered by a React component.
   * @return {?DOMElement} DOM element that contains the `id`.
   */
  findReactContainerForID: function(id) {
    var reactRootID = ReactInstanceHandles.getReactRootIDFromNodeID(id);
    var container = containersByReactRootID[reactRootID];

    if ("production" !== process.env.NODE_ENV) {
      var rootElement = rootElementsByReactRootID[reactRootID];
      if (rootElement && rootElement.parentNode !== container) {
        ("production" !== process.env.NODE_ENV ? invariant(
          // Call internalGetID here because getID calls isValid which calls
          // findReactContainerForID (this function).
          internalGetID(rootElement) === reactRootID,
          'ReactMount: Root element ID differed from reactRootID.'
        ) : invariant(// Call internalGetID here because getID calls isValid which calls
        // findReactContainerForID (this function).
        internalGetID(rootElement) === reactRootID));

        var containerChild = container.firstChild;
        if (containerChild &&
            reactRootID === internalGetID(containerChild)) {
          // If the container has a new child with the same ID as the old
          // root element, then rootElementsByReactRootID[reactRootID] is
          // just stale and needs to be updated. The case that deserves a
          // warning is when the container is empty.
          rootElementsByReactRootID[reactRootID] = containerChild;
        } else {
          console.warn(
            'ReactMount: Root element has been removed from its original ' +
            'container. New container:', rootElement.parentNode
          );
        }
      }
    }

    return container;
  },

  /**
   * Finds an element rendered by React with the supplied ID.
   *
   * @param {string} id ID of a DOM node in the React component.
   * @return {DOMElement} Root DOM node of the React component.
   */
  findReactNodeByID: function(id) {
    var reactRoot = ReactMount.findReactContainerForID(id);
    return ReactMount.findComponentRoot(reactRoot, id);
  },

  /**
   * True if the supplied `node` is rendered by React.
   *
   * @param {*} node DOM Element to check.
   * @return {boolean} True if the DOM Element appears to be rendered by React.
   * @internal
   */
  isRenderedByReact: function(node) {
    if (node.nodeType !== 1) {
      // Not a DOMElement, therefore not a React component
      return false;
    }
    var id = ReactMount.getID(node);
    return id ? id.charAt(0) === SEPARATOR : false;
  },

  /**
   * Traverses up the ancestors of the supplied node to find a node that is a
   * DOM representation of a React component.
   *
   * @param {*} node
   * @return {?DOMEventTarget}
   * @internal
   */
  getFirstReactDOM: function(node) {
    var current = node;
    while (current && current.parentNode !== current) {
      if (ReactMount.isRenderedByReact(current)) {
        return current;
      }
      current = current.parentNode;
    }
    return null;
  },

  /**
   * Finds a node with the supplied `targetID` inside of the supplied
   * `ancestorNode`.  Exploits the ID naming scheme to perform the search
   * quickly.
   *
   * @param {DOMEventTarget} ancestorNode Search from this root.
   * @pararm {string} targetID ID of the DOM representation of the component.
   * @return {DOMEventTarget} DOM node with the supplied `targetID`.
   * @internal
   */
  findComponentRoot: function(ancestorNode, targetID) {
    var firstChildren = findComponentRootReusableArray;
    var childIndex = 0;

    var deepestAncestor = findDeepestCachedAncestor(targetID) || ancestorNode;

    firstChildren[0] = deepestAncestor.firstChild;
    firstChildren.length = 1;

    while (childIndex < firstChildren.length) {
      var child = firstChildren[childIndex++];
      var targetChild;

      while (child) {
        var childID = ReactMount.getID(child);
        if (childID) {
          // Even if we find the node we're looking for, we finish looping
          // through its siblings to ensure they're cached so that we don't have
          // to revisit this node again. Otherwise, we make n^2 calls to getID
          // when visiting the many children of a single node in order.

          if (targetID === childID) {
            targetChild = child;
          } else if (ReactInstanceHandles.isAncestorIDOf(childID, targetID)) {
            // If we find a child whose ID is an ancestor of the given ID,
            // then we can be sure that we only want to search the subtree
            // rooted at this child, so we can throw out the rest of the
            // search state.
            firstChildren.length = childIndex = 0;
            firstChildren.push(child.firstChild);
          }

        } else {
          // If this child had no ID, then there's a chance that it was
          // injected automatically by the browser, as when a `<table>`
          // element sprouts an extra `<tbody>` child as a side effect of
          // `.innerHTML` parsing. Optimistically continue down this
          // branch, but not before examining the other siblings.
          firstChildren.push(child.firstChild);
        }

        child = child.nextSibling;
      }

      if (targetChild) {
        // Emptying firstChildren/findComponentRootReusableArray is
        // not necessary for correctness, but it helps the GC reclaim
        // any nodes that were left at the end of the search.
        firstChildren.length = 0;

        return targetChild;
      }
    }

    firstChildren.length = 0;

    ("production" !== process.env.NODE_ENV ? invariant(
      false,
      'findComponentRoot(..., %s): Unable to find element. This probably ' +
      'means the DOM was unexpectedly mutated (e.g., by the browser), ' +
      'usually due to forgetting a <tbody> when using tables or nesting <p> ' +
      'or <a> tags. Try inspecting the child nodes of the element with React ' +
      'ID `%s`.',
      targetID,
      ReactMount.getID(ancestorNode)
    ) : invariant(false));
  },


  /**
   * React ID utilities.
   */

  getReactRootID: getReactRootID,

  getID: getID,

  setID: setID,

  getNode: getNode,

  purgeID: purgeID
};

module.exports = ReactMount;

}).call(this,require("qvMYcC"))
},{"./DOMProperty":19,"./ReactEventEmitter":62,"./ReactInstanceHandles":67,"./ReactPerf":75,"./containsNode":111,"./getReactRootElementInContainer":130,"./instantiateReactComponent":134,"./invariant":135,"./shouldUpdateReactComponent":154,"qvMYcC":161}],71:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactMountReady
 */

"use strict";

var PooledClass = require("./PooledClass");

var mixInto = require("./mixInto");

/**
 * A specialized pseudo-event module to help keep track of components waiting to
 * be notified when their DOM representations are available for use.
 *
 * This implements `PooledClass`, so you should never need to instantiate this.
 * Instead, use `ReactMountReady.getPooled()`.
 *
 * @param {?array<function>} initialCollection
 * @class ReactMountReady
 * @implements PooledClass
 * @internal
 */
function ReactMountReady(initialCollection) {
  this._queue = initialCollection || null;
}

mixInto(ReactMountReady, {

  /**
   * Enqueues a callback to be invoked when `notifyAll` is invoked. This is used
   * to enqueue calls to `componentDidMount` and `componentDidUpdate`.
   *
   * @param {ReactComponent} component Component being rendered.
   * @param {function(DOMElement)} callback Invoked when `notifyAll` is invoked.
   * @internal
   */
  enqueue: function(component, callback) {
    this._queue = this._queue || [];
    this._queue.push({component: component, callback: callback});
  },

  /**
   * Invokes all enqueued callbacks and clears the queue. This is invoked after
   * the DOM representation of a component has been created or updated.
   *
   * @internal
   */
  notifyAll: function() {
    var queue = this._queue;
    if (queue) {
      this._queue = null;
      for (var i = 0, l = queue.length; i < l; i++) {
        var component = queue[i].component;
        var callback = queue[i].callback;
        callback.call(component);
      }
      queue.length = 0;
    }
  },

  /**
   * Resets the internal queue.
   *
   * @internal
   */
  reset: function() {
    this._queue = null;
  },

  /**
   * `PooledClass` looks for this.
   */
  destructor: function() {
    this.reset();
  }

});

PooledClass.addPoolingTo(ReactMountReady);

module.exports = ReactMountReady;

},{"./PooledClass":35,"./mixInto":147}],72:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactMultiChild
 * @typechecks static-only
 */

"use strict";

var ReactComponent = require("./ReactComponent");
var ReactMultiChildUpdateTypes = require("./ReactMultiChildUpdateTypes");

var flattenChildren = require("./flattenChildren");
var instantiateReactComponent = require("./instantiateReactComponent");
var shouldUpdateReactComponent = require("./shouldUpdateReactComponent");

/**
 * Updating children of a component may trigger recursive updates. The depth is
 * used to batch recursive updates to render markup more efficiently.
 *
 * @type {number}
 * @private
 */
var updateDepth = 0;

/**
 * Queue of update configuration objects.
 *
 * Each object has a `type` property that is in `ReactMultiChildUpdateTypes`.
 *
 * @type {array<object>}
 * @private
 */
var updateQueue = [];

/**
 * Queue of markup to be rendered.
 *
 * @type {array<string>}
 * @private
 */
var markupQueue = [];

/**
 * Enqueues markup to be rendered and inserted at a supplied index.
 *
 * @param {string} parentID ID of the parent component.
 * @param {string} markup Markup that renders into an element.
 * @param {number} toIndex Destination index.
 * @private
 */
function enqueueMarkup(parentID, markup, toIndex) {
  // NOTE: Null values reduce hidden classes.
  updateQueue.push({
    parentID: parentID,
    parentNode: null,
    type: ReactMultiChildUpdateTypes.INSERT_MARKUP,
    markupIndex: markupQueue.push(markup) - 1,
    textContent: null,
    fromIndex: null,
    toIndex: toIndex
  });
}

/**
 * Enqueues moving an existing element to another index.
 *
 * @param {string} parentID ID of the parent component.
 * @param {number} fromIndex Source index of the existing element.
 * @param {number} toIndex Destination index of the element.
 * @private
 */
function enqueueMove(parentID, fromIndex, toIndex) {
  // NOTE: Null values reduce hidden classes.
  updateQueue.push({
    parentID: parentID,
    parentNode: null,
    type: ReactMultiChildUpdateTypes.MOVE_EXISTING,
    markupIndex: null,
    textContent: null,
    fromIndex: fromIndex,
    toIndex: toIndex
  });
}

/**
 * Enqueues removing an element at an index.
 *
 * @param {string} parentID ID of the parent component.
 * @param {number} fromIndex Index of the element to remove.
 * @private
 */
function enqueueRemove(parentID, fromIndex) {
  // NOTE: Null values reduce hidden classes.
  updateQueue.push({
    parentID: parentID,
    parentNode: null,
    type: ReactMultiChildUpdateTypes.REMOVE_NODE,
    markupIndex: null,
    textContent: null,
    fromIndex: fromIndex,
    toIndex: null
  });
}

/**
 * Enqueues setting the text content.
 *
 * @param {string} parentID ID of the parent component.
 * @param {string} textContent Text content to set.
 * @private
 */
function enqueueTextContent(parentID, textContent) {
  // NOTE: Null values reduce hidden classes.
  updateQueue.push({
    parentID: parentID,
    parentNode: null,
    type: ReactMultiChildUpdateTypes.TEXT_CONTENT,
    markupIndex: null,
    textContent: textContent,
    fromIndex: null,
    toIndex: null
  });
}

/**
 * Processes any enqueued updates.
 *
 * @private
 */
function processQueue() {
  if (updateQueue.length) {
    ReactComponent.BackendIDOperations.dangerouslyProcessChildrenUpdates(
      updateQueue,
      markupQueue
    );
    clearQueue();
  }
}

/**
 * Clears any enqueued updates.
 *
 * @private
 */
function clearQueue() {
  updateQueue.length = 0;
  markupQueue.length = 0;
}

/**
 * ReactMultiChild are capable of reconciling multiple children.
 *
 * @class ReactMultiChild
 * @internal
 */
var ReactMultiChild = {

  /**
   * Provides common functionality for components that must reconcile multiple
   * children. This is used by `ReactDOMComponent` to mount, update, and
   * unmount child components.
   *
   * @lends {ReactMultiChild.prototype}
   */
  Mixin: {

    /**
     * Generates a "mount image" for each of the supplied children. In the case
     * of `ReactDOMComponent`, a mount image is a string of markup.
     *
     * @param {?object} nestedChildren Nested child maps.
     * @return {array} An array of mounted representations.
     * @internal
     */
    mountChildren: function(nestedChildren, transaction) {
      var children = flattenChildren(nestedChildren);
      var mountImages = [];
      var index = 0;
      this._renderedChildren = children;
      for (var name in children) {
        var child = children[name];
        if (children.hasOwnProperty(name)) {
          // The rendered children must be turned into instances as they're
          // mounted.
          var childInstance = instantiateReactComponent(child);
          children[name] = childInstance;
          // Inlined for performance, see `ReactInstanceHandles.createReactID`.
          var rootID = this._rootNodeID + name;
          var mountImage = childInstance.mountComponent(
            rootID,
            transaction,
            this._mountDepth + 1
          );
          childInstance._mountIndex = index;
          mountImages.push(mountImage);
          index++;
        }
      }
      return mountImages;
    },

    /**
     * Replaces any rendered children with a text content string.
     *
     * @param {string} nextContent String of content.
     * @internal
     */
    updateTextContent: function(nextContent) {
      updateDepth++;
      var errorThrown = true;
      try {
        var prevChildren = this._renderedChildren;
        // Remove any rendered children.
        for (var name in prevChildren) {
          if (prevChildren.hasOwnProperty(name)) {
            this._unmountChildByName(prevChildren[name], name);
          }
        }
        // Set new text content.
        this.setTextContent(nextContent);
        errorThrown = false;
      } finally {
        updateDepth--;
        if (!updateDepth) {
          errorThrown ? clearQueue() : processQueue();
        }
      }
    },

    /**
     * Updates the rendered children with new children.
     *
     * @param {?object} nextNestedChildren Nested child maps.
     * @param {ReactReconcileTransaction} transaction
     * @internal
     */
    updateChildren: function(nextNestedChildren, transaction) {
      updateDepth++;
      var errorThrown = true;
      try {
        this._updateChildren(nextNestedChildren, transaction);
        errorThrown = false;
      } finally {
        updateDepth--;
        if (!updateDepth) {
          errorThrown ? clearQueue() : processQueue();
        }
      }
    },

    /**
     * Improve performance by isolating this hot code path from the try/catch
     * block in `updateChildren`.
     *
     * @param {?object} nextNestedChildren Nested child maps.
     * @param {ReactReconcileTransaction} transaction
     * @final
     * @protected
     */
    _updateChildren: function(nextNestedChildren, transaction) {
      var nextChildren = flattenChildren(nextNestedChildren);
      var prevChildren = this._renderedChildren;
      if (!nextChildren && !prevChildren) {
        return;
      }
      var name;
      // `nextIndex` will increment for each child in `nextChildren`, but
      // `lastIndex` will be the last index visited in `prevChildren`.
      var lastIndex = 0;
      var nextIndex = 0;
      for (name in nextChildren) {
        if (!nextChildren.hasOwnProperty(name)) {
          continue;
        }
        var prevChild = prevChildren && prevChildren[name];
        var nextChild = nextChildren[name];
        if (shouldUpdateReactComponent(prevChild, nextChild)) {
          this.moveChild(prevChild, nextIndex, lastIndex);
          lastIndex = Math.max(prevChild._mountIndex, lastIndex);
          prevChild.receiveComponent(nextChild, transaction);
          prevChild._mountIndex = nextIndex;
        } else {
          if (prevChild) {
            // Update `lastIndex` before `_mountIndex` gets unset by unmounting.
            lastIndex = Math.max(prevChild._mountIndex, lastIndex);
            this._unmountChildByName(prevChild, name);
          }
          // The child must be instantiated before it's mounted.
          var nextChildInstance = instantiateReactComponent(nextChild);
          this._mountChildByNameAtIndex(
            nextChildInstance, name, nextIndex, transaction
          );
        }
        nextIndex++;
      }
      // Remove children that are no longer present.
      for (name in prevChildren) {
        if (prevChildren.hasOwnProperty(name) &&
            !(nextChildren && nextChildren[name])) {
          this._unmountChildByName(prevChildren[name], name);
        }
      }
    },

    /**
     * Unmounts all rendered children. This should be used to clean up children
     * when this component is unmounted.
     *
     * @internal
     */
    unmountChildren: function() {
      var renderedChildren = this._renderedChildren;
      for (var name in renderedChildren) {
        var renderedChild = renderedChildren[name];
        // TODO: When is this not true?
        if (renderedChild.unmountComponent) {
          renderedChild.unmountComponent();
        }
      }
      this._renderedChildren = null;
    },

    /**
     * Moves a child component to the supplied index.
     *
     * @param {ReactComponent} child Component to move.
     * @param {number} toIndex Destination index of the element.
     * @param {number} lastIndex Last index visited of the siblings of `child`.
     * @protected
     */
    moveChild: function(child, toIndex, lastIndex) {
      // If the index of `child` is less than `lastIndex`, then it needs to
      // be moved. Otherwise, we do not need to move it because a child will be
      // inserted or moved before `child`.
      if (child._mountIndex < lastIndex) {
        enqueueMove(this._rootNodeID, child._mountIndex, toIndex);
      }
    },

    /**
     * Creates a child component.
     *
     * @param {ReactComponent} child Component to create.
     * @param {string} mountImage Markup to insert.
     * @protected
     */
    createChild: function(child, mountImage) {
      enqueueMarkup(this._rootNodeID, mountImage, child._mountIndex);
    },

    /**
     * Removes a child component.
     *
     * @param {ReactComponent} child Child to remove.
     * @protected
     */
    removeChild: function(child) {
      enqueueRemove(this._rootNodeID, child._mountIndex);
    },

    /**
     * Sets this text content string.
     *
     * @param {string} textContent Text content to set.
     * @protected
     */
    setTextContent: function(textContent) {
      enqueueTextContent(this._rootNodeID, textContent);
    },

    /**
     * Mounts a child with the supplied name.
     *
     * NOTE: This is part of `updateChildren` and is here for readability.
     *
     * @param {ReactComponent} child Component to mount.
     * @param {string} name Name of the child.
     * @param {number} index Index at which to insert the child.
     * @param {ReactReconcileTransaction} transaction
     * @private
     */
    _mountChildByNameAtIndex: function(child, name, index, transaction) {
      // Inlined for performance, see `ReactInstanceHandles.createReactID`.
      var rootID = this._rootNodeID + name;
      var mountImage = child.mountComponent(
        rootID,
        transaction,
        this._mountDepth + 1
      );
      child._mountIndex = index;
      this.createChild(child, mountImage);
      this._renderedChildren = this._renderedChildren || {};
      this._renderedChildren[name] = child;
    },

    /**
     * Unmounts a rendered child by name.
     *
     * NOTE: This is part of `updateChildren` and is here for readability.
     *
     * @param {ReactComponent} child Component to unmount.
     * @param {string} name Name of the child in `this._renderedChildren`.
     * @private
     */
    _unmountChildByName: function(child, name) {
      // TODO: When is this not true?
      if (ReactComponent.isValidComponent(child)) {
        this.removeChild(child);
        child._mountIndex = null;
        child.unmountComponent();
        delete this._renderedChildren[name];
      }
    }

  }

};

module.exports = ReactMultiChild;

},{"./ReactComponent":41,"./ReactMultiChildUpdateTypes":73,"./flattenChildren":122,"./instantiateReactComponent":134,"./shouldUpdateReactComponent":154}],73:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactMultiChildUpdateTypes
 */

"use strict";

var keyMirror = require("./keyMirror");

/**
 * When a component's children are updated, a series of update configuration
 * objects are created in order to batch and serialize the required changes.
 *
 * Enumerates all the possible types of update configurations.
 *
 * @internal
 */
var ReactMultiChildUpdateTypes = keyMirror({
  INSERT_MARKUP: null,
  MOVE_EXISTING: null,
  REMOVE_NODE: null,
  TEXT_CONTENT: null
});

module.exports = ReactMultiChildUpdateTypes;

},{"./keyMirror":141}],74:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactOwner
 */

"use strict";

var emptyObject = require("./emptyObject");
var invariant = require("./invariant");

/**
 * ReactOwners are capable of storing references to owned components.
 *
 * All components are capable of //being// referenced by owner components, but
 * only ReactOwner components are capable of //referencing// owned components.
 * The named reference is known as a "ref".
 *
 * Refs are available when mounted and updated during reconciliation.
 *
 *   var MyComponent = React.createClass({
 *     render: function() {
 *       return (
 *         <div onClick={this.handleClick}>
 *           <CustomComponent ref="custom" />
 *         </div>
 *       );
 *     },
 *     handleClick: function() {
 *       this.refs.custom.handleClick();
 *     },
 *     componentDidMount: function() {
 *       this.refs.custom.initialize();
 *     }
 *   });
 *
 * Refs should rarely be used. When refs are used, they should only be done to
 * control data that is not handled by React's data flow.
 *
 * @class ReactOwner
 */
var ReactOwner = {

  /**
   * @param {?object} object
   * @return {boolean} True if `object` is a valid owner.
   * @final
   */
  isValidOwner: function(object) {
    return !!(
      object &&
      typeof object.attachRef === 'function' &&
      typeof object.detachRef === 'function'
    );
  },

  /**
   * Adds a component by ref to an owner component.
   *
   * @param {ReactComponent} component Component to reference.
   * @param {string} ref Name by which to refer to the component.
   * @param {ReactOwner} owner Component on which to record the ref.
   * @final
   * @internal
   */
  addComponentAsRefTo: function(component, ref, owner) {
    ("production" !== process.env.NODE_ENV ? invariant(
      ReactOwner.isValidOwner(owner),
      'addComponentAsRefTo(...): Only a ReactOwner can have refs. This ' +
      'usually means that you\'re trying to add a ref to a component that ' +
      'doesn\'t have an owner (that is, was not created inside of another ' +
      'component\'s `render` method). Try rendering this component inside of ' +
      'a new top-level component which will hold the ref.'
    ) : invariant(ReactOwner.isValidOwner(owner)));
    owner.attachRef(ref, component);
  },

  /**
   * Removes a component by ref from an owner component.
   *
   * @param {ReactComponent} component Component to dereference.
   * @param {string} ref Name of the ref to remove.
   * @param {ReactOwner} owner Component on which the ref is recorded.
   * @final
   * @internal
   */
  removeComponentAsRefFrom: function(component, ref, owner) {
    ("production" !== process.env.NODE_ENV ? invariant(
      ReactOwner.isValidOwner(owner),
      'removeComponentAsRefFrom(...): Only a ReactOwner can have refs. This ' +
      'usually means that you\'re trying to remove a ref to a component that ' +
      'doesn\'t have an owner (that is, was not created inside of another ' +
      'component\'s `render` method). Try rendering this component inside of ' +
      'a new top-level component which will hold the ref.'
    ) : invariant(ReactOwner.isValidOwner(owner)));
    // Check that `component` is still the current ref because we do not want to
    // detach the ref if another component stole it.
    if (owner.refs[ref] === component) {
      owner.detachRef(ref);
    }
  },

  /**
   * A ReactComponent must mix this in to have refs.
   *
   * @lends {ReactOwner.prototype}
   */
  Mixin: {

    construct: function() {
      this.refs = emptyObject;
    },

    /**
     * Lazily allocates the refs object and stores `component` as `ref`.
     *
     * @param {string} ref Reference name.
     * @param {component} component Component to store as `ref`.
     * @final
     * @private
     */
    attachRef: function(ref, component) {
      ("production" !== process.env.NODE_ENV ? invariant(
        component.isOwnedBy(this),
        'attachRef(%s, ...): Only a component\'s owner can store a ref to it.',
        ref
      ) : invariant(component.isOwnedBy(this)));
      var refs = this.refs === emptyObject ? (this.refs = {}) : this.refs;
      refs[ref] = component;
    },

    /**
     * Detaches a reference name.
     *
     * @param {string} ref Name to dereference.
     * @final
     * @private
     */
    detachRef: function(ref) {
      delete this.refs[ref];
    }

  }

};

module.exports = ReactOwner;

}).call(this,require("qvMYcC"))
},{"./emptyObject":120,"./invariant":135,"qvMYcC":161}],75:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactPerf
 * @typechecks static-only
 */

"use strict";

/**
 * ReactPerf is a general AOP system designed to measure performance. This
 * module only has the hooks: see ReactDefaultPerf for the analysis tool.
 */
var ReactPerf = {
  /**
   * Boolean to enable/disable measurement. Set to false by default to prevent
   * accidental logging and perf loss.
   */
  enableMeasure: false,

  /**
   * Holds onto the measure function in use. By default, don't measure
   * anything, but we'll override this if we inject a measure function.
   */
  storedMeasure: _noMeasure,

  /**
   * Use this to wrap methods you want to measure. Zero overhead in production.
   *
   * @param {string} objName
   * @param {string} fnName
   * @param {function} func
   * @return {function}
   */
  measure: function(objName, fnName, func) {
    if ("production" !== process.env.NODE_ENV) {
      var measuredFunc = null;
      return function() {
        if (ReactPerf.enableMeasure) {
          if (!measuredFunc) {
            measuredFunc = ReactPerf.storedMeasure(objName, fnName, func);
          }
          return measuredFunc.apply(this, arguments);
        }
        return func.apply(this, arguments);
      };
    }
    return func;
  },

  injection: {
    /**
     * @param {function} measure
     */
    injectMeasure: function(measure) {
      ReactPerf.storedMeasure = measure;
    }
  }
};

/**
 * Simply passes through the measured function, without measuring it.
 *
 * @param {string} objName
 * @param {string} fnName
 * @param {function} func
 * @return {function}
 */
function _noMeasure(objName, fnName, func) {
  return func;
}

module.exports = ReactPerf;

}).call(this,require("qvMYcC"))
},{"qvMYcC":161}],76:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactPropTransferer
 */

"use strict";

var emptyFunction = require("./emptyFunction");
var invariant = require("./invariant");
var joinClasses = require("./joinClasses");
var merge = require("./merge");

/**
 * Creates a transfer strategy that will merge prop values using the supplied
 * `mergeStrategy`. If a prop was previously unset, this just sets it.
 *
 * @param {function} mergeStrategy
 * @return {function}
 */
function createTransferStrategy(mergeStrategy) {
  return function(props, key, value) {
    if (!props.hasOwnProperty(key)) {
      props[key] = value;
    } else {
      props[key] = mergeStrategy(props[key], value);
    }
  };
}

/**
 * Transfer strategies dictate how props are transferred by `transferPropsTo`.
 * NOTE: if you add any more exceptions to this list you should be sure to
 * update `cloneWithProps()` accordingly.
 */
var TransferStrategies = {
  /**
   * Never transfer `children`.
   */
  children: emptyFunction,
  /**
   * Transfer the `className` prop by merging them.
   */
  className: createTransferStrategy(joinClasses),
  /**
   * Never transfer the `key` prop.
   */
  key: emptyFunction,
  /**
   * Never transfer the `ref` prop.
   */
  ref: emptyFunction,
  /**
   * Transfer the `style` prop (which is an object) by merging them.
   */
  style: createTransferStrategy(merge)
};

/**
 * ReactPropTransferer are capable of transferring props to another component
 * using a `transferPropsTo` method.
 *
 * @class ReactPropTransferer
 */
var ReactPropTransferer = {

  TransferStrategies: TransferStrategies,

  /**
   * Merge two props objects using TransferStrategies.
   *
   * @param {object} oldProps original props (they take precedence)
   * @param {object} newProps new props to merge in
   * @return {object} a new object containing both sets of props merged.
   */
  mergeProps: function(oldProps, newProps) {
    var props = merge(oldProps);

    for (var thisKey in newProps) {
      if (!newProps.hasOwnProperty(thisKey)) {
        continue;
      }

      var transferStrategy = TransferStrategies[thisKey];

      if (transferStrategy && TransferStrategies.hasOwnProperty(thisKey)) {
        transferStrategy(props, thisKey, newProps[thisKey]);
      } else if (!props.hasOwnProperty(thisKey)) {
        props[thisKey] = newProps[thisKey];
      }
    }

    return props;
  },

  /**
   * @lends {ReactPropTransferer.prototype}
   */
  Mixin: {

    /**
     * Transfer props from this component to a target component.
     *
     * Props that do not have an explicit transfer strategy will be transferred
     * only if the target component does not already have the prop set.
     *
     * This is usually used to pass down props to a returned root component.
     *
     * @param {ReactComponent} component Component receiving the properties.
     * @return {ReactComponent} The supplied `component`.
     * @final
     * @protected
     */
    transferPropsTo: function(component) {
      ("production" !== process.env.NODE_ENV ? invariant(
        component._owner === this,
        '%s: You can\'t call transferPropsTo() on a component that you ' +
        'don\'t own, %s. This usually means you are calling ' +
        'transferPropsTo() on a component passed in as props or children.',
        this.constructor.displayName,
        component.constructor.displayName
      ) : invariant(component._owner === this));

      component.props = ReactPropTransferer.mergeProps(
        component.props,
        this.props
      );

      return component;
    }

  }
};

module.exports = ReactPropTransferer;

}).call(this,require("qvMYcC"))
},{"./emptyFunction":119,"./invariant":135,"./joinClasses":140,"./merge":144,"qvMYcC":161}],77:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactPropTypeLocationNames
 */

"use strict";

var ReactPropTypeLocationNames = {};

if ("production" !== process.env.NODE_ENV) {
  ReactPropTypeLocationNames = {
    prop: 'prop',
    context: 'context',
    childContext: 'child context'
  };
}

module.exports = ReactPropTypeLocationNames;

}).call(this,require("qvMYcC"))
},{"qvMYcC":161}],78:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactPropTypeLocations
 */

"use strict";

var keyMirror = require("./keyMirror");

var ReactPropTypeLocations = keyMirror({
  prop: null,
  context: null,
  childContext: null
});

module.exports = ReactPropTypeLocations;

},{"./keyMirror":141}],79:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactPropTypes
 */

"use strict";

var ReactComponent = require("./ReactComponent");
var ReactPropTypeLocationNames = require("./ReactPropTypeLocationNames");

var warning = require("./warning");
var createObjectFrom = require("./createObjectFrom");

/**
 * Collection of methods that allow declaration and validation of props that are
 * supplied to React components. Example usage:
 *
 *   var Props = require('ReactPropTypes');
 *   var MyArticle = React.createClass({
 *     propTypes: {
 *       // An optional string prop named "description".
 *       description: Props.string,
 *
 *       // A required enum prop named "category".
 *       category: Props.oneOf(['News','Photos']).isRequired,
 *
 *       // A prop named "dialog" that requires an instance of Dialog.
 *       dialog: Props.instanceOf(Dialog).isRequired
 *     },
 *     render: function() { ... }
 *   });
 *
 * A more formal specification of how these methods are used:
 *
 *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
 *   decl := ReactPropTypes.{type}(.isRequired)?
 *
 * Each and every declaration produces a function with the same signature. This
 * allows the creation of custom validation functions. For example:
 *
 *   var Props = require('ReactPropTypes');
 *   var MyLink = React.createClass({
 *     propTypes: {
 *       // An optional string or URI prop named "href".
 *       href: function(props, propName, componentName) {
 *         var propValue = props[propName];
 *         warning(
 *           propValue == null ||
 *           typeof propValue === 'string' ||
 *           propValue instanceof URI,
 *           'Invalid `%s` supplied to `%s`, expected string or URI.',
 *           propName,
 *           componentName
 *         );
 *       }
 *     },
 *     render: function() { ... }
 *   });
 *
 * @internal
 */
var Props = {

  array: createPrimitiveTypeChecker('array'),
  bool: createPrimitiveTypeChecker('boolean'),
  func: createPrimitiveTypeChecker('function'),
  number: createPrimitiveTypeChecker('number'),
  object: createPrimitiveTypeChecker('object'),
  string: createPrimitiveTypeChecker('string'),

  shape: createShapeTypeChecker,
  oneOf: createEnumTypeChecker,
  oneOfType: createUnionTypeChecker,
  arrayOf: createArrayOfTypeChecker,

  instanceOf: createInstanceTypeChecker,

  renderable: createRenderableTypeChecker(),

  component: createComponentTypeChecker(),

  any: createAnyTypeChecker()
};

var ANONYMOUS = '<<anonymous>>';

function isRenderable(propValue) {
  switch(typeof propValue) {
    case 'number':
    case 'string':
      return true;
    case 'object':
      if (Array.isArray(propValue)) {
        return propValue.every(isRenderable);
      }
      if (ReactComponent.isValidComponent(propValue)) {
        return true;
      }
      for (var k in propValue) {
        if (!isRenderable(propValue[k])) {
          return false;
        }
      }
      return true;
    default:
      return false;
  }
}

// Equivalent of typeof but with special handling for arrays
function getPropType(propValue) {
  var propType = typeof propValue;
  if (propType === 'object' && Array.isArray(propValue)) {
    return 'array';
  }
  return propType;
}

function createAnyTypeChecker() {
  function validateAnyType(
    shouldWarn, propValue, propName, componentName, location
  ) {
    return true; // is always valid
  }
  return createChainableTypeChecker(validateAnyType);
}

function createPrimitiveTypeChecker(expectedType) {
  function validatePrimitiveType(
    shouldWarn, propValue, propName, componentName, location
  ) {
    var propType = getPropType(propValue);
    var isValid = propType === expectedType;
    if (shouldWarn) {
      ("production" !== process.env.NODE_ENV ? warning(
        isValid,
        'Invalid %s `%s` of type `%s` supplied to `%s`, expected `%s`.',
        ReactPropTypeLocationNames[location],
        propName,
        propType,
        componentName,
        expectedType
      ) : null);
    }
    return isValid;
  }
  return createChainableTypeChecker(validatePrimitiveType);
}

function createEnumTypeChecker(expectedValues) {
  var expectedEnum = createObjectFrom(expectedValues);
  function validateEnumType(
    shouldWarn, propValue, propName, componentName, location
  ) {
    var isValid = expectedEnum[propValue];
    if (shouldWarn) {
      ("production" !== process.env.NODE_ENV ? warning(
        isValid,
        'Invalid %s `%s` supplied to `%s`, expected one of %s.',
        ReactPropTypeLocationNames[location],
        propName,
        componentName,
        JSON.stringify(Object.keys(expectedEnum))
      ) : null);
    }
    return isValid;
  }
  return createChainableTypeChecker(validateEnumType);
}

function createShapeTypeChecker(shapeTypes) {
  function validateShapeType(
    shouldWarn, propValue, propName, componentName, location
  ) {
    var propType = getPropType(propValue);
    var isValid = propType === 'object';
    if (isValid) {
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (checker && !checker(propValue, key, componentName, location)) {
          return false;
        }
      }
    }
    if (shouldWarn) {
      ("production" !== process.env.NODE_ENV ? warning(
        isValid,
        'Invalid %s `%s` of type `%s` supplied to `%s`, expected `object`.',
        ReactPropTypeLocationNames[location],
        propName,
        propType,
        componentName
      ) : null);
    }
    return isValid;
  }
  return createChainableTypeChecker(validateShapeType);
}

function createInstanceTypeChecker(expectedClass) {
  function validateInstanceType(
    shouldWarn, propValue, propName, componentName, location
  ) {
    var isValid = propValue instanceof expectedClass;
    if (shouldWarn) {
      ("production" !== process.env.NODE_ENV ? warning(
        isValid,
        'Invalid %s `%s` supplied to `%s`, expected instance of `%s`.',
        ReactPropTypeLocationNames[location],
        propName,
        componentName,
        expectedClass.name || ANONYMOUS
      ) : null);
    }
    return isValid;
  }
  return createChainableTypeChecker(validateInstanceType);
}

function createArrayOfTypeChecker(propTypeChecker) {
  function validateArrayType(
    shouldWarn, propValue, propName, componentName, location
  ) {
    var isValid = Array.isArray(propValue);
    if (isValid) {
      for (var i = 0; i < propValue.length; i++) {
        if (!propTypeChecker(propValue, i, componentName, location)) {
          return false;
        }
      }
    }
    if (shouldWarn) {
      ("production" !== process.env.NODE_ENV ? warning(
        isValid,
        'Invalid %s `%s` supplied to `%s`, expected an array.',
        ReactPropTypeLocationNames[location],
        propName,
        componentName
      ) : null);
    }
    return isValid;
  }
  return createChainableTypeChecker(validateArrayType);
}

function createRenderableTypeChecker() {
  function validateRenderableType(
    shouldWarn, propValue, propName, componentName, location
  ) {
    var isValid = isRenderable(propValue);
    if (shouldWarn) {
      ("production" !== process.env.NODE_ENV ? warning(
        isValid,
        'Invalid %s `%s` supplied to `%s`, expected a renderable prop.',
        ReactPropTypeLocationNames[location],
        propName,
        componentName
      ) : null);
    }
    return isValid;
  }
  return createChainableTypeChecker(validateRenderableType);
}

function createComponentTypeChecker() {
  function validateComponentType(
    shouldWarn, propValue, propName, componentName, location
  ) {
    var isValid = ReactComponent.isValidComponent(propValue);
    if (shouldWarn) {
      ("production" !== process.env.NODE_ENV ? warning(
        isValid,
        'Invalid %s `%s` supplied to `%s`, expected a React component.',
        ReactPropTypeLocationNames[location],
        propName,
        componentName
      ) : null);
    }
    return isValid;
  }
  return createChainableTypeChecker(validateComponentType);
}

function createUnionTypeChecker(arrayOfValidators) {
  return function(props, propName, componentName, location) {
    var isValid = false;
    for (var ii = 0; ii < arrayOfValidators.length; ii++) {
      var validate = arrayOfValidators[ii];
      if (typeof validate.weak === 'function') {
        validate = validate.weak;
      }
      if (validate(props, propName, componentName, location)) {
        isValid = true;
        break;
      }
    }
    ("production" !== process.env.NODE_ENV ? warning(
      isValid,
      'Invalid %s `%s` supplied to `%s`.',
      ReactPropTypeLocationNames[location],
      propName,
      componentName || ANONYMOUS
    ) : null);
    return isValid;
  };
}

function createChainableTypeChecker(validate) {
  function checkType(
    isRequired, shouldWarn, props, propName, componentName, location
  ) {
    var propValue = props[propName];
    if (propValue != null) {
      // Only validate if there is a value to check.
      return validate(
        shouldWarn,
        propValue,
        propName,
        componentName || ANONYMOUS,
        location
      );
    } else {
      var isValid = !isRequired;
      if (shouldWarn) {
        ("production" !== process.env.NODE_ENV ? warning(
          isValid,
          'Required %s `%s` was not specified in `%s`.',
          ReactPropTypeLocationNames[location],
          propName,
          componentName || ANONYMOUS
        ) : null);
      }
      return isValid;
    }
  }

  var checker = checkType.bind(null, false, true);
  checker.weak = checkType.bind(null, false, false);
  checker.isRequired = checkType.bind(null, true, true);
  checker.weak.isRequired = checkType.bind(null, true, false);
  checker.isRequired.weak = checker.weak.isRequired;

  return checker;
}

module.exports = Props;

}).call(this,require("qvMYcC"))
},{"./ReactComponent":41,"./ReactPropTypeLocationNames":77,"./createObjectFrom":116,"./warning":158,"qvMYcC":161}],80:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactPutListenerQueue
 */

"use strict";

var PooledClass = require("./PooledClass");
var ReactEventEmitter = require("./ReactEventEmitter");

var mixInto = require("./mixInto");

function ReactPutListenerQueue() {
  this.listenersToPut = [];
}

mixInto(ReactPutListenerQueue, {
  enqueuePutListener: function(rootNodeID, propKey, propValue) {
    this.listenersToPut.push({
      rootNodeID: rootNodeID,
      propKey: propKey,
      propValue: propValue
    });
  },

  putListeners: function() {
    for (var i = 0; i < this.listenersToPut.length; i++) {
      var listenerToPut = this.listenersToPut[i];
      ReactEventEmitter.putListener(
        listenerToPut.rootNodeID,
        listenerToPut.propKey,
        listenerToPut.propValue
      );
    }
  },

  reset: function() {
    this.listenersToPut.length = 0;
  },

  destructor: function() {
    this.reset();
  }
});

PooledClass.addPoolingTo(ReactPutListenerQueue);

module.exports = ReactPutListenerQueue;

},{"./PooledClass":35,"./ReactEventEmitter":62,"./mixInto":147}],81:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactReconcileTransaction
 * @typechecks static-only
 */

"use strict";

var PooledClass = require("./PooledClass");
var ReactEventEmitter = require("./ReactEventEmitter");
var ReactInputSelection = require("./ReactInputSelection");
var ReactMountReady = require("./ReactMountReady");
var ReactPutListenerQueue = require("./ReactPutListenerQueue");
var Transaction = require("./Transaction");

var mixInto = require("./mixInto");

/**
 * Ensures that, when possible, the selection range (currently selected text
 * input) is not disturbed by performing the transaction.
 */
var SELECTION_RESTORATION = {
  /**
   * @return {Selection} Selection information.
   */
  initialize: ReactInputSelection.getSelectionInformation,
  /**
   * @param {Selection} sel Selection information returned from `initialize`.
   */
  close: ReactInputSelection.restoreSelection
};

/**
 * Suppresses events (blur/focus) that could be inadvertently dispatched due to
 * high level DOM manipulations (like temporarily removing a text input from the
 * DOM).
 */
var EVENT_SUPPRESSION = {
  /**
   * @return {boolean} The enabled status of `ReactEventEmitter` before the
   * reconciliation.
   */
  initialize: function() {
    var currentlyEnabled = ReactEventEmitter.isEnabled();
    ReactEventEmitter.setEnabled(false);
    return currentlyEnabled;
  },

  /**
   * @param {boolean} previouslyEnabled Enabled status of `ReactEventEmitter`
   *   before the reconciliation occured. `close` restores the previous value.
   */
  close: function(previouslyEnabled) {
    ReactEventEmitter.setEnabled(previouslyEnabled);
  }
};

/**
 * Provides a `ReactMountReady` queue for collecting `onDOMReady` callbacks
 * during the performing of the transaction.
 */
var ON_DOM_READY_QUEUEING = {
  /**
   * Initializes the internal `onDOMReady` queue.
   */
  initialize: function() {
    this.reactMountReady.reset();
  },

  /**
   * After DOM is flushed, invoke all registered `onDOMReady` callbacks.
   */
  close: function() {
    this.reactMountReady.notifyAll();
  }
};

var PUT_LISTENER_QUEUEING = {
  initialize: function() {
    this.putListenerQueue.reset();
  },

  close: function() {
    this.putListenerQueue.putListeners();
  }
};

/**
 * Executed within the scope of the `Transaction` instance. Consider these as
 * being member methods, but with an implied ordering while being isolated from
 * each other.
 */
var TRANSACTION_WRAPPERS = [
  PUT_LISTENER_QUEUEING,
  SELECTION_RESTORATION,
  EVENT_SUPPRESSION,
  ON_DOM_READY_QUEUEING
];

/**
 * Currently:
 * - The order that these are listed in the transaction is critical:
 * - Suppresses events.
 * - Restores selection range.
 *
 * Future:
 * - Restore document/overflow scroll positions that were unintentionally
 *   modified via DOM insertions above the top viewport boundary.
 * - Implement/integrate with customized constraint based layout system and keep
 *   track of which dimensions must be remeasured.
 *
 * @class ReactReconcileTransaction
 */
function ReactReconcileTransaction() {
  this.reinitializeTransaction();
  // Only server-side rendering really needs this option (see
  // `ReactServerRendering`), but server-side uses
  // `ReactServerRenderingTransaction` instead. This option is here so that it's
  // accessible and defaults to false when `ReactDOMComponent` and
  // `ReactTextComponent` checks it in `mountComponent`.`
  this.renderToStaticMarkup = false;
  this.reactMountReady = ReactMountReady.getPooled(null);
  this.putListenerQueue = ReactPutListenerQueue.getPooled();
}

var Mixin = {
  /**
   * @see Transaction
   * @abstract
   * @final
   * @return {array<object>} List of operation wrap proceedures.
   *   TODO: convert to array<TransactionWrapper>
   */
  getTransactionWrappers: function() {
    return TRANSACTION_WRAPPERS;
  },

  /**
   * @return {object} The queue to collect `onDOMReady` callbacks with.
   *   TODO: convert to ReactMountReady
   */
  getReactMountReady: function() {
    return this.reactMountReady;
  },

  getPutListenerQueue: function() {
    return this.putListenerQueue;
  },

  /**
   * `PooledClass` looks for this, and will invoke this before allowing this
   * instance to be resused.
   */
  destructor: function() {
    ReactMountReady.release(this.reactMountReady);
    this.reactMountReady = null;

    ReactPutListenerQueue.release(this.putListenerQueue);
    this.putListenerQueue = null;
  }
};


mixInto(ReactReconcileTransaction, Transaction.Mixin);
mixInto(ReactReconcileTransaction, Mixin);

PooledClass.addPoolingTo(ReactReconcileTransaction);

module.exports = ReactReconcileTransaction;

},{"./PooledClass":35,"./ReactEventEmitter":62,"./ReactInputSelection":66,"./ReactMountReady":71,"./ReactPutListenerQueue":80,"./Transaction":106,"./mixInto":147}],82:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactRootIndex
 * @typechecks
 */

"use strict";

var ReactRootIndexInjection = {
  /**
   * @param {function} _createReactRootIndex
   */
  injectCreateReactRootIndex: function(_createReactRootIndex) {
    ReactRootIndex.createReactRootIndex = _createReactRootIndex;
  }
};

var ReactRootIndex = {
  createReactRootIndex: null,
  injection: ReactRootIndexInjection
};

module.exports = ReactRootIndex;

},{}],83:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @typechecks static-only
 * @providesModule ReactServerRendering
 */
"use strict";

var ReactComponent = require("./ReactComponent");
var ReactInstanceHandles = require("./ReactInstanceHandles");
var ReactMarkupChecksum = require("./ReactMarkupChecksum");
var ReactServerRenderingTransaction =
  require("./ReactServerRenderingTransaction");

var instantiateReactComponent = require("./instantiateReactComponent");
var invariant = require("./invariant");

/**
 * @param {ReactComponent} component
 * @return {string} the HTML markup
 */
function renderComponentToString(component) {
  ("production" !== process.env.NODE_ENV ? invariant(
    ReactComponent.isValidComponent(component),
    'renderComponentToString(): You must pass a valid ReactComponent.'
  ) : invariant(ReactComponent.isValidComponent(component)));

  ("production" !== process.env.NODE_ENV ? invariant(
    !(arguments.length === 2 && typeof arguments[1] === 'function'),
    'renderComponentToString(): This function became synchronous and now ' +
    'returns the generated markup. Please remove the second parameter.'
  ) : invariant(!(arguments.length === 2 && typeof arguments[1] === 'function')));

  var transaction;
  try {
    var id = ReactInstanceHandles.createReactRootID();
    transaction = ReactServerRenderingTransaction.getPooled(false);

    return transaction.perform(function() {
      var componentInstance = instantiateReactComponent(component);
      var markup = componentInstance.mountComponent(id, transaction, 0);
      return ReactMarkupChecksum.addChecksumToMarkup(markup);
    }, null);
  } finally {
    ReactServerRenderingTransaction.release(transaction);
  }
}

/**
 * @param {ReactComponent} component
 * @return {string} the HTML markup, without the extra React ID and checksum
* (for generating static pages)
 */
function renderComponentToStaticMarkup(component) {
  ("production" !== process.env.NODE_ENV ? invariant(
    ReactComponent.isValidComponent(component),
    'renderComponentToStaticMarkup(): You must pass a valid ReactComponent.'
  ) : invariant(ReactComponent.isValidComponent(component)));

  var transaction;
  try {
    var id = ReactInstanceHandles.createReactRootID();
    transaction = ReactServerRenderingTransaction.getPooled(true);

    return transaction.perform(function() {
      var componentInstance = instantiateReactComponent(component);
      return componentInstance.mountComponent(id, transaction, 0);
    }, null);
  } finally {
    ReactServerRenderingTransaction.release(transaction);
  }
}

module.exports = {
  renderComponentToString: renderComponentToString,
  renderComponentToStaticMarkup: renderComponentToStaticMarkup
};

}).call(this,require("qvMYcC"))
},{"./ReactComponent":41,"./ReactInstanceHandles":67,"./ReactMarkupChecksum":69,"./ReactServerRenderingTransaction":84,"./instantiateReactComponent":134,"./invariant":135,"qvMYcC":161}],84:[function(require,module,exports){
/**
 * Copyright 2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactServerRenderingTransaction
 * @typechecks
 */

"use strict";

var PooledClass = require("./PooledClass");
var ReactMountReady = require("./ReactMountReady");
var ReactPutListenerQueue = require("./ReactPutListenerQueue");
var Transaction = require("./Transaction");

var emptyFunction = require("./emptyFunction");
var mixInto = require("./mixInto");

/**
 * Provides a `ReactMountReady` queue for collecting `onDOMReady` callbacks
 * during the performing of the transaction.
 */
var ON_DOM_READY_QUEUEING = {
  /**
   * Initializes the internal `onDOMReady` queue.
   */
  initialize: function() {
    this.reactMountReady.reset();
  },

  close: emptyFunction
};

var PUT_LISTENER_QUEUEING = {
  initialize: function() {
    this.putListenerQueue.reset();
  },

  close: emptyFunction
};

/**
 * Executed within the scope of the `Transaction` instance. Consider these as
 * being member methods, but with an implied ordering while being isolated from
 * each other.
 */
var TRANSACTION_WRAPPERS = [
  PUT_LISTENER_QUEUEING,
  ON_DOM_READY_QUEUEING
];

/**
 * @class ReactServerRenderingTransaction
 * @param {boolean} renderToStaticMarkup
 */
function ReactServerRenderingTransaction(renderToStaticMarkup) {
  this.reinitializeTransaction();
  this.renderToStaticMarkup = renderToStaticMarkup;
  this.reactMountReady = ReactMountReady.getPooled(null);
  this.putListenerQueue = ReactPutListenerQueue.getPooled();
}

var Mixin = {
  /**
   * @see Transaction
   * @abstract
   * @final
   * @return {array} Empty list of operation wrap proceedures.
   */
  getTransactionWrappers: function() {
    return TRANSACTION_WRAPPERS;
  },

  /**
   * @return {object} The queue to collect `onDOMReady` callbacks with.
   *   TODO: convert to ReactMountReady
   */
  getReactMountReady: function() {
    return this.reactMountReady;
  },

  getPutListenerQueue: function() {
    return this.putListenerQueue;
  },

  /**
   * `PooledClass` looks for this, and will invoke this before allowing this
   * instance to be resused.
   */
  destructor: function() {
    ReactMountReady.release(this.reactMountReady);
    this.reactMountReady = null;

    ReactPutListenerQueue.release(this.putListenerQueue);
    this.putListenerQueue = null;
  }
};


mixInto(ReactServerRenderingTransaction, Transaction.Mixin);
mixInto(ReactServerRenderingTransaction, Mixin);

PooledClass.addPoolingTo(ReactServerRenderingTransaction);

module.exports = ReactServerRenderingTransaction;

},{"./PooledClass":35,"./ReactMountReady":71,"./ReactPutListenerQueue":80,"./Transaction":106,"./emptyFunction":119,"./mixInto":147}],85:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactStateSetters
 */

"use strict";

var ReactStateSetters = {
  /**
   * Returns a function that calls the provided function, and uses the result
   * of that to set the component's state.
   *
   * @param {ReactCompositeComponent} component
   * @param {function} funcReturningState Returned callback uses this to
   *                                      determine how to update state.
   * @return {function} callback that when invoked uses funcReturningState to
   *                    determined the object literal to setState.
   */
  createStateSetter: function(component, funcReturningState) {
    return function(a, b, c, d, e, f) {
      var partialState = funcReturningState.call(component, a, b, c, d, e, f);
      if (partialState) {
        component.setState(partialState);
      }
    };
  },

  /**
   * Returns a single-argument callback that can be used to update a single
   * key in the component's state.
   *
   * Note: this is memoized function, which makes it inexpensive to call.
   *
   * @param {ReactCompositeComponent} component
   * @param {string} key The key in the state that you should update.
   * @return {function} callback of 1 argument which calls setState() with
   *                    the provided keyName and callback argument.
   */
  createStateKeySetter: function(component, key) {
    // Memoize the setters.
    var cache = component.__keySetters || (component.__keySetters = {});
    return cache[key] || (cache[key] = createStateKeySetter(component, key));
  }
};

function createStateKeySetter(component, key) {
  // Partial state is allocated outside of the function closure so it can be
  // reused with every call, avoiding memory allocation when this function
  // is called.
  var partialState = {};
  return function stateKeySetter(value) {
    partialState[key] = value;
    component.setState(partialState);
  };
}

ReactStateSetters.Mixin = {
  /**
   * Returns a function that calls the provided function, and uses the result
   * of that to set the component's state.
   *
   * For example, these statements are equivalent:
   *
   *   this.setState({x: 1});
   *   this.createStateSetter(function(xValue) {
   *     return {x: xValue};
   *   })(1);
   *
   * @param {function} funcReturningState Returned callback uses this to
   *                                      determine how to update state.
   * @return {function} callback that when invoked uses funcReturningState to
   *                    determined the object literal to setState.
   */
  createStateSetter: function(funcReturningState) {
    return ReactStateSetters.createStateSetter(this, funcReturningState);
  },

  /**
   * Returns a single-argument callback that can be used to update a single
   * key in the component's state.
   *
   * For example, these statements are equivalent:
   *
   *   this.setState({x: 1});
   *   this.createStateKeySetter('x')(1);
   *
   * Note: this is memoized function, which makes it inexpensive to call.
   *
   * @param {string} key The key in the state that you should update.
   * @return {function} callback of 1 argument which calls setState() with
   *                    the provided keyName and callback argument.
   */
  createStateKeySetter: function(key) {
    return ReactStateSetters.createStateKeySetter(this, key);
  }
};

module.exports = ReactStateSetters;

},{}],86:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactTestUtils
 */

"use strict";

var EventConstants = require("./EventConstants");
var EventPluginHub = require("./EventPluginHub");
var EventPropagators = require("./EventPropagators");
var React = require("./React");
var ReactComponent = require("./ReactComponent");
var ReactDOM = require("./ReactDOM");
var ReactEventEmitter = require("./ReactEventEmitter");
var ReactMount = require("./ReactMount");
var ReactTextComponent = require("./ReactTextComponent");
var ReactUpdates = require("./ReactUpdates");
var SyntheticEvent = require("./SyntheticEvent");

var mergeInto = require("./mergeInto");
var copyProperties = require("./copyProperties");

var topLevelTypes = EventConstants.topLevelTypes;

function Event(suffix) {}

/**
 * @class ReactTestUtils
 */

/**
 * Todo: Support the entire DOM.scry query syntax. For now, these simple
 * utilities will suffice for testing purposes.
 * @lends ReactTestUtils
 */
var ReactTestUtils = {
  renderIntoDocument: function(instance) {
    var div = document.createElement('div');
    // None of our tests actually require attaching the container to the
    // DOM, and doing so creates a mess that we rely on test isolation to
    // clean up, so we're going to stop honoring the name of this method
    // (and probably rename it eventually) if no problems arise.
    // document.documentElement.appendChild(div);
    return React.renderComponent(instance, div);
  },

  isComponentOfType: function(inst, convenienceConstructor) {
    return (
      ReactComponent.isValidComponent(inst) &&
      inst.type === convenienceConstructor.type
    );
  },

  isDOMComponent: function(inst) {
    return !!(inst &&
              ReactComponent.isValidComponent(inst) &&
              !!inst.tagName);
  },

  isCompositeComponent: function(inst) {
    if (!ReactComponent.isValidComponent(inst)) {
      return false;
    }
    // We check the prototype of the type that will get mounted, not the
    // instance itself. This is a future proof way of duck typing.
    var prototype = inst.type.prototype;
    return (
      typeof prototype.render === 'function' &&
      typeof prototype.setState === 'function' &&
      typeof prototype.updateComponent === 'function'
    );
  },

  isCompositeComponentWithType: function(inst, type) {
    return !!(ReactTestUtils.isCompositeComponent(inst) &&
             (inst.constructor === type.componentConstructor ||
              inst.constructor === type));
  },

  isTextComponent: function(inst) {
    return inst instanceof ReactTextComponent;
  },

  findAllInRenderedTree: function(inst, test) {
    if (!inst) {
      return [];
    }
    var ret = test(inst) ? [inst] : [];
    if (ReactTestUtils.isDOMComponent(inst)) {
      var renderedChildren = inst._renderedChildren;
      var key;
      for (key in renderedChildren) {
        if (!renderedChildren.hasOwnProperty(key)) {
          continue;
        }
        ret = ret.concat(
          ReactTestUtils.findAllInRenderedTree(renderedChildren[key], test)
        );
      }
    } else if (ReactTestUtils.isCompositeComponent(inst)) {
      ret = ret.concat(
        ReactTestUtils.findAllInRenderedTree(inst._renderedComponent, test)
      );
    }
    return ret;
  },

  /**
   * Finds all instance of components in the rendered tree that are DOM
   * components with the class name matching `className`.
   * @return an array of all the matches.
   */
  scryRenderedDOMComponentsWithClass: function(root, className) {
    return ReactTestUtils.findAllInRenderedTree(root, function(inst) {
      var instClassName = inst.props.className;
      return ReactTestUtils.isDOMComponent(inst) && (
        instClassName &&
        (' ' + instClassName + ' ').indexOf(' ' + className + ' ') !== -1
      );
    });
  },

  /**
   * Like scryRenderedDOMComponentsWithClass but expects there to be one result,
   * and returns that one result, or throws exception if there is any other
   * number of matches besides one.
   * @return {!ReactDOMComponent} The one match.
   */
  findRenderedDOMComponentWithClass: function(root, className) {
    var all =
      ReactTestUtils.scryRenderedDOMComponentsWithClass(root, className);
    if (all.length !== 1) {
      throw new Error('Did not find exactly one match for class:' + className);
    }
    return all[0];
  },


  /**
   * Finds all instance of components in the rendered tree that are DOM
   * components with the tag name matching `tagName`.
   * @return an array of all the matches.
   */
  scryRenderedDOMComponentsWithTag: function(root, tagName) {
    return ReactTestUtils.findAllInRenderedTree(root, function(inst) {
      return ReactTestUtils.isDOMComponent(inst) &&
            inst.tagName === tagName.toUpperCase();
    });
  },

  /**
   * Like scryRenderedDOMComponentsWithTag but expects there to be one result,
   * and returns that one result, or throws exception if there is any other
   * number of matches besides one.
   * @return {!ReactDOMComponent} The one match.
   */
  findRenderedDOMComponentWithTag: function(root, tagName) {
    var all = ReactTestUtils.scryRenderedDOMComponentsWithTag(root, tagName);
    if (all.length !== 1) {
      throw new Error('Did not find exactly one match for tag:' + tagName);
    }
    return all[0];
  },


  /**
   * Finds all instances of components with type equal to `componentType`.
   * @return an array of all the matches.
   */
  scryRenderedComponentsWithType: function(root, componentType) {
    return ReactTestUtils.findAllInRenderedTree(root, function(inst) {
      return ReactTestUtils.isCompositeComponentWithType(inst, componentType);
    });
  },

  /**
   * Same as `scryRenderedComponentsWithType` but expects there to be one result
   * and returns that one result, or throws exception if there is any other
   * number of matches besides one.
   * @return {!ReactComponent} The one match.
   */
  findRenderedComponentWithType: function(root, componentType) {
    var all = ReactTestUtils.scryRenderedComponentsWithType(
      root,
      componentType
    );
    if (all.length !== 1) {
      throw new Error(
        'Did not find exactly one match for componentType:' + componentType
      );
    }
    return all[0];
  },

  /**
   * Pass a mocked component module to this method to augment it with
   * useful methods that allow it to be used as a dummy React component.
   * Instead of rendering as usual, the component will become a simple
   * <div> containing any provided children.
   *
   * @param {object} module the mock function object exported from a
   *                        module that defines the component to be mocked
   * @param {?string} mockTagName optional dummy root tag name to return
   *                              from render method (overrides
   *                              module.mockTagName if provided)
   * @return {object} the ReactTestUtils object (for chaining)
   */
  mockComponent: function(module, mockTagName) {
    var ConvenienceConstructor = React.createClass({
      render: function() {
        var mockTagName = mockTagName || module.mockTagName || "div";
        return ReactDOM[mockTagName](null, this.props.children);
      }
    });

    copyProperties(module, ConvenienceConstructor);
    module.mockImplementation(ConvenienceConstructor);

    return this;
  },

  /**
   * Simulates a top level event being dispatched from a raw event that occured
   * on an `Element` node.
   * @param topLevelType {Object} A type from `EventConstants.topLevelTypes`
   * @param {!Element} node The dom to simulate an event occurring on.
   * @param {?Event} fakeNativeEvent Fake native event to use in SyntheticEvent.
   */
  simulateNativeEventOnNode: function(topLevelType, node, fakeNativeEvent) {
    var virtualHandler =
      ReactEventEmitter.TopLevelCallbackCreator.createTopLevelCallback(
        topLevelType
      );
    fakeNativeEvent.target = node;
    virtualHandler(fakeNativeEvent);
  },

  /**
   * Simulates a top level event being dispatched from a raw event that occured
   * on the `ReactDOMComponent` `comp`.
   * @param topLevelType {Object} A type from `EventConstants.topLevelTypes`.
   * @param comp {!ReactDOMComponent}
   * @param {?Event} fakeNativeEvent Fake native event to use in SyntheticEvent.
   */
  simulateNativeEventOnDOMComponent: function(
      topLevelType,
      comp,
      fakeNativeEvent) {
    ReactTestUtils.simulateNativeEventOnNode(
      topLevelType,
      comp.getDOMNode(),
      fakeNativeEvent
    );
  },

  nativeTouchData: function(x, y) {
    return {
      touches: [
        {pageX: x, pageY: y}
      ]
    };
  },

  Simulate: null,
  SimulateNative: {}
};

/**
 * Exports:
 *
 * - `ReactTestUtils.Simulate.click(Element/ReactDOMComponent)`
 * - `ReactTestUtils.Simulate.mouseMove(Element/ReactDOMComponent)`
 * - `ReactTestUtils.Simulate.change(Element/ReactDOMComponent)`
 * - ... (All keys from event plugin `eventTypes` objects)
 */
function makeSimulator(eventType) {
  return function(domComponentOrNode, eventData) {
    var node;
    if (ReactTestUtils.isDOMComponent(domComponentOrNode)) {
      node = domComponentOrNode.getDOMNode();
    } else if (domComponentOrNode.tagName) {
      node = domComponentOrNode;
    }

    var fakeNativeEvent = new Event();
    fakeNativeEvent.target = node;
    // We don't use SyntheticEvent.getPooled in order to not have to worry about
    // properly destroying any properties assigned from `eventData` upon release
    var event = new SyntheticEvent(
      ReactEventEmitter.eventNameDispatchConfigs[eventType],
      ReactMount.getID(node),
      fakeNativeEvent
    );
    mergeInto(event, eventData);
    EventPropagators.accumulateTwoPhaseDispatches(event);

    ReactUpdates.batchedUpdates(function() {
      EventPluginHub.enqueueEvents(event);
      EventPluginHub.processEventQueue();
    });
  };
}

function buildSimulators() {
  ReactTestUtils.Simulate = {};

  var eventType;
  for (eventType in ReactEventEmitter.eventNameDispatchConfigs) {
    /**
     * @param {!Element || ReactDOMComponent} domComponentOrNode
     * @param {?object} eventData Fake event data to use in SyntheticEvent.
     */
    ReactTestUtils.Simulate[eventType] = makeSimulator(eventType);
  }
}

// Rebuild ReactTestUtils.Simulate whenever event plugins are injected
var oldInjectEventPluginOrder = EventPluginHub.injection.injectEventPluginOrder;
EventPluginHub.injection.injectEventPluginOrder = function() {
  oldInjectEventPluginOrder.apply(this, arguments);
  buildSimulators();
};
var oldInjectEventPlugins = EventPluginHub.injection.injectEventPluginsByName;
EventPluginHub.injection.injectEventPluginsByName = function() {
  oldInjectEventPlugins.apply(this, arguments);
  buildSimulators();
};

buildSimulators();

/**
 * Exports:
 *
 * - `ReactTestUtils.SimulateNative.click(Element/ReactDOMComponent)`
 * - `ReactTestUtils.SimulateNative.mouseMove(Element/ReactDOMComponent)`
 * - `ReactTestUtils.SimulateNative.mouseIn/ReactDOMComponent)`
 * - `ReactTestUtils.SimulateNative.mouseOut(Element/ReactDOMComponent)`
 * - ... (All keys from `EventConstants.topLevelTypes`)
 *
 * Note: Top level event types are a subset of the entire set of handler types
 * (which include a broader set of "synthetic" events). For example, onDragDone
 * is a synthetic event. Except when testing an event plugin or React's event
 * handling code specifically, you probably want to use ReactTestUtils.Simulate
 * to dispatch synthetic events.
 */

function makeNativeSimulator(eventType) {
  return function(domComponentOrNode, nativeEventData) {
    var fakeNativeEvent = new Event(eventType);
    mergeInto(fakeNativeEvent, nativeEventData);
    if (ReactTestUtils.isDOMComponent(domComponentOrNode)) {
      ReactTestUtils.simulateNativeEventOnDOMComponent(
        eventType,
        domComponentOrNode,
        fakeNativeEvent
      );
    } else if (!!domComponentOrNode.tagName) {
      // Will allow on actual dom nodes.
      ReactTestUtils.simulateNativeEventOnNode(
        eventType,
        domComponentOrNode,
        fakeNativeEvent
      );
    }
  };
}

var eventType;
for (eventType in topLevelTypes) {
  // Event type is stored as 'topClick' - we transform that to 'click'
  var convenienceName = eventType.indexOf('top') === 0 ?
    eventType.charAt(3).toLowerCase() + eventType.substr(4) : eventType;
  /**
   * @param {!Element || ReactDOMComponent} domComponentOrNode
   * @param {?Event} nativeEventData Fake native event to use in SyntheticEvent.
   */
  ReactTestUtils.SimulateNative[convenienceName] =
    makeNativeSimulator(eventType);
}

module.exports = ReactTestUtils;

},{"./EventConstants":25,"./EventPluginHub":27,"./EventPropagators":30,"./React":36,"./ReactComponent":41,"./ReactDOM":46,"./ReactEventEmitter":62,"./ReactMount":70,"./ReactTextComponent":87,"./ReactUpdates":91,"./SyntheticEvent":99,"./copyProperties":112,"./mergeInto":146}],87:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactTextComponent
 * @typechecks static-only
 */

"use strict";

var DOMPropertyOperations = require("./DOMPropertyOperations");
var ReactBrowserComponentMixin = require("./ReactBrowserComponentMixin");
var ReactComponent = require("./ReactComponent");

var escapeTextForBrowser = require("./escapeTextForBrowser");
var mixInto = require("./mixInto");

/**
 * Text nodes violate a couple assumptions that React makes about components:
 *
 *  - When mounting text into the DOM, adjacent text nodes are merged.
 *  - Text nodes cannot be assigned a React root ID.
 *
 * This component is used to wrap strings in elements so that they can undergo
 * the same reconciliation that is applied to elements.
 *
 * TODO: Investigate representing React components in the DOM with text nodes.
 *
 * @class ReactTextComponent
 * @extends ReactComponent
 * @internal
 */
var ReactTextComponent = function(initialText) {
  this.construct({text: initialText});
};

/**
 * Used to clone the text descriptor object before it's mounted.
 *
 * @param {object} props
 * @return {object} A new ReactTextComponent instance
 */
ReactTextComponent.ConvenienceConstructor = function(props) {
  return new ReactTextComponent(props.text);
};

mixInto(ReactTextComponent, ReactComponent.Mixin);
mixInto(ReactTextComponent, ReactBrowserComponentMixin);
mixInto(ReactTextComponent, {

  /**
   * Creates the markup for this text node. This node is not intended to have
   * any features besides containing text content.
   *
   * @param {string} rootID DOM ID of the root node.
   * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
   * @param {number} mountDepth number of components in the owner hierarchy
   * @return {string} Markup for this text node.
   * @internal
   */
  mountComponent: function(rootID, transaction, mountDepth) {
    ReactComponent.Mixin.mountComponent.call(
      this,
      rootID,
      transaction,
      mountDepth
    );

    var escapedText = escapeTextForBrowser(this.props.text);

    if (transaction.renderToStaticMarkup) {
      // Normally we'd wrap this in a `span` for the reasons stated above, but
      // since this is a situation where React won't take over (static pages),
      // we can simply return the text as it is.
      return escapedText;
    }

    return (
      '<span ' + DOMPropertyOperations.createMarkupForID(rootID) + '>' +
        escapedText +
      '</span>'
    );
  },

  /**
   * Updates this component by updating the text content.
   *
   * @param {object} nextComponent Contains the next text content.
   * @param {ReactReconcileTransaction} transaction
   * @internal
   */
  receiveComponent: function(nextComponent, transaction) {
    var nextProps = nextComponent.props;
    if (nextProps.text !== this.props.text) {
      this.props.text = nextProps.text;
      ReactComponent.BackendIDOperations.updateTextContentByID(
        this._rootNodeID,
        nextProps.text
      );
    }
  }

});

// Expose the constructor on itself and the prototype for consistency with other
// descriptors.
ReactTextComponent.type = ReactTextComponent;
ReactTextComponent.prototype.type = ReactTextComponent;

module.exports = ReactTextComponent;

},{"./DOMPropertyOperations":20,"./ReactBrowserComponentMixin":37,"./ReactComponent":41,"./escapeTextForBrowser":121,"./mixInto":147}],88:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @typechecks static-only
 * @providesModule ReactTransitionChildMapping
 */

"use strict";

var ReactChildren = require("./ReactChildren");

var ReactTransitionChildMapping = {
  /**
   * Given `this.props.children`, return an object mapping key to child. Just
   * simple syntactic sugar around ReactChildren.map().
   *
   * @param {*} children `this.props.children`
   * @return {object} Mapping of key to child
   */
  getChildMapping: function(children) {
    return ReactChildren.map(children, function(child) {
      return child;
    });
  },

  /**
   * When you're adding or removing children some may be added or removed in the
   * same render pass. We want ot show *both* since we want to simultaneously
   * animate elements in and out. This function takes a previous set of keys
   * and a new set of keys and merges them with its best guess of the correct
   * ordering. In the future we may expose some of the utilities in
   * ReactMultiChild to make this easy, but for now React itself does not
   * directly have this concept of the union of prevChildren and nextChildren
   * so we implement it here.
   *
   * @param {object} prev prev children as returned from
   * `ReactTransitionChildMapping.getChildMapping()`.
   * @param {object} next next children as returned from
   * `ReactTransitionChildMapping.getChildMapping()`.
   * @return {object} a key set that contains all keys in `prev` and all keys
   * in `next` in a reasonable order.
   */
  mergeChildMappings: function(prev, next) {
    prev = prev || {};
    next = next || {};

    function getValueForKey(key) {
      if (next.hasOwnProperty(key)) {
        return next[key];
      } else {
        return prev[key];
      }
    }

    // For each key of `next`, the list of keys to insert before that key in
    // the combined list
    var nextKeysPending = {};

    var pendingKeys = [];
    for (var prevKey in prev) {
      if (next[prevKey]) {
        if (pendingKeys.length) {
          nextKeysPending[prevKey] = pendingKeys;
          pendingKeys = [];
        }
      } else {
        pendingKeys.push(prevKey);
      }
    }

    var i;
    var childMapping = {};
    for (var nextKey in next) {
      if (nextKeysPending[nextKey]) {
        for (i = 0; i < nextKeysPending[nextKey].length; i++) {
          var pendingNextKey = nextKeysPending[nextKey][i];
          childMapping[nextKeysPending[nextKey][i]] = getValueForKey(
            pendingNextKey
          );
        }
      }
      childMapping[nextKey] = getValueForKey(nextKey);
    }

    // Finally, add the keys which didn't appear before any key in `next`
    for (i = 0; i < pendingKeys.length; i++) {
      childMapping[pendingKeys[i]] = getValueForKey(pendingKeys[i]);
    }

    return childMapping;
  }
};

module.exports = ReactTransitionChildMapping;

},{"./ReactChildren":40}],89:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactTransitionEvents
 */

"use strict";

var ExecutionEnvironment = require("./ExecutionEnvironment");

var EVENT_NAME_MAP = {
  transitionend: {
    'transition': 'transitionend',
    'WebkitTransition': 'webkitTransitionEnd',
    'MozTransition': 'mozTransitionEnd',
    'OTransition': 'oTransitionEnd',
    'msTransition': 'MSTransitionEnd'
  },

  animationend: {
    'animation': 'animationend',
    'WebkitAnimation': 'webkitAnimationEnd',
    'MozAnimation': 'mozAnimationEnd',
    'OAnimation': 'oAnimationEnd',
    'msAnimation': 'MSAnimationEnd'
  }
};

var endEvents = [];

function detectEvents() {
  var testEl = document.createElement('div');
  var style = testEl.style;
  for (var baseEventName in EVENT_NAME_MAP) {
    var baseEvents = EVENT_NAME_MAP[baseEventName];
    for (var styleName in baseEvents) {
      if (styleName in style) {
        endEvents.push(baseEvents[styleName]);
        break;
      }
    }
  }
}

if (ExecutionEnvironment.canUseDOM) {
  detectEvents();
}

// We use the raw {add|remove}EventListener() call because EventListener
// does not know how to remove event listeners and we really should
// clean up. Also, these events are not triggered in older browsers
// so we should be A-OK here.

function addEventListener(node, eventName, eventListener) {
  node.addEventListener(eventName, eventListener, false);
}

function removeEventListener(node, eventName, eventListener) {
  node.removeEventListener(eventName, eventListener, false);
}

var ReactTransitionEvents = {
  addEndEventListener: function(node, eventListener) {
    if (endEvents.length === 0) {
      // If CSS transitions are not supported, trigger an "end animation"
      // event immediately.
      window.setTimeout(eventListener, 0);
      return;
    }
    endEvents.forEach(function(endEvent) {
      addEventListener(node, endEvent, eventListener);
    });
  },

  removeEndEventListener: function(node, eventListener) {
    if (endEvents.length === 0) {
      return;
    }
    endEvents.forEach(function(endEvent) {
      removeEventListener(node, endEvent, eventListener);
    });
  }
};

module.exports = ReactTransitionEvents;

},{"./ExecutionEnvironment":31}],90:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactTransitionGroup
 */

"use strict";

var React = require("./React");
var ReactTransitionChildMapping = require("./ReactTransitionChildMapping");

var cloneWithProps = require("./cloneWithProps");
var emptyFunction = require("./emptyFunction");
var merge = require("./merge");

var ReactTransitionGroup = React.createClass({

  propTypes: {
    component: React.PropTypes.func,
    childFactory: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      component: React.DOM.span,
      childFactory: emptyFunction.thatReturnsArgument
    };
  },

  getInitialState: function() {
    return {
      children: ReactTransitionChildMapping.getChildMapping(this.props.children)
    };
  },

  componentWillReceiveProps: function(nextProps) {
    var nextChildMapping = ReactTransitionChildMapping.getChildMapping(
      nextProps.children
    );
    var prevChildMapping = this.state.children;

    this.setState({
      children: ReactTransitionChildMapping.mergeChildMappings(
        prevChildMapping,
        nextChildMapping
      )
    });

    var key;

    for (key in nextChildMapping) {
      if (!prevChildMapping.hasOwnProperty(key) &&
        !this.currentlyTransitioningKeys[key]) {
        this.keysToEnter.push(key);
      }
    }

    for (key in prevChildMapping) {
      if (!nextChildMapping.hasOwnProperty(key) &&
        !this.currentlyTransitioningKeys[key]) {
        this.keysToLeave.push(key);
      }
    }

    // If we want to someday check for reordering, we could do it here.
  },

  componentWillMount: function() {
    this.currentlyTransitioningKeys = {};
    this.keysToEnter = [];
    this.keysToLeave = [];
  },

  componentDidUpdate: function() {
    var keysToEnter = this.keysToEnter;
    this.keysToEnter = [];
    keysToEnter.forEach(this.performEnter);

    var keysToLeave = this.keysToLeave;
    this.keysToLeave = [];
    keysToLeave.forEach(this.performLeave);
  },

  performEnter: function(key) {
    this.currentlyTransitioningKeys[key] = true;

    var component = this.refs[key];

    if (component.componentWillEnter) {
      component.componentWillEnter(
        this._handleDoneEntering.bind(this, key)
      );
    } else {
      this._handleDoneEntering(key);
    }
  },

  _handleDoneEntering: function(key) {
    var component = this.refs[key];
    if (component.componentDidEnter) {
      component.componentDidEnter();
    }

    delete this.currentlyTransitioningKeys[key];

    var currentChildMapping = ReactTransitionChildMapping.getChildMapping(
      this.props.children
    );

    if (!currentChildMapping.hasOwnProperty(key)) {
      // This was removed before it had fully entered. Remove it.
      this.performLeave(key);
    }
  },

  performLeave: function(key) {
    this.currentlyTransitioningKeys[key] = true;

    var component = this.refs[key];
    if (component.componentWillLeave) {
      component.componentWillLeave(this._handleDoneLeaving.bind(this, key));
    } else {
      // Note that this is somewhat dangerous b/c it calls setState()
      // again, effectively mutating the component before all the work
      // is done.
      this._handleDoneLeaving(key);
    }
  },

  _handleDoneLeaving: function(key) {
    var component = this.refs[key];

    if (component.componentDidLeave) {
      component.componentDidLeave();
    }

    delete this.currentlyTransitioningKeys[key];

    var currentChildMapping = ReactTransitionChildMapping.getChildMapping(
      this.props.children
    );

    if (currentChildMapping.hasOwnProperty(key)) {
      // This entered again before it fully left. Add it again.
      this.performEnter(key);
    } else {
      var newChildren = merge(this.state.children);
      delete newChildren[key];
      this.setState({children: newChildren});
    }
  },

  render: function() {
    // TODO: we could get rid of the need for the wrapper node
    // by cloning a single child
    var childrenToRender = {};
    for (var key in this.state.children) {
      var child = this.state.children[key];
      if (child) {
        // You may need to apply reactive updates to a child as it is leaving.
        // The normal React way to do it won't work since the child will have
        // already been removed. In case you need this behavior you can provide
        // a childFactory function to wrap every child, even the ones that are
        // leaving.
        childrenToRender[key] = cloneWithProps(
          this.props.childFactory(child),
          {ref: key}
        );
      }
    }
    return this.transferPropsTo(this.props.component(null, childrenToRender));
  }
});

module.exports = ReactTransitionGroup;

},{"./React":36,"./ReactTransitionChildMapping":88,"./cloneWithProps":110,"./emptyFunction":119,"./merge":144}],91:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactUpdates
 */

"use strict";

var ReactPerf = require("./ReactPerf");

var invariant = require("./invariant");

var dirtyComponents = [];

var batchingStrategy = null;

function ensureBatchingStrategy() {
  ("production" !== process.env.NODE_ENV ? invariant(batchingStrategy, 'ReactUpdates: must inject a batching strategy') : invariant(batchingStrategy));
}

function batchedUpdates(callback, param) {
  ensureBatchingStrategy();
  batchingStrategy.batchedUpdates(callback, param);
}

/**
 * Array comparator for ReactComponents by owner depth
 *
 * @param {ReactComponent} c1 first component you're comparing
 * @param {ReactComponent} c2 second component you're comparing
 * @return {number} Return value usable by Array.prototype.sort().
 */
function mountDepthComparator(c1, c2) {
  return c1._mountDepth - c2._mountDepth;
}

function runBatchedUpdates() {
  // Since reconciling a component higher in the owner hierarchy usually (not
  // always -- see shouldComponentUpdate()) will reconcile children, reconcile
  // them before their children by sorting the array.

  dirtyComponents.sort(mountDepthComparator);

  for (var i = 0; i < dirtyComponents.length; i++) {
    // If a component is unmounted before pending changes apply, ignore them
    // TODO: Queue unmounts in the same list to avoid this happening at all
    var component = dirtyComponents[i];
    if (component.isMounted()) {
      // If performUpdateIfNecessary happens to enqueue any new updates, we
      // shouldn't execute the callbacks until the next render happens, so
      // stash the callbacks first
      var callbacks = component._pendingCallbacks;
      component._pendingCallbacks = null;
      component.performUpdateIfNecessary();
      if (callbacks) {
        for (var j = 0; j < callbacks.length; j++) {
          callbacks[j].call(component);
        }
      }
    }
  }
}

function clearDirtyComponents() {
  dirtyComponents.length = 0;
}

var flushBatchedUpdates = ReactPerf.measure(
  'ReactUpdates',
  'flushBatchedUpdates',
  function() {
    // Run these in separate functions so the JIT can optimize
    try {
      runBatchedUpdates();
    } finally {
      clearDirtyComponents();
    }
  }
);

/**
 * Mark a component as needing a rerender, adding an optional callback to a
 * list of functions which will be executed once the rerender occurs.
 */
function enqueueUpdate(component, callback) {
  ("production" !== process.env.NODE_ENV ? invariant(
    !callback || typeof callback === "function",
    'enqueueUpdate(...): You called `setProps`, `replaceProps`, ' +
    '`setState`, `replaceState`, or `forceUpdate` with a callback that ' +
    'isn\'t callable.'
  ) : invariant(!callback || typeof callback === "function"));
  ensureBatchingStrategy();

  if (!batchingStrategy.isBatchingUpdates) {
    component.performUpdateIfNecessary();
    callback && callback.call(component);
    return;
  }

  dirtyComponents.push(component);

  if (callback) {
    if (component._pendingCallbacks) {
      component._pendingCallbacks.push(callback);
    } else {
      component._pendingCallbacks = [callback];
    }
  }
}

var ReactUpdatesInjection = {
  injectBatchingStrategy: function(_batchingStrategy) {
    ("production" !== process.env.NODE_ENV ? invariant(
      _batchingStrategy,
      'ReactUpdates: must provide a batching strategy'
    ) : invariant(_batchingStrategy));
    ("production" !== process.env.NODE_ENV ? invariant(
      typeof _batchingStrategy.batchedUpdates === 'function',
      'ReactUpdates: must provide a batchedUpdates() function'
    ) : invariant(typeof _batchingStrategy.batchedUpdates === 'function'));
    ("production" !== process.env.NODE_ENV ? invariant(
      typeof _batchingStrategy.isBatchingUpdates === 'boolean',
      'ReactUpdates: must provide an isBatchingUpdates boolean attribute'
    ) : invariant(typeof _batchingStrategy.isBatchingUpdates === 'boolean'));
    batchingStrategy = _batchingStrategy;
  }
};

var ReactUpdates = {
  batchedUpdates: batchedUpdates,
  enqueueUpdate: enqueueUpdate,
  flushBatchedUpdates: flushBatchedUpdates,
  injection: ReactUpdatesInjection
};

module.exports = ReactUpdates;

}).call(this,require("qvMYcC"))
},{"./ReactPerf":75,"./invariant":135,"qvMYcC":161}],92:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactWithAddons
 */

/**
 * This module exists purely in the open source project, and is meant as a way
 * to create a separate standalone build of React. This build has "addons", or
 * functionality we've built and think might be useful but doesn't have a good
 * place to live inside React core.
 */

"use strict";

var LinkedStateMixin = require("./LinkedStateMixin");
var React = require("./React");
var ReactCSSTransitionGroup = require("./ReactCSSTransitionGroup");
var ReactTransitionGroup = require("./ReactTransitionGroup");
var ReactCSSTransitionGroup = require("./ReactCSSTransitionGroup");

var cx = require("./cx");
var cloneWithProps = require("./cloneWithProps");
var update = require("./update");

React.addons = {
  LinkedStateMixin: LinkedStateMixin,
  CSSTransitionGroup: ReactCSSTransitionGroup,
  TransitionGroup: ReactTransitionGroup,

  classSet: cx,
  cloneWithProps: cloneWithProps,
  update: update
};

if ("production" !== process.env.NODE_ENV) {
  React.addons.TestUtils = require("./ReactTestUtils");
}

module.exports = React;


}).call(this,require("qvMYcC"))
},{"./LinkedStateMixin":32,"./React":36,"./ReactCSSTransitionGroup":38,"./ReactTestUtils":86,"./ReactTransitionGroup":90,"./cloneWithProps":110,"./cx":117,"./update":157,"qvMYcC":161}],93:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule SelectEventPlugin
 */

"use strict";

var EventConstants = require("./EventConstants");
var EventPropagators = require("./EventPropagators");
var ReactInputSelection = require("./ReactInputSelection");
var SyntheticEvent = require("./SyntheticEvent");

var getActiveElement = require("./getActiveElement");
var isTextInputElement = require("./isTextInputElement");
var keyOf = require("./keyOf");
var shallowEqual = require("./shallowEqual");

var topLevelTypes = EventConstants.topLevelTypes;

var eventTypes = {
  select: {
    phasedRegistrationNames: {
      bubbled: keyOf({onSelect: null}),
      captured: keyOf({onSelectCapture: null})
    },
    dependencies: [
      topLevelTypes.topBlur,
      topLevelTypes.topContextMenu,
      topLevelTypes.topFocus,
      topLevelTypes.topKeyDown,
      topLevelTypes.topMouseDown,
      topLevelTypes.topMouseUp,
      topLevelTypes.topSelectionChange
    ]
  }
};

var activeElement = null;
var activeElementID = null;
var lastSelection = null;
var mouseDown = false;

/**
 * Get an object which is a unique representation of the current selection.
 *
 * The return value will not be consistent across nodes or browsers, but
 * two identical selections on the same node will return identical objects.
 *
 * @param {DOMElement} node
 * @param {object}
 */
function getSelection(node) {
  if ('selectionStart' in node &&
      ReactInputSelection.hasSelectionCapabilities(node)) {
    return {
      start: node.selectionStart,
      end: node.selectionEnd
    };
  } else if (document.selection) {
    var range = document.selection.createRange();
    return {
      parentElement: range.parentElement(),
      text: range.text,
      top: range.boundingTop,
      left: range.boundingLeft
    };
  } else {
    var selection = window.getSelection();
    return {
      anchorNode: selection.anchorNode,
      anchorOffset: selection.anchorOffset,
      focusNode: selection.focusNode,
      focusOffset: selection.focusOffset
    };
  }
}

/**
 * Poll selection to see whether it's changed.
 *
 * @param {object} nativeEvent
 * @return {?SyntheticEvent}
 */
function constructSelectEvent(nativeEvent) {
  // Ensure we have the right element, and that the user is not dragging a
  // selection (this matches native `select` event behavior). In HTML5, select
  // fires only on input and textarea thus if there's no focused element we
  // won't dispatch.
  if (mouseDown ||
      activeElement == null ||
      activeElement != getActiveElement()) {
    return;
  }

  // Only fire when selection has actually changed.
  var currentSelection = getSelection(activeElement);
  if (!lastSelection || !shallowEqual(lastSelection, currentSelection)) {
    lastSelection = currentSelection;

    var syntheticEvent = SyntheticEvent.getPooled(
      eventTypes.select,
      activeElementID,
      nativeEvent
    );

    syntheticEvent.type = 'select';
    syntheticEvent.target = activeElement;

    EventPropagators.accumulateTwoPhaseDispatches(syntheticEvent);

    return syntheticEvent;
  }
}

/**
 * This plugin creates an `onSelect` event that normalizes select events
 * across form elements.
 *
 * Supported elements are:
 * - input (see `isTextInputElement`)
 * - textarea
 * - contentEditable
 *
 * This differs from native browser implementations in the following ways:
 * - Fires on contentEditable fields as well as inputs.
 * - Fires for collapsed selection.
 * - Fires after user input.
 */
var SelectEventPlugin = {

  eventTypes: eventTypes,

  /**
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {DOMEventTarget} topLevelTarget The listening component root node.
   * @param {string} topLevelTargetID ID of `topLevelTarget`.
   * @param {object} nativeEvent Native browser event.
   * @return {*} An accumulation of synthetic events.
   * @see {EventPluginHub.extractEvents}
   */
  extractEvents: function(
      topLevelType,
      topLevelTarget,
      topLevelTargetID,
      nativeEvent) {

    switch (topLevelType) {
      // Track the input node that has focus.
      case topLevelTypes.topFocus:
        if (isTextInputElement(topLevelTarget) ||
            topLevelTarget.contentEditable === 'true') {
          activeElement = topLevelTarget;
          activeElementID = topLevelTargetID;
          lastSelection = null;
        }
        break;
      case topLevelTypes.topBlur:
        activeElement = null;
        activeElementID = null;
        lastSelection = null;
        break;

      // Don't fire the event while the user is dragging. This matches the
      // semantics of the native select event.
      case topLevelTypes.topMouseDown:
        mouseDown = true;
        break;
      case topLevelTypes.topContextMenu:
      case topLevelTypes.topMouseUp:
        mouseDown = false;
        return constructSelectEvent(nativeEvent);

      // Chrome and IE fire non-standard event when selection is changed (and
      // sometimes when it hasn't).
      // Firefox doesn't support selectionchange, so check selection status
      // after each key entry. The selection changes after keydown and before
      // keyup, but we check on keydown as well in the case of holding down a
      // key, when multiple keydown events are fired but only one keyup is.
      case topLevelTypes.topSelectionChange:
      case topLevelTypes.topKeyDown:
      case topLevelTypes.topKeyUp:
        return constructSelectEvent(nativeEvent);
    }
  }
};

module.exports = SelectEventPlugin;

},{"./EventConstants":25,"./EventPropagators":30,"./ReactInputSelection":66,"./SyntheticEvent":99,"./getActiveElement":125,"./isTextInputElement":138,"./keyOf":142,"./shallowEqual":153}],94:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ServerReactRootIndex
 * @typechecks
 */

"use strict";

/**
 * Size of the reactRoot ID space. We generate random numbers for React root
 * IDs and if there's a collision the events and DOM update system will
 * get confused. In the future we need a way to generate GUIDs but for
 * now this will work on a smaller scale.
 */
var GLOBAL_MOUNT_POINT_MAX = Math.pow(2, 53);

var ServerReactRootIndex = {
  createReactRootIndex: function() {
    return Math.ceil(Math.random() * GLOBAL_MOUNT_POINT_MAX);
  }
};

module.exports = ServerReactRootIndex;

},{}],95:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule SimpleEventPlugin
 */

"use strict";

var EventConstants = require("./EventConstants");
var EventPluginUtils = require("./EventPluginUtils");
var EventPropagators = require("./EventPropagators");
var SyntheticClipboardEvent = require("./SyntheticClipboardEvent");
var SyntheticEvent = require("./SyntheticEvent");
var SyntheticFocusEvent = require("./SyntheticFocusEvent");
var SyntheticKeyboardEvent = require("./SyntheticKeyboardEvent");
var SyntheticMouseEvent = require("./SyntheticMouseEvent");
var SyntheticDragEvent = require("./SyntheticDragEvent");
var SyntheticTouchEvent = require("./SyntheticTouchEvent");
var SyntheticUIEvent = require("./SyntheticUIEvent");
var SyntheticWheelEvent = require("./SyntheticWheelEvent");

var invariant = require("./invariant");
var keyOf = require("./keyOf");

var topLevelTypes = EventConstants.topLevelTypes;

var eventTypes = {
  blur: {
    phasedRegistrationNames: {
      bubbled: keyOf({onBlur: true}),
      captured: keyOf({onBlurCapture: true})
    }
  },
  click: {
    phasedRegistrationNames: {
      bubbled: keyOf({onClick: true}),
      captured: keyOf({onClickCapture: true})
    }
  },
  contextMenu: {
    phasedRegistrationNames: {
      bubbled: keyOf({onContextMenu: true}),
      captured: keyOf({onContextMenuCapture: true})
    }
  },
  copy: {
    phasedRegistrationNames: {
      bubbled: keyOf({onCopy: true}),
      captured: keyOf({onCopyCapture: true})
    }
  },
  cut: {
    phasedRegistrationNames: {
      bubbled: keyOf({onCut: true}),
      captured: keyOf({onCutCapture: true})
    }
  },
  doubleClick: {
    phasedRegistrationNames: {
      bubbled: keyOf({onDoubleClick: true}),
      captured: keyOf({onDoubleClickCapture: true})
    }
  },
  drag: {
    phasedRegistrationNames: {
      bubbled: keyOf({onDrag: true}),
      captured: keyOf({onDragCapture: true})
    }
  },
  dragEnd: {
    phasedRegistrationNames: {
      bubbled: keyOf({onDragEnd: true}),
      captured: keyOf({onDragEndCapture: true})
    }
  },
  dragEnter: {
    phasedRegistrationNames: {
      bubbled: keyOf({onDragEnter: true}),
      captured: keyOf({onDragEnterCapture: true})
    }
  },
  dragExit: {
    phasedRegistrationNames: {
      bubbled: keyOf({onDragExit: true}),
      captured: keyOf({onDragExitCapture: true})
    }
  },
  dragLeave: {
    phasedRegistrationNames: {
      bubbled: keyOf({onDragLeave: true}),
      captured: keyOf({onDragLeaveCapture: true})
    }
  },
  dragOver: {
    phasedRegistrationNames: {
      bubbled: keyOf({onDragOver: true}),
      captured: keyOf({onDragOverCapture: true})
    }
  },
  dragStart: {
    phasedRegistrationNames: {
      bubbled: keyOf({onDragStart: true}),
      captured: keyOf({onDragStartCapture: true})
    }
  },
  drop: {
    phasedRegistrationNames: {
      bubbled: keyOf({onDrop: true}),
      captured: keyOf({onDropCapture: true})
    }
  },
  focus: {
    phasedRegistrationNames: {
      bubbled: keyOf({onFocus: true}),
      captured: keyOf({onFocusCapture: true})
    }
  },
  input: {
    phasedRegistrationNames: {
      bubbled: keyOf({onInput: true}),
      captured: keyOf({onInputCapture: true})
    }
  },
  keyDown: {
    phasedRegistrationNames: {
      bubbled: keyOf({onKeyDown: true}),
      captured: keyOf({onKeyDownCapture: true})
    }
  },
  keyPress: {
    phasedRegistrationNames: {
      bubbled: keyOf({onKeyPress: true}),
      captured: keyOf({onKeyPressCapture: true})
    }
  },
  keyUp: {
    phasedRegistrationNames: {
      bubbled: keyOf({onKeyUp: true}),
      captured: keyOf({onKeyUpCapture: true})
    }
  },
  load: {
    phasedRegistrationNames: {
      bubbled: keyOf({onLoad: true}),
      captured: keyOf({onLoadCapture: true})
    }
  },
  error: {
    phasedRegistrationNames: {
      bubbled: keyOf({onError: true}),
      captured: keyOf({onErrorCapture: true})
    }
  },
  // Note: We do not allow listening to mouseOver events. Instead, use the
  // onMouseEnter/onMouseLeave created by `EnterLeaveEventPlugin`.
  mouseDown: {
    phasedRegistrationNames: {
      bubbled: keyOf({onMouseDown: true}),
      captured: keyOf({onMouseDownCapture: true})
    }
  },
  mouseMove: {
    phasedRegistrationNames: {
      bubbled: keyOf({onMouseMove: true}),
      captured: keyOf({onMouseMoveCapture: true})
    }
  },
  mouseOut: {
    phasedRegistrationNames: {
      bubbled: keyOf({onMouseOut: true}),
      captured: keyOf({onMouseOutCapture: true})
    }
  },
  mouseOver: {
    phasedRegistrationNames: {
      bubbled: keyOf({onMouseOver: true}),
      captured: keyOf({onMouseOverCapture: true})
    }
  },
  mouseUp: {
    phasedRegistrationNames: {
      bubbled: keyOf({onMouseUp: true}),
      captured: keyOf({onMouseUpCapture: true})
    }
  },
  paste: {
    phasedRegistrationNames: {
      bubbled: keyOf({onPaste: true}),
      captured: keyOf({onPasteCapture: true})
    }
  },
  reset: {
    phasedRegistrationNames: {
      bubbled: keyOf({onReset: true}),
      captured: keyOf({onResetCapture: true})
    }
  },
  scroll: {
    phasedRegistrationNames: {
      bubbled: keyOf({onScroll: true}),
      captured: keyOf({onScrollCapture: true})
    }
  },
  submit: {
    phasedRegistrationNames: {
      bubbled: keyOf({onSubmit: true}),
      captured: keyOf({onSubmitCapture: true})
    }
  },
  touchCancel: {
    phasedRegistrationNames: {
      bubbled: keyOf({onTouchCancel: true}),
      captured: keyOf({onTouchCancelCapture: true})
    }
  },
  touchEnd: {
    phasedRegistrationNames: {
      bubbled: keyOf({onTouchEnd: true}),
      captured: keyOf({onTouchEndCapture: true})
    }
  },
  touchMove: {
    phasedRegistrationNames: {
      bubbled: keyOf({onTouchMove: true}),
      captured: keyOf({onTouchMoveCapture: true})
    }
  },
  touchStart: {
    phasedRegistrationNames: {
      bubbled: keyOf({onTouchStart: true}),
      captured: keyOf({onTouchStartCapture: true})
    }
  },
  wheel: {
    phasedRegistrationNames: {
      bubbled: keyOf({onWheel: true}),
      captured: keyOf({onWheelCapture: true})
    }
  }
};

var topLevelEventsToDispatchConfig = {
  topBlur:        eventTypes.blur,
  topClick:       eventTypes.click,
  topContextMenu: eventTypes.contextMenu,
  topCopy:        eventTypes.copy,
  topCut:         eventTypes.cut,
  topDoubleClick: eventTypes.doubleClick,
  topDrag:        eventTypes.drag,
  topDragEnd:     eventTypes.dragEnd,
  topDragEnter:   eventTypes.dragEnter,
  topDragExit:    eventTypes.dragExit,
  topDragLeave:   eventTypes.dragLeave,
  topDragOver:    eventTypes.dragOver,
  topDragStart:   eventTypes.dragStart,
  topDrop:        eventTypes.drop,
  topError:       eventTypes.error,
  topFocus:       eventTypes.focus,
  topInput:       eventTypes.input,
  topKeyDown:     eventTypes.keyDown,
  topKeyPress:    eventTypes.keyPress,
  topKeyUp:       eventTypes.keyUp,
  topLoad:        eventTypes.load,
  topMouseDown:   eventTypes.mouseDown,
  topMouseMove:   eventTypes.mouseMove,
  topMouseOut:    eventTypes.mouseOut,
  topMouseOver:   eventTypes.mouseOver,
  topMouseUp:     eventTypes.mouseUp,
  topPaste:       eventTypes.paste,
  topReset:       eventTypes.reset,
  topScroll:      eventTypes.scroll,
  topSubmit:      eventTypes.submit,
  topTouchCancel: eventTypes.touchCancel,
  topTouchEnd:    eventTypes.touchEnd,
  topTouchMove:   eventTypes.touchMove,
  topTouchStart:  eventTypes.touchStart,
  topWheel:       eventTypes.wheel
};

for (var topLevelType in topLevelEventsToDispatchConfig) {
  topLevelEventsToDispatchConfig[topLevelType].dependencies = [topLevelType];
}

var SimpleEventPlugin = {

  eventTypes: eventTypes,

  /**
   * Same as the default implementation, except cancels the event when return
   * value is false.
   *
   * @param {object} Event to be dispatched.
   * @param {function} Application-level callback.
   * @param {string} domID DOM ID to pass to the callback.
   */
  executeDispatch: function(event, listener, domID) {
    var returnValue = EventPluginUtils.executeDispatch(event, listener, domID);
    if (returnValue === false) {
      event.stopPropagation();
      event.preventDefault();
    }
  },

  /**
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {DOMEventTarget} topLevelTarget The listening component root node.
   * @param {string} topLevelTargetID ID of `topLevelTarget`.
   * @param {object} nativeEvent Native browser event.
   * @return {*} An accumulation of synthetic events.
   * @see {EventPluginHub.extractEvents}
   */
  extractEvents: function(
      topLevelType,
      topLevelTarget,
      topLevelTargetID,
      nativeEvent) {
    var dispatchConfig = topLevelEventsToDispatchConfig[topLevelType];
    if (!dispatchConfig) {
      return null;
    }
    var EventConstructor;
    switch (topLevelType) {
      case topLevelTypes.topInput:
      case topLevelTypes.topLoad:
      case topLevelTypes.topError:
      case topLevelTypes.topReset:
      case topLevelTypes.topSubmit:
        // HTML Events
        // @see http://www.w3.org/TR/html5/index.html#events-0
        EventConstructor = SyntheticEvent;
        break;
      case topLevelTypes.topKeyDown:
      case topLevelTypes.topKeyPress:
      case topLevelTypes.topKeyUp:
        EventConstructor = SyntheticKeyboardEvent;
        break;
      case topLevelTypes.topBlur:
      case topLevelTypes.topFocus:
        EventConstructor = SyntheticFocusEvent;
        break;
      case topLevelTypes.topClick:
        // Firefox creates a click event on right mouse clicks. This removes the
        // unwanted click events.
        if (nativeEvent.button === 2) {
          return null;
        }
        /* falls through */
      case topLevelTypes.topContextMenu:
      case topLevelTypes.topDoubleClick:
      case topLevelTypes.topMouseDown:
      case topLevelTypes.topMouseMove:
      case topLevelTypes.topMouseOut:
      case topLevelTypes.topMouseOver:
      case topLevelTypes.topMouseUp:
        EventConstructor = SyntheticMouseEvent;
        break;
      case topLevelTypes.topDrag:
      case topLevelTypes.topDragEnd:
      case topLevelTypes.topDragEnter:
      case topLevelTypes.topDragExit:
      case topLevelTypes.topDragLeave:
      case topLevelTypes.topDragOver:
      case topLevelTypes.topDragStart:
      case topLevelTypes.topDrop:
        EventConstructor = SyntheticDragEvent;
        break;
      case topLevelTypes.topTouchCancel:
      case topLevelTypes.topTouchEnd:
      case topLevelTypes.topTouchMove:
      case topLevelTypes.topTouchStart:
        EventConstructor = SyntheticTouchEvent;
        break;
      case topLevelTypes.topScroll:
        EventConstructor = SyntheticUIEvent;
        break;
      case topLevelTypes.topWheel:
        EventConstructor = SyntheticWheelEvent;
        break;
      case topLevelTypes.topCopy:
      case topLevelTypes.topCut:
      case topLevelTypes.topPaste:
        EventConstructor = SyntheticClipboardEvent;
        break;
    }
    ("production" !== process.env.NODE_ENV ? invariant(
      EventConstructor,
      'SimpleEventPlugin: Unhandled event type, `%s`.',
      topLevelType
    ) : invariant(EventConstructor));
    var event = EventConstructor.getPooled(
      dispatchConfig,
      topLevelTargetID,
      nativeEvent
    );
    EventPropagators.accumulateTwoPhaseDispatches(event);
    return event;
  }

};

module.exports = SimpleEventPlugin;

}).call(this,require("qvMYcC"))
},{"./EventConstants":25,"./EventPluginUtils":29,"./EventPropagators":30,"./SyntheticClipboardEvent":96,"./SyntheticDragEvent":98,"./SyntheticEvent":99,"./SyntheticFocusEvent":100,"./SyntheticKeyboardEvent":101,"./SyntheticMouseEvent":102,"./SyntheticTouchEvent":103,"./SyntheticUIEvent":104,"./SyntheticWheelEvent":105,"./invariant":135,"./keyOf":142,"qvMYcC":161}],96:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule SyntheticClipboardEvent
 * @typechecks static-only
 */

"use strict";

var SyntheticEvent = require("./SyntheticEvent");

/**
 * @interface Event
 * @see http://www.w3.org/TR/clipboard-apis/
 */
var ClipboardEventInterface = {
  clipboardData: function(event) {
    return (
      'clipboardData' in event ?
        event.clipboardData :
        window.clipboardData
    );
  }
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticClipboardEvent(dispatchConfig, dispatchMarker, nativeEvent) {
  SyntheticEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent);
}

SyntheticEvent.augmentClass(SyntheticClipboardEvent, ClipboardEventInterface);

module.exports = SyntheticClipboardEvent;


},{"./SyntheticEvent":99}],97:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule SyntheticCompositionEvent
 * @typechecks static-only
 */

"use strict";

var SyntheticEvent = require("./SyntheticEvent");

/**
 * @interface Event
 * @see http://www.w3.org/TR/DOM-Level-3-Events/#events-compositionevents
 */
var CompositionEventInterface = {
  data: null
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticCompositionEvent(
  dispatchConfig,
  dispatchMarker,
  nativeEvent) {
  SyntheticEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent);
}

SyntheticEvent.augmentClass(
  SyntheticCompositionEvent,
  CompositionEventInterface
);

module.exports = SyntheticCompositionEvent;


},{"./SyntheticEvent":99}],98:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule SyntheticDragEvent
 * @typechecks static-only
 */

"use strict";

var SyntheticMouseEvent = require("./SyntheticMouseEvent");

/**
 * @interface DragEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var DragEventInterface = {
  dataTransfer: null
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticDragEvent(dispatchConfig, dispatchMarker, nativeEvent) {
  SyntheticMouseEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent);
}

SyntheticMouseEvent.augmentClass(SyntheticDragEvent, DragEventInterface);

module.exports = SyntheticDragEvent;

},{"./SyntheticMouseEvent":102}],99:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule SyntheticEvent
 * @typechecks static-only
 */

"use strict";

var PooledClass = require("./PooledClass");

var emptyFunction = require("./emptyFunction");
var getEventTarget = require("./getEventTarget");
var merge = require("./merge");
var mergeInto = require("./mergeInto");

/**
 * @interface Event
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var EventInterface = {
  type: null,
  target: getEventTarget,
  // currentTarget is set when dispatching; no use in copying it here
  currentTarget: emptyFunction.thatReturnsNull,
  eventPhase: null,
  bubbles: null,
  cancelable: null,
  timeStamp: function(event) {
    return event.timeStamp || Date.now();
  },
  defaultPrevented: null,
  isTrusted: null
};

/**
 * Synthetic events are dispatched by event plugins, typically in response to a
 * top-level event delegation handler.
 *
 * These systems should generally use pooling to reduce the frequency of garbage
 * collection. The system should check `isPersistent` to determine whether the
 * event should be released into the pool after being dispatched. Users that
 * need a persisted event should invoke `persist`.
 *
 * Synthetic events (and subclasses) implement the DOM Level 3 Events API by
 * normalizing browser quirks. Subclasses do not necessarily have to implement a
 * DOM interface; custom application-specific events can also subclass this.
 *
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 */
function SyntheticEvent(dispatchConfig, dispatchMarker, nativeEvent) {
  this.dispatchConfig = dispatchConfig;
  this.dispatchMarker = dispatchMarker;
  this.nativeEvent = nativeEvent;

  var Interface = this.constructor.Interface;
  for (var propName in Interface) {
    if (!Interface.hasOwnProperty(propName)) {
      continue;
    }
    var normalize = Interface[propName];
    if (normalize) {
      this[propName] = normalize(nativeEvent);
    } else {
      this[propName] = nativeEvent[propName];
    }
  }

  var defaultPrevented = nativeEvent.defaultPrevented != null ?
    nativeEvent.defaultPrevented :
    nativeEvent.returnValue === false;
  if (defaultPrevented) {
    this.isDefaultPrevented = emptyFunction.thatReturnsTrue;
  } else {
    this.isDefaultPrevented = emptyFunction.thatReturnsFalse;
  }
  this.isPropagationStopped = emptyFunction.thatReturnsFalse;
}

mergeInto(SyntheticEvent.prototype, {

  preventDefault: function() {
    this.defaultPrevented = true;
    var event = this.nativeEvent;
    event.preventDefault ? event.preventDefault() : event.returnValue = false;
    this.isDefaultPrevented = emptyFunction.thatReturnsTrue;
  },

  stopPropagation: function() {
    var event = this.nativeEvent;
    event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
    this.isPropagationStopped = emptyFunction.thatReturnsTrue;
  },

  /**
   * We release all dispatched `SyntheticEvent`s after each event loop, adding
   * them back into the pool. This allows a way to hold onto a reference that
   * won't be added back into the pool.
   */
  persist: function() {
    this.isPersistent = emptyFunction.thatReturnsTrue;
  },

  /**
   * Checks if this event should be released back into the pool.
   *
   * @return {boolean} True if this should not be released, false otherwise.
   */
  isPersistent: emptyFunction.thatReturnsFalse,

  /**
   * `PooledClass` looks for `destructor` on each instance it releases.
   */
  destructor: function() {
    var Interface = this.constructor.Interface;
    for (var propName in Interface) {
      this[propName] = null;
    }
    this.dispatchConfig = null;
    this.dispatchMarker = null;
    this.nativeEvent = null;
  }

});

SyntheticEvent.Interface = EventInterface;

/**
 * Helper to reduce boilerplate when creating subclasses.
 *
 * @param {function} Class
 * @param {?object} Interface
 */
SyntheticEvent.augmentClass = function(Class, Interface) {
  var Super = this;

  var prototype = Object.create(Super.prototype);
  mergeInto(prototype, Class.prototype);
  Class.prototype = prototype;
  Class.prototype.constructor = Class;

  Class.Interface = merge(Super.Interface, Interface);
  Class.augmentClass = Super.augmentClass;

  PooledClass.addPoolingTo(Class, PooledClass.threeArgumentPooler);
};

PooledClass.addPoolingTo(SyntheticEvent, PooledClass.threeArgumentPooler);

module.exports = SyntheticEvent;

},{"./PooledClass":35,"./emptyFunction":119,"./getEventTarget":127,"./merge":144,"./mergeInto":146}],100:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule SyntheticFocusEvent
 * @typechecks static-only
 */

"use strict";

var SyntheticUIEvent = require("./SyntheticUIEvent");

/**
 * @interface FocusEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var FocusEventInterface = {
  relatedTarget: null
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticFocusEvent(dispatchConfig, dispatchMarker, nativeEvent) {
  SyntheticUIEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent);
}

SyntheticUIEvent.augmentClass(SyntheticFocusEvent, FocusEventInterface);

module.exports = SyntheticFocusEvent;

},{"./SyntheticUIEvent":104}],101:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule SyntheticKeyboardEvent
 * @typechecks static-only
 */

"use strict";

var SyntheticUIEvent = require("./SyntheticUIEvent");

var getEventKey = require("./getEventKey");

/**
 * @interface KeyboardEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var KeyboardEventInterface = {
  key: getEventKey,
  location: null,
  ctrlKey: null,
  shiftKey: null,
  altKey: null,
  metaKey: null,
  repeat: null,
  locale: null,
  // Legacy Interface
  'char': null,
  charCode: null,
  keyCode: null,
  which: null
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticKeyboardEvent(dispatchConfig, dispatchMarker, nativeEvent) {
  SyntheticUIEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent);
}

SyntheticUIEvent.augmentClass(SyntheticKeyboardEvent, KeyboardEventInterface);

module.exports = SyntheticKeyboardEvent;

},{"./SyntheticUIEvent":104,"./getEventKey":126}],102:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule SyntheticMouseEvent
 * @typechecks static-only
 */

"use strict";

var SyntheticUIEvent = require("./SyntheticUIEvent");
var ViewportMetrics = require("./ViewportMetrics");

/**
 * @interface MouseEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var MouseEventInterface = {
  screenX: null,
  screenY: null,
  clientX: null,
  clientY: null,
  ctrlKey: null,
  shiftKey: null,
  altKey: null,
  metaKey: null,
  button: function(event) {
    // Webkit, Firefox, IE9+
    // which:  1 2 3
    // button: 0 1 2 (standard)
    var button = event.button;
    if ('which' in event) {
      return button;
    }
    // IE<9
    // which:  undefined
    // button: 0 0 0
    // button: 1 4 2 (onmouseup)
    return button === 2 ? 2 : button === 4 ? 1 : 0;
  },
  buttons: null,
  relatedTarget: function(event) {
    return event.relatedTarget || (
      event.fromElement === event.srcElement ?
        event.toElement :
        event.fromElement
    );
  },
  // "Proprietary" Interface.
  pageX: function(event) {
    return 'pageX' in event ?
      event.pageX :
      event.clientX + ViewportMetrics.currentScrollLeft;
  },
  pageY: function(event) {
    return 'pageY' in event ?
      event.pageY :
      event.clientY + ViewportMetrics.currentScrollTop;
  }
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticMouseEvent(dispatchConfig, dispatchMarker, nativeEvent) {
  SyntheticUIEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent);
}

SyntheticUIEvent.augmentClass(SyntheticMouseEvent, MouseEventInterface);

module.exports = SyntheticMouseEvent;

},{"./SyntheticUIEvent":104,"./ViewportMetrics":107}],103:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule SyntheticTouchEvent
 * @typechecks static-only
 */

"use strict";

var SyntheticUIEvent = require("./SyntheticUIEvent");

/**
 * @interface TouchEvent
 * @see http://www.w3.org/TR/touch-events/
 */
var TouchEventInterface = {
  touches: null,
  targetTouches: null,
  changedTouches: null,
  altKey: null,
  metaKey: null,
  ctrlKey: null,
  shiftKey: null
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticTouchEvent(dispatchConfig, dispatchMarker, nativeEvent) {
  SyntheticUIEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent);
}

SyntheticUIEvent.augmentClass(SyntheticTouchEvent, TouchEventInterface);

module.exports = SyntheticTouchEvent;

},{"./SyntheticUIEvent":104}],104:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule SyntheticUIEvent
 * @typechecks static-only
 */

"use strict";

var SyntheticEvent = require("./SyntheticEvent");

/**
 * @interface UIEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var UIEventInterface = {
  view: null,
  detail: null
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticEvent}
 */
function SyntheticUIEvent(dispatchConfig, dispatchMarker, nativeEvent) {
  SyntheticEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent);
}

SyntheticEvent.augmentClass(SyntheticUIEvent, UIEventInterface);

module.exports = SyntheticUIEvent;

},{"./SyntheticEvent":99}],105:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule SyntheticWheelEvent
 * @typechecks static-only
 */

"use strict";

var SyntheticMouseEvent = require("./SyntheticMouseEvent");

/**
 * @interface WheelEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var WheelEventInterface = {
  deltaX: function(event) {
    return (
      'deltaX' in event ? event.deltaX :
      // Fallback to `wheelDeltaX` for Webkit and normalize (right is positive).
      'wheelDeltaX' in event ? -event.wheelDeltaX : 0
    );
  },
  deltaY: function(event) {
    return (
      'deltaY' in event ? event.deltaY :
      // Fallback to `wheelDeltaY` for Webkit and normalize (down is positive).
      'wheelDeltaY' in event ? -event.wheelDeltaY :
      // Fallback to `wheelDelta` for IE<9 and normalize (down is positive).
      'wheelDelta' in event ? -event.wheelDelta : 0
    );
  },
  deltaZ: null,

  // Browsers without "deltaMode" is reporting in raw wheel delta where one
  // notch on the scroll is always +/- 120, roughly equivalent to pixels.
  // A good approximation of DOM_DELTA_LINE (1) is 5% of viewport size or
  // ~40 pixels, for DOM_DELTA_SCREEN (2) it is 87.5% of viewport size.
  deltaMode: null
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticMouseEvent}
 */
function SyntheticWheelEvent(dispatchConfig, dispatchMarker, nativeEvent) {
  SyntheticMouseEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent);
}

SyntheticMouseEvent.augmentClass(SyntheticWheelEvent, WheelEventInterface);

module.exports = SyntheticWheelEvent;

},{"./SyntheticMouseEvent":102}],106:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule Transaction
 */

"use strict";

var invariant = require("./invariant");

/**
 * `Transaction` creates a black box that is able to wrap any method such that
 * certain invariants are maintained before and after the method is invoked
 * (Even if an exception is thrown while invoking the wrapped method). Whoever
 * instantiates a transaction can provide enforcers of the invariants at
 * creation time. The `Transaction` class itself will supply one additional
 * automatic invariant for you - the invariant that any transaction instance
 * should not be run while it is already being run. You would typically create a
 * single instance of a `Transaction` for reuse multiple times, that potentially
 * is used to wrap several different methods. Wrappers are extremely simple -
 * they only require implementing two methods.
 *
 * <pre>
 *                       wrappers (injected at creation time)
 *                                      +        +
 *                                      |        |
 *                    +-----------------|--------|--------------+
 *                    |                 v        |              |
 *                    |      +---------------+   |              |
 *                    |   +--|    wrapper1   |---|----+         |
 *                    |   |  +---------------+   v    |         |
 *                    |   |          +-------------+  |         |
 *                    |   |     +----|   wrapper2  |--------+   |
 *                    |   |     |    +-------------+  |     |   |
 *                    |   |     |                     |     |   |
 *                    |   v     v                     v     v   | wrapper
 *                    | +---+ +---+   +---------+   +---+ +---+ | invariants
 * perform(anyMethod) | |   | |   |   |         |   |   | |   | | maintained
 * +----------------->|-|---|-|---|-->|anyMethod|---|---|-|---|-|-------->
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | +---+ +---+   +---------+   +---+ +---+ |
 *                    |  initialize                    close    |
 *                    +-----------------------------------------+
 * </pre>
 *
 * Bonus:
 * - Reports timing metrics by method name and wrapper index.
 *
 * Use cases:
 * - Preserving the input selection ranges before/after reconciliation.
 *   Restoring selection even in the event of an unexpected error.
 * - Deactivating events while rearranging the DOM, preventing blurs/focuses,
 *   while guaranteeing that afterwards, the event system is reactivated.
 * - Flushing a queue of collected DOM mutations to the main UI thread after a
 *   reconciliation takes place in a worker thread.
 * - Invoking any collected `componentDidUpdate` callbacks after rendering new
 *   content.
 * - (Future use case): Wrapping particular flushes of the `ReactWorker` queue
 *   to preserve the `scrollTop` (an automatic scroll aware DOM).
 * - (Future use case): Layout calculations before and after DOM upates.
 *
 * Transactional plugin API:
 * - A module that has an `initialize` method that returns any precomputation.
 * - and a `close` method that accepts the precomputation. `close` is invoked
 *   when the wrapped process is completed, or has failed.
 *
 * @param {Array<TransactionalWrapper>} transactionWrapper Wrapper modules
 * that implement `initialize` and `close`.
 * @return {Transaction} Single transaction for reuse in thread.
 *
 * @class Transaction
 */
var Mixin = {
  /**
   * Sets up this instance so that it is prepared for collecting metrics. Does
   * so such that this setup method may be used on an instance that is already
   * initialized, in a way that does not consume additional memory upon reuse.
   * That can be useful if you decide to make your subclass of this mixin a
   * "PooledClass".
   */
  reinitializeTransaction: function() {
    this.transactionWrappers = this.getTransactionWrappers();
    if (!this.wrapperInitData) {
      this.wrapperInitData = [];
    } else {
      this.wrapperInitData.length = 0;
    }
    if (!this.timingMetrics) {
      this.timingMetrics = {};
    }
    this.timingMetrics.methodInvocationTime = 0;
    if (!this.timingMetrics.wrapperInitTimes) {
      this.timingMetrics.wrapperInitTimes = [];
    } else {
      this.timingMetrics.wrapperInitTimes.length = 0;
    }
    if (!this.timingMetrics.wrapperCloseTimes) {
      this.timingMetrics.wrapperCloseTimes = [];
    } else {
      this.timingMetrics.wrapperCloseTimes.length = 0;
    }
    this._isInTransaction = false;
  },

  _isInTransaction: false,

  /**
   * @abstract
   * @return {Array<TransactionWrapper>} Array of transaction wrappers.
   */
  getTransactionWrappers: null,

  isInTransaction: function() {
    return !!this._isInTransaction;
  },

  /**
   * Executes the function within a safety window. Use this for the top level
   * methods that result in large amounts of computation/mutations that would
   * need to be safety checked.
   *
   * @param {function} method Member of scope to call.
   * @param {Object} scope Scope to invoke from.
   * @param {Object?=} args... Arguments to pass to the method (optional).
   *                           Helps prevent need to bind in many cases.
   * @return Return value from `method`.
   */
  perform: function(method, scope, a, b, c, d, e, f) {
    ("production" !== process.env.NODE_ENV ? invariant(
      !this.isInTransaction(),
      'Transaction.perform(...): Cannot initialize a transaction when there ' +
      'is already an outstanding transaction.'
    ) : invariant(!this.isInTransaction()));
    var memberStart = Date.now();
    var errorThrown;
    var ret;
    try {
      this._isInTransaction = true;
      // Catching errors makes debugging more difficult, so we start with
      // errorThrown set to true before setting it to false after calling
      // close -- if it's still set to true in the finally block, it means
      // one of these calls threw.
      errorThrown = true;
      this.initializeAll(0);
      ret = method.call(scope, a, b, c, d, e, f);
      errorThrown = false;
    } finally {
      var memberEnd = Date.now();
      this.methodInvocationTime += (memberEnd - memberStart);
      try {
        if (errorThrown) {
          // If `method` throws, prefer to show that stack trace over any thrown
          // by invoking `closeAll`.
          try {
            this.closeAll(0);
          } catch (err) {
          }
        } else {
          // Since `method` didn't throw, we don't want to silence the exception
          // here.
          this.closeAll(0);
        }
      } finally {
        this._isInTransaction = false;
      }
    }
    return ret;
  },

  initializeAll: function(startIndex) {
    var transactionWrappers = this.transactionWrappers;
    var wrapperInitTimes = this.timingMetrics.wrapperInitTimes;
    for (var i = startIndex; i < transactionWrappers.length; i++) {
      var initStart = Date.now();
      var wrapper = transactionWrappers[i];
      try {
        // Catching errors makes debugging more difficult, so we start with the
        // OBSERVED_ERROR state before overwriting it with the real return value
        // of initialize -- if it's still set to OBSERVED_ERROR in the finally
        // block, it means wrapper.initialize threw.
        this.wrapperInitData[i] = Transaction.OBSERVED_ERROR;
        this.wrapperInitData[i] = wrapper.initialize ?
          wrapper.initialize.call(this) :
          null;
      } finally {
        var curInitTime = wrapperInitTimes[i];
        var initEnd = Date.now();
        wrapperInitTimes[i] = (curInitTime || 0) + (initEnd - initStart);

        if (this.wrapperInitData[i] === Transaction.OBSERVED_ERROR) {
          // The initializer for wrapper i threw an error; initialize the
          // remaining wrappers but silence any exceptions from them to ensure
          // that the first error is the one to bubble up.
          try {
            this.initializeAll(i + 1);
          } catch (err) {
          }
        }
      }
    }
  },

  /**
   * Invokes each of `this.transactionWrappers.close[i]` functions, passing into
   * them the respective return values of `this.transactionWrappers.init[i]`
   * (`close`rs that correspond to initializers that failed will not be
   * invoked).
   */
  closeAll: function(startIndex) {
    ("production" !== process.env.NODE_ENV ? invariant(
      this.isInTransaction(),
      'Transaction.closeAll(): Cannot close transaction when none are open.'
    ) : invariant(this.isInTransaction()));
    var transactionWrappers = this.transactionWrappers;
    var wrapperCloseTimes = this.timingMetrics.wrapperCloseTimes;
    for (var i = startIndex; i < transactionWrappers.length; i++) {
      var wrapper = transactionWrappers[i];
      var closeStart = Date.now();
      var initData = this.wrapperInitData[i];
      var errorThrown;
      try {
        // Catching errors makes debugging more difficult, so we start with
        // errorThrown set to true before setting it to false after calling
        // close -- if it's still set to true in the finally block, it means
        // wrapper.close threw.
        errorThrown = true;
        if (initData !== Transaction.OBSERVED_ERROR) {
          wrapper.close && wrapper.close.call(this, initData);
        }
        errorThrown = false;
      } finally {
        var closeEnd = Date.now();
        var curCloseTime = wrapperCloseTimes[i];
        wrapperCloseTimes[i] = (curCloseTime || 0) + (closeEnd - closeStart);

        if (errorThrown) {
          // The closer for wrapper i threw an error; close the remaining
          // wrappers but silence any exceptions from them to ensure that the
          // first error is the one to bubble up.
          try {
            this.closeAll(i + 1);
          } catch (e) {
          }
        }
      }
    }
    this.wrapperInitData.length = 0;
  }
};

var Transaction = {

  Mixin: Mixin,

  /**
   * Token to look for to determine if an error occured.
   */
  OBSERVED_ERROR: {}

};

module.exports = Transaction;

}).call(this,require("qvMYcC"))
},{"./invariant":135,"qvMYcC":161}],107:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ViewportMetrics
 */

"use strict";

var getUnboundedScrollPosition = require("./getUnboundedScrollPosition");

var ViewportMetrics = {

  currentScrollLeft: 0,

  currentScrollTop: 0,

  refreshScrollValues: function() {
    var scrollPosition = getUnboundedScrollPosition(window);
    ViewportMetrics.currentScrollLeft = scrollPosition.x;
    ViewportMetrics.currentScrollTop = scrollPosition.y;
  }

};

module.exports = ViewportMetrics;

},{"./getUnboundedScrollPosition":132}],108:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule accumulate
 */

"use strict";

var invariant = require("./invariant");

/**
 * Accumulates items that must not be null or undefined.
 *
 * This is used to conserve memory by avoiding array allocations.
 *
 * @return {*|array<*>} An accumulation of items.
 */
function accumulate(current, next) {
  ("production" !== process.env.NODE_ENV ? invariant(
    next != null,
    'accumulate(...): Accumulated items must be not be null or undefined.'
  ) : invariant(next != null));
  if (current == null) {
    return next;
  } else {
    // Both are not empty. Warning: Never call x.concat(y) when you are not
    // certain that x is an Array (x could be a string with concat method).
    var currentIsArray = Array.isArray(current);
    var nextIsArray = Array.isArray(next);
    if (currentIsArray) {
      return current.concat(next);
    } else {
      if (nextIsArray) {
        return [current].concat(next);
      } else {
        return [current, next];
      }
    }
  }
}

module.exports = accumulate;

}).call(this,require("qvMYcC"))
},{"./invariant":135,"qvMYcC":161}],109:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule adler32
 */

/* jslint bitwise:true */

"use strict";

var MOD = 65521;

// This is a clean-room implementation of adler32 designed for detecting
// if markup is not what we expect it to be. It does not need to be
// cryptographically strong, only reasonable good at detecting if markup
// generated on the server is different than that on the client.
function adler32(data) {
  var a = 1;
  var b = 0;
  for (var i = 0; i < data.length; i++) {
    a = (a + data.charCodeAt(i)) % MOD;
    b = (b + a) % MOD;
  }
  return a | (b << 16);
}

module.exports = adler32;

},{}],110:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @typechecks
 * @providesModule cloneWithProps
 */

"use strict";

var ReactPropTransferer = require("./ReactPropTransferer");

var keyOf = require("./keyOf");
var warning = require("./warning");

var CHILDREN_PROP = keyOf({children: null});

/**
 * Sometimes you want to change the props of a child passed to you. Usually
 * this is to add a CSS class.
 *
 * @param {object} child child component you'd like to clone
 * @param {object} props props you'd like to modify. They will be merged
 * as if you used `transferPropsTo()`.
 * @return {object} a clone of child with props merged in.
 */
function cloneWithProps(child, props) {
  if ("production" !== process.env.NODE_ENV) {
    ("production" !== process.env.NODE_ENV ? warning(
      !child.props.ref,
      'You are calling cloneWithProps() on a child with a ref. This is ' +
      'dangerous because you\'re creating a new child which will not be ' +
      'added as a ref to its parent.'
    ) : null);
  }

  var newProps = ReactPropTransferer.mergeProps(props, child.props);

  // Use `child.props.children` if it is provided.
  if (!newProps.hasOwnProperty(CHILDREN_PROP) &&
      child.props.hasOwnProperty(CHILDREN_PROP)) {
    newProps.children = child.props.children;
  }

  return child.constructor.ConvenienceConstructor(newProps);
}

module.exports = cloneWithProps;

}).call(this,require("qvMYcC"))
},{"./ReactPropTransferer":76,"./keyOf":142,"./warning":158,"qvMYcC":161}],111:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule containsNode
 * @typechecks
 */

var isTextNode = require("./isTextNode");

/*jslint bitwise:true */

/**
 * Checks if a given DOM node contains or is another DOM node.
 *
 * @param {?DOMNode} outerNode Outer DOM node.
 * @param {?DOMNode} innerNode Inner DOM node.
 * @return {boolean} True if `outerNode` contains or is `innerNode`.
 */
function containsNode(outerNode, innerNode) {
  if (!outerNode || !innerNode) {
    return false;
  } else if (outerNode === innerNode) {
    return true;
  } else if (isTextNode(outerNode)) {
    return false;
  } else if (isTextNode(innerNode)) {
    return containsNode(outerNode, innerNode.parentNode);
  } else if (outerNode.contains) {
    return outerNode.contains(innerNode);
  } else if (outerNode.compareDocumentPosition) {
    return !!(outerNode.compareDocumentPosition(innerNode) & 16);
  } else {
    return false;
  }
}

module.exports = containsNode;

},{"./isTextNode":139}],112:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule copyProperties
 */

/**
 * Copy properties from one or more objects (up to 5) into the first object.
 * This is a shallow copy. It mutates the first object and also returns it.
 *
 * NOTE: `arguments` has a very significant performance penalty, which is why
 * we don't support unlimited arguments.
 */
function copyProperties(obj, a, b, c, d, e, f) {
  obj = obj || {};

  if ("production" !== process.env.NODE_ENV) {
    if (f) {
      throw new Error('Too many arguments passed to copyProperties');
    }
  }

  var args = [a, b, c, d, e];
  var ii = 0, v;
  while (args[ii]) {
    v = args[ii++];
    for (var k in v) {
      obj[k] = v[k];
    }

    // IE ignores toString in object iteration.. See:
    // webreflection.blogspot.com/2007/07/quick-fix-internet-explorer-and.html
    if (v.hasOwnProperty && v.hasOwnProperty('toString') &&
        (typeof v.toString != 'undefined') && (obj.toString !== v.toString)) {
      obj.toString = v.toString;
    }
  }

  return obj;
}

module.exports = copyProperties;

}).call(this,require("qvMYcC"))
},{"qvMYcC":161}],113:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule createArrayFrom
 * @typechecks
 */

var toArray = require("./toArray");

/**
 * Perform a heuristic test to determine if an object is "array-like".
 *
 *   A monk asked Joshu, a Zen master, "Has a dog Buddha nature?"
 *   Joshu replied: "Mu."
 *
 * This function determines if its argument has "array nature": it returns
 * true if the argument is an actual array, an `arguments' object, or an
 * HTMLCollection (e.g. node.childNodes or node.getElementsByTagName()).
 *
 * It will return false for other array-like objects like Filelist.
 *
 * @param {*} obj
 * @return {boolean}
 */
function hasArrayNature(obj) {
  return (
    // not null/false
    !!obj &&
    // arrays are objects, NodeLists are functions in Safari
    (typeof obj == 'object' || typeof obj == 'function') &&
    // quacks like an array
    ('length' in obj) &&
    // not window
    !('setInterval' in obj) &&
    // no DOM node should be considered an array-like
    // a 'select' element has 'length' and 'item' properties on IE8
    (typeof obj.nodeType != 'number') &&
    (
      // a real array
      (// HTMLCollection/NodeList
      (Array.isArray(obj) ||
      // arguments
      ('callee' in obj) || 'item' in obj))
    )
  );
}

/**
 * Ensure that the argument is an array by wrapping it in an array if it is not.
 * Creates a copy of the argument if it is already an array.
 *
 * This is mostly useful idiomatically:
 *
 *   var createArrayFrom = require('createArrayFrom');
 *
 *   function takesOneOrMoreThings(things) {
 *     things = createArrayFrom(things);
 *     ...
 *   }
 *
 * This allows you to treat `things' as an array, but accept scalars in the API.
 *
 * If you need to convert an array-like object, like `arguments`, into an array
 * use toArray instead.
 *
 * @param {*} obj
 * @return {array}
 */
function createArrayFrom(obj) {
  if (!hasArrayNature(obj)) {
    return [obj];
  } else if (Array.isArray(obj)) {
    return obj.slice();
  } else {
    return toArray(obj);
  }
}

module.exports = createArrayFrom;

},{"./toArray":155}],114:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule createFullPageComponent
 * @typechecks
 */

"use strict";

// Defeat circular references by requiring this directly.
var ReactCompositeComponent = require("./ReactCompositeComponent");

var invariant = require("./invariant");

/**
 * Create a component that will throw an exception when unmounted.
 *
 * Components like <html> <head> and <body> can't be removed or added
 * easily in a cross-browser way, however it's valuable to be able to
 * take advantage of React's reconciliation for styling and <title>
 * management. So we just document it and throw in dangerous cases.
 *
 * @param {function} componentClass convenience constructor to wrap
 * @return {function} convenience constructor of new component
 */
function createFullPageComponent(componentClass) {
  var FullPageComponent = ReactCompositeComponent.createClass({
    displayName: 'ReactFullPageComponent' + (
      componentClass.componentConstructor.displayName || ''
    ),

    componentWillUnmount: function() {
      ("production" !== process.env.NODE_ENV ? invariant(
        false,
        '%s tried to unmount. Because of cross-browser quirks it is ' +
        'impossible to unmount some top-level components (eg <html>, <head>, ' +
        'and <body>) reliably and efficiently. To fix this, have a single ' +
        'top-level component that never unmounts render these elements.',
        this.constructor.displayName
      ) : invariant(false));
    },

    render: function() {
      return this.transferPropsTo(componentClass(null, this.props.children));
    }
  });

  return FullPageComponent;
}

module.exports = createFullPageComponent;

}).call(this,require("qvMYcC"))
},{"./ReactCompositeComponent":43,"./invariant":135,"qvMYcC":161}],115:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule createNodesFromMarkup
 * @typechecks
 */

/*jslint evil: true, sub: true */

var ExecutionEnvironment = require("./ExecutionEnvironment");

var createArrayFrom = require("./createArrayFrom");
var getMarkupWrap = require("./getMarkupWrap");
var invariant = require("./invariant");

/**
 * Dummy container used to render all markup.
 */
var dummyNode =
  ExecutionEnvironment.canUseDOM ? document.createElement('div') : null;

/**
 * Pattern used by `getNodeName`.
 */
var nodeNamePattern = /^\s*<(\w+)/;

/**
 * Extracts the `nodeName` of the first element in a string of markup.
 *
 * @param {string} markup String of markup.
 * @return {?string} Node name of the supplied markup.
 */
function getNodeName(markup) {
  var nodeNameMatch = markup.match(nodeNamePattern);
  return nodeNameMatch && nodeNameMatch[1].toLowerCase();
}

/**
 * Creates an array containing the nodes rendered from the supplied markup. The
 * optionally supplied `handleScript` function will be invoked once for each
 * <script> element that is rendered. If no `handleScript` function is supplied,
 * an exception is thrown if any <script> elements are rendered.
 *
 * @param {string} markup A string of valid HTML markup.
 * @param {?function} handleScript Invoked once for each rendered <script>.
 * @return {array<DOMElement|DOMTextNode>} An array of rendered nodes.
 */
function createNodesFromMarkup(markup, handleScript) {
  var node = dummyNode;
  ("production" !== process.env.NODE_ENV ? invariant(!!dummyNode, 'createNodesFromMarkup dummy not initialized') : invariant(!!dummyNode));
  var nodeName = getNodeName(markup);

  var wrap = nodeName && getMarkupWrap(nodeName);
  if (wrap) {
    node.innerHTML = wrap[1] + markup + wrap[2];

    var wrapDepth = wrap[0];
    while (wrapDepth--) {
      node = node.lastChild;
    }
  } else {
    node.innerHTML = markup;
  }

  var scripts = node.getElementsByTagName('script');
  if (scripts.length) {
    ("production" !== process.env.NODE_ENV ? invariant(
      handleScript,
      'createNodesFromMarkup(...): Unexpected <script> element rendered.'
    ) : invariant(handleScript));
    createArrayFrom(scripts).forEach(handleScript);
  }

  var nodes = createArrayFrom(node.childNodes);
  while (node.lastChild) {
    node.removeChild(node.lastChild);
  }
  return nodes;
}

module.exports = createNodesFromMarkup;

}).call(this,require("qvMYcC"))
},{"./ExecutionEnvironment":31,"./createArrayFrom":113,"./getMarkupWrap":128,"./invariant":135,"qvMYcC":161}],116:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule createObjectFrom
 */

/**
 * Construct an object from an array of keys
 * and optionally specified value or list of values.
 *
 *  >>> createObjectFrom(['a','b','c']);
 *  {a: true, b: true, c: true}
 *
 *  >>> createObjectFrom(['a','b','c'], false);
 *  {a: false, b: false, c: false}
 *
 *  >>> createObjectFrom(['a','b','c'], 'monkey');
 *  {c:'monkey', b:'monkey' c:'monkey'}
 *
 *  >>> createObjectFrom(['a','b','c'], [1,2,3]);
 *  {a: 1, b: 2, c: 3}
 *
 *  >>> createObjectFrom(['women', 'men'], [true, false]);
 *  {women: true, men: false}
 *
 * @param   Array   list of keys
 * @param   mixed   optional value or value array.  defaults true.
 * @returns object
 */
function createObjectFrom(keys, values /* = true */) {
  if ("production" !== process.env.NODE_ENV) {
    if (!Array.isArray(keys)) {
      throw new TypeError('Must pass an array of keys.');
    }
  }

  var object = {};
  var isArray = Array.isArray(values);
  if (typeof values == 'undefined') {
    values = true;
  }

  for (var ii = keys.length; ii--;) {
    object[keys[ii]] = isArray ? values[ii] : values;
  }
  return object;
}

module.exports = createObjectFrom;

}).call(this,require("qvMYcC"))
},{"qvMYcC":161}],117:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule cx
 */

/**
 * This function is used to mark string literals representing CSS class names
 * so that they can be transformed statically. This allows for modularization
 * and minification of CSS class names.
 *
 * In static_upstream, this function is actually implemented, but it should
 * eventually be replaced with something more descriptive, and the transform
 * that is used in the main stack should be ported for use elsewhere.
 *
 * @param string|object className to modularize, or an object of key/values.
 *                      In the object case, the values are conditions that
 *                      determine if the className keys should be included.
 * @param [string ...]  Variable list of classNames in the string case.
 * @return string       Renderable space-separated CSS className.
 */
function cx(classNames) {
  if (typeof classNames == 'object') {
    return Object.keys(classNames).filter(function(className) {
      return classNames[className];
    }).join(' ');
  } else {
    return Array.prototype.join.call(arguments, ' ');
  }
}

module.exports = cx;

},{}],118:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule dangerousStyleValue
 * @typechecks static-only
 */

"use strict";

var CSSProperty = require("./CSSProperty");

/**
 * Convert a value into the proper css writable value. The `styleName` name
 * name should be logical (no hyphens), as specified
 * in `CSSProperty.isUnitlessNumber`.
 *
 * @param {string} styleName CSS property name such as `topMargin`.
 * @param {*} value CSS property value such as `10px`.
 * @return {string} Normalized style value with dimensions applied.
 */
function dangerousStyleValue(styleName, value) {
  // Note that we've removed escapeTextForBrowser() calls here since the
  // whole string will be escaped when the attribute is injected into
  // the markup. If you provide unsafe user data here they can inject
  // arbitrary CSS which may be problematic (I couldn't repro this):
  // https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet
  // http://www.thespanner.co.uk/2007/11/26/ultimate-xss-css-injection/
  // This is not an XSS hole but instead a potential CSS injection issue
  // which has lead to a greater discussion about how we're going to
  // trust URLs moving forward. See #2115901

  var isEmpty = value == null || typeof value === 'boolean' || value === '';
  if (isEmpty) {
    return '';
  }

  var isNonNumeric = isNaN(value);
  if (isNonNumeric || value === 0 || CSSProperty.isUnitlessNumber[styleName]) {
    return '' + value; // cast to string
  }

  return value + 'px';
}

module.exports = dangerousStyleValue;

},{"./CSSProperty":13}],119:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule emptyFunction
 */

var copyProperties = require("./copyProperties");

function makeEmptyFunction(arg) {
  return function() {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
function emptyFunction() {}

copyProperties(emptyFunction, {
  thatReturns: makeEmptyFunction,
  thatReturnsFalse: makeEmptyFunction(false),
  thatReturnsTrue: makeEmptyFunction(true),
  thatReturnsNull: makeEmptyFunction(null),
  thatReturnsThis: function() { return this; },
  thatReturnsArgument: function(arg) { return arg; }
});

module.exports = emptyFunction;

},{"./copyProperties":112}],120:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule emptyObject
 */

"use strict";

var emptyObject = {};

if ("production" !== process.env.NODE_ENV) {
  Object.freeze(emptyObject);
}

module.exports = emptyObject;

}).call(this,require("qvMYcC"))
},{"qvMYcC":161}],121:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule escapeTextForBrowser
 * @typechecks static-only
 */

"use strict";

var ESCAPE_LOOKUP = {
  "&": "&amp;",
  ">": "&gt;",
  "<": "&lt;",
  "\"": "&quot;",
  "'": "&#x27;",
  "/": "&#x2f;"
};

var ESCAPE_REGEX = /[&><"'\/]/g;

function escaper(match) {
  return ESCAPE_LOOKUP[match];
}

/**
 * Escapes text to prevent scripting attacks.
 *
 * @param {*} text Text value to escape.
 * @return {string} An escaped string.
 */
function escapeTextForBrowser(text) {
  return ('' + text).replace(ESCAPE_REGEX, escaper);
}

module.exports = escapeTextForBrowser;

},{}],122:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule flattenChildren
 */

"use strict";

var invariant = require("./invariant");
var traverseAllChildren = require("./traverseAllChildren");

/**
 * @param {function} traverseContext Context passed through traversal.
 * @param {?ReactComponent} child React child component.
 * @param {!string} name String name of key path to child.
 */
function flattenSingleChildIntoContext(traverseContext, child, name) {
  // We found a component instance.
  var result = traverseContext;
  ("production" !== process.env.NODE_ENV ? invariant(
    !result.hasOwnProperty(name),
    'flattenChildren(...): Encountered two children with the same key, `%s`. ' +
    'Children keys must be unique.',
    name
  ) : invariant(!result.hasOwnProperty(name)));
  if (child != null) {
    result[name] = child;
  }
}

/**
 * Flattens children that are typically specified as `props.children`. Any null
 * children will not be included in the resulting object.
 * @return {!object} flattened children keyed by name.
 */
function flattenChildren(children) {
  if (children == null) {
    return children;
  }
  var result = {};
  traverseAllChildren(children, flattenSingleChildIntoContext, result);
  return result;
}

module.exports = flattenChildren;

}).call(this,require("qvMYcC"))
},{"./invariant":135,"./traverseAllChildren":156,"qvMYcC":161}],123:[function(require,module,exports){
/**
 * Copyright 2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule focusNode
 */

"use strict";

/**
 * IE8 throws if an input/textarea is disabled and we try to focus it.
 * Focus only when necessary.
 *
 * @param {DOMElement} node input/textarea to focus
 */
function focusNode(node) {
  if (!node.disabled) {
    node.focus();
  }
}

module.exports = focusNode;

},{}],124:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule forEachAccumulated
 */

"use strict";

/**
 * @param {array} an "accumulation" of items which is either an Array or
 * a single item. Useful when paired with the `accumulate` module. This is a
 * simple utility that allows us to reason about a collection of items, but
 * handling the case when there is exactly one item (and we do not need to
 * allocate an array).
 */
var forEachAccumulated = function(arr, cb, scope) {
  if (Array.isArray(arr)) {
    arr.forEach(cb, scope);
  } else if (arr) {
    cb.call(scope, arr);
  }
};

module.exports = forEachAccumulated;

},{}],125:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule getActiveElement
 * @typechecks
 */

/**
 * Same as document.activeElement but wraps in a try-catch block. In IE it is
 * not safe to call document.activeElement if there is nothing focused.
 *
 * The activeElement will be null only if the document body is not yet defined.
 */
function getActiveElement() /*?DOMElement*/ {
  try {
    return document.activeElement || document.body;
  } catch (e) {
    return document.body;
  }
}

module.exports = getActiveElement;

},{}],126:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule getEventKey
 * @typechecks static-only
 */

"use strict";

/**
 * Normalization of deprecated HTML5 "key" values
 * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent#Key_names
 */
var normalizeKey = {
  'Esc': 'Escape',
  'Spacebar': ' ',
  'Left': 'ArrowLeft',
  'Up': 'ArrowUp',
  'Right': 'ArrowRight',
  'Down': 'ArrowDown',
  'Del': 'Delete',
  'Win': 'OS',
  'Menu': 'ContextMenu',
  'Apps': 'ContextMenu',
  'Scroll': 'ScrollLock',
  'MozPrintableKey': 'Unidentified'
};

/**
 * Translation from legacy "which/keyCode" to HTML5 "key"
 * Only special keys supported, all others depend on keyboard layout or browser
 * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent#Key_names
 */
var translateToKey = {
  8: 'Backspace',
  9: 'Tab',
  12: 'Clear',
  13: 'Enter',
  16: 'Shift',
  17: 'Control',
  18: 'Alt',
  19: 'Pause',
  20: 'CapsLock',
  27: 'Escape',
  32: ' ',
  33: 'PageUp',
  34: 'PageDown',
  35: 'End',
  36: 'Home',
  37: 'ArrowLeft',
  38: 'ArrowUp',
  39: 'ArrowRight',
  40: 'ArrowDown',
  45: 'Insert',
  46: 'Delete',
  112: 'F1', 113: 'F2', 114: 'F3', 115: 'F4', 116: 'F5', 117: 'F6',
  118: 'F7', 119: 'F8', 120: 'F9', 121: 'F10', 122: 'F11', 123: 'F12',
  144: 'NumLock',
  145: 'ScrollLock',
  224: 'Meta'
};

/**
 * @param {object} nativeEvent Native browser event.
 * @return {string} Normalized `key` property.
 */
function getEventKey(nativeEvent) {
  return 'key' in nativeEvent ?
    normalizeKey[nativeEvent.key] || nativeEvent.key :
    translateToKey[nativeEvent.which || nativeEvent.keyCode] || 'Unidentified';
}

module.exports = getEventKey;

},{}],127:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule getEventTarget
 * @typechecks static-only
 */

"use strict";

/**
 * Gets the target node from a native browser event by accounting for
 * inconsistencies in browser DOM APIs.
 *
 * @param {object} nativeEvent Native browser event.
 * @return {DOMEventTarget} Target node.
 */
function getEventTarget(nativeEvent) {
  var target = nativeEvent.target || nativeEvent.srcElement || window;
  // Safari may fire events on text nodes (Node.TEXT_NODE is 3).
  // @see http://www.quirksmode.org/js/events_properties.html
  return target.nodeType === 3 ? target.parentNode : target;
}

module.exports = getEventTarget;

},{}],128:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule getMarkupWrap
 */

var ExecutionEnvironment = require("./ExecutionEnvironment");

var invariant = require("./invariant");

/**
 * Dummy container used to detect which wraps are necessary.
 */
var dummyNode =
  ExecutionEnvironment.canUseDOM ? document.createElement('div') : null;

/**
 * Some browsers cannot use `innerHTML` to render certain elements standalone,
 * so we wrap them, render the wrapped nodes, then extract the desired node.
 *
 * In IE8, certain elements cannot render alone, so wrap all elements ('*').
 */
var shouldWrap = {
  // Force wrapping for SVG elements because if they get created inside a <div>,
  // they will be initialized in the wrong namespace (and will not display).
  'circle': true,
  'defs': true,
  'g': true,
  'line': true,
  'linearGradient': true,
  'path': true,
  'polygon': true,
  'polyline': true,
  'radialGradient': true,
  'rect': true,
  'stop': true,
  'text': true
};

var selectWrap = [1, '<select multiple="true">', '</select>'];
var tableWrap = [1, '<table>', '</table>'];
var trWrap = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

var svgWrap = [1, '<svg>', '</svg>'];

var markupWrap = {
  '*': [1, '?<div>', '</div>'],

  'area': [1, '<map>', '</map>'],
  'col': [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  'legend': [1, '<fieldset>', '</fieldset>'],
  'param': [1, '<object>', '</object>'],
  'tr': [2, '<table><tbody>', '</tbody></table>'],

  'optgroup': selectWrap,
  'option': selectWrap,

  'caption': tableWrap,
  'colgroup': tableWrap,
  'tbody': tableWrap,
  'tfoot': tableWrap,
  'thead': tableWrap,

  'td': trWrap,
  'th': trWrap,

  'circle': svgWrap,
  'defs': svgWrap,
  'g': svgWrap,
  'line': svgWrap,
  'linearGradient': svgWrap,
  'path': svgWrap,
  'polygon': svgWrap,
  'polyline': svgWrap,
  'radialGradient': svgWrap,
  'rect': svgWrap,
  'stop': svgWrap,
  'text': svgWrap
};

/**
 * Gets the markup wrap configuration for the supplied `nodeName`.
 *
 * NOTE: This lazily detects which wraps are necessary for the current browser.
 *
 * @param {string} nodeName Lowercase `nodeName`.
 * @return {?array} Markup wrap configuration, if applicable.
 */
function getMarkupWrap(nodeName) {
  ("production" !== process.env.NODE_ENV ? invariant(!!dummyNode, 'Markup wrapping node not initialized') : invariant(!!dummyNode));
  if (!markupWrap.hasOwnProperty(nodeName)) {
    nodeName = '*';
  }
  if (!shouldWrap.hasOwnProperty(nodeName)) {
    if (nodeName === '*') {
      dummyNode.innerHTML = '<link />';
    } else {
      dummyNode.innerHTML = '<' + nodeName + '></' + nodeName + '>';
    }
    shouldWrap[nodeName] = !dummyNode.firstChild;
  }
  return shouldWrap[nodeName] ? markupWrap[nodeName] : null;
}


module.exports = getMarkupWrap;

}).call(this,require("qvMYcC"))
},{"./ExecutionEnvironment":31,"./invariant":135,"qvMYcC":161}],129:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule getNodeForCharacterOffset
 */

"use strict";

/**
 * Given any node return the first leaf node without children.
 *
 * @param {DOMElement|DOMTextNode} node
 * @return {DOMElement|DOMTextNode}
 */
function getLeafNode(node) {
  while (node && node.firstChild) {
    node = node.firstChild;
  }
  return node;
}

/**
 * Get the next sibling within a container. This will walk up the
 * DOM if a node's siblings have been exhausted.
 *
 * @param {DOMElement|DOMTextNode} node
 * @return {?DOMElement|DOMTextNode}
 */
function getSiblingNode(node) {
  while (node) {
    if (node.nextSibling) {
      return node.nextSibling;
    }
    node = node.parentNode;
  }
}

/**
 * Get object describing the nodes which contain characters at offset.
 *
 * @param {DOMElement|DOMTextNode} root
 * @param {number} offset
 * @return {?object}
 */
function getNodeForCharacterOffset(root, offset) {
  var node = getLeafNode(root);
  var nodeStart = 0;
  var nodeEnd = 0;

  while (node) {
    if (node.nodeType == 3) {
      nodeEnd = nodeStart + node.textContent.length;

      if (nodeStart <= offset && nodeEnd >= offset) {
        return {
          node: node,
          offset: offset - nodeStart
        };
      }

      nodeStart = nodeEnd;
    }

    node = getLeafNode(getSiblingNode(node));
  }
}

module.exports = getNodeForCharacterOffset;

},{}],130:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule getReactRootElementInContainer
 */

"use strict";

var DOC_NODE_TYPE = 9;

/**
 * @param {DOMElement|DOMDocument} container DOM element that may contain
 *                                           a React component
 * @return {?*} DOM element that may have the reactRoot ID, or null.
 */
function getReactRootElementInContainer(container) {
  if (!container) {
    return null;
  }

  if (container.nodeType === DOC_NODE_TYPE) {
    return container.documentElement;
  } else {
    return container.firstChild;
  }
}

module.exports = getReactRootElementInContainer;

},{}],131:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule getTextContentAccessor
 */

"use strict";

var ExecutionEnvironment = require("./ExecutionEnvironment");

var contentKey = null;

/**
 * Gets the key used to access text content on a DOM node.
 *
 * @return {?string} Key used to access text content.
 * @internal
 */
function getTextContentAccessor() {
  if (!contentKey && ExecutionEnvironment.canUseDOM) {
    // Prefer textContent to innerText because many browsers support both but
    // SVG <text> elements don't support innerText even when <div> does.
    contentKey = 'textContent' in document.createElement('div') ?
      'textContent' :
      'innerText';
  }
  return contentKey;
}

module.exports = getTextContentAccessor;

},{"./ExecutionEnvironment":31}],132:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule getUnboundedScrollPosition
 * @typechecks
 */

"use strict";

/**
 * Gets the scroll position of the supplied element or window.
 *
 * The return values are unbounded, unlike `getScrollPosition`. This means they
 * may be negative or exceed the element boundaries (which is possible using
 * inertial scrolling).
 *
 * @param {DOMWindow|DOMElement} scrollable
 * @return {object} Map with `x` and `y` keys.
 */
function getUnboundedScrollPosition(scrollable) {
  if (scrollable === window) {
    return {
      x: window.pageXOffset || document.documentElement.scrollLeft,
      y: window.pageYOffset || document.documentElement.scrollTop
    };
  }
  return {
    x: scrollable.scrollLeft,
    y: scrollable.scrollTop
  };
}

module.exports = getUnboundedScrollPosition;

},{}],133:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule hyphenate
 * @typechecks
 */

var _uppercasePattern = /([A-Z])/g;

/**
 * Hyphenates a camelcased string, for example:
 *
 *   > hyphenate('backgroundColor')
 *   < "background-color"
 *
 * @param {string} string
 * @return {string}
 */
function hyphenate(string) {
  return string.replace(_uppercasePattern, '-$1').toLowerCase();
}

module.exports = hyphenate;

},{}],134:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule instantiateReactComponent
 * @typechecks static-only
 */

"use strict";

var warning = require("./warning");

/**
 * Validate a `componentDescriptor`. This should be exposed publicly in a follow
 * up diff.
 *
 * @param {object} descriptor
 * @return {boolean} Returns true if this is a valid descriptor of a Component.
 */
function isValidComponentDescriptor(descriptor) {
  return (
    typeof descriptor.constructor === 'function' &&
    typeof descriptor.constructor.prototype.construct === 'function' &&
    typeof descriptor.constructor.prototype.mountComponent === 'function' &&
    typeof descriptor.constructor.prototype.receiveComponent === 'function'
  );
}

/**
 * Given a `componentDescriptor` create an instance that will actually be
 * mounted. Currently it just extracts an existing clone from composite
 * components but this is an implementation detail which will change.
 *
 * @param {object} descriptor
 * @return {object} A new instance of componentDescriptor's constructor.
 * @protected
 */
function instantiateReactComponent(descriptor) {
  if ("production" !== process.env.NODE_ENV) {
    ("production" !== process.env.NODE_ENV ? warning(
      isValidComponentDescriptor(descriptor),
      'Only React Components are valid for mounting.'
    ) : null);
    // We use the clone of a composite component instead of the original
    // instance. This allows us to warn you if you're are accessing the wrong
    // instance.
    var instance = descriptor.__realComponentInstance || descriptor;
    instance._descriptor = descriptor;
    return instance;
  }
  // In prod we don't clone, we simply use the same instance for unaffected
  // behavior. We have to keep the descriptor around for comparison later on.
  // This should ideally be accepted in the constructor of the instance but
  // since that is currently overloaded, we just manually attach it here.
  descriptor._descriptor = descriptor;
  return descriptor;
}

module.exports = instantiateReactComponent;

}).call(this,require("qvMYcC"))
},{"./warning":158,"qvMYcC":161}],135:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule invariant
 */

"use strict";

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function(condition) {
  if (!condition) {
    var error = new Error(
      'Minified exception occured; use the non-minified dev environment for ' +
      'the full error message and additional helpful warnings.'
    );
    error.framesToPop = 1;
    throw error;
  }
};

if ("production" !== process.env.NODE_ENV) {
  invariant = function(condition, format, a, b, c, d, e, f) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }

    if (!condition) {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      var error = new Error(
        'Invariant Violation: ' +
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
      error.framesToPop = 1; // we don't care about invariant's own frame
      throw error;
    }
  };
}

module.exports = invariant;

}).call(this,require("qvMYcC"))
},{"qvMYcC":161}],136:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule isEventSupported
 */

"use strict";

var ExecutionEnvironment = require("./ExecutionEnvironment");

var useHasFeature;
if (ExecutionEnvironment.canUseDOM) {
  useHasFeature =
    document.implementation &&
    document.implementation.hasFeature &&
    // always returns true in newer browsers as per the standard.
    // @see http://dom.spec.whatwg.org/#dom-domimplementation-hasfeature
    document.implementation.hasFeature('', '') !== true;
}

/**
 * Checks if an event is supported in the current execution environment.
 *
 * NOTE: This will not work correctly for non-generic events such as `change`,
 * `reset`, `load`, `error`, and `select`.
 *
 * Borrows from Modernizr.
 *
 * @param {string} eventNameSuffix Event name, e.g. "click".
 * @param {?boolean} capture Check if the capture phase is supported.
 * @return {boolean} True if the event is supported.
 * @internal
 * @license Modernizr 3.0.0pre (Custom Build) | MIT
 */
function isEventSupported(eventNameSuffix, capture) {
  if (!ExecutionEnvironment.canUseDOM ||
      capture && !('addEventListener' in document)) {
    return false;
  }

  var eventName = 'on' + eventNameSuffix;
  var isSupported = eventName in document;

  if (!isSupported) {
    var element = document.createElement('div');
    element.setAttribute(eventName, 'return;');
    isSupported = typeof element[eventName] === 'function';
  }

  if (!isSupported && useHasFeature && eventNameSuffix === 'wheel') {
    // This is the only way to test support for the `wheel` event in IE9+.
    isSupported = document.implementation.hasFeature('Events.wheel', '3.0');
  }

  return isSupported;
}

module.exports = isEventSupported;

},{"./ExecutionEnvironment":31}],137:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule isNode
 * @typechecks
 */

/**
 * @param {*} object The object to check.
 * @return {boolean} Whether or not the object is a DOM node.
 */
function isNode(object) {
  return !!(object && (
    typeof Node === 'function' ? object instanceof Node :
      typeof object === 'object' &&
      typeof object.nodeType === 'number' &&
      typeof object.nodeName === 'string'
  ));
}

module.exports = isNode;

},{}],138:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule isTextInputElement
 */

"use strict";

/**
 * @see http://www.whatwg.org/specs/web-apps/current-work/multipage/the-input-element.html#input-type-attr-summary
 */
var supportedInputTypes = {
  'color': true,
  'date': true,
  'datetime': true,
  'datetime-local': true,
  'email': true,
  'month': true,
  'number': true,
  'password': true,
  'range': true,
  'search': true,
  'tel': true,
  'text': true,
  'time': true,
  'url': true,
  'week': true
};

function isTextInputElement(elem) {
  return elem && (
    (elem.nodeName === 'INPUT' && supportedInputTypes[elem.type]) ||
    elem.nodeName === 'TEXTAREA'
  );
}

module.exports = isTextInputElement;

},{}],139:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule isTextNode
 * @typechecks
 */

var isNode = require("./isNode");

/**
 * @param {*} object The object to check.
 * @return {boolean} Whether or not the object is a DOM text node.
 */
function isTextNode(object) {
  return isNode(object) && object.nodeType == 3;
}

module.exports = isTextNode;

},{"./isNode":137}],140:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule joinClasses
 * @typechecks static-only
 */

"use strict";

/**
 * Combines multiple className strings into one.
 * http://jsperf.com/joinclasses-args-vs-array
 *
 * @param {...?string} classes
 * @return {string}
 */
function joinClasses(className/*, ... */) {
  if (!className) {
    className = '';
  }
  var nextClass;
  var argLength = arguments.length;
  if (argLength > 1) {
    for (var ii = 1; ii < argLength; ii++) {
      nextClass = arguments[ii];
      nextClass && (className += ' ' + nextClass);
    }
  }
  return className;
}

module.exports = joinClasses;

},{}],141:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule keyMirror
 * @typechecks static-only
 */

"use strict";

var invariant = require("./invariant");

/**
 * Constructs an enumeration with keys equal to their value.
 *
 * For example:
 *
 *   var COLORS = keyMirror({blue: null, red: null});
 *   var myColor = COLORS.blue;
 *   var isColorValid = !!COLORS[myColor];
 *
 * The last line could not be performed if the values of the generated enum were
 * not equal to their keys.
 *
 *   Input:  {key1: val1, key2: val2}
 *   Output: {key1: key1, key2: key2}
 *
 * @param {object} obj
 * @return {object}
 */
var keyMirror = function(obj) {
  var ret = {};
  var key;
  ("production" !== process.env.NODE_ENV ? invariant(
    obj instanceof Object && !Array.isArray(obj),
    'keyMirror(...): Argument must be an object.'
  ) : invariant(obj instanceof Object && !Array.isArray(obj)));
  for (key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }
    ret[key] = key;
  }
  return ret;
};

module.exports = keyMirror;

}).call(this,require("qvMYcC"))
},{"./invariant":135,"qvMYcC":161}],142:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule keyOf
 */

/**
 * Allows extraction of a minified key. Let's the build system minify keys
 * without loosing the ability to dynamically use key strings as values
 * themselves. Pass in an object with a single key/val pair and it will return
 * you the string key of that single record. Suppose you want to grab the
 * value for a key 'className' inside of an object. Key/val minification may
 * have aliased that key to be 'xa12'. keyOf({className: null}) will return
 * 'xa12' in that case. Resolve keys you want to use once at startup time, then
 * reuse those resolutions.
 */
var keyOf = function(oneKeyObj) {
  var key;
  for (key in oneKeyObj) {
    if (!oneKeyObj.hasOwnProperty(key)) {
      continue;
    }
    return key;
  }
  return null;
};


module.exports = keyOf;

},{}],143:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule memoizeStringOnly
 * @typechecks static-only
 */

"use strict";

/**
 * Memoizes the return value of a function that accepts one string argument.
 *
 * @param {function} callback
 * @return {function}
 */
function memoizeStringOnly(callback) {
  var cache = {};
  return function(string) {
    if (cache.hasOwnProperty(string)) {
      return cache[string];
    } else {
      return cache[string] = callback.call(this, string);
    }
  };
}

module.exports = memoizeStringOnly;

},{}],144:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule merge
 */

"use strict";

var mergeInto = require("./mergeInto");

/**
 * Shallow merges two structures into a return value, without mutating either.
 *
 * @param {?object} one Optional object with properties to merge from.
 * @param {?object} two Optional object with properties to merge from.
 * @return {object} The shallow extension of one by two.
 */
var merge = function(one, two) {
  var result = {};
  mergeInto(result, one);
  mergeInto(result, two);
  return result;
};

module.exports = merge;

},{"./mergeInto":146}],145:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule mergeHelpers
 *
 * requiresPolyfills: Array.isArray
 */

"use strict";

var invariant = require("./invariant");
var keyMirror = require("./keyMirror");

/**
 * Maximum number of levels to traverse. Will catch circular structures.
 * @const
 */
var MAX_MERGE_DEPTH = 36;

/**
 * We won't worry about edge cases like new String('x') or new Boolean(true).
 * Functions are considered terminals, and arrays are not.
 * @param {*} o The item/object/value to test.
 * @return {boolean} true iff the argument is a terminal.
 */
var isTerminal = function(o) {
  return typeof o !== 'object' || o === null;
};

var mergeHelpers = {

  MAX_MERGE_DEPTH: MAX_MERGE_DEPTH,

  isTerminal: isTerminal,

  /**
   * Converts null/undefined values into empty object.
   *
   * @param {?Object=} arg Argument to be normalized (nullable optional)
   * @return {!Object}
   */
  normalizeMergeArg: function(arg) {
    return arg === undefined || arg === null ? {} : arg;
  },

  /**
   * If merging Arrays, a merge strategy *must* be supplied. If not, it is
   * likely the caller's fault. If this function is ever called with anything
   * but `one` and `two` being `Array`s, it is the fault of the merge utilities.
   *
   * @param {*} one Array to merge into.
   * @param {*} two Array to merge from.
   */
  checkMergeArrayArgs: function(one, two) {
    ("production" !== process.env.NODE_ENV ? invariant(
      Array.isArray(one) && Array.isArray(two),
      'Tried to merge arrays, instead got %s and %s.',
      one,
      two
    ) : invariant(Array.isArray(one) && Array.isArray(two)));
  },

  /**
   * @param {*} one Object to merge into.
   * @param {*} two Object to merge from.
   */
  checkMergeObjectArgs: function(one, two) {
    mergeHelpers.checkMergeObjectArg(one);
    mergeHelpers.checkMergeObjectArg(two);
  },

  /**
   * @param {*} arg
   */
  checkMergeObjectArg: function(arg) {
    ("production" !== process.env.NODE_ENV ? invariant(
      !isTerminal(arg) && !Array.isArray(arg),
      'Tried to merge an object, instead got %s.',
      arg
    ) : invariant(!isTerminal(arg) && !Array.isArray(arg)));
  },

  /**
   * Checks that a merge was not given a circular object or an object that had
   * too great of depth.
   *
   * @param {number} Level of recursion to validate against maximum.
   */
  checkMergeLevel: function(level) {
    ("production" !== process.env.NODE_ENV ? invariant(
      level < MAX_MERGE_DEPTH,
      'Maximum deep merge depth exceeded. You may be attempting to merge ' +
      'circular structures in an unsupported way.'
    ) : invariant(level < MAX_MERGE_DEPTH));
  },

  /**
   * Checks that the supplied merge strategy is valid.
   *
   * @param {string} Array merge strategy.
   */
  checkArrayStrategy: function(strategy) {
    ("production" !== process.env.NODE_ENV ? invariant(
      strategy === undefined || strategy in mergeHelpers.ArrayStrategies,
      'You must provide an array strategy to deep merge functions to ' +
      'instruct the deep merge how to resolve merging two arrays.'
    ) : invariant(strategy === undefined || strategy in mergeHelpers.ArrayStrategies));
  },

  /**
   * Set of possible behaviors of merge algorithms when encountering two Arrays
   * that must be merged together.
   * - `clobber`: The left `Array` is ignored.
   * - `indexByIndex`: The result is achieved by recursively deep merging at
   *   each index. (not yet supported.)
   */
  ArrayStrategies: keyMirror({
    Clobber: true,
    IndexByIndex: true
  })

};

module.exports = mergeHelpers;

}).call(this,require("qvMYcC"))
},{"./invariant":135,"./keyMirror":141,"qvMYcC":161}],146:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule mergeInto
 * @typechecks static-only
 */

"use strict";

var mergeHelpers = require("./mergeHelpers");

var checkMergeObjectArg = mergeHelpers.checkMergeObjectArg;

/**
 * Shallow merges two structures by mutating the first parameter.
 *
 * @param {object} one Object to be merged into.
 * @param {?object} two Optional object with properties to merge from.
 */
function mergeInto(one, two) {
  checkMergeObjectArg(one);
  if (two != null) {
    checkMergeObjectArg(two);
    for (var key in two) {
      if (!two.hasOwnProperty(key)) {
        continue;
      }
      one[key] = two[key];
    }
  }
}

module.exports = mergeInto;

},{"./mergeHelpers":145}],147:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule mixInto
 */

"use strict";

/**
 * Simply copies properties to the prototype.
 */
var mixInto = function(constructor, methodBag) {
  var methodName;
  for (methodName in methodBag) {
    if (!methodBag.hasOwnProperty(methodName)) {
      continue;
    }
    constructor.prototype[methodName] = methodBag[methodName];
  }
};

module.exports = mixInto;

},{}],148:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule monitorCodeUse
 */

"use strict";

var invariant = require("./invariant");

/**
 * Provides open-source compatible instrumentation for monitoring certain API
 * uses before we're ready to issue a warning or refactor. It accepts an event
 * name which may only contain the characters [a-z0-9_] and an optional data
 * object with further information.
 */

function monitorCodeUse(eventName, data) {
  ("production" !== process.env.NODE_ENV ? invariant(
    eventName && !/[^a-z0-9_]/.test(eventName),
    'You must provide an eventName using only the characters [a-z0-9_]'
  ) : invariant(eventName && !/[^a-z0-9_]/.test(eventName)));
}

module.exports = monitorCodeUse;

}).call(this,require("qvMYcC"))
},{"./invariant":135,"qvMYcC":161}],149:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule objMap
 */

"use strict";

/**
 * For each key/value pair, invokes callback func and constructs a resulting
 * object which contains, for every key in obj, values that are the result of
 * of invoking the function:
 *
 *   func(value, key, iteration)
 *
 * @param {?object} obj Object to map keys over
 * @param {function} func Invoked for each key/val pair.
 * @param {?*} context
 * @return {?object} Result of mapping or null if obj is falsey
 */
function objMap(obj, func, context) {
  if (!obj) {
    return null;
  }
  var i = 0;
  var ret = {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      ret[key] = func.call(context, obj[key], key, i++);
    }
  }
  return ret;
}

module.exports = objMap;

},{}],150:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule objMapKeyVal
 */

"use strict";

/**
 * Behaves the same as `objMap` but invokes func with the key first, and value
 * second. Use `objMap` unless you need this special case.
 * Invokes func as:
 *
 *   func(key, value, iteration)
 *
 * @param {?object} obj Object to map keys over
 * @param {!function} func Invoked for each key/val pair.
 * @param {?*} context
 * @return {?object} Result of mapping or null if obj is falsey
 */
function objMapKeyVal(obj, func, context) {
  if (!obj) {
    return null;
  }
  var i = 0;
  var ret = {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      ret[key] = func.call(context, key, obj[key], i++);
    }
  }
  return ret;
}

module.exports = objMapKeyVal;

},{}],151:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule onlyChild
 */
"use strict";

var ReactComponent = require("./ReactComponent");

var invariant = require("./invariant");

/**
 * Returns the first child in a collection of children and verifies that there
 * is only one child in the collection. The current implementation of this
 * function assumes that a single child gets passed without a wrapper, but the
 * purpose of this helper function is to abstract away the particular structure
 * of children.
 *
 * @param {?object} children Child collection structure.
 * @return {ReactComponent} The first and only `ReactComponent` contained in the
 * structure.
 */
function onlyChild(children) {
  ("production" !== process.env.NODE_ENV ? invariant(
    ReactComponent.isValidComponent(children),
    'onlyChild must be passed a children with exactly one child.'
  ) : invariant(ReactComponent.isValidComponent(children)));
  return children;
}

module.exports = onlyChild;

}).call(this,require("qvMYcC"))
},{"./ReactComponent":41,"./invariant":135,"qvMYcC":161}],152:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule performanceNow
 * @typechecks static-only
 */

"use strict";

var ExecutionEnvironment = require("./ExecutionEnvironment");

/**
 * Detect if we can use window.performance.now() and gracefully
 * fallback to Date.now() if it doesn't exist.
 * We need to support Firefox < 15 for now due to Facebook's webdriver
 * infrastructure.
 */
var performance = null;

if (ExecutionEnvironment.canUseDOM) {
  performance = window.performance || window.webkitPerformance;
}

if (!performance || !performance.now) {
  performance = Date;
}

var performanceNow = performance.now.bind(performance);

module.exports = performanceNow;

},{"./ExecutionEnvironment":31}],153:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule shallowEqual
 */

"use strict";

/**
 * Performs equality by iterating through keys on an object and returning
 * false when any key has values which are not strictly equal between
 * objA and objB. Returns true when the values of all keys are strictly equal.
 *
 * @return {boolean}
 */
function shallowEqual(objA, objB) {
  if (objA === objB) {
    return true;
  }
  var key;
  // Test for A's keys different from B.
  for (key in objA) {
    if (objA.hasOwnProperty(key) &&
        (!objB.hasOwnProperty(key) || objA[key] !== objB[key])) {
      return false;
    }
  }
  // Test for B'a keys missing from A.
  for (key in objB) {
    if (objB.hasOwnProperty(key) && !objA.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

module.exports = shallowEqual;

},{}],154:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule shouldUpdateReactComponent
 * @typechecks static-only
 */

"use strict";

/**
 * Given a `prevComponentInstance` and `nextComponent`, determines if
 * `prevComponentInstance` should be updated as opposed to being destroyed or
 * replaced by a new instance. The second argument is a descriptor. Future
 * versions of the reconciler should only compare descriptors to other
 * descriptors.
 *
 * @param {?object} prevComponentInstance
 * @param {?object} nextDescriptor
 * @return {boolean} True if `prevComponentInstance` should be updated.
 * @protected
 */
function shouldUpdateReactComponent(prevComponentInstance, nextDescriptor) {
  // TODO: Remove warning after a release.
  if (prevComponentInstance && nextDescriptor &&
      prevComponentInstance.constructor === nextDescriptor.constructor && (
        (prevComponentInstance.props && prevComponentInstance.props.key) ===
        (nextDescriptor.props && nextDescriptor.props.key)
      )) {
    if (prevComponentInstance._owner === nextDescriptor._owner) {
      return true;
    } else {
      if ("production" !== process.env.NODE_ENV) {
        if (prevComponentInstance.state) {
          console.warn(
            'A recent change to React has been found to impact your code. ' +
            'A mounted component will now be unmounted and replaced by a ' +
            'component (of the same class) if their owners are different. ' +
            'Previously, ownership was not considered when updating.',
            prevComponentInstance,
            nextDescriptor
          );
        }
      }
    }
  }
  return false;
}

module.exports = shouldUpdateReactComponent;

}).call(this,require("qvMYcC"))
},{"qvMYcC":161}],155:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule toArray
 * @typechecks
 */

var invariant = require("./invariant");

/**
 * Convert array-like objects to arrays.
 *
 * This API assumes the caller knows the contents of the data type. For less
 * well defined inputs use createArrayFrom.
 *
 * @param {object|function} obj
 * @return {array}
 */
function toArray(obj) {
  var length = obj.length;

  // Some browse builtin objects can report typeof 'function' (e.g. NodeList in
  // old versions of Safari).
  ("production" !== process.env.NODE_ENV ? invariant(
    !Array.isArray(obj) &&
    (typeof obj === 'object' || typeof obj === 'function'),
    'toArray: Array-like object expected'
  ) : invariant(!Array.isArray(obj) &&
  (typeof obj === 'object' || typeof obj === 'function')));

  ("production" !== process.env.NODE_ENV ? invariant(
    typeof length === 'number',
    'toArray: Object needs a length property'
  ) : invariant(typeof length === 'number'));

  ("production" !== process.env.NODE_ENV ? invariant(
    length === 0 ||
    (length - 1) in obj,
    'toArray: Object should have keys for indices'
  ) : invariant(length === 0 ||
  (length - 1) in obj));

  // Old IE doesn't give collections access to hasOwnProperty. Assume inputs
  // without method will throw during the slice call and skip straight to the
  // fallback.
  if (obj.hasOwnProperty) {
    try {
      return Array.prototype.slice.call(obj);
    } catch (e) {
      // IE < 9 does not support Array#slice on collections objects
    }
  }

  // Fall back to copying key by key. This assumes all keys have a value,
  // so will not preserve sparsely populated inputs.
  var ret = Array(length);
  for (var ii = 0; ii < length; ii++) {
    ret[ii] = obj[ii];
  }
  return ret;
}

module.exports = toArray;

}).call(this,require("qvMYcC"))
},{"./invariant":135,"qvMYcC":161}],156:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule traverseAllChildren
 */

"use strict";

var ReactInstanceHandles = require("./ReactInstanceHandles");
var ReactTextComponent = require("./ReactTextComponent");

var invariant = require("./invariant");

var SEPARATOR = ReactInstanceHandles.SEPARATOR;
var SUBSEPARATOR = ':';

/**
 * TODO: Test that:
 * 1. `mapChildren` transforms strings and numbers into `ReactTextComponent`.
 * 2. it('should fail when supplied duplicate key', function() {
 * 3. That a single child and an array with one item have the same key pattern.
 * });
 */

var userProvidedKeyEscaperLookup = {
  '=': '=0',
  '.': '=1',
  ':': '=2'
};

var userProvidedKeyEscapeRegex = /[=.:]/g;

function userProvidedKeyEscaper(match) {
  return userProvidedKeyEscaperLookup[match];
}

/**
 * Generate a key string that identifies a component within a set.
 *
 * @param {*} component A component that could contain a manual key.
 * @param {number} index Index that is used if a manual key is not provided.
 * @return {string}
 */
function getComponentKey(component, index) {
  if (component && component.props && component.props.key != null) {
    // Explicit key
    return wrapUserProvidedKey(component.props.key);
  }
  // Implicit key determined by the index in the set
  return index.toString(36);
}

/**
 * Escape a component key so that it is safe to use in a reactid.
 *
 * @param {*} key Component key to be escaped.
 * @return {string} An escaped string.
 */
function escapeUserProvidedKey(text) {
  return ('' + text).replace(
    userProvidedKeyEscapeRegex,
    userProvidedKeyEscaper
  );
}

/**
 * Wrap a `key` value explicitly provided by the user to distinguish it from
 * implicitly-generated keys generated by a component's index in its parent.
 *
 * @param {string} key Value of a user-provided `key` attribute
 * @return {string}
 */
function wrapUserProvidedKey(key) {
  return '$' + escapeUserProvidedKey(key);
}

/**
 * @param {?*} children Children tree container.
 * @param {!string} nameSoFar Name of the key path so far.
 * @param {!number} indexSoFar Number of children encountered until this point.
 * @param {!function} callback Callback to invoke with each child found.
 * @param {?*} traverseContext Used to pass information throughout the traversal
 * process.
 * @return {!number} The number of children in this subtree.
 */
var traverseAllChildrenImpl =
  function(children, nameSoFar, indexSoFar, callback, traverseContext) {
    var subtreeCount = 0;  // Count of children found in the current subtree.
    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; i++) {
        var child = children[i];
        var nextName = (
          nameSoFar +
          (nameSoFar ? SUBSEPARATOR : SEPARATOR) +
          getComponentKey(child, i)
        );
        var nextIndex = indexSoFar + subtreeCount;
        subtreeCount += traverseAllChildrenImpl(
          child,
          nextName,
          nextIndex,
          callback,
          traverseContext
        );
      }
    } else {
      var type = typeof children;
      var isOnlyChild = nameSoFar === '';
      // If it's the only child, treat the name as if it was wrapped in an array
      // so that it's consistent if the number of children grows
      var storageName =
        isOnlyChild ? SEPARATOR + getComponentKey(children, 0) : nameSoFar;
      if (children == null || type === 'boolean') {
        // All of the above are perceived as null.
        callback(traverseContext, null, storageName, indexSoFar);
        subtreeCount = 1;
      } else if (children.type && children.type.prototype &&
                 children.type.prototype.mountComponentIntoNode) {
        callback(traverseContext, children, storageName, indexSoFar);
        subtreeCount = 1;
      } else {
        if (type === 'object') {
          ("production" !== process.env.NODE_ENV ? invariant(
            !children || children.nodeType !== 1,
            'traverseAllChildren(...): Encountered an invalid child; DOM ' +
            'elements are not valid children of React components.'
          ) : invariant(!children || children.nodeType !== 1));
          for (var key in children) {
            if (children.hasOwnProperty(key)) {
              subtreeCount += traverseAllChildrenImpl(
                children[key],
                (
                  nameSoFar + (nameSoFar ? SUBSEPARATOR : SEPARATOR) +
                  wrapUserProvidedKey(key) + SUBSEPARATOR +
                  getComponentKey(children[key], 0)
                ),
                indexSoFar + subtreeCount,
                callback,
                traverseContext
              );
            }
          }
        } else if (type === 'string') {
          var normalizedText = new ReactTextComponent(children);
          callback(traverseContext, normalizedText, storageName, indexSoFar);
          subtreeCount += 1;
        } else if (type === 'number') {
          var normalizedNumber = new ReactTextComponent('' + children);
          callback(traverseContext, normalizedNumber, storageName, indexSoFar);
          subtreeCount += 1;
        }
      }
    }
    return subtreeCount;
  };

/**
 * Traverses children that are typically specified as `props.children`, but
 * might also be specified through attributes:
 *
 * - `traverseAllChildren(this.props.children, ...)`
 * - `traverseAllChildren(this.props.leftPanelChildren, ...)`
 *
 * The `traverseContext` is an optional argument that is passed through the
 * entire traversal. It can be used to store accumulations or anything else that
 * the callback might find relevant.
 *
 * @param {?*} children Children tree object.
 * @param {!function} callback To invoke upon traversing each child.
 * @param {?*} traverseContext Context for traversal.
 */
function traverseAllChildren(children, callback, traverseContext) {
  if (children !== null && children !== undefined) {
    traverseAllChildrenImpl(children, '', 0, callback, traverseContext);
  }
}

module.exports = traverseAllChildren;

}).call(this,require("qvMYcC"))
},{"./ReactInstanceHandles":67,"./ReactTextComponent":87,"./invariant":135,"qvMYcC":161}],157:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule update
 */

"use strict";

var copyProperties = require("./copyProperties");
var keyOf = require("./keyOf");
var invariant = require("./invariant");

function shallowCopy(x) {
  if (Array.isArray(x)) {
    return x.concat();
  } else if (x && typeof x === 'object') {
    return copyProperties(new x.constructor(), x);
  } else {
    return x;
  }
}

var DIRECTIVE_PUSH = keyOf({$push: null});
var DIRECTIVE_UNSHIFT = keyOf({$unshift: null});
var DIRECTIVE_SPLICE = keyOf({$splice: null});
var DIRECTIVE_SET = keyOf({$set: null});
var DIRECTIVE_MERGE = keyOf({$merge: null});

var ALL_DIRECTIVES_LIST = [
  DIRECTIVE_PUSH,
  DIRECTIVE_UNSHIFT,
  DIRECTIVE_SPLICE,
  DIRECTIVE_SET,
  DIRECTIVE_MERGE
];

var ALL_DIRECTIVES_SET = {};

ALL_DIRECTIVES_LIST.forEach(function(directive) {
  ALL_DIRECTIVES_SET[directive] = true;
});

function invariantArrayCase(value, spec, directive) {
  ("production" !== process.env.NODE_ENV ? invariant(
    Array.isArray(value),
    'update(): expected target of %s to be an array; got %s.',
    directive,
    value
  ) : invariant(Array.isArray(value)));
  var specValue = spec[directive];
  ("production" !== process.env.NODE_ENV ? invariant(
    Array.isArray(specValue),
    'update(): expected spec of %s to be an array; got %s. ' +
    'Did you forget to wrap your parameter in an array?',
    directive,
    specValue
  ) : invariant(Array.isArray(specValue)));
}

function update(value, spec) {
  ("production" !== process.env.NODE_ENV ? invariant(
    typeof spec === 'object',
    'update(): You provided a key path to update() that did not contain one ' +
    'of %s. Did you forget to include {%s: ...}?',
    ALL_DIRECTIVES_LIST.join(', '),
    DIRECTIVE_SET
  ) : invariant(typeof spec === 'object'));

  if (spec.hasOwnProperty(DIRECTIVE_SET)) {
    ("production" !== process.env.NODE_ENV ? invariant(
      Object.keys(spec).length === 1,
      'Cannot have more than one key in an object with %s',
      DIRECTIVE_SET
    ) : invariant(Object.keys(spec).length === 1));

    return spec[DIRECTIVE_SET];
  }

  var nextValue = shallowCopy(value);

  if (spec.hasOwnProperty(DIRECTIVE_MERGE)) {
    var mergeObj = spec[DIRECTIVE_MERGE];
    ("production" !== process.env.NODE_ENV ? invariant(
      mergeObj && typeof mergeObj === 'object',
      'update(): %s expects a spec of type \'object\'; got %s',
      DIRECTIVE_MERGE,
      mergeObj
    ) : invariant(mergeObj && typeof mergeObj === 'object'));
    ("production" !== process.env.NODE_ENV ? invariant(
      nextValue && typeof nextValue === 'object',
      'update(): %s expects a target of type \'object\'; got %s',
      DIRECTIVE_MERGE,
      nextValue
    ) : invariant(nextValue && typeof nextValue === 'object'));
    copyProperties(nextValue, spec[DIRECTIVE_MERGE]);
  }

  if (spec.hasOwnProperty(DIRECTIVE_PUSH)) {
    invariantArrayCase(value, spec, DIRECTIVE_PUSH);
    spec[DIRECTIVE_PUSH].forEach(function(item) {
      nextValue.push(item);
    });
  }

  if (spec.hasOwnProperty(DIRECTIVE_UNSHIFT)) {
    invariantArrayCase(value, spec, DIRECTIVE_UNSHIFT);
    spec[DIRECTIVE_UNSHIFT].forEach(function(item) {
      nextValue.unshift(item);
    });
  }

  if (spec.hasOwnProperty(DIRECTIVE_SPLICE)) {
    ("production" !== process.env.NODE_ENV ? invariant(
      Array.isArray(value),
      'Expected %s target to be an array; got %s',
      DIRECTIVE_SPLICE,
      value
    ) : invariant(Array.isArray(value)));
    ("production" !== process.env.NODE_ENV ? invariant(
      Array.isArray(spec[DIRECTIVE_SPLICE]),
      'update(): expected spec of %s to be an array of arrays; got %s. ' +
      'Did you forget to wrap your parameters in an array?',
      DIRECTIVE_SPLICE,
      spec[DIRECTIVE_SPLICE]
    ) : invariant(Array.isArray(spec[DIRECTIVE_SPLICE])));
    spec[DIRECTIVE_SPLICE].forEach(function(args) {
      ("production" !== process.env.NODE_ENV ? invariant(
        Array.isArray(args),
        'update(): expected spec of %s to be an array of arrays; got %s. ' +
        'Did you forget to wrap your parameters in an array?',
        DIRECTIVE_SPLICE,
        spec[DIRECTIVE_SPLICE]
      ) : invariant(Array.isArray(args)));
      nextValue.splice.apply(nextValue, args);
    });
  }

  for (var k in spec) {
    if (!ALL_DIRECTIVES_SET[k]) {
      nextValue[k] = update(value[k], spec[k]);
    }
  }

  return nextValue;
}

module.exports = update;

}).call(this,require("qvMYcC"))
},{"./copyProperties":112,"./invariant":135,"./keyOf":142,"qvMYcC":161}],158:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule warning
 */

"use strict";

var emptyFunction = require("./emptyFunction");

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = emptyFunction;

if ("production" !== process.env.NODE_ENV) {
  warning = function(condition, format ) {var args=Array.prototype.slice.call(arguments,2);
    if (format === undefined) {
      throw new Error(
        '`warning(condition, format, ...args)` requires a warning ' +
        'message argument'
      );
    }

    if (!condition) {
      var argIndex = 0;
      console.warn('Warning: ' + format.replace(/%s/g, function()  {return args[argIndex++];}));
    }
  };
}

module.exports = warning;

}).call(this,require("qvMYcC"))
},{"./emptyFunction":119,"qvMYcC":161}],159:[function(require,module,exports){
module.exports = require('./lib/React');

},{"./lib/React":36}],160:[function(require,module,exports){
// TinyTinyColor v0.0.0
// https://github.com/autopulated/TinyTinyColor
// 2013-08-10, Brian Grinstead, MIT License
// 2014, James Crosby, MIT License
//
// Like TinyColor, but even smaller (who uses named colours anyway)

(function() {

var trimLeft = /^[\s,#]+/,
    trimRight = /\s+$/,
    tinyCounter = 0,
    math = Math,
    mathRound = math.round,
    mathMin = math.min,
    mathMax = math.max;

var tinycolor = function tinycolor (color, opts) {

    color = (color) ? color : '';
    opts = opts || { };

    // If input is already a tinycolor, return itself
    if (color instanceof tinycolor) {
       return color;
    }
    // If we are called as a function, call using new instead
    if (!(this instanceof tinycolor)) {
        return new tinycolor(color, opts);
    }

    var rgb = inputToRGB(color);
    this._r = rgb.r,
    this._g = rgb.g,
    this._b = rgb.b,
    this._a = rgb.a,
    this._roundA = mathRound(100*this._a) / 100,
    this._format = opts.format || rgb.format;
    this._gradientType = opts.gradientType;

    // Don't let the range of [0,255] come back in [0,1].
    // Potentially lose a little bit of precision here, but will fix issues where
    // .5 gets interpreted as half of the total, instead of half of 1
    // If it was supposed to be 128, this was already taken care of by `inputToRgb`
    if (this._r < 1) { this._r = mathRound(this._r); }
    if (this._g < 1) { this._g = mathRound(this._g); }
    if (this._b < 1) { this._b = mathRound(this._b); }

    this._ok = rgb.ok;
    this._tc_id = tinyCounter++;
};

tinycolor.prototype = {
    getAlpha: function() {
        return this._a;
    },
    setAlpha: function(value) {
        this._a = boundAlpha(value);
        this._roundA = mathRound(100*this._a) / 100;
    },
    toHsv: function() {
        var hsv = rgbToHsv(this._r, this._g, this._b);
        return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this._a };
    },
    toHsvString: function() {
        var hsv = rgbToHsv(this._r, this._g, this._b);
        var h = mathRound(hsv.h * 360), s = mathRound(hsv.s * 100), v = mathRound(hsv.v * 100);
        return (this._a == 1) ?
          "hsv("  + h + ", " + s + "%, " + v + "%)" :
          "hsva(" + h + ", " + s + "%, " + v + "%, "+ this._roundA + ")";
    },
    toHsl: function() {
        var hsl = rgbToHsl(this._r, this._g, this._b);
        return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this._a };
    },
    toHslString: function() {
        var hsl = rgbToHsl(this._r, this._g, this._b);
        var h = mathRound(hsl.h * 360), s = mathRound(hsl.s * 100), l = mathRound(hsl.l * 100);
        return (this._a == 1) ?
          "hsl("  + h + ", " + s + "%, " + l + "%)" :
          "hsla(" + h + ", " + s + "%, " + l + "%, "+ this._roundA + ")";
    },
    toHex: function(allow3Char) {
        return rgbToHex(this._r, this._g, this._b, allow3Char);
    },
    toHexString: function(allow3Char) {
        return '#' + this.toHex(allow3Char);
    },
    toHex8: function() {
        return rgbaToHex(this._r, this._g, this._b, this._a);
    },
    toHex8String: function() {
        return '#' + this.toHex8();
    },
    toRgb: function() {
        return { r: mathRound(this._r), g: mathRound(this._g), b: mathRound(this._b), a: this._a };
    },
    toRgbString: function() {
        return (this._a == 1) ?
          "rgb("  + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ")" :
          "rgba(" + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ", " + this._roundA + ")";
    },
    toFilter: function(secondColor) {
        var hex8String = '#' + rgbaToHex(this._r, this._g, this._b, this._a);
        var secondHex8String = hex8String;
        var gradientType = this._gradientType ? "GradientType = 1, " : "";

        if (secondColor) {
            var s = tinycolor(secondColor);
            secondHex8String = s.toHex8String();
        }

        return "progid:DXImageTransform.Microsoft.gradient("+gradientType+"startColorstr="+hex8String+",endColorstr="+secondHex8String+")";
    }
};

// If input is an object, force 1 into "1.0" to handle ratios properly
// String input requires "1.0" as input, so 1 will be treated as 1
tinycolor.fromRatio = function(color, opts) {
    if (typeof color == "object") {
        var newColor = {};
        for (var i in color) {
            if (color.hasOwnProperty(i)) {
                if (i === "a") {
                    newColor[i] = color[i];
                }
                else {
                    newColor[i] = convertToPercentage(color[i]);
                }
            }
        }
        color = newColor;
    }

    return tinycolor(color, opts);
};

// Given a string or object, convert that input to RGB
// Possible string inputs:
//
//     "red"
//     "#f00" or "f00"
//     "#ff0000" or "ff0000"
//     "#ff000000" or "ff000000"
//     "rgb 255 0 0" or "rgb (255, 0, 0)"
//     "rgb 1.0 0 0" or "rgb (1, 0, 0)"
//     "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
//     "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
//     "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
//     "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
//     "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
//
function inputToRGB(color) {

    var rgb = { r: 0, g: 0, b: 0 };
    var a = 1;
    var ok = false;
    var format = false;

    if (typeof color == "string") {
        color = stringInputToObject(color);
    }

    if (typeof color == "object") {
        if (color.hasOwnProperty("r") && color.hasOwnProperty("g") && color.hasOwnProperty("b")) {
            rgb = rgbToRgb(color.r, color.g, color.b);
            ok = true;
            format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
        }
        else if (color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("v")) {
            color.s = convertToPercentage(color.s);
            color.v = convertToPercentage(color.v);
            rgb = hsvToRgb(color.h, color.s, color.v);
            ok = true;
            format = "hsv";
        }
        else if (color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("l")) {
            color.s = convertToPercentage(color.s);
            color.l = convertToPercentage(color.l);
            rgb = hslToRgb(color.h, color.s, color.l);
            ok = true;
            format = "hsl";
        }

        if (color.hasOwnProperty("a")) {
            a = color.a;
        }
    }

    a = boundAlpha(a);

    return {
        ok: ok,
        format: color.format || format,
        r: mathMin(255, mathMax(rgb.r, 0)),
        g: mathMin(255, mathMax(rgb.g, 0)),
        b: mathMin(255, mathMax(rgb.b, 0)),
        a: a
    };
}


// Conversion Functions
// --------------------

// `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
// <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>

// `rgbToRgb`
// Handle bounds / percentage checking to conform to CSS color spec
// <http://www.w3.org/TR/css3-color/>
// *Assumes:* r, g, b in [0, 255] or [0, 1]
// *Returns:* { r, g, b } in [0, 255]
function rgbToRgb(r, g, b){
    return {
        r: bound01(r, 255) * 255,
        g: bound01(g, 255) * 255,
        b: bound01(b, 255) * 255
    };
}

// `rgbToHsl`
// Converts an RGB color value to HSL.
// *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
// *Returns:* { h, s, l } in [0,1]
function rgbToHsl(r, g, b) {

    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);

    var max = mathMax(r, g, b), min = mathMin(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min) {
        h = s = 0; // achromatic
    }
    else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    return { h: h, s: s, l: l };
}

// `hslToRgb`
// Converts an HSL color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
function hslToRgb(h, s, l) {
    var r, g, b;

    h = bound01(h, 360);
    s = bound01(s, 100);
    l = bound01(l, 100);

    function hue2rgb(p, q, t) {
        if(t < 0) t += 1;
        if(t > 1) t -= 1;
        if(t < 1/6) return p + (q - p) * 6 * t;
        if(t < 1/2) return q;
        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    }

    if(s === 0) {
        r = g = b = l; // achromatic
    }
    else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return { r: r * 255, g: g * 255, b: b * 255 };
}

// `rgbToHsv`
// Converts an RGB color value to HSV
// *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
// *Returns:* { h, s, v } in [0,1]
function rgbToHsv(r, g, b) {

    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);

    var max = mathMax(r, g, b), min = mathMin(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max === 0 ? 0 : d / max;

    if(max == min) {
        h = 0; // achromatic
    }
    else {
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h, s: s, v: v };
}

// `hsvToRgb`
// Converts an HSV color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
 function hsvToRgb(h, s, v) {

    h = bound01(h, 360) * 6;
    s = bound01(s, 100);
    v = bound01(v, 100);

    var i = math.floor(h),
        f = h - i,
        p = v * (1 - s),
        q = v * (1 - f * s),
        t = v * (1 - (1 - f) * s),
        mod = i % 6,
        r = [v, q, p, p, t, v][mod],
        g = [t, v, v, q, p, p][mod],
        b = [p, p, t, v, v, q][mod];

    return { r: r * 255, g: g * 255, b: b * 255 };
}

// `rgbToHex`
// Converts an RGB color to hex
// Assumes r, g, and b are contained in the set [0, 255]
// Returns a 3 or 6 character hex
function rgbToHex(r, g, b, allow3Char) {

    var hex = [
        pad2(mathRound(r).toString(16)),
        pad2(mathRound(g).toString(16)),
        pad2(mathRound(b).toString(16))
    ];

    // Return a 3 character hex if possible
    if (allow3Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)) {
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
    }

    return hex.join("");
}
    // `rgbaToHex`
    // Converts an RGBA color plus alpha transparency to hex
    // Assumes r, g, b and a are contained in the set [0, 255]
    // Returns an 8 character hex
    function rgbaToHex(r, g, b, a) {

        var hex = [
            pad2(convertDecimalToHex(a)),
            pad2(mathRound(r).toString(16)),
            pad2(mathRound(g).toString(16)),
            pad2(mathRound(b).toString(16))
        ];

        return hex.join("");
    }

// `equals`
// Can be called with any tinycolor input
tinycolor.equals = function (color1, color2) {
    if (!color1 || !color2) { return false; }
    return tinycolor(color1).toRgbString() == tinycolor(color2).toRgbString();
};


// Modification Functions
// ----------------------
// Thanks to less.js for some of the basics here
// <https://github.com/cloudhead/less.js/blob/master/lib/less/functions.js>

tinycolor.desaturate = function (color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.s -= amount / 100;
    hsl.s = clamp01(hsl.s);
    return tinycolor(hsl);
};
tinycolor.saturate = function (color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.s += amount / 100;
    hsl.s = clamp01(hsl.s);
    return tinycolor(hsl);
};
tinycolor.greyscale = function(color) {
    return tinycolor.desaturate(color, 100);
};
tinycolor.lighten = function(color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.l += amount / 100;
    hsl.l = clamp01(hsl.l);
    return tinycolor(hsl);
};
tinycolor.darken = function (color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.l -= amount / 100;
    hsl.l = clamp01(hsl.l);
    return tinycolor(hsl);
};
tinycolor.complement = function(color) {
    var hsl = tinycolor(color).toHsl();
    hsl.h = (hsl.h + 180) % 360;
    return tinycolor(hsl);
};


// Combination Functions
// ---------------------
// Thanks to jQuery xColor for some of the ideas behind these
// <https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js>

tinycolor.triad = function(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [
        tinycolor(color),
        tinycolor({ h: (h + 120) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 240) % 360, s: hsl.s, l: hsl.l })
    ];
};
tinycolor.tetrad = function(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [
        tinycolor(color),
        tinycolor({ h: (h + 90) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 180) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 270) % 360, s: hsl.s, l: hsl.l })
    ];
};
tinycolor.splitcomplement = function(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [
        tinycolor(color),
        tinycolor({ h: (h + 72) % 360, s: hsl.s, l: hsl.l}),
        tinycolor({ h: (h + 216) % 360, s: hsl.s, l: hsl.l})
    ];
};
tinycolor.analogous = function(color, results, slices) {
    results = results || 6;
    slices = slices || 30;

    var hsl = tinycolor(color).toHsl();
    var part = 360 / slices;
    var ret = [tinycolor(color)];

    for (hsl.h = ((hsl.h - (part * results >> 1)) + 720) % 360; --results; ) {
        hsl.h = (hsl.h + part) % 360;
        ret.push(tinycolor(hsl));
    }
    return ret;
};
tinycolor.monochromatic = function(color, results) {
    results = results || 6;
    var hsv = tinycolor(color).toHsv();
    var h = hsv.h, s = hsv.s, v = hsv.v;
    var ret = [];
    var modification = 1 / results;

    while (results--) {
        ret.push(tinycolor({ h: h, s: s, v: v}));
        v = (v + modification) % 1;
    }

    return ret;
};


// Utilities
// ---------


// Return a valid alpha value [0,1] with all invalid values being set to 1
function boundAlpha(a) {
    a = parseFloat(a);

    if (isNaN(a) || a < 0 || a > 1) {
        a = 1;
    }

    return a;
}

// Take input from [0, n] and return it as [0, 1]
function bound01(n, max) {
    if (isOnePointZero(n)) { n = "100%"; }

    var processPercent = isPercentage(n);
    n = mathMin(max, mathMax(0, parseFloat(n)));

    // Automatically convert percentage into number
    if (processPercent) {
        n = parseInt(n * max, 10) / 100;
    }

    // Handle floating point rounding errors
    if ((math.abs(n - max) < 0.000001)) {
        return 1;
    }

    // Convert into [0, 1] range if it isn't already
    return (n % max) / parseFloat(max);
}

// Force a number between 0 and 1
function clamp01(val) {
    return mathMin(1, mathMax(0, val));
}

// Parse a base-16 hex value into a base-10 integer
function parseIntFromHex(val) {
    return parseInt(val, 16);
}

// Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
// <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
function isOnePointZero(n) {
    return typeof n == "string" && n.indexOf('.') != -1 && parseFloat(n) === 1;
}

// Check to see if string passed in is a percentage
function isPercentage(n) {
    return typeof n === "string" && n.indexOf('%') != -1;
}

// Force a hex value to have 2 characters
function pad2(c) {
    return c.length == 1 ? '0' + c : '' + c;
}

// Replace a decimal with it's percentage value
function convertToPercentage(n) {
    if (n <= 1) {
        n = (n * 100) + "%";
    }

    return n;
}

// Converts a decimal to a hex value
function convertDecimalToHex(d) {
    return Math.round(parseFloat(d) * 255).toString(16);
}
// Converts a hex value to a decimal
function convertHexToDecimal(h) {
    return (parseIntFromHex(h) / 255);
}

var matchers = (function() {

    // <http://www.w3.org/TR/css3-values/#integers>
    var CSS_INTEGER = "[-\\+]?\\d+%?";

    // <http://www.w3.org/TR/css3-values/#number-value>
    var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";

    // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
    var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";

    // Actual matching.
    // Parentheses and commas are optional, but not required.
    // Whitespace can take the place of commas or opening paren
    var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
    var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";

    return {
        rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
        rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
        hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
        hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
        hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
        hex3: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
        hex6: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
        hex8: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
    };
})();

// `stringInputToObject`
// Permissive string parsing.  Take in a number of formats, and output an object
// based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
function stringInputToObject(color) {

    color = color.replace(trimLeft,'').replace(trimRight, '').toLowerCase();

    // Try to match string input using regular expressions.
    // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
    // Just return an object and let the conversion functions handle that.
    // This way the result will be the same whether the tinycolor is initialized with string or object.
    var match;
    if ((match = matchers.rgb.exec(color))) {
        return { r: match[1], g: match[2], b: match[3] };
    }
    if ((match = matchers.rgba.exec(color))) {
        return { r: match[1], g: match[2], b: match[3], a: match[4] };
    }
    if ((match = matchers.hsl.exec(color))) {
        return { h: match[1], s: match[2], l: match[3] };
    }
    if ((match = matchers.hsla.exec(color))) {
        return { h: match[1], s: match[2], l: match[3], a: match[4] };
    }
    if ((match = matchers.hsv.exec(color))) {
        return { h: match[1], s: match[2], v: match[3] };
    }
    if ((match = matchers.hex8.exec(color))) {
        return {
            a: convertHexToDecimal(match[1]),
            r: parseIntFromHex(match[2]),
            g: parseIntFromHex(match[3]),
            b: parseIntFromHex(match[4]),
            format: "hex8"
        };
    }
    if ((match = matchers.hex6.exec(color))) {
        return {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            format: "hex"
        };
    }
    if ((match = matchers.hex3.exec(color))) {
        return {
            r: parseIntFromHex(match[1] + '' + match[1]),
            g: parseIntFromHex(match[2] + '' + match[2]),
            b: parseIntFromHex(match[3] + '' + match[3]),
            format: "hex"
        };
    }

    return false;
}

// Node: Export function
if (typeof module !== "undefined" && module.exports) {
    module.exports = tinycolor;
}
// AMD/requirejs: Define the module
else if (typeof define === 'function' && define.amd) {
    define(function () {return tinycolor;});
}
// Browser: Expose to window
else {
    window.tinytinycolor = tinycolor;
}

})();

},{}],161:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}]},{},[1])