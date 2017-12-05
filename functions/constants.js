/**
 * List of intents in dialogflow
 */
module.exports = Object.freeze({
    // Welcome and fallback intent
    WELCOME_INTENT : 'input.welcome',
    DEFAULT_FALL_BACK_INTENT : 'input.unknown',

    // Location intents
    LOCATION_ADD : 'location.add',
    LOCATION_LIST : 'location.list',
    LOCATION_REMOVE : 'location.remove',
    LOCATION_UPDATE : 'location.update',

    // Item intents
    ITEM_ADD : 'item.add',
    ITEM_LIST : 'item.list',
    ITEM_REMOVE : 'item.remove',
    ITEM_UPDATE : 'item.update',

    // Expiration intents
    EXPIRATION_ADD : 'expiration.add',
    EXPIRATION_LIST : 'expiration.list',
    EXPIRATION_REMOVE : 'expiration.remove',
    EXPIRATION_UPDATE : 'expiration.update',

    // Cart Intents
    CART_ADD : 'cart.add',
    CART_LIST : 'cart.list',
    CART_REMOVE : 'cart.remove',
    CART_UPDATE : 'cart.update',
    CART_PURCHASE : 'cart.purchase',

    // Permission Intents
    REQUEST_PERMISSION_ACTION : 'permissions.request',
    SAY_NAME_ACTION : 'permissions.sayname'
});