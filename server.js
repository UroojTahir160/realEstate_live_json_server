// JSON Server module
const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");

// Make sure to use the default middleware
const middlewares = jsonServer.defaults();

server.use(middlewares);
// Add this before server.use(router)

// Define a custom route for case-insensitive search
server.get("/realEstateListing", (req, res) => {
  const { q } = req.query;

  if (!q) {
    // If no search query is provided, return all data
    res.jsonp(router.db.get("realEstateListing").value());
  } else {
    // Perform case-insensitive search on the 'title' field
    const searchTerm = q.toLowerCase();
    const results = router.db
      .get("realEstateListing")
      .filter((item) => item.address.toLowerCase().includes(searchTerm))
      .value();

    res.jsonp(results);
  }
});

server.use(
 // Add custom route here if needed
 jsonServer.rewriter({
  "/*": "/$1",
 })
);

server.use(router);
// Listen to port
server.listen(3333, () => {
 console.log("JSON Server is running");
});

// Export the Server API
module.exports = server;