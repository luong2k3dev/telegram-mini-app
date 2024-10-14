import React, { useEffect, useState } from "react";
import { OKXTonConnectUI, THEME } from "@okxconnect/ui";

const OkxConnectButton = () => {
  const [okxUI, setOkxUI] = useState<any>(null);

  useEffect(() => {
    const okxUIState: any = new OKXTonConnectUI({
      dappMetaData: {
        name: "Red pocket",
        icon: "https://web.telegram.org/2fa85bf1-9c48-470e-95de-d8e848bd53dc",
      },
      buttonRootId: "okx-connect-button",
      actionsConfiguration: {
        returnStrategy: "tg://resolve",
      },
      uiPreferences: {
        theme: THEME.DARK,
      },
      language: "en_US",
      restoreConnection: true,
    });
    setOkxUI(okxUIState);
    console.log("wallet", okxUIState.wallet);
  }, []);

  return <div id="okx-connect-button"></div>;
};

export default OkxConnectButton;
