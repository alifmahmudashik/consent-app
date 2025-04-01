const express = require("express");
const path = require("path");
const geoip = require("geoip-lite");

const app = express();
const PORT = process.env.PORT || 3000;

// Allowed Hostnames (without www)
const allowedHostnames = [
  "127.0.0.1",  // Allow localhost (with any port)
  "alifmahmud.com"
];

// Middleware: Domain Check
app.use((req, res, next) => {
  const origin = req.get("origin") || req.get("referer") || "";
  let hostname = "";

  try {
    hostname = new URL(origin).hostname;
  } catch (err) {
    hostname = "";
  }

  // Remove 'www.' from hostname if it exists
  if (hostname.startsWith("www.")) {
    hostname = hostname.slice(4);
  }

  // Allow any port for localhost
  if (hostname === "127.0.0.1") {
    hostname = "127.0.0.1";
  }

  const domainAllowed = allowedHostnames.includes(hostname);

  if (req.path.startsWith("/location") || domainAllowed) {
    return next();
  } else {
    return res.status(403).json({ message: "Access Denied: Domain not allowed." });
  }
});

// Serve JS & CSS
app.use("/files", express.static(path.join(__dirname, "files")));

// Geolocation API
app.get("/location", (req, res) => {
  const ip = req.query.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const geo = geoip.lookup(ip);
  res.json({
    ip: ip,
    country: geo ? geo.country : null,
    city: geo ? geo.city : null,
    region: geo ? geo.region : null,
  });
});

// Home route
app.get("/", (req, res) => {
  res.send("Domain Protected JS + Geo API is running.");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
