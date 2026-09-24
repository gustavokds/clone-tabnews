import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  const dbVersion = await database.query("SHOW server_version;");
  const dbMaxConnections = await database.query("SHOW max_connections;");

  const databaseName = process.env.POSTGRES_DB;
  const dbOpenedConnections = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });

  response.status(200).json({ 
    updated_at: updatedAt,
    dependencies: {
      database: {
        max_connections: parseInt(dbMaxConnections.rows[0].max_connections),
        opened_connections: dbOpenedConnections.rows[0].count,
        version: dbVersion.rows[0].server_version
      }
    }
  });
}

export default status;
