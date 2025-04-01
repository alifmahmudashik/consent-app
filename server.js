const express = require("express");
const path = require("path");

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

  if (req.path.startsWith("/files") || domainAllowed) {
    return next();
  } else {
    return res.status(403).json({ message: "Access Denied: Domain not allowed." });
  }
});

// Serve JS & CSS
app.use("/files", express.static(path.join(__dirname, "files")));

// Home route
app.get("/", (req, res) => {
  res.send("Domain Protected JS + Files are running.");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
