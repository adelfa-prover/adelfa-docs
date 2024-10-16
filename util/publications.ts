import { readFile } from "fs/promises";

const { Cite, plugins } = require("@citation-js/core");
require("@citation-js/plugin-bibtex");
require("@citation-js/plugin-csl");

const acmTemplate = `<?xml version="1.0" encoding="utf-8"?>
<style xmlns="http://purl.org/net/xbiblio/csl" class="in-text" version="1.0" demote-non-dropping-particle="sort-only" default-locale="en-US">
  <info>
    <title>ACM SIG Proceedings ("et al." for 3+ authors)</title>
    <id>http://www.zotero.org/styles/acm-sig-proceedings</id>
    <link href="http://www.zotero.org/styles/acm-sig-proceedings" rel="self"/>
    <link href="https://www.acm.org/publications/authors/reference-formatting" rel="documentation"/>
    <author>
      <name>Naeem Esfahani</name>
      <email>nesfaha2@gmu.edu</email>
      <uri>http://mason.gmu.edu/~nesfaha2/</uri>
    </author>
    <contributor>
      <name>Chris Horn</name>
      <email>chris.horn@securedecisions.com</email>
    </contributor>
    <contributor>
      <name>Patrick O'Brien</name>
    </contributor>
    <category citation-format="numeric"/>
    <category field="science"/>
    <category field="engineering"/>
    <updated>2017-07-15T11:28:14+00:00</updated>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
  </info>
  <macro name="author">
    <choose>
      <if type="webpage">
        <text variable="title" suffix=":"/>
      </if>
      <else>
        <names variable="author">
          <name name-as-sort-order="all" and="text" sort-separator=", " initialize-with="." delimiter-precedes-last="never" delimiter=", "/>
          <label form="short" prefix=" "/>
          <substitute>
            <names variable="editor"/>
            <names variable="translator"/>
          </substitute>
        </names>
      </else>
    </choose>
  </macro>
  <macro name="editor">
    <names variable="editor">
      <name initialize-with="." delimiter=", " and="text"/>
      <label form="short" prefix=", "/>
    </names>
  </macro>
  <macro name="access">
    <choose>
      <if type="article-journal" match="any">
        <text variable="DOI" prefix=". DOI:https://doi.org/"/>
      </if>
    </choose>
  </macro>
  <citation collapse="citation-number">
    <sort>
      <key variable="citation-number"/>
    </sort>
    <layout prefix="[" suffix="]" delimiter=", ">
      <text variable="citation-number"/>
    </layout>
  </citation>
  <bibliography entry-spacing="0" second-field-align="flush" et-al-min="3" et-al-use-first="1">
    <sort>
      <key macro="author"/>
      <key variable="title"/>
    </sort>
    <layout suffix=".">
      <text variable="citation-number" prefix="[" suffix="]"/>
      <text macro="author" suffix=" "/>
      <date variable="issued" suffix=". ">
        <date-part name="year"/>
      </date>
      <choose>
        <if type="paper-conference">
          <group delimiter=". ">
            <text variable="title"/>
            <group delimiter=" ">
              <text variable="container-title" font-style="italic"/>
              <group delimiter=", ">
                <group delimiter=", " prefix="(" suffix=")">
                  <text variable="publisher-place"/>
                  <date variable="issued">
                    <date-part name="month" form="short" suffix=" "/>
                    <date-part name="year"/>
                  </date>
                </group>
                <text variable="page"/>
              </group>
            </group>
          </group>
        </if>
        <else-if type="article-journal">
          <group delimiter=". ">
            <text variable="title"/>
            <text variable="container-title" font-style="italic"/>
            <group delimiter=", ">
              <text variable="volume"/>
              <group delimiter=" ">
                <text variable="issue"/>
                <date variable="issued" prefix="(" suffix=")">
                  <date-part name="month" form="short" suffix=" "/>
                  <date-part name="year"/>
                </date>
              </group>
              <text variable="page"/>
            </group>
          </group>
        </else-if>
        <else-if type="patent">
          <group delimiter=". ">
            <text variable="title"/>
            <text variable="number"/>
            <date variable="issued">
              <date-part name="month" form="short" suffix=" "/>
              <date-part name="day" suffix=", "/>
              <date-part name="year"/>
            </date>
          </group>
        </else-if>
        <else-if type="thesis">
          <group delimiter=". ">
            <text variable="title" font-style="italic"/>
            <text variable="archive_location" prefix="Doctoral Thesis #"/>
            <text variable="publisher"/>
          </group>
        </else-if>
        <else-if type="report">
          <group delimiter=". ">
            <text variable="title" font-style="italic"/>
            <text variable="number" prefix="Technical Report #"/>
            <text variable="publisher"/>
          </group>
        </else-if>
        <else-if type="webpage">
          <group delimiter=". ">
            <text variable="URL" font-style="italic"/>
            <date variable="accessed" prefix="Accessed: ">
              <date-part name="year" suffix="-"/>
              <date-part name="month" form="numeric-leading-zeros" suffix="-"/>
              <date-part name="day" form="numeric-leading-zeros"/>
            </date>
          </group>
        </else-if>
        <else-if type="chapter paper-conference" match="any">
          <group delimiter=". ">
            <text variable="title"/>
            <text variable="container-title" font-style="italic"/>
            <text macro="editor"/>
            <text variable="publisher"/>
            <text variable="page"/>
          </group>
        </else-if>
        <else-if type="bill book graphic legal_case legislation motion_picture report song" match="any">
          <group delimiter=". ">
            <text variable="title" font-style="italic"/>
            <text variable="publisher"/>
          </group>
        </else-if>
        <else>
          <group delimiter=". ">
            <text variable="title"/>
            <text variable="container-title" font-style="italic"/>
            <text variable="publisher"/>
          </group>
        </else>
      </choose>
      <text macro="access"/>
    </layout>
  </bibliography>
</style>
`;

let config = plugins.config.get("@csl");
config.templates.add("acm", acmTemplate);

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
