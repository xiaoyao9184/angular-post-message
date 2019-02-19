(function() {
  'use strict';
  describe("ngPostMessage opener", function() {
    var _popup, _incomingMessageListener;
    _popup = null;
    _incomingMessageListener = null;
    beforeEach(function () {
      module("ngPostMessage");
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeEach(module('opener_html'));
    
    beforeEach(function(done) {
      inject(function($rootScope,$templateCache,$window) {
        var incomingMessageListener;
        incomingMessageListener = jasmine.createSpy("listener");
        $rootScope.$on("$messageIncoming", incomingMessageListener);
        _incomingMessageListener = incomingMessageListener;

        $window.name = $rootScope.$id;
        $window.document.title = 'RootScope:' + $rootScope.$id;

        var html = $templateCache.get('tests/opener.html')
        var popup = window.open("about:blank", "", "_blank");
        var doc = popup.document;
        doc.write(html);
        doc.title = 'Sub window:' + $rootScope.$id;
        _popup = popup;
        setTimeout(function() {
          done();
        }, 500);
      });
    });
    
    it('posts the message form open window', function(done) {
      inject(function() {
        expect(_incomingMessageListener.calls.first().args[1].to).toEqual("opener");
        expect(_incomingMessageListener.calls.first().args[1].msg).toEqual("hi");
        _popup.close();
        done();
      });
    });
  });

}).call(this);
