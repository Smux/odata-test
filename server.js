const express = require("express");

const app = express();

app.get("/odata/$metadata", (req, res) => {
  res.type("application/xml").send(`<?xml version="1.0" encoding="utf-8"?>
<edmx:Edmx Version="1.0"
    xmlns:edmx="http://schemas.microsoft.com/ado/2007/06/edmx">
  <edmx:DataServices
      m:DataServiceVersion="2.0"
      xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata">
    <Schema Namespace="Mock"
        xmlns="http://schemas.microsoft.com/ado/2008/09/edm">

      <EntityType Name="Ship">
        <Key>
          <PropertyRef Name="ID"/>
        </Key>
        <Property Name="ID" Type="Edm.Int32" Nullable="false"/>
        <Property Name="ShipName" Type="Edm.String"/>
      </EntityType>

      <EntityContainer Name="MockEntities"
          m:IsDefaultEntityContainer="true">
        <EntitySet Name="Ships"
            EntityType="Mock.Ship"/>
      </EntityContainer>

    </Schema>
  </edmx:DataServices>
</edmx:Edmx>`);
});

app.get("/odata/Ships", (req, res) => {
  console.log("RAW URL:", req.originalUrl);
  console.log("FILTER:", req.query["$filter"]);

  res.json({
    d: {
      results: [
        {
          __metadata: {
            type: "Mock.Ship"
          },
          ID: 1,
          ShipName: "Test"
        }
      ]
    }
  });
});

app.get("/", (req, res) => {
  res.send("OData mock is running");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
