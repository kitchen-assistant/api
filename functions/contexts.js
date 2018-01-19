/**
 * List of intents in dialogflow
 */
module.exports = Object.freeze({
    ADD_CONTEXT : 'add',
    LIST_CONTEXT : 'list',
    REMOVE_CONTEXT : 'remove',
    UPDATE_CONTEXT : 'update',
    PURCHASE_CONTEXT : 'purchase',

    // // DIALOGFLOW CONTEXT PARAMETERS (parameter --> value)
    LOCATION_CONTEXT : 'locations',
    ITEM_CONTEXT : 'items',
    EXPIRATION_CONTEXT : 'expire',
    DATE_CONTEXT : 'date',
    CART_CONTEXT : 'cart',

    // // Update context (same as above)
    LOCATION_TO_UPDATE : 'locationToUpdate',
    ITEM_TO_UPDATE : 'itemToUpdate',
    ITEM_IN_CART_TO_UPDATE : 'cartItemToUpdate',
});