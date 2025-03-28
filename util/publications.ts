import { readFile } from "fs/promises";

import { Cite, plugins } from "@citation-js/core";
require("@citation-js/plugin-bibtex");
require("@citation-js/plugin-csl");

export async function publications() {
  const entries = await readFile("public/pubs.bib", "utf8");
  const bib = new Cite(entries);
  const bibliography = bib.format("bibliography", {
    asEntryArray: true,
    template: "acm",
    lang: "en-US",
  });
  return bibliography;
}

let config = plugins.config.get("@csl");

const lncsTemplate = `<?xml version="1.0" encoding="utf-8"?>
<style xmlns="http://purl.org/net/xbiblio/csl" class="in-text" version="1.0" demote-non-dropping-particle="sort-only" default-locale="en-US">
  <info>
    <title>Springer - Lecture Notes in Computer Science</title>
    <title-short>Springer LNCS</title-short>
    <id>http://www.zotero.org/styles/springer-lecture-notes-in-computer-science</id>
    <link href="http://www.zotero.org/styles/springer-lecture-notes-in-computer-science" rel="self"/>
    <link href="http://www.springer.com/computer/lncs?SGWID=0-164-6-793341-0" rel="documentation"/>
    <author>
      <name>Ammar Memari</name>
      <email>memari@wi-ol.de</email>
    </author>
    <contributor>
      <name>Mikko Ronkko</name>
    </contributor>
    <category citation-format="numeric"/>
    <category field="engineering"/>
    <updated>2019-09-25T13:54:37+00:00</updated>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
  </info>
  <locale xml:lang="en">
    <terms>
      <term name="accessed">last accessed</term>
    </terms>
  </locale>
  <macro name="author">
    <group>
      <names variable="author">
        <name name-as-sort-order="all" sort-separator=", " initialize-with="." delimiter=", " delimiter-precedes-last="always"/>
        <label form="short" prefix=" " strip-periods="true"/>
        <substitute>
          <names variable="editor"/>
        </substitute>
      </names>
    </group>
  </macro>
  <macro name="editor">
    <names variable="editor">
      <name initialize-with="." delimiter=", " and="text" name-as-sort-order="all" sort-separator=", "/>
      <label form="short" prefix=" (" suffix=")"/>
    </names>
  </macro>
  <macro name="title">
    <choose>
      <if type="bill book graphic legal_case legislation motion_picture report song" match="any">
        <text variable="title"/>
      </if>
      <else>
        <text variable="title"/>
      </else>
    </choose>
  </macro>
  <macro name="publisher">
    <text variable="publisher"/>
    <text variable="publisher-place" prefix=", "/>
  </macro>
  <macro name="page">
    <group>
      <label variable="page" form="short" suffix=" "/>
      <text variable="page"/>
    </group>
  </macro>
  <citation et-al-min="3" et-al-use-first="1" collapse="citation-number">
    <sort>
      <key variable="citation-number"/>
    </sort>
    <layout prefix="[" suffix="]" delimiter=", ">
      <text variable="citation-number"/>
    </layout>
  </citation>
  <bibliography entry-spacing="0" second-field-align="flush">
    <layout suffix=".">
      <text variable="citation-number" suffix="."/>
      <text macro="author" suffix=": "/>
      <choose>
        <if type="bill book graphic legal_case legislation motion_picture report song" match="any">
          <group delimiter=" ">
            <text macro="title" suffix="."/>
            <text macro="publisher"/>
            <date variable="issued">
              <date-part name="year" prefix="(" suffix=")"/>
            </date>
          </group>
        </if>
        <else-if type="article-journal">
          <group delimiter=" ">
            <text macro="title" suffix="."/>
            <text variable="container-title" form="short" suffix="."/>
            <text variable="volume" suffix=","/>
            <text variable="page"/>
            <date variable="issued">
              <date-part name="year" prefix="(" suffix=")"/>
            </date>
          </group>
        </else-if>
        <else-if type="chapter paper-conference" match="any">
          <group delimiter=" ">
            <text macro="title" suffix="."/>
            <choose>
              <if variable="container-title">
                <text term="in" text-case="capitalize-first" suffix=": "/>
                <text macro="editor" suffix=" "/>
                <group delimiter=". ">
                  <text variable="container-title"/>
                  <text macro="page"/>
                  <text macro="publisher"/>
                </group>
              </if>
              <else>
                <text term="presented at" text-case="capitalize-first" suffix=" "/>
                <text variable="event"/>
                <text variable="event-place" prefix=", "/>
                <date variable="issued" prefix=" ">
                  <date-part name="month" suffix=" "/>
                  <date-part name="day" suffix=" "/>
                </date>
              </else>
            </choose>
            <date variable="issued">
              <date-part name="year" prefix="(" suffix=")"/>
            </date>
          </group>
        </else-if>
        <else-if type="webpage post-weblog post" match="any">
          <group delimiter=", ">
            <text macro="title"/>
            <text variable="URL"/>
            <group delimiter=" ">
              <text term="accessed"/>
              <date variable="accessed">
                <date-part name="year"/>
                <date-part name="month" form="numeric-leading-zeros" prefix="/"/>
                <date-part name="day" form="numeric-leading-zeros" prefix="/"/>
              </date>
            </group>
          </group>
        </else-if>
        <else-if type="speech">
          <group delimiter=" ">
            <text macro="title" suffix="."/>
            <text variable="event" suffix="."/>
            <text variable="event-place" prefix=", "/>
            <date variable="issued">
              <date-part name="year" prefix="(" suffix=")"/>
            </date>
          </group>
        </else-if>
        <else>
          <group delimiter=", ">
            <text macro="title"/>
            <text variable="URL"/>
            <date variable="issued">
              <date-part name="year" prefix="(" suffix=")"/>
            </date>
          </group>
        </else>
      </choose>
      <text variable="DOI" prefix=". https://doi.org/"/>
    </layout>
  </bibliography>
</style>`;

config.templates.add("acm", lncsTemplate);