const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Allowed Hostnames
const allowedHostnames = ["127.0.0.1", "alifmahmud.com"];

// Middleware: Domain Check for /files
app.use("/files", (req, res, next) => {
  const origin = req.get("origin") || req.get("referer") || "";
  let hostname = "";

  try {
    hostname = new URL(origin).hostname;
  } catch (err) {
    hostname = "";
  }

  if (hostname.startsWith("www.")) {
    hostname = hostname.slice(4);
  }

  if (hostname === "127.0.0.1") {
    hostname = "127.0.0.1";
  }

  const domainAllowed = allowedHostnames.includes(hostname);

  if (domainAllowed) {
    return next();
  } else {
    return res.status(403).sendFile(path.join(__dirname, "public", "403.html"));
  }
});

// Static Serving
app.use(express.static(path.join(__dirname, "public")));
app.use("/files", express.static(path.join(__dirname, "files")));

// Home Page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
