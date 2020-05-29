const mongoose = require("mongoose");
const List = require("./list");
const LocaleSchema = require("./locale");

/**
 * Represents an entity of musical genres list in the system
 */
const MusicalGenresList = new mongoose.Schema(
  {
    name: {
      type: LocaleSchema,
      api: {
        type: "object",
        properties: {
          fr: { type: "string" },
          en: { type: "string" },
        },
      },
    },

    uris: {
      type: [String],
      api: {
        type: "array",
        items: {
          type: "string",
        },
      },
    },

    parents: {
      type: [
        {
          type: String,
          ref: "musical-genres",
        },
      ],
      api: {
        type: "array",
        items: {
          type: "string",
        },
      },
    },
  },
  { discriminatorKey: "type" }
);

MusicalGenresList.methods.setFields = function (body) {
  for (let field in ["name", "uris", "parents", ...List.getFields()]) {
    if (body[field]) this[field] = body[field];
  }
};

module.exports = List.discriminator("musical-genres", MusicalGenresList);
