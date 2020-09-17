'use strict';

/**
 * Middleware ajoutant la possibilité d'ajouter des paramètres custom sans conflit sur la requête.
 */
module.exports = id => function(req, res, next) {
  if (!req || typeof req !== 'object') return;

  const s = id ? Symbol.for(id) : Symbol();
  req[s] = {};

  /**
   * Add a parameter
   * @param name of the key
   * @param value
   * @returns {*} this
   */
  req.setPrm = function(name, value) {
    this[s][name] = value;
    return this;
  };
  /**
   * @param names the path to the parameter
   * @returns {*|undefined} the value or undefined if it doesn't exist
   */
  req.getPrm = function(...names) {
    let custom = this[s][names[0]];
    for(let i = 1; i < names.length; i++) {
      custom = custom && custom[names[i]];
    }
    return custom;
  };
  /**
   * Suppression d'un paramètre
   * @param name le nom de la clé qui doit être supprimée
   * @returns {*} valeur du paramètre supprimé
   */
  req.deletePrm = function(name) {
    const value = this[s][name];
    value && delete this[s][name];
    return value;
  };
  /**
   * Test si un paramètre existe
   * @param name le nom de la clé qui doit être trouvée
   * @returns {boolean} true si le paramètre existe
   */
  req.hasPrm = function(name) {
    return !!this[s][name];
  };
  typeof next === 'function' && next();
};