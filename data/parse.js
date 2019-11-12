var GoogleSpreadsheet = require("google-spreadsheet");
var turf = require("turf");
var fs = require("fs");

var readSpreadsheet = (key, sheetNo, next) => {
  var doc = new GoogleSpreadsheet(key);

  doc.getInfo((e, info) => {
    if (e) {
      next([]);
    }
    const worksheet = info.worksheets[sheetNo];
    worksheet.getRows((e, rows) => {
      if (e) {
        next([]);
      }
      next(
        rows.map(row => {
          delete row["_xml"];
          delete row["_links"];
          delete row["save"];
          delete row["del"];
          const o = {};
          Object.keys(row).forEach(k => (o[k] = row[k]));
          return o;
        })
      );
    });
  });
};

const data = [];
const attrsToTransfer = ["id", "placename"];
readSpreadsheet("1yYLd2ARWbyPxH9m3ZD7mYnVJS0UArv_pTav5nP1T2NE", 0, rows => {
  readSpreadsheet(
    "13eVorFf7J9R8YzO7TmJRVLzIIwRJS737r7eFbH1boyE",
    0,
    sourceRows => {
      readSpreadsheet(
        "13eVorFf7J9R8YzO7TmJRVLzIIwRJS737r7eFbH1boyE",
        1,
        textsRows => {
          // parsing list of sources
          const sources = [];
          sourceRows
            .filter(s => s.id)
            .forEach(sourceRow => {
              sources.push({
                id: sourceRow.id,
                name: sourceRow.shortname
              });
            });

          textsRows
            .filter(s => s.id)
            .forEach(sourceRow => {
              sources.push({
                id: sourceRow.id,
                name: sourceRow.shortname
              });
            });

          rows.forEach(row => {
            if (row.placename) {
              const dat = {};

              // getting source names for each row
              const sourceIds = [
                ...new Set(
                  row.primarysource.split("#").map(s => s.split(":")[0])
                )
              ];
              const rowSources = sourceIds.map(id =>
                sources.find(s => s.id === id)
              );
              const sourceNames = rowSources.filter(s => s).map(s => s.name);
              sourceNames.sort((a, b) => (a > b ? 1 : -1));

              dat.sources = sourceNames;

              attrsToTransfer.forEach(a => {
                dat[a] = row[a];
              });
              const periods = [
                { id: "period1", fn: ys => ys.some(y => y < 1210) },
                { id: "period2", fn: ys => ys.some(y => y < 1220 && y > 1209) },
                { id: "period3", fn: ys => ys.some(y => y < 1230 && y > 1219) },
                { id: "period4", fn: ys => ys.some(y => y > 1229) },
                { id: "period0", fn: ys => ys.length === 0 }
              ];

              dat.years = row.yearslist
                .split(", ")
                .map(s => parseFloat(s))
                .filter(s => s);

              periods.forEach(period => {
                dat[period.id] = period.fn(dat.years);
              });

              dat.geo =
                row.ycoordinates && row.xcoordinates
                  ? turf.point([
                      parseFloat(row.ycoordinates),
                      parseFloat(row.xcoordinates)
                    ])
                  : false;
              data.push(dat);
            }
          });

          fs.writeFile("./data/data.json", JSON.stringify(data), () => {
            console.log("data saved");
          });
        }
      );
    }
  );
});
