// https://medium.com/@chaitanyamankala/adding-environment-for-ionic-2-3-projects-45ae9d50dcda
var fs = require("fs");

function readWriteSync() {
  let env = process.env.ENV;
  if (!process.env.ENV) {
    env = "uat"; //SETTING DEFAULT ENV AS DEV}
  }

  var data = fs.readFileSync(`src/environments/environment.${env}.ts`, "utf-8");
  fs.writeFileSync("src/environments/environment.ts", data, "utf-8");
  console.log("ENV set to: ", env);
}

readWriteSync();
