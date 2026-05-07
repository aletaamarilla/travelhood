(function () {
  "use strict";

  var DATA_PATH = "/webmcp-data.json";
  var DEFAULT_DATA = {
    site: {
      name: "Travel Hood",
      language: "es-ES",
    },
    travel: {
      audience: "Personas de 20 a 35 anos que quieren viajar en grupo.",
      group: "Grupos reducidos con coordinador en destino.",
      destinations: [],
      tripTypes: [],
    },
  };

  if (typeof navigator === "undefined") return;

  var modelContext = navigator.modelContext;
  if (!modelContext || typeof modelContext.provideContext !== "function") return;

  function asObject(value) {
    if (!value) return {};
    if (typeof value === "string") {
      try {
        var parsed = JSON.parse(value);
        return parsed && typeof parsed === "object" ? parsed : {};
      } catch (error) {
        return {};
      }
    }

    return typeof value === "object" ? value : {};
  }

  function textValue(value) {
    return String(value || "").replace(/\s+/g, " ").trim().slice(0, 280);
  }

  function numberValue(value, fallback, min, max) {
    var number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.min(Math.max(Math.floor(number), min), max);
  }

  function listValue(value) {
    return Array.isArray(value) ? value : [];
  }

  function response(text, structuredContent) {
    return {
      content: [{ type: "text", text: text }],
      structuredContent: structuredContent || {},
    };
  }

  function destinationUrl(destination) {
    return destination.url || (destination.slug ? "/destino/" + destination.slug + "/" : "/viajes/");
  }

  function publicDestination(destination) {
    return {
      name: destination.name,
      slug: destination.slug,
      url: destinationUrl(destination),
      categories: listValue(destination.categories),
      shortDescription: destination.shortDescription || "",
      idealFor: destination.idealFor || "",
      highlights: listValue(destination.highlights),
      hasCoordinator: destination.hasCoordinator !== false,
    };
  }

  function publicTripType(tripType) {
    return {
      name: tripType.name,
      slug: tripType.slug,
      url: tripType.url || (tripType.slug ? "/tipos/" + tripType.slug + "/" : "/viajes/"),
      summary: tripType.summary || "",
      idealProfile: tripType.idealProfile || "",
    };
  }

  function loadData() {
    if (typeof Promise === "undefined") {
      return {
        then: function (callback) {
          callback(DEFAULT_DATA);
        },
      };
    }

    if (typeof fetch !== "function") {
      return Promise.resolve(DEFAULT_DATA);
    }

    return fetch(DATA_PATH, {
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    })
      .then(function (res) {
        if (!res.ok) throw new Error("Travel Hood WebMCP data unavailable");
        return res.json();
      })
      .catch(function () {
        return DEFAULT_DATA;
      });
  }

  function createListDestinationsTool(data) {
    var destinations = listValue(data.travel && data.travel.destinations).map(publicDestination);

    return {
      name: "travelhood.listDestinations",
      description:
        "Lista destinos publicos de Travel Hood. No lee formularios, no recoge datos personales y no reserva plazas.",
      inputSchema: {
        type: "object",
        properties: {
          category: {
            type: "string",
            description: "Categoria opcional, por ejemplo playa, aventura, cultural, naturaleza o nieve.",
          },
          query: {
            type: "string",
            description: "Texto opcional para filtrar por nombre, descripcion o highlights publicos.",
          },
          limit: {
            type: "integer",
            minimum: 1,
            maximum: 30,
            description: "Numero maximo de destinos a devolver.",
          },
        },
        additionalProperties: false,
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
      execute: function (args) {
        var input = asObject(args);
        var category = textValue(input.category).toLowerCase();
        var query = textValue(input.query).toLowerCase();
        var limit = numberValue(input.limit, 12, 1, 30);
        var matches = destinations.filter(function (destination) {
          var categories = listValue(destination.categories).map(function (item) {
            return String(item).toLowerCase();
          });
          var categoryMatches = !category || categories.indexOf(category) !== -1;
          var haystack = [
            destination.name,
            destination.shortDescription,
            destination.idealFor,
            listValue(destination.highlights).join(" "),
          ]
            .join(" ")
            .toLowerCase();
          var queryMatches = !query || haystack.indexOf(query) !== -1;
          return categoryMatches && queryMatches;
        });
        var limited = matches.slice(0, limit);
        var lines = limited.map(function (destination) {
          return "- " + destination.name + " (" + destinationUrl(destination) + ")";
        });
        var text = lines.length
          ? "Destinos publicos de Travel Hood:\n" + lines.join("\n")
          : "No he encontrado destinos publicos con esos filtros.";

        return response(text, {
          count: limited.length,
          totalMatches: matches.length,
          destinations: limited,
        });
      },
    };
  }

  function createSummarizeTripTypesTool(data) {
    var destinations = listValue(data.travel && data.travel.destinations).map(publicDestination);
    var tripTypes = listValue(data.travel && data.travel.tripTypes).map(publicTripType);

    return {
      name: "travelhood.summarizeTripTypes",
      description:
        "Resume tipos de viaje publicos de Travel Hood y, si se pide, ejemplos de destinos relacionados.",
      inputSchema: {
        type: "object",
        properties: {
          includeDestinations: {
            type: "boolean",
            description: "Incluye hasta cuatro destinos publicos de ejemplo por tipo de viaje.",
          },
        },
        additionalProperties: false,
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
      execute: function (args) {
        var input = asObject(args);
        var includeDestinations = input.includeDestinations === true;
        var summaries = tripTypes.map(function (tripType) {
          var related = destinations
            .filter(function (destination) {
              return listValue(destination.categories).indexOf(tripType.slug) !== -1;
            })
            .slice(0, 4);

          return {
            name: tripType.name,
            slug: tripType.slug,
            url: tripType.url,
            summary: tripType.summary,
            idealProfile: tripType.idealProfile,
            destinations: includeDestinations ? related : undefined,
          };
        });
        var lines = summaries.map(function (tripType) {
          var line = "- " + tripType.name + ": " + (tripType.summary || "Tipo de viaje publico.");
          if (includeDestinations && listValue(tripType.destinations).length) {
            line +=
              " Ejemplos: " +
              tripType.destinations
                .map(function (destination) {
                  return destination.name;
                })
                .join(", ") +
              ".";
          }
          return line;
        });

        return response("Tipos de viaje Travel Hood:\n" + lines.join("\n"), {
          tripTypes: summaries,
        });
      },
    };
  }

  function createPrepareWhatsAppMessageTool(data) {
    var destinations = listValue(data.travel && data.travel.destinations).map(publicDestination);
    var tripTypes = listValue(data.travel && data.travel.tripTypes).map(publicTripType);

    function findByNameOrSlug(items, value) {
      var needle = textValue(value).toLowerCase();
      if (!needle) return null;

      return (
        items.find(function (item) {
          return String(item.slug || "").toLowerCase() === needle;
        }) ||
        items.find(function (item) {
          return String(item.name || "").toLowerCase() === needle;
        }) ||
        null
      );
    }

    return {
      name: "travelhood.prepareWhatsAppMessage",
      description:
        "Prepara un borrador de consulta para Travel Hood. No abre WhatsApp, no envia mensajes y no lee formularios.",
      inputSchema: {
        type: "object",
        properties: {
          destination: {
            type: "string",
            description: "Destino publico de interes, por nombre o slug.",
          },
          tripType: {
            type: "string",
            description: "Tipo de viaje publico de interes, por ejemplo aventura o playa.",
          },
          question: {
            type: "string",
            description: "Pregunta breve opcional. Evita incluir datos personales sensibles.",
          },
        },
        additionalProperties: false,
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
      execute: function (args) {
        var input = asObject(args);
        var destination = findByNameOrSlug(destinations, input.destination);
        var tripType = findByNameOrSlug(tripTypes, input.tripType);
        var question = textValue(input.question);
        var lines = ["Hola Travel Hood!"];

        if (destination) {
          lines.push("Me interesa el viaje a " + destination.name + ".");
        } else if (textValue(input.destination)) {
          lines.push("Me interesa un viaje a " + textValue(input.destination) + ".");
        } else {
          lines.push("Me interesa saber mas sobre vuestros viajes en grupo.");
        }

        if (tripType) {
          lines.push("Me encaja especialmente el estilo " + tripType.name + ".");
        } else if (textValue(input.tripType)) {
          lines.push("Me interesa un viaje de tipo " + textValue(input.tripType) + ".");
        }

        lines.push("Me podeis pasar informacion sobre fechas, plazas y precio?");

        if (question) {
          lines.push("Tambien queria preguntar: " + question);
        }

        var draft = lines.join(" ");

        return response(
          "Borrador preparado. Revisalo y envialo manualmente desde WhatsApp u otro canal si te encaja:\n\n" +
            draft,
          {
            draftMessage: draft,
            sendsMessages: false,
            opensWhatsApp: false,
          }
        );
      },
    };
  }

  function registerTools(data) {
    var safeData = data && typeof data === "object" ? data : DEFAULT_DATA;
    var tools = [
      createListDestinationsTool(safeData),
      createSummarizeTripTypesTool(safeData),
      createPrepareWhatsAppMessageTool(safeData),
    ];
    var context = {
      name: "Travel Hood public tools",
      description:
        "Herramientas WebMCP de bajo riesgo con informacion publica de Travel Hood. No envian mensajes ni procesan datos personales.",
      tools: tools,
    };

    try {
      var result = modelContext.provideContext(context);
      if (result && typeof result.catch === "function") {
        result.catch(function () {});
      }
    } catch (error) {
      return;
    }

    window.__travelhoodWebMcp = {
      registered: true,
      toolNames: tools.map(function (tool) {
        return tool.name;
      }),
    };
  }

  loadData().then(registerTools);
})();
