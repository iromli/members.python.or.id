/**
 * Initialize Data Privacy Control on the bottom left of the map
 */
function initializeDataPrivacyControl() {
  var control = L.Control.extend({
    options: {
      position: 'bottomleft'
    },
    onAdd: function (map) {
      var data_privacy_container = L.DomUtil.create('div',
          'leaflet-control-attribution');
      onDataPrivacyClick = function () {
        $('#data-privacy-modal').modal({
          backdrop: false
        });
      }
      data_privacy_container.innerHTML += "<a onclick='onDataPrivacyClick()'>Data Privacy</a>"

      //Prevent firing drag and onClickMap event when clicking this control
      var stop = L.DomEvent.stopPropagation;
      L.DomEvent
          .on(data_privacy_container, 'click', stop)
          .on(data_privacy_container, 'mousedown', stop)
          .on(data_privacy_container, 'dblclick', stop)
          .on(data_privacy_container, 'click', L.DomEvent.preventDefault);
      return data_privacy_container;
    }
  });

  return control;
}

/**
 * Initialize User Menu Control on the top left of the map.
 * @param options: Visibility of each component. False if hidden, True if visible. If None, then it will be hidden
 *
 * There are 3 menus on this control:
 * 1. add-user-menu
 * 2. edit-user-menu
 * 3. delete-user-menu
 * 4. download-menu
 * 5. reminder-menu
 *
 * Usage: initializeUserMenuControl({"add-user-menu": true, "download-menu": true}) to show add-user-menu and download-menu
 */
function initializeUserMenuControl(options) {
  // User Menu Control: Add User, Delete User
  var control = L.Control.extend({
    options: {
      position: 'topleft'
    },
    onAdd: function (map) {
      // Set HTML and CSS for it
      var user_menu_container = L.DomUtil.create('div',
          'user_menu_control btn-group-vertical');
      if (options['add-user-menu']) {
        user_menu_container.innerHTML +=
            "<button type='button' class='btn btn-default btn-sm user-menu-control' id='add-user-button' onclick='onAddUserButtonClick()' data-toggle='tooltip' data-original-title='Add me to map!'>" +
            "<span class='glyphicon glyphicon-user'></span>" +
            "</button>";
        onAddUserButtonClick = function () {
          if (current_mode != ADD_USER_MODE) {
            activateAddUserState();
        }
      };
      }
      if (options['edit-user-menu']) {
        user_menu_container.innerHTML +=
            "<button type='button' class='btn btn-default btn-sm user-menu-control' id='edit-user-button' onclick='onEditUserButtonClick()' data-toggle='tooltip' data-original-title='Edit my data!'>" +
            "<span class='glyphicon glyphicon-pencil'></span>" +
            "</button>";
        onEditUserButtonClick = function () {
          alert("It's not yet implemented!");
      };
      }
      if (options['delete-user-menu']) {
        user_menu_container.innerHTML +=
            "<button type='button' class='btn btn-default btn-sm user-menu-control' id='edit-user-button' onclick='onDeleteUserButtonClick()' data-toggle='tooltip' data-original-title='Delete me from the map!'>" +
            "<span class='glyphicon glyphicon-trash'></span>" +
            "</button>";
        onDeleteUserButtonClick = function () {
          alert("It's not yet implemented!");
        };
      }
      if (options['download-menu']) {
        user_menu_container.innerHTML +=
            "<button type='button' class='btn btn-default btn-sm user-menu-control' id='download-button' onclick='onDownloadButtonClick()' data-toggle='tooltip' data-original-title='Download all users as CSV file!'>" +
            "<span class='glyphicon glyphicon-download-alt'></span>" +
            "</button>";
        onDownloadButtonClick = function () {
          if (current_mode != DOWNLOAD_MODE) {
            activateDownloadState();
          }
        };
      }
      if (options['reminder-menu']) {
        user_menu_container.innerHTML +=
            "<button type='button' class='btn btn-default btn-sm user-menu-control' id='reminder-button' onclick='onReminderButtonClick()' data-toggle='tooltip' data-original-title='Forgot your edit link? Resend me an email!'>" +
            "<span class='glyphicon glyphicon-question-sign'></span>" +
            "</button>";
         onReminderButtonClick = function () {
           alert("It's not yet implemented!");
         };
      }

      //Prevent firing drag and onClickMap event when clicking this control
      var stop = L.DomEvent.stopPropagation;
      L.DomEvent
          .on(user_menu_container, 'click', stop)
          .on(user_menu_container, 'mousedown', stop)
          .on(user_menu_container, 'dblclick', stop)
          .on(user_menu_container, 'click', L.DomEvent.preventDefault);
      return user_menu_container
    }
  });
  return control;
}

/***-------------------- START OF STATE CONTROL----------------------- **/
/**
 * Activate Default State
 */
function activateDefaultState() {
  current_mode = DEFAULT_MODE; // Change mode to default
  map.off('click', onMapClick); // Stop onMapclick listener
  $('#map').removeAttr('style'); // Remove all dynamic style to default one
  $('#delete-user-button').removeClass('active');
  $('#add-user-button').removeClass('active');
  $('#download-button').removeClass('active');
}

/**
 * Activate Add User State. The state when user click 'Add Me' button
 */
function activateAddUserState() {
  // Reset to Default State first
  activateDefaultState();
  // Set current mode to add user mode
  current_mode = ADD_USER_MODE;
  // Set css button to active
  $('#add-user-button').addClass('active');
  //Process here:
  // Change cursor to crosshair
  $('#map').css('cursor', 'crosshair');
  // When location is found, do onLocationFoud
  map.on('locationfound', onLocationFound)
  // Locate map to location found
  map.locate({setView: true, maxZoom: 16});
  //Set Listener map onClick
  map.on('click', onMapClick)
}

/**
 * Activate Download State. The state when user click download data button
 */
function activateDownloadState() {
  // Reset to Default State first
  activateDefaultState();
  // Set mode to delete user mode
  current_mode = DOWNLOAD_MODE;
  // Set css button to active
  $('#download-button').addClass('active');
  //Process here:
  window.open('/download', '_self');
  activateDefaultState();
}
/***-------------------- END OF STATE CONTROL -------------------------**/