// Generated by IcedCoffeeScript 1.4.0c
(function() {
  var Continuations, Continuers, Environment, Message, RenderUtils, Util, activeStates, editor, esprima, iced, interpreter, loadFile, __iced_deferrals, __iced_k, __iced_k_noop,
    __slice = [].slice,
    _this = this;

  iced = require('iced-coffee-script/lib/coffee-script/iced').runtime;
  __iced_k = __iced_k_noop = function() {};

  esprima = require('esprima');

  Util = require('./lib/util').Util;

  interpreter = require('./lib/interpreter');

  Environment = interpreter.Environment;

  Message = (function() {
    var messageMap, silence;
    messageMap = {};
    silence = {};
    return {
      listen: function(msg, cb) {
        var _ref;
        return ((_ref = messageMap[msg]) != null ? _ref : messageMap[msg] = []).push(cb);
      },
      once: function(msg, cb) {
        return this.listen(msg, function(args) {
          var fn, i, _i, _len, _ref, _results;
          cb.apply(null, args);
          _ref = messageMap[msg];
          _results = [];
          for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
            fn = _ref[i];
            if (fn === cb) {
              messageMap[msg].splice(i, 1);
              break;
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        });
      },
      squelch: function(msg) {
        return silence[msg] = true;
      },
      unsquelch: function(msg) {
        return delete silence[msg];
      },
      send: function() {
        var args, cb, msg, _i, _len, _ref, _results;
        msg = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        if (msg in silence) return;
        _ref = messageMap[msg];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          cb = _ref[_i];
          _results.push(cb.apply(null, args));
        }
        return _results;
      }
    };
  })();

  activeStates = [];

  (function(__iced_k) {
    __iced_deferrals = new iced.Deferrals(__iced_k, {
      filename: "browser/metajs.coffee"
    });
    $(document).ready(__iced_deferrals.defer({
      lineno: 27
    }));
    __iced_deferrals._fulfill();
  })(function() {
    Continuers = {
      toFinish: function(cont, v) {
        return cont(v);
      },
      toNextStep: function(cont, v) {
        if (cont === Continuations.bottom) {
          return cont(v);
        } else {
          return Continuations.next = function() {
            return cont(v);
          };
        }
      },
      autoStep: function(cont, v) {
        var ___iced_passed_deferral, __iced_deferrals, __iced_k,
          _this = this;
        __iced_k = __iced_k_noop;
        ___iced_passed_deferral = iced.findDeferral(arguments);
        (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "browser/metajs.coffee",
            funcname: "autoStep"
          });
          setTimeout(__iced_deferrals.defer({
            lineno: 37
          }), 400);
          __iced_deferrals._fulfill();
        })(function() {
          return cont(v);
        });
      }
    };
    interpreter.evaluate = (function(original) {
      interpreter.continuer = function() {
        return Continuers.toFinish;
      };
      return function(node, env, cont, errCont) {
        var newCont;
        Message.send('interpreter:eval', node, env, cont);
        newCont = function(v) {
          var w, ___iced_passed_deferral, __iced_deferrals, __iced_k,
            _this = this;
          __iced_k = __iced_k_noop;
          ___iced_passed_deferral = iced.findDeferral(arguments);
          Message.send('interpreter:continue', node, env, cont, v);
          (function(__iced_k) {
            __iced_deferrals = new iced.Deferrals(__iced_k, {
              parent: ___iced_passed_deferral,
              filename: "browser/metajs.coffee",
              funcname: "newCont"
            });
            interpreter.continuer(__iced_deferrals.defer({
              assign_fn: (function() {
                return function() {
                  return w = arguments[0];
                };
              })(),
              lineno: 46
            }), v);
            __iced_deferrals._fulfill();
          })(function() {
            Message.send('interpreter:call-continue');
            return cont(w);
          });
        };
        return original(node, env, newCont, errCont);
      };
    })(interpreter.evaluate);
    Message.listen('interpreter:eval', function(node, env, cont) {
      cont.id = activeStates.length;
      return activeStates.push({
        node: node,
        env: env
      });
    });
    Message.listen('interpreter:continue', function(node, env, cont, v) {
      activeStates.length = cont.id + 1;
      Util.last(activeStates).value = v;
      return Message.send('state:render');
    });
    Message.listen('interpreter:call-continue', function() {
      return activeStates.pop();
    });
    Message.listen('interpreter:done', function() {
      return Message.send('state:render');
    });
    editor = $('.CodeMirror')[0].CodeMirror;
    editor.disableEditing = function() {
      if (!$('.CodeMirror').hasClass('readOnly')) {
        editor.setOption('readOnly', true);
        return $('.CodeMirror').addClass('readOnly');
      }
    };
    editor.enableEditing = function() {
      if ($('.CodeMirror').hasClass('readOnly')) {
        editor.setOption('readOnly', false);
        return $('.CodeMirror').removeClass('readOnly');
      }
    };
    editor.on('change', function() {
      activeStates = [];
      Message.send('state:render');
      return Continuations.bottom();
    });
    editor.on('focus', function() {
      var mark;
      if ((mark = $('#code').data('mark')) != null) return mark.clear();
    });
    loadFile = function() {
      var data, url, ___iced_passed_deferral, __iced_deferrals, __iced_k,
        _this = this;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      url = $('#example-box option:selected')[0].getAttribute('href');
      (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "browser/metajs.coffee",
          funcname: "loadFile"
        });
        $.ajax({
          url: url,
          dataType: 'text'
        }).done(__iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              return data = arguments[0];
            };
          })(),
          lineno: 87
        }));
        __iced_deferrals._fulfill();
      })(function() {
        return editor.setValue(data);
      });
    };
    $('#example-box').change(loadFile);
    loadFile();
    Continuations = (function() {

      function Continuations() {}

      Continuations.bottom = function() {
        Message.send('interpreter:done');
        return Continuations.next = Continuations.top;
      };

      Continuations.top = function() {
        var ast;
        ast = esprima.parse(editor.getValue(), {
          loc: true
        });
        return interpreter.evaluate(ast, new Environment, Continuations.bottom, function(e) {
          return console.log("Error: " + e, Continuations.bottom());
        });
      };

      Continuations.next = Continuations.top;

      return Continuations;

    }).call(_this);
    RenderUtils = {
      pprintNode: function(node) {
        switch (node.type) {
          case 'Identifier':
            return "Identifier '" + node.name + "'";
          case 'VariableDeclarator':
            return "VariableDeclarator '" + node.id.name + "'";
          default:
            return node.type;
        }
      },
      pprintValue: function(value) {
        var a;
        if (value instanceof interpreter.CPSFunction || typeof value === 'function') {
          return 'function';
        } else if (value === null || value === void 0) {
          return $('<span>', {
            text: value + '',
            "class": 'atom-value'
          });
        } else if (typeof value === 'number') {
          return $('<span>', {
            text: value,
            "class": 'number-value'
          });
        } else if (typeof value === 'object') {
          a = $('<a>', {
            text: value,
            href: '#',
            "class": 'object'
          });
          return a.data('value', value);
        } else {
          return value + "";
        }
      },
      htmlifyObject: function(obj) {
        var k, rv, v;
        rv = $("<div>");
        for (k in obj) {
          v = obj[k];
          rv.append("" + k + ": ", this.pprintValue(v), "<br/>");
        }
        if (rv.html() === '') {
          return rv.append("No enumerable properties found");
        } else {
          return rv;
        }
      },
      selectionFromNode: function(node) {
        var end, start, _ref;
        _ref = node.loc, start = _ref.start, end = _ref.end;
        return [
          {
            line: start.line - 1,
            ch: start.column
          }, {
            line: end.line - 1,
            ch: end.column
          }
        ];
      }
    };
    Message.listen('state:render', function() {
      var activeStatesDisplay, content, envDisplay, k, latest, li, mark, scope, state, ul, v, _i, _j, _len, _len1, _ref, _results;
      activeStatesDisplay = $('#activeStates > ul');
      activeStatesDisplay.html('');
      for (_i = 0, _len = activeStates.length; _i < _len; _i++) {
        state = activeStates[_i];
        content = $('<span>', {
          text: RenderUtils.pprintNode(state.node),
          "class": 'node'
        });
        content.data('node', state.node);
        li = activeStatesDisplay.append($('<li>', {
          html: content
        }));
        if (state.value) {
          content.after(" &rarr; " + (RenderUtils.pprintValue(state.value)));
        }
      }
      envDisplay = $('#currentEnv');
      envDisplay.html('');
      if (!(activeStates.length > 0)) {
        return editor.setSelection(editor.getCursor());
      } else {
        if ((mark = $('#code').data('mark')) != null) mark.clear();
        latest = Util.last(activeStates);
        $('#code').data('mark', editor.markText.apply(editor, __slice.call(RenderUtils.selectionFromNode(latest.node)).concat([{
          className: 'execlight'
        }])));
        _ref = latest.env.scopeChain;
        _results = [];
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          scope = _ref[_j];
          envDisplay.append($('<div>', {
            html: ul = $('<ul>')
          }));
          _results.push((function() {
            var _k, _len2, _ref1, _ref2, _results1;
            _ref1 = scope.items();
            _results1 = [];
            for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
              _ref2 = _ref1[_k], k = _ref2[0], v = _ref2[1];
              _results1.push(ul.append($('<li>', {
                html: "" + k + " &rarr; "
              }).append(RenderUtils.pprintValue(v))));
            }
            return _results1;
          })());
        }
        return _results;
      }
    });
    $('#activeStates').on('mouseover', 'li > span.node', function() {
      var mark;
      mark = editor.markText.apply(editor, __slice.call(RenderUtils.selectionFromNode($(this).data('node'))).concat([{
        className: 'mouselight'
      }]));
      return $('#activeStates').one('mouseout', 'li > span.node', function() {
        return mark.clear();
      });
    });
    $('#currentEnv, #modalContent').on('click', 'a.object', function() {
      $('#modalContent').html(RenderUtils.htmlifyObject($(this).data('value')));
      return $('#modal').show();
    });
    $(document).keydown(function(e) {
      if (e.keyCode === 27) return $('#modal').hide();
    });
    $('#modalClose').click(function() {
      return $('#modal').hide();
    });
    $('#run-btn').click(function() {
      var latestState;
      editor.disableEditing();
      interpreter.continuer = Continuers.toFinish;
      Message.squelch('state:render');
      latestState = null;
      Message.listen('interpreter:continue', function(node, env, cont, v) {
        return latestState = {
          node: node,
          env: env
        };
      });
      Message.once('interpreter:done', function() {
        Message.unsquelch('state:render');
        activeStates.push(latestState);
        Message.send('state:render');
        return activeStates.pop();
      });
      return Continuations.next();
    });
    $('#step-btn').click(function() {
      editor.disableEditing();
      interpreter.continuer = Continuers.toNextStep;
      return Continuations.next();
    });
    $('#auto-step-btn').click(function() {
      editor.disableEditing();
      if ($(this).attr('value') === 'Pause') {
        interpreter.continuer = Continuers.toNextStep;
        $(this).attr('value', 'Auto Step');
        $('#example-box').removeAttr('disabled');
        $('#step-btn').removeAttr('disabled');
        return $('#run-btn').removeAttr('disabled', 'disabled');
      } else {
        interpreter.continuer = Continuers.autoStep;
        $(this).attr('value', 'Pause');
        $('#example-box').attr('disabled', 'disabled');
        $('#step-btn').attr('disabled', 'disabled');
        $('#run-btn').attr('disabled', 'disabled');
        return Continuations.next();
      }
    });
    return Message.listen('interpreter:done', function() {
      $('#auto-step-btn').removeAttr('disabled');
      $('#example-box').removeAttr('disabled');
      $('#step-btn').removeAttr('disabled');
      $('#run-btn').removeAttr('disabled');
      $('#auto-step-btn').attr('value', 'Auto Step');
      return editor.enableEditing();
    });
  });

}).call(this);
