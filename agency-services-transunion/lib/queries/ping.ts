export const createPing = (): string => {
  const xml = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:con="https://consumerconnectws.tui.transunion.com/">
  <soapenv:Header/>
  <soapenv:Body>
	<con:Ping/>
  </soapenv:Body>
</soapenv:Envelope>
  `;
  return xml;
};
