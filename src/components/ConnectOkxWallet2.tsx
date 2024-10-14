import React, { useEffect, useState } from "react";
import { OKXTonConnectUI, THEME } from "@okxconnect/ui";
import { Button } from "./styled/styled";

const OkxConnectButton = () => {
  const [address, setAddress] = useState("");
  const [connected, setConnected] = useState(false);

  const okxUI: any = new OKXTonConnectUI({
    dappMetaData: {
      name: "Red pocket",
      icon: "https://web.telegram.org/2fa85bf1-9c48-470e-95de-d8e848bd53dc",
    },
    actionsConfiguration: {
      returnStrategy: "tg://resolve",
    },
    uiPreferences: {
      theme: THEME.DARK,
    },
    language: "en_US",
    restoreConnection: true,
  });

  useEffect(() => {
    const restoreConnection = async () => {
      try {
        await okxUI.openModal();
        const wallet = okxUI.wallet;
        const account = okxUI.account;

        if (wallet && account) {
          setAddress(account.address);
          setConnected(true);
        }
      } catch (error) {
        console.log("Không có kết nối nào cần khôi phục");
      }
    };

    restoreConnection();
  }, []);

  const handleConnect = async () => {
    try {
      if (okxUI) {
        // Mở modal kết nối
        await okxUI.openModal();
        const wallet = okxUI.wallet;
        const account = okxUI.account;

        if (wallet && account) {
          setAddress(account.address);
          setConnected(true);
        }
      }
    } catch (error) {
      console.log("Không thể kết nối ví:", error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await okxUI.disconnect();
      setConnected(false);
      setAddress("");
    } catch (error) {
      console.log("Không thể ngắt kết nối:", error);
    }
  };

  return (
    <div>
      {connected ? (
        <div>
          <p>Đã kết nối với địa chỉ: {address}</p>
          <Button onClick={handleDisconnect}>Ngắt kết nối</Button>
        </div>
      ) : (
        <Button onClick={handleConnect}>Kết nối với OKX Wallet</Button>
      )}
    </div>
  );
};

export default OkxConnectButton;
