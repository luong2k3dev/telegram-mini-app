import React, { useEffect, useState } from "react";
import { OKXConnectError, OKXTonConnectUI, Wallet } from "@okxconnect/ui";
import { THEME } from "@tonconnect/ui-react";
import { Button } from "./styled/styled";
import { Address } from "ton-core";

const ConnectOKX3 = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletInfo, setWalletInfo] = useState("");
  const [okxUI, setOKkUI] = useState<OKXTonConnectUI | null>(null);

  const connectOKXWallet = async () => {
    try {
      if (okxUI) await okxUI.openModal();
    } catch (error) {
      console.error("Lỗi kết nối OKX:", error);
    }
  };

  const disconnectOKXWallet = () => {
    try {
      if (okxUI) {
        okxUI.disconnect();
        setIsConnected(false);
        setWalletInfo("");
      }
    } catch (error) {
      console.error("Lỗi ngắt kết nối OKX:", error);
    }
  };

  useEffect(() => {
    if (!okxUI) {
      const okxTonConnectUI = new OKXTonConnectUI({
        dappMetaData: {
          name: "Red pocket",
          icon: "https://telegram-mini-1u27u2llw-luong-tus-projects.vercel.app/red-pocket.png",
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
      setOKkUI(okxTonConnectUI);
    }
  }, [okxUI]);

  useEffect(() => {
    if (okxUI) {
      const unsubscribe = okxUI.onStatusChange(
        (walletInfo: Wallet | null) => {
          console.log("Connection status:", walletInfo);
          if (walletInfo) {
            const rawAddress = walletInfo?.account.address || "";
            const address = Address.parseRaw(rawAddress).toString({
              testOnly: false,
              bounceable: false,
            });
            setIsConnected(true);
            setWalletInfo(address);
          }
        },
        (err: OKXConnectError) => {
          console.error("Connection status:", err);
        }
      );
      return () => {
        unsubscribe?.();
      };
    }
  }, [okxUI]);

  return (
    <div>
      {!isConnected ? (
        <Button onClick={connectOKXWallet}>Connect OKX</Button>
      ) : (
        <div>
          <Button disabled>{walletInfo}</Button>&nbsp;&nbsp;
          <Button onClick={disconnectOKXWallet}>Disconnect OKX</Button>
        </div>
      )}
    </div>
  );
};

export default ConnectOKX3;
