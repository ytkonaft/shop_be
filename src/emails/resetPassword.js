import mjml2html from "mjml";

/*
  Compile an mjml string
*/
const htmlOutput = mjml2html(
  `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        logo

        <mj-divider border-color="#F45E43"></mj-divider>

        <mj-text font-size="20px" color="#F45E43" font-family="helvetica">Hello World</mj-text>

      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`,
  options
);
