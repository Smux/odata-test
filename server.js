const express = require("express");

const app = express();

// Jeden eingehenden Request loggen
app.use((req, res, next) => {
  console.log("METHOD :", req.method);
  console.log("RAW URL:", req.originalUrl);
  next();
});

// Root
app.get("/", (req, res) => {
  res.send("OData mock is running");
});

// OData Service Root
app.get("/odata", (req, res) => {
  res.set("DataServiceVersion", "2.0");

  res.type("application/xml").send(`<?xml version="1.0" encoding="utf-8"?>
<service
    xml:base="${req.protocol}://${req.get("host")}/odata/"
    xmlns="http://www.w3.org/2007/app"
    xmlns:atom="http://www.w3.org/2005/Atom">
  <workspace>
    <atom:title>Mock OData Service</atom:title>
    <collection href="Ships">
      <atom:title>Ships</atom:title>
    </collection>
  </workspace>
</service>`);
});

// Wichtig: Regex wegen $metadata
app.get(/^\/odata\/\$metadata$/, (req, res) => {
  console.log("METADATA requested");

  res.set("DataServiceVersion", "2.0");

  res.type("application/xml").send(`<?xml version="1.0" encoding="utf-8"?>
<edmx:Edmx
    Version="1.0"
    xmlns:edmx="http://schemas.microsoft.com/ado/2007/06/edmx">

  <edmx:DataServices
      m:DataServiceVersion="2.0"
      xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata">

    <Schema
        Namespace="Mock"
        xmlns="http://schemas.microsoft.com/ado/2008/09/edm">

      <EntityType Name="Ship">
        <Key>
          <PropertyRef Name="ID"/>
        </Key>

        <Property
            Name="ID"
            Type="Edm.Int32"
            Nullable="false"/>

        <Property
            Name="ShipName"
            Type="Edm.String"
            Nullable="true"/>
      </EntityType>

      <EntityContainer
          Name="MockEntities"
          m:IsDefaultEntityContainer="true">

        <EntitySet
            Name="Ships"
            EntityType="Mock.Ship"/>

      </EntityContainer>

    </Schema>

  </edmx:DataServices>
</edmx:Edmx>`);
});

app.get("/odata/Ships", (req, res) => {
  console.log("----------- ODATA REQUEST -----------");
  console.log("RAW URL :", req.originalUrl);
  console.log("QUERY   :", req.query);
  console.log("FILTER  :", req.query["$filter"]);
  console.log("-------------------------------------");

  const baseUrl = `${req.protocol}://${req.get("host")}/odata`;

  res.set("DataServiceVersion", "2.0");
  res.type("application/atom+xml").send(`<?xml version="1.0" encoding="utf-8"?>
<feed
  xml:base="${baseUrl}/"
  xmlns="http://www.w3.org/2005/Atom"
  xmlns:d="http://schemas.microsoft.com/ado/2007/08/dataservices"
  xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata">

  <id>${baseUrl}/Ships</id>
  <title type="text">Ships</title>
  <updated>2026-09-18T00:00:00Z</updated>

  <entry>
    <id>${baseUrl}/Ships(1)</id>

    <title type="text"></title>

    <updated>2026-09-18T00:00:00Z</updated>

    <category
      term="Mock.Ship"
      scheme="http://schemas.microsoft.com/ado/2007/08/dataservices/scheme" />

    <content type="application/xml">
      <m:properties>
        <d:ID m:type="Edm.Int32">1</d:ID>
        <d:ShipName>Test</d:ShipName>
      </m:properties>
    </content>

  </entry>

</feed>`);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
