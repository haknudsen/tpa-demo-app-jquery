
function onUpdate(key, value) {
  Wix.Settings.triggerSettingsUpdatedEvent({key: key, value: value});
}

function attachListeners() {
  $('[wix-ctrl]').each(function (index, element) {
    var $element = $(element);
    var ctrl = $element.getCtrl();
    if ($.isFunction(ctrl.onChange)) {
      ctrl.onChange(function (value) {
        onUpdate($element.attr('wix-param'), value);
      })
    }
  });

  $('#main-cta').getCtrl().onClick(function () {
    console.log('This is your call-to-action, take it seriously');
  })
}

$(attachListeners);
