const mongoose = require("mongoose");
const List = require("./list");
const LocaleSchema = require("./locale");

/**
 * Represents a list of distribution service providers in the system
 */
const DigitalDistributorsList = new mongoose.Schema(
  {
    name: {
      type: String,
      api: {
        type: "string",
      },
    },

    icon: {
      type: String,
      api: {
        type: "string",
      },
    },

    localizedName: {
      type: LocaleSchema,
      api: {
        type: "object",
        properties: {
          fr: { type: "string" },
          en: { type: "string" },
        },
      },
    },

    domains: {
      type: [String],
      api: {
        type: "array",
        items: {
          type: "string",
        },
      },
    },

    markets: {
      type: [String],
      api: {
        type: "array",
        items: {
          type: "string",
        },
      },
    },

    streaming: {
      type: Boolean,
      api: {
        type: "boolean",
      },
    },

    download: {
      type: Boolean,
      api: {
        type: "boolean",
      },
    },

    other: {
      type: Boolean,
      api: {
        type: "boolean",
      },
    },

    blockchain: {
      type: Boolean,
      api: {
        type: "boolean",
      },
    },
  },
  { discriminatorKey: "type" }
);

DigitalDistributorsList.methods.setFields = function (body) {
  const fields = [
    "name",
    "icon",
    "localizedName",
    "domains",
    "markets",
    "streaming",
    "download",
    "other",
    "blockchain",
  ];
  for (let field in fields.concat(List.getFields())) {
    if (body[field]) this[field] = body[field];
  }
};

module.exports = List.discriminator(
  "digital-distributors",
  DigitalDistributorsList
);
