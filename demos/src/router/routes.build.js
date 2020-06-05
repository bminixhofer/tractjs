const routeData = require("./routes.json");
const fs = require("fs");

routeData.forEach((route) => {
    const name = route.path.replace(/\W/, "");

    if (name.length > 0) {
        fs.createReadStream("dist/index.html").pipe(fs.createWriteStream(`dist/${name}.html`));
    }
});
