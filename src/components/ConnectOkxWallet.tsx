import React, { useState, useEffect } from "react";
import WebApp from "@twa-dev/sdk";
import {
  Wallet,
  OKXTonConnect,
  OKXConnectError,
  OKX_CONNECT_ERROR_CODES,
  Account,
} from "@okxconnect/tonsdk";
import { Button } from "./styled/styled";

const OkxConnectButton = () => {
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState("");

  const okxTonConnect: any = new OKXTonConnect({
    metaData: {
      name: "Red pocket",
      icon: "../../public/red-pocket.jpg",
    },
  });

  const handleConnect = async () => {
    setLoading(true);
    try {
      const result = await okxTonConnect.connect({
        tonProof: "signmessage",
        redirect: "tg://resolve",
        openUniversalLink: true,
      });
      WebApp.openTelegramLink(result);
    } catch (error) {
      if (error instanceof OKXConnectError) {
        if (error.code === OKX_CONNECT_ERROR_CODES.USER_REJECTS_ERROR) {
          alert("User reject");
        } else if (
          error.code === OKX_CONNECT_ERROR_CODES.ALREADY_CONNECTED_ERROR
        ) {
          alert("Already connected");
        } else {
          alert("Unknown error happened");
        }
      } else {
        alert("Unknown error happened");
      }
    } finally {
      setLoading(false);
    }
  };

  const getWalletInfo = async () => {
    if (okxTonConnect) {
      const account: Account = okxTonConnect?.account();
      if (account) {
        setAddress(account.address);
        setConnected(true);
      }
    }
  };

  useEffect(() => {
    const restoreConnection = async () => {
      try {
        await okxTonConnect.restoreConnection();
        getWalletInfo();
      } catch (error) {
        console.log("Không có kết nối nào cần khôi phục");
      }
    };
    restoreConnection();
  }, []);

  return (
    <div>
      {connected ? (
        <div>
          <p>Đã kết nối với địa chỉ: {address}</p>
        </div>
      ) : (
        <Button onClick={handleConnect} disabled={loading}>
          {loading ? "Loading..." : "Connect OKX Wallet"}
        </Button>
      )}
    </div>
  );
};

export default OkxConnectButton;
