const rentService = require('../services/rentService');

module.exports = {
  getErrors: async (req, res, next) => {
    try {
      const errors = await rentService.getErrors();
      res.json(errors);
    } catch (error) {
      next(error);
    }
  },

  getDamages: async (req, res, next) => {
    try {
      const damages = await rentService.getDamages();
      res.json(damages);
    } catch (error) {
      next(error);
    }
  },

  getAvailableAutos: async (req, res, next) => {
    try {
      const autos = await rentService.getAvailableAutos();
      res.json(autos);
    } catch (error) {
      next(error);
    }
  }
};