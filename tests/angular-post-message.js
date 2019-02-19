(function() {
  'use strict';
  describe("ngPostMessage", function() {
    var $rootScope, messages, postMessage, $window;
    postMessage = null;
    $rootScope = null;
    $window = null;
    messages = null;
    beforeEach(function () {
      module("ngPostMessage",function ($provide) {
        $provide.factory('$window', function () {
          var wnd = window.open("about:blank", "", "_blank");
          wnd.document.write('<div>')
          return wnd;
        });
      });
    });
    beforeEach(inject(function(_$rootScope_, _$postMessage_, _$window_) {
      $rootScope = _$rootScope_;
      $window = _$window_;
      $window.name = $rootScope.$id;
      $window.document.title = 'RootScope:' + $rootScope.$id;
      postMessage = _$postMessage_;
      messages = ["foo", "bar", '{ "foo": "bar" }', { foo: "bar" }];
    }));
    it("has no messages", function() {
      expect(postMessage.messages[0]).toBeUndefined();
      $window.close();
    });
    it("stores message into array", function() {
      var m, msg;
      msg = "hello world";
      m = postMessage.messages(msg);
      expect(m[0]).toEqual(msg);
      $window.close();
    });
    describe("lastMessage()", function() {
      it("returns the last posted message", function() {
        postMessage.messages('hello world');
        expect(postMessage.lastMessage()).toEqual("hello world");
        $window.close();
      });
    });
    it("should broadcast an outgoing message", function() {
      var outgoingMessageListener;
      outgoingMessageListener = jasmine.createSpy("listener");
      $rootScope.$on("$messageOutgoing", outgoingMessageListener);
      postMessage.post(messages[0]);
      expect(outgoingMessageListener).toHaveBeenCalled();
      $window.close();
    });

    it("should broadcast the correct outgoing message", function() {
      var outgoingMessageListener;
      outgoingMessageListener = jasmine.createSpy("listener");
      $rootScope.$on("$messageOutgoing", outgoingMessageListener);
      postMessage.post(messages[0]);
      expect(outgoingMessageListener.calls.first().args[1]).toEqual(messages[0]);
      $window.close();
    });

    it("should broadcast the correct outgoing message with sender", function() {
      var outgoingMessageListener;
      outgoingMessageListener = jasmine.createSpy("listener");
      $rootScope.$on("$messageOutgoing", outgoingMessageListener);
      postMessage.post(messages[0],null,$window);
      expect(outgoingMessageListener.calls.first().args[2]).toEqual(null);
      expect(outgoingMessageListener.calls.first().args[3]).toEqual($window);
      $window.close();
    });

    it("should add data to object for valid JSON data", function(done) {
      var off = $rootScope.$on("$messageIncoming", function(e, message) {
        expect(message.foo).toEqual(messages[3].foo);
        off();
        done();
        $window.close();
      });
      $window.postMessage(messages[2], "*");
    });

    it("should set origin for valid JSON data", function(done) {
      var off = $rootScope.$on("$messageIncoming", function(e, message) {
        expect(message.origin).not.toBeUndefined();
        off();
        done();
        $window.close();
      });
      $window.postMessage(messages[2], "*");
    });

    it("should return valid object for non JSON formatted message", function(done) {
      var off = $rootScope.$on("$messageIncoming", function(e, message) {
        expect(message.text).toEqual(messages[0]);
        off();
        done();
        $window.close();
      });
      $window.postMessage(messages[0], "*");
    });

    it("should set origin for non JSON formatted message", function(done) {
      var off = $rootScope.$on("$messageIncoming", function(e, message) {
        expect(message.origin).not.toBeUndefined();
        off();
        done();
        $window.close();
      });
      $window.postMessage(messages[0], "*");
    });

  });

}).call(this);
