module.exports = {

  function PushMessage(alert, payload) {
    this.expiry = Math.floor(Date.now() / 1000) + 3600; // Default Expiry in 1 hour.
    this.badge = 3;
    this.sound = 'ping.aiff';
    this.alert = "\uD83D\uDCE7 ".concat(alert);
    this.payload = payload;
  }

};
